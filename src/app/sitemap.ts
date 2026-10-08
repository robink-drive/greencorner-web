import type { MetadataRoute } from "next";
import { getCanonicalSiteUrl } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getCanonicalSiteUrl();
  return [
    {
      url: base,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
