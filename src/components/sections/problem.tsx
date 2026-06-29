"use client";

import { Clock, Search, UserX, MapPinOff, MessageSquareWarning, Tag } from "lucide-react";

const categories = {
  access: { label: "Access", color: "#E8A33D", bg: "#3A2C12" },
  trust: { label: "Trust", color: "#2BA89A", bg: "#0F2B27" },
  clarity: { label: "Clarity", color: "#FF6B35", bg: "#3A1A0C" },
} as const;

const problems = [
  { text: "No time to go to the market", icon: Clock, category: "access" },
  { text: "Hard to find someone who knows that specific market", icon: Search, category: "access" },
  { text: "Unreliable errand people", icon: UserX, category: "trust" },
  { text: "No way to track your order", icon: MapPinOff, category: "trust" },
  { text: "Poor communication on what was bought", icon: MessageSquareWarning, category: "clarity" },
  { text: "No clear pricing until it's too late", icon: Tag, category: "clarity" },
] as const;

export function Problem() {
  return (
    <section className="bg-[#0F0F14] px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-xl">
          <span className="font-mono text-xs font-semibold uppercase tracking-widest text-[#FF6B35]">
            The problem
          </span>
          <h2 className="mt-4 font-display text-4xl font-semibold leading-tight tracking-tight text-[#F4F1EA] sm:text-5xl">
            Market runs are stressful.
            <br />
            <span className="italic text-[#FF6B35]">
              Finding someone trustworthy is harder.
            </span>
          </h2>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {problems.map(({ text, icon: Icon, category }, i) => {
            const c = categories[category];
            const tilt = i % 2 === 0 ? "-rotate-1" : "rotate-1";
            return (
              <div
                key={text}
                className={`group relative rounded-xl border border-white/10 bg-white/[0.03] p-6 transition-all duration-300 hover:-translate-y-1 hover:rotate-0 hover:border-white/20 ${tilt}`}
                style={{ borderTop: `3px solid ${c.color}` }}
              >
                <span
                  aria-hidden="true"
                  className="absolute -top-[7px] left-6 h-3.5 w-3.5 rounded-full border border-white/10"
                  style={{ backgroundColor: "#0F0F14" }}
                />
                <div
                  className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg"
                  style={{ backgroundColor: c.bg, color: c.color }}
                >
                  <Icon className="h-5 w-5" strokeWidth={2} />
                </div>
                <p className="text-base font-medium leading-snug text-[#F4F1EA]/90">
                  {text}
                </p>
                <span
                  className="mt-3 inline-block font-mono text-[10px] uppercase tracking-widest"
                  style={{ color: c.color }}
                >
                  {c.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}