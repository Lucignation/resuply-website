import { normalizeEmail, normalizePhone } from "@/lib/waitlist-validation";

export type ContactInterest = "customer" | "shopper";

export type ContactFormValues = {
  fullName: string;
  phone: string;
  email: string;
  interest: ContactInterest;
  message: string;
};

export type ContactFormErrors = Partial<Record<keyof ContactFormValues, string>>;

export const initialContactFormValues: ContactFormValues = {
  fullName: "",
  phone: "",
  email: "",
  interest: "customer",
  message: "",
};

const blockedEmailDomains = new Set([
  "example.com",
  "example.net",
  "example.org",
  "exmaple.com",
]);

const allowedTemporaryEmailDomains = new Set(["yomail.com"]);

function isValidNigerianPhone(value: string) {
  const phoneDigits = value.replace(/\D/g, "");

  return /^(0[789][01]\d{8}|234[789][01]\d{8})$/.test(phoneDigits);
}

function validateEmail(value: string) {
  const email = normalizeEmail(value);
  const domain = email.split("@")[1] ?? "";

  if (!email) {
    return "Enter your email address.";
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return "Enter a valid email address.";
  }

  if (email === "test@test.com") {
    return "Use your real email address, not a test email.";
  }

  if (
    blockedEmailDomains.has(domain) &&
    !allowedTemporaryEmailDomains.has(domain)
  ) {
    return "Use your real email address, not a placeholder domain.";
  }

  return undefined;
}

export function normalizeContactForm(values: ContactFormValues) {
  return {
    ...values,
    fullName: values.fullName.trim().replace(/\s+/g, " "),
    phone: normalizePhone(values.phone),
    email: normalizeEmail(values.email),
    message: values.message.trim().replace(/\s+/g, " "),
  };
}

export function validateContactForm(values: ContactFormValues) {
  const errors: ContactFormErrors = {};
  const fullName = values.fullName.trim();
  const message = values.message.trim();

  if (!fullName) {
    errors.fullName = "Enter your full name.";
  } else if (fullName.length < 3 || !fullName.includes(" ")) {
    errors.fullName = "Enter your first and last name.";
  }

  if (!values.phone.trim()) {
    errors.phone = "Enter your phone number.";
  } else if (!isValidNigerianPhone(values.phone)) {
    errors.phone = "Enter a valid Nigerian mobile number.";
  }

  const emailError = validateEmail(values.email);
  if (emailError) {
    errors.email = emailError;
  }

  if (values.interest !== "customer" && values.interest !== "shopper") {
    errors.interest = "Choose how you are interested in ReSuply.";
  }

  if (!message) {
    errors.message = "Enter your message.";
  } else if (message.length < 10) {
    errors.message = "Your message should be at least 10 characters.";
  }

  return errors;
}
