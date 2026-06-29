import type { Metadata } from "next";
import { Mail, MapPin } from "lucide-react";
import { Footer } from "@/components/sections/footer";
import { Header } from "@/components/sections/header";

export const metadata: Metadata = {
  title: "Contact | ReSuply",
  description: "Contact ReSuply for customer, shopper, partnership, and privacy questions.",
};

export default function ContactPage() {
  return (
    <>
      <Header />
      <main className="flex-1 px-6 py-20">
        <section className="mx-auto max-w-4xl">
          <p className="font-mono text-xs font-semibold uppercase tracking-widest text-[var(--terracotta)]">
            Contact
          </p>
          <h1 className="mt-4 font-display text-4xl font-semibold leading-tight text-[var(--ink)] sm:text-6xl">
            Talk to ReSuply.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[var(--ink)]/70">
            Have a question about joining the waitlist, becoming a shopper, or
            partnering with ReSuply? Send us a note and we&apos;ll respond as soon
            as we can.
          </p>

          <div className="mt-12 grid gap-5 sm:grid-cols-2">
            <a
              href="mailto:hello@useresuply.com"
              className="rounded-2xl border border-[var(--ink)]/10 bg-white p-6 shadow-sm transition-colors hover:border-[var(--market-green)]/40"
            >
              <Mail className="size-6 text-[var(--market-green)]" />
              <h2 className="mt-5 font-display text-2xl font-semibold text-[var(--ink)]">
                Email
              </h2>
              <p className="mt-2 text-sm text-[var(--ink)]/60">
                hello@useresuply.com
              </p>
            </a>

            <div className="rounded-2xl border border-[var(--ink)]/10 bg-white p-6 shadow-sm">
              <MapPin className="size-6 text-[var(--market-green)]" />
              <h2 className="mt-5 font-display text-2xl font-semibold text-[var(--ink)]">
                Launch Cities
              </h2>
              <p className="mt-2 text-sm text-[var(--ink)]/60">
                Lagos and Abuja
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
