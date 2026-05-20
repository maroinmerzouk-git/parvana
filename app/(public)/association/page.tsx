import type { Metadata } from "next";
import { RouteStub } from "@/components/site/route-stub";

export const metadata: Metadata = { title: "Association" };

export default function AssociationPage() {
  return (
    <RouteStub
      eyebrow="Association"
      title="Soutenir, transmettre"
      intro="Page dédiée à l'engagement associatif de Parvana — contenu à recevoir de la cliente."
      chunk="Chunk E"
    />
  );
}
