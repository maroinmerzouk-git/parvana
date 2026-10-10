import type { InboundMessage, Outbound } from "@/lib/wa/types";
import {
  isClosedOn,
  slotsForService,
  toFrenchTime,
  type OpeningHours,
} from "@/lib/hours";
import {
  findService,
  resolveItem,
  type Catalog,
  type CatalogService,
  type ServiceKey,
} from "./menu-snapshot";
import {
  FRESH_STATE,
  type CartLine,
  type ConversationData,
  type ConversationState,
} from "./state";
import * as flow from "./flow";

// Moteur de conversation. `advance` est volontairement sans effet de bord
// d'E/S direct : le catalogue, les horaires, l'heure courante et la création
// de commande sont injectés (Deps), ce qui rend les transitions testables sans
// base de données. La route /api/whatsapp fabrique les Deps réelles.

export interface OrderResult {
  id: string;
  ref: string; // référence courte lisible
  totalCents: number | null;
}

export interface Deps {
  catalog: Catalog;
  hours: OpeningHours;
  now: { date: string; time: string }; // fuseau Europe/Paris
  createOrder: (state: ConversationState, waId: string) => Promise<OrderResult>;
}

export interface AdvanceResult {
  next: ConversationState;
  outbound: Outbound[];
  clear?: boolean;
}

const { text, interactive } = flow;

const RESET_WORDS = new Set([
  "menu",
  "recommencer",
  "annuler",
  "start",
  "bonjour",
  "bonsoir",
  "salut",
  "hello",
]);

const PREP_MIN = 20; // délai de préparation avant le premier créneau de retrait

// --------------------------------------------------------------------------
// Heure Europe/Paris (utilisée par la route ; exportée pour les tests).
// --------------------------------------------------------------------------
export function parisNow(d: Date = new Date()): { date: string; time: string } {
  const date = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Paris",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(d);
  const time = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Paris",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(d);
  return { date, time };
}

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

function addMinutes(hhmm: string, n: number): string {
  const [h, m] = hhmm.split(":").map(Number);
  let tot = h * 60 + m + n;
  if (tot >= 24 * 60) tot = 24 * 60 - 1;
  return `${pad(Math.floor(tot / 60))}:${pad(tot % 60)}`;
}

/** Créneaux de retrait pour aujourd'hui (midi ∪ soir, à venir), + « ASAP ». */
export function buildPickupOptions(
  hours: OpeningHours,
  date: string,
  time: string,
): { id: string; label: string }[] {
  const union = [
    ...new Set([
      ...slotsForService(hours, date, "midi"),
      ...slotsForService(hours, date, "soir"),
    ]),
  ].sort();
  const cutoff = addMinutes(time, PREP_MIN);
  const future = union.filter((s) => s >= cutoff);
  const opts = [{ id: "time:asap", label: "Dès que possible" }];
  for (const s of future.slice(0, 8))
    opts.push({ id: `time:${s}`, label: toFrenchTime(s) });
  return opts;
}

// --------------------------------------------------------------------------
// Petits utilitaires
// --------------------------------------------------------------------------
function picked(msg: InboundMessage, prefix: string): string | null {
  const id = msg.reply?.id;
  if (id && id.startsWith(`${prefix}:`)) return id.slice(prefix.length + 1);
  return null;
}

function normText(msg: InboundMessage): string {
  return (msg.text ?? "").trim().toLowerCase();
}

function reprompt(state: ConversationState, ...outbound: Outbound[]): AdvanceResult {
  return { next: state, outbound };
}

function addToCart(cart: CartLine[], line: CartLine): CartLine[] {
  const idx = cart.findIndex((l) => l.id === line.id);
  if (idx === -1) return [...cart, line];
  const next = cart.slice();
  next[idx] = { ...next[idx], qty: next[idx].qty + line.qty };
  return next;
}

// --------------------------------------------------------------------------
// Démarrage / reprise de commande
// --------------------------------------------------------------------------
// --------------------------------------------------------------------------
// Repli « saisie libre » : certains clients/numéros ne renvoient pas les
// réponses interactives (boutons/listes) au webhook. On accepte donc aussi du
// texte à chaque étape : un numéro (1, 2, 3…) ou un mot-clé.
// --------------------------------------------------------------------------
function norm(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim();
}

/** "2" → index 1 (0-based) si dans [1..len], sinon -1. */
function typedIndex(t: string, len: number): number {
  const n = Number.parseInt(t, 10);
  return Number.isInteger(n) && n >= 1 && n <= len ? n - 1 : -1;
}

/** Résout un service depuis une saisie libre ("midi", "2", "boissons"…). */
function serviceFromText(t: string, catalog: Catalog): ServiceKey | null {
  const n = norm(t);
  const byNum = typedIndex(n, catalog.services.length);
  if (byNum >= 0) return catalog.services[byNum].key;
  const has = (k: ServiceKey) =>
    catalog.services.some((s) => s.key === k) ? k : null;
  if (n.includes("midi")) return has("midi");
  if (n.includes("soir")) return has("soir");
  if (n.includes("boisson") || n.includes("drink")) return has("boissons");
  return null;
}

function startOrder(deps: Deps, lead: Outbound[] = []): AdvanceResult {
  const version = deps.catalog.version;

  if (deps.catalog.services.length === 0) {
    return {
      next: FRESH_STATE,
      outbound: [
        ...lead,
        text(
          "Le menu du jour n'est pas encore publié. Merci de réessayer un peu plus tard 🙏",
        ),
      ],
      clear: true,
    };
  }

  if (isClosedOn(deps.hours, deps.now.date)) {
    return {
      next: FRESH_STATE,
      outbound: [
        ...lead,
        text(
          "Nous sommes fermés aujourd'hui — pas de commande à emporter. À très vite chez Parvana !",
        ),
      ],
      clear: true,
    };
  }

  // Un seul service actif → on saute directement à ses catégories.
  if (deps.catalog.services.length === 1) {
    const service = deps.catalog.services[0];
    return showCategories(service, { menuVersion: version }, lead);
  }

  return {
    next: { step: "service", data: { menuVersion: version } },
    outbound: [...lead, interactive(flow.serviceButtons(deps.catalog))],
  };
}

function showCategories(
  service: CatalogService,
  data: ConversationData,
  lead: Outbound[] = [],
): AdvanceResult {
  return {
    next: {
      step: "category",
      data: { ...data, serviceKey: service.key, catIndex: undefined, catPage: 0 },
    },
    outbound: [...lead, interactive(flow.categoryList(service))],
  };
}

/** Le panier contient-il des plats (food) dont il faut préciser le détail ? */
function needsDetails(cart: CartLine[]): boolean {
  return cart.some((l) => l.serviceKey === "midi" || l.serviceKey === "soir");
}

function goPickup(deps: Deps, data: ConversationData): AdvanceResult {
  const options = buildPickupOptions(deps.hours, deps.now.date, deps.now.time);
  return {
    next: { step: "pickup_time", data },
    outbound: [interactive(flow.pickupTimeList(options))],
  };
}

function goCheckout(deps: Deps, data: ConversationData): AdvanceResult {
  const cart = data.cart ?? [];
  if (cart.length === 0) {
    const service = data.serviceKey
      ? findService(deps.catalog, data.serviceKey)
      : undefined;
    if (service)
      return {
        next: { step: "category", data: { ...data, catPage: 0 } },
        outbound: [
          text("Votre panier est vide 🙂"),
          interactive(flow.categoryList(service)),
        ],
      };
    return startOrder(deps, [text("Votre panier est vide 🙂")]);
  }

  // Menu food non nommé → on demande les plats souhaités en texte libre.
  if (needsDetails(cart) && !data.detailsNote) {
    return {
      next: { step: "details", data },
      outbound: [
        text(
          "Dernière étape avant l'heure : précisez les plats souhaités (ex. « 2 Kaboli Pulao, 1 Mantu, 1 Baklava »).",
        ),
      ],
    };
  }

  return goPickup(deps, data);
}

// --------------------------------------------------------------------------
// Transition principale
// --------------------------------------------------------------------------
export async function advance(
  msg: InboundMessage,
  state: ConversationState,
  waId: string,
  deps: Deps,
): Promise<AdvanceResult> {
  const data = state.data;
  const t = normText(msg);

  // Mots de réinitialisation → nouvelle commande.
  if (state.step === "greet" || RESET_WORDS.has(t)) {
    return startOrder(deps);
  }

  // Garde-fou de cohérence : le menu a été republié en cours de commande.
  if (
    data.menuVersion != null &&
    deps.catalog.version != null &&
    deps.catalog.version !== data.menuVersion
  ) {
    return startOrder(deps, [
      text("Le menu vient d'être mis à jour — on reprend la commande 🙂"),
    ]);
  }

  // Raccourci « panier » depuis les étapes de sélection.
  if ((t === "panier" || t === "cart") &&
      (state.step === "category" || state.step === "item")) {
    const cart = data.cart ?? [];
    if (cart.length > 0)
      return { next: { step: "cart", data }, outbound: [interactive(flow.cartView(cart))] };
  }

  switch (state.step) {
    case "service": {
      let key = picked(msg, "svc") as ServiceKey | null;
      if (!key && msg.text) key = serviceFromText(msg.text, deps.catalog);
      const service = key ? findService(deps.catalog, key) : undefined;
      if (!service) return reprompt(state, interactive(flow.serviceButtons(deps.catalog)));
      return showCategories(service, data);
    }

    case "category": {
      const service = data.serviceKey
        ? findService(deps.catalog, data.serviceKey)
        : undefined;
      if (!service) return startOrder(deps);
      let ci = -1;
      const raw = picked(msg, "cat");
      if (raw != null) ci = Number(raw);
      else if (msg.text) {
        const n = norm(msg.text);
        const byNum = typedIndex(n, service.categories.length);
        if (byNum >= 0) ci = byNum;
        else
          ci = service.categories.findIndex(
            (c) => n.length >= 3 && norm(c.title).includes(n),
          );
      }
      if (!Number.isInteger(ci) || ci < 0 || ci >= service.categories.length)
        return reprompt(state, interactive(flow.categoryList(service)));
      return {
        next: { step: "item", data: { ...data, catIndex: ci, catPage: 0 } },
        outbound: [interactive(flow.itemList(service, ci, 0))],
      };
    }

    case "item": {
      const service = data.serviceKey
        ? findService(deps.catalog, data.serviceKey)
        : undefined;
      const ci = data.catIndex ?? 0;
      if (!service || !service.categories[ci]) return startOrder(deps);
      const page = data.catPage ?? 0;
      const nt = norm(msg.text ?? "");

      if (msg.reply?.id === "more:item" || nt === "plus" || nt === "suite") {
        const np = page + 1;
        return {
          next: { step: "item", data: { ...data, catPage: np } },
          outbound: [interactive(flow.itemList(service, ci, np))],
        };
      }

      let itemId = picked(msg, "item");
      if (!itemId && msg.text) {
        const items = service.categories[ci].items;
        const start = page * flow.PAGE_SIZE;
        const pageItems = items.slice(start, start + flow.PAGE_SIZE);
        const byNum = typedIndex(nt, pageItems.length);
        if (byNum >= 0) itemId = pageItems[byNum].id;
        else {
          const found = items.find((it) => nt.length >= 3 && norm(it.name).includes(nt));
          if (found) itemId = found.id;
        }
      }
      const resolved = itemId ? resolveItem(deps.catalog, itemId) : null;
      if (!resolved)
        return reprompt(state, interactive(flow.itemList(service, ci, page)));

      return {
        next: { step: "quantity", data: { ...data, pendingItemId: resolved.item.id } },
        outbound: [interactive(flow.quantityButtons(resolved.item))],
      };
    }

    case "quantity": {
      const resolved = data.pendingItemId
        ? resolveItem(deps.catalog, data.pendingItemId)
        : null;
      if (!resolved) return startOrder(deps);

      const q = picked(msg, "qty");
      let qty = q != null ? Number(q) : Number((msg.text ?? "").trim());
      if (!Number.isInteger(qty) || qty < 1 || qty > 50)
        return reprompt(state, interactive(flow.quantityButtons(resolved.item)));
      qty = Math.min(qty, 50);

      const cart = addToCart(data.cart ?? [], {
        id: resolved.item.id,
        name: resolved.item.name,
        priceCents: resolved.item.priceCents,
        qty,
        serviceKey: resolved.service.key,
        category: resolved.category.title,
      });
      const next: ConversationState = {
        step: "after_add",
        data: { ...data, cart, pendingItemId: undefined },
      };
      return { next, outbound: [interactive(flow.afterAddButtons(cart))] };
    }

    case "after_add": {
      let choice = picked(msg, "after");
      if (!choice && msg.text) {
        const n = norm(msg.text);
        if (n.includes("panier") || n === "2") choice = "cart";
        else if (n.includes("command") || n.includes("payer") || n.includes("termin") || n === "3")
          choice = "checkout";
        else if (n.includes("continu") || n.includes("autre") || n.includes("ajout") || n === "1")
          choice = "more";
      }
      if (choice === "cart") {
        return {
          next: { step: "cart", data },
          outbound: [interactive(flow.cartView(data.cart ?? []))],
        };
      }
      if (choice === "checkout") return goCheckout(deps, data);
      if (choice === "more") {
        const service = data.serviceKey
          ? findService(deps.catalog, data.serviceKey)
          : undefined;
        if (!service) return startOrder(deps);
        return showCategories(service, data);
      }
      return reprompt(state, interactive(flow.afterAddButtons(data.cart ?? [])));
    }

    case "cart": {
      let choice = picked(msg, "cart");
      if (!choice && msg.text) {
        const n = norm(msg.text);
        if (n.includes("command") || n.includes("payer") || n.includes("termin") || n === "2")
          choice = "checkout";
        else if (n.includes("vider") || n.includes("supprim") || n.includes("annul") || n === "3")
          choice = "clear";
        else if (n.includes("continu") || n.includes("ajout") || n === "1") choice = "more";
      }
      if (choice === "checkout") return goCheckout(deps, data);
      if (choice === "clear") {
        return startOrder(deps, [text("Panier vidé 🗑️")]);
      }
      if (choice === "more") {
        const service = data.serviceKey
          ? findService(deps.catalog, data.serviceKey)
          : undefined;
        if (!service) return startOrder(deps);
        return showCategories(service, data);
      }
      return reprompt(state, interactive(flow.cartView(data.cart ?? [])));
    }

    case "details": {
      const note = (msg.text ?? "").trim();
      if (note.length < 2)
        return reprompt(
          state,
          text("Merci de décrire vos plats en quelques mots 🙂"),
        );
      return goPickup(deps, { ...data, detailsNote: note.slice(0, 500) });
    }

    case "pickup_time": {
      const options = buildPickupOptions(deps.hours, deps.now.date, deps.now.time);
      let suffix: string | null = null;

      const sel = msg.reply?.id;
      if (sel && sel.startsWith("time:")) {
        suffix = sel.slice("time:".length);
      } else if (msg.text) {
        const n = norm(msg.text);
        if (n.includes("possible") || n.includes("asap") || n.includes("maintenant") || n.includes("des que")) {
          suffix = "asap";
        } else {
          const byNum = typedIndex(n, options.length);
          if (byNum >= 0) suffix = options[byNum].id.slice("time:".length);
          else {
            // Heure tapée : "12h30" / "12:30" / "12 30" → "12:30".
            const hhmm = n.replace(/\s/g, "").replace(/h/i, ":");
            const match = options.find((o) => o.id === `time:${hhmm}`);
            if (match) suffix = hhmm;
          }
        }
      }

      if (!suffix)
        return reprompt(state, interactive(flow.pickupTimeList(options)));

      const pickupTime = suffix === "asap" ? "Dès que possible" : toFrenchTime(suffix);
      return {
        next: { step: "name", data: { ...data, pickupTime } },
        outbound: [text("Parfait. À quel nom dois-je enregistrer la commande ?")],
      };
    }

    case "name": {
      const name = (msg.text ?? "").trim();
      if (name.length < 2 || name.length > 80)
        return reprompt(state, text("Merci d'indiquer un nom (2 à 80 caractères)."));
      return {
        next: { step: "confirm", data: { ...data, customerName: name } },
        outbound: [
          interactive(
            flow.confirmRecap(
              data.cart ?? [],
              data.pickupTime ?? "",
              name,
              data.detailsNote,
            ),
          ),
        ],
      };
    }

    case "confirm": {
      let c = picked(msg, "confirm");
      if (!c && msg.text) {
        const n = norm(msg.text);
        if (n.includes("oui") || n.includes("confirm") || n === "ok" || n === "1") c = "yes";
        else if (n.includes("non") || n.includes("annul") || n === "2") c = "no";
      }
      if (c === "no")
        return {
          next: FRESH_STATE,
          outbound: [
            text("Commande annulée. Tapez « menu » pour recommencer 🙂"),
          ],
          clear: true,
        };
      if (c !== "yes")
        return reprompt(
          state,
          interactive(
            flow.confirmRecap(
              data.cart ?? [],
              data.pickupTime ?? "",
              data.customerName ?? "",
              data.detailsNote,
            ),
          ),
        );

      const order = await deps.createOrder(state, waId);
      const msgBody =
        `Merci ${data.customerName ?? ""} ! 🙏\n` +
        `Votre commande ${order.ref} est confirmée.\n` +
        `🕒 Retrait : ${data.pickupTime}\n` +
        `💶 Paiement sur place.\n\nÀ tout de suite chez Parvana !`;
      return { next: FRESH_STATE, outbound: [text(msgBody)], clear: true };
    }

    default:
      return startOrder(deps);
  }
}
