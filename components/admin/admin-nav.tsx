import Link from "next/link";
import { and, eq, isNull } from "drizzle-orm";
import { getDb, schema } from "@/db";
import { logoutAdmin } from "@/app/admin/auth-actions";

async function getUnreadCounts(): Promise<{
  reservations: number;
  catering: number;
}> {
  try {
    const db = getDb();
    const [resRows, cateringRows] = await Promise.all([
      db
        .select({ id: schema.reservations.id })
        .from(schema.reservations)
        .where(
          and(
            eq(schema.reservations.status, "pending"),
            isNull(schema.reservations.seenAt),
          ),
        ),
      db
        .select({ id: schema.cateringRequests.id })
        .from(schema.cateringRequests)
        .where(eq(schema.cateringRequests.status, "new")),
    ]);
    return { reservations: resRows.length, catering: cateringRows.length };
  } catch {
    return { reservations: 0, catering: 0 };
  }
}

export async function AdminNav() {
  const { reservations: unread, catering: unreadCatering } =
    await getUnreadCounts();

  return (
    <header className="sticky top-0 z-40 border-b border-ink/10 bg-sand/95 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3 md:px-6">
        <Link
          href="/admin/reservations"
          className="flex items-center gap-3 font-display text-lg italic text-ink"
        >
          Parvana
          <span className="hidden text-xs font-body uppercase not-italic tracking-[0.18em] text-ink-soft sm:inline">
            · Gestion
          </span>
        </Link>

        <nav className="flex items-center gap-1 text-xs uppercase tracking-[0.14em]">
          <Link
            href="/admin/reservations"
            className="relative rounded-full px-3 py-2 text-ink hover:bg-beige"
          >
            <span className="hidden sm:inline">Réservations</span>
            <span className="sm:hidden">Résas</span>
            {unread > 0 && (
              <span
                aria-label={`${unread} non lue${unread > 1 ? "s" : ""}`}
                className="absolute -right-1 -top-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-terracotta px-1.5 text-[10px] font-medium text-beige"
              >
                {unread}
              </span>
            )}
          </Link>

          <Link
            href="/admin/catering"
            className="relative rounded-full px-3 py-2 text-ink hover:bg-beige"
          >
            Traiteur
            {unreadCatering > 0 && (
              <span
                aria-label={`${unreadCatering} non lue${unreadCatering > 1 ? "s" : ""}`}
                className="absolute -right-1 -top-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-terracotta px-1.5 text-[10px] font-medium text-beige"
              >
                {unreadCatering}
              </span>
            )}
          </Link>

          <Link
            href="/admin/menu"
            className="rounded-full px-3 py-2 text-ink hover:bg-beige"
          >
            Menu
          </Link>

          <Link
            href="/admin/horaires"
            className="rounded-full px-3 py-2 text-ink hover:bg-beige"
          >
            Horaires
          </Link>

          <Link
            href="/admin/association"
            className="rounded-full px-3 py-2 text-ink hover:bg-beige"
          >
            <span className="hidden sm:inline">Association</span>
            <span className="sm:hidden">Asso</span>
          </Link>

          <form action={logoutAdmin} className="ml-2">
            <button
              type="submit"
              className="rounded-full px-3 py-2 text-ink-soft hover:text-terracotta"
              aria-label="Se déconnecter"
            >
              Quitter
            </button>
          </form>
        </nav>
      </div>
    </header>
  );
}
