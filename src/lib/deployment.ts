type DeploymentEnvironment = {
  NODE_ENV?: string;
  VERCEL_ENV?: string;
};

/** True only for a real production deployment, never a Vercel preview. */
export function isProductionDeployment(
  env: DeploymentEnvironment = process.env,
): boolean {
  if (env.VERCEL_ENV) return env.VERCEL_ENV === "production";
  return env.NODE_ENV === "production";
}
