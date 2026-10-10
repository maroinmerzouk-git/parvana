import type { InboundMessage } from "./types";

// Formes minimales du payload webhook Meta qui nous intéressent.
interface WaTextMessage {
  type: "text";
  text?: { body?: string };
}
interface WaInteractiveMessage {
  type: "interactive";
  interactive?: {
    button_reply?: { id: string; title: string };
    list_reply?: { id: string; title: string };
  };
}
interface WaButtonMessage {
  type: "button";
  button?: { payload?: string; text?: string };
}
type WaMessage = (
  | WaTextMessage
  | WaInteractiveMessage
  | WaButtonMessage
  | { type: string }
) & {
  id: string;
  from: string;
  timestamp?: string;
};

interface WaContact {
  wa_id?: string;
  profile?: { name?: string };
}
interface WaValue {
  metadata?: { phone_number_id?: string };
  contacts?: WaContact[];
  messages?: WaMessage[];
  statuses?: unknown[];
}
interface WaChange {
  field?: string;
  value?: WaValue;
}
interface WaEntry {
  changes?: WaChange[];
}
interface WebhookBody {
  entry?: WaEntry[];
}

/**
 * Normalise le payload webhook Meta en `InboundMessage[]`. Ne traite que les
 * changements `field === "messages"` (ignore les accusés de livraison/lecture).
 * Gère le texte, les réponses de boutons interactifs, les réponses de listes
 * et les anciens boutons de template (traités comme du texte).
 */
export function parseInbound(payload: unknown): InboundMessage[] {
  const out: InboundMessage[] = [];
  const body = payload as WebhookBody;
  for (const entry of body?.entry ?? []) {
    for (const change of entry.changes ?? []) {
      if (change.field !== "messages") continue;
      const value = change.value;
      if (!value) continue;

      const nameByWaId = new Map<string, string>();
      for (const c of value.contacts ?? []) {
        if (c.wa_id && c.profile?.name) nameByWaId.set(c.wa_id, c.profile.name);
      }

      for (const m of value.messages ?? []) {
        const base = {
          id: m.id,
          from: m.from,
          profileName: nameByWaId.get(m.from),
        };
        if (m.type === "text") {
          const text = (m as WaTextMessage).text?.body?.trim() ?? "";
          out.push({ ...base, text });
        } else if (m.type === "interactive") {
          const i = (m as WaInteractiveMessage).interactive;
          const picked = i?.button_reply ?? i?.list_reply;
          if (picked)
            out.push({ ...base, reply: { id: picked.id, title: picked.title } });
          else out.push({ ...base, text: "" });
        } else if (m.type === "button") {
          const b = (m as WaButtonMessage).button;
          out.push({ ...base, text: (b?.payload ?? b?.text ?? "").trim() });
        } else {
          // Type non géré (image, audio, localisation…) → texte vide.
          out.push({ ...base, text: "" });
        }
      }
    }
  }
  return out;
}
