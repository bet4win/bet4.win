import PageShell from "@/app/components/PageShell";
import Hero from "@/app/components/Hero";
import FeaturedGame from "@/app/components/FeaturedGame";
import TrustBar from "@/app/components/TrustBar";
import Ticker from "@/app/components/Ticker";
import Partners from "@/app/components/Partners";
import GamesPreview from "@/app/components/GamesPreview";
import ExploreLinks from "@/app/components/ExploreLinks";
import ClosingCta from "@/app/components/ClosingCta";
import Reveal from "@/app/components/Reveal";
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION } from "@/app/lib/site";
import { games } from "@/data/games";
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
          g.status === "active" &&
          (g.id === slug || g.title.toLowerCase() === slug),
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
  const image = `/og/${game.title.toLowerCase()}.jpg`;

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

// Home is now a hub, not the whole site: establish who we are, prove it, show
// the newest game, sample the catalogue, then hand off to the four real pages.
// Platform / provably-fair / branding live at their own routes.
export default function HomePage() {
  return (
    <PageShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Hero and the spotlight are above the fold and deliberately not wrapped
          in <Reveal>: starting them at opacity 0 would push LCP out by the
          length of the reveal transition. Scroll motion begins below them. */}
      <Hero />
      {/* The catalogue's real ceilings, on a loop. Signature moment: the numbers
          do the selling, and it reads as a games company rather than a SaaS. */}
      <Ticker />
      <TrustBar />
      <Reveal>
        <Partners />
      </Reveal>
      <FeaturedGame slug="punch" />
      <GamesPreview />
      <Reveal>
        <ExploreLinks />
      </Reveal>
      <Reveal>
        <ClosingCta />
      </Reveal>
    </PageShell>
  );
}
