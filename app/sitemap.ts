import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

/**
 * sitemap.xml — liste les pages publiques indexables. Les espaces /admin
 * et /api en sont volontairement exclus (cf. robots.ts).
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const routes: Array<{
    path: string;
    changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
    priority: number;
  }> = [
    { path: "/", changeFrequency: "weekly", priority: 1 },
    { path: "/menu", changeFrequency: "weekly", priority: 0.9 },
    { path: "/restaurant", changeFrequency: "monthly", priority: 0.8 },
    { path: "/reservation", changeFrequency: "monthly", priority: 0.8 },
    { path: "/traiteur", changeFrequency: "monthly", priority: 0.7 },
    { path: "/association", changeFrequency: "monthly", priority: 0.6 },
    { path: "/contact", changeFrequency: "monthly", priority: 0.7 },
    { path: "/mentions-legales", changeFrequency: "yearly", priority: 0.2 },
    { path: "/confidentialite", changeFrequency: "yearly", priority: 0.2 },
  ];

  const lastModified = new Date();

  return routes.map(({ path, changeFrequency, priority }) => ({
    url: `${SITE_URL}${path}`,
    lastModified,
    changeFrequency,
    priority,
  }));
}
