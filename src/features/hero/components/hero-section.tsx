"use client";

import { motion } from "motion/react";
import { ArrowDownRight, Download, QrCode } from "lucide-react";

import { Button } from "@/components/ui/button";
import { GithubIcon, TelegramIcon } from "@/components/icons/brand-icons";
import { TelegramQrDialog } from "@/components/layout/telegram-qr";
import { fadeIn, heroContainer, heroItem } from "@/lib/motion";
import { profile } from "@/data/profile";
import { AnimatedAvatar } from "./animated-avatar";

export function HeroSection() {
  return (
    <section
      id="home"
      className="relative overflow-hidden px-4 pt-20 pb-24 sm:px-6 sm:pt-28 sm:pb-32 lg:px-8"
    >
      <BackgroundGlow />

      <div className="mx-auto flex max-w-6xl flex-col items-center gap-12 lg:flex-row lg:justify-between">
        <motion.div
          initial="hidden"
          animate="show"
          variants={heroContainer}
          className="max-w-xl text-center lg:text-left"
        >
          <motion.span
            variants={heroItem}
            className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/60 px-4 py-1.5 text-sm font-medium text-muted-foreground backdrop-blur"
          >
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-500 opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
            </span>
            Available for new opportunities
          </motion.span>

          <motion.h1
            variants={heroItem}
            className="mt-6 font-heading text-4xl font-bold tracking-tight sm:text-5xl xl:text-6xl"
          >
            Hi, I&apos;m{" "}
            <span className="animate-text-shimmer bg-gradient-to-r from-violet-500 via-fuchsia-500 to-sky-400 bg-clip-text text-transparent">
              {profile.name}
            </span>
          </motion.h1>

          <motion.p
            variants={heroItem}
            className="mt-4 text-lg font-medium text-foreground/80 sm:text-xl"
          >
            {profile.title}
          </motion.p>

          <motion.p
            variants={heroItem}
            className="mt-5 text-base leading-relaxed text-muted-foreground sm:text-lg"
          >
            {profile.tagline}
          </motion.p>

          <motion.div
            variants={heroItem}
            className="mt-8 flex flex-wrap items-center justify-center gap-3 lg:justify-start"
          >
            <Button size="lg" className="rounded-full font-semibold" render={<a href="#contact" />}>
              Let&apos;s talk <ArrowDownRight className="size-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="rounded-full"
              render={<a href={profile.resumeUrl} download="CV_S. M. Faysal Haque_Software_Engineer.pdf" />}
            >
              <Download className="size-4" /> Download CV
            </Button>
            <Button
              size="lg"
              variant="ghost"
              className="rounded-full"
              render={<a href={profile.socials.github} target="_blank" rel="noreferrer" />}
            >
              <GithubIcon className="size-4" /> GitHub
            </Button>
          </motion.div>

          <motion.div variants={heroItem}>
            <TelegramQrDialog
              aria-label="Show my Telegram QR code"
              className="group mt-6 inline-flex w-full items-center gap-3 rounded-2xl border border-border/60 bg-background/60 px-4 py-3 text-left backdrop-blur transition-colors hover:border-sky-400/60 hover:bg-accent sm:w-auto"
            >
              <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-sky-500/10 text-sky-500 transition-colors group-hover:bg-sky-500/20">
                <TelegramIcon className="size-5" />
              </span>
              <span className="flex min-w-0 flex-col">
                <span className="text-sm font-semibold text-foreground">
                  Chat with me on Telegram
                </span>
                <span className="text-xs font-medium text-foreground/80">
                  {profile.phoneDisplay}
                </span>
                <span className="text-xs text-muted-foreground">
                  Click to scan the QR code and message me
                </span>
              </span>
              <QrCode className="ml-auto size-5 shrink-0 text-muted-foreground transition-colors group-hover:text-sky-500" />
            </TelegramQrDialog>
          </motion.div>
        </motion.div>

        <motion.div
          initial="hidden"
          animate="show"
          variants={fadeIn}
          transition={{ delay: 0.15 }}
          className="relative shrink-0"
        >
          <AnimatedAvatar />
        </motion.div>
      </div>
    </section>
  );
}

function BackgroundGlow() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden [mask-image:radial-gradient(ellipse_at_top,black,transparent_75%)]"
    >
      {/* Faint dotted grid for texture */}
      <div className="absolute inset-0 dot-grid opacity-60" />

      {/* Drifting aurora blobs */}
      <div className="aurora-a absolute left-1/2 top-[-10%] h-[32rem] w-[32rem] -translate-x-1/2 rounded-full bg-violet-500/20 blur-3xl" />
      <div className="aurora-b absolute right-[-10%] top-[20%] h-[24rem] w-[24rem] rounded-full bg-sky-400/20 blur-3xl" />
      <div className="aurora-b absolute left-[-8%] top-[45%] h-[20rem] w-[20rem] rounded-full bg-fuchsia-500/15 blur-3xl" />
    </div>
  );
}
