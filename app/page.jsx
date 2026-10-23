import PageShell from "@/app/components/PageShell";
import Stage from "@/app/components/Stage";
import DemoHost from "@/app/components/DemoHost";
import Roadmap from "@/app/components/Roadmap";
import Pillars from "@/app/components/Pillars";
import NewsPreview from "@/app/components/NewsPreview";
import ClosingCta from "@/app/components/ClosingCta";
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION } from "@/app/lib/site";
import { slugFor } from "@/app/lib/slug";
import { games } from "@/data/games";
import { upcomingReleases } from "@/data/roadmap";
import React from "react";

// Per-game share cards: when "/" is opened/shared with ?game=<slug> (set by the
// Games modal), emit that game's title + 1200x630 art card for social unfurls.
// Reading searchParams makes "/" server-rendered; canonical stays "/" so search
// engines consolidate every ?game= variant onto the homepage (no duplicate URLs).
export async function generateMetadata({ searchParams }) {
  const sp = await searchParams;
  const raw = Array.isArray(sp?.game) ? sp.game[0] : sp?.game;
  const slug = (raw || "").toLowerCase();
  const game = slug
    ? games.find(
        (g) =>
          g.status === "active" && (g.id === slug || slugFor(g) === slug),
      )
    : null;

  if (!game) {
    // Set the core tags explicitly rather than relying on layout→page metadata
    // inheritance — this route is dynamic, and we want the meta description
    // guaranteed in the page's own resolved metadata on every render.
    return {
      title: { absolute: "Bet4.win — Provably-fair originals, built for operators" },
      description: SITE_DESCRIPTION,
      alternates: { canonical: "/" },
    };
  }

  const title = `Play ${game.title} · Provably-fair original — Bet4.win`;
  const description = `Try the ${game.title} demo from Bet4.win — a certified, provably-fair original you can verify yourself and brand as your own.`;
  const image = `/og/${slugFor(game)}.jpg`;

  return {
    title: { absolute: title },
    description,
    alternates: { canonical: "/" },
    openGraph: {
      type: "website",
      url: "/",
      title,
      description,
      images: [{ url: image, width: 1200, height: 630, alt: `${game.title} — Bet4.win` }],
    },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
}

// schema.org entity graph: who we are (Organization), the site (WebSite), and
// the product (SoftwareApplication = the RGS). @id-linked so search engines
// resolve them as one entity. featureList is sourced only from live page copy.
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: SITE_NAME,
      url: SITE_URL,
      logo: `${SITE_URL}/assets/img/b4w-logo.svg`,
      description: SITE_DESCRIPTION,
      email: "info@bet4.win",
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "sales",
        email: "info@bet4.win",
        availableLanguage: "en",
      },
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: SITE_NAME,
      description: SITE_DESCRIPTION,
      publisher: { "@id": `${SITE_URL}/#organization` },
      inLanguage: "en",
    },
    {
      "@type": "SoftwareApplication",
      "@id": `${SITE_URL}/#rgs`,
      name: "Bet4.win Remote Gaming Server",
      url: SITE_URL,
      applicationCategory: "BusinessApplication",
      applicationSubCategory: "Remote Gaming Server (RGS)",
      operatingSystem: "Web-based",
      provider: { "@id": `${SITE_URL}/#organization` },
      description:
        "A certified provably-fair Remote Gaming Server and originals catalogue for iGaming operators: one integration, a new original every month, fully white-labelled.",
      audience: {
        "@type": "BusinessAudience",
        audienceType: "iGaming operators",
      },
      featureList: [
        "Certified provably-fair RNG",
        "Single API integration",
        "A new provably-fair original every month",
        "White-label branding across the full catalogue",
        "Tournaments, free bets, jackpots and leaderboards via API",
      ],
    },
  ],
};

// Home is a games studio's front page: the stage puts one game at a time on
// the whole first screen with the lobby along its bottom to choose from, then
// what ships next,
// what comes with the integration, the news and the ask. Platform /
// provably-fair / branding live at their own routes.
export default function HomePage() {
  return (
    <PageShell overlayHeader>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Stage initialSlug="punch" />
      {/* Computed here rather than inside the component — the "this month"
          label depends on the date, and deriving that on the client would
          disagree with this markup across a month boundary. */}
      <Roadmap releases={upcomingReleases()} />
      <Pillars />
      <NewsPreview />
      <ClosingCta />
      <DemoHost />
    </PageShell>
  );
}
