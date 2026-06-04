import type { Metadata } from "next";
import { and, asc, eq, gte, lt, type SQL } from "drizzle-orm";
import { getDb, schema } from "@/db";
import { FilterBar } from "@/components/admin/filter-bar";
import { ReservationCard } from "@/components/admin/reservation-card";
import { ScrollToToday } from "@/components/admin/scroll-to-today";

export const metadata: Metadata = { title: "Réservations" };
export const dynamic = "force-dynamic";

interface SearchParams {
  status?: string;
  service?: string;
  when?: string;
}

const VALID_STATUS = new Set(["pending", "confirmed", "rejected", "cancelled"]);
const VALID_SERVICE = new Set(["midi", "soir"]);

export default async function AdminReservationsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const today = new Date().toISOString().slice(0, 10);

  let rows: Array<typeof schema.reservations.$inferSelect> = [];
  let dbError: string | null = null;

  try {
    const db = getDb();
    const conditions: SQL[] = [];

    if (sp.status && VALID_STATUS.has(sp.status)) {
      conditions.push(eq(schema.reservations.status, sp.status));
    }
    if (sp.service && VALID_SERVICE.has(sp.service)) {
      conditions.push(eq(schema.reservations.service, sp.service));
    }
    if (sp.when === "upcoming") {
      conditions.push(gte(schema.reservations.date, today));
    } else if (sp.when === "past") {
      conditions.push(lt(schema.reservations.date, today));
    }

    rows = await db
      .select()
      .from(schema.reservations)
      .where(conditions.length ? and(...conditions) : undefined)
      .orderBy(
        asc(schema.reservations.date),
        asc(schema.reservations.arrivalTime),
        asc(schema.reservations.createdAt),
      );
  } catch (err) {
    console.error("[/admin/reservations] DB error:", err);
    dbError =
      "Impossible de charger les réservations. La base de données n'est pas configurée ou n'est pas joignable.";
  }

  const nextIndex = rows.findIndex((r) => r.date >= today);

  return (
    <section className="mx-auto max-w-5xl px-4 py-6 md:px-6 md:py-10">
      <header className="mb-6 flex flex-col gap-1">
        <p className="text-xs uppercase tracking-[0.22em] text-terracotta">
          Gestion
        </p>
        <h1 className="font-display text-4xl italic text-ink md:text-5xl">
          Réservations
        </h1>
      </header>

      <div
        id="admin-filters"
        className="sticky top-14 z-30 -mx-4 mb-6 bg-beige/90 px-4 pb-2 pt-1 backdrop-blur md:-mx-6 md:px-6"
      >
        <div className="rounded-lg border border-ink/10 bg-sand/60 p-4">
          <FilterBar />
        </div>
      </div>

      {dbError ? (
        <div className="rounded-md border border-terracotta/30 bg-terracotta/5 p-4 text-sm text-terracotta-dark">
          {dbError}
        </div>
      ) : rows.length === 0 ? (
        <div className="rounded-md border border-ink/10 bg-beige p-8 text-center text-ink-soft">
          <p className="font-display text-2xl italic text-ink">
            Aucune réservation
          </p>
          <p className="mt-2 text-sm">
            Les demandes apparaîtront ici dès qu&apos;un client soumet le
            formulaire.
          </p>
        </div>
      ) : (
        <ul className="space-y-3">
          {rows.map((r, i) => (
            <li key={r.id} id={i === nextIndex ? "admin-next" : undefined}>
              <ReservationCard reservation={r} />
            </li>
          ))}
        </ul>
      )}

      {nextIndex >= 0 && <ScrollToToday targetId="admin-next" />}
    </section>
  );
}
