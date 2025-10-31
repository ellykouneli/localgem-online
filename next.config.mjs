// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "mjricvnpnhyagfhrrmyw.supabase.co",
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true, // ✅ disables linting on Vercel
  },
  typescript: {
    ignoreBuildErrors: true, // ✅ disables type-checking errors
  },
};

export default nextConfig;
