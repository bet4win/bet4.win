import { SITE_URL } from "@/app/lib/site";
import { slugFor } from "@/app/lib/slug";
import { allPosts } from "@/app/lib/news";
import { games } from "@/data/games";

// Served at /sitemap.xml. Every url must byte-match the canonical declared on
// the corresponding page (www host, https, no trailing slash). Never list the
// apex host here — it redirects, and redirecting URLs in a sitemap are crawl
// errors rather than index candidates.
export default function sitemap() {
  const lastModified = new Date();
  return [
    {
      url: SITE_URL,
      lastModified,
      changeFrequency: "monthly",
      priority: 1,
    },
    // The five nav pages.
    ...["/platform", "/games", "/provably-fair", "/branding", "/news"].map(
      (path) => ({
        url: `${SITE_URL}${path}`,
        lastModified,
        changeFrequency: "monthly",
        priority: 0.9,
      }),
    ),
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
    // One entry per post. `lastModified` is the publication date rather than the
    // build time: a news post genuinely does not change after it ships, and
    // telling a crawler it did on every deploy is how a sitemap stops being
    // believed.
    ...allPosts().map((p) => ({
      url: `${SITE_URL}/news/${p.slug}`,
      lastModified: new Date(`${p.date}T00:00:00Z`),
      changeFrequency: "yearly",
      priority: 0.6,
    })),
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
