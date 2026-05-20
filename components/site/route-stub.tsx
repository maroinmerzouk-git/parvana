export function RouteStub({
  eyebrow,
  title,
  intro,
  chunk,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  chunk: string;
}) {
  return (
    <section className="mx-auto max-w-3xl px-6 py-24 md:px-10 md:py-32">
      <p className="text-xs uppercase tracking-[0.22em] text-terracotta">
        {eyebrow}
      </p>
      <h1 className="mt-4 font-display text-5xl leading-tight text-ink md:text-6xl">
        {title}
      </h1>
      <p className="mt-6 text-lg text-ink-soft">{intro}</p>
      <div className="mt-10 inline-flex items-center gap-2 rounded-full border border-ink/20 bg-sand px-4 py-1.5 text-xs uppercase tracking-[0.18em] text-ink-soft">
        Stub · contenu en {chunk}
      </div>
    </section>
  );
}
