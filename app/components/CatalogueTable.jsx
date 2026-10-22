"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Play } from "./Icons";
import { slugFor } from "@/app/lib/slug";
import { SEASONS, seasonsFor } from "@/app/lib/seasons";

const fmt = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });

// The catalogue as a game sheet: one row per title, the figures an operator
// compares in columns. It is the same shape as the aggregator catalogues these
// games are listed in, which is the comparison an operator is actually making —
// a grid of twenty cards makes them read RTP and max win off twenty separate
// tiles.
//
// One <table> at every width. Below md the mechanic, RTP and volatility
// columns drop out and the mechanic moves under the title, so a phone gets
// art, name and max win — the three things that fit in 360px.
export default function CatalogueTable({ items, onLaunch }) {
  return (
    <table className="!mb-0 w-full border-collapse font-Text text-[14px] sm:text-[15px]">
      <caption className="sr-only">
        Every live game with its mechanic, RTP, volatility and maximum win
      </caption>
      <thead>
        <tr className="border-b border-line text-left text-[13px] text-muted">
          <th scope="col" className="py-3 pr-4 font-semibold">
            Game
          </th>
          <th scope="col" className="hidden py-3 pr-4 font-semibold md:table-cell">
            Mechanic
          </th>
          <th scope="col" className="hidden py-3 pr-4 font-semibold md:table-cell">
            RTP
          </th>
          <th scope="col" className="hidden py-3 pr-4 font-semibold lg:table-cell">
            Volatility
          </th>
          <th scope="col" className="py-3 pr-3 text-right font-semibold sm:pr-4">
            Max win
          </th>
          <th scope="col" className="hidden py-3 pr-4 font-semibold xl:table-cell">
            Seasonal
          </th>
          <th scope="col" className="py-3">
            <span className="sr-only">Demo</span>
          </th>
        </tr>
      </thead>
      <tbody>
        {items.map((game) => (
          <Row key={game.id} game={game} onLaunch={onLaunch} />
        ))}
      </tbody>
    </table>
  );
}

function Row({ game, onLaunch }) {
  const seasons = seasonsFor(game);

  return (
    <tr className="group border-b border-line/60 align-middle transition-colors hover:bg-panel/60">
      <th scope="row" className="py-[8px] pr-4 text-left font-normal">
        <Link
          href={`/games/${slugFor(game)}`}
          className="flex items-center gap-3 !text-ink sm:gap-3.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
        >
          <span className="relative h-[40px] w-[40px] shrink-0 overflow-hidden rounded sm:h-[48px] sm:w-[48px]">
            <Image src={game.image} alt="" fill sizes="48px" className="object-cover" />
          </span>
          <span className="flex min-w-0 flex-col">
            <span className="flex items-center gap-2">
              <span className="font-semibold underline decoration-transparent underline-offset-4 transition-colors group-hover:decoration-line">
                {game.title}
              </span>
              {game.isNew && (
                <span className="hidden rounded-sm bg-accent px-1.5 py-px text-[11px] font-bold leading-tight text-accent-ink sm:inline">
                  New
                </span>
              )}
            </span>
            <span className="text-[13px] text-muted md:hidden">{game.category}</span>
          </span>
        </Link>
      </th>
      <td className="hidden py-[8px] pr-4 text-muted md:table-cell">{game.category}</td>
      <td className="b4w-figure hidden whitespace-nowrap py-[8px] pr-4 text-muted md:table-cell">
        {game.rtp ?? "—"}
      </td>
      <td className="hidden whitespace-nowrap py-[8px] pr-4 text-muted lg:table-cell">
        {game.volatility ?? "—"}
      </td>
      <td className="b4w-figure whitespace-nowrap py-[8px] pr-3 text-right font-semibold text-ink sm:pr-4">
        {game.maxMultiplier ? (
          `${fmt.format(game.maxMultiplier)}×`
        ) : (
          <span className="whitespace-normal text-[13px] font-normal text-muted">Set per operator</span>
        )}
      </td>
      <td className="hidden py-[8px] pr-4 xl:table-cell">
        {seasons.length > 0 ? (
          <span className="flex flex-wrap gap-x-3 gap-y-1 text-[13px]">
            {seasons.map((id) => {
              const { Icon, label, tint } = SEASONS[id];
              return (
                <span key={id} className="inline-flex items-center gap-1.5 text-muted">
                  <Icon className="h-3.5 w-3.5" style={{ color: tint }} aria-hidden="true" />
                  {label}
                </span>
              );
            })}
          </span>
        ) : null}
      </td>
      <td className="py-[8px] text-right">
        <button
          type="button"
          onClick={() => onLaunch(game)}
          aria-label={`Play the ${game.title} demo`}
          className="b4w-btn b4w-btn--ghost b4w-btn--sm max-sm:!h-11 max-sm:!w-11 max-sm:!p-0"
        >
          <Play className="h-3.5 w-3.5" />
          <span className="max-sm:sr-only">Demo</span>
        </button>
      </td>
    </tr>
  );
}
