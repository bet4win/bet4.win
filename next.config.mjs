/** @type {import('next').NextConfig} */
const nextConfig = {
  // Inline the (small, ~11 KB gz) route CSS into the HTML instead of shipping a
  // separate render-blocking <link rel="stylesheet">. Removes a request from the
  // critical path; ideal here since "/" is the only route, so there's no
  // cross-page CSS cache to lose.
  experimental: {
    inlineCss: true,
  },
  // Image optimization is enabled (AVIF/WebP + responsive srcset via sharp).
  // This requires a Node server / Vercel runtime (`next start`). If this site is
  // ever deployed as a fully static export, re-add `images: { unoptimized: true }`.
  images: {
    formats: ["image/avif", "image/webp"],
    // Small thumbnails render ~180px; default deviceSizes start at 640, so the
    // optimizer was shipping the full 512px source. These extra small widths let
    // the browser pick a right-sized candidate for the game tiles.
    deviceSizes: [256, 384, 640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    // 1yr. Safe because the optimizer's sources are statically imported game
    // thumbnails / icons (data/games.js, Services.jsx) emitted to
    // /_next/static/media with a content hash — new bytes get a new URL, so a
    // long immutable cache can never serve stale art.
    minimumCacheTTL: 31536000,
  },
  poweredByHeader: false,
  async headers() {
    return [
      {
        // Static assets from /public: 30 days, bounded, because these paths are
        // not content-hashed. The image optimizer inherits this for
        // /_next/image.
        source: "/assets/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=2592000, stale-while-revalidate=86400",
          },
        ],
      },
      {
        // News cards carry a hash of their own bytes in the filename
        // (<slug>.<8 hex>.jpg — see scripts/generate-news-images.mjs), so a
        // re-cut card is a different URL and this can never serve stale art.
        // That is the whole reason the hash is there: a share image is cached by
        // the browser, by the CDN and by every social scraper that has ever
        // unfurled it, and under a stable name none of them look again.
        //
        // AFTER the bounded rule, not before it: where two entries match the
        // same path Next keeps the LAST Cache-Control, so a "more specific
        // first" ordering here silently loses to /assets/:path* above. Verified
        // against a running server, not assumed.
        //
        // Matched on the hash rather than on the folder. logos/ sits in the same
        // directory and is NOT hashed — those are the generator's inputs, and
        // they stay on the bounded rule.
        source: "/assets/img/news/:card([^/]+\\.[0-9a-f]{8}\\.jpg)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },
  async redirects() {
    // Enforce the www canonical: 308 the apex host to www, preserving the path.
    // `value` is compiled into `^…$`, so the dots are escaped to keep this an
    // exact host match and it can't loop on www requests.
    // This rule is what actually serves the production apex 308 — it compiles
    // into .next/routes-manifest.json, which Vercel applies at its proxy layer
    // (hence the single-region x-vercel-id and no x-matched-path on the 308).
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "bet4\\.win" }],
        destination: "https://www.bet4.win/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
