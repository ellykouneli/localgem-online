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
  eslint: {
    ignoreDuringBuilds: true, // ✅ Skip ESLint checks during Vercel build
  },
};

export default nextConfig;
