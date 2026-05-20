import type { Metadata } from "next";
import { RouteStub } from "@/components/site/route-stub";

export const metadata: Metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <RouteStub
      eyebrow="Contact"
      title="Nous trouver"
      intro="Adresse, horaires, carte Google Maps, galerie Instagram (4 derniers posts via embeds blockquote)."
      chunk="Chunk B"
    />
  );
}
