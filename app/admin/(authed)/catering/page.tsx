import type { Metadata } from "next";
import { asc, eq, ne } from "drizzle-orm";
import { getDb, schema } from "@/db";
import { CateringCard } from "@/components/admin/catering-card";

export const metadata: Metadata = { title: "Traiteur — gestion" };
export const dynamic = "force-dynamic";

interface SearchParams {
  status?: string;
}

const VALID_STATUS = new Set(["new", "seen", "archived"]);

export default async function AdminCateringPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;

  let rows: Array<typeof schema.cateringRequests.$inferSelect> = [];
  let dbError: string | null = null;

  try {
    const db = getDb();
    const whereClause =
      sp.status && VALID_STATUS.has(sp.status)
        ? eq(schema.cateringRequests.status, sp.status)
        : ne(schema.cateringRequests.status, "archived");

    rows = await db
      .select()
      .from(schema.cateringRequests)
      .where(whereClause)
      .orderBy(
        asc(schema.cateringRequests.eventDate),
        asc(schema.cateringRequests.createdAt),
      );
  } catch (err) {
    console.error("[/admin/catering] DB error:", err);
    dbError =
      "Impossible de charger les demandes traiteur. La base de données n'est pas configurée ou n'est pas joignable.";
  }

  const activeStatus = sp.status ?? "active";

  return (
    <section className="mx-auto max-w-5xl px-4 py-6 md:px-6 md:py-10">
      <header className="mb-6 flex flex-col gap-1">
        <p className="text-xs uppercase tracking-[0.22em] text-terracotta">
          Gestion
        </p>
        <h1 className="font-display text-4xl italic text-ink md:text-5xl">
          Traiteur
        </h1>
      </header>

      <div className="mb-6 flex flex-wrap gap-2 rounded-lg border border-ink/10 bg-sand/60 p-3">
        <FilterPill href="/admin/catering" label="Actives" active={activeStatus === "active"} />
        <FilterPill href="/admin/catering?status=new" label="Nouvelles" active={activeStatus === "new"} />
        <FilterPill href="/admin/catering?status=seen" label="Vues" active={activeStatus === "seen"} />
        <FilterPill href="/admin/catering?status=archived" label="Archivées" active={activeStatus === "archived"} />
      </div>

      {dbError ? (
        <div className="rounded-md border border-terracotta/30 bg-terracotta/5 p-4 text-sm text-terracotta-dark">
          {dbError}
        </div>
      ) : rows.length === 0 ? (
        <div className="rounded-md border border-ink/10 bg-beige p-8 text-center text-ink-soft">
          <p className="font-display text-2xl italic text-ink">
            Aucune demande
          </p>
          <p className="mt-2 text-sm">
            Les demandes traiteur apparaîtront ici dès qu&apos;un client soumet
            le formulaire.
          </p>
        </div>
      ) : (
        <ul className="space-y-3">
          {rows.map((r) => (
            <li key={r.id}>
              <CateringCard request={r} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function FilterPill({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active: boolean;
}) {
  return (
    <a
      href={href}
      className={`rounded-full px-3 py-1.5 text-xs uppercase tracking-[0.14em] ${
        active
          ? "bg-terracotta text-beige"
          : "bg-beige text-ink-soft hover:text-ink"
      }`}
    >
      {label}
    </a>
  );
}
