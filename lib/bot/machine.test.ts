import { test } from "node:test";
import assert from "node:assert/strict";
import type { InboundMessage } from "@/lib/wa/types";
import type { OpeningHours } from "@/lib/hours";
import { advance, type Deps } from "./machine";
import type { Catalog } from "./menu-snapshot";
import { cartTotals, type ConversationState } from "./state";

const catalog: Catalog = {
  version: 7,
  services: [
    {
      key: "midi",
      label: "Midi",
      formule: "Formule 15,50 €",
      categories: [
        {
          title: "Plats",
          items: [
            { id: "midi:0:0", name: "Kabuli", priceCents: null },
            { id: "midi:0:1", name: "Mantu", priceCents: null },
          ],
        },
      ],
    },
    {
      key: "soir",
      label: "Soir",
      formule: null,
      categories: [
        {
          title: "Plats",
          items: [{ id: "soir:0:0", name: "Qabuli", priceCents: 1900 }],
        },
      ],
    },
  ],
};

const openDay = {
  closed: false,
  ranges: [
    { start: "12:00", end: "14:30", label: "" },
    { start: "19:00", end: "22:00", label: "" },
  ],
};
const hours = {
  days: {
    monday: openDay,
    tuesday: openDay,
    wednesday: openDay,
    thursday: openDay,
    friday: openDay,
    saturday: openDay,
    sunday: openDay,
  },
} as OpeningHours;

function makeDeps(over: Partial<Deps> = {}): Deps & { created: () => number } {
  let count = 0;
  const deps: Deps = {
    catalog,
    hours,
    now: { date: "2026-10-13", time: "11:00" }, // mardi, avant service
    createOrder: async () => {
      count += 1;
      return { id: "11112222-3333", ref: "#1111", totalCents: 3800 };
    },
    ...over,
  };
  return Object.assign(deps, { created: () => count });
}

const reply = (id: string): InboundMessage => ({ id: "m", from: "336", reply: { id, title: "" } });
const txt = (body: string): InboundMessage => ({ id: "m", from: "336", text: body });

test("happy path: greet → order confirmed", async () => {
  const deps = makeDeps();
  let state: ConversationState = { step: "greet", data: {} };

  let r = await advance(txt("bonjour"), state, "336", deps);
  assert.equal(r.next.step, "service");
  state = r.next;

  r = await advance(reply("svc:soir"), state, "336", deps);
  assert.equal(r.next.step, "category");
  assert.equal(r.next.data.serviceKey, "soir");
  state = r.next;

  r = await advance(reply("cat:0"), state, "336", deps);
  assert.equal(r.next.step, "item");
  state = r.next;

  r = await advance(reply("item:soir:0:0"), state, "336", deps);
  assert.equal(r.next.step, "quantity");
  assert.equal(r.next.data.pendingItemId, "soir:0:0");
  state = r.next;

  r = await advance(reply("qty:2"), state, "336", deps);
  assert.equal(r.next.step, "after_add");
  assert.equal(r.next.data.cart?.length, 1);
  assert.equal(r.next.data.cart?.[0].qty, 2);
  assert.equal(cartTotals(r.next.data.cart ?? []).totalCents, 3800);
  state = r.next;

  // soir = food → le bot demande d'abord le détail des plats.
  r = await advance(reply("after:checkout"), state, "336", deps);
  assert.equal(r.next.step, "details");
  assert.ok(r.outbound[0].type === "text");
  state = r.next;

  r = await advance(txt("2 Qabuli, 1 Baklava"), state, "336", deps);
  assert.equal(r.next.step, "pickup_time");
  assert.equal(r.next.data.detailsNote, "2 Qabuli, 1 Baklava");
  assert.ok(r.outbound[0].type === "interactive");
  state = r.next;

  r = await advance(reply("time:12:00"), state, "336", deps);
  assert.equal(r.next.step, "name");
  state = r.next;

  r = await advance(txt("Sara"), state, "336", deps);
  assert.equal(r.next.step, "confirm");
  assert.equal(r.next.data.customerName, "Sara");
  state = r.next;

  r = await advance(reply("confirm:yes"), state, "336", deps);
  assert.equal(r.clear, true);
  assert.equal(deps.created(), 1);
  assert.ok(r.outbound[0].type === "text" && r.outbound[0].body.includes("#1111"));
});

test("menu republished mid-order resets to service selection", async () => {
  const deps = makeDeps();
  const state: ConversationState = {
    step: "category",
    data: { menuVersion: 5, serviceKey: "soir", cart: [] }, // version périmée
  };
  const r = await advance(reply("cat:0"), state, "336", deps);
  assert.equal(r.next.step, "service");
  assert.ok(r.outbound[0].type === "text" && r.outbound[0].body.includes("mis à jour"));
});

test("typed input drives the flow when buttons don't arrive", async () => {
  const deps = makeDeps();
  let state: ConversationState = { step: "greet", data: {} };

  let r = await advance(txt("bonjour"), state, "336", deps);
  state = r.next; // step service

  // type "2" instead of tapping → soir
  r = await advance(txt("2"), state, "336", deps);
  assert.equal(r.next.step, "category");
  assert.equal(r.next.data.serviceKey, "soir");
  state = r.next;

  // type "1" → first category
  r = await advance(txt("1"), state, "336", deps);
  assert.equal(r.next.step, "item");
  state = r.next;

  // type "1" → first item
  r = await advance(txt("1"), state, "336", deps);
  assert.equal(r.next.step, "quantity");
  state = r.next;

  // type quantity
  r = await advance(txt("2"), state, "336", deps);
  assert.equal(r.next.step, "after_add");
  state = r.next;

  // type "commander"
  r = await advance(txt("commander"), state, "336", deps);
  assert.equal(r.next.step, "details"); // soir = food → details first
  state = r.next;

  r = await advance(txt("2 Qabuli"), state, "336", deps);
  assert.equal(r.next.step, "pickup_time");
  state = r.next;

  // type "1" → first pickup option (ASAP)
  r = await advance(txt("1"), state, "336", deps);
  assert.equal(r.next.step, "name");
  state = r.next;

  r = await advance(txt("Sara"), state, "336", deps);
  assert.equal(r.next.step, "confirm");
  state = r.next;

  // type "oui"
  r = await advance(txt("oui"), state, "336", deps);
  assert.equal(r.clear, true);
  assert.equal(deps.created(), 1);
});

test("closed today blocks ordering", async () => {
  const closedHours = {
    days: { ...hours.days, tuesday: { closed: true, ranges: [] } },
  } as OpeningHours;
  const deps = makeDeps({ hours: closedHours });
  const r = await advance(txt("bonjour"), { step: "greet", data: {} }, "336", deps);
  assert.equal(r.clear, true);
  assert.ok(r.outbound[0].type === "text" && r.outbound[0].body.includes("fermés"));
});
