import type { Metadata } from "next";
import { getCurrentMenu } from "@/lib/menu";
import { MenuEditor } from "@/components/admin/menu-editor";

export const metadata: Metadata = { title: "Menu — gestion" };
export const dynamic = "force-dynamic";

export default async function AdminMenuPage() {
  const { menu, version, source } = await getCurrentMenu();
  const initialJson = JSON.stringify(menu, null, 2);

  return (
    <section className="mx-auto max-w-5xl px-4 py-6 md:px-6 md:py-10">
      <header className="mb-6 flex flex-col gap-1">
        <p className="text-xs uppercase tracking-[0.22em] text-terracotta">
          Gestion
        </p>
        <h1 className="font-display text-4xl italic text-ink md:text-5xl">
          Menu
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-ink-soft">
          Éditez le JSON ci-dessous puis cliquez sur «&nbsp;Valider et
          publier&nbsp;». La structure est validée avant publication —
          aucun changement n&apos;est mis en ligne si le JSON est invalide.
        </p>
      </header>

      <MenuEditor
        initialJson={initialJson}
        initialVersion={version}
        source={source}
      />

      <details className="mt-8 rounded-lg border border-ink/10 bg-sand/60 p-4 text-sm text-ink-soft">
        <summary className="cursor-pointer font-display text-base italic text-ink">
          Structure attendue
        </summary>
        <pre className="mt-3 overflow-auto rounded bg-beige p-3 text-xs text-ink">
{`{
  "midi": {
    "active": true,
    "intro": "Texte de présentation",
    "formule": "15,50€ ou null",
    "categories": [
      {
        "title": "Entrées",
        "items": [
          {
            "name": "Nom du plat",
            "description": "Description courte",
            "price": "6€ ou null",
            "tags": ["végétarien"]
          }
        ]
      }
    ]
  },
  "soir": { /* même structure */ }
}`}
        </pre>
        <p className="mt-3 text-xs">
          Tags acceptés&nbsp;: végétarien, vegan, épicé, signature, fait
          maison, soupe.
        </p>
      </details>
    </section>
  );
}
