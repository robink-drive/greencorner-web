"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu } from "lucide-react";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

/**
 * Thin translucent header with sparse nav and a text-style quote CTA.
 */
export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-black/[0.03] bg-background/55 backdrop-blur-xl supports-[backdrop-filter]:bg-background/45">
      <div className="container-wide flex h-16 items-center justify-between md:h-20">
        <Link
          href="/#top"
          className="text-lg font-semibold tracking-tight text-foreground transition-opacity hover:opacity-70 md:text-xl"
        >
          {site.shortName}
        </Link>

        <nav className="hidden items-center gap-10 md:flex" aria-label="Primary">
          {site.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="nav-link transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="#contact"
            className="nav-link text-foreground underline-offset-4 transition-opacity hover:opacity-70"
          >
            Get a Quote
          </Link>
        </nav>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            className={cn(
              buttonVariants({ variant: "ghost", size: "icon" }),
              "md:hidden",
            )}
            aria-label="Open menu"
          >
            <Menu className="size-6" />
          </SheetTrigger>
          <SheetContent side="right" className="w-[min(100%,20rem)] px-6">
            <SheetHeader>
              <SheetTitle className="text-left font-medium">
                {site.shortName}
              </SheetTitle>
            </SheetHeader>
            <nav className="mt-10 flex flex-col gap-6" aria-label="Mobile">
              {site.nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="text-2xl font-medium tracking-tight text-foreground"
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href="#contact"
                onClick={() => setOpen(false)}
                className={cn(
                  buttonVariants({ variant: "default", size: "lg" }),
                  "mt-4 w-full",
                )}
              >
                Get a Quote
              </Link>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
