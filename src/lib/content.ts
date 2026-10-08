import fallback from "../../content/tijo-site.json";

const GIST_TIMEOUT_MS = 5000;
const DEFAULT_REVALIDATE = 120;

export type Service = {
  title: string;
  description: string;
  detail?: string;
};

export type ProcessStep = {
  num: string;
  title: string;
  description: string;
};

export type WorkProject = {
  id: string;
  client: string;
  industry: string;
  year: string;
  tags: string[];
  summary: string;
  result?: string;
  palette: string;
};

export type AboutContent = {
  manifesto: string;
  points: { title: string; description: string }[];
};

export type Review = {
  quote: string;
  name: string;
  role: string;
};

export type SiteContent = {
  clients: string[];
  services: Service[];
  process: ProcessStep[];
  work: WorkProject[];
  about: AboutContent;
  reviews: Review[];
  contactCopy: { headline: string; lead: string };
};

const localContent = fallback as SiteContent;

/** GitHub's Raw button pins a 40-char revision. Drop it so gist edits keep working. */
function normalizeGistUrl(url: string): string {
  return url.replace(/\/raw\/[a-f0-9]{40}\//i, "/raw/");
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

function isService(value: unknown): value is Service {
  if (!isRecord(value)) return false;
  if (typeof value.title !== "string" || typeof value.description !== "string") {
    return false;
  }
  return value.detail === undefined || typeof value.detail === "string";
}

function isProcessStep(value: unknown): value is ProcessStep {
  return (
    isRecord(value) &&
    typeof value.num === "string" &&
    typeof value.title === "string" &&
    typeof value.description === "string"
  );
}

function isWorkProject(value: unknown): value is WorkProject {
  if (!isRecord(value)) return false;
  return (
    typeof value.id === "string" &&
    typeof value.client === "string" &&
    typeof value.industry === "string" &&
    typeof value.year === "string" &&
    isStringArray(value.tags) &&
    typeof value.summary === "string" &&
    typeof value.palette === "string" &&
    (value.result === undefined || typeof value.result === "string")
  );
}

function isAbout(value: unknown): value is AboutContent {
  if (!isRecord(value) || typeof value.manifesto !== "string") return false;
  if (!Array.isArray(value.points)) return false;
  return value.points.every(
    (point) =>
      isRecord(point) &&
      typeof point.title === "string" &&
      typeof point.description === "string",
  );
}

function isReview(value: unknown): value is Review {
  return (
    isRecord(value) &&
    typeof value.quote === "string" &&
    typeof value.name === "string" &&
    typeof value.role === "string"
  );
}

function mergeContent(base: SiteContent, overlay: unknown): SiteContent {
  if (!isRecord(overlay)) return base;

  const clients = isStringArray(overlay.clients) ? overlay.clients : base.clients;
  const services = Array.isArray(overlay.services) && overlay.services.every(isService)
    ? overlay.services
    : base.services;
  const process = Array.isArray(overlay.process) && overlay.process.every(isProcessStep)
    ? overlay.process
    : base.process;
  const work = Array.isArray(overlay.work) && overlay.work.every(isWorkProject)
    ? overlay.work
    : base.work;
  const about = isAbout(overlay.about) ? overlay.about : base.about;
  const reviews = Array.isArray(overlay.reviews) && overlay.reviews.every(isReview)
    ? overlay.reviews
    : base.reviews;

  let contactCopy = base.contactCopy;
  if (isRecord(overlay.contactCopy)) {
    const headline =
      typeof overlay.contactCopy.headline === "string"
        ? overlay.contactCopy.headline
        : base.contactCopy.headline;
    const lead =
      typeof overlay.contactCopy.lead === "string"
        ? overlay.contactCopy.lead
        : base.contactCopy.lead;
    contactCopy = { headline, lead };
  }

  return { clients, services, process, work, about, reviews, contactCopy };
}

/**
 * Marketing copy for the homepage.
 * Local `tijo-site.json` is the fast default. An optional gist of the
 * same file overlays it, cached on the server so visitors never wait
 * on GitHub.
 */
export async function getSiteContent(): Promise<SiteContent> {
  const url = normalizeGistUrl(process.env.CONTENT_GIST_URL?.trim() ?? "");
  if (!url) return localContent;

  const revalidate = Number.parseInt(
    process.env.CONTENT_REVALIDATE_SECONDS ?? "",
    10,
  );
  const seconds =
    Number.isFinite(revalidate) && revalidate > 0
      ? revalidate
      : DEFAULT_REVALIDATE;

  const isDev = process.env.NODE_ENV === "development";

  try {
    const res = await fetch(url, {
      headers: {
        Accept: "application/json, text/plain;q=0.9, */*;q=0.8",
        "User-Agent": "green-corner-marketing",
      },
      signal: AbortSignal.timeout(GIST_TIMEOUT_MS),
      ...(isDev
        ? { cache: "no-store" as const }
        : { next: { revalidate: seconds, tags: ["site-content"] } }),
    });
    if (!res.ok) {
      if (isDev) {
        console.warn(`[content] gist ${res.status} ${res.statusText}, using local tijo-site.json`);
      }
      return localContent;
    }
    const remote: unknown = await res.json();
    return mergeContent(localContent, remote);
  } catch (error) {
    if (isDev) {
      console.warn("[content] gist fetch failed, using local tijo-site.json", error);
    }
    return localContent;
  }
}
