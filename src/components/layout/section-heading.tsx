"use client";

import { motion } from "motion/react";

import { Reveal } from "@/components/motion/reveal";

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  description?: string;
}

export function SectionHeading({ eyebrow, title, description }: SectionHeadingProps) {
  return (
    <Reveal className="mx-auto max-w-2xl text-center">
      <span className="text-sm font-medium uppercase tracking-widest text-violet-500">
        {eyebrow}
      </span>
      <h2 className="mt-3 font-heading text-3xl font-bold tracking-tight sm:text-4xl">
        {title}
      </h2>
      <motion.span
        aria-hidden
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
        className="mx-auto mt-5 block h-1 w-16 origin-center rounded-full bg-gradient-to-r from-violet-500 via-fuchsia-500 to-sky-400"
      />
      {description ? (
        <p className="mt-4 text-base text-muted-foreground sm:text-lg">{description}</p>
      ) : null}
    </Reveal>
  );
}
