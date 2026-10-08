import dns from "node:dns";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { NextConfig } from "next";

dns.setDefaultResultOrder("ipv4first");

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  turbopack: {
    root: projectRoot,
  },
};

export default nextConfig;
