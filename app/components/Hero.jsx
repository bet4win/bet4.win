"use client";
import React from "react";
import Image from "next/image";
import { games } from "@/data/games";
import { ArrowRight, Terminal, Shield } from "./Icons";
import { trackEvent } from "@/app/lib/analytics";

// The hero visual is a wall of the real game thumbnails — the art carries the
// colour; the chrome stays quiet. Pick the first six live originals.
const wall = games.filter((g) => g.status === "active").slice(0, 6);

export default function Hero() {
  return (
    <section className="b4w-contain-x relative mx-auto flex max-w-[1280px] flex-col items-center gap-12 px-5 pb-12 pt-28 md:px-12 md:pt-36 lg:flex-row lg:gap-16">
      {/* Copy */}
      <div className="relative z-10 flex flex-1 flex-col gap-6">
        {/* No manual line breaks — at this weight the phrase has to be allowed
            to rewrap, or "provably / fair" splits across lines at some widths. */}
        <h1 className="b4w-display max-w-[13ch] !text-[clamp(2.1rem,1.1rem+2.9vw,3.5rem)] !text-ink [text-wrap:balance]">
          Provably fair originals,{" "}
          <span className="text-brand">built for operators.</span>
        </h1>

        <p className="max-w-xl font-SpaceGrotesk text-[1.05rem] leading-[1.6] text-muted">
          A certified RNG, a single integration, and a new original every month —
          crash, mines, plinko and more, ready to brand as your own.
        </p>

        <div className="mt-1 flex flex-wrap items-center gap-3">
          {/* <a
            href="#integration"
            className="inline-flex items-center gap-2 rounded-md bg-brand-strong px-5 py-3 font-SpaceGrotesk text-[13px] font-semibold uppercase tracking-[0.04em] !text-white shadow-[0_0_22px_rgba(37,99,235,0.32)] transition-colors hover:bg-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
          >
            Explore the API
            <Terminal className="h-4 w-4" />
          </a> */}
          <a
            href="#games"
            onClick={() => trackEvent("cta_click", { label: "hero_view_games", cta_type: "anchor" })}
            className="b4w-sheen inline-flex items-center gap-2 rounded-md bg-brand-strong px-7 py-4 font-SpaceGrotesk text-[14px] font-semibold uppercase tracking-[0.04em] !text-white shadow-[0_0_30px_-4px_rgba(37,99,235,0.55)] transition-colors hover:bg-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
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

      {/* Game wall — decorative collage; the real game tiles live in #games */}
      <div className="relative w-full flex-1" aria-hidden="true">
        <div
          className="b4w-drift pointer-events-none absolute -inset-10 -z-10 rounded-full opacity-70 blur-3xl"
          style={{
            background:
              "radial-gradient(circle at 30% 30%, rgba(37,99,235,0.22), transparent 55%), radial-gradient(circle at 70% 70%, rgba(129,140,248,0.16), transparent 55%)",
          }}
        />
        <div className="grid grid-cols-3 gap-3 [transform:rotate(-4deg)]">
          {wall.map((game, i) => (
            <div
              key={game.id}
              className={`overflow-hidden rounded-xl border border-line shadow-2xl ${
                i % 2 === 0 ? "translate-y-3" : ""
              }`}
            >
              <Image
                src={game.image}
                alt=""
                width={256}
                height={256}
                // Default (lazy) on purpose. This wall is decorative and
                // aria-hidden; both `priority` and `loading="eager"` make
                // next/image emit preload links for srcset candidates the
                // browser then discards, which Chrome warns about. It sits at
                // the top of the viewport, so the lazy observer fires at once.
                sizes="(min-width:1024px) 200px, 30vw"
                className="h-full w-full object-cover"
              />
            </div>
          ))}
        </div>
        {/* Fade the wall into the canvas on the left edge */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-bg via-transparent to-transparent lg:block [transform:rotate(-4deg)]" />
      </div>
    </section>
  );
}
