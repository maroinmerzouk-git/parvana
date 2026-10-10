import { test } from "node:test";
import assert from "node:assert/strict";
import { parsePriceCents, formatCents, priceLabel } from "./price";

test("parsePriceCents handles the three menu price shapes", () => {
  assert.equal(parsePriceCents("7€"), 700);
  assert.equal(parsePriceCents("19€"), 1900);
  assert.equal(parsePriceCents("6,50€"), 650);
  assert.equal(parsePriceCents("4,50 €"), 450);
  assert.equal(parsePriceCents("15,50€"), 1550);
});

test("parsePriceCents returns null for formule / empty / junk", () => {
  assert.equal(parsePriceCents(null), null);
  assert.equal(parsePriceCents(""), null);
  assert.equal(parsePriceCents("gratuit"), null);
  assert.equal(parsePriceCents("1,2,3€"), null);
});

test("formatCents / priceLabel render French prices", () => {
  assert.equal(formatCents(1900), "19 €");
  assert.equal(formatCents(650), "6,50 €");
  assert.equal(priceLabel(null), "—");
  assert.equal(priceLabel(450), "4,50 €");
});
