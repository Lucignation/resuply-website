"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
  initialWaitlistValues,
  validateWaitlistForm,
  type WaitlistFormErrors,
  type WaitlistFormValues,
  type WaitlistRole,
} from "@/lib/waitlist-validation";
import { ArrowRight, CheckCircle2 } from "lucide-react";

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


export function Waitlist() {
  const [role, setRole] = useState<WaitlistRole>("customer");
  const [values, setValues] =
    useState<WaitlistFormValues>(initialWaitlistValues);
  const [errors, setErrors] = useState<WaitlistFormErrors>({});
  const [touched, setTouched] = useState<
    Partial<Record<keyof WaitlistFormValues, boolean>>
  >({});
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const nextErrors = validateWaitlistForm(values, role);
    setErrors(nextErrors);
    setSubmitError("");
    setTouched({
      fullName: true,
      phone: true,
      email: true,
      city: true,
      markets: role === "shopper",
    });

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, role }),
      });
      const result = await response.json().catch(() => ({}));

      if (response.status === 422 && result.errors) {
        setErrors(result.errors);
        return;
      }

      if (response.status === 409) {
        setSubmitError(
          result.message ?? "This email is already on the ReSuply list."
        );
        return;
      }

      if (!response.ok) {
        setSubmitError(
          result.message ?? "We could not save your details. Please try again."
        );
        return;
      }

      setSubmitted(true);
    } catch {
      setSubmitError("Network error. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleRoleChange(nextRole: WaitlistRole) {
    setRole(nextRole);
    setErrors(validateWaitlistForm(values, nextRole));
  }

  function handleChange(field: keyof WaitlistFormValues, value: string) {
    const nextValues = { ...values, [field]: value };
    setValues(nextValues);
    setSubmitError("");

    if (touched[field]) {
      setErrors(validateWaitlistForm(nextValues, role));
    }
  }

  function handleBlur(field: keyof WaitlistFormValues) {
    setTouched((prev) => ({ ...prev, [field]: true }));
    setErrors(validateWaitlistForm(values, role));
  }

  function inputState(field: keyof WaitlistFormValues) {
    const message = touched[field] ? errors[field] : undefined;

    return {
      "aria-invalid": Boolean(message),
      "aria-describedby": message ? `${field}-error` : undefined,
      className: cn(
        message &&
          "border-[var(--terracotta-dark)] focus-visible:border-[var(--terracotta-dark)]"
      ),
    };
  }

  return (
    <section id="waitlist" className="px-6 py-24">
      <div className="mx-auto max-w-2xl">
        <div className="text-center">
          <span className="font-mono text-xs font-semibold uppercase tracking-widest text-[var(--terracotta)]">
            Join us
          </span>
          <h2 className="mt-4 font-display text-4xl font-semibold leading-tight tracking-tight text-[var(--ink)] sm:text-5xl">
            Be among the first
            <span className="italic"> to use ReSuply.</span>
          </h2>
        </div>

        <div className="mt-10 rounded-3xl border border-[var(--ink)]/10 bg-white p-8 shadow-sm sm:p-10">
          {submitted ? (
            <div className="flex flex-col items-center py-8 text-center">
              <CheckCircle2 className="size-12 text-[var(--market-green)]" />
              <h3 className="mt-5 font-display text-2xl font-semibold text-[var(--ink)]">
                You&apos;re on the list!
              </h3>
              <p className="mt-2 max-w-sm text-sm text-[var(--ink)]/60">
                We&apos;ll reach out as soon as ReSuply launches in your city.
                Thanks for joining us early.
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              noValidate
              className="flex flex-col gap-6"
            >
              <div className="flex justify-center">
                <div className="inline-flex rounded-full border border-[var(--ink)]/12 bg-[var(--cream)] p-1">
                  <button
                    type="button"
                    onClick={() => handleRoleChange("customer")}
                    className={cn(
                      "rounded-full px-5 py-2 text-sm font-semibold transition-colors",
                      role === "customer"
                        ? "bg-[var(--market-green)] text-white"
                        : "text-[var(--ink)]/60 hover:text-[var(--ink)]"
                    )}
                  >
                    I want to shop with ReSuply
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRoleChange("shopper")}
                    className={cn(
                      "rounded-full px-5 py-2 text-sm font-semibold transition-colors",
                      role === "shopper"
                        ? "bg-[var(--terracotta)] text-white"
                        : "text-[var(--ink)]/60 hover:text-[var(--ink)]"
                    )}
                  >
                    I want to earn as a shopper
                  </button>
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="fullName">Full name</Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    value={values.fullName}
                    onBlur={() => handleBlur("fullName")}
                    onChange={(e) => handleChange("fullName", e.target.value)}
                    placeholder="Chidinma Bello"
                    {...inputState("fullName")}
                  />
                  <FieldError
                    id="fullName-error"
                    message={touched.fullName ? errors.fullName : undefined}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="phone">Phone number</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={values.phone}
                    onBlur={() => handleBlur("phone")}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    placeholder="080X XXX XXXX"
                    {...inputState("phone")}
                  />
                  <FieldError
                    id="phone-error"
                    message={touched.phone ? errors.phone : undefined}
                  />
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="email">Email address</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={values.email}
                    onBlur={() => handleBlur("email")}
                    onChange={(e) => handleChange("email", e.target.value)}
                    placeholder="you@example.com"
                    {...inputState("email")}
                  />
                  <FieldError
                    id="email-error"
                    message={touched.email ? errors.email : undefined}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    name="city"
                    value={values.city}
                    onBlur={() => handleBlur("city")}
                    onChange={(e) => handleChange("city", e.target.value)}
                    placeholder="Lagos or Abuja"
                    {...inputState("city")}
                  />
                  <FieldError
                    id="city-error"
                    message={touched.city ? errors.city : undefined}
                  />
                </div>
              </div>

              {role === "shopper" && (
                <div className="flex flex-col gap-2">
                  <Label htmlFor="markets">
                    Which markets or stores do you know well?
                  </Label>
                  <Input
                    id="markets"
                    name="markets"
                    value={values.markets}
                    onBlur={() => handleBlur("markets")}
                    onChange={(e) => handleChange("markets", e.target.value)}
                    placeholder="Separate each market or store with commas"
                    {...inputState("markets")}
                  />
                  <p className="text-xs text-[var(--ink)]/55">
                    Example: Mile 12 Market, Shoprite Sangotedo, Balogun Market
                  </p>
                  <FieldError
                    id="markets-error"
                    message={touched.markets ? errors.markets : undefined}
                  />
                </div>
              )}

              {submitError ? (
                <p className="text-sm font-medium text-[var(--terracotta-dark)]">
                  {submitError}
                </p>
              ) : null}

              <Button
                type="submit"
                size="lg"
                className="mt-2 w-full"
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? "Saving..."
                  : role === "customer"
                    ? "Join the Waitlist"
                    : "Apply to Become a Shopper"}
                <ArrowRight className="size-4" />
              </Button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
