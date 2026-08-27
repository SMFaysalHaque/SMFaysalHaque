"use client";

import * as React from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/layout/section-heading";
import { ProjectCard } from "@/features/projects/components/project-card";
import { ProjectCoverflow } from "@/features/projects/components/project-coverflow";
import { getProjectsByCategory } from "@/features/projects/lib/get-project";
import type { Project, ProjectCategory } from "@/types";

const workProjects = getProjectsByCategory("work");
const personalProjects = getProjectsByCategory("personal");

const DEFAULT_TAB: ProjectCategory = "work";
// Fired on manual tab change so useSyncExternalStore re-reads the URL
// (history.replaceState alone does not emit an event).
const TAB_CHANGE_EVENT = "projecttabchange";

function readTabFromUrl(): ProjectCategory {
  return new URLSearchParams(window.location.search).get("tab") === "personal"
    ? "personal"
    : "work";
}

function subscribeToTab(onChange: () => void): () => void {
  window.addEventListener("popstate", onChange);
  window.addEventListener(TAB_CHANGE_EVENT, onChange);
  return () => {
    window.removeEventListener("popstate", onChange);
    window.removeEventListener(TAB_CHANGE_EVENT, onChange);
  };
}

export function ProjectsSection() {
  // The active tab is derived from the `?tab=` param, so returning from a
  // project via its "Back to projects" link reopens that project's tab.
  // useSyncExternalStore keeps this hydration-safe: the server renders the
  // default and the client re-reads the URL after mount.
  const tab = React.useSyncExternalStore(
    subscribeToTab,
    readTabFromUrl,
    () => DEFAULT_TAB
  );

  const handleTabChange = (value: ProjectCategory) => {
    const url = new URL(window.location.href);
    url.searchParams.set("tab", value);
    window.history.replaceState(null, "", url);
    window.dispatchEvent(new Event(TAB_CHANGE_EVENT));
  };

  return (
    <section id="projects" className="px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Projects"
          title="Things I've built"
          description="A mix of professional client work and self-driven personal projects. Tap any card for the full breakdown."
        />

        <Tabs
          value={tab}
          onValueChange={(value) => handleTabChange(value as ProjectCategory)}
          className="mt-12"
        >
          <div className="flex justify-center">
            <TabsList>
              <TabsTrigger value="work">Work Experience</TabsTrigger>
              <TabsTrigger value="personal">Personal Work</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="work" className="mt-10">
            <ProjectCoverflow projects={workProjects} />
          </TabsContent>
          <TabsContent value="personal" className="mt-8">
            <ProjectGrid projects={personalProjects} />
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}

function ProjectGrid({ projects }: { projects: Project[] }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {projects.map((project, i) => (
        <Reveal key={project.slug} delay={(i % 3) * 0.08}>
          <ProjectCard project={project} />
        </Reveal>
      ))}
    </div>
  );
}
