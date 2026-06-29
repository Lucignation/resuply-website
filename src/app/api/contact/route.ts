import {
  normalizeContactForm,
  validateContactForm,
  type ContactFormValues,
} from "@/lib/contact-validation";
import { sendContactMessageEmail } from "@/lib/email";

function isPayload(value: unknown): value is ContactFormValues {
  if (!value || typeof value !== "object") {
    return false;
  }

  const payload = value as Partial<ContactFormValues>;

  return (
    typeof payload.fullName === "string" &&
    typeof payload.phone === "string" &&
    typeof payload.email === "string" &&
    (payload.interest === "customer" || payload.interest === "shopper") &&
    typeof payload.message === "string"
  );
}

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return Response.json({ message: "Invalid request body." }, { status: 400 });
  }

  if (!isPayload(body)) {
    return Response.json({ message: "Invalid contact payload." }, { status: 400 });
  }

  const errors = validateContactForm(body);

  if (Object.keys(errors).length > 0) {
    return Response.json({ errors }, { status: 422 });
  }

  try {
    await sendContactMessageEmail(normalizeContactForm(body));
  } catch (error) {
    console.error("Failed to send contact message", error);
    return Response.json(
      { message: "We could not send your message. Please try again." },
      { status: 500 }
    );
  }

  return Response.json({ ok: true });
}
