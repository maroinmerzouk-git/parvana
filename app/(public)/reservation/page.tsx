import type { Metadata } from "next";
import { RouteStub } from "@/components/site/route-stub";

export const metadata: Metadata = { title: "Réservation" };

export default function ReservationPage() {
  return (
    <RouteStub
      eyebrow="Réservation"
      title="Réserver une table"
      intro="Formulaire de réservation avec validation Zod, statut pending par défaut, validation manuelle par Maryam."
      chunk="Chunk C"
    />
  );
}
