import type { Metadata } from "next";

export const metadata: Metadata = { title: "Connexion gestion" };

export default function AdminLoginPage() {
  return (
    <section className="mx-auto max-w-md px-6 py-24 md:px-10">
      <p className="text-xs uppercase tracking-[0.22em] text-terracotta">
        Gestion
      </p>
      <h1 className="mt-4 font-display text-4xl text-ink">Connexion</h1>
      <p className="mt-4 text-ink-soft">
        Auth Clerk câblée au Chunk D — pour l&apos;instant cette page est un
        stub.
      </p>
      <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-ink/20 bg-sand px-4 py-1.5 text-xs uppercase tracking-[0.18em] text-ink-soft">
        Stub · auth en Chunk D
      </div>
    </section>
  );
}
