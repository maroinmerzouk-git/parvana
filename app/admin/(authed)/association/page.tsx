import type { Metadata } from "next";
import { getAssociationSettings } from "@/lib/association";
import { AssociationEditor } from "@/components/admin/association-editor";

export const metadata: Metadata = { title: "Association — gestion" };
export const dynamic = "force-dynamic";

export default async function AdminAssociationPage() {
  const settings = await getAssociationSettings();

  return (
    <section className="mx-auto max-w-5xl px-4 py-6 md:px-6 md:py-10">
      <header className="mb-6 flex flex-col gap-1">
        <p className="text-xs uppercase tracking-[0.22em] text-terracotta">
          Gestion
        </p>
        <h1 className="font-display text-4xl italic text-ink md:text-5xl">
          Association
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-ink-soft">
          Gérez la période affichée dans la section «&nbsp;Les ateliers&nbsp;»
          de la page Association — ou masquez complètement les dates.
        </p>
      </header>

      <AssociationEditor initial={settings} />
    </section>
  );
}
