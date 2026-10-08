/**
 * Identity, contact, and hero copy.
 * Partnerships, work, and reviews live in `content/tijo-site.json`
 * (optionally overlaid from a gist named `tijo-site.json` — see `getSiteContent`).
 */

export const site = {
  name: "Green Corner Marketing",
  shortName: "Green Corner",
  tagline: "SEO, digital media, and websites for Alberta businesses.",
  location: "Edmonton, Alberta",
  locationFull: "Edmonton, Alberta, Canada",

  /** Production canonical. Staging should never steal this. */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://greencornermarketing.ca",

  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "hello@greencornermarketing.ca",
  phone: process.env.NEXT_PUBLIC_CONTACT_PHONE ?? "(780) 000-0000",
  phoneHref: process.env.NEXT_PUBLIC_CONTACT_PHONE_HREF ?? "tel:+17800000000",

  social: {
    instagram: "#",
    facebook: "#",
    linkedin: "#",
  },

  nav: [
    { label: "Services", href: "#services" },
    { label: "Work", href: "#work" },
    { label: "About", href: "#about" },
    { label: "Contact", href: "#contact" },
  ] as const,

  hero: {
    eyebrow: "Edmonton, Alberta",
    headline: "Marketing that grows Edmonton businesses.",
    lead: "We help local businesses get found, get seen, and get chosen through SEO, digital media, and websites built to convert.",
    primaryCta: { label: "Start a Project", href: "#contact" },
    secondaryCta: { label: "See our work", href: "#work" },
    graph: {
      trend: "Trending up",
      ranking: "Top 3 Local Ranking",
      leads: "More Leads via Web",
    },
  },
} as const;

export type SiteConfig = typeof site;
