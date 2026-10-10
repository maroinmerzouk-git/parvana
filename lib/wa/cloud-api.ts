import "server-only";
import type { InteractiveMessage } from "./types";

// Client Meta Cloud API (envoi sortant). Mono-locataire : un seul numéro
// WhatsApp Business, configuré via les variables d'environnement.
//
//   WHATSAPP_PHONE_NUMBER_ID  — id du numéro Meta
//   WHATSAPP_ACCESS_TOKEN     — token System User permanent
//   WHATSAPP_GRAPH_VERSION    — version Graph (défaut v21.0)

const GRAPH_VERSION = process.env.WHATSAPP_GRAPH_VERSION ?? "v21.0";

function trunc(s: string, max: number): string {
  return s.length <= max ? s : s.slice(0, max - 1) + "…";
}

function credsOrNull(): { phoneNumberId: string; accessToken: string } | null {
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
  if (!phoneNumberId || !accessToken) {
    console.error(
      "[wa] WHATSAPP_PHONE_NUMBER_ID / WHATSAPP_ACCESS_TOKEN non configurés — envoi ignoré.",
    );
    return null;
  }
  return { phoneNumberId, accessToken };
}

/** POST bas niveau vers l'API messages. N'émet jamais d'exception (log seul). */
async function send(payload: Record<string, unknown>): Promise<void> {
  const creds = credsOrNull();
  if (!creds) return;
  try {
    const res = await fetch(
      `https://graph.facebook.com/${GRAPH_VERSION}/${creds.phoneNumberId}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${creds.accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messaging_product: "whatsapp", ...payload }),
      },
    );
    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      console.error(`[wa] envoi échoué ${res.status}: ${detail}`);
    }
  } catch (err) {
    console.error("[wa] envoi : exception :", err);
  }
}

export async function sendText(to: string, body: string): Promise<void> {
  await send({ to, type: "text", text: { body, preview_url: false } });
}

export async function sendInteractive(
  to: string,
  message: InteractiveMessage,
): Promise<void> {
  await send({ to, type: "interactive", interactive: toInteractivePayload(message) });
}

export async function markRead(messageId: string): Promise<void> {
  await send({ status: "read", message_id: messageId });
}

/** Traduit notre modèle interactif vers le format attendu par Graph. */
function toInteractivePayload(
  message: InteractiveMessage,
): Record<string, unknown> {
  if (message.kind === "buttons") {
    return {
      type: "button",
      ...(message.header ? { header: { type: "text", text: message.header } } : {}),
      body: { text: message.body },
      ...(message.footer ? { footer: { text: message.footer } } : {}),
      action: {
        buttons: message.buttons.slice(0, 3).map((b) => ({
          type: "reply",
          reply: { id: b.id, title: trunc(b.title, 20) },
        })),
      },
    };
  }
  // liste
  return {
    type: "list",
    ...(message.header ? { header: { type: "text", text: message.header } } : {}),
    body: { text: message.body },
    ...(message.footer ? { footer: { text: message.footer } } : {}),
    action: {
      button: trunc(message.button, 20),
      sections: message.sections.map((s) => ({
        ...(s.title ? { title: trunc(s.title, 24) } : {}),
        rows: s.rows.map((r) => ({
          id: r.id,
          title: trunc(r.title, 24),
          ...(r.description ? { description: trunc(r.description, 72) } : {}),
        })),
      })),
    },
  };
}
