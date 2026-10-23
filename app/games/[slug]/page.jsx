import React from "react";
import { notFound } from "next/navigation";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import GameDetail from "@/app/components/GameDetail";
import LobbyCard from "@/app/components/LobbyCard";
import DemoHost from "@/app/components/DemoHost";
import { liveCatalogue } from "@/app/lib/catalogue";
import { games } from "@/data/games";
import { gameContent } from "@/data/gameContent";
import { SITE_URL, SITE_NAME } from "@/app/lib/site";
import { slugFor } from "@/app/lib/slug";

const liveGames = () => games.filter((g) => g.status === "active");
const findGame = (slug) =>
  liveGames().find((g) => slugFor(g) === (slug || "").toLowerCase()) || null;

// Only released titles get a page. An unreleased game has no demo, no figures
// and nothing verifiable to say, so a page for it would be an empty promise.
export function generateStaticParams() {
  return liveGames().map((g) => ({ slug: slugFor(g) }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const game = findGame(slug);
  if (!game) return {};

  const title = `${game.title} — provably-fair original`;
  const description = `${game.title} from Bet4.win: ${game.rtp} RTP, ${game.volatility.toLowerCase()} volatility${
    game.maxMultiplier ? `, up to ${Math.round(game.maxMultiplier).toLocaleString("en-US")}x` : ""
  }. Play the demo and verify a round yourself.`;
  const image = `/og/${slugFor(game)}.jpg`;

  return {
    title,
    description,
    alternates: { canonical: `/games/${slugFor(game)}` },
    openGraph: {
      type: "website",
      url: `/games/${slugFor(game)}`,
      title,
      description,
      images: [{ url: image, width: 1200, height: 630, alt: `${game.title} — Bet4.win` }],
    },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
}

export default async function GamePage({ params }) {
  const { slug } = await params;
  const game = findGame(slug);
  if (!game) notFound();

  const content = gameContent[slugFor(game)];
  // The next four titles after this one in catalogue order, wrapping, so every
  // game page links onward to a different set rather than all to the first four.
  const at = liveCatalogue.findIndex((e) => e.game.id === game.id);
  const others = [1, 2, 3, 4]
    .map((n) => liveCatalogue[(at + n) % liveCatalogue.length])
    .filter((e) => e && e.game.id !== game.id);

  // Describes the game as a product so search engines can surface the specs
  // rather than only the page title.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Game",
    name: game.title,
    url: `${SITE_URL}/games/${slugFor(game)}`,
    image: `${SITE_URL}/og/${slugFor(game)}.jpg`,
    gamePlatform: "Web-based",
    genre: game.category,
    publisher: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
    ...(content?.paragraphs?.length ? { description: content.paragraphs[0] } : {}),
  };

  return (
    <div className="min-h-screen bg-bg font-Text text-ink antialiased">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <main id="main">
        <GameDetail game={game} content={content} />

        {others.length > 0 && (
          <section aria-labelledby="more-games" className="mx-auto max-w-[1320px] px-5 pb-24 md:px-12">
            <h2
              id="more-games"
              className="b4w-display !mb-0 !text-[clamp(1.5rem,1.1rem+1.4vw,2.2rem)] !text-ink"
            >
              More originals
            </h2>
            <ul className="!mb-0 mt-8 grid list-none grid-cols-2 gap-x-5 gap-y-10 p-0 md:grid-cols-4">
              {others.map((entry) => (
                <li key={entry.slug}>
                  <LobbyCard entry={entry} source="more_games" sizes="(min-width:768px) 300px, 46vw" />
                </li>
              ))}
            </ul>
          </section>
        )}
        <DemoHost />
      </main>
      <Footer />
    </div>
  );
}
