import type { Review } from "@/lib/content";
import { Section } from "@/components/layout/section";

export function Reviews({ reviews }: { reviews: Review[] }) {
  const [featured, ...rest] = reviews;
  if (!featured) return null;

  return (
    <Section
      id="reviews"
      aria-labelledby="reviews-heading"
      className="bg-white"
    >
      <p className="eyebrow mb-8 text-center md:mb-10">Reviews</p>
      <h2 id="reviews-heading" className="sr-only">
        What clients say
      </h2>

      <blockquote className="mx-auto max-w-3xl text-center">
        <p className="text-[1.65rem] font-medium leading-[1.2] tracking-tight text-foreground sm:text-3xl md:text-[2.35rem] md:leading-[1.15]">
          {featured.quote}
        </p>
        <footer className="mt-8">
          <cite className="not-italic">
            <span className="block text-[15px] font-semibold text-foreground">
              {featured.name}
            </span>
            <span className="mt-1 block text-sm text-muted-foreground">
              {featured.role}
            </span>
          </cite>
        </footer>
      </blockquote>

      {rest.length > 0 ? (
        <div className="mx-auto mt-16 grid max-w-4xl gap-10 border-t border-border pt-12 sm:grid-cols-2 sm:gap-14 md:mt-20 md:pt-16">
          {rest.map((review) => (
            <blockquote key={review.quote}>
              <p className="text-lg font-medium leading-snug tracking-tight text-foreground md:text-xl">
                {review.quote}
              </p>
              <footer className="mt-5">
                <cite className="not-italic">
                  <span className="block text-[14px] font-semibold text-foreground">
                    {review.name}
                  </span>
                  <span className="mt-0.5 block text-sm text-muted-foreground">
                    {review.role}
                  </span>
                </cite>
              </footer>
            </blockquote>
          ))}
        </div>
      ) : null}
    </Section>
  );
}
