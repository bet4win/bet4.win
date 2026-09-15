"use client";
import React from "react";
import Section from "./Section";
import HeroWall from "./HeroWall";
import { ArrowRight, ShieldCheck } from "./Icons";
import { trackEvent } from "@/app/lib/analytics";
import { games } from "@/data/games";

const LIVE_COUNT = games.filter((g) => g.status === "active").length;

export default function Hero() {
  return (
    // Top padding is much smaller than it looks: the header is sticky now, so
    // it occupies flow above this instead of floating over it.
    <Section
      surface="base"
      depth
      texture
      motes={12}
      innerClassName="flex flex-col items-center gap-12 pb-12 pt-12 md:pt-20 lg:flex-row lg:gap-16"
    >
      {/* Copy */}
      <div className="relative z-10 flex flex-1 flex-col gap-6">
        {/* The catalogue's own count, not a slogan. It is the fact the whole
            page rests on, and it is the only thing above the headline. */}
        <p className="!mb-0 flex items-center gap-2.5 font-SpaceGrotesk text-[11px] uppercase tracking-[0.12em] text-faint">
          <span className="relative flex h-1.5 w-1.5 shrink-0">
            <span className="b4w-pulse absolute inline-flex h-full w-full rounded-full bg-accent" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
          </span>
          <span className="font-JetBrainsMono text-[12px] font-semibold tracking-[0.02em] text-accent tabular-nums">
            {LIVE_COUNT}
          </span>
          originals live · a new one every month
        </p>

        {/* No manual line breaks — at this weight the phrase has to be allowed
            to rewrap, or "provably / fair" splits across lines at some widths. */}
        <h1 className="b4w-display max-w-[13ch] !text-[clamp(2.1rem,1.1rem+2.9vw,3.5rem)] !text-ink [text-wrap:balance]">
          Exclusive originals{" "}
          <span className="text-brand">and crash games</span>
        </h1>

        <p className="max-w-xl font-SpaceGrotesk text-[1.05rem] leading-[1.6] text-muted">
          A certified RNG, a single integration, and a new original every month —
          crash, mines, plinko and more, ready to brand as your own.
        </p>

        <div className="mt-1 flex flex-wrap items-center gap-3">
          <a
            href="#games"
            onClick={() => trackEvent("cta_click", { label: "hero_view_games", cta_type: "anchor" })}
            className="b4w-btn b4w-btn--primary b4w-btn--lg"
          >
            View games
            <ArrowRight className="h-4 w-4" />
          </a>
          <a href="/provably-fair" className="b4w-btn b4w-btn--quiet">
            <ShieldCheck className="h-4 w-4 text-accent" />
            How fairness works
          </a>
        </div>
      </div>

      {/* Decorative collage, now pointer-reactive, with the live-rounds tile
          sitting in it. The real, launchable game tiles live in #games. */}
      <HeroWall />
    </Section>
  );
}
