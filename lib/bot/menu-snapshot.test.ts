import { test } from "node:test";
import assert from "node:assert/strict";
import { menuSchema } from "@/lib/schemas/menu";
import staticMenu from "@/content/menu.json";
import {
  buildCatalog,
  parseBoissonsBlob,
  resolveItem,
  findService,
} from "./menu-snapshot";

const menu = menuSchema.parse(staticMenu);

test("parseBoissonsBlob splits headers, items and inline prices", () => {
  const cats = parseBoissonsBlob(
    "Cocktails\n- Lahla — Grenade, framboise. — 8€\n\nLimonades maison\n- Citron, abricot — 5€",
  );
  assert.equal(cats.length, 2);
  assert.equal(cats[0].title, "Cocktails");
  assert.equal(cats[0].items[0].name, "Lahla");
  assert.equal(cats[0].items[0].priceCents, 800);
  assert.equal(cats[1].title, "Limonades maison");
  assert.equal(cats[1].items[0].name, "Citron, abricot");
  assert.equal(cats[1].items[0].priceCents, 500);
});

test("buildCatalog exposes active services with positional ids", () => {
  const catalog = buildCatalog(menu, 42);
  assert.equal(catalog.version, 42);
  const keys = catalog.services.map((s) => s.key);
  assert.deepEqual(keys, ["midi", "soir", "boissons"]);

  // midi item prices are null (formule), soir item prices are parsed.
  const midi = findService(catalog, "midi")!;
  assert.equal(midi.categories[0].items[0].id, "midi:0:0");
  assert.equal(midi.categories[0].items[0].priceCents, null);

  const soir = findService(catalog, "soir")!;
  const pakawra = soir.categories[0].items[0];
  assert.equal(pakawra.id, "soir:0:0");
  assert.equal(pakawra.priceCents, 700);
});

test("resolveItem round-trips an id against the live catalog", () => {
  const catalog = buildCatalog(menu, 1);
  const boissons = findService(catalog, "boissons")!;
  const firstDrink = boissons.categories[0].items[0];
  const resolved = resolveItem(catalog, firstDrink.id);
  assert.ok(resolved);
  assert.equal(resolved!.item.name, firstDrink.name);
  assert.equal(resolved!.service.key, "boissons");
  assert.equal(resolveItem(catalog, "midi:99:99"), null);
});

test("buildCatalog drops inactive services", () => {
  const closed = menuSchema.parse({
    ...staticMenu,
    soir: { ...staticMenu.soir, active: false },
  });
  const catalog = buildCatalog(closed, 1);
  assert.equal(findService(catalog, "soir"), undefined);
  assert.ok(findService(catalog, "midi"));
});
