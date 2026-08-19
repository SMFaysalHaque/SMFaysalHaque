"use client";

import { motion, useScroll, useSpring } from "motion/react";

/**
 * A thin gradient bar pinned to the very top of the viewport that fills
 * left-to-right as the visitor scrolls the page. Sits above the sticky
 * navbar. Purely decorative, so it's hidden from assistive tech.
 */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 24,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[60] h-0.5 origin-left bg-gradient-to-r from-violet-500 via-fuchsia-500 to-sky-400"
    />
  );
}
