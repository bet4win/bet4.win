import React from "react";
import Link from "next/link";
import GameGrid from "./GameGrid";
import Reveal from "./Reveal";
import { ArrowRight } from "./Icons";
import { games } from "@/data/games";

const live = games.filter((g) => g.status === "active");
const PREVIEW = live.slice(0, 4);

// A taste of the catalogue on the home page — the full grid lives at /games, so
// this shows four and gets out of the way. GameGrid still handles ?game= links
// for any title, not just the four rendered here.
export default function GamesPreview() {
  return (
    <section
      aria-labelledby="games-preview-heading"
      className="mx-auto max-w-[1280px] px-5 py-16 md:px-12"
    >
      <Reveal className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-SpaceGrotesk text-[12px] uppercase tracking-[0.08em] text-cyan">
            A new original every month
          </p>
          <h2
            id="games-preview-heading"
            className="mt-2 b4w-display !text-[1.75rem] !text-ink"
          >
            The catalogue
          </h2>
        </div>
        <Link
          href="/games"
          className="inline-flex items-center gap-1.5 font-SpaceGrotesk text-[12px] uppercase tracking-[0.06em] !text-cyan transition-colors hover:!text-ink focus-visible:outline-none focus-visible:!text-ink"
        >
          See all {live.length} games
          <ArrowRight className="h-4 w-4" />
        </Link>
      </Reveal>

      <GameGrid items={PREVIEW} />
    </section>
  );
}
