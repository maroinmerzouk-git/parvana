import { escapeHtml, formatFrenchDate } from "./format";
import { eventTypeLabels, type EventType } from "@/lib/schemas/catering";

interface CateringEmailData {
  name: string;
  email: string;
  phone: string;
  eventDate: string;
  eventType: EventType;
  partySize: number;
  budget?: string | null;
  message?: string | null;
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
                <p style="margin:0;font-size:11px;letter-spacing:0.22em;text-transform:uppercase;color:${COLORS.terracotta};">Parvana · Traiteur</p>
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

function detailsTable(d: CateringEmailData): string {
  const rows: Array<[string, string]> = [
    ["Date de l'événement", formatFrenchDate(d.eventDate)],
    ["Type", eventTypeLabels[d.eventType]],
    ["Nombre de convives", String(d.partySize)],
    ["Nom", d.name],
    ["Email", d.email],
    ["Téléphone", d.phone],
  ];
  if (d.budget && d.budget.trim() !== "") {
    rows.push(["Budget indicatif", d.budget]);
  }
  if (d.message && d.message.trim() !== "") {
    rows.push(["Message", d.message]);
  }
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:8px 0 16px 0;border-top:1px solid rgba(43,31,24,0.08);">
    ${rows
      .map(
        ([k, v]) => `<tr>
          <td style="padding:10px 0;width:40%;color:${COLORS.inkSoft};font-size:13px;border-bottom:1px solid rgba(43,31,24,0.06);">${escapeHtml(k)}</td>
          <td style="padding:10px 0;color:${COLORS.ink};font-size:14px;border-bottom:1px solid rgba(43,31,24,0.06);">${escapeHtml(v)}</td>
        </tr>`,
      )
      .join("")}
  </table>`;
}

export function cateringClientReceivedEmail(d: CateringEmailData): {
  subject: string;
  html: string;
} {
  const subject = "Votre demande traiteur chez Parvana";
  const html = wrapper(
    subject,
    `<h1 style="font-size:24px;margin:0 0 16px 0;font-weight:500;">Bonjour ${escapeHtml(d.name.split(" ")[0])},</h1>
     <p style="margin:0 0 16px 0;">Nous avons bien reçu votre demande pour une prestation traiteur. Maryam reviendra vers vous personnellement par email afin d'échanger sur les détails de votre événement et préparer une proposition adaptée.</p>
     <p style="margin:0 0 16px 0;background:${COLORS.beige};border-left:3px solid ${COLORS.terracotta};padding:12px 16px;font-size:14px;">Délai de réponse habituel : sous 2 à 3 jours ouvrés. Pour une demande urgente, appelez-nous au 06 22 64 32 53.</p>
     <p style="margin:0 0 8px 0;color:${COLORS.inkSoft};font-size:13px;text-transform:uppercase;letter-spacing:0.12em;">Récapitulatif</p>
     ${detailsTable(d)}
     <p style="margin:16px 0 0 0;color:${COLORS.inkSoft};font-size:13px;">À très bientôt.</p>`,
  );
  return { subject, html };
}

export function cateringAdminNotificationEmail(
  d: CateringEmailData,
  adminUrl: string,
): { subject: string; html: string } {
  const subject = `Nouvelle demande traiteur — ${d.partySize}p · ${formatFrenchDate(d.eventDate)}`;
  const html = wrapper(
    subject,
    `<h1 style="font-size:22px;margin:0 0 16px 0;font-weight:500;">Nouvelle demande traiteur</h1>
     ${detailsTable(d)}
     <a href="${escapeHtml(adminUrl)}" style="display:inline-block;margin-top:8px;background:${COLORS.terracotta};color:${COLORS.beige};padding:12px 22px;text-decoration:none;font-size:13px;letter-spacing:0.12em;text-transform:uppercase;border-radius:999px;">Voir dans le tableau de bord</a>
     <p style="margin:24px 0 0 0;color:${COLORS.inkSoft};font-size:13px;">Répondez directement au client par email pour ouvrir l'échange.</p>`,
  );
  return { subject, html };
}
