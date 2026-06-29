import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--ink)]/8 bg-[var(--cream)]/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6 sm:py-4">
        <Link href="/#top" className="flex min-w-0 items-center gap-2 sm:gap-3">
          <Image
            src="/resuply-logo-green.jpeg"
            alt="ReSuply logo"
            width={40}
            height={40}
            priority
            className="size-9 rounded-xl object-cover shadow-sm sm:size-10"
          />
          <span className="font-display text-2xl font-bold italic tracking-tight text-[var(--market-green)] sm:text-2xl">
            ReSuply
          </span>
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-medium text-[var(--ink)]/70 md:flex">
          <Link href="/#how-it-works" className="transition-colors hover:text-[var(--ink)]">
            How it works
          </Link>
          <Link href="/#shoppers" className="transition-colors hover:text-[var(--ink)]">
            Become a shopper
          </Link>
          <Link href="/#trust" className="transition-colors hover:text-[var(--ink)]">
            Trust &amp; safety
          </Link>
          <Link href="/#use-cases" className="transition-colors hover:text-[var(--ink)]">
            Use cases
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
            <Link href="/#waitlist">Become a Shopper</Link>
          </Button>
          <Button asChild size="sm" className="px-4 text-sm sm:px-5">
            <Link href="/#waitlist">Join the Waitlist</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
