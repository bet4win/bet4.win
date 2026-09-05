// Single source of truth for the canonical production origin and brand strings.
//
// SITE_URL drives metadataBase, the canonical tag, sitemap.xml, robots.txt's
// Sitemap directive, JSON-LD @id/url values, and Open Graph image URLs. These
// must stay byte-identical (apex host, https, no trailing slash) or Search
// Console will treat the variants as separate properties and split ranking
// signals. Overridable per-environment for preview deploys.
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.bet4.win"
).replace(/\/$/, "");

export const SITE_NAME = "Bet4.win";

export const SITE_DESCRIPTION =
  "Provably-fair Remote Gaming Server (RGS) for iGaming operators: certified RNG, one integration, and a new original every month.";
