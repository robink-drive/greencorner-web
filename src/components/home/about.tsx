import type { AboutContent } from "@/lib/content";
import { Section } from "@/components/layout/section";
import { cn } from "@/lib/utils";

export function About({ about }: { about: AboutContent }) {
  return (
    <Section id="about" aria-labelledby="about-heading">
      <div className="mx-auto max-w-[38rem] text-center">
        <p className="eyebrow mb-6">About us</p>
        <h2 id="about-heading" className="display-section">
          A partner that keeps things simple.
        </h2>
        <p className="lead mt-6">{about.manifesto}</p>
      </div>

      <ul className="mt-16 grid border-t border-border sm:grid-cols-2 md:mt-20">
        {about.points.map((point, i) => (
          <li
            key={point.title}
            className={cn(
              "border-border py-8 md:py-10",
              i < about.points.length - 1 && "border-b",
              i < about.points.length - 2 && "sm:border-b",
              i >= about.points.length - 1 && "border-b-0",
              i % 2 === 0 ? "sm:border-r sm:pr-10 lg:pr-12" : "sm:pl-10 lg:pl-12",
              i >= 2 && "sm:border-b-0",
            )}
          >
            <h3 className="title-md">{point.title}</h3>
            <p className="body mt-3 max-w-sm">{point.description}</p>
          </li>
        ))}
      </ul>
    </Section>
  );
}
