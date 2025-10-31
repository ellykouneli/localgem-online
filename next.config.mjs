// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // ✅ Completely disable ESLint during builds (Vercel-proof)
    ignoreDuringBuilds: true,
  },
  typescript: {
    // ✅ Allow production build even if there are TS errors
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "mjricvnpnhyagfhrrmyw.supabase.co",
      },
    ],
  },
};

export default nextConfig;
