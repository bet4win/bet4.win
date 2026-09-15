import React from "react";
import Link from "next/link";
import GameGrid from "./GameGrid";
import Reveal from "./Reveal";
import Section from "./Section";
import { ArrowRight } from "./Icons";
import { games } from "@/data/games";

const live = games.filter((g) => g.status === "active");

// A taste of the catalogue on the home page — the full grid lives at /games, so
// this shows eight and gets out of the way. GameGrid still handles ?game= links
// for any title, not just the eight rendered here.
export default function GamesPreview() {
  return (
    // id="games" is the target for the "View games" / "Play demo" anchors in the
    // hero and the spotlight. Nothing on the site carried that id before, so
    // both fallbacks silently scrolled nowhere.
    <Section
      id="games"
      // Base, and this is the section the whole alternation below is arranged
      // around: a card is bg-panel-high, and on bg-panel it sat at a 1.30 value
      // step — a tile you had to look for. On the floor it is 1.54, and the
      // grid reads as objects on a surface rather than as a lighter grid on a
      // light band. Everything from the spotlight down flips to suit it.
      surface="base"
      rule
      aria-labelledby="games-preview-heading"
      innerClassName="py-12 md:py-20"
    >
      {/* One flex container for all three blocks so the "see all" link can sit
          beside the heading on desktop but after the cards on phones, without
          rendering the link twice. DOM order stays heading -> link -> grid,
          which matches the desktop reading order; only mobile reorders. */}
      <div className="flex flex-col gap-6 md:flex-row md:flex-wrap md:items-end md:justify-between md:gap-8">
        <Reveal className="md:order-1">
          <p className="font-SpaceGrotesk text-[12px] uppercase tracking-[0.08em] text-accent">
            A new original every month
          </p>
          <h2
            id="games-preview-heading"
            className="mt-2 b4w-display !text-[clamp(2.1rem,1.3rem+2.4vw,3.1rem)] max-[359px]:!text-[1.8rem] !text-ink"
          >
            The catalogue
          </h2>
        </Reveal>

        <div className="order-2 w-full md:order-3">
          <GameGrid items={live} limit={8} filterable />
          <Link
            href="/games"
            className="b4w-btn b4w-btn--primary b4w-btn--lg mx-auto mt-6 flex w-fit md:mt-8"
          >
            See all {live.length} games
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

      </div>
    </Section>
  );
}
