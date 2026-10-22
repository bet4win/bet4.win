import React from "react";
import Link from "next/link";
import GameGrid from "./GameGrid";
import Section from "./Section";
import { ArrowRight } from "./Icons";
import { games } from "@/data/games";

const live = games.filter((g) => g.status === "active");

// The whole catalogue, side by side. The hero already shows what the games look
// like; this is where an operator compares them, so it lists every title rather
// than a taste of eight. GameGrid still handles ?game= links for any title.
export default function GamesPreview() {
  return (
    // id="games" is the target for the "Compare all" / "Play the demo" anchors
    // in the hero and the spotlight.
    <Section
      id="games"
      surface="base"
      aria-labelledby="games-preview-heading"
      innerClassName="py-14 md:py-20"
    >
      <div className="mb-8 flex flex-col gap-4 md:mb-10 md:flex-row md:items-end md:justify-between md:gap-10">
        <div>
          <h2
            id="games-preview-heading"
            className="b4w-display !mb-0 !text-[clamp(1.7rem,1.2rem+1.6vw,2.4rem)] !text-ink"
          >
            Every game, side by side
          </h2>
          <p className="!mb-0 mt-3 max-w-2xl b4w-copy font-Text text-muted">
            RTP ranges cover every version we certify. Max win is the default
            cap, and you can set a lower one per operator.
          </p>
        </div>
        <Link href="/games" className="b4w-btn b4w-btn--quiet self-start md:self-auto">
          Browse the game pages
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <GameGrid items={live} filterable layout="table" />
    </Section>
  );
}
