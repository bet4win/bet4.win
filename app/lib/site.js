// Single source of truth for the canonical production origin and brand strings.
//
// SITE_URL drives metadataBase, the canonical tag, sitemap.xml, robots.txt's
// Sitemap directive, JSON-LD @id/url values, and Open Graph image URLs. These
// must stay byte-identical (www host, https, no trailing slash) or Search
// Console will treat the variants as separate properties and split ranking
// signals. Overridable per-environment for preview deploys.
//
// It must be the www host, not the apex: bet4.win 308s to www.bet4.win (see
// next.config.mjs). Pointing the canonical at the apex would declare a URL that
// only ever answers with a redirect, which Search Console reports as a redirect
// error and refuses to index.
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.bet4.win"
).replace(/\/$/, "");

export const SITE_NAME = "Bet4.win";

// Where every "book a demo" / "book a meeting" control on the site goes.
//
// One constant, because a scheduling link is exactly the kind of thing that gets
// rotated — a new event type, a different owner, a move off Calendly — and five
// copies is five chances to leave a dead one behind. Every one of these used to
// be a `mailto:` with a hand-written subject line.
export const BOOKING_URL =
  "https://calendly.com/gnadirashvili-bet4/google-meet-30m";

// Calendly records UTM parameters against the booking itself, so a slot arrives
// labelled with the control that produced it. That is what replaces the context
// the old mailto subjects carried ("Demo request", "Meeting at SBC Summit") —
// without it, switching to a scheduler would lose the one thing the subject
// lines were actually for.
export function bookingUrl(medium, campaign) {
  const url = new URL(BOOKING_URL);
  url.searchParams.set("utm_source", "bet4win");
  url.searchParams.set("utm_medium", medium);
  if (campaign) url.searchParams.set("utm_campaign", campaign);
  return url.toString();
}

// Colours for the embedded scheduler, hex without the '#'.
//
// Only `primary_color` — the buttons, the links and the selected day, in the
// brand blue. `background_color` and `text_color` are deliberately left off,
// which was not the first instinct.
//
// Measured in the browser: `background_color` repaints Calendly's *card*, not
// the page the card sits on, and that page is a fixed white no embed parameter
// reaches. Sending the navy therefore produced a dark card inside a white sheet
// inside our dark dialog — three surfaces, and the white gutters could not be
// sized away because the card's width is Calendly's to decide. Letting their
// scheduler be light and framing it in our chrome is two surfaces and reads as
// one object.
//
// `hide_gdpr_banner` is deliberately NOT set. Calendly is explicit that hiding
// their banner makes our own consent management responsible for their cookies,
// and this site's consent layer covers our analytics, not theirs.
export const BOOKING_EMBED_COLOURS = {
  primary_color: "3358e6",
};

// The URL handed to Calendly's inline widget. UTMs go through the widget's own
// `utm` option rather than the query string, so they are not duplicated here.
export function bookingEmbedUrl() {
  const url = new URL(BOOKING_URL);
  for (const [k, v] of Object.entries(BOOKING_EMBED_COLOURS)) {
    url.searchParams.set(k, v);
  }
  return url.toString();
}

export const SITE_DESCRIPTION =
  "Provably-fair Remote Gaming Server (RGS) for iGaming operators: certified RNG, one integration, and a new original every month.";
