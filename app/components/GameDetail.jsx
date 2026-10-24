"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import GameModal from "./GameModal";
import SeasonLaunch from "./SeasonLaunch";
import Wordmark from "./Wordmark";
import Reel from "./Reel";
import { STAGE_LETTER, STAGE_WORDMARK_MAX, stageWordmarkSizes } from "./Stage";
import { ArrowLeft, Play } from "./Icons";
import { trackEvent } from "@/app/lib/analytics";
import { STANDARD, seasonOptions } from "@/app/lib/seasons";
import { slugFor } from "@/app/lib/slug";
import { formatMax } from "@/app/lib/catalogue";
import { artFor } from "@/data/gameArt";

// A game's own page opens on its own stage — the same room, hero and wordmark
// the homepage shows when this title is picked — and then reads like a game
// sheet: how it plays on the left, the figures an operator screens on at the
// right.
export default function GameDetail({ game, content }) {
  // The page itself is the shareable URL, so unlike the homepage there is no
  // history/param juggling here — just open and close. `launched` carries which
  // build is running: null for the game's own URL, otherwise a season's.
  const [launched, setLaunched] = useState(null);
  const art = artFor(slugFor(game));

  // Empty unless the game ships seasonal builds, which turns the plain button
  // into the split one.
  const seasons = seasonOptions(game);

  const launch = (url, option) => {
    // Only a real season labels the modal; "Standard" is the ordinary game.
    const season = option && option.id !== STANDARD ? option : null;
    trackEvent("game_launch", {
      game_id: game.id,
      game_title: game.title,
      source: "game_page",
      ...(option ? { season: option.id } : {}),
    });
    setLaunched({ url, season });
  };

  const figures = [
    ["Max win", formatMax(game.maxMultiplier) ?? "Set per operator"],
    ["RTP", game.rtp],
    ["Volatility", game.volatility],
    ["Mechanic", game.category],
  ].filter(([, v]) => v);

  return (
    <>
      {/* Clipped sideways only, and stacked above the page below it: the
          seasonal launch menu hangs out of the bottom of this band. The room
          is clipped in its own layer instead. */}
      <section className="relative z-10 overflow-x-clip border-b border-line/60 bg-bg">
        {art && (
          <div aria-hidden="true" className="absolute inset-0 -z-10 overflow-hidden">
            <Image src={art.scene} alt="" fill priority sizes="100vw" quality={90} className="b4w-settle-scene object-cover" />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,9,14,0.92)_0%,rgba(8,9,14,0.55)_45%,rgba(8,9,14,0.08)_80%)] max-lg:bg-[linear-gradient(180deg,rgba(8,9,14,0.45)_0%,rgba(8,9,14,0.85)_60%)]" />
            <div className="absolute inset-x-0 -bottom-px h-28 bg-gradient-to-t from-bg to-transparent" />
          </div>
        )}

        <div className="mx-auto max-w-[1280px] px-5 pt-6 md:px-12 md:pt-10">
          <nav aria-label="Breadcrumb">
            <Link href="/games" className="b4w-btn b4w-btn--quiet !pl-0 !text-ink/80 !no-underline hover:!text-ink">
              <ArrowLeft className="h-4 w-4" />
              The catalogue
            </Link>
          </nav>
        </div>

        <div className="mx-auto grid max-w-[1280px] items-center gap-6 px-5 pb-14 md:px-12 md:pb-20 lg:min-h-[560px] lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
          <div className="relative z-10 order-2 flex min-w-0 flex-col items-start gap-6 lg:order-1">
            <h1 className="b4w-wipe !mb-0 w-full">
              {art ? (
                <Wordmark
                  art={art}
                  alt={game.title}
                  letter={STAGE_LETTER}
                  maxWidth={STAGE_WORDMARK_MAX}
                  priority
                  glint="arrive"
                  sizes={stageWordmarkSizes(art)}
                  className="drop-shadow-[0_8px_20px_rgba(0,0,0,0.6)]"
                />
              ) : (
                <span className="b4w-display !text-[clamp(2.4rem,1.5rem+2.8vw,3.5rem)] !text-ink">
                  {game.title}
                </span>
              )}
            </h1>
            {game.featured?.headline && (
              <p className="!mb-0 max-w-[30rem] font-Text !text-[clamp(0.95rem,0.8rem+0.5vw,1.1rem)] !font-semibold !leading-[1.4] !text-ink">
                {game.featured.headline}
              </p>
            )}
            <dl className="!mb-0 flex gap-x-6 gap-y-3 lg:flex-wrap lg:gap-x-8">
              {figures.slice(0, 3).map(([k, v]) => (
                <div key={k} className="flex flex-col">
                  <dt className="order-2 font-Text text-[12px] text-ink/65 lg:text-[14px]">{k}</dt>
                  <dd className="b4w-figure order-1 !mb-0 whitespace-nowrap text-[17px] font-bold leading-tight text-ink lg:text-[clamp(1.15rem,0.9rem+1vw,1.4rem)]">
                    <Reel value={v} />
                  </dd>
                </div>
              ))}
            </dl>
            <div className="w-full max-w-[22rem]">
              {seasons.length > 0 ? (
                <SeasonLaunch options={seasons} onLaunch={launch} className="mt-0" />
              ) : (
                <button
                  type="button"
                  onClick={() => launch(null, null)}
                  className="b4w-btn b4w-btn--primary b4w-btn--lg flex w-full"
                >
                  <Play className="h-4 w-4" />
                  Play the demo
                </button>
              )}
            </div>
          </div>

          {art && (
            <div className="relative order-1 h-[34svh] min-h-[220px] lg:order-2 lg:h-[520px]">
              <Image
                src={art.art}
                alt=""
                fill
                priority
                sizes="(min-width:992px) 55vw, 90vw"
                quality={90}
                className="b4w-land-hero object-contain drop-shadow-[0_30px_40px_rgba(0,0,0,0.6)]"
              />
            </div>
          )}
        </div>
      </section>

      <section className="mx-auto grid max-w-[1280px] gap-12 px-5 py-14 md:px-12 md:py-20 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-16">
        <div>
          {content?.paragraphs?.length > 0 && (
            <>
              <h2 className="b4w-display !mb-0 !text-[clamp(1.5rem,1.1rem+1.4vw,2.2rem)] !text-ink">
                How it plays
              </h2>
              <div className="mt-6 flex flex-col gap-4">
                {content.paragraphs.map((p, i) => (
                  <p key={i} className="!mb-0 max-w-2xl b4w-copy--lead font-Text text-ink/80">
                    {p}
                  </p>
                ))}
              </div>
            </>
          )}
        </div>

        {/* The game sheet: the figures an operator screens on. */}
        <aside aria-label="Game sheet" className="lg:pt-2">
          <dl className="!mb-0 border-t border-line">
            {figures.map(([k, v]) => (
              <div key={k} className="flex items-baseline justify-between gap-4 border-b border-line py-4">
                <dt className="font-Text text-[15px] text-muted">{k}</dt>
                <dd className="b4w-figure !mb-0 text-right font-Text text-[17px] font-bold text-ink">{v}</dd>
              </div>
            ))}
          </dl>
          <p className="!mb-0 mt-5 font-Text text-[14px] leading-[1.6] text-faint">
            Figures show the default configuration. Live values follow the game
            version and the setup agreed per operator — see{" "}
            <Link href="/terms" className="!text-muted underline underline-offset-2 hover:!text-ink">
              our terms
            </Link>
            .
          </p>
        </aside>
      </section>

      <GameModal
        game={launched ? game : null}
        url={launched?.url}
        season={launched?.season}
        onClose={() => setLaunched(null)}
      />
    </>
  );
}
