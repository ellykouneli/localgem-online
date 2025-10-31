// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "mjricvnpnhyagfhrrmyw.supabase.co", // ✅ no https://, no trailing slash
      },
    ],
  },
};

export default nextConfig;
