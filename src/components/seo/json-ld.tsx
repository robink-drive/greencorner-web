import { site } from "@/lib/site";

/** Escape text for embedding inside a JSON-LD script. */
function escapeJsonLd(value: string): string {
  return value.replace(/</g, "\\u003c");
}

export function buildOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": ["Organization", "LocalBusiness", "ProfessionalService"],
    name: site.name,
    description: site.tagline,
    url: site.url,
    email: site.email,
    telephone: site.phone,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Edmonton",
      addressRegion: "AB",
      addressCountry: "CA",
    },
    areaServed: {
      "@type": "AdministrativeArea",
      name: "Alberta",
    },
  };
}

export function JsonLd({ data }: { data: Record<string, unknown> }) {
  const json = escapeJsonLd(JSON.stringify(data));
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
