import { test } from "node:test";
import assert from "node:assert/strict";
import { parseCourseMenu } from "./course-menu";
import { buildCatalog, findService } from "./menu-snapshot";
import { menuSchema } from "@/lib/schemas/menu";

const MIDI_TEXT = `Découvrez des assiettes composées de riz parfumé...

Notre carte change régulièrement selon les saisons.

À la carte

•⁠  ⁠Entrée : 5,50 €
•⁠  ⁠Plat : 14,50 €
•⁠  ⁠Dessert : 5,50 €

Formules

•⁠  ⁠Entrée + Plat ou Plat + Dessert : 17,50 €
•⁠  ⁠Entrée + Plat + Dessert : 22,50 €`;

const SOIR_TEXT = `À la carte

•⁠  ⁠Entrées : 7 €
•⁠  ⁠Plats : de 15 € à 24 €
•⁠  ⁠Desserts : de 7 € à 8 €

Une cuisine conviviale, à partager.`;

test("parseCourseMenu extracts courses and formules from midi text", () => {
  const m = parseCourseMenu(MIDI_TEXT);
  assert.deepEqual(
    m.courses.map((c) => [c.name, c.priceCents]),
    [["Entrée", 550], ["Plat", 1450], ["Dessert", 550]],
  );
  assert.deepEqual(
    m.formules.map((f) => f.priceCents),
    [1750, 2250],
  );
  assert.ok(m.formules[0].name.includes("+"));
});

test("parseCourseMenu handles price ranges in soir text", () => {
  const m = parseCourseMenu(SOIR_TEXT);
  const plat = m.courses.find((c) => c.name === "Plat")!;
  assert.equal(plat.priceCents, 1500);
  assert.equal(plat.priceMaxCents, 2400);
  assert.equal(m.formules.length, 0);
});

test("buildCatalog turns free-text food menu into orderable categories", () => {
  const menu = menuSchema.parse({
    midi: { active: true, mode: "texte", intro: "", formule: "", text: MIDI_TEXT, categories: [] },
    soir: { active: true, mode: "texte", intro: "", formule: "", text: SOIR_TEXT, categories: [] },
    boissons: { active: false, intro: "", formule: "", categories: [] },
  });
  const catalog = buildCatalog(menu, 18);
  const midi = findService(catalog, "midi")!;
  assert.deepEqual(midi.categories.map((c) => c.title), ["Formules", "À la carte"]);
  // à la carte course carries a positional id and a price
  const plat = midi.categories[1].items.find((i) => i.name === "Plat")!;
  assert.equal(plat.priceCents, 1450);

  const soir = findService(catalog, "soir")!;
  const soirPlat = soir.categories.find((c) => c.title === "À la carte")!.items.find((i) => i.name === "Plat")!;
  assert.equal(soirPlat.priceCents, 1500);
  assert.equal(soirPlat.priceNote, "15 € à 24 €");
});
