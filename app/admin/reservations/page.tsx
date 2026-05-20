import type { Metadata } from "next";

export const metadata: Metadata = { title: "Réservations" };

export default function AdminReservationsPage() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-12 md:px-10">
      <p className="text-xs uppercase tracking-[0.22em] text-terracotta">
        Gestion
      </p>
      <h1 className="mt-4 font-display text-4xl text-ink">Réservations</h1>
      <p className="mt-4 max-w-prose text-ink-soft">
        Tableau de bord mobile-first des demandes de réservation. Filtres par
        statut/date/service, boutons confirmer/refuser et envoi automatique des
        emails clients.
      </p>
      <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-ink/20 bg-sand px-4 py-1.5 text-xs uppercase tracking-[0.18em] text-ink-soft">
        Stub · table + actions en Chunk D
      </div>
    </section>
  );
}
