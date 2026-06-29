"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

const customerSteps = [
  {
    title: "Create an account",
    detail: "Sign up in under a minute with your phone number.",
  },
  {
    title: "Add your shopping list",
    detail: "Type or speak your list — items, quantities, brand preferences.",
  },
  {
    title: "Select your market or store",
    detail: "Pick a specific market, or let us match you with the best shopper nearby.",
  },
  {
    title: "Pay securely",
    detail: "Your money is held safely until your order is confirmed delivered.",
  },
  {
    title: "Receive your order",
    detail: "Approve substitutions, track progress, and get it the same day.",
  },
];

const shopperSteps = [
  {
    title: "Register",
    detail: "Tell us who you are and where you shop.",
  },
  {
    title: "Get verified",
    detail: "ID check and a short orientation — so customers can trust you.",
  },
  {
    title: "Set your markets",
    detail: "Choose the markets and stores you know best.",
  },
  {
    title: "Accept shopping requests",
    detail: "See nearby orders and accept the ones that fit your route.",
  },
  {
    title: "Complete orders & earn",
    detail: "Get paid per completed order, plus tips and repeat customers.",
  },
];

export function HowItWorks() {
  const [tab, setTab] = useState<"customer" | "shopper">("customer");
  const steps = tab === "customer" ? customerSteps : shopperSteps;

  return (
    <section id="how-it-works" className="px-6 py-24">
      <div className="mx-auto max-w-4xl">
        <div className="text-center">
          <span className="font-mono text-xs font-semibold uppercase tracking-widest text-[var(--market-green)]">
            How ReSuply works
          </span>
          <h2 className="mt-4 font-display text-4xl font-semibold leading-tight tracking-tight text-[var(--ink)] sm:text-5xl">
            Simple, trusted,
            <span className="italic"> done same-day.</span>
          </h2>
        </div>

        <div className="mt-10 flex justify-center">
          <div className="inline-flex rounded-full border border-[var(--ink)]/12 bg-white p-1 shadow-sm">
            <button
              onClick={() => setTab("customer")}
              className={cn(
                "rounded-full px-5 py-2 text-sm font-semibold transition-colors",
                tab === "customer"
                  ? "bg-[var(--market-green)] text-white"
                  : "text-[var(--ink)]/60 hover:text-[var(--ink)]"
              )}
            >
              I&apos;m a customer
            </button>
            <button
              onClick={() => setTab("shopper")}
              className={cn(
                "rounded-full px-5 py-2 text-sm font-semibold transition-colors",
                tab === "shopper"
                  ? "bg-[var(--terracotta)] text-white"
                  : "text-[var(--ink)]/60 hover:text-[var(--ink)]"
              )}
            >
              I&apos;m a shopper
            </button>
          </div>
        </div>

        <ol className="mx-auto mt-14 max-w-2xl">
          {steps.map((step, i) => (
            <li
              key={step.title}
              className="flex gap-5 border-b border-dashed border-[var(--ink)]/12 py-5 last:border-none"
            >
              <span className="font-mono text-sm text-[var(--ink)]/35">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <p className="font-semibold text-[var(--ink)]">{step.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-[var(--ink)]/60">
                  {step.detail}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
