"use client";
import React from "react";
import Image from "next/image";
import { games } from "@/data/games";
import { ArrowRight, Play, ShieldCheck } from "./Icons";
import { launchGame } from "@/app/lib/gameLauncher";
import { trackEvent } from "@/app/lib/analytics";

// Spotlight for one original: wide key art beside the pitch and a big demo CTA.
// Everything it renders comes from that game's `featured` block in data/games.js,
// so featuring next month's release is a data change, not a component change.
export default function FeaturedGame({ slug }) {
  const game = games.find(
    (g) => g.status === "active" && g.title.toLowerCase() === slug && g.featured,
  );
  if (!game) return null;

  // Key art lives on the game itself (every game has it now); the `featured`
  // block only carries the spotlight's copy.
  const banner = game.banner;
  const { eyebrow, headline, body, stats } = game.featured;

  const play = (e) => {
    trackEvent("game_launch", {
      game_id: game.id,
      game_title: game.title,
      source: "featured_hero",
    });
    // Anchor href is the fallback: if the catalogue hasn't mounted, the click
    // falls through and scrolls to #games instead of doing nothing.
    if (launchGame(slug)) e.preventDefault();
  };

  return (
    <section
      aria-labelledby="featured-heading"
      className="mx-auto max-w-[1280px] px-5 pb-8 pt-4 md:px-12"
    >
      <div className="relative overflow-hidden rounded-2xl border border-line bg-panel-low">
        {/* Ambient wash picked from the key art so the panel doesn't read as a
            grey box bolted under the hero. */}
        <div
          className="b4w-drift pointer-events-none absolute inset-0 -z-10 opacity-70"
          style={{
            background:
              "radial-gradient(circle at 20% 35%, rgba(37,99,235,0.22), transparent 58%), radial-gradient(circle at 85% 80%, rgba(129,140,248,0.14), transparent 55%)",
          }}
        />

        <div className="flex flex-col items-center gap-8 p-5 md:p-8 lg:flex-row lg:gap-12 lg:p-10">
          {/* Key art */}
          <div className="w-full lg:w-[55%] lg:shrink-0">
            <div className="overflow-hidden rounded-xl border border-line shadow-2xl">
              <Image
                src={banner}
                alt={`${game.title} — key art`}
                sizes="(min-width:992px) 660px, 92vw"
                className="h-auto w-full"
              />
            </div>
          </div>

          {/* Pitch */}
          <div className="flex w-full flex-col gap-5">
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-md border border-line bg-panel px-3 py-1.5 font-SpaceGrotesk text-[11px] uppercase tracking-[0.06em] text-cyan">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-strong b4w-pulse" />
                {eyebrow}
              </span>
            </div>

            <div>
              <p className="font-SpaceGrotesk text-[12px] uppercase tracking-[0.08em] text-muted">
                {game.category}
              </p>
              <h2
                id="featured-heading"
                className="b4w-display mt-1 !text-[clamp(2.2rem,1.4rem+2.6vw,3.25rem)] !text-ink"
              >
                {game.title}
              </h2>
              <p className="mt-3 font-SpaceGrotesk !text-[1.05rem] !font-semibold !leading-[1.35] !tracking-[-0.01em] !text-ink">
                {headline}
              </p>
            </div>

            <p className="max-w-xl font-SpaceGrotesk text-[0.95rem] leading-[1.6] text-muted">
              {body}
            </p>

            <dl className="flex flex-wrap gap-x-8 gap-y-3">
              {stats.map((s) => (
                // column-reverse so the value reads above the label visually
                // while the DOM keeps the dt→dd order a <dl> requires.
                <div key={s.label} className="flex flex-col-reverse">
                  <dt className="mt-1 font-SpaceGrotesk text-[11px] uppercase tracking-[0.06em] text-muted">
                    {s.label}
                  </dt>
                  <dd className="!mb-0 font-JetBrainsMono text-[1.4rem] font-semibold leading-none !text-cyan tabular-nums">
                    {s.value}
                  </dd>
                </div>
              ))}
            </dl>

            <div className="mt-1 flex flex-wrap items-center gap-4">
              <a
                href="#games"
                onClick={play}
                className="inline-flex items-center gap-2.5 rounded-md b4w-sheen bg-brand-strong px-7 py-4 font-SpaceGrotesk text-[15px] font-semibold uppercase tracking-[0.04em] !text-white shadow-[0_0_26px_-4px_rgba(37,99,235,0.5)] transition-colors hover:bg-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-panel-low"
              >
                <Play className="h-4 w-4" />
                Play demo
              </a>
              <a
                href="/provably-fair"
                onClick={() =>
                  trackEvent("cta_click", {
                    label: "featured_provably_fair",
                    cta_type: "anchor",
                  })
                }
                className="inline-flex items-center gap-1.5 font-SpaceGrotesk text-[12px] uppercase tracking-[0.06em] !text-cyan transition-colors hover:!text-ink focus-visible:outline-none focus-visible:!text-cyan"
              >
                <ShieldCheck className="h-4 w-4" />
                Verify a round
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
