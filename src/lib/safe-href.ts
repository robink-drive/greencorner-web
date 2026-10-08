/**
 * Safe helpers for user-facing hrefs (mailto / tel / external).
 */

export function safeMailto(email: string): string {
  const trimmed = email.trim();
  if (!trimmed || trimmed.includes(" ") || !trimmed.includes("@")) {
    return "#";
  }
  return `mailto:${trimmed}`;
}

export function safeTel(href: string): string {
  const trimmed = href.trim();
  if (!trimmed.startsWith("tel:")) return "#";
  return trimmed;
}

export function safeExternalHref(href: string): string {
  const trimmed = href.trim();
  if (!trimmed || trimmed === "#") return "#";
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://") || trimmed.startsWith("/")) {
    return trimmed;
  }
  return "#";
}
