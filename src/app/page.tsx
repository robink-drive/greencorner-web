import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { Hero } from "@/components/home/hero";
import { Clients } from "@/components/home/clients";
import { Services, Process } from "@/components/home/services";
import { Work } from "@/components/home/work";
import { About } from "@/components/home/about";
import { Reviews } from "@/components/home/reviews";
import { Contact } from "@/components/home/contact";
import { getSiteContent } from "@/lib/content";
import {
  JsonLd,
  buildOrganizationJsonLd,
} from "@/components/seo/json-ld";

export default async function HomePage() {
  const content = await getSiteContent();

  return (
    <>
      <JsonLd data={buildOrganizationJsonLd()} />
      <SiteHeader />
      <main id="main-content">
        <Hero />
        <Clients clients={content.clients} />
        <Services services={content.services} />
        <Process steps={content.process} />
        <Work projects={content.work} />
        <About about={content.about} />
        <Reviews reviews={content.reviews} />
        <Contact copy={content.contactCopy} />
      </main>
      <SiteFooter />
    </>
  );
}
