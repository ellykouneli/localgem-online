import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/api/private"],
    },
    sitemap: "https://www.localgem.online/sitemap.xml",
  };
}
