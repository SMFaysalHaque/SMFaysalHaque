import type { ContactFormValues } from "@/features/contact/schema/contact-schema";

function buildSummary(values: ContactFormValues) {
  return [
    `Name: ${values.name}`,
    `Email: ${values.email}`,
    "",
    values.message,
  ].join("\n");
}

const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";

/**
 * Sends the contact message straight to the inbox tied to the Web3Forms
 * access key — no email client, no backend. The destination inbox is set by
 * the Web3Forms account (created with the profile email); the visitor's
 * address rides along as the reply-to.
 */
export async function sendEmail(values: ContactFormValues): Promise<void> {
  const accessKey = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY;

  if (!accessKey) {
    throw new Error(
      "Email isn't configured yet — add NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY to your environment."
    );
  }

  const response = await fetch(WEB3FORMS_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      access_key: accessKey,
      subject: `Portfolio inquiry from ${values.name}`,
      from_name: values.name,
      name: values.name,
      email: values.email,
      message: buildSummary(values),
      // Web3Forms rejects the submission server-side if this honeypot is truthy.
      botcheck: values.botcheck ?? false,
    }),
  });

  const data: { success?: boolean; message?: string } = await response
    .json()
    .catch(() => ({ success: false }));

  if (!response.ok || !data.success) {
    throw new Error(data.message ?? "Something went wrong while sending your message.");
  }
}
