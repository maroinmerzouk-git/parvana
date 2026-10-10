import type { ServiceKey } from "./menu-snapshot";

// Types d'état de conversation — module pur (sans accès base/serveur) pour
// rester testable et importable côté logique métier comme côté store.

/** Une ligne du panier. Le prix peut être null (plat au forfait). */
export interface CartLine {
  id: string; // id d'article du catalogue : "<service>:<catIdx>:<itemIdx>"
  name: string;
  priceCents: number | null;
  qty: number;
  serviceKey: ServiceKey;
  category: string;
}

export interface ConversationData {
  /** version du menu au démarrage de la commande (garde-fou de cohérence). */
  menuVersion?: number | null;
  serviceKey?: ServiceKey;
  catIndex?: number; // catégorie en cours de consultation
  catPage?: number; // pagination dans la liste d'articles
  pendingItemId?: string; // article en attente de quantité
  cart?: CartLine[];
  detailsNote?: string; // plats souhaités (texte libre, menu food non nommé)
  pickupTime?: string; // libellé lisible ("12h30" / "Dès que possible")
  customerName?: string;
}

/** Étapes = ce que le bot attend comme prochaine entrée. */
export type Step =
  | "greet"
  | "service"
  | "category"
  | "item"
  | "quantity"
  | "after_add"
  | "cart"
  | "details"
  | "pickup_time"
  | "name"
  | "confirm";

export interface ConversationState {
  step: Step;
  data: ConversationData;
}

export const FRESH_STATE: ConversationState = { step: "greet", data: {} };

/** Total (centimes) des lignes à prix connu, et présence de lignes au forfait. */
export function cartTotals(cart: CartLine[]): {
  totalCents: number | null;
  hasUnpriced: boolean;
} {
  let total = 0;
  let priced = 0;
  let hasUnpriced = false;
  for (const l of cart) {
    if (l.priceCents == null) hasUnpriced = true;
    else {
      total += l.priceCents * l.qty;
      priced++;
    }
  }
  return { totalCents: priced > 0 ? total : null, hasUnpriced };
}

export function cartCount(cart: CartLine[]): number {
  return cart.reduce((n, l) => n + l.qty, 0);
}
