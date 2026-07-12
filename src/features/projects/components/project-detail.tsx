import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GithubIcon } from "@/components/icons/brand-icons";
import { Reveal } from "@/components/motion/reveal";
import type { Project, ProjectCategory } from "@/types";

const categoryLabel: Record<ProjectCategory, string> = {
  work: "Work Experience",
  personal: "Personal Project",
};

export function ProjectDetail({ project }: { project: Project }) {
  const repoLink = project.links.find((l) => l.label === "Repo");
  const liveLink = project.links.find((l) => l.label === "Live");

  return (
    <article className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <Link
          href={`/?tab=${project.category}#projects`}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Back to projects
        </Link>

        {/* Header */}
        <Reveal className="relative mt-8 overflow-hidden rounded-2xl border border-border/60 bg-card p-6 shadow-xl shadow-black/5 sm:p-10">
          <HeaderGlow />

          <div className="relative z-10">
          <span className="text-sm font-medium uppercase tracking-widest text-violet-500">
            {categoryLabel[project.category]}
          </span>
          <h1 className="mt-3 font-heading text-3xl font-bold tracking-tight sm:text-4xl">
            {project.title}
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            {project.description}
          </p>

          {(repoLink || liveLink) && (
            <div className="mt-6 flex flex-wrap gap-3">
              {liveLink ? (
                <Button
                  className="rounded-full"
                  render={<a href={liveLink.url} target="_blank" rel="noreferrer" />}
                >
                  <ExternalLink className="mr-1 size-4" /> View live
                </Button>
              ) : null}
              {repoLink ? (
                <Button
                  variant="outline"
                  className="rounded-full"
                  render={<a href={repoLink.url} target="_blank" rel="noreferrer" />}
                >
                  <GithubIcon className="mr-1 size-4" /> View code
                </Button>
              ) : null}
            </div>
          )}

          <div className="mt-6 flex flex-wrap gap-1.5">
            {project.tech.map((tech) => (
              <Badge
                key={tech}
                variant="secondary"
                className="font-normal dark:bg-zinc-700 dark:text-zinc-200"
              >
                {tech}
              </Badge>
            ))}
          </div>
          </div>
        </Reveal>

        {/* Highlights */}
        <Reveal className="mt-10">
          <h2 className="font-heading text-xl font-semibold tracking-tight sm:text-2xl">
            What I built
          </h2>
          <ul className="mt-5 space-y-3">
            {project.highlights.map((point) => (
              <li key={point} className="flex gap-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
                <span className="mt-2 size-1.5 shrink-0 rounded-full bg-violet-500" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </article>
  );
}

function HeaderGlow() {
  return (
    <div
      aria-hidden
      className="header-flow pointer-events-none absolute inset-0 blur-2xl"
    />
  );
}
