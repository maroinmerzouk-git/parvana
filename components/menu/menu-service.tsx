import type { MenuService } from "@/lib/menu";

const tagStyles: Record<string, string> = {
  végétarien: "text-emerald-800 border-emerald-800/30 bg-emerald-50",
  vegan: "text-emerald-900 border-emerald-900/30 bg-emerald-50",
  épicé: "text-terracotta border-terracotta/40 bg-terracotta/5",
  signature: "text-terracotta-dark border-terracotta-dark/40 bg-sand",
  "fait maison": "text-ink-soft border-ink/20 bg-beige",
  soupe: "text-ink-soft border-ink/20 bg-beige",
};

export function MenuServiceBlock({
  label,
  service,
}: {
  label: string;
  service: MenuService;
}) {
  if (!service.active) {
    return (
      <section className="border-b border-ink/10 bg-sand">
        <div className="mx-auto max-w-4xl px-6 py-16 md:px-10 md:py-20">
          <p className="text-xs uppercase tracking-[0.22em] text-terracotta">
            Menu {label}
          </p>
          <h2 className="mt-4 font-display text-4xl italic text-ink md:text-5xl">
            À venir
          </h2>
          <p className="mt-4 max-w-prose text-ink-soft">{service.intro}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="border-b border-ink/10">
      <div className="mx-auto max-w-5xl px-6 py-20 md:px-10 md:py-24">
        <header className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-terracotta">
              Menu {label}
            </p>
            <h2 className="mt-3 font-display text-5xl italic leading-tight text-ink md:text-6xl">
              La carte
            </h2>
          </div>
          {service.formule && (
            <p className="font-display text-xl italic text-terracotta md:text-right md:text-2xl">
              {service.formule}
            </p>
          )}
        </header>

        <p className="mt-6 max-w-2xl text-ink-soft">{service.intro}</p>

        <div className="mt-16 space-y-16">
          {service.categories.map((cat) => (
            <div key={cat.title}>
              <h3 className="font-display text-2xl italic text-ink md:text-3xl">
                {cat.title}
              </h3>
              <ul className="mt-6 divide-y divide-ink/10 border-y border-ink/10">
                {cat.items.map((item) => (
                  <li
                    key={item.name}
                    className="grid gap-3 py-6 md:grid-cols-[1fr_auto] md:gap-8"
                  >
                    <div>
                      <div className="flex flex-wrap items-baseline gap-3">
                        <h4 className="font-display text-xl text-ink md:text-2xl">
                          {item.name}
                        </h4>
                        {item.tags?.map((tag) => (
                          <span
                            key={tag}
                            className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] uppercase tracking-[0.12em] ${tagStyles[tag] ?? "text-ink-soft border-ink/20 bg-beige"}`}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      {item.description && (
                        <p className="mt-2 max-w-prose text-ink-soft">
                          {item.description}
                        </p>
                      )}
                    </div>
                    {item.price && (
                      <span className="font-display text-xl text-terracotta md:text-right md:text-2xl">
                        {item.price}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
