export type ThankYouSource = "contact";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * Fire one GA4 lead conversion per successful server submission.
 * Submission IDs prevent duplicate client handling without suppressing later leads.
 * Call from the form success path, not the thank-you page view.
 */
export function fireLeadConversion(
  source: ThankYouSource,
  submissionId: string,
): void {
  if (typeof window === "undefined") return;

  const key = `gcm_lead_conversion_${submissionId}`;
  try {
    if (sessionStorage.getItem(key) === "1") return;
  } catch {
    /* private browsing: still attempt once */
  }

  const payload = {
    form_type: source,
    event_category: "conversion",
    event_label: `thank_you_${source}`,
  };

  const markFired = () => {
    try {
      sessionStorage.setItem(key, "1");
    } catch {
      /* ignore */
    }
  };

  if (typeof window.gtag === "function") {
    window.gtag("event", "generate_lead", payload);
    markFired();
    return;
  }

  let attempts = 0;
  const id = window.setInterval(() => {
    attempts += 1;
    if (typeof window.gtag === "function") {
      window.gtag("event", "generate_lead", payload);
      markFired();
      window.clearInterval(id);
    } else if (attempts >= 20) {
      window.clearInterval(id);
    }
  }, 250);
}
