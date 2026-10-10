import type { InteractiveMessage, Outbound } from "@/lib/wa/types";
import type {
  Catalog,
  CatalogItem,
  CatalogService,
  ServiceKey,
} from "./menu-snapshot";
import type { CartLine } from "./state";
import { cartCount, cartTotals } from "./state";
import { formatCents, priceLabel } from "./price";

// Constructeurs de messages interactifs, purs (catalogue → message). La machine
// d'état décide quand les envoyer ; la couche transport les traduit en payload
// Graph. Les troncatures aux limites WhatsApp sont gérées dans cloud-api.ts.

/** Lignes max par liste WhatsApp (10) — on en garde une pour « Voir plus ▸ ». */
export const PAGE_SIZE = 9;

export function text(body: string): Outbound {
  return { type: "text", body };
}
export function interactive(message: InteractiveMessage): Outbound {
  return { type: "interactive", message };
}

const SERVICE_BUTTON: Record<ServiceKey, string> = {
  midi: "🥘 Le midi",
  soir: "🍽️ Le soir",
  boissons: "🥤 Boissons",
};

/** Accueil + choix du service (midi / soir / boissons) en boutons (≤3). */
export function serviceButtons(catalog: Catalog): InteractiveMessage {
  return {
    kind: "buttons",
    header: "Parvana — à emporter",
    body: "Bonjour 👋 Que souhaitez-vous commander aujourd'hui ?",
    buttons: catalog.services.map((s) => ({
      id: `svc:${s.key}`,
      title: SERVICE_BUTTON[s.key],
    })),
    footer: "Paiement sur place au retrait.",
  };
}

/** Liste des catégories d'un service. */
export function categoryList(service: CatalogService): InteractiveMessage {
  const rows = service.categories.map((c, i) => ({
    id: `cat:${i}`,
    title: c.title,
    description: `${c.items.length} choix`,
  }));
  const body = service.formule
    ? `${service.label}\n${service.formule}`
    : service.label;
  return {
    kind: "list",
    body,
    button: "Voir la carte",
    sections: [{ title: "Catégories", rows }],
  };
}

/** Liste paginée des articles d'une catégorie. */
export function itemList(
  service: CatalogService,
  catIndex: number,
  page: number,
): InteractiveMessage {
  const cat = service.categories[catIndex];
  const start = page * PAGE_SIZE;
  const slice = cat.items.slice(start, start + PAGE_SIZE);
  const rows = slice.map((it) => ({
    id: `item:${it.id}`,
    title: it.name,
    description: priceLabel(it.priceCents),
  }));
  if (cat.items.length > start + PAGE_SIZE) {
    rows.push({ id: "more:item", title: "Voir plus ▸", description: "" });
  }
  return {
    kind: "list",
    body: cat.title,
    button: "Choisir un plat",
    sections: [{ rows }],
    footer: "Tapez « panier » à tout moment.",
  };
}

/** Choix de la quantité pour un article (1/2/3, sinon saisie libre). */
export function quantityButtons(item: CatalogItem): InteractiveMessage {
  return {
    kind: "buttons",
    body: `${item.name} — ${priceLabel(item.priceCents)}\nCombien en voulez-vous ?`,
    buttons: [
      { id: "qty:1", title: "1" },
      { id: "qty:2", title: "2" },
      { id: "qty:3", title: "3" },
    ],
    footer: "Ou tapez un nombre (ex. 5).",
  };
}

/** Après ajout : continuer, voir le panier, commander. */
export function afterAddButtons(cart: CartLine[]): InteractiveMessage {
  return {
    kind: "buttons",
    body: `Ajouté ✅ — ${cartCount(cart)} article(s) au panier.`,
    buttons: [
      { id: "after:more", title: "➕ Continuer" },
      { id: "after:cart", title: "🛒 Voir panier" },
      { id: "after:checkout", title: "✅ Commander" },
    ],
  };
}

/** Récapitulatif texte du panier (lignes + total indicatif). */
export function cartSummary(cart: CartLine[]): string {
  const lines = cart
    .map((l) => {
      const price =
        l.priceCents == null ? "forfait" : formatCents(l.priceCents * l.qty);
      return `• ${l.qty}× ${l.name} — ${price}`;
    })
    .join("\n");
  const { totalCents, hasUnpriced } = cartTotals(cart);
  let total = "";
  if (totalCents != null) {
    total = `\n\nTotal indicatif : ${formatCents(totalCents)}`;
    if (hasUnpriced) total += " + plats au forfait";
  } else if (hasUnpriced) {
    total = "\n\nMontant réglé sur place.";
  }
  return `🛒 Votre panier\n${lines}${total}`;
}

/** Vue panier + actions (continuer / commander / vider). */
export function cartView(cart: CartLine[]): InteractiveMessage {
  return {
    kind: "buttons",
    body: cartSummary(cart),
    buttons: [
      { id: "cart:more", title: "➕ Continuer" },
      { id: "cart:checkout", title: "✅ Commander" },
      { id: "cart:clear", title: "🗑️ Vider" },
    ],
    footer: "Paiement sur place au retrait.",
  };
}

/** Liste des créneaux de retrait. */
export function pickupTimeList(
  options: { id: string; label: string }[],
): InteractiveMessage {
  return {
    kind: "list",
    body: "À quelle heure souhaitez-vous récupérer votre commande aujourd'hui ?",
    button: "Choisir l'heure",
    sections: [{ rows: options.map((o) => ({ id: o.id, title: o.label })) }],
  };
}

/** Récapitulatif final avant confirmation. */
export function confirmRecap(
  cart: CartLine[],
  pickupTime: string,
  name: string,
): InteractiveMessage {
  const body = `${cartSummary(cart)}\n\n👤 ${name}\n🕒 Retrait : ${pickupTime}\n💶 Paiement sur place.\n\nJe confirme la commande ?`;
  return {
    kind: "buttons",
    body,
    buttons: [
      { id: "confirm:yes", title: "✅ Confirmer" },
      { id: "confirm:no", title: "❌ Annuler" },
    ],
  };
}
