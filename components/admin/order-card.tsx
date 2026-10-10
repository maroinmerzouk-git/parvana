import type { schema } from "@/db";
import type { CartLine } from "@/lib/bot/state";
import { cartTotals } from "@/lib/bot/state";
import { formatCents } from "@/lib/bot/price";
import { OrderActions } from "./order-actions";
import { cn } from "@/lib/utils";

type Order = (typeof schema)["orders"]["$inferSelect"];

const statusLabels: Record<string, { label: string; classes: string }> = {
  new: {
    label: "Nouvelle",
    classes: "border-terracotta/40 bg-terracotta/10 text-terracotta-dark",
  },
  seen: {
    label: "Vue",
    classes: "border-ink/20 bg-beige text-ink-soft",
  },
  archived: {
    label: "Archivée",
    classes: "border-ink/15 bg-sand/60 text-ink-soft/80",
  },
};

export function OrderCard({ order: o }: { order: Order }) {
  const unread = o.status === "new";
  const status = statusLabels[o.status] ?? statusLabels.new;
  const items = (o.items as CartLine[]) ?? [];
  const { hasUnpriced } = cartTotals(items);

  return (
    <article
      className={cn(
        "rounded-lg border bg-beige p-4 shadow-sm md:p-5",
        unread
          ? "border-terracotta/40 ring-1 ring-terracotta/20"
          : "border-ink/10",
      )}
    >
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span
              className={cn(
                "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] uppercase tracking-[0.12em]",
                status.classes,
              )}
            >
              {status.label}
            </span>
            {unread && (
              <span className="inline-flex h-2 w-2 rounded-full bg-terracotta" />
            )}
          </div>
          <h3 className="mt-2 font-display text-2xl italic leading-tight text-ink">
            {o.customerName}
          </h3>
        </div>
        <div className="text-right">
          <p className="font-display text-xl text-terracotta">
            {o.totalCents != null ? formatCents(o.totalCents) : "Sur place"}
          </p>
          <p className="text-xs text-ink-soft">Retrait : {o.pickupTime}</p>
        </div>
      </header>

      <ul className="mt-4 space-y-1 border-t border-ink/10 pt-3 text-sm text-ink">
        {items.map((l, i) => (
          <li key={i} className="flex justify-between gap-3">
            <span>
              <span className="font-medium">{l.qty}×</span> {l.name}
              <span className="text-ink-soft"> · {l.category}</span>
            </span>
            <span className="whitespace-nowrap text-ink-soft">
              {l.priceCents == null
                ? "forfait"
                : formatCents(l.priceCents * l.qty)}
            </span>
          </li>
        ))}
      </ul>
      {hasUnpriced && o.totalCents != null && (
        <p className="mt-2 text-[11px] text-ink-soft/80">
          Total indicatif hors plats au forfait.
        </p>
      )}

      {o.note && (
        <div className="mt-3 rounded-md border-l-2 border-terracotta bg-sand/50 px-3 py-2 text-sm">
          <span className="text-[10px] uppercase tracking-[0.14em] text-ink-soft">
            Plats souhaités
          </span>
          <p className="mt-0.5 whitespace-pre-line text-ink">{o.note}</p>
        </div>
      )}

      <footer className="mt-4 flex items-center justify-between border-t border-ink/10 pt-3">
        <div className="flex flex-col gap-0.5">
          <a
            href={`https://wa.me/${o.phone.replace(/\D/g, "")}`}
            className="text-xs text-ink hover:text-terracotta"
          >
            WhatsApp · {o.phone}
          </a>
          <p className="text-[10px] uppercase tracking-[0.14em] text-ink-soft/70">
            Reçue le{" "}
            {new Intl.DateTimeFormat("fr-FR", {
              dateStyle: "short",
              timeStyle: "short",
            }).format(o.createdAt)}
          </p>
        </div>
        <OrderActions id={o.id} status={o.status} />
      </footer>
    </article>
  );
}
