import { GraduationCap, MapPin, Mail } from "lucide-react";

import { Reveal } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/layout/section-heading";
import { Card, CardContent } from "@/components/ui/card";
import { profile } from "@/data/profile";

const facts = [
  {
    icon: GraduationCap,
    label: "Education",
    value: `${profile.education.degree}`,
    sub: `${profile.education.institution} · ${profile.education.year}`,
  },
  {
    icon: MapPin,
    label: "Location",
    value: profile.location,
    sub: "Open to remote & on-site roles",
  },
  {
    icon: Mail,
    label: "Email",
    value: profile.email,
    sub: "Usually replies within a day",
  },
];

export function AboutSection() {
  return (
    <section id="about" className="px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="About Me"
          title="A software engineer who builds complete products, end to end"
          description={profile.bio}
        />

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {facts.map((fact, i) => (
            <Reveal key={fact.label} delay={i * 0.08}>
              <Card className="h-full border-border/60">
                <CardContent className="flex items-start gap-4">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500/15 to-sky-400/15 text-violet-500">
                    <fact.icon className="size-5" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-muted-foreground">{fact.label}</p>
                    <p className="mt-1 truncate font-semibold">{fact.value}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{fact.sub}</p>
                  </div>
                </CardContent>
              </Card>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
