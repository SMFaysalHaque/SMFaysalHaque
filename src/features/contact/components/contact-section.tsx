import type { ComponentType } from "react";
import { Mail, MapPin, QrCode } from "lucide-react";

import { Reveal } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/layout/section-heading";
import { Card, CardContent } from "@/components/ui/card";
import { ContactForm } from "@/features/contact/components/contact-form";
import { TelegramIcon, LinkedinIcon, FacebookIcon } from "@/components/icons/brand-icons";
import { TelegramQrDialog } from "@/components/layout/telegram-qr";
import { profile } from "@/data/profile";

type DirectContact = {
  icon: ComponentType<{ className?: string }>;
  label: string;
  value: string;
  href?: string;
  qr?: boolean;
};

const directContacts: DirectContact[] = [
  {
    icon: Mail,
    label: "Email",
    value: profile.email,
  },
  {
    icon: TelegramIcon,
    label: "Telegram",
    value: profile.phoneDisplay,
    qr: true,
  },
  {
    icon: LinkedinIcon,
    label: "LinkedIn",
    value: profile.name,
    href: profile.socials.linkedin,
  },
  {
    icon: FacebookIcon,
    label: "Facebook",
    value: profile.name,
    href: profile.socials.facebook,
  },
  {
    icon: MapPin,
    label: "Location",
    value: profile.location,
  },
];

export function ContactSection() {
  return (
    <section id="contact" className="bg-muted/30 px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Contact"
          title="Let's build something together"
          description="Email me directly, or reach out on Telegram — whichever is easier for you."
        />

        <div className="mt-12 grid gap-6 lg:grid-cols-5">
          <Reveal className="lg:col-span-2">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:flex lg:h-full lg:flex-col">
              {directContacts.map((contact) => {
                const body = (
                  <CardContent className="flex items-center gap-4">
                    <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500/15 to-sky-400/15 text-violet-500">
                      <contact.icon className="size-5" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-muted-foreground">{contact.label}</p>
                      <p className="flex items-center gap-1.5 font-semibold transition-colors group-hover:text-violet-500">
                        <span className="truncate">{contact.value}</span>
                        {contact.qr && <QrCode className="size-3.5 shrink-0" />}
                      </p>
                      {contact.qr && (
                        <span className="mt-0.5 block text-xs text-muted-foreground transition-colors group-hover:text-violet-500">
                          Click to scan the QR code & chat
                        </span>
                      )}
                    </div>
                  </CardContent>
                );

                if (contact.qr) {
                  return (
                    <TelegramQrDialog
                      key={contact.label}
                      aria-label="Show my Telegram QR code"
                      className="group block h-full w-full rounded-xl text-left lg:flex-1"
                      render={
                        <Card className="h-full border-border/60 transition-colors group-hover:border-violet-500/50" />
                      }
                    >
                      {body}
                    </TelegramQrDialog>
                  );
                }

                if (contact.href) {
                  return (
                    <a
                      key={contact.label}
                      href={contact.href}
                      target="_blank"
                      rel="noreferrer"
                      className="group block h-full rounded-xl lg:flex-1"
                    >
                      <Card className="h-full border-border/60 transition-colors group-hover:border-violet-500/50">
                        {body}
                      </Card>
                    </a>
                  );
                }

                return (
                  <Card key={contact.label} className="h-full border-border/60 lg:flex-1">
                    {body}
                  </Card>
                );
              })}
            </div>
          </Reveal>

          <Reveal delay={0.1} className="lg:col-span-3">
            <Card className="border-border/60 lg:h-full">
              <CardContent className="lg:flex lg:min-h-0 lg:flex-1 lg:flex-col">
                <ContactForm />
              </CardContent>
            </Card>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
