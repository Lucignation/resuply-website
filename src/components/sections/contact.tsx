"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { supportEmail } from "@/lib/contact";
import {
  initialContactFormValues,
  validateContactForm,
  type ContactFormErrors,
  type ContactFormValues,
  type ContactInterest,
} from "@/lib/contact-validation";
import { ArrowRight, CheckCircle2, Mail } from "lucide-react";

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) {
    return null;
  }

  return (
    <p id={id} className="text-sm font-medium text-[var(--terracotta-dark)]">
      {message}
    </p>
  );
}

export function ContactSection() {
  const [values, setValues] = useState<ContactFormValues>(
    initialContactFormValues
  );
  const [errors, setErrors] = useState<ContactFormErrors>({});
  const [touched, setTouched] = useState<
    Partial<Record<keyof ContactFormValues, boolean>>
  >({});
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  function handleChange(field: keyof ContactFormValues, value: string) {
    const nextValues = { ...values, [field]: value };
    setValues(nextValues);
    setSubmitError("");

    if (touched[field]) {
      setErrors(validateContactForm(nextValues));
    }
  }

  function handleInterestChange(interest: ContactInterest) {
    const nextValues = { ...values, interest };
    setValues(nextValues);
    setTouched((prev) => ({ ...prev, interest: true }));
    setErrors(validateContactForm(nextValues));
  }

  function handleBlur(field: keyof ContactFormValues) {
    setTouched((prev) => ({ ...prev, [field]: true }));
    setErrors(validateContactForm(values));
  }

  function inputState(field: keyof ContactFormValues) {
    const message = touched[field] ? errors[field] : undefined;

    return {
      "aria-invalid": Boolean(message),
      "aria-describedby": message ? `contact-${field}-error` : undefined,
      className: cn(
        message &&
          "border-[var(--terracotta-dark)] focus-visible:border-[var(--terracotta-dark)]"
      ),
    };
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const nextErrors = validateContactForm(values);
    setErrors(nextErrors);
    setSubmitError("");
    setTouched({
      fullName: true,
      phone: true,
      email: true,
      interest: true,
      message: true,
    });

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const result = await response.json().catch(() => ({}));

      if (response.status === 422 && result.errors) {
        setErrors(result.errors);
        return;
      }

      if (!response.ok) {
        setSubmitError(
          result.message ?? "We could not send your message. Please try again."
        );
        return;
      }

      setSubmitted(true);
      setValues(initialContactFormValues);
      setTouched({});
    } catch {
      setSubmitError("Network error. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section
      id="contact"
      className="scroll-mt-24 bg-[var(--cream-dark)] px-4 py-14 sm:px-6 sm:py-24"
    >
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <div>
          <span className="font-mono text-xs font-semibold uppercase tracking-widest text-[var(--terracotta)]">
            Contact
          </span>
          <h2 className="mt-4 font-display text-3xl font-semibold leading-tight tracking-tight text-[var(--ink)] sm:text-5xl">
            Have questions
            <span className="italic"> about ReSuply?</span>
          </h2>
          <p className="mt-5 max-w-lg text-base leading-relaxed text-[var(--ink)]/65">
            Ask about joining the waitlist, earning as a personal shopper, or
            how ReSuply will work for local shopping across Nigerian cities.
          </p>
          <a
            href={`mailto:${supportEmail}`}
            className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[var(--market-green)] transition-colors hover:text-[var(--market-green-dark)]"
          >
            <Mail className="size-4" />
            {supportEmail}
          </a>
        </div>

        <div className="rounded-3xl border border-[var(--ink)]/10 bg-white p-5 shadow-sm sm:p-8">
          {submitted ? (
            <div className="flex flex-col items-center py-8 text-center">
              <CheckCircle2 className="size-12 text-[var(--market-green)]" />
              <h3 className="mt-5 font-display text-2xl font-semibold text-[var(--ink)]">
                Message sent.
              </h3>
              <p className="mt-2 max-w-sm text-sm leading-relaxed text-[var(--ink)]/60">
                Thanks for reaching out. The ReSuply team will reply as soon as
                possible.
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              noValidate
              className="flex flex-col gap-5"
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="contactFullName">Full name</Label>
                  <Input
                    id="contactFullName"
                    name="fullName"
                    value={values.fullName}
                    onBlur={() => handleBlur("fullName")}
                    onChange={(event) =>
                      handleChange("fullName", event.target.value)
                    }
                    placeholder="Chidinma Bello"
                    {...inputState("fullName")}
                  />
                  <FieldError
                    id="contact-fullName-error"
                    message={touched.fullName ? errors.fullName : undefined}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="contactPhone">Phone number</Label>
                  <Input
                    id="contactPhone"
                    name="phone"
                    type="tel"
                    value={values.phone}
                    onBlur={() => handleBlur("phone")}
                    onChange={(event) =>
                      handleChange("phone", event.target.value)
                    }
                    placeholder="080X XXX XXXX"
                    {...inputState("phone")}
                  />
                  <FieldError
                    id="contact-phone-error"
                    message={touched.phone ? errors.phone : undefined}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="contactEmail">Email address</Label>
                <Input
                  id="contactEmail"
                  name="email"
                  type="email"
                  value={values.email}
                  onBlur={() => handleBlur("email")}
                  onChange={(event) =>
                    handleChange("email", event.target.value)
                  }
                  placeholder="you@example.com"
                  {...inputState("email")}
                />
                <FieldError
                  id="contact-email-error"
                  message={touched.email ? errors.email : undefined}
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label>I am interested as</Label>
                <div className="grid grid-cols-2 rounded-full border border-[var(--ink)]/12 bg-[var(--cream)] p-1">
                  <button
                    type="button"
                    onClick={() => handleInterestChange("customer")}
                    className={cn(
                      "min-h-11 rounded-full px-3 py-2 text-sm font-semibold leading-tight transition-colors",
                      values.interest === "customer"
                        ? "bg-[var(--market-green)] text-white"
                        : "text-[var(--ink)]/60 hover:text-[var(--ink)]"
                    )}
                  >
                    Customer
                  </button>
                  <button
                    type="button"
                    onClick={() => handleInterestChange("shopper")}
                    className={cn(
                      "min-h-11 rounded-full px-3 py-2 text-sm font-semibold leading-tight transition-colors",
                      values.interest === "shopper"
                        ? "bg-[var(--terracotta)] text-white"
                        : "text-[var(--ink)]/60 hover:text-[var(--ink)]"
                    )}
                  >
                    Personal Shopper
                  </button>
                </div>
                <FieldError
                  id="contact-interest-error"
                  message={touched.interest ? errors.interest : undefined}
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="contactMessage">Message</Label>
                <textarea
                  id="contactMessage"
                  name="message"
                  value={values.message}
                  onBlur={() => handleBlur("message")}
                  onChange={(event) =>
                    handleChange("message", event.target.value)
                  }
                  placeholder="Ask us anything about ReSuply..."
                  rows={5}
                  {...inputState("message")}
                  className={cn(
                    "flex min-h-32 w-full min-w-0 resize-y rounded-xl border-2 border-[var(--ink)]/15 bg-white px-4 py-3 text-base text-[var(--ink)] shadow-sm outline-none transition-colors placeholder:text-[var(--ink)]/40 focus-visible:border-[var(--market-green)] disabled:pointer-events-none disabled:opacity-50",
                    inputState("message").className
                  )}
                />
                <FieldError
                  id="contact-message-error"
                  message={touched.message ? errors.message : undefined}
                />
              </div>

              {submitError ? (
                <p className="text-sm font-medium text-[var(--terracotta-dark)]">
                  {submitError}
                </p>
              ) : null}

              <Button type="submit" size="lg" disabled={isSubmitting}>
                {isSubmitting ? "Sending..." : "Send Message"}
                <ArrowRight className="size-4" />
              </Button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
