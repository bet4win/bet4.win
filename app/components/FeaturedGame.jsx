"use client";
import React from "react";
import Image from "next/image";
import { games } from "@/data/games";
import { Play } from "./Icons";
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
  const { headline, body, stats } = game.featured;

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

        {/* items-stretch, not items-center: the art fills whatever height the
            copy needs instead of setting the card's height itself. Combined with
            a wider copy column (fewer wrapped lines) this is what keeps the card
            short — previously the copy ran to 406px and the art to 377px. */}
        <div className="flex flex-col gap-6 px-5 pb-7 pt-6 md:px-8 md:pb-8 md:pt-8 lg:flex-row lg:items-stretch lg:gap-10 lg:px-10">
          {/* Key art. object-top so the crop takes it off the bottom of the
              frame — the ring floor — and never off the wordmark. */}
          <div className="relative aspect-[16/9] w-full shrink-0 overflow-hidden rounded-xl border border-line shadow-2xl lg:aspect-auto lg:min-h-[252px] lg:w-[46%]">
            <Image
              src={banner}
              alt={`${game.title} — key art`}
              fill
              sizes="(min-width:992px) 545px, 92vw"
              className="object-cover object-top"
            />
          </div>

          {/* Pitch */}
          <div className="flex w-full flex-col gap-4">
            <div>
              <h2
                id="featured-heading"
                className="b4w-display !text-[clamp(1.9rem,1.2rem+2.1vw,2.75rem)] !text-ink"
              >
                {game.title}
              </h2>
              <p className="mt-2.5 font-SpaceGrotesk !text-[1.05rem] !font-semibold !leading-[1.3] !tracking-[-0.01em] !text-ink">
                {headline}
              </p>
            </div>

            <p className="font-SpaceGrotesk text-[0.95rem] leading-[1.55] text-muted">
              {body}
            </p>
          </div>
        </div>



        {/* Card footer: the figures an operator screens on, and the one action.
            Its own padding rather than the body's, and a full-bleed rule across
            the panel — <footer> inside a <section> is scoped, so it does not
            register as a second contentinfo landmark alongside the site footer. */}
        <footer className="flex flex-col gap-5 bg-panel-low/70 px-5 py-4 md:flex-row md:items-center md:justify-between md:px-8 lg:px-10">
          {/* Label beside the value rather than stacked beneath it — halves the
              strip's height, which was the single biggest saving in the footer. */}
          <dl className="flex flex-wrap items-baseline gap-x-8 gap-y-2">
            {stats.map((s) => (
              // order swaps them visually so the value reads first, while the
              // DOM keeps dt = term (label) and dd = description (value).
              <div key={s.label} className="flex items-center gap-2">
                <dt className="order-2 font-SpaceGrotesk text-[11px] uppercase tracking-[0.06em] text-muted">
                  {s.label}
                </dt>
                <dd className="!mb-0 order-1 font-JetBrainsMono text-[1.15rem] font-semibold leading-none !text-cyan tabular-nums">
                  {s.value}
                </dd>
              </div>
            ))}
          </dl>

          <a
            href="#games"
            onClick={play}
            className="b4w-sheen inline-flex shrink-0 items-center justify-center gap-2.5 rounded-md bg-brand-strong px-6 py-3 font-SpaceGrotesk text-[14px] font-semibold uppercase tracking-[0.04em] !text-white shadow-[0_0_26px_-4px_rgba(37,99,235,0.5)] transition-colors hover:bg-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-panel-low"
          >
            <Play className="h-4 w-4" />
            Play demo
          </a>
        </footer>
      </div>
    </section>
  );
}
