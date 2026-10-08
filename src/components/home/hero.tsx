import Image from "next/image";
import Link from "next/link";
import { site } from "@/lib/site";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { HeroGraph } from "@/components/home/hero-graph";

/**
 * Full-viewport hero: type-led and Apple-calm.
 * Soft foliage sits on the right (mockup v2) and fades into the page bg on the left.
 */
export function Hero() {
  const { hero } = site;

  return (
    <section
      id="top"
      className="relative flex min-h-[100svh] items-center overflow-hidden pt-20"
      aria-labelledby="hero-heading"
    >
      {/* Atmospheric greenery — #164C38 shade, soft blur for glass depth */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <Image
          src="/images/hero-foliage.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center blur-[2px]"
        />
        <div className="absolute inset-0 bg-[#164C38]/55 mix-blend-color" />
        <div className="absolute inset-0 bg-[#164C38]/20 mix-blend-multiply" />
        {/* Light left wash so headline stays crisp; foliage stays visible on the right */}
        <div className="absolute inset-0 bg-gradient-to-r from-background from-0% via-background/55 via-40% to-transparent to-70%" />
        {/* Soft bottom fade into the next section */}
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background to-transparent" />
      </div>

      <div className="container-narrow relative z-10 grid w-full items-center gap-8 py-24 md:grid-cols-[minmax(0,1.15fr)_minmax(240px,36vw)] md:py-32 xl:grid-cols-[minmax(0,1fr)_minmax(340px,480px)] xl:gap-12 2xl:gap-16">
        <div>
          <p className="eyebrow animate-fade-up mb-8">{hero.eyebrow}</p>

          <h1
            id="hero-heading"
            className="display-hero animate-fade-up max-w-3xl"
            style={{ animationDelay: "80ms" }}
          >
            {hero.headline}
          </h1>

          <p
            className="lead animate-fade-up mt-6 max-w-xl"
            style={{ animationDelay: "160ms" }}
          >
            {hero.lead}
          </p>

          <div
            className="animate-fade-up mt-12 flex flex-col items-start gap-5 sm:flex-row sm:items-center"
            style={{ animationDelay: "240ms" }}
          >
            <Link
              href={hero.primaryCta.href}
              className={cn(buttonVariants({ size: "lg" }))}
            >
              {hero.primaryCta.label}
            </Link>
            <Link
              href={hero.secondaryCta.href}
              className="text-[17px] font-medium text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
            >
              {hero.secondaryCta.label}
            </Link>
          </div>
        </div>

        <div
          className="pointer-events-none hidden w-full self-start md:block md:mt-16 xl:mt-20"
          aria-hidden="true"
        >
          <HeroGraph />
        </div>
      </div>
    </section>
  );
}
