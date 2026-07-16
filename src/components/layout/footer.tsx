import Link from "next/link";

import { navLinks } from "@/components/layout/site-config";
import { GithubIcon, LinkedinIcon, FacebookIcon } from "@/components/icons/brand-icons";
import { profile } from "@/data/profile";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border/60 bg-background">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="text-center md:text-left">
            <p className="font-heading text-lg font-semibold tracking-tight">
              S. M. <span className="bg-gradient-to-r from-violet-500 to-sky-400 bg-clip-text text-transparent">Faysal Haque</span>
            </p>
            <p className="text-sm text-muted-foreground">{profile.title} · {profile.location}</p>
          </div>

          <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <IconLink href={profile.socials.github} label="GitHub">
              <GithubIcon className="size-4" />
            </IconLink>
            <IconLink href={profile.socials.linkedin} label="LinkedIn">
              <LinkedinIcon className="size-4" />
            </IconLink>
            <IconLink href={profile.socials.facebook} label="Facebook">
              <FacebookIcon className="size-4" />
            </IconLink>
          </div>
        </div>

        <p className="mt-8 text-center text-xs text-muted-foreground">
          © {year} {profile.name}.
        </p>
      </div>
    </footer>
  );
}

function IconLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      className="flex size-9 items-center justify-center rounded-full border border-border/60 text-muted-foreground transition-colors hover:border-transparent hover:bg-accent hover:text-foreground"
    >
      {children}
    </a>
  );
}
