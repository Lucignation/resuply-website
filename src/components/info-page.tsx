import Link from "next/link";

type InfoPageSection = {
  title: string;
  body: string[];
};

type InfoPageProps = {
  eyebrow: string;
  title: string;
  updatedAt: string;
  intro: string;
  sections: InfoPageSection[];
};

export function InfoPage({
  eyebrow,
  title,
  updatedAt,
  intro,
  sections,
}: InfoPageProps) {
  return (
    <main className="flex-1 px-6 py-20">
      <article className="mx-auto max-w-3xl">
        <Link
          href="/"
          className="text-sm font-semibold text-[var(--market-green)] transition-colors hover:text-[var(--market-green-dark)]"
        >
          Back to ReSuply
        </Link>

        <div className="mt-10">
          <p className="font-mono text-xs font-semibold uppercase tracking-widest text-[var(--terracotta)]">
            {eyebrow}
          </p>
          <h1 className="mt-4 font-display text-4xl font-semibold leading-tight text-[var(--ink)] sm:text-6xl">
            {title}
          </h1>
          <p className="mt-4 text-sm font-medium text-[var(--ink)]/50">
            Last updated: {updatedAt}
          </p>
          <p className="mt-8 text-lg leading-relaxed text-[var(--ink)]/70">
            {intro}
          </p>
        </div>

        <div className="mt-12 flex flex-col gap-10">
          {sections.map((section) => (
            <section key={section.title}>
              <h2 className="font-display text-2xl font-semibold text-[var(--ink)]">
                {section.title}
              </h2>
              <div className="mt-4 flex flex-col gap-4 text-base leading-relaxed text-[var(--ink)]/70">
                {section.body.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </section>
          ))}
        </div>
      </article>
    </main>
  );
}
