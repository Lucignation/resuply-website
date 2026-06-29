import { Button } from "@/components/ui/button";
import { Check, ArrowRight } from "lucide-react";

const perks = [
  "Work whenever you want — no fixed shifts",
  "Accept orders within your own area",
  "Build a shopper profile with real ratings",
  "Earn per completed order, plus tips",
  "Get repeat customers who request you by name",
  "Grow your market and store knowledge into a real service",
];

export function ShopperOpportunity() {
  return (
    <section
      id="shoppers"
      className="relative overflow-hidden px-6 py-24"
      style={{ backgroundColor: "var(--market-green)" }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-32 left-[-10%] h-[420px] w-[420px] rounded-full opacity-10 blur-3xl"
        style={{ background: "var(--gold)" }}
      />
      <div className="mx-auto grid max-w-6xl items-center gap-14 md:grid-cols-2">
        <div>
          <span className="font-mono text-xs font-semibold uppercase tracking-widest text-[var(--gold)]">
            For personal shoppers
          </span>
          <h2 className="mt-4 font-display text-4xl font-semibold italic leading-tight tracking-tight text-white sm:text-5xl">
            Turn your local market
            <br />
            and store knowledge into income.
          </h2>
          <p className="mt-5 max-w-md text-white/70">
            Earn money by helping people shop from the markets, supermarkets,
            pharmacies and wellness stores, malls, and local stores you already
            know well.
          </p>
          <Button asChild size="lg" variant="terracotta" className="mt-8">
            <a href="#waitlist">
              Earn as a Personal Shopper <ArrowRight className="size-4" />
            </a>
          </Button>
        </div>

        <ul className="grid gap-3">
          {perks.map((perk) => (
            <li
              key={perk}
              className="flex items-start gap-3 rounded-xl bg-white/8 p-4 backdrop-blur-sm"
            >
              <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-[var(--gold)]">
                <Check className="size-3 text-[var(--market-green-dark)]" strokeWidth={3} />
              </span>
              <span className="text-sm font-medium text-white/90">{perk}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
