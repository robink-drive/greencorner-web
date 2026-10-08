import assert from "node:assert/strict";
import test from "node:test";
import {
  CONTACT_LIMITS,
  isAllowedContactOrigin,
  validateContactPayload,
} from "../src/lib/contact.ts";

const validPayload = {
  name: "Ada Lovelace",
  email: "ADA@EXAMPLE.COM",
  company: "Analytical Engines",
  message: "I would like to discuss a project.",
  website: "",
};

test("normalizes a valid contact payload", () => {
  const result = validateContactPayload(validPayload);
  assert.equal(result.ok, true);
  if (result.ok) assert.equal(result.data.email, "ada@example.com");
});

test("rejects non-object JSON bodies instead of throwing", () => {
  for (const body of [null, [], "message", 42]) {
    assert.equal(validateContactPayload(body).ok, false);
  }
});

test("reports the field that exceeds its server limit", () => {
  const result = validateContactPayload({
    ...validPayload,
    message: "x".repeat(CONTACT_LIMITS.message + 1),
  });
  assert.deepEqual(result, {
    ok: false,
    field: "message",
    error: `Enter a message between 1 and ${CONTACT_LIMITS.message} characters.`,
  });
});

test("allows missing origins but rejects cross-origin browser requests", () => {
  const requestUrl = "https://greencornermarketing.ca/api/contact";
  assert.equal(isAllowedContactOrigin(requestUrl, null), true);
  assert.equal(
    isAllowedContactOrigin(requestUrl, "https://greencornermarketing.ca"),
    true,
  );
  assert.equal(isAllowedContactOrigin(requestUrl, "https://example.com"), false);
  assert.equal(isAllowedContactOrigin(requestUrl, "not-a-url"), false);
});
