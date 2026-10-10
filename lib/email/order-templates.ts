import { escapeHtml } from "./format";
import type { CartLine } from "@/lib/bot/state";
import { cartTotals } from "@/lib/bot/state";
import { formatCents } from "@/lib/bot/price";

export interface OrderEmailData {
  ref: string;
  customerName: string;
  phone: string;
  pickupTime: string;
  items: CartLine[];
  totalCents: number | null;
}

const COLORS = {
  beige: "#F5EBD8",
  sand: "#E8D9BD",
  terracotta: "#B5482A",
  ink: "#2B1F18",
  inkSoft: "#5C4A3E",
};

function wrapper(title: string, bodyHtml: string): string {
  return `<!doctype html>
<html lang="fr">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>${escapeHtml(title)}</title>
  </head>
  <body style="margin:0;padding:0;background:${COLORS.beige};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:${COLORS.ink};">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${COLORS.beige};">
      <tr>
        <td align="center" style="padding:32px 16px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#FFFFFF;border:1px solid rgba(43,31,24,0.08);">
            <tr>
              <td style="padding:32px 32px 16px 32px;border-bottom:1px solid rgba(43,31,24,0.08);">
                <p style="margin:0;font-size:11px;letter-spacing:0.22em;text-transform:uppercase;color:${COLORS.terracotta};">Parvana · Commande à emporter</p>
              </td>
            </tr>
            <tr>
              <td style="padding:24px 32px 32px 32px;font-size:15px;line-height:1.6;color:${COLORS.ink};">
                ${bodyHtml}
              </td>
            </tr>
            <tr>
              <td style="padding:20px 32px;border-top:1px solid rgba(43,31,24,0.08);background:${COLORS.sand};font-size:12px;color:${COLORS.inkSoft};">
                Parvana · 8 Boulevard Gisèle Halimi · 44200 Nantes · 06 22 64 32 53
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

function itemsTable(items: CartLine[]): string {
  const rows = items
    .map((l) => {
      const price =
        l.priceCents == null ? "forfait" : formatCents(l.priceCents * l.qty);
      return `<tr>
        <td style="padding:8px 0;color:${COLORS.ink};font-size:14px;border-bottom:1px solid rgba(43,31,24,0.06);">${l.qty}× ${escapeHtml(l.name)}<span style="color:${COLORS.inkSoft};font-size:12px;"> · ${escapeHtml(l.category)}</span></td>
        <td style="padding:8px 0;text-align:right;color:${COLORS.ink};font-size:14px;border-bottom:1px solid rgba(43,31,24,0.06);white-space:nowrap;">${escapeHtml(price)}</td>
      </tr>`;
    })
    .join("");
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:8px 0 16px 0;border-top:1px solid rgba(43,31,24,0.08);">${rows}</table>`;
}

export function orderAdminNotificationEmail(
  d: OrderEmailData,
  adminUrl: string,
): { subject: string; html: string } {
  const { hasUnpriced } = cartTotals(d.items);
  const totalLine =
    d.totalCents != null
      ? `Total indicatif : <strong>${formatCents(d.totalCents)}</strong>${hasUnpriced ? " + plats au forfait" : ""}`
      : "Montant réglé sur place.";

  const subject = `Nouvelle commande ${d.ref} — retrait ${d.pickupTime}`;
  const html = wrapper(
    subject,
    `<h1 style="font-size:22px;margin:0 0 4px 0;font-weight:500;">Nouvelle commande ${escapeHtml(d.ref)}</h1>
     <p style="margin:0 0 16px 0;color:${COLORS.inkSoft};font-size:13px;">Via WhatsApp · paiement sur place</p>
     ${itemsTable(d.items)}
     <p style="margin:0 0 16px 0;">${totalLine}</p>
     <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 16px 0;">
       <tr><td style="padding:6px 0;width:40%;color:${COLORS.inkSoft};font-size:13px;">Client</td><td style="padding:6px 0;font-size:14px;">${escapeHtml(d.customerName)}</td></tr>
       <tr><td style="padding:6px 0;color:${COLORS.inkSoft};font-size:13px;">WhatsApp</td><td style="padding:6px 0;font-size:14px;">${escapeHtml(d.phone)}</td></tr>
       <tr><td style="padding:6px 0;color:${COLORS.inkSoft};font-size:13px;">Retrait souhaité</td><td style="padding:6px 0;font-size:14px;">${escapeHtml(d.pickupTime)}</td></tr>
     </table>
     <a href="${escapeHtml(adminUrl)}" style="display:inline-block;margin-top:8px;background:${COLORS.terracotta};color:${COLORS.beige};padding:12px 22px;text-decoration:none;font-size:13px;letter-spacing:0.12em;text-transform:uppercase;border-radius:999px;">Voir dans le tableau de bord</a>`,
  );
  return { subject, html };
}
