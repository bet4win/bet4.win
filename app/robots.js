import { SITE_URL } from "@/app/lib/site";

// Served at /robots.txt. Allows full crawl and points at the sitemap. The
// Sitemap URL must match the canonical origin in app/lib/site.js exactly.
//
// /signature is an internal tool: disallowed here, noindex on the page itself,
// and absent from app/sitemap.js.
export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/signature",
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
