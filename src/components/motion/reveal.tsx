"use client";

import { motion, type Variants } from "motion/react";

import { fadeUp } from "@/lib/motion";

interface RevealProps {
  children: React.ReactNode;
  variants?: Variants;
  className?: string;
  delay?: number;
  as?: "div" | "section";
}

export function Reveal({ children, variants = fadeUp, className, delay = 0, as = "div" }: RevealProps) {
  const MotionTag = as === "section" ? motion.section : motion.div;

  return (
    <MotionTag
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      variants={variants}
      transition={{ delay }}
      className={className}
    >
      {children}
    </MotionTag>
  );
}
