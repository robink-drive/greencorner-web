import Link from "next/link";
import { site } from "@/lib/site";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border py-10 md:py-12">
      <div className="container-wide flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <Link
            href="/#top"
            className="text-[15px] font-medium tracking-tight text-foreground"
          >
            {site.shortName}
          </Link>
          <p className="max-w-[22ch] text-sm text-muted-foreground">
            {site.tagline}
          </p>
        </div>

        <nav
          className="flex flex-wrap gap-x-8 gap-y-3 text-sm text-muted-foreground"
          aria-label="Footer"
        >
          {site.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <p className="text-sm text-muted-foreground md:text-right">
          © {year} {site.name}
          <span className="mt-1 block">{site.location}</span>
        </p>
      </div>
    </footer>
  );
}
