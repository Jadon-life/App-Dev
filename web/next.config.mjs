import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@prephq/shared"],
  webpack: (config) => {
    config.resolve.alias["@shared"] = path.resolve(__dirname, "../shared");
    return config;
  },
};

export default nextConfig;
