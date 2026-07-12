import { z } from "zod";

// Throwaway / temporary inbox providers — blocked so messages come from a real,
// reachable address. Extend this list any time a new one slips through.
const disposableEmailDomains = new Set([
  "mailinator.com",
  "10minutemail.com",
  "guerrillamail.com",
  "sharklasers.com",
  "tempmail.com",
  "temp-mail.org",
  "tempmailo.com",
  "throwawaymail.com",
  "yopmail.com",
  "trashmail.com",
  "getnada.com",
  "maildrop.cc",
  "dispostable.com",
  "fakeinbox.com",
  "mailnesia.com",
  "moakt.com",
  "emailondeck.com",
  "mohmal.com",
  "spam4.me",
]);

export const contactFormSchema = z
  .object({
    name: z.string().trim().min(2, "Name must be at least 2 characters").max(80),
    email: z
      .string()
      .trim()
      .min(1, "Email is required")
      .pipe(z.email("Enter a valid email address")),
    message: z.string().trim().min(10, "Message should be at least 10 characters").max(1000),
    // Honeypot: rendered hidden, so a real person never fills it. Any value here
    // means a bot, and the submission is rejected.
    botcheck: z.boolean().optional(),
  })
  .superRefine((data, ctx) => {
    const domain = data.email.split("@")[1]?.toLowerCase();
    if (domain && disposableEmailDomains.has(domain)) {
      ctx.addIssue({
        code: "custom",
        message: "Please use a permanent email address so I can reply.",
        path: ["email"],
      });
    }
  });

export type ContactFormValues = z.infer<typeof contactFormSchema>;

export const contactDefaultValues: ContactFormValues = {
  name: "",
  email: "",
  message: "",
  botcheck: false,
};
