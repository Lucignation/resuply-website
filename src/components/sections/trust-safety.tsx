import {
  BadgeCheck,
  Star,
  FileClock,
  Lock,
  MessageCircle,
  Scale,
} from "lucide-react";

const trustItems = [
  { icon: BadgeCheck, label: "Verified shopper profiles" },
  { icon: Star, label: "Ratings & reviews on every order" },
  { icon: FileClock, label: "Full order records" },
  { icon: Lock, label: "Secure, escrowed payments" },
  { icon: MessageCircle, label: "In-app customer ↔ shopper chat" },
  { icon: Scale, label: "Dispute support, always" },
];

export function TrustSafety() {
  return (
    <section id="trust" className="bg-[var(--cream)] px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <span className="font-mono text-xs font-semibold uppercase tracking-widest text-[var(--terracotta)]">
            Trust &amp; safety
          </span>
          <h2 className="mt-4 font-display text-4xl font-semibold leading-tight tracking-tight text-[var(--ink)] sm:text-5xl">
            Built for trust,
            <span className="italic"> from day one.</span>
          </h2>
        </div>

        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {trustItems.map(({ icon: Icon, label }, i) => {
            const tilt = i % 2 === 0 ? "-rotate-2" : "rotate-2";
            return (
              <div
                key={label}
                className="group relative rounded-2xl border border-[var(--ink)]/8 bg-white p-7 shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)]"
              >
                <div
                  className={`relative mb-5 inline-flex h-12 w-12 items-center justify-center rounded-full border-2 border-dashed border-[var(--market-green)]/40 transition-transform duration-300 group-hover:rotate-0 ${tilt}`}
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--market-green)]/10">
                    <Icon
                      className="size-[18px] text-[var(--market-green)]"
                      strokeWidth={2}
                    />
                  </div>
                </div>
                <p className="font-medium leading-snug text-[var(--ink)]/85">
                  {label}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}