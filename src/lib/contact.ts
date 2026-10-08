export const CONTACT_LIMITS = {
  name: 100,
  email: 255,
  company: 150,
  message: 2000,
} as const;

export const CONTACT_BODY_MAX_BYTES = 16_384;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type ContactPayload = {
  name: string;
  email: string;
  company: string;
  message: string;
  website: string;
};

export type ContactField = keyof Omit<ContactPayload, "website">;

export type ContactValidationResult =
  | { ok: true; data: ContactPayload }
  | { ok: false; error: string; field?: ContactField };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function trimmedString(value: unknown): string | null {
  return typeof value === "string" ? value.trim() : null;
}

export function validateContactPayload(value: unknown): ContactValidationResult {
  if (!isRecord(value)) {
    return { ok: false, error: "The request body must be a JSON object." };
  }

  const name = trimmedString(value.name);
  if (!name || name.length > CONTACT_LIMITS.name) {
    return {
      ok: false,
      field: "name",
      error: `Enter a name between 1 and ${CONTACT_LIMITS.name} characters.`,
    };
  }

  const email = trimmedString(value.email)?.toLowerCase() ?? "";
  if (email.length > CONTACT_LIMITS.email || !EMAIL_REGEX.test(email)) {
    return { ok: false, field: "email", error: "Enter a valid email address." };
  }

  const company = trimmedString(value.company) ?? "";
  if (company.length > CONTACT_LIMITS.company) {
    return {
      ok: false,
      field: "company",
      error: `Business name must be ${CONTACT_LIMITS.company} characters or fewer.`,
    };
  }

  const message = trimmedString(value.message);
  if (!message || message.length > CONTACT_LIMITS.message) {
    return {
      ok: false,
      field: "message",
      error: `Enter a message between 1 and ${CONTACT_LIMITS.message} characters.`,
    };
  }

  return {
    ok: true,
    data: {
      name,
      email,
      company,
      message,
      website: trimmedString(value.website) ?? "",
    },
  };
}

export function isAllowedContactOrigin(requestUrl: string, origin: string | null): boolean {
  if (!origin) return true;

  try {
    return new URL(origin).origin === new URL(requestUrl).origin;
  } catch {
    return false;
  }
}
