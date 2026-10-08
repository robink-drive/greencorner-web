import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function NotFound() {
  return (
    <main
      id="main-content"
      className="flex min-h-[100svh] flex-col items-center justify-center px-6 py-24 text-center"
    >
      <p className="eyebrow mb-6">404</p>
      <h1 className="display-section max-w-[14ch]">Page not found.</h1>
      <p className="lead mx-auto mt-6 max-w-[32ch]">
        The page may have moved, or the address may be incorrect.
      </p>
      <Link href="/" className={cn(buttonVariants({ size: "lg" }), "mt-12")}>
        Back home
      </Link>
    </main>
  );
}
