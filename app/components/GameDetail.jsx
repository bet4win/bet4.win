"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import GameModal from "./GameModal";
import SeasonLaunch from "./SeasonLaunch";
import Section from "./Section";
import { ArrowLeft, Play } from "./Icons";
import { trackEvent } from "@/app/lib/analytics";
import { STANDARD, seasonOptions } from "@/app/lib/seasons";

const fmt = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });

export default function GameDetail({ game, content }) {
  // The page itself is the shareable URL, so unlike the catalogue modal there is
  // no history/param juggling here — just open and close. `launched` carries
  // which build is running: null for the game's own URL, otherwise the pinned
  // variant's.
  const [launched, setLaunched] = useState(null);

  // Empty unless the game ships seasonal dressing, which is what turns the
  // plain button below into the split one.
  const seasons = seasonOptions(game);

  const launch = (url, option) => {
    // Only a real season labels the modal; "Standard" is the ordinary game.
    const season = option && option.id !== STANDARD ? option : null;

    trackEvent("game_launch", {
      game_id: game.id,
      game_title: game.title,
      source: "game_page",
      // Absent for a game with no variants, so the ordinary event keeps the
      // shape it has always had in the analytics.
      ...(option ? { season: option.id } : {}),
    });
    setLaunched({ url, season });
  };

  const stats = [
    game.maxMultiplier && {
      label: "Max multiplier",
      value: `${fmt.format(game.maxMultiplier)}×`,
      money: true, // the accent is reserved for figures that are money
    },
    game.rtp && { label: "RTP", value: game.rtp },
    game.volatility && { label: "Volatility", value: game.volatility },
  ].filter(Boolean);

  return (
    <>
      {/* pt-28/md:pt-36 here was clearance for a header that has been sticky
          rather than fixed for a while — it left a screen of empty floor above
          the breadcrumb. Matched to <PageHeader>, which is what every other
          route opens with, and given the same lit canvas. */}
      <Section
        surface="base"
        depth
        texture
        motes={7}
        innerClassName="pb-12 pt-10 md:pb-16 md:pt-20"
      >
        <nav aria-label="Breadcrumb" className="mb-6">
          <Link
            href="/games"
            className="b4w-btn b4w-btn--quiet !pl-0"
          >
            <ArrowLeft className="h-4 w-4" />
            The catalogue
          </Link>
        </nav>

        <div className="overflow-hidden rounded-2xl border border-line shadow-2xl">
          <Image
            src={game.bannerWide}
            alt={`${game.title} — key art`}
            priority
            sizes="(min-width:1280px) 1232px, 92vw"
            className="h-auto w-full"
          />
        </div>

        <div className="mt-10 flex flex-col gap-10 lg:flex-row lg:gap-16">
          <div className="flex-1">
            <p className="font-SpaceGrotesk text-[12px] uppercase tracking-[0.08em] text-accent">
              {game.category} · Live
            </p>
            <h1 className="b4w-display mt-2 !text-[clamp(2.4rem,1.5rem+2.8vw,3.5rem)] !text-ink">
              {game.title}
            </h1>

            {content?.paragraphs?.length > 0 && (
              <div className="mt-7">
                <h2 className="font-SpaceGrotesk !text-[12px] !font-normal uppercase !tracking-[0.1em] !text-faint">
                  How it plays
                </h2>
                <div className="mt-4 flex flex-col gap-4">
                  {content.paragraphs.map((p, i) => (
                    <p
                      key={i}
                      className="!mb-0 max-w-2xl b4w-copy--lead font-SpaceGrotesk text-muted"
                    >
                      {p}
                    </p>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Spec panel — the figures an operator actually screens on. */}
          <aside className="w-full lg:w-[340px] lg:shrink-0">
            <div className="machined-surface rounded-2xl border border-line bg-panel-high p-6">
              <dl className="flex flex-col gap-5">
                {stats.map((s) => (
                  <div
                    key={s.label}
                    className="flex flex-col-reverse border-b border-line/60 pb-4 last:border-b-0 last:pb-0"
                  >
                    <dt className="mt-1 font-SpaceGrotesk text-[11px] uppercase tracking-[0.08em] text-faint">
                      {s.label}
                    </dt>
                    <dd
                      className={`!mb-0 font-JetBrainsMono text-[clamp(1.15rem,0.996rem+0.787vw,1.5rem)] font-semibold !leading-none !tracking-[-0.02em] tabular-nums ${
                        s.money ? "!text-accent" : "!text-ink"
                      }`}
                    >
                      {s.value}
                    </dd>
                  </div>
                ))}
              </dl>

              {seasons.length > 0 ? (
                <SeasonLaunch options={seasons} onLaunch={launch} />
              ) : (
                <button
                  type="button"
                  onClick={() => launch(null, null)}
                  className="b4w-btn b4w-btn--primary b4w-btn--lg mt-7 flex w-full"
                >
                  <Play className="h-4 w-4" />
                  Play demo
                </button>
              )}

              <p className="!mb-0 mt-6 border-t border-line/60 pt-5 font-SpaceGrotesk text-[0.8rem] leading-[1.6] text-faint">
                Figures show the default configuration. Live values follow the
                game version and the setup agreed per operator — see{" "}
                <Link href="/terms" className="!text-muted underline underline-offset-2 hover:!text-ink">
                  our terms
                </Link>
                .
              </p>
            </div>
          </aside>
        </div>
      </Section>

      <GameModal
        game={launched ? game : null}
        url={launched?.url}
        season={launched?.season}
        onClose={() => setLaunched(null)}
      />
    </>
  );
}
