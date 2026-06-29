"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
  getSpecialtyCategory,
  initialWaitlistValues,
  parseSpecialtyNames,
  validateWaitlistForm,
  type WaitlistFormErrors,
  type WaitlistFormValues,
  type WaitlistRole,
} from "@/lib/waitlist-validation";
import { ArrowRight, CheckCircle2, Plus, Trash2, X } from "lucide-react";

const specialtyExamples = [
  { name: "General groceries", category: "General groceries" },
  { name: "Meat", category: "Meat" },
  { name: "Fish", category: "Fish" },
  { name: "Rice", category: "Staples" },
  { name: "Beans", category: "Staples" },
  { name: "Tomatoes", category: "Produce" },
  { name: "Red Pepper", category: "Produce" },
];

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

function getMarketEntryErrors(
  entry: WaitlistFormValues["marketSpecialties"][number]
) {
  const marketValue = entry.market.trim();
  const specialtyValues = parseSpecialtyNames(entry.specialties);

  let marketError: string | undefined;
  let specialtiesError: string | undefined;

  if (!marketValue) {
    marketError = "Enter the market or store name.";
  } else if (marketValue.length < 3) {
    marketError = "Market or store name should be at least 3 characters.";
  } else if (["lagos", "abuja"].includes(marketValue.toLowerCase())) {
    marketError = "Enter a specific market or store, not just a city.";
  }

  if (specialtyValues.length === 0) {
    specialtiesError = "Add at least one item you are good at buying there.";
  } else if (specialtyValues.some((specialty) => specialty.length < 3)) {
    specialtiesError = "Each item should be at least 3 characters.";
  }

  return { market: marketError, specialties: specialtiesError };
}

export function Waitlist() {
  const [role, setRole] = useState<WaitlistRole>("customer");
  const [values, setValues] =
    useState<WaitlistFormValues>(initialWaitlistValues);
  const [errors, setErrors] = useState<WaitlistFormErrors>({});
  const [touched, setTouched] = useState<
    Partial<Record<keyof WaitlistFormValues, boolean>>
  >({});
  const [specialtyDrafts, setSpecialtyDrafts] = useState([""]);
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
      marketSpecialties: role === "shopper",
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

  function updateMarketSpecialty(
    index: number,
    field: "market" | "specialties",
    value: string
  ) {
    const nextValues = {
      ...values,
      marketSpecialties: values.marketSpecialties.map((entry, entryIndex) =>
        entryIndex === index ? { ...entry, [field]: value } : entry
      ),
    };

    setValues(nextValues);
    setSubmitError("");

    if (touched.marketSpecialties) {
      setErrors(validateWaitlistForm(nextValues, role));
    }
  }

  function addMarketSpecialty() {
    const nextValues = {
      ...values,
      marketSpecialties: [
        ...values.marketSpecialties,
        { market: "", specialties: "" },
      ],
    };

    setValues(nextValues);
    setSpecialtyDrafts((prev) => [...prev, ""]);

    if (touched.marketSpecialties) {
      setErrors(validateWaitlistForm(nextValues, role));
    }
  }

  function removeMarketSpecialty(index: number) {
    const nextValues = {
      ...values,
      marketSpecialties: values.marketSpecialties.filter(
        (_, entryIndex) => entryIndex !== index
      ),
    };

    setValues(nextValues);
    setSpecialtyDrafts((prev) =>
      prev.filter((_, entryIndex) => entryIndex !== index)
    );
    setErrors(validateWaitlistForm(nextValues, role));
  }

  function updateSpecialtyDraft(index: number, value: string) {
    setSpecialtyDrafts((prev) => {
      const nextDrafts = [...prev];
      nextDrafts[index] = value;
      return nextDrafts;
    });
  }

  function addSpecialtyToMarket(index: number, specialty: string) {
    const nextSpecialties = specialty.trim();

    if (!nextSpecialties) {
      return;
    }

    const existingSpecialties = parseSpecialtyNames(
      values.marketSpecialties[index]?.specialties ?? ""
    );
    const specialtiesToAdd = parseSpecialtyNames(nextSpecialties);
    const mergedSpecialties = [...existingSpecialties];

    for (const item of specialtiesToAdd) {
      const alreadyExists = mergedSpecialties.some(
        (specialty) => specialty.toLowerCase() === item.toLowerCase()
      );

      if (!alreadyExists) {
        mergedSpecialties.push(item);
      }
    }

    updateMarketSpecialty(index, "specialties", mergedSpecialties.join(", "));
    updateSpecialtyDraft(index, "");
    setTouched((prev) => ({ ...prev, marketSpecialties: true }));
  }

  function removeSpecialtyFromMarket(index: number, specialtyToRemove: string) {
    const nextSpecialties = parseSpecialtyNames(
      values.marketSpecialties[index]?.specialties ?? ""
    ).filter(
      (specialty) =>
        specialty.toLowerCase() !== specialtyToRemove.toLowerCase()
    );

    updateMarketSpecialty(index, "specialties", nextSpecialties.join(", "));
    setTouched((prev) => ({ ...prev, marketSpecialties: true }));
  }

  function handleSpecialtyKeyDown(
    event: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) {
    if (event.key !== "Enter") {
      return;
    }

    event.preventDefault();
    addSpecialtyToMarket(index, specialtyDrafts[index] ?? "");
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
    <section id="waitlist" className="px-4 py-14 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-2xl">
        <div className="text-center">
          <span className="font-mono text-xs font-semibold uppercase tracking-widest text-[var(--terracotta)]">
            Join us
          </span>
          <h2 className="mt-4 font-display text-3xl font-semibold leading-tight tracking-tight text-[var(--ink)] sm:text-5xl">
            Be among the first
            <span className="italic"> to use ReSuply.</span>
          </h2>
        </div>

        <div className="mt-8 rounded-3xl border border-[var(--ink)]/10 bg-white p-5 shadow-sm sm:mt-10 sm:p-10">
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
              className="flex flex-col gap-5 sm:gap-6"
            >
              <div className="flex justify-center">
                <div className="grid w-full grid-cols-2 rounded-full border border-[var(--ink)]/12 bg-[var(--cream)] p-1 sm:inline-grid sm:max-w-xl">
                  <button
                    type="button"
                    onClick={() => handleRoleChange("customer")}
                    className={cn(
                      "min-h-11 rounded-full px-3 py-2 text-sm font-semibold leading-tight transition-colors sm:px-5",
                      role === "customer"
                        ? "bg-[var(--market-green)] text-white"
                        : "text-[var(--ink)]/60 hover:text-[var(--ink)]"
                    )}
                  >
                    <span className="sm:hidden">Shop with ReSuply</span>
                    <span className="hidden sm:inline">
                      I want to shop with ReSuply
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRoleChange("shopper")}
                    className={cn(
                      "min-h-11 rounded-full px-3 py-2 text-sm font-semibold leading-tight transition-colors sm:px-5",
                      role === "shopper"
                        ? "bg-[var(--terracotta)] text-white"
                        : "text-[var(--ink)]/60 hover:text-[var(--ink)]"
                    )}
                  >
                    <span className="sm:hidden">Earn as shopper</span>
                    <span className="hidden sm:inline">
                      I want to earn as a shopper
                    </span>
                  </button>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 sm:gap-5">
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

              <div className="grid gap-4 sm:grid-cols-2 sm:gap-5">
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
                <div className="rounded-2xl border border-[var(--ink)]/10 bg-[var(--cream)]/55 p-4 sm:p-5">
                  <div className="mb-4 sm:mb-5">
                    <p className="text-sm font-semibold text-[var(--ink)]">
                      Shopper matching details
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-[var(--ink)]/60">
                      This helps us match customers with shoppers by market and
                      what they are best at buying.
                    </p>
                  </div>

                  <div className="flex flex-col gap-3 sm:gap-4">
                    {values.marketSpecialties.map((entry, index) => (
                      <div key={index}>
                        {(() => {
                          const entryErrors = getMarketEntryErrors(entry);
                          const showErrors = Boolean(touched.marketSpecialties);
                          const marketError = showErrors
                            ? entryErrors.market
                            : undefined;
                          const specialtyError = showErrors
                            ? entryErrors.specialties
                            : undefined;

                          return (
                            <div
                              className={cn(
                                "rounded-2xl border bg-white p-3 sm:p-4",
                                marketError || specialtyError
                                  ? "border-[var(--terracotta-dark)]/45"
                                  : "border-[var(--ink)]/10"
                              )}
                            >
                              <div className="mb-3 flex items-center justify-between gap-3 sm:mb-4">
                                <p className="text-sm font-semibold text-[var(--ink)]">
                                  Market / Store {index + 1}
                                </p>
                                {values.marketSpecialties.length > 1 ? (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      removeMarketSpecialty(index)
                                    }
                                    className="inline-flex size-9 items-center justify-center rounded-full text-[var(--ink)]/45 transition hover:bg-[var(--cream-dark)] hover:text-[var(--terracotta-dark)]"
                                    aria-label={`Remove market ${index + 1}`}
                                  >
                                    <Trash2 className="size-4" />
                                  </button>
                                ) : null}
                              </div>

                              <div className="flex flex-col gap-4">
                                <div className="flex flex-col gap-2">
                                  <Label htmlFor={`market-${index}`}>
                                    Market or store
                                  </Label>
                                  <Input
                                    id={`market-${index}`}
                                    value={entry.market}
                                    onBlur={() =>
                                      handleBlur("marketSpecialties")
                                    }
                                    onChange={(e) =>
                                      updateMarketSpecialty(
                                        index,
                                        "market",
                                        e.target.value
                                      )
                                    }
                                    placeholder="e.g. Mile 12 Market"
                                    aria-invalid={Boolean(marketError)}
                                    aria-describedby={
                                      marketError
                                        ? `market-${index}-error`
                                        : undefined
                                    }
                                    className={cn(
                                      marketError &&
                                        "border-[var(--terracotta-dark)] focus-visible:border-[var(--terracotta-dark)]"
                                    )}
                                  />
                                  <FieldError
                                    id={`market-${index}-error`}
                                    message={marketError}
                                  />
                                </div>

                                <div className="flex flex-col gap-2">
                                  <Label htmlFor={`specialties-${index}`}>
                                    Items you buy best there
                                  </Label>

                                  {parseSpecialtyNames(entry.specialties)
                                    .length > 0 ? (
                                    <div className="flex flex-wrap gap-2">
                                      {parseSpecialtyNames(
                                        entry.specialties
                                      ).map((specialty) => (
                                        <span
                                          key={specialty}
                                          className="inline-flex min-h-9 max-w-full items-center gap-2 rounded-full border border-[var(--market-green)]/20 bg-[var(--sage)] px-3 py-1 text-sm font-semibold text-[var(--market-green)]"
                                        >
                                          <span className="min-w-0 truncate">
                                            {specialty}
                                          </span>
                                          <span className="rounded-full bg-white/70 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[var(--market-green)]/65 max-[380px]:hidden">
                                            {getSpecialtyCategory(specialty)}
                                          </span>
                                          <button
                                            type="button"
                                            onClick={() =>
                                              removeSpecialtyFromMarket(
                                                index,
                                                specialty
                                              )
                                            }
                                            className="inline-flex size-5 items-center justify-center rounded-full bg-white/70 text-[var(--market-green)] transition hover:bg-white hover:text-[var(--terracotta-dark)]"
                                            aria-label={`Remove ${specialty}`}
                                          >
                                            <X className="size-3" />
                                          </button>
                                        </span>
                                      ))}
                                    </div>
                                  ) : null}

                                  <Input
                                    id={`specialties-${index}`}
                                    value={specialtyDrafts[index] ?? ""}
                                    onBlur={() =>
                                      handleBlur("marketSpecialties")
                                    }
                                    onKeyDown={(event) =>
                                      handleSpecialtyKeyDown(event, index)
                                    }
                                    onChange={(e) =>
                                      updateSpecialtyDraft(
                                        index,
                                        e.target.value
                                      )
                                    }
                                    placeholder="Type item, press Enter"
                                    aria-invalid={Boolean(specialtyError)}
                                    aria-describedby={
                                      specialtyError
                                        ? `specialties-${index}-error`
                                        : undefined
                                    }
                                    className={cn(
                                      specialtyError &&
                                        "border-[var(--terracotta-dark)] focus-visible:border-[var(--terracotta-dark)]"
                                    )}
                                  />
                                  <div className="flex flex-wrap gap-2">
                                    {specialtyExamples.map((specialty) => (
                                      <button
                                        key={specialty.name}
                                        type="button"
                                        onClick={() =>
                                          addSpecialtyToMarket(
                                            index,
                                            specialty.name
                                          )
                                        }
                                        className="inline-flex min-h-9 items-center gap-2 rounded-full border border-[var(--market-green)]/15 bg-[var(--sage)]/60 px-3 py-1 text-sm font-medium text-[var(--market-green)] transition hover:border-[var(--market-green)]/40 hover:bg-[var(--sage)] sm:text-xs"
                                      >
                                        {specialty.name}
                                        <span className="hidden rounded-full bg-white/70 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[var(--market-green)]/65 sm:inline-flex">
                                          {specialty.category}
                                        </span>
                                      </button>
                                    ))}
                                  </div>
                                  <p className="text-xs text-[var(--ink)]/55">
                                    Click a suggestion or type your own item and
                                    press Enter.
                                  </p>
                                  <FieldError
                                    id={`specialties-${index}-error`}
                                    message={specialtyError}
                                  />
                                </div>
                              </div>
                            </div>
                          );
                        })()}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addMarketSpecialty}
                      className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-[var(--market-green)]/25 bg-white px-3 py-2 text-sm font-semibold text-[var(--market-green)] transition hover:border-[var(--market-green)]/50 hover:bg-[var(--sage)] sm:px-4"
                    >
                      <Plus className="size-4" />
                      Add another market/store
                    </button>

                    <div>
                      <p className="text-xs leading-relaxed text-[var(--ink)]/55">
                        Example: Mile 12 Market → rice, beans, tomatoes, red
                        pepper. Balogun Market → fabrics, clothes, shoes.
                      </p>
                      <FieldError
                        id="marketSpecialties-error"
                        message={
                          touched.marketSpecialties
                            ? errors.marketSpecialties
                            : undefined
                        }
                      />
                    </div>
                  </div>
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
