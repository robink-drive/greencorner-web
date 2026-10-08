import styles from "./clients.module.css";

type ClientsProps = {
  clients: readonly string[];
};

/**
 * Slow typographic partner ticker. Pauses on hover; wraps statically
 * when the visitor prefers reduced motion.
 */
export function Clients({ clients }: ClientsProps) {
  const names = clients.length ? [...clients] : [];

  return (
    <section className={styles.section} aria-label="Partners">
      <p className="eyebrow mb-8 text-center md:mb-10">
        Alberta businesses we&apos;ve worked with
      </p>

      <div className={styles.viewport}>
        <div className={styles.track}>
          <TickerGroup names={names} />
          <TickerGroup names={names} duplicate />
        </div>
      </div>
    </section>
  );
}

function TickerGroup({
  names,
  duplicate = false,
}: {
  names: string[];
  duplicate?: boolean;
}) {
  return (
    <ul className={styles.group} aria-hidden={duplicate || undefined}>
      {names.map((name) => (
        <li key={`${duplicate ? "dup" : "src"}-${name}`} className="flex items-center">
          <span className={styles.dot} aria-hidden="true" />
          <span className={styles.item}>{name}</span>
        </li>
      ))}
    </ul>
  );
}
