"use client";
import React from "react";
import Section from "./Section";
import HeroWall from "./HeroWall";
import { ArrowRight, Terminal, Shield } from "./Icons";
import { trackEvent } from "@/app/lib/analytics";

export default function Hero() {
  return (
    // Top padding is much smaller than it looks: the header is sticky now, so
    // it occupies flow above this instead of floating over it.
    <Section
      surface="base"
      depth
      texture
      innerClassName="flex flex-col items-center gap-12 pb-12 pt-12 md:pt-20 lg:flex-row lg:gap-16"
    >
      {/* Copy */}
      <div className="relative z-10 flex flex-1 flex-col gap-6">
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
          {/* <a
            href="#integration"
            className="inline-flex items-center gap-2 rounded-md bg-brand-strong px-5 py-3 font-SpaceGrotesk text-[13px] font-semibold uppercase tracking-[0.04em] !text-white shadow-[0_2px_16px_-8px_rgba(37,99,235,0.4)] transition-colors hover:bg-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
          >
            Explore the API
            <Terminal className="h-4 w-4" />
          </a> */}
          <a
            href="#games"
            onClick={() => trackEvent("cta_click", { label: "hero_view_games", cta_type: "anchor" })}
            className="b4w-sheen inline-flex items-center gap-2 rounded-md bg-brand-strong px-7 py-4 font-SpaceGrotesk text-[14px] font-semibold uppercase tracking-[0.04em] !text-white shadow-[0_2px_20px_-8px_rgba(37,99,235,0.5)] transition-colors hover:bg-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
          >
            View games
            <ArrowRight className="h-4 w-4" />
          </a>
          <a
            href="/provably-fair"
            className="inline-flex items-center gap-2 font-SpaceGrotesk text-[13px] font-semibold uppercase tracking-[0.06em] !text-muted transition-colors hover:!text-ink focus-visible:outline-none focus-visible:!text-ink"
          >
            <Shield className="h-4 w-4" />
            How fairness works
          </a>
          {/* <a
            href="#games"
            className="machined-surface inline-flex items-center gap-2 rounded-md border border-line px-5 py-3 font-SpaceGrotesk text-[12px] uppercase tracking-[0.06em] !text-ink transition-colors hover:bg-panel focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-line"
          >
            View games
            <ArrowRight className="h-4 w-4" />
          </a> */}
        </div>
      </div>

      {/* Decorative collage, now pointer-reactive, with the live-rounds tile
          sitting in it. The real, launchable game tiles live in #games. */}
      <HeroWall />
    </Section>
  );
}
