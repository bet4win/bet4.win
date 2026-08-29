import { SITE_URL } from "@/app/lib/site";
import { slugFor } from "@/app/lib/slug";
import { games } from "@/data/games";

// Served at /sitemap.xml. Every url must byte-match the canonical declared on
// the corresponding page (apex, https, no trailing slash).
export default function sitemap() {
  const lastModified = new Date();
  return [
    {
      url: SITE_URL,
      lastModified,
      changeFrequency: "monthly",
      priority: 1,
    },
    // The four nav pages.
    ...["/platform", "/games", "/provably-fair", "/branding"].map((path) => ({
      url: `${SITE_URL}${path}`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.9,
    })),
    {
      url: `${SITE_URL}/privacy`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/terms`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    // One entry per released game — matches generateStaticParams in
    // app/games/[slug]/page.jsx, which also skips unreleased titles.
    ...games
      .filter((g) => g.status === "active")
      .map((g) => ({
        url: `${SITE_URL}/games/${slugFor(g)}`,
        lastModified,
        changeFrequency: "monthly",
        priority: 0.8,
      })),
  ];
}
