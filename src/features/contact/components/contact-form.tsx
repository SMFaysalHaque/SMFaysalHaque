"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
  contactDefaultValues,
  contactFormSchema,
  type ContactFormValues,
} from "@/features/contact/schema/contact-schema";
import { sendEmail } from "@/features/contact/lib/contact-links";

export function ContactForm() {
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: contactDefaultValues,
  });

  const onSubmit = async (values: ContactFormValues) => {
    setSubmitting(true);
    try {
      await sendEmail(values);
      toast.success("Message sent!", {
        description: "Thanks for reaching out — I usually reply within a day.",
      });
      reset(contactDefaultValues);
    } catch (error) {
      toast.error("Couldn't send your message", {
        description:
          error instanceof Error ? error.message : "Please try again in a moment.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-5 lg:flex lg:min-h-0 lg:flex-1 lg:flex-col lg:space-y-0 lg:gap-5"
      noValidate
    >
      {/* Honeypot: hidden from real users; bots that auto-fill forms will tick it
          and get rejected. Not a visible field — no label, off the tab order. */}
      <input
        type="checkbox"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="hidden"
        {...register("botcheck")}
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Your name" htmlFor="name" required error={errors.name?.message}>
          <Input id="name" placeholder="Jane Doe" {...register("name")} aria-invalid={!!errors.name} />
        </Field>

        <Field label="Email address" htmlFor="email" required error={errors.email?.message}>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            {...register("email")}
            aria-invalid={!!errors.email}
          />
        </Field>
      </div>

      <Field label="Message" htmlFor="message" required grow error={errors.message?.message}>
        <Textarea
          id="message"
          rows={5}
          placeholder="Tell me a bit about your project or opportunity…"
          className="resize-y [field-sizing:fixed] lg:min-h-0 lg:flex-1 lg:resize-none"
          {...register("message")}
          aria-invalid={!!errors.message}
        />
      </Field>

      <Button type="submit" size="lg" className="w-full rounded-full sm:w-auto lg:self-start" disabled={submitting}>
        {submitting ? <Loader2 className="mr-1 size-4 animate-spin" /> : null}
        Send email
      </Button>
    </form>
  );
}

function Field({
  label,
  htmlFor,
  required,
  grow,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  required?: boolean;
  grow?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "space-y-1.5",
        grow && "lg:flex lg:min-h-0 lg:flex-1 lg:flex-col lg:space-y-0 lg:gap-1.5"
      )}
    >
      <Label htmlFor={htmlFor}>
        {label}
        {required ? (
          <span className="text-destructive" aria-hidden="true">
            *
          </span>
        ) : null}
      </Label>
      {children}
      {error ? <p className={cn("text-sm text-destructive")}>{error}</p> : null}
    </div>
  );
}
