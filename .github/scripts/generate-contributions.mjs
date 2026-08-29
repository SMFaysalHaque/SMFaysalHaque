// Generates a self-hosted GitHub contribution heatmap as SVG (light + dark).
//
// Data source (real contributions only — never fabricated):
//   1. GitHub GraphQL API when GITHUB_TOKEN is set (used by the Actions workflow).
//   2. GitHub's public contributions page as a no-auth fallback (used for local runs).
//
// Output: assets/contributions-light.svg and assets/contributions-dark.svg
//
// No third-party dependencies. Run: node .github/scripts/generate-contributions.mjs

import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const USER = process.env.CONTRIB_USER || "SMFaysalHaque";
const TOKEN = process.env.GITHUB_TOKEN || "";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..");
const OUT_DIR = resolve(ROOT, "assets");

const THEMES = {
  light: {
    levels: ["#ebedf0", "#9be9a8", "#40c463", "#30a14e", "#216e39"],
    text: "#57606a",
    empty_stroke: "rgba(27,31,35,0.06)",
  },
  dark: {
    levels: ["#161b22", "#0e4429", "#006d32", "#26a641", "#39d353"],
    text: "#7d8590",
    empty_stroke: "rgba(240,246,252,0.10)",
  },
};

const LEVEL_ENUM = {
  NONE: 0,
  FIRST_QUARTILE: 1,
  SECOND_QUARTILE: 2,
  THIRD_QUARTILE: 3,
  FOURTH_QUARTILE: 4,
};

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

async function fetchFromGraphQL() {
  const query = `query($login:String!){
    user(login:$login){
      contributionsCollection{
        contributionCalendar{
          totalContributions
          weeks{ contributionDays{ date contributionCount contributionLevel weekday } }
        }
      }
    }
  }`;
  const res = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      Authorization: `bearer ${TOKEN}`,
      "Content-Type": "application/json",
      "User-Agent": USER,
    },
    body: JSON.stringify({ query, variables: { login: USER } }),
  });
  if (!res.ok) throw new Error(`GraphQL HTTP ${res.status}`);
  const json = await res.json();
  if (json.errors) throw new Error(`GraphQL errors: ${JSON.stringify(json.errors)}`);
  const cal = json.data?.user?.contributionsCollection?.contributionCalendar;
  if (!cal) throw new Error("GraphQL returned no contribution calendar");

  const weeks = cal.weeks.map((w) =>
    w.contributionDays.map((d) => ({
      date: d.date,
      count: d.contributionCount,
      level: LEVEL_ENUM[d.contributionLevel] ?? 0,
      weekday: d.weekday,
    }))
  );
  return { weeks, total: cal.totalContributions, source: "GraphQL API" };
}

async function fetchFromPublicPage() {
  const res = await fetch(`https://github.com/users/${USER}/contributions`, {
    headers: { "User-Agent": USER, Accept: "text/html" },
  });
  if (!res.ok) throw new Error(`Public page HTTP ${res.status}`);
  const html = await res.text();

  // Map day id -> contribution count from the accessible tool-tips.
  const counts = {};
  const tipRe = /<tool-tip[^>]*for="(contribution-day-component-\d+-\d+)"[^>]*>([^<]*)<\/tool-tip>/g;
  for (let m; (m = tipRe.exec(html)); ) {
    const text = m[2].trim();
    counts[m[1]] = /^No contributions/i.test(text)
      ? 0
      : parseInt((text.match(/^(\d[\d,]*)\s+contribution/) || [])[1]?.replace(/,/g, "") || "0", 10);
  }

  // Each dated cell: <td ... class="ContributionCalendar-day" ...> with data-date, data-level, id.
  const grid = new Map(); // week -> Map(weekday -> day)
  let maxWeek = 0;
  const cellRe = /<td\b[^>]*class="ContributionCalendar-day"[^>]*>/g;
  for (let c; (c = cellRe.exec(html)); ) {
    const tag = c[0];
    const date = (tag.match(/data-date="([0-9-]+)"/) || [])[1];
    if (!date) continue; // skip empty padding cells
    const level = parseInt((tag.match(/data-level="(\d)"/) || [])[1] || "0", 10);
    const id = (tag.match(/id="(contribution-day-component-(\d+)-(\d+))"/) || [])[1];
    const weekday = parseInt((tag.match(/id="contribution-day-component-(\d+)-\d+"/) || [])[1] || "0", 10);
    const week = parseInt((tag.match(/id="contribution-day-component-\d+-(\d+)"/) || [])[1] || "0", 10);
    if (week > maxWeek) maxWeek = week;
    if (!grid.has(week)) grid.set(week, new Map());
    grid.get(week).set(weekday, { date, count: counts[id] ?? 0, level, weekday });
  }

  const weeks = [];
  let total = 0;
  for (let w = 0; w <= maxWeek; w++) {
    const col = grid.get(w) || new Map();
    const days = [];
    for (let d = 0; d < 7; d++) {
      const day = col.get(d);
      if (day) {
        days.push(day);
        total += day.count;
      }
    }
    if (days.length) weeks.push(days);
  }
  if (!weeks.length) throw new Error("Public page parsed 0 contribution days");
  return { weeks, total, source: "public contributions page" };
}

function esc(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function renderSVG({ weeks, total }, themeName) {
  const t = THEMES[themeName];
  const CELL = 11;
  const GAP = 3;
  const PITCH = CELL + GAP; // 14
  const PAD_L = 30; // weekday labels
  const PAD_T = 22; // month labels
  const PAD_B = 26; // total + legend
  const PAD_R = 8;

  const cols = weeks.length;
  const gridW = cols * PITCH - GAP;
  const gridH = 7 * PITCH - GAP;
  const W = PAD_L + gridW + PAD_R;
  const H = PAD_T + gridH + PAD_B;

  const rects = [];
  const monthLabels = [];
  let lastMonth = -1;

  weeks.forEach((week, wi) => {
    // Month label when a new month first appears (with spacing so labels don't collide).
    const firstDated = week.find((d) => d && d.date);
    if (firstDated) {
      const month = new Date(firstDated.date + "T00:00:00Z").getUTCMonth();
      if (month !== lastMonth) {
        const x = PAD_L + wi * PITCH;
        const prev = monthLabels[monthLabels.length - 1];
        if (!prev || x - prev.x >= 3 * PITCH) {
          monthLabels.push({ x, label: MONTHS[month] });
          lastMonth = month;
        }
      }
    }
    week.forEach((day) => {
      if (!day) return;
      const x = PAD_L + wi * PITCH;
      const y = PAD_T + day.weekday * PITCH;
      const fill = t.levels[day.level] || t.levels[0];
      const title = day.count === 1 ? "1 contribution" : `${day.count} contributions`;
      const strokeAttr = day.level === 0 ? ` stroke="${t.empty_stroke}"` : "";
      rects.push(
        `<rect x="${x}" y="${y}" width="${CELL}" height="${CELL}" rx="2" ry="2" fill="${fill}"${strokeAttr}><title>${title} on ${day.date}</title></rect>`
      );
    });
  });

  const monthEls = monthLabels
    .map((m) => `<text x="${m.x}" y="${PAD_T - 8}" fill="${t.text}" font-size="10">${m.label}</text>`)
    .join("");

  const weekdayEls = [
    { d: 1, label: "Mon" },
    { d: 3, label: "Wed" },
    { d: 5, label: "Fri" },
  ]
    .map(
      (w) =>
        `<text x="0" y="${PAD_T + w.d * PITCH + CELL - 1}" fill="${t.text}" font-size="10">${w.label}</text>`
    )
    .join("");

  // Footer: real total (left) + Less→More legend (right).
  const footerY = PAD_T + gridH + 16;
  const totalEl = `<text x="${PAD_L}" y="${footerY}" fill="${t.text}" font-size="11">${total.toLocaleString(
    "en-US"
  )} contributions in the last year</text>`;

  const legendCell = 10;
  const legendGap = 3;
  const legendCount = t.levels.length; // 5
  const legendW = legendCount * (legendCell + legendGap) - legendGap;
  const lessX = W - PAD_R - legendW - 66;
  const legendRects = t.levels
    .map(
      (fill, i) =>
        `<rect x="${lessX + 30 + i * (legendCell + legendGap)}" y="${footerY - legendCell}" width="${legendCell}" height="${legendCell}" rx="2" ry="2" fill="${fill}"${
          i === 0 ? ` stroke="${t.empty_stroke}"` : ""
        } />`
    )
    .join("");
  const legendEl =
    `<text x="${lessX}" y="${footerY}" fill="${t.text}" font-size="10">Less</text>` +
    legendRects +
    `<text x="${lessX + 30 + legendW + 6}" y="${footerY}" fill="${t.text}" font-size="10">More</text>`;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(
    USER
  )} GitHub contribution graph: ${total} contributions in the last year">
<style>text{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;dominant-baseline:middle;}</style>
${monthEls}
${weekdayEls}
${rects.join("\n")}
${totalEl}
${legendEl}
</svg>
`;
}

async function main() {
  let data;
  if (TOKEN) {
    try {
      data = await fetchFromGraphQL();
    } catch (e) {
      console.warn(`GraphQL fetch failed (${e.message}); falling back to public page.`);
      data = await fetchFromPublicPage();
    }
  } else {
    data = await fetchFromPublicPage();
  }

  mkdirSync(OUT_DIR, { recursive: true });
  for (const theme of Object.keys(THEMES)) {
    const svg = renderSVG(data, theme);
    writeFileSync(resolve(OUT_DIR, `contributions-${theme}.svg`), svg, "utf8");
  }
  console.log(
    `Generated contributions-light.svg + contributions-dark.svg for ${USER} ` +
      `(${data.total} contributions, ${data.weeks.length} weeks) via ${data.source}.`
  );
}

main().catch((e) => {
  console.error("Failed to generate contribution SVGs:", e.message);
  process.exit(1);
});
