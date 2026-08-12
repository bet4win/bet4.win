import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import GameDetail from "@/app/components/GameDetail";
import { games } from "@/data/games";
import { gameContent } from "@/data/gameContent";
import { SITE_URL, SITE_NAME } from "@/app/lib/site";

const slugFor = (game) => game.title.toLowerCase();
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
  const others = liveGames()
    .filter((g) => g.id !== game.id)
    .slice(0, 4);

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
    <div className="min-h-screen bg-bg font-SpaceGrotesk text-ink antialiased">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <main id="main">
        <GameDetail game={game} content={content} />

        {others.length > 0 && (
          <section
            aria-labelledby="more-games"
            className="mx-auto max-w-[1280px] px-5 pb-24 md:px-12"
          >
            <h2
              id="more-games"
              className="mb-6 font-SpaceGrotesk !text-[12px] !font-normal uppercase !tracking-[0.1em] !text-faint"
            >
              More originals
            </h2>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {others.map((g) => (
                <Link
                  key={g.id}
                  href={`/games/${slugFor(g)}`}
                  className="group overflow-hidden rounded-xl border border-line bg-panel transition-colors hover:border-cyan/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                >
                  <Image
                    src={g.banner}
                    alt=""
                    sizes="(min-width:992px) 300px, 46vw"
                    className="h-auto w-full"
                  />
                  <span className="block px-3.5 py-3 font-SpaceGrotesk text-[1rem] font-semibold !text-ink">
                    {g.title}
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}
