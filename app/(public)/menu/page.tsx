import type { Metadata } from "next";
import Link from "next/link";
import { getCurrentMenu } from "@/lib/menu";
import { MenuServiceBlock } from "@/components/menu/menu-service";
import { PhotoStrip } from "@/components/site/photo-strip";

export const metadata: Metadata = {
  title: "Menu",
  description:
    "Menu midi et soir de Parvana — cuisine d'Asie Centrale à Nantes, faite maison, halal.",
};

export const revalidate = 60;

export default async function MenuPage() {
  const { menu } = await getCurrentMenu();

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

      <section className="border-b border-ink/10">
        <div className="mx-auto max-w-6xl px-6 py-12 md:px-10 md:py-16">
          <PhotoStrip
            photos={[
              {
                src: "/photos/menu-aubergine.jpg",
                alt: "Aubergines fondantes aux pois chiches croustillants",
              },
              {
                src: "/photos/plat-signature.jpg",
                alt: "Aubergine, légumes marinés et pain plat dans un bol vert",
              },
              {
                src: "/photos/menu-baklava.jpg",
                alt: "Baklava aux fruits secs présenté en vitrine",
              },
            ]}
          />
        </div>
      </section>

      <MenuServiceBlock label="midi" service={menu.midi} />
      <MenuServiceBlock label="soir" service={menu.soir} />
      {menu.boissons?.active && (
        <MenuServiceBlock
          label="boissons"
          service={menu.boissons}
          eyebrow="Carte des boissons"
        />
      )}

      <section className="border-t border-ink/10 bg-sand">
        <div className="mx-auto max-w-6xl px-6 py-16 md:px-10 md:py-20">
          <p className="text-xs uppercase tracking-[0.22em] text-terracotta">
            Pâtisseries maison
          </p>
          <h2 className="mt-4 max-w-xl font-display text-3xl italic text-ink md:text-4xl">
            Les créations de la cheffe.
          </h2>
          <PhotoStrip
            className="mt-10"
            photos={[
              {
                src: "/photos/menu-gateau-semoule.jpg",
                alt: "Part de gâteau de semoule aux graines sur une assiette bleue",
              },
              {
                src: "/photos/patisserie-pistache.jpg",
                alt: "Biscuits sablés saupoudrés de pistache concassée",
              },
              {
                src: "/photos/patisserie-roules.jpg",
                alt: "Roulés feuilletés à la pistache, saupoudrés de sucre glace",
              },
              {
                src: "/photos/patisserie-miel.jpg",
                alt: "Bouchées au miel et fruits secs dans un plat en terre cuite",
              },
            ]}
          />
        </div>
      </section>
    </>
  );
}
