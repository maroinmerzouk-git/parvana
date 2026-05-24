import { formatFrenchDate } from "@/lib/email/format";
import type { schema } from "@/db";
import { eventTypeLabels, type EventType } from "@/lib/schemas/catering";
import { CateringActions } from "./catering-actions";
import { cn } from "@/lib/utils";

type CateringRequest = (typeof schema)["cateringRequests"]["$inferSelect"];

const statusLabels: Record<string, { label: string; classes: string }> = {
  new: {
    label: "Nouveau",
    classes: "border-terracotta/40 bg-terracotta/10 text-terracotta-dark",
  },
  seen: {
    label: "Vu",
    classes: "border-ink/20 bg-beige text-ink-soft",
  },
  archived: {
    label: "Archivé",
    classes: "border-ink/15 bg-sand/60 text-ink-soft/80",
  },
};

export function CateringCard({ request: r }: { request: CateringRequest }) {
  const unread = r.status === "new";
  const status = statusLabels[r.status] ?? statusLabels.new;

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
            <span className="text-[10px] uppercase tracking-[0.14em] text-ink-soft">
              {eventTypeLabels[r.eventType as EventType] ?? r.eventType}
            </span>
          </div>
          <h3 className="mt-2 font-display text-2xl italic leading-tight text-ink">
            {r.name}
          </h3>
        </div>
        <div className="text-right">
          <p className="font-display text-xl text-terracotta">
            {r.partySize} pers.
          </p>
          <p className="text-xs capitalize text-ink-soft">
            {formatFrenchDate(r.eventDate)}
          </p>
        </div>
      </header>

      <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
        <Field
          label="Email"
          value={
            <a
              href={`mailto:${r.email}`}
              className="text-ink hover:text-terracotta break-all"
            >
              {r.email}
            </a>
          }
        />
        <Field
          label="Téléphone"
          value={
            <a
              href={`tel:${r.phone.replace(/\s/g, "")}`}
              className="text-ink hover:text-terracotta"
            >
              {r.phone}
            </a>
          }
        />
        {r.budget && (
          <Field
            label="Budget indicatif"
            value={r.budget}
            className="sm:col-span-2"
          />
        )}
        {r.message && (
          <Field
            label="Précisions"
            value={
              <span className="whitespace-pre-line italic">{r.message}</span>
            }
            className="sm:col-span-2"
          />
        )}
      </dl>

      <footer className="mt-4 flex items-center justify-between border-t border-ink/10 pt-3">
        <p className="text-[10px] uppercase tracking-[0.14em] text-ink-soft/70">
          Reçue le{" "}
          {new Intl.DateTimeFormat("fr-FR", {
            dateStyle: "short",
            timeStyle: "short",
          }).format(r.createdAt)}
        </p>
        <CateringActions id={r.id} status={r.status} />
      </footer>
    </article>
  );
}

function Field({
  label,
  value,
  className,
}: {
  label: string;
  value: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <dt className="text-[10px] uppercase tracking-[0.14em] text-ink-soft">
        {label}
      </dt>
      <dd className="mt-1 text-ink">{value}</dd>
    </div>
  );
}
