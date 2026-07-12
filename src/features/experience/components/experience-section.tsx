"use client";

import type { CSSProperties } from "react";
import { useCallback, useEffect, useRef } from "react";
import { Briefcase } from "lucide-react";

import { Reveal } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/layout/section-heading";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { experiences } from "@/features/experience/data/experience";

type StackCard = {
  key: string;
  icon: typeof Briefcase;
  accent: string;
  iconBg: string;
  title: string;
  meta: string;
  metaColor: string;
  badge: string;
  summary?: string;
};

export function ExperienceSection() {
  const cards: StackCard[] = experiences.map((exp) => ({
    key: exp.company,
    icon: Briefcase,
    accent: "text-violet-500",
    iconBg: "from-violet-500/15 to-sky-400/15",
    title: exp.role,
    meta: `${exp.company} · ${exp.employmentType}`,
    metaColor: "text-violet-500",
    badge: `${exp.startDate} — ${exp.endDate}`,
    summary: exp.summary,
  }));

  const lastIndex = cards.length - 1;

  // Balance every card to the tallest one's height so the stack stays even while
  // showing each summary in full. Text height depends on viewport width, so we
  // clear, measure the natural heights, then apply the max — re-running on resize
  // and once web fonts settle.
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const equalizeHeights = useCallback(() => {
    const els = cardRefs.current.filter((el): el is HTMLDivElement => el !== null);
    if (els.length === 0) return;

    els.forEach((el) => (el.style.minHeight = ""));
    const tallest = Math.max(...els.map((el) => el.offsetHeight));
    els.forEach((el) => (el.style.minHeight = `${tallest}px`));
  }, []);

  useEffect(() => {
    equalizeHeights();
    window.addEventListener("resize", equalizeHeights);
    document.fonts?.ready.then(equalizeHeights).catch(() => {});
    return () => window.removeEventListener("resize", equalizeHeights);
  }, [equalizeHeights]);

  return (
    <section id="experience" className="px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <Reveal>
          <SectionHeading
            eyebrow="Experience"
            title="Where I've worked"
            description="Professional roles that shaped how I build and ship production software."
          />
        </Reveal>

        {/* Sticky stack (all breakpoints): each card pins on scroll and the
            next slides up over it, leaving a strip of the card beneath visible.
            The hold spacer lives OUTSIDE the sticky items — if it were inside the
            last card it would cancel that card's sticky range and it wouldn't pin. */}
        <div className="mt-14">
          {cards.map((card, i) => {
            const Icon = card.icon;
            return (
              <div
                key={card.key}
                // Pins below the sticky navbar; each following card pins a step
                // lower so a strip of the card beneath stays visible. Offsets are
                // tighter on small screens (via responsive `top-`) and roomier on
                // large ones. `--card-index` feeds the per-card step in calc().
                className="sticky top-[calc(5rem_+_var(--card-index)_*_1.75rem)] lg:top-[calc(5.5rem_+_var(--card-index)_*_2rem)]"
                style={{ "--card-index": i, zIndex: i + 1 } as CSSProperties}
              >
                <div className={i === lastIndex ? "" : "pb-6 lg:pb-8"}>
                  <Card
                    ref={(el) => {
                      cardRefs.current[i] = el;
                    }}
                    className="border-border/60 bg-card shadow-xl shadow-black/5 ring-1 ring-border/60 min-h-[13rem]"
                  >
                    <CardContent>
                      <div className="flex items-start gap-4">
                        <span
                          className={`mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${card.iconBg} ${card.accent}`}
                        >
                          <Icon className="size-4" />
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <h3 className="font-semibold">{card.title}</h3>
                            <Badge variant="outline" className="font-normal">
                              {card.badge}
                            </Badge>
                          </div>
                          <p className={`mt-1 text-sm font-medium ${card.metaColor}`}>
                            {card.meta}
                          </p>
                          {card.summary && (
                            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                              {card.summary}
                            </p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            );
          })}

          {/* Hold: keeps the completed stack pinned briefly before the page
              scrolls on. Kept small so the gap before Projects stays tight. */}
          <div aria-hidden className="h-[12vh]" />
        </div>
      </div>
    </section>
  );
}
