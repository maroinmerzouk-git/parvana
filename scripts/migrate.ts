import { config } from "dotenv";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { migrate } from "drizzle-orm/neon-http/migrator";

// Load .env.local first (Next.js convention), then .env as fallback
config({ path: ".env.local" });
config({ path: ".env" });

async function main() {
  const url = process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL;
  if (!url) {
    console.error(
      "✗ DATABASE_URL_UNPOOLED ou DATABASE_URL non défini dans .env.local",
    );
    process.exit(1);
  }

  console.log("⏳ Application des migrations…");
  const db = drizzle(neon(url));
  await migrate(db, { migrationsFolder: "./db/migrations" });
  console.log("✓ Migrations appliquées.");
}

main().catch((err) => {
  console.error("✗ Échec de la migration :", err);
  process.exit(1);
});
