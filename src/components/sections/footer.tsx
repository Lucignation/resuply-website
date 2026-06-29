import Image from "next/image";
import Link from "next/link";

export function Footer() {
  return (
    <footer
      className="px-6 py-14"
      style={{ backgroundColor: "var(--ink)" }}
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <Image
              src="/resuply-logo-green.jpeg"
              alt="ReSuply logo"
              width={40}
              height={40}
              className="size-10 rounded-xl object-cover"
            />
            <span className="font-display text-2xl font-bold italic text-white">
              ReSuply
            </span>
          </div>
          <p className="mt-2 text-sm text-white/50">
            Local shopping, made simple.
          </p>
        </div>

        <nav className="grid grid-cols-2 gap-3 text-sm text-white/60 sm:flex sm:gap-8">
          <Link href="/#how-it-works" className="transition-colors hover:text-white">
            About
          </Link>
          <Link href="/#shoppers" className="transition-colors hover:text-white">
            Earn as a Personal Shopper
          </Link>
          <Link href="/#waitlist" className="transition-colors hover:text-white">
            Join Waitlist
          </Link>
          <Link href="/contact" className="transition-colors hover:text-white">
            Contact
          </Link>
          <Link href="/privacy" className="transition-colors hover:text-white">
            Privacy Policy
          </Link>
          <Link href="/terms" className="transition-colors hover:text-white">
            Terms
          </Link>
        </nav>
      </div>

      <div className="mx-auto mt-10 max-w-6xl border-t border-white/10 pt-6 text-xs text-white/35">
        © {new Date().getFullYear()} ReSuply Technologies Limited. All rights reserved.
      </div>
    </footer>
  );
}
