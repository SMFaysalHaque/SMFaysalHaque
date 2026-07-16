"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Logo } from "@/components/layout/logo";
import { navLinks } from "@/components/layout/site-config";
import { GithubIcon, LinkedinIcon, FacebookIcon } from "@/components/icons/brand-icons";
import { profile } from "@/data/profile";

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/70 backdrop-blur-lg supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:h-20 lg:px-8">
        <Link href="/#home" aria-label={profile.name} className="shrink-0">
          <Logo className="h-10 w-auto sm:h-12 lg:h-14" />
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1 sm:gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            render={<a href={profile.socials.github} target="_blank" rel="noreferrer" aria-label="GitHub" />}
          >
            <GithubIcon className="size-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            render={<a href={profile.socials.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn" />}
          >
            <LinkedinIcon className="size-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            render={<a href={profile.socials.facebook} target="_blank" rel="noreferrer" aria-label="Facebook" />}
          >
            <FacebookIcon className="size-5" />
          </Button>
          <ThemeToggle />

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              render={
                <Button variant="ghost" size="icon" className="rounded-full md:hidden" aria-label="Open menu" />
              }
            >
              <Menu className="size-5" />
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetTitle className="px-4 pt-4">Menu</SheetTitle>
              <nav className="mt-6 flex flex-col gap-1 px-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="rounded-md px-3 py-2.5 text-base font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
