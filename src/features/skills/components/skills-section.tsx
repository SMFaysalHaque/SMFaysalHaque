"use client";

import * as React from "react";
import Autoplay from "embla-carousel-autoplay";
import {
  Code2,
  Database,
  Layers,
  Blocks,
  ListChecks,
  ShieldCheck,
  BarChart3,
  Languages,
  Network,
  Globe,
  Palette,
  Wrench,
  Terminal,
  PenTool,
  Users,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/layout/section-heading";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Carousel,
  CarouselContent,
  CarouselDots,
  CarouselItem,
} from "@/components/ui/carousel";
import { skillGroups } from "@/features/skills/data/skills";
import type { SkillGroup } from "@/types";

const categoryIcons: Record<string, LucideIcon> = {
  "Programming Language": Code2,
  "Backend & Databases": Database,
  "Frameworks & Libraries": Layers,
  "UI Component Libraries": Blocks,
  "Forms & Validation": ListChecks,
  Authentication: ShieldCheck,
  "Data Visualization": BarChart3,
  Internationalization: Languages,
  "API & Communication": Network,
  "Web Technologies": Globe,
  "Styling Frameworks": Palette,
  "Tooling & Code Quality": Wrench,
  "Development Tools": Terminal,
  Design: PenTool,
  "Communication Tools & Project Management": Users,
  "Familiar with": Sparkles,
};

// Cards shown per slide/page, by viewport:
//   < md  → 2 cards (1 col, stacked top/bottom)
//   md    → 4 cards (2 cols × 2 rows)
//   lg+   → 3 cards (single row of 3)
function usePerPage() {
  // null until mounted, so the real viewport-based value is known before we
  // render the carousel (avoids a first-paint layout shift / hydration mismatch).
  const [perPage, setPerPage] = React.useState<number | null>(null);

  React.useEffect(() => {
    const md = window.matchMedia("(min-width: 768px)");
    const lg = window.matchMedia("(min-width: 1024px)");

    const update = () => {
      if (lg.matches) setPerPage(3);
      else if (md.matches) setPerPage(4);
      else setPerPage(2);
    };

    update();
    md.addEventListener("change", update);
    lg.addEventListener("change", update);

    return () => {
      md.removeEventListener("change", update);
      lg.removeEventListener("change", update);
    };
  }, []);

  return perPage;
}

function chunk<T>(items: T[], size: number): T[][] {
  const pages: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    pages.push(items.slice(i, i + size));
  }
  return pages;
}

function SkillCard({
  group,
  className,
}: {
  group: SkillGroup;
  className?: string;
}) {
  const Icon = categoryIcons[group.category] ?? Sparkles;

  return (
    <Card
      className={cn(
        "glow-border relative h-full ring-1 ring-border/70 transition-shadow duration-300 hover:shadow-lg hover:shadow-violet-500/10",
        className
      )}
    >
      <CardContent className="h-full overflow-y-auto">
        <div className="flex items-center gap-3">
          <span className="flex size-9 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500/15 to-sky-400/15 text-violet-500">
            <Icon className="size-4" />
          </span>
          <h3 className="font-semibold">{group.category}</h3>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {group.items.map((item) => (
            <Badge key={item} variant="secondary" className="font-normal">
              {item}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function SkillsSection() {
  const [autoplay] = React.useState(() =>
    Autoplay({ delay: 4500, stopOnInteraction: false, stopOnMouseEnter: true })
  );
  const perPage = usePerPage();
  const pages = React.useMemo(
    () => (perPage ? chunk(skillGroups, perPage) : []),
    [perPage]
  );

  const gridCols =
    perPage === 2 ? "grid-cols-1" : perPage === 4 ? "grid-cols-2" : "grid-cols-3";

  // Fixed card height in the multi-row layouts (md = 2×2, sm/less = stacked)
  // so every card is identical across all slides. lg (single row) stays auto.
  const cardHeight = perPage === 4 ? "h-36" : perPage === 2 ? "h-36" : "";

  return (
    <section id="skills" className="bg-muted/30 px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Skills"
          title="Technologies I work with"
          description="A full-stack toolkit centered on React and Next.js, extended with Vue/Nuxt and hands-on work across REST APIs, databases, and Go."
        />

        <Reveal className="mt-12">
          {perPage === null ? (
            <div className="min-h-[19rem]" aria-hidden />
          ) : (
            <Carousel
              opts={{ align: "start", loop: true, duration: 32 }}
              plugins={[autoplay]}
              className="w-full"
            >
              <CarouselContent className="-ml-4 py-4">
                {pages.map((page, pageIndex) => (
                  <CarouselItem key={pageIndex} className="basis-full pl-4">
                    <div className={cn("grid auto-rows-fr gap-4", gridCols)}>
                      {page.map((group) => (
                        <SkillCard
                          key={group.category}
                          group={group}
                          className={cardHeight}
                        />
                      ))}
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselDots className="mt-8" />
            </Carousel>
          )}
        </Reveal>
      </div>
    </section>
  );
}
