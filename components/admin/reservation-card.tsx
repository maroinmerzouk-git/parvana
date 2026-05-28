import { formatFrenchDate, formatFrenchTime } from "@/lib/email/format";
import type { schema } from "@/db";
import { StatusBadge } from "./status-badge";
import { ActionButtons } from "./action-buttons";
import { cn } from "@/lib/utils";

type Reservation = (typeof schema)["reservations"]["$inferSelect"];

export function ReservationCard({
  reservation: r,
}: {
  reservation: Reservation;
}) {
  const unread = r.status === "pending" && !r.seenAt;

  // Surface when the customer-facing email for the current status never went
  // out (e.g. Resend rejected the send). Each status maps to its own email.
  const emailFailedLabel =
    r.status === "pending" && !r.clientEmailSent
      ? "Accusé non envoyé"
      : r.status === "confirmed" && !r.confirmationEmailSent
        ? "Confirmation non envoyée"
        : r.status === "rejected" && !r.rejectionEmailSent
          ? "Refus non envoyé"
          : null;

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
            <StatusBadge status={r.status} />
            {unread && (
              <span className="inline-flex h-2 w-2 rounded-full bg-terracotta" />
            )}
            <span className="text-[10px] uppercase tracking-[0.14em] text-ink-soft">
              {r.service === "midi" ? "Déjeuner" : "Dîner"}
            </span>
            {emailFailedLabel && (
              <span
                title="L'email destiné au client n'a pas pu être envoyé. Pensez à prévenir le client par téléphone."
                className="inline-flex items-center gap-1 rounded-full border border-amber-600/40 bg-amber-100 px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.14em] text-amber-900"
              >
                <span aria-hidden>⚠</span>
                {emailFailedLabel}
              </span>
            )}
          </div>
          <h3 className="mt-2 font-display text-2xl italic leading-tight text-ink">
            {r.name}
          </h3>
        </div>
        <div className="text-right">
          <p className="font-display text-xl text-terracotta">
            {formatFrenchTime(r.arrivalTime)}
          </p>
          <p className="text-xs capitalize text-ink-soft">
            {formatFrenchDate(r.date)}
          </p>
        </div>
      </header>

      <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
        <Field
          label="Couverts"
          value={`${r.partySize} ${r.partySize > 1 ? "personnes" : "personne"}`}
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
          className="sm:col-span-2"
        />
        {r.message && (
          <Field
            label="Message"
            value={<span className="italic">{r.message}</span>}
            className="sm:col-span-2"
          />
        )}
        {r.rejectionMessage && (
          <Field
            label="Motif de refus envoyé"
            value={<span className="italic">{r.rejectionMessage}</span>}
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
        <ActionButtons id={r.id} status={r.status} unread={unread} />
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
