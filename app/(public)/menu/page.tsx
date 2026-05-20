import type { Metadata } from "next";
import Link from "next/link";
import { getMenu } from "@/lib/menu";
import { MenuServiceBlock } from "@/components/menu/menu-service";

export const metadata: Metadata = {
  title: "Menu",
  description:
    "Menu midi et soir de Parvana — cuisine afghane à Nantes, faite maison, halal.",
};

export default function MenuPage() {
  const menu = getMenu();

  return (
    <>
      <section className="border-b border-ink/10">
        <div className="mx-auto max-w-4xl px-6 pb-10 pt-20 md:px-10 md:pb-12 md:pt-28">
          <p className="text-xs uppercase tracking-[0.22em] text-terracotta">
            La carte
          </p>
          <h1 className="mt-6 font-display text-5xl leading-[0.95] text-ink md:text-7xl">
            Midi <span className="italic text-terracotta">&</span> soir
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-ink-soft">
            Une carte courte qui évolue au fil des saisons. Tous les plats sont
            faits maison, halal, et préparés chaque matin sur place.
          </p>
          <p className="mt-3 text-sm text-ink-soft">
            Les prix sont indiqués à la vitrine du restaurant. Pour toute
            question :{" "}
            <Link
              href="/contact"
              className="text-terracotta hover:text-terracotta-dark"
            >
              nous contacter
            </Link>
            .
          </p>
        </div>
      </section>

      <MenuServiceBlock label="midi" service={menu.midi} />
      <MenuServiceBlock label="soir" service={menu.soir} />
    </>
  );
}
