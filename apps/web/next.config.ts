import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@viettools/ui", "@viettools/vietnamese-utils"],
  poweredByHeader: false,
};

export default nextConfig;
