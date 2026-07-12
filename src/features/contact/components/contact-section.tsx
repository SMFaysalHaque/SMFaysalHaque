import { Mail, MapPin, QrCode } from "lucide-react";

import { Reveal } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/layout/section-heading";
import { Card, CardContent } from "@/components/ui/card";
import { ContactForm } from "@/features/contact/components/contact-form";
import { TelegramIcon } from "@/components/icons/brand-icons";
import { TelegramQrDialog } from "@/components/layout/telegram-qr";
import { profile } from "@/data/profile";

const directContacts = [
  {
    icon: Mail,
    label: "Email",
    value: profile.email,
    href: undefined,
  },
  {
    icon: TelegramIcon,
    label: "Telegram",
    value: profile.phoneDisplay,
    href: profile.socials.telegram,
    qr: true,
  },
  {
    icon: MapPin,
    label: "Location",
    value: profile.location,
    href: undefined,
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
            <div className="flex h-full flex-col gap-4">
              {directContacts.map((contact) => (
                <Card key={contact.label} className="border-border/60">
                  <CardContent className="flex items-center gap-4">
                    <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500/15 to-sky-400/15 text-violet-500">
                      <contact.icon className="size-5" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-muted-foreground">{contact.label}</p>
                      {contact.qr ? (
                        <TelegramQrDialog
                          aria-label="Show my Telegram QR code"
                          className="group block max-w-full text-left"
                        >
                          <span className="flex items-center gap-1.5 font-semibold transition-colors group-hover:text-violet-500">
                            <span className="truncate">{contact.value}</span>
                            <QrCode className="size-3.5 shrink-0" />
                          </span>
                          <span className="mt-0.5 block text-xs text-muted-foreground transition-colors group-hover:text-violet-500">
                            Click to scan the QR code & chat
                          </span>
                        </TelegramQrDialog>
                      ) : contact.href ? (
                        <a
                          href={contact.href}
                          target="_blank"
                          rel="noreferrer"
                          className="truncate font-semibold hover:text-violet-500"
                        >
                          {contact.value}
                        </a>
                      ) : (
                        <p className="truncate font-semibold">{contact.value}</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.1} className="lg:col-span-3">
            <Card className="border-border/60">
              <CardContent>
                <ContactForm />
              </CardContent>
            </Card>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
