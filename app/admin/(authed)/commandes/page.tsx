import type { Metadata } from "next";
import { desc, eq, ne } from "drizzle-orm";
import { getDb, schema } from "@/db";
import { OrderCard } from "@/components/admin/order-card";

export const metadata: Metadata = { title: "Commandes — gestion" };
export const dynamic = "force-dynamic";

interface SearchParams {
  status?: string;
}

const VALID_STATUS = new Set(["new", "seen", "archived"]);

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;

  let rows: Array<typeof schema.orders.$inferSelect> = [];
  let dbError: string | null = null;

  try {
    const db = getDb();
    const whereClause =
      sp.status && VALID_STATUS.has(sp.status)
        ? eq(schema.orders.status, sp.status)
        : ne(schema.orders.status, "archived");

    rows = await db
      .select()
      .from(schema.orders)
      .where(whereClause)
      .orderBy(desc(schema.orders.createdAt));
  } catch (err) {
    console.error("[/admin/commandes] DB error:", err);
    dbError =
      "Impossible de charger les commandes. La base de données n'est pas configurée ou n'est pas joignable.";
  }

  const activeStatus = sp.status ?? "active";

  return (
    <section className="mx-auto max-w-5xl px-4 py-6 md:px-6 md:py-10">
      <header className="mb-6 flex flex-col gap-1">
        <p className="text-xs uppercase tracking-[0.22em] text-terracotta">
          Gestion
        </p>
        <h1 className="font-display text-4xl italic text-ink md:text-5xl">
          Commandes
        </h1>
      </header>

      <div
        id="admin-filters"
        className="sticky top-14 z-30 -mx-4 mb-6 bg-beige/90 px-4 pb-2 pt-1 backdrop-blur md:-mx-6 md:px-6"
      >
        <div className="flex flex-wrap gap-2 rounded-lg border border-ink/10 bg-sand/60 p-3">
          <FilterPill href="/admin/commandes" label="Actives" active={activeStatus === "active"} />
          <FilterPill href="/admin/commandes?status=new" label="Nouvelles" active={activeStatus === "new"} />
          <FilterPill href="/admin/commandes?status=seen" label="Vues" active={activeStatus === "seen"} />
          <FilterPill href="/admin/commandes?status=archived" label="Archivées" active={activeStatus === "archived"} />
        </div>
      </div>

      {dbError ? (
        <div className="rounded-md border border-terracotta/30 bg-terracotta/5 p-4 text-sm text-terracotta-dark">
          {dbError}
        </div>
      ) : rows.length === 0 ? (
        <div className="rounded-md border border-ink/10 bg-beige p-8 text-center text-ink-soft">
          <p className="font-display text-2xl italic text-ink">
            Aucune commande
          </p>
          <p className="mt-2 text-sm">
            Les commandes à emporter passées via WhatsApp apparaîtront ici.
          </p>
        </div>
      ) : (
        <ul className="space-y-3">
          {rows.map((o) => (
            <li key={o.id}>
              <OrderCard order={o} />
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
