import { cn } from "@/lib/utils";

const styles: Record<string, string> = {
  pending: "bg-sand text-ink border-ink/20",
  confirmed: "bg-emerald-100 text-emerald-900 border-emerald-700/30",
  rejected: "bg-terracotta/10 text-terracotta-dark border-terracotta/30",
  cancelled: "bg-ink/10 text-ink-soft border-ink/20",
};

const labels: Record<string, string> = {
  pending: "En attente",
  confirmed: "Confirmée",
  rejected: "Refusée",
  cancelled: "Annulée",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-[0.14em]",
        styles[status] ?? styles.pending,
      )}
    >
      {labels[status] ?? status}
    </span>
  );
}
