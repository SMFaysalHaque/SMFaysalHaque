"use client";

import * as React from "react";
import Link from "next/link";
import {
  motion,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from "motion/react";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Project } from "@/types";

// How long each card stays centered before auto-advancing.
const AUTOPLAY_MS = 4500;
// Tech chips previewed on a card before collapsing into "+N more".
const MAX_VISIBLE_TECH = 4;
// Net pointer travel (px) beyond which a press is treated as a drag, not a
// click. Kept generously above a typical click's incidental jitter so real
// clicks always navigate.
const DRAG_THRESHOLD = 12;

function clamp(v: number, min: number, max: number) {
  return Math.min(Math.max(v, min), max);
}

// Shortest signed distance from `active` to `i` on a ring of `count` cards, so
// the carousel wraps in whichever direction is nearer (true infinite loop).
function ringOffset(i: number, active: number, count: number) {
  let d = i - active;
  const half = count / 2;
  if (d > half) d -= count;
  if (d < -half) d += count;
  return d;
}

interface Placement {
  x: number;
  z: number;
  rotateY: number;
  scale: number;
  opacity: number;
  filter: string;
  y: number;
  zIndex: number;
  pointer: boolean;
}

// Maps a card's ring offset to its resting position in 3D space. Center card is
// sharp, dominant and floating; neighbours recede, shrink, rotate away, blur
// and fade the farther out they sit.
function place(
  offset: number,
  step: number,
  maxVisible: number
): Placement {
  const eff = clamp(offset, -(maxVisible + 1), maxVisible + 1);
  const abs = Math.abs(eff);
  const visible = abs <= maxVisible;

  return {
    x: eff * step,
    z: -abs * 190,
    rotateY: clamp(-eff * 42, -52, 52),
    scale: Math.max(1 - abs * 0.13, 0.6),
    y: abs === 0 ? -10 : 0,
    opacity: visible ? clamp(1 - abs * 0.22, 0, 1) : 0,
    filter: abs === 0 ? "blur(0px)" : `blur(${Math.min(1.4 + (abs - 1) * 2.6, 7)}px)`,
    zIndex: 100 - Math.round(abs * 10),
    pointer: visible,
  };
}

export function ProjectCoverflow({ projects }: { projects: Project[] }) {
  const count = projects.length;
  const reduceMotion = useReducedMotion();

  const [active, setActive] = React.useState(0);
  const [width, setWidth] = React.useState(0);

  const stageRef = React.useRef<HTMLDivElement>(null);

  // ---- Responsive geometry ---------------------------------------------
  // Fall back to a desktop assumption before the first measurement so the
  // server render and first paint don't collapse to zero-width cards.
  const w = width || 1024;
  const maxVisible = w >= 1024 ? 2 : 1;
  const cardW = Math.round(
    w >= 1024
      ? Math.min(w * 0.4, 440)
      : w >= 640
        ? Math.min(w * 0.62, 420)
        : Math.min(w * 0.82, 360)
  );
  const cardH = w >= 1024 ? 366 : w >= 640 ? 392 : 452;
  const step = cardW * 0.6;

  React.useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      setWidth(entry.contentRect.width);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // ---- Cursor tilt (parallax) & live drag ------------------------------
  const tiltX = useSpring(useMotionValue(0), { stiffness: 150, damping: 18 });
  const tiltY = useSpring(useMotionValue(0), { stiffness: 150, damping: 18 });
  const dragX = useSpring(useMotionValue(0), { stiffness: 300, damping: 40 });

  // ---- Interaction / autoplay state ------------------------------------
  const dragging = React.useRef(false);
  const captured = React.useRef(false);
  const dragStarted = React.useRef(false);
  const hovering = React.useRef(false);
  const focused = React.useRef(false);
  const startX = React.useRef(0);
  // Set at pointer-up: was the whole gesture a drag (suppress the click) or a
  // click (let it navigate)? Decided from the final displacement, never
  // latched mid-press, so incidental jitter during a click doesn't block it.
  const moved = React.useRef(false);
  const [paused, setPaused] = React.useState(false);

  const syncPaused = React.useCallback(() => {
    setPaused(hovering.current || dragging.current || focused.current);
  }, []);

  const go = React.useCallback(
    (dir: number) => setActive((a) => ((a + dir) % count + count) % count),
    [count]
  );

  // Autoplay: advances on an interval, halted while hovered, focused, dragging,
  // or when the visitor prefers reduced motion.
  React.useEffect(() => {
    if (paused || reduceMotion || count <= 1) return;
    const id = window.setInterval(() => go(1), AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [paused, reduceMotion, count, go]);

  const resetTilt = React.useCallback(() => {
    tiltX.set(0);
    tiltY.set(0);
  }, [tiltX, tiltY]);

  const handlePointerMove = (e: React.PointerEvent) => {
    if (dragging.current) {
      const dx = e.clientX - startX.current;
      // Once the pointer travels past the threshold, start the live drag:
      // capture the pointer and translate the scene. Capture is deferred to
      // here so a stationary click never gets captured.
      if (dragStarted.current || Math.abs(dx) > DRAG_THRESHOLD) {
        dragStarted.current = true;
        if (!captured.current) {
          stageRef.current?.setPointerCapture?.(e.pointerId);
          captured.current = true;
        }
        dragX.set(clamp(dx, -cardW, cardW) * 0.55);
      }
      return;
    }
    if (reduceMotion || e.pointerType === "touch") return;
    const rect = stageRef.current?.getBoundingClientRect();
    if (!rect) return;
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;
    tiltY.set(nx * 10);
    tiltX.set(-ny * 7);
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    dragging.current = true;
    dragStarted.current = false;
    startX.current = e.clientX;
    syncPaused();
  };

  const endDrag = (e: React.PointerEvent) => {
    if (!dragging.current) return;
    dragging.current = false;
    const dx = e.clientX - startX.current;
    dragX.set(0);
    if (captured.current) {
      stageRef.current?.releasePointerCapture?.(e.pointerId);
      captured.current = false;
    }
    dragStarted.current = false;
    // Classify the finished gesture by its net travel. Anything under the
    // threshold is a click (moved = false) and is allowed to navigate.
    moved.current = Math.abs(dx) > DRAG_THRESHOLD;
    if (moved.current) {
      const threshold = Math.max(cardW * 0.16, 48);
      if (dx <= -threshold) go(1);
      else if (dx >= threshold) go(-1);
    }
    syncPaused();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      go(1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      go(-1);
    }
  };

  if (count === 0) return null;

  const transition = reduceMotion
    ? { duration: 0.25, ease: "easeOut" as const }
    : { type: "spring" as const, stiffness: 240, damping: 30, mass: 0.9 };

  return (
    <div className="select-none">
      {/* Stage ------------------------------------------------------------ */}
      <div
        ref={stageRef}
        role="group"
        aria-roledescription="carousel"
        aria-label="Work experience projects"
        tabIndex={0}
        onKeyDown={handleKeyDown}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onMouseEnter={() => {
          hovering.current = true;
          syncPaused();
        }}
        onMouseLeave={() => {
          hovering.current = false;
          dragging.current = false;
          resetTilt();
          syncPaused();
        }}
        onFocusCapture={() => {
          focused.current = true;
          syncPaused();
        }}
        onBlurCapture={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node)) {
            focused.current = false;
            syncPaused();
          }
        }}
        className="relative mx-auto flex touch-pan-y items-center justify-center overflow-hidden rounded-3xl outline-none focus-visible:ring-2 focus-visible:ring-violet-500/60"
        style={{ height: cardH + 96, perspective: 1300 }}
      >
        {/* Ambient glow pooled behind the active card. */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[70%] w-[52%] -translate-x-1/2 -translate-y-1/2 rounded-[50%] bg-[radial-gradient(ellipse_at_center,color-mix(in_oklab,var(--color-violet-500)_35%,transparent),color-mix(in_oklab,var(--color-sky-500)_12%,transparent)_45%,transparent_72%)] blur-2xl"
        />

        {/* 3D scene: carries the parallax tilt + live drag translation. */}
        <motion.div
          className="relative h-full w-full [transform-style:preserve-3d]"
          style={{ rotateX: tiltX, rotateY: tiltY, x: dragX }}
        >
          {projects.map((project, i) => {
            const offset = ringOffset(i, active, count);
            const p = place(offset, step, maxVisible);
            const isActive = offset === 0;
            const visibleTech = project.tech.slice(0, MAX_VISIBLE_TECH);
            const remaining = project.tech.length - visibleTech.length;
            const live = project.links.find((l) => l.label === "Live");

            return (
              <div
                key={project.slug}
                className="absolute inset-0 flex items-center justify-center [transform-style:preserve-3d]"
                style={{ zIndex: p.zIndex, pointerEvents: p.pointer ? "auto" : "none" }}
                aria-hidden={!isActive}
              >
                <motion.article
                  className="[transform-style:preserve-3d] [backface-visibility:hidden] [will-change:transform,opacity]"
                  style={{ width: cardW, height: cardH }}
                  initial={false}
                  animate={{
                    x: p.x,
                    y: p.y,
                    z: p.z,
                    rotateY: p.rotateY,
                    scale: p.scale,
                    opacity: p.opacity,
                    filter: p.filter,
                  }}
                  transition={transition}
                >
                  <div
                    onClick={() => {
                      // A drag shouldn't count as a click; a click on a side
                      // card just pulls it to the center. The center card only
                      // navigates via its explicit "View project" action.
                      if (moved.current) return;
                      if (!isActive) setActive(i);
                    }}
                    className={cn(
                      // No backdrop-blur here: blurring a translucent surface
                      // forces a full recomposite on every tilt frame, which
                      // freezes the cursor and stalls the CSS gradient. An
                      // opaque card + a glass sheen overlay gives the same look
                      // for free.
                      "group relative flex h-full flex-col overflow-hidden rounded-2xl border p-6 text-left transition-shadow duration-300 sm:p-7",
                      "border-white/10 bg-card ring-1 ring-border/50",
                      "focus-visible:ring-2 focus-visible:ring-violet-500",
                      isActive
                        ? "shadow-[0_30px_80px_-30px_color-mix(in_oklab,var(--color-violet-600)_60%,transparent),0_10px_40px_-20px_rgba(0,0,0,0.5)]"
                        : "cursor-pointer shadow-[0_20px_50px_-30px_rgba(0,0,0,0.6)]"
                    )}
                  >
                    {/* Glass sheen + active glow ring. */}
                    <span
                      aria-hidden
                      className="pointer-events-none absolute inset-0 rounded-2xl bg-[linear-gradient(135deg,rgba(255,255,255,0.14),transparent_40%)]"
                    />
                    {isActive ? (
                      <span
                        aria-hidden
                        className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-violet-400/40"
                      />
                    ) : null}

                    <div className="relative flex items-start justify-between gap-3">
                      <h3 className="text-lg font-semibold leading-snug sm:text-xl">
                        <span className="bg-gradient-to-r from-violet-500 to-sky-500 bg-clip-text text-transparent">
                          {project.title}
                        </span>
                      </h3>
                      <ArrowUpRight className="mt-1 size-5 shrink-0 text-muted-foreground transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-violet-500" />
                    </div>

                    <p className="relative mt-3 line-clamp-4 text-sm text-muted-foreground sm:line-clamp-5">
                      {project.description}
                    </p>

                    <div className="relative mt-auto space-y-4 pt-5">
                      <div className="flex flex-wrap gap-1.5">
                        {visibleTech.map((tech) => (
                          <Badge key={tech} variant="secondary" className="font-normal">
                            {tech}
                          </Badge>
                        ))}
                        {remaining > 0 ? (
                          <Badge variant="outline" className="font-normal">
                            +{remaining} more
                          </Badge>
                        ) : null}
                      </div>

                      <div className="flex items-center gap-4 text-sm font-medium">
                        <Link
                          href={`/projects/${project.slug}`}
                          tabIndex={isActive ? 0 : -1}
                          draggable={false}
                          aria-hidden={!isActive}
                          aria-label={`View details for ${project.title}`}
                          onClick={(e) => {
                            // Guard against a drag that ended on the link.
                            if (moved.current) e.preventDefault();
                          }}
                          className="inline-flex items-center gap-1 rounded-md text-violet-500 underline-offset-4 outline-none hover:underline focus-visible:ring-2 focus-visible:ring-violet-500"
                        >
                          View project
                          <ArrowUpRight className="size-4" />
                        </Link>
                        {live ? (
                          <span
                            role="link"
                            tabIndex={isActive ? 0 : -1}
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              if (!moved.current) window.open(live.url, "_blank", "noopener");
                            }}
                            className="text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                          >
                            Live site
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </motion.article>
              </div>
            );
          })}
        </motion.div>
      </div>

      {/* Controls -------------------------------------------------------- */}
      <div className="mt-8 flex items-center justify-center gap-5">
        <button
          type="button"
          onClick={() => go(-1)}
          aria-label="Previous project"
          className="grid size-10 place-items-center rounded-full border border-border/60 bg-card/70 text-foreground/80 backdrop-blur transition-all hover:border-violet-500/60 hover:text-violet-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
        >
          <ChevronLeft className="size-5" />
        </button>

        <div className="flex items-center gap-2.5" role="tablist" aria-label="Select project">
          {projects.map((project, i) => {
            const isActive = i === active;
            return (
              <button
                key={project.slug}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-label={`Go to ${project.title}`}
                onClick={() => setActive(i)}
                className={cn(
                  "h-2 rounded-full transition-all duration-300",
                  isActive
                    ? "w-7 bg-gradient-to-r from-violet-500 to-sky-500"
                    : "w-2 bg-border hover:bg-muted-foreground/60"
                )}
              />
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => go(1)}
          aria-label="Next project"
          className="grid size-10 place-items-center rounded-full border border-border/60 bg-card/70 text-foreground/80 backdrop-blur transition-all hover:border-violet-500/60 hover:text-violet-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
        >
          <ChevronRight className="size-5" />
        </button>
      </div>
    </div>
  );
}
