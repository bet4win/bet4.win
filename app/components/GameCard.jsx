"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Clock, Play } from "./Icons";
import { slugFor } from "@/app/lib/slug";
import { SEASONS, seasonsFor } from "@/app/lib/seasons";

const isLive = (game) => game.status === "active";

const fmt = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });

// One title in the /games grid: the lobby tile, the name, the mechanic and the
// max win. Flat and still — the art is the only thing on the card that should
// look lit. It used to tilt under the pointer, lift and glow mint on hover,
// fade in on scroll and count its multiplier up from zero, which together made
// twenty cards feel like one effect repeated twenty times.
export default function GameCard({ game, onLaunch }) {
  const live = isLive(game);
  const seasons = seasonsFor(game);

  const tile = (
    <article className="flex h-full flex-col gap-3 text-left">
      <div className="relative aspect-square overflow-hidden rounded-lg bg-panel">
        <Image
          src={game.image}
          alt={game.title}
          fill
          sizes="(min-width:992px) 300px, (min-width:768px) 31vw, 46vw"
          className={`object-cover transition-[filter] duration-200 group-hover:brightness-110 ${
            live ? "" : "grayscale"
          }`}
        />
        {game.isNew && (
          <span className="absolute left-2 top-2 rounded-sm bg-accent px-1.5 py-px font-Text text-[12px] font-bold text-accent-ink">
            New
          </span>
        )}
        {!live && (
          <span
            className="absolute right-2 top-2 inline-flex items-center gap-1.5 rounded-sm bg-bg/85 px-1.5 py-px font-Text text-[12px] text-muted"
            aria-hidden="true"
          >
            <Clock className="h-3 w-3" />
            {game.status}
          </span>
        )}
        {/* Seasonal builds this title ships, named: a glyph alone is a puzzle.
            The wrapper carries the whole label so the words are not announced
            twice. */}
        {live && seasons.length > 0 && (
          <span
            className="absolute right-2 top-2 inline-flex items-center gap-1.5 rounded-sm bg-bg/85 px-1.5 py-px font-Text text-[12px] text-ink"
            aria-label={`Seasonal versions: ${seasons.map((id) => SEASONS[id].label).join(", ")}`}
            role="img"
          >
            {seasons.map((id) => {
              const { Icon, tint } = SEASONS[id];
              return <Icon key={id} className="h-3 w-3" style={{ color: tint }} />;
            })}
            {seasons.length === 1 && (
              <span className="hidden md:inline">{SEASONS[seasons[0]].label}</span>
            )}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1">
        <h3 className="!mb-0 font-Text text-[clamp(0.85rem,0.78rem+0.3vw,1rem)] font-bold !leading-snug !text-ink">
          {game.title}
        </h3>
        <p className="!mb-0 font-Text text-[13px] text-muted">
          {[game.category, game.rtp && `RTP ${game.rtp}`].filter(Boolean).join(" · ")}
        </p>
        <p className="b4w-figure !mb-0 mt-auto pt-1 text-[15px] text-ink">
          {game.maxMultiplier ? (
            <>
              <span className="font-bold">{fmt.format(game.maxMultiplier)}×</span>{" "}
              <span className="text-[13px] text-muted">max win</span>
            </>
          ) : (
            <span className="text-[13px] text-muted">
              {live ? "Max win set per operator" : `Arriving ${game.status}`}
            </span>
          )}
        </p>
      </div>
    </article>
  );

  if (!live) return tile;

  return (
    <div className="group relative h-full">
      {/* The card is a real link so the game pages stay crawlable and
          openable in a new tab. */}
      <Link
        href={`/games/${slugFor(game)}`}
        className="block h-full rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
        aria-label={`${game.title} — game details`}
      >
        {tile}
      </Link>

      {/* Over the art, as a sibling of the link (a <button> inside an <a> is
          invalid). Always visible on touch, where there is no hover to reveal
          it and the demo would otherwise be unreachable from the grid. */}
      {onLaunch && (
        <span className="pointer-events-none absolute inset-x-0 top-0 flex aspect-square items-end justify-start p-2">
          <button
            type="button"
            onClick={() => onLaunch(game)}
            aria-label={`Play the ${game.title} demo`}
            className="b4w-btn b4w-btn--glass b4w-btn--sm pointer-events-auto opacity-0 transition-opacity duration-200 focus-visible:opacity-100 group-hover:opacity-100 max-md:opacity-100"
          >
            <Play className="h-3.5 w-3.5" />
            Demo
          </button>
        </span>
      )}
    </div>
  );
}
