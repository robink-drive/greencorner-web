import { site } from "@/lib/site";
import { isProductionDeployment } from "@/lib/deployment";
import type { Metadata } from "next";

/** Canonical site URL. Always the production apex for SEO. */
export function getCanonicalSiteUrl(): string {
  return site.url.replace(/\/$/, "");
}

export function buildRootMetadata(): Metadata {
  const title = `${site.name} | SEO, Digital Media & Web Design in Edmonton`;
  const description =
    "Edmonton marketing studio helping Alberta businesses grow through SEO, digital media, and websites built to convert.";

  return {
    metadataBase: new URL(getCanonicalSiteUrl()),
    title: {
      default: title,
      template: `%s | ${site.shortName}`,
    },
    description,
    alternates: {
      canonical: "/",
    },
    openGraph: {
      type: "website",
      locale: "en_CA",
      url: getCanonicalSiteUrl(),
      siteName: site.name,
      title,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    robots: isProductionDeployment()
      ? { index: true, follow: true }
      : { index: false, follow: false },
  };
}
