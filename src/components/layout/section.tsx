import { cn } from "@/lib/utils";

type SectionProps = React.ComponentProps<"section"> & {
  /** Use wider max-width for media-heavy blocks. */
  wide?: boolean;
  /** Skip default vertical padding (e.g. hero). */
  flush?: boolean;
};

/**
 * Shared section shell. Enforces spacious rhythm so pages stay Apple-calm.
 */
export function Section({
  className,
  wide = false,
  flush = false,
  children,
  ...props
}: SectionProps) {
  return (
    <section className={cn(!flush && "section-y", className)} {...props}>
      <div className={wide ? "container-wide" : "container-narrow"}>
        {children}
      </div>
    </section>
  );
}

type SectionHeaderProps = {
  eyebrow?: string;
  title: string;
  titleId?: string;
  lead?: string;
  align?: "left" | "center";
  className?: string;
};

export function SectionHeader({
  eyebrow,
  title,
  titleId,
  lead,
  align = "left",
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "mb-16 md:mb-24",
        align === "center" && "mx-auto max-w-3xl text-center",
        className,
      )}
    >
      {eyebrow ? <p className="eyebrow mb-4">{eyebrow}</p> : null}
      <h2 id={titleId} className="display-section">
        {title}
      </h2>
      {lead ? (
        <p
          className={cn(
            "lead mt-5 max-w-2xl",
            align === "center" && "mx-auto",
          )}
        >
          {lead}
        </p>
      ) : null}
    </div>
  );
}
