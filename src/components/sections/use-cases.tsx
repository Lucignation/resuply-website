const useCases = [
  {
    tag: "Markets",
    desc: "Foodstuff, fabrics, and household items from local markets",
  },
  {
    tag: "Pharmacy & wellness",
    desc: "Pharmacy and wellness item pickup from trusted stores",
  },
  {
    tag: "Supermarkets",
    desc: "Groceries and household essentials from your usual store",
  },
  {
    tag: "Malls & gifts",
    desc: "Items from malls, gift shops, and neighborhood stores",
  },
  { tag: "Office supplies", desc: "Stationery, printing, and small errands" },
  {
    tag: "Fashion & fabric",
    desc: "Ankara, lace, fabrics, and local fashion stores",
  },
];

export function UseCases() {
  return (
    <section id="use-cases" className="bg-[var(--cream-dark)] px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-xl">
          <span className="font-mono text-xs font-semibold uppercase tracking-widest text-[var(--market-green)]">
            What people send us
          </span>
          <h2 className="mt-4 font-display text-4xl font-semibold leading-tight tracking-tight text-[var(--ink)] sm:text-5xl">
            If it&apos;s sold somewhere nearby,
            <span className="italic"> we can get it.</span>
          </h2>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {useCases.map(({ tag, desc }) => (
            <div
              key={tag}
              className="group relative rounded-2xl border border-[var(--ink)]/10 bg-white p-6 transition-shadow hover:shadow-md"
            >
              <span className="font-mono text-[11px] font-semibold uppercase tracking-wide text-[var(--terracotta)]">
                {tag}
              </span>
              <p className="mt-2 font-display text-lg font-medium text-[var(--ink)]">
                {desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
