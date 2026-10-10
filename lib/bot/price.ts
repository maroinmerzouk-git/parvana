// Analyse des prix du menu. Les prix sont saisis librement en français :
//   "7€", "6,50€", "4,50 €", "19€", "15,50€" …
// Les plats du midi n'ont pas de prix unitaire (null → forfait formule).

/**
 * "6,50€" → 650, "19€" → 1900, "4,50 €" → 450.
 * Renvoie null si vide, null, ou non analysable (plat au forfait).
 */
export function parsePriceCents(
  raw: string | null | undefined,
): number | null {
  if (raw == null) return null;
  const cleaned = raw.replace(/\s|€|EUR/gi, "").replace(",", ".");
  if (cleaned === "") return null;
  if (!/^\d+(\.\d{1,2})?$/.test(cleaned)) return null;
  const euros = Number.parseFloat(cleaned);
  if (!Number.isFinite(euros)) return null;
  return Math.round(euros * 100);
}

/** 650 → "6,50 €", 1900 → "19 €" (euros entiers sans décimales). */
export function formatCents(cents: number): string {
  const euros = cents / 100;
  if (Number.isInteger(euros)) return `${euros} €`;
  return `${euros.toFixed(2).replace(".", ",")} €`;
}

/** Libellé de prix tolérant au null (plat au forfait). */
export function priceLabel(cents: number | null): string {
  return cents == null ? "—" : formatCents(cents);
}
