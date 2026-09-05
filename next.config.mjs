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
        // Cache static assets from /public for 30 days (bounded — paths aren't
        // content-hashed). The image optimizer inherits this for /_next/image.
        source: "/assets/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=2592000, stale-while-revalidate=86400",
          },
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
    // Only matches the exact apex Host header, so it can't loop on www requests.
    // (Belt-and-suspenders — your DNS/CDN may already do this.)
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "bet4.win" }],
        destination: "https://www.bet4.win/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
