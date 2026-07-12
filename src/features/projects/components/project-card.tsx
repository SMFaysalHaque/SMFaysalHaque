import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Project } from "@/types";

// How many tech chips to preview on the card before collapsing the rest
// into a "+N more" badge. Full list lives on the detail page.
const MAX_VISIBLE_TECH = 4;

export function ProjectCard({ project }: { project: Project }) {
  const visibleTech = project.tech.slice(0, MAX_VISIBLE_TECH);
  const remainingTech = project.tech.length - visibleTech.length;

  return (
    <Link
      href={`/projects/${project.slug}`}
      aria-label={`View details for ${project.title}`}
      className="group block h-full rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      <Card className="glow-border relative h-full flex-col ring-1 ring-border/60 transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-lg group-hover:shadow-violet-500/10">
        <CardContent className="flex flex-1 flex-col">
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-semibold leading-snug">
              <span className="title-gradient">{project.title}</span>
            </h3>
            <ArrowUpRight className="size-4 shrink-0 text-muted-foreground transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-violet-500" />
          </div>

          <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">
            {project.description}
          </p>

          <div className="mt-auto flex flex-wrap gap-1.5 pt-5">
            {visibleTech.map((tech) => (
              <Badge key={tech} variant="secondary" className="font-normal">
                {tech}
              </Badge>
            ))}
            {remainingTech > 0 ? (
              <Badge variant="outline" className="font-normal">
                +{remainingTech} more
              </Badge>
            ) : null}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
