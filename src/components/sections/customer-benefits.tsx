import { Card, CardContent } from "@/components/ui/card";
import {
  ShoppingBasket,
  ShieldCheck,
  RefreshCcw,
  MapPinned,
  Clock,
  Heart,
} from "lucide-react";

const benefits = [
  {
    icon: ShoppingBasket,
    title: "Shop local markets & stores",
    detail: "From Mile 12 to your neighborhood pharmacy — all in one place.",
  },
  {
    icon: ShieldCheck,
    title: "Choose trusted shoppers",
    detail: "Every shopper is verified, rated, and reviewed by real customers.",
  },
  {
    icon: RefreshCcw,
    title: "Approve substitutions",
    detail: "If an item's out, you decide what replaces it — not a stranger.",
  },
  {
    icon: MapPinned,
    title: "Track your order",
    detail: "Know exactly where your shopper is and what's been bought.",
  },
  {
    icon: Clock,
    title: "Save real time",
    detail: "Skip the traffic, the queue, and the back-and-forth haggling.",
  },
  {
    icon: Heart,
    title: "Reorder a favourite shopper",
    detail: "Found someone great? Book them again for your next list.",
  },
];

export function CustomerBenefits() {
  return (
    <section className="bg-[var(--sage)]/50 px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-xl">
          <span className="font-mono text-xs font-semibold uppercase tracking-widest text-[var(--market-green)]">
            For customers
          </span>
          <h2 className="mt-4 font-display text-4xl font-semibold leading-tight tracking-tight text-[var(--ink)] sm:text-5xl">
            Everything you need,
            <span className="italic"> nothing you don&apos;t.</span>
          </h2>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map(({ icon: Icon, title, detail }) => (
            <Card key={title} className="border-none bg-white">
              <CardContent className="pt-0">
                <div className="mb-4 flex size-11 items-center justify-center rounded-xl bg-[var(--sage)]">
                  <Icon className="size-5 text-[var(--market-green)]" />
                </div>
                <h3 className="font-semibold text-[var(--ink)]">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--ink)]/60">
                  {detail}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
