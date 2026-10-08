import Link from "next/link";
import type { WorkProject } from "@/lib/content";
import { SectionHeader } from "@/components/layout/section";
import { WorkRail } from "@/components/home/work-rail";

export function Work({ projects }: { projects: WorkProject[] }) {
  return (
    <section id="work" aria-labelledby="work-heading" className="section-y">
      <div className="container-wide">
        <SectionHeader
          eyebrow="Selected work"
          title="Partnerships with local brands."
          titleId="work-heading"
          lead="Recent collaborations with local brands, from contractors to restaurants."
          className="mb-10 md:mb-14"
        />
      </div>

      <WorkRail projects={projects} />

      <p className="mt-16 px-4 text-center text-xl text-muted-foreground md:mt-20 md:text-2xl">
        Your business here?{" "}
        <Link
          href="#contact"
          className="font-medium text-foreground underline-offset-4 hover:underline"
        >
          Let&apos;s talk.
        </Link>
      </p>
    </section>
  );
}
