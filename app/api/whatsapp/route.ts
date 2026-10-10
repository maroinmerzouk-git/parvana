import { NextResponse } from "next/server";
import { verifySignature } from "@/lib/wa/signature";
import { parseInbound } from "@/lib/wa/parse";
import { sendText, sendInteractive, markRead } from "@/lib/wa/cloud-api";
import type { InboundMessage } from "@/lib/wa/types";
import { getCurrentMenu } from "@/lib/menu";
import { getOpeningHours } from "@/lib/hours";
import { buildCatalog } from "@/lib/bot/menu-snapshot";
import { advance, parisNow, type Deps } from "@/lib/bot/machine";
import {
  loadConversation,
  saveConversation,
  resetConversation,
  claimMessage,
} from "@/lib/bot/conversation-store";
import { createOrder } from "@/lib/bot/order-store";
import { notifyNewOrder } from "@/lib/bot/notify";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// --- Vérification du webhook (handshake Meta) ---
export async function GET(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const mode = url.searchParams.get("hub.mode");
  const token = url.searchParams.get("hub.verify_token");
  const challenge = url.searchParams.get("hub.challenge");

  if (
    mode === "subscribe" &&
    token &&
    token === process.env.WHATSAPP_VERIFY_TOKEN
  ) {
    return new Response(challenge ?? "", { status: 200 });
  }
  return new Response("Forbidden", { status: 403 });
}

/** Interrupteur d'arrêt : met le bot en pause sans toucher à la config Meta. */
function botPaused(): boolean {
  const v = process.env.WHATSAPP_BOT_PAUSED;
  return v === "1" || v === "true";
}

// --- Réception des messages entrants ---
export async function POST(req: Request): Promise<Response> {
  // En pause : on accuse réception (pas de retry Meta) sans rien traiter.
  if (botPaused()) {
    return NextResponse.json({ ok: true, paused: true });
  }

  // Corps brut : la signature est calculée sur ces octets exacts.
  const raw = await req.text();

  if (!verifySignature(raw, req.headers.get("x-hub-signature-256"))) {
    return new Response("invalid signature", { status: 401 });
  }

  let payload: unknown;
  try {
    payload = JSON.parse(raw);
  } catch {
    return NextResponse.json({ ok: true });
  }

  try {
    const messages = parseInbound(payload);
    for (const msg of messages) {
      try {
        await handleMessage(msg);
      } catch (err) {
        console.error("[wa] handleMessage échec:", err);
      }
    }
  } catch (err) {
    console.error("[wa] traitement POST échec:", err);
  }

  // Toujours accuser réception rapidement.
  return NextResponse.json({ ok: true });
}

async function handleMessage(msg: InboundMessage): Promise<void> {
  if (!msg.id || !msg.from) return;

  // Idempotence : si le message a déjà été réservé, on ignore (Meta renvoie).
  if (!(await claimMessage(msg.id))) return;

  await markRead(msg.id).catch(() => {});

  // Menu & horaires du jour → catalogue frais à chaque message (le flux colle
  // au menu publié ; voir le garde-fou de version dans la machine).
  const [{ menu, version }, hours] = await Promise.all([
    getCurrentMenu(),
    getOpeningHours(),
  ]);
  const catalog = buildCatalog(menu, version);

  const deps: Deps = {
    catalog,
    hours,
    now: parisNow(),
    createOrder: async (state, waId) => {
      const order = await createOrder(state, waId);
      await notifyNewOrder({
        ref: order.ref,
        customerName: state.data.customerName ?? "Client",
        phone: waId,
        pickupTime: state.data.pickupTime ?? "",
        items: state.data.cart ?? [],
        totalCents: order.totalCents,
        note: state.data.detailsNote ?? null,
      });
      return order;
    },
  };

  const state = await loadConversation(msg.from);
  const { next, outbound, clear } = await advance(msg, state, msg.from, deps);

  for (const out of outbound) {
    if (out.type === "text") await sendText(msg.from, out.body);
    else await sendInteractive(msg.from, out.message);
  }

  if (clear) await resetConversation(msg.from);
  else await saveConversation(msg.from, next);
}
