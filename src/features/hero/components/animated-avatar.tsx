"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";

import { profile } from "@/data/profile";

/**
 * "Comet Sweep" frame around the profile photo:
 *  - a bright gradient arc chases around a thin ring like a comet trail
 *  - the whole avatar gently floats up and down
 *  - a faint static glow grounds it in the hero
 * All motion is disabled when the visitor prefers reduced motion.
 */
export function AnimatedAvatar() {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      animate={
        reduceMotion
          ? undefined
          : { y: [0, -10, 0], transition: { duration: 6, ease: "easeInOut", repeat: Infinity } }
      }
      className="relative size-56 shrink-0 sm:size-64 lg:size-80"
    >
      {/* Faint static glow for depth */}
      <div
        aria-hidden
        className="absolute -inset-4 -z-10 rounded-full bg-gradient-to-br from-violet-500 via-fuchsia-500 to-sky-400 opacity-20 blur-2xl"
      />

      {/* Rotating comet arc */}
      <motion.div
        aria-hidden
        animate={
          reduceMotion
            ? undefined
            : { rotate: 360, transition: { duration: 3.4, ease: "linear", repeat: Infinity } }
        }
        className="absolute -inset-[6px] rounded-full"
        style={{
          background:
            "conic-gradient(from 0deg, transparent 0 62%, var(--color-sky-400) 80%, var(--color-fuchsia-500) 92%, var(--color-violet-500) 100%)",
        }}
      />

      {/* Mask that keeps only a thin ring of the sweep visible */}
      <div aria-hidden className="absolute -inset-px rounded-full bg-background" />

      {/* The photo */}
      <div className="relative size-full overflow-hidden rounded-full border-4 border-background shadow-2xl ring-1 ring-border">
        <Image
          src={profile.photo}
          alt={profile.name}
          fill
          priority
          sizes="(min-width: 1024px) 320px, 256px"
          className="object-cover"
        />
      </div>
    </motion.div>
  );
}
