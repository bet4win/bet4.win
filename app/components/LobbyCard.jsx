"use client";
import React from "react";
import Link from "next/link";
import LobbyArt from "./LobbyArt";
import { Play } from "./Icons";
import { SEASONS, seasonsFor } from "@/app/lib/seasons";
import { playDemo } from "@/app/lib/gameLauncher";

// One game as a lobby card in the catalogue: the composed art (LobbyArt) as a
// link to the game's page, with the figures underneath rather than on top, so
// the art is never covered by text.
//
// The demo button is a sibling of the link (a <button> inside an <a> is
// invalid), pinned to the card's corner. It is always visible: on touch there
// is no hover to reveal it.
export default function LobbyCard({ entry, sizes = "300px", source = "lobby" }) {
  const { game, slug, max } = entry;
  const seasons = seasonsFor(game);

  return (
    <div className="group relative">
      <Link
        href={`/games/${slug}`}
        className="block rounded-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
      >
        {/* The season glyphs are listed under the card here, and the corner
            holds the demo button. */}
        <LobbyArt entry={entry} sizes={sizes} showMarks={false} />
        <div className="mt-3 flex items-baseline justify-between gap-3 font-Text text-[14px]">
          <span className="flex min-w-0 items-center gap-2 text-muted">
            <span className="truncate">{game.category}</span>
            {seasons.map((id) => {
              const { Icon, tint, label } = SEASONS[id];
              return (
                <Icon
                  key={id}
                  className="h-3.5 w-3.5 shrink-0"
                  style={{ color: tint }}
                  aria-hidden={false}
                  aria-label={`${label} version`}
                  role="img"
                />
              );
            })}
          </span>
          <span className="b4w-figure shrink-0 font-bold text-ink">
            {max ? `${max} max` : <span className="font-normal text-muted">Cap per operator</span>}
          </span>
        </div>
      </Link>

      <button
        type="button"
        onClick={() => playDemo(game, slug, source)}
        aria-label={`Play the ${game.title} demo`}
        className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-black/60 text-white transition-colors hover:bg-white hover:text-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      >
        <Play className="h-4 w-4 translate-x-px" />
      </button>
    </div>
  );
}
