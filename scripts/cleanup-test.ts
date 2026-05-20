/**
 * One-shot: supprime toutes les réservations existantes (test data).
 * À ne PAS exécuter en production avec des vraies réservations.
 */
import { config } from "dotenv";
config({ path: ".env.local" });

import { neon } from "@neondatabase/serverless";

async function main() {
  const sql = neon(process.env.DATABASE_URL!);
  const before = await sql`SELECT count(*)::int as n FROM reservations`;
  console.log(`Before: ${before[0].n} reservations`);

  const deleted = await sql`DELETE FROM reservations RETURNING id, name`;
  console.log(`Deleted ${deleted.length} rows:`);
  for (const r of deleted) {
    console.log(`  - ${r.name} (${r.id})`);
  }

  const after = await sql`SELECT count(*)::int as n FROM reservations`;
  console.log(`After: ${after[0].n} reservations`);
}
main().catch((err) => {
  console.error(err);
  process.exit(1);
});
