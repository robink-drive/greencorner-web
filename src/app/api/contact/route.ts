import { NextResponse } from "next/server";
import { Resend } from "resend";
import { site } from "@/lib/site";
import {
  CONTACT_BODY_MAX_BYTES,
  isAllowedContactOrigin,
  validateContactPayload,
} from "@/lib/contact";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 5;

type RateBucket = { count: number; resetAt: number };
const rateBuckets = new Map<string, RateBucket>();

function clientIdentifier(request: Request): string {
  const forwarded =
    request.headers.get("x-vercel-forwarded-for") ??
    request.headers.get("x-forwarded-for") ??
    request.headers.get("x-real-ip");
  return forwarded?.split(",")[0]?.trim() || "unknown";
}

function consumeRateLimit(key: string, now = Date.now()) {
  if (rateBuckets.size > 10_000) {
    for (const [bucketKey, bucket] of rateBuckets) {
      if (bucket.resetAt <= now) rateBuckets.delete(bucketKey);
    }
  }

  const current = rateBuckets.get(key);
  if (!current || current.resetAt <= now) {
    const bucket = { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS };
    rateBuckets.set(key, bucket);
    return { allowed: true, retryAfter: 0 };
  }

  current.count += 1;
  return {
    allowed: current.count <= RATE_LIMIT_MAX_REQUESTS,
    retryAfter: Math.max(1, Math.ceil((current.resetAt - now) / 1000)),
  };
}

export async function POST(request: Request) {
  if (!isAllowedContactOrigin(request.url, request.headers.get("origin"))) {
    return NextResponse.json({ error: "Request origin is not allowed." }, { status: 403 });
  }

  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > CONTACT_BODY_MAX_BYTES) {
    return NextResponse.json({ error: "Request body is too large." }, { status: 413 });
  }

  const limit = consumeRateLimit(clientIdentifier(request));
  if (!limit.allowed) {
    return NextResponse.json(
      { error: "Too many messages. Please wait a few minutes and try again." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } },
    );
  }

  let rawBody: string;
  try {
    rawBody = await request.text();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (new TextEncoder().encode(rawBody).byteLength > CONTACT_BODY_MAX_BYTES) {
    return NextResponse.json({ error: "Request body is too large." }, { status: 413 });
  }

  let body: unknown;
  try {
    body = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const validation = validateContactPayload(body);
  if (!validation.ok) {
    return NextResponse.json(
      { error: validation.error, field: validation.field },
      { status: 400 },
    );
  }

  const { name, email, company, message, website } = validation.data;
  const submissionId = crypto.randomUUID();

  // Bots commonly fill this visually hidden field. Return success without sending.
  if (website) return NextResponse.json({ ok: true, submissionId });

  const apiKey = process.env.RESEND_API_KEY;
  const toEmail =
    process.env.CONTACT_TO_EMAIL?.trim() ||
    process.env.CONTACT_DEV_TO_EMAIL?.trim() ||
    "";

  // Dev-friendly fallback when email is not wired yet.
  if (!apiKey || !toEmail || !EMAIL_REGEX.test(toEmail)) {
    if (process.env.NODE_ENV === "development") {
      console.info("[contact] Dev mode: message logged, email not sent.", {
        name,
        email,
        company,
        message,
      });
      return NextResponse.json({ ok: true, mode: "dev-log", submissionId });
    }
    return NextResponse.json(
      { error: "Email service is not configured." },
      { status: 503 },
    );
  }

  const fromEmail =
    process.env.CONTACT_FROM_EMAIL?.trim() || "onboarding@resend.dev";
  const fromName =
    process.env.CONTACT_FROM_NAME?.trim() || site.name;

  let error: { message?: string } | null = null;
  try {
    const resend = new Resend(apiKey);
    const result = await resend.emails.send({
      from: `${fromName} <${fromEmail}>`,
      to: [toEmail],
      replyTo: [email],
      subject: `Inquiry from ${name}${company ? ` (${company})` : ""}`,
      html: buildHtml({ name, email, company, message }),
    });
    error = result.error;
  } catch (cause) {
    console.error("[contact] Resend request failed:", cause);
    error = { message: cause instanceof Error ? cause.message : "Unknown email error" };
  }

  if (error) {
    console.error("[contact] Resend error:", error);
    return NextResponse.json(
      {
        error:
          process.env.NODE_ENV === "development"
            ? String(error.message ?? error)
            : "Failed to send message. Please try again or email us directly.",
      },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true, submissionId });
}

function buildHtml({
  name,
  email,
  company,
  message,
}: {
  name: string;
  email: string;
  company: string;
  message: string;
}) {
  const esc = (s: string) =>
    s
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");

  return `
    <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;line-height:1.5;color:#1d1d1f;">
      <h1 style="font-size:20px;font-weight:600;">New inquiry from ${esc(site.name)}</h1>
      <p><strong>Name:</strong> ${esc(name)}</p>
      <p><strong>Email:</strong> ${esc(email)}</p>
      ${company ? `<p><strong>Business:</strong> ${esc(company)}</p>` : ""}
      <p><strong>Message:</strong></p>
      <p style="white-space:pre-wrap;">${esc(message)}</p>
    </div>
  `;
}
