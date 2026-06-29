"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { contactHref } from "@/lib/contact";
import { ArrowRight, Mail, MapPin } from "lucide-react";

const listItems = [
  { item: "Tomatoes & pepper mix", market: "Mile 12 Market", price: "₦3,500" },
  { item: "Rice, 1 bag (50kg)", market: "Garki Market", price: "₦68,000" },
  { item: "Wellness items", market: "MedPlus Pharmacy", price: "₦8,400" },
  { item: "Ankara fabric, 6 yards", market: "Wuse Market", price: "₦15,000" },
];

export function Hero() {
  const [checked, setChecked] = useState<number[]>([]);

  useEffect(() => {
    const timers = listItems.map((_, i) =>
      setTimeout(() => {
        setChecked((prev) => [...prev, i]);
      }, 600 + i * 550)
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <section id="top" className="relative overflow-hidden px-6 pt-16 pb-24 md:pt-24 md:pb-32">
      {/* ambient market-green wash */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 right-[-10%] h-[480px] w-[480px] rounded-full opacity-[0.07] blur-3xl"
        style={{ background: "var(--market-green)" }}
      />
      <div className="mx-auto grid max-w-6xl items-center gap-16 md:grid-cols-2">
        <div>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[var(--market-green)]/20 bg-[var(--sage)] px-4 py-1.5 text-xs font-semibold tracking-wide text-[var(--market-green)]">
            <MapPin className="size-3.5" />
            NOW BUILDING IN LAGOS &amp; ABUJA
          </div>

          <h1 className="font-display text-[2.75rem] leading-[1.05] font-semibold tracking-tight text-[var(--ink)] sm:text-6xl">
            Shop from anywhere.
            <br />
            <span className="italic text-[var(--market-green)]">Let a trusted local</span>
            <br />
            shopper handle the rest.
          </h1>

          <p className="mt-6 max-w-md text-lg leading-relaxed text-[var(--ink)]/70">
            ReSuply is a trusted local shopping marketplace connecting
            customers with verified personal shoppers for markets, supermarkets,
            pharmacies and wellness stores, malls, local stores, and more.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Button asChild size="lg">
              <a href="#waitlist">
                Join the Waitlist <ArrowRight className="size-4" />
              </a>
            </Button>
            <Button asChild size="lg" variant="outline">
              <a href={contactHref}>
                <Mail className="size-4" />
                Contact ReSuply
              </a>
            </Button>
            <Button asChild size="lg" variant="ghost">
              <a href="#shoppers">Earn as a Personal Shopper</a>
            </Button>
          </div>

          <p className="mt-5 max-w-lg text-sm leading-relaxed text-[var(--ink)]/55">
            Join the waitlist to get early access when ReSuply launches in
            Lagos, Abuja, and other major cities.
          </p>
        </div>

        {/* Signature element: a torn-paper shopping list that ticks itself off */}
        <div className="relative mx-auto w-full max-w-sm">
          <div
            aria-hidden
            className="absolute -right-4 -top-4 h-full w-full rotate-2 rounded-sm bg-[var(--terracotta)]/15"
          />
          <div className="torn-edge relative rotate-[-1.2deg] rounded-sm bg-white p-7 pb-10 shadow-xl">
            <div className="mb-1 flex items-baseline justify-between border-b border-dashed border-[var(--ink)]/15 pb-3">
              <span className="font-display text-lg font-semibold italic text-[var(--ink)]">
                Today&apos;s list
              </span>
              <span className="font-mono text-xs text-[var(--ink)]/40">
                4 items
              </span>
            </div>

            <ul className="mt-4 flex flex-col gap-4">
              {listItems.map((row, i) => {
                const isChecked = checked.includes(i);
                return (
                  <li key={row.item} className="flex items-start gap-3">
                    <span
                      className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors duration-300"
                      style={{
                        borderColor: isChecked ? "var(--market-green)" : "var(--ink)",
                        backgroundColor: isChecked ? "var(--market-green)" : "transparent",
                        opacity: isChecked ? 1 : 0.35,
                      }}
                    >
                      <svg width="11" height="9" viewBox="0 0 11 9" fill="none">
                        <path
                          className={`check-path ${isChecked ? "checked" : ""}`}
                          d="M1 4.5L4 7.5L10 1"
                          stroke="white"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                    <div className="min-w-0 flex-1">
                      <p
                        className={`text-sm font-medium transition-colors duration-300 ${
                          isChecked ? "text-[var(--ink)]/40 line-through" : "text-[var(--ink)]"
                        }`}
                      >
                        {row.item}
                      </p>
                      <p className="font-mono text-[11px] text-[var(--ink)]/45">
                        {row.market} · {row.price}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>

            <div className="mt-6 flex items-center gap-2 border-t border-dashed border-[var(--ink)]/15 pt-4">
              <div className="flex size-7 items-center justify-center rounded-full bg-[var(--gold)] text-[11px] font-bold text-white">
                CB
              </div>
              <p className="font-mono text-[11px] text-[var(--ink)]/55">
                Chidinma B. is shopping your list now
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
