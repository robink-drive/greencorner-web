import type { MetadataRoute } from "next";
import { getCanonicalSiteUrl } from "@/lib/seo";
import { isProductionDeployment } from "@/lib/deployment";

export default function robots(): MetadataRoute.Robots {
  const base = getCanonicalSiteUrl();
  if (!isProductionDeployment()) {
    return {
      rules: { userAgent: "*", disallow: "/" },
    };
  }

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/thank-you"],
    },
    sitemap: `${base}/sitemap.xml`,
  };
}
