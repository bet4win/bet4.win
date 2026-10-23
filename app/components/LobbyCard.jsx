"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Play } from "./Icons";
import { SEASONS, seasonsFor } from "@/app/lib/seasons";
import { playDemo } from "@/app/lib/gameLauncher";

// One game as a lobby card: its own play scene, its cut-out hero standing in
// it, and its wordmark as the title — the three pieces of its marketing pack,
// composed the way a casino lobby would present it. The figures sit under the
// card rather than on it, so the art is never covered by text.
//
// The demo button is a sibling of the link (a <button> inside an <a> is
// invalid), pinned to the card's corner. It is always visible: on touch there
// is no hover to reveal it.
export default function LobbyCard({ entry, sizes = "300px", source = "lobby" }) {
  const { game, slug, art, max } = entry;
  const seasons = seasonsFor(game);

  return (
    <div className="group relative">
      <Link
        href={`/games/${slug}`}
        className="block rounded-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
      >
        <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-panel">
          <Image
            src={art.scene}
            alt=""
            fill
            sizes={sizes}
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/5 to-transparent"
          />
          <Image
            src={art.art}
            alt=""
            fill
            sizes={sizes}
            className="!top-[6%] !h-[64%] object-contain drop-shadow-[0_16px_18px_rgba(0,0,0,0.5)] transition-transform duration-500 group-hover:-translate-y-2"
          />
          <Image
            src={art.wordmark}
            alt={game.title}
            sizes={sizes}
            className="absolute bottom-[6%] left-1/2 h-auto max-h-[18%] w-auto max-w-[82%] -translate-x-1/2 object-contain drop-shadow-[0_4px_10px_rgba(0,0,0,0.6)]"
          />
          {game.isNew && (
            <span className="absolute left-3 top-3 rounded-sm bg-accent px-1.5 py-px font-Text text-[12px] font-bold text-accent-ink">
              New
            </span>
          )}
        </div>
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
