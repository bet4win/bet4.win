"use client";
import React, { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { games } from "@/data/games";
import Section from "./Section";
import { ArrowRight, Play, Sparkle } from "./Icons";
import { launchGame } from "@/app/lib/gameLauncher";
import { trackEvent } from "@/app/lib/analytics";
import { slugFor } from "@/app/lib/slug";
import { useTilt } from "@/app/lib/tilt";

// Spotlight for one original.
//
// The card used to be a grey panel with a picture in it and a gradient painted
// behind — a layout that would have looked the same whichever game was in it.
// It is now lit by the game itself: the backdrop is that title's own play
// scene, already blurred in its marketing pack, so Punch's spotlight is a
// boxing gym out of focus and Roulette's would be a table. Everything in front
// of it is glass, because there is finally something behind the glass worth
// refracting.
//
// Everything it renders still comes from that game's `featured` block in
// data/games.js, so featuring next month's release is a data change.
export default function FeaturedGame({ slug }) {
  const cardRef = useRef(null);
  // A big surface, so a small throw. At the deck's 11deg a card this wide would
  // swing like a gate.
  useTilt(cardRef, { max: 4.5, damp: 0.1 });

  const game = games.find(
    (g) => g.status === "active" && slugFor(g) === slug && g.featured,
  );
  if (!game) return null;

  // Key art lives on the game itself (every game has it now); the `featured`
  // block only carries the spotlight's copy.
  const { headline, body, stats, eyebrow } = game.featured;

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
    <Section
      surface="base"
      rule
      aria-labelledby="featured-heading"
      innerClassName="pb-14 pt-14 md:pt-16"
    >
      <div
        ref={cardRef}
        className="relative isolate overflow-hidden rounded-[26px] border border-line/70 bg-panel-low"
      >
        {/* --- The room the game is played in, out of focus. ---------------- */}
        <Image
          src={game.backdrop}
          alt=""
          aria-hidden="true"
          fill
          sizes="(min-width:1280px) 1232px, 100vw"
          // Overscanned so the parallax shift never exposes an edge, and drifting
          // on the same 26s cycle as the rest of the page's atmosphere.
          className="b4w-spot-back b4w-drift scale-[1.18] object-cover"
        />

        {/* Scrim. A single left-weighted darkener, and no more than it takes:
            the source scene is already a dim room, and the first pass at this
            stacked a tint wash, a 95% black gradient and a vignette on top of
            each other until the backdrop was a black rectangle. The copy column
            needs a floor; the art side is allowed to keep its light. The stops
            are navy-black rather than neutral black, so the scrim belongs to
            the page's floor instead of greying the photograph out. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(100deg,rgba(4,7,16,0.93)_0%,rgba(5,9,22,0.8)_34%,rgba(6,12,30,0.52)_62%,rgba(5,9,22,0.72)_100%)]"
        />
        {/* Vignette — the card's own edges go dark so it reads as lit from
            inside rather than as a photograph cropped to a rectangle. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 shadow-[inset_0_0_90px_10px_rgba(3,5,13,0.75)]"
        />

        {/* A grid rather than nested flex columns, because the three blocks
            need two different orders. Down a phone the reading order is art →
            pitch → figures: the label and the title have to arrive before the
            numbers, or the reader meets "96%" with nothing to attach it to. On
            a wide screen the figures move up beside the art, under it, in the
            left column — they are facts about the picture, and the 16:9 crop
            can't be stretched to match a column of prose without cutting the
            wordmark in half, so the column gets filled from below instead. */}
        {/* grid-rows-[auto_1fr]: the pitch spans both rows, and any height it
            has over the art's would otherwise be split evenly between the two
            auto tracks — which left the figures floating in the middle of the
            left column with a 130px hole above them. The fr track takes the
            slack, and items-start keeps the tiles pinned under the art. */}
        <div className="relative grid gap-6 p-5 md:p-8 lg:grid-cols-[47%_1fr] lg:grid-rows-[auto_1fr] lg:items-start lg:gap-x-12 lg:gap-y-4 lg:p-11">
          {/* --- Key art ----------------------------------------------------- */}
          <div className="lg:col-start-1 lg:row-start-1">
            <div className="relative">
              {/* Halo. It breathes rather than sitting still, which is the only
                  reason a static piece of key art reads as switched on. */}
              {/* No z-index. The card is `isolate`, so a negative z would put
                  this behind the blurred backdrop inside that stacking context
                  and the halo would never be seen. Tree order is enough: this
                  is the first child of the frame's wrapper, so it paints under
                  the art and over the room. */}
              <div
                aria-hidden="true"
                className="b4w-breathe pointer-events-none absolute -inset-6 rounded-full bg-[radial-gradient(circle_at_50%_50%,rgba(58,227,152,0.24),transparent_62%)] blur-2xl"
              />
              <div className="b4w-spot-art group relative aspect-[16/9] overflow-hidden rounded-2xl border border-white/15 shadow-[0_30px_70px_-30px_rgba(0,0,0,1)]">
                <Image
                  src={game.banner}
                  alt={`${game.title} — key art`}
                  fill
                  sizes="(min-width:992px) 560px, 92vw"
                  priority
                  className="object-cover object-center"
                />
                {/* A lit top edge on the art itself, so it reads as a screen in
                    a cabinet rather than a photo pasted on. */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 rounded-2xl bg-[linear-gradient(180deg,rgba(255,255,255,0.16),transparent_28%)]"
                />
                <a
                  href="#games"
                  onClick={play}
                  aria-label={`Play the ${game.title} demo`}
                  className="absolute inset-0 flex items-center justify-center focus-visible:outline-none"
                >
                  <span className="b4w-btn b4w-btn--glass b4w-btn--lg b4w-spot-near opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-within:opacity-100 max-md:opacity-100">
                    <Play className="h-4 w-4" />
                    Play demo
                  </span>
                </a>
              </div>
            </div>
          </div>

          {/* --- Pitch ------------------------------------------------------- */}
          <div className="b4w-spot-near flex w-full flex-col items-start gap-5 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:self-center">
            {eyebrow && (
              <span className="inline-flex items-center gap-2 rounded-full border border-accent/35 bg-accent/10 px-3 py-1.5 font-SpaceGrotesk text-[10px] font-semibold uppercase tracking-[0.12em] text-accent backdrop-blur-md">
                <Sparkle className="h-3 w-3" />
                {eyebrow}
              </span>
            )}

            <div>
              <h2
                id="featured-heading"
                className="b4w-display !text-[clamp(2.2rem,1.3rem+2.6vw,3.4rem)] !text-ink"
              >
                {game.title}
              </h2>
              <p className="mt-3 max-w-lg font-SpaceGrotesk !text-[1.15rem] !font-semibold !leading-[1.28] !tracking-[-0.015em] !text-ink [text-wrap:balance]">
                {headline}
              </p>
            </div>

            <p className="!mb-0 max-w-xl font-SpaceGrotesk text-[0.95rem] leading-[1.6] text-muted">
              {body}
            </p>

            <div className="mt-1 flex flex-wrap items-center gap-3">
              <a
                href="#games"
                onClick={play}
                className="b4w-btn b4w-btn--primary b4w-btn--lg"
              >
                <Play className="h-4 w-4" />
                Play demo
              </a>
              <Link
                href={`/games/${slug}`}
                className="b4w-btn b4w-btn--ghost b4w-btn--lg"
              >
                Read the spec
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* --- The figures ------------------------------------------------- */}
          {/* Three frosted tiles rather than a row of text in a footer strip.
              Glass earns its keep here specifically because the game's own room
              is showing through it. */}
          <dl className="!mb-0 grid grid-cols-3 gap-2 lg:col-start-1 lg:row-start-2">
            {stats.map((s) => (
              // order swaps them visually so the value reads first, while the
              // DOM keeps dt = term (label) and dd = description (value).
              <div
                key={s.label}
                className="b4w-glass flex flex-col gap-1 rounded-xl border border-white/10 px-3.5 py-3"
              >
                <dd className="!mb-0 order-1 font-JetBrainsMono text-[1.3rem] font-semibold leading-none !text-accent tabular-nums">
                  {s.value}
                </dd>
                <dt className="order-2 font-SpaceGrotesk text-[10px] uppercase leading-tight tracking-[0.07em] text-muted">
                  {s.label}
                </dt>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </Section>
  );
}
