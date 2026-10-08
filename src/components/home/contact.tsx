import Link from "next/link";
import { site } from "@/lib/site";
import type { SiteContent } from "@/lib/content";
import { safeMailto, safeTel } from "@/lib/safe-href";
import { Section } from "@/components/layout/section";
import { ContactForm } from "@/components/home/contact-form";

export function Contact({ copy }: { copy: SiteContent["contactCopy"] }) {
  return (
    <Section id="contact" aria-labelledby="contact-heading">
      <div className="grid items-start gap-12 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.15fr)] md:gap-16 lg:gap-24">
        <div>
          <p className="eyebrow mb-6">Get in touch</p>
          <h2 id="contact-heading" className="display-section max-w-[12ch]">
            {copy.headline}
          </h2>
          <p className="lead mt-5 max-w-md">{copy.lead}</p>

          <ul className="mt-12 space-y-7 text-left text-lg text-muted-foreground">
            <li>
              <span className="block text-sm font-medium text-foreground">
                Email
              </span>
              <Link
                href={safeMailto(site.email)}
                className="mt-1 inline-block transition-colors hover:text-foreground"
              >
                {site.email}
              </Link>
            </li>
            <li>
              <span className="block text-sm font-medium text-foreground">
                Phone
              </span>
              <Link
                href={safeTel(site.phoneHref)}
                className="mt-1 inline-block transition-colors hover:text-foreground"
              >
                {site.phone}
              </Link>
            </li>
            <li>
              <span className="block text-sm font-medium text-foreground">
                Location
              </span>
              <span className="mt-1 block">{site.locationFull}</span>
            </li>
          </ul>
        </div>

        <ContactForm />
      </div>
    </Section>
  );
}
