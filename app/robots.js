import { SITE_URL } from "@/app/lib/site";

// Served at /robots.txt. Allows full crawl and points at the sitemap. The
// Sitemap URL must match the canonical origin in app/lib/site.js exactly.
export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
