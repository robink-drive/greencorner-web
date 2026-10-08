import Link from "next/link";
import type { Metadata } from "next";
import { site } from "@/lib/site";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Thank you",
  robots: { index: false, follow: false },
};

type Props = {
  searchParams: Promise<{ source?: string }>;
};

export default async function ThankYouPage({ searchParams }: Props) {
  const params = await searchParams;
  const fromContactForm = params.source === "contact";

  return (
    <main
      id="main-content"
      className="flex min-h-[100svh] flex-col items-center justify-center px-6 py-24 text-center"
    >
      <p className="eyebrow mb-6">Message received</p>
      <h1 className="display-section max-w-[14ch]">Thank you.</h1>
      <p className="lead mx-auto mt-6 max-w-[32ch]">
        {fromContactForm
          ? "We received your note and will get back to you shortly."
          : "Thanks for getting in touch. We will get back to you shortly."}
      </p>
      <div className="mt-12 flex flex-col items-center gap-4 sm:flex-row">
        <Link href="/" className={cn(buttonVariants({ size: "lg" }))}>
          Back home
        </Link>
        <Link
          href={`mailto:${site.email}`}
          className="text-[15px] font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
        >
          Or email us directly
        </Link>
      </div>
    </main>
  );
}
