import { config } from "dotenv";
config({ path: ".env.local" });

import { neon } from "@neondatabase/serverless";

async function main() {
  const sql = neon(process.env.DATABASE_URL!);
  const rows = await sql`SELECT id, name, email FROM reservations ORDER BY created_at DESC`;
  console.log("Reservations and their client emails:");
  for (const r of rows) {
    console.log(`  - ${r.name} <${r.email}>  id=${r.id}`);
  }
}
main().catch(console.error);
