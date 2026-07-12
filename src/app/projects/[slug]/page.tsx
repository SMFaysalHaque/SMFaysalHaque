import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ProjectDetail } from "@/features/projects/components/project-detail";
import { getProjectBySlug, getProjectSlugs } from "@/features/projects/lib/get-project";

type ProjectPageProps = {
  params: Promise<{ slug: string }>;
};

// Prerender every project detail page at build time.
export function generateStaticParams() {
  return getProjectSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) return {};

  return {
    title: `${project.title} — Project`,
    description: project.description,
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) notFound();

  return <ProjectDetail project={project} />;
}
