import type { Metadata } from "next";
import { RouteStub } from "@/components/site/route-stub";

export const metadata: Metadata = { title: "Le restaurant" };

export default function RestaurantPage() {
  return (
    <RouteStub
      eyebrow="Le restaurant"
      title="L'histoire de Parvana"
      intro="Présentation longue de Maryam, du parcours via Fair-e / Magmaa / Carquefood, et de l'ouverture en juin 2025."
      chunk="Chunk B"
    />
  );
}
