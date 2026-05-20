import { config } from "dotenv";
config({ path: ".env.local" });

import { neon } from "@neondatabase/serverless";

async function main() {
  const sql = neon(process.env.DATABASE_URL!);

  const rows = await sql`
    SELECT id, name, email, date, service, arrival_time, party_size,
           status, seen_at, client_email_sent, confirmation_email_sent,
           rejection_email_sent, created_at
    FROM reservations
    ORDER BY created_at DESC
    LIMIT 5
  `;
  console.log(`Reservations (${rows.length}):`);
  for (const r of rows) {
    console.log(`  [${r.status}] ${r.name} | ${r.date} ${r.arrival_time} | ${r.party_size}p`);
    console.log(`    id=${r.id}`);
    console.log(`    flags: client_sent=${r.client_email_sent} conf_sent=${r.confirmation_email_sent} rej_sent=${r.rejection_email_sent} seen=${r.seen_at ?? "null"}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
