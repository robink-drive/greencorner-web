import assert from "node:assert/strict";
import test from "node:test";
import { isProductionDeployment } from "../src/lib/deployment.ts";

test("does not treat a Vercel preview build as production", () => {
  assert.equal(
    isProductionDeployment({ NODE_ENV: "production", VERCEL_ENV: "preview" }),
    false,
  );
});

test("recognizes Vercel and self-hosted production", () => {
  assert.equal(
    isProductionDeployment({ NODE_ENV: "production", VERCEL_ENV: "production" }),
    true,
  );
  assert.equal(isProductionDeployment({ NODE_ENV: "production" }), true);
});

test("Vercel deployment metadata takes precedence over NODE_ENV", () => {
  assert.equal(
    isProductionDeployment({ NODE_ENV: "development", VERCEL_ENV: "production" }),
    true,
  );
});
