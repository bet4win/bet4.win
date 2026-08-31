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
      className="mx-auto max-w-[1280px] px-5 py-8 md:px-12"
    >
      {/* One flex container for all three blocks so the "see all" link can sit
          beside the heading on desktop but after the cards on phones, without
          rendering the link twice. DOM order stays heading -> link -> grid,
          which matches the desktop reading order; only mobile reorders. */}
      <div className="flex flex-col gap-8 md:flex-row md:flex-wrap md:items-end md:justify-between">
        <Reveal className="md:order-1">
          <p className="font-SpaceGrotesk text-[12px] uppercase tracking-[0.08em] text-cyan">
            A new original every month
          </p>
          <h2
            id="games-preview-heading"
            className="mt-2 b4w-display !text-[1.75rem] !text-ink"
          >
            The catalogue
          </h2>
        </Reveal>

        {/* <Link
          href="/games"
          className="order-3 inline-flex items-center gap-1.5 self-start font-SpaceGrotesk text-[12px] uppercase tracking-[0.06em] !text-cyan transition-colors hover:!text-ink focus-visible:outline-none focus-visible:!text-ink md:order-2 md:self-auto"
        >
          See all {live.length} games
          <ArrowRight className="h-4 w-4" />
        </Link> */}

        <div className="order-2 w-full md:order-3">
          <GameGrid items={PREVIEW} />
          <Link
            href="/games"
            className="b4w-sheen mx-auto mt-8 flex w-fit items-center gap-2 rounded-md bg-brand-strong px-7 py-4 font-SpaceGrotesk text-[14px] font-semibold uppercase tracking-[0.04em] !text-white shadow-[0_0_30px_-4px_rgba(37,99,235,0.55)] transition-colors hover:bg-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
          >
            See all {live.length} games
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

      </div>
    </section>
  );
}
