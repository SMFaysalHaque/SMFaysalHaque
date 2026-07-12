import type { Project, ProjectCategory } from "@/types";
import { projects } from "@/features/projects/data/projects";

/** All projects belonging to a category, in declaration order. */
export function getProjectsByCategory(category: ProjectCategory): Project[] {
  return projects.filter((project) => project.category === category);
}

/** Find a single project by its slug, or `undefined` if none matches. */
export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}

/** Every project slug — used to prerender the detail routes at build time. */
export function getProjectSlugs(): string[] {
  return projects.map((project) => project.slug);
}
