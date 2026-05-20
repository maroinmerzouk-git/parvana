import type { Metadata } from "next";
import { RouteStub } from "@/components/site/route-stub";

export const metadata: Metadata = { title: "Menu" };

export default function MenuPage() {
  return (
    <RouteStub
      eyebrow="Menu"
      title="Midi & soir"
      intro="Lecture des menus depuis content/menu.json (statique), puis migration vers Supabase au Chunk E."
      chunk="Chunk B"
    />
  );
}
