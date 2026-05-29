import type { Metadata } from "next";
import { ReservationForm } from "@/components/reservation/reservation-form";
import { PhotoStrip } from "@/components/site/photo-strip";

export const metadata: Metadata = {
  title: "Réservation",
  description:
    "Réserver une table chez Parvana à Nantes. Demande validée manuellement par Maryam.",
};

export default function ReservationPage() {
  return (
    <>
      <section className="border-b border-ink/10">
        <div className="mx-auto max-w-3xl px-6 pb-12 pt-20 md:px-10 md:pb-16 md:pt-28">
          <p className="text-xs uppercase tracking-[0.22em] text-terracotta">
            Réservation
          </p>
          <h1 className="mt-6 font-display text-5xl leading-[0.95] text-ink md:text-7xl">
            <span className="italic">Réserver</span>
            <br />
            une table.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-ink-soft">
            Chaque demande est lue et confirmée personnellement par Maryam.
            Vous recevrez d&apos;abord un email d&apos;accusé de réception,
            puis un email de confirmation une fois votre table validée. Sans
            ce second email, la table n&apos;est pas garantie.
          </p>
        </div>
      </section>

      <section className="border-b border-ink/10 bg-sand">
        <div className="mx-auto max-w-2xl px-6 py-12 md:px-10 md:py-16">
          <PhotoStrip
            photos={[
              {
                src: "/photos/salle-table.jpg",
                alt: "Table dressée avec un bouquet de fleurs séchées devant un mur de tapis",
              },
            ]}
          />
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-2xl px-6 py-16 md:px-10 md:py-20">
          <ReservationForm />
        </div>
      </section>
    </>
  );
}
