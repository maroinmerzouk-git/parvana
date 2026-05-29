import type { Metadata } from "next";
import { getCurrentMenu } from "@/lib/menu";
import { MenuEditor } from "@/components/admin/menu-editor";

export const metadata: Metadata = { title: "Menu — gestion" };
export const dynamic = "force-dynamic";

export default async function AdminMenuPage() {
  const { menu, version, source } = await getCurrentMenu();

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
          Pour chaque service, choisissez «&nbsp;Formule seule&nbsp;» pour
          n&apos;afficher que l&apos;intitulé de la formule, ou «&nbsp;Carte
          complète&nbsp;» pour détailler les plats. Cliquez sur «&nbsp;Valider et
          publier&nbsp;» pour mettre à jour le site.
        </p>
      </header>

      <MenuEditor
        initialMenu={menu}
        initialVersion={version}
        source={source}
      />
    </section>
  );
}
