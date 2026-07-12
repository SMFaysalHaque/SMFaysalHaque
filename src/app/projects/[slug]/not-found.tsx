import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function ProjectNotFound() {
  return (
    <section className="px-4 py-24 text-center sm:px-6 sm:py-32 lg:px-8">
      <div className="mx-auto max-w-md">
        <span className="text-sm font-medium uppercase tracking-widest text-violet-500">
          404
        </span>
        <h1 className="mt-3 font-heading text-3xl font-bold tracking-tight sm:text-4xl">
          Project not found
        </h1>
        <p className="mt-4 text-muted-foreground">
          The project you&apos;re looking for doesn&apos;t exist or may have been moved.
        </p>
        <Button className="mt-8 rounded-full" render={<Link href="/#projects" />}>
          <ArrowLeft className="mr-1 size-4" /> Back to projects
        </Button>
      </div>
    </section>
  );
}
