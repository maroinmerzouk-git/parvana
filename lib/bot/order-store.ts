import "server-only";
import { getDb, schema } from "@/db";
import { cartTotals, type ConversationState } from "./state";

export interface OrderResult {
  id: string;
  ref: string; // référence courte lisible, ex. « #A1B2 »
  totalCents: number | null;
}

/** Référence courte dérivée de l'uuid (4 premiers caractères hex). */
function shortRef(id: string): string {
  return `#${id.replace(/-/g, "").slice(0, 4).toUpperCase()}`;
}

/** Enregistre la commande (auto-confirmée, réglée sur place). */
export async function createOrder(
  state: ConversationState,
  waId: string,
): Promise<OrderResult> {
  const db = getDb();
  const cart = state.data.cart ?? [];
  const { totalCents } = cartTotals(cart);

  const [row] = await db
    .insert(schema.orders)
    .values({
      phone: waId,
      customerName: state.data.customerName ?? "Client",
      items: cart,
      pickupTime: state.data.pickupTime ?? "Dès que possible",
      totalCents,
      menuVersion: state.data.menuVersion ?? null,
    })
    .returning({ id: schema.orders.id });

  return { id: row.id, ref: shortRef(row.id), totalCents };
}
