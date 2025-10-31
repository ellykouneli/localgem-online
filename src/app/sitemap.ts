import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://www.localgem.online";
  return [
    { url: `${base}/`, lastModified: new Date() },
    { url: `${base}/classics`, lastModified: new Date() },
    { url: `${base}/hospitals`, lastModified: new Date() },
    { url: `${base}/transportation`, lastModified: new Date() },
    { url: `${base}/map`, lastModified: new Date() },
    { url: `${base}/tips`, lastModified: new Date() },
  ];
}
