import type { ProcessStep, Service } from "@/lib/content";
import { Section } from "@/components/layout/section";

export function Services({ services }: { services: Service[] }) {
  return (
    <Section id="services" aria-labelledby="services-heading">
      <div className="grid items-start gap-14 md:grid-cols-[minmax(0,0.92fr)_minmax(0,1.18fr)] md:gap-16 lg:gap-24">
        <header className="md:sticky md:top-28">
          <p className="eyebrow mb-5">What we do</p>
          <h2 id="services-heading" className="display-section max-w-[10ch]">
            Three things, done well.
          </h2>
          <p className="lead mt-5 max-w-md">
            No bloated retainers. The fundamentals that move the needle for local businesses.
          </p>
        </header>

        <ol className="divide-y divide-border border-y border-border">
          {services.map((service, index) => (
            <li key={service.title} className="grid gap-3 py-8 first:pt-8 last:pb-8 md:grid-cols-[4.5rem_minmax(0,1fr)] md:gap-8 md:py-10">
              <span className="eyebrow pt-1">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="title-md">{service.title}</h3>
                <p className="body mt-3 max-w-xl">{service.description}</p>
                {service.detail ? (
                  <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-muted-foreground/80 md:text-base">
                    {service.detail}
                  </p>
                ) : null}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </Section>
  );
}

export function Process({ steps }: { steps: ProcessStep[] }) {
  return (
    <section
      className="bg-[#164C38] py-20 text-[#f4f1ea] md:py-24 lg:py-28"
      aria-label="Our process"
    >
      <div className="container-wide">
        <p className="mb-12 text-[11px] font-medium uppercase tracking-[0.16em] text-white/45 sm:text-xs md:mb-14">
          How we work
        </p>
        <ol className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-10">
          {steps.map((step) => (
            <li key={step.num} className="relative">
              <span
                className="block font-semibold tracking-tight text-white/15"
                style={{ fontSize: "clamp(2.75rem, 5vw, 4.25rem)", lineHeight: 0.9 }}
                aria-hidden="true"
              >
                {step.num}
              </span>
              <h3 className="mt-5 text-xl font-semibold tracking-tight text-[#f4f1ea] md:text-2xl">
                {step.title}
              </h3>
              <p className="mt-3 text-[15px] leading-relaxed text-white/65 md:text-base">
                {step.description}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
