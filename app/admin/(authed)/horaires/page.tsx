import type { Metadata } from "next";
import { getOpeningHours } from "@/lib/hours";
import { HoursEditor } from "@/components/admin/hours-editor";

export const metadata: Metadata = { title: "Horaires — gestion" };
export const dynamic = "force-dynamic";

export default async function AdminHoursPage() {
  const hours = await getOpeningHours();

  return (
    <section className="mx-auto max-w-5xl px-4 py-6 md:px-6 md:py-10">
      <header className="mb-6 flex flex-col gap-1">
        <p className="text-xs uppercase tracking-[0.22em] text-terracotta">
          Gestion
        </p>
        <h1 className="font-display text-4xl italic text-ink md:text-5xl">
          Horaires
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-ink-soft">
          Gérez les horaires d&apos;ouverture affichés sur la page Contact.
          Marquez un jour comme «&nbsp;Fermé&nbsp;» ou ajoutez plusieurs plages
          de service (midi, soir, brunch…).
        </p>
      </header>

      <HoursEditor initial={hours} />
    </section>
  );
}
