"use client";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock, Play } from "./Icons";
import { onceInView, prefersReducedMotion } from "@/app/lib/motion";
import { useTilt } from "@/app/lib/tilt";
import { slugFor } from "@/app/lib/slug";

const isLive = (game) => game.status === "active";

const fmt = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });

// The catalogue's ceilings span five orders of magnitude (50x to 5,096,294x), so
// the bar is scaled logarithmically against the biggest game in the set. A linear
// bar would render every title except Mines as an invisible sliver.
export function magnitudePct(value, ceiling) {
  if (!value || value <= 1 || !ceiling || ceiling <= 1) return 0;
  return Math.max(6, Math.min(100, (Math.log10(value) / Math.log10(ceiling)) * 100));
}

// Counts from 0 up to `target` once `active` flips true. A climbing multiplier is
// what these games literally do, which is why this is the one piece of motion the
// catalogue spends its budget on.
function useCountUp(target, active) {
  // Starts at the true value so the server-rendered HTML carries the real number
  // for crawlers and no-JS readers; the jump to 0 happens under the reveal's
  // opacity fade, so it isn't visible.
  const [value, setValue] = useState(target);

  useEffect(() => {
    if (!active || !target || prefersReducedMotion()) return;
    let raf;
    let start;
    const DURATION = 900;
    const step = (now) => {
      start ??= now;
      const p = Math.min(1, (now - start) / DURATION);
      const eased = 1 - Math.pow(1 - p, 4); // decelerate hard, like a cash-out
      setValue(target * eased);
      if (p < 1) raf = requestAnimationFrame(step);
      else setValue(target);
    };
    setValue(0);
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [active, target]);

  return value;
}

export default function GameCard({ game, ceiling, index, onLaunch }) {
  const live = isLive(game);
  const ref = useRef(null);
  const tiltRef = useRef(null);
  const [revealed, setRevealed] = useState(false);
  const counted = useCountUp(game.maxMultiplier, revealed);

  useEffect(() => onceInView(ref.current, () => setRevealed(true)), []);

  // Slightly less throw than the hero deck — a card is a thing you are about to
  // click, and a surface that moves too far under the cursor is harder to hit —
  // but not so little that it reads as nothing. damp is higher than the deck's
  // because these are small surfaces and should feel taut rather than floaty.
  useTilt(tiltRef, { max: 9, damp: 0.18 });

  const tile = (
    <article
      className={`b4w-card b4w-bezel group relative flex h-full flex-col overflow-hidden rounded-xl border border-line bg-panel-high text-left ${
        live ? "b4w-card--live" : ""
      }`}
    >
      <div className="relative aspect-square overflow-hidden">
        <Image
          src={game.image}
          alt={game.title}
          fill
          sizes="(min-width:992px) 300px, (min-width:768px) 31vw, 46vw"
          // The hover zoom lives in CSS (.b4w-card--live:hover .b4w-card-art)
          // rather than as a Tailwind transform utility: it has to compose with
          // the pointer parallax on the same element, and a `transform` scale
          // easing up from 1 left a transparent gap at the art's edge for the
          // first half second of every hover.
          className={`b4w-card-art object-cover !rounded-b-[0] ${
            live ? "" : "grayscale"
          }`}
        />
        {/* Grounds the art into the card body so the seam doesn't read as a cut */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-panel-high to-transparent" />
        {game.isNew && (
          // Opposite corner to the status pill so the two read as separate
          // facts rather than a stack. Not aria-hidden — unlike the Live pill,
          // this is information the card states nowhere else.
          <span className="absolute left-2.5 top-2.5 inline-flex items-center rounded-md border border-new/45 bg-new/10 px-2 py-1 font-SpaceGrotesk text-[11px] font-semibold uppercase tracking-[0.08em] text-new backdrop-blur">
            New
          </span>
        )}
        <span
          className={`absolute right-2.5 top-2.5 inline-flex items-center gap-1.5 rounded-md border px-2 py-1 font-SpaceGrotesk text-[11px] uppercase tracking-[0.05em] backdrop-blur ${
            live
              ? "border-live/45 bg-bg/70 font-semibold text-live"
              : "border-line bg-bg/70 text-muted"
          }`}
          aria-hidden="true"
        >
          {live ? (
            <>
              {/* Emerald, not brand blue: "this is running" is a status, and it
                  should not read as the same signal as the cyan figures below
                  it. The two badges were previously cyan on cyan. */}
              <span className="h-1.5 w-1.5 rounded-full bg-live b4w-pulse" />
              Live
            </>
          ) : (
            <>
              <Clock className="h-3 w-3" />
              {game.status}
            </>
          )}
        </span>
      </div>

      <div className="machined-surface flex flex-1 flex-col gap-3 p-4 md:p-5">
        <div className="flex items-center justify-between gap-2">
          <h3 className="b4w-display !mb-0 truncate text-[1.15rem] !text-ink">
            {game.title}
          </h3>
          {live && (
            <ArrowRight
              className="h-4 w-4 shrink-0 -translate-x-1 text-cyan opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
              aria-hidden="true"
            />
          )}
        </div>

        {/* Mechanic family. Every game used to read "Originals", which told an
            operator nothing; these say what the player is actually asked to do. */}
        {game.category && (
          <span className="-mt-1 w-fit rounded border border-line bg-bg/60 px-1.5 py-0.5 font-SpaceGrotesk text-[9px] font-semibold uppercase tracking-[0.1em] text-muted">
            {game.category}
          </span>
        )}

        {game.maxMultiplier ? (
          <div>
            <p className="!mb-0 font-SpaceGrotesk text-[11px] uppercase tracking-[0.09em] text-faint">
              Max multiplier
            </p>
            {/* Gold: this is money. The chrome stays cool, the numbers don't. */}
            <p className="!mb-0 mt-1 font-JetBrainsMono text-[clamp(1.15rem,0.85rem+1.1vw,1.65rem)] font-semibold !leading-none !tracking-[-0.02em] !text-cyan tabular-nums">
              {fmt.format(counted)}
              <span className="ml-0.5 text-cyan">×</span>
            </p>
            <div
              className="mt-2.5 h-[4px] w-full overflow-hidden rounded-full bg-line/70"
              aria-hidden="true"
            >
              <span
                className="b4w-magnitude block h-full"
                style={{ "--w": `${magnitudePct(game.maxMultiplier, ceiling)}%` }}
                data-grown={revealed ? "" : undefined}
              />
            </div>
          </div>
        ) : (
          <p className="!mb-0 font-SpaceGrotesk text-[11px] uppercase tracking-[0.09em] text-faint">
            {live ? "Multiplier set per operator" : `Arriving ${game.status}`}
          </p>
        )}

        {/* Figures are per game; a title that doesn't carry them shows nothing
            rather than inheriting someone else's numbers. */}
        {(game.rtp || game.volatility) && (
          // flex-wrap rather than inline text: on narrow cards the volatility
          // moves to its own line as a unit instead of splitting mid-phrase.
          <dl className="!mb-0 mt-auto flex flex-wrap items-center gap-x-3.5 gap-y-1 border-t border-line/70 pt-3 font-SpaceGrotesk text-[11px] uppercase tracking-[0.05em]">
            {game.rtp && (
              <div className="flex items-baseline gap-1 whitespace-nowrap">
                <dt className="text-faint">RTP</dt>
                <dd className="!mb-0 text-muted">{game.rtp}</dd>
              </div>
            )}
            {game.volatility && (
              <div className="flex items-baseline gap-1 whitespace-nowrap">
                <dt className="text-faint">Volatility</dt>
                <dd className="!mb-0 text-muted">{game.volatility}</dd>
              </div>
            )}
          </dl>
        )}
      </div>

    </article>
  );

  return (
    <div
      ref={ref}
      className={`b4w-reveal h-full${revealed ? " is-revealed" : ""}`}
      // Staggered per column so a row appears to deal in from the left rather
      // than all twelve cards landing at once.
      style={{ transitionDelay: `${(index % 4) * 70}ms` }}
    >
      {/* The tilt is published from HERE, not from the <article>. The demo
          button has to be a sibling of the link (a <button> inside an <a> is
          invalid), so it sits outside the article and would inherit none of the
          --tilt-* properties. Hanging them on the common ancestor lets the card
          and the button read the same pointer. */}
      <div ref={tiltRef} className="group relative h-full">
        {live ? (
          <>
            {/* The card is a real link so the game pages stay crawlable and
                openable in a new tab. */}
            <Link
              href={`/games/${slugFor(game)}`}
              className="block h-full rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
              aria-label={`${game.title} — game details`}
            >
              {tile}
            </Link>

            {/* Centred over the art, matching the hero deck. The wrapper is a
                square pinned to the top so "centre" means the middle of the
                artwork rather than the middle of the whole card, caption
                included. It takes no pointer events so the link underneath stays
                clickable everywhere the button is not. */}
            <span className="pointer-events-none absolute inset-x-0 top-0 flex aspect-square items-center justify-center">
              <button
                type="button"
                onClick={() => onLaunch(game)}
                aria-label={`Play ${game.title} demo`}
                // Still forced visible on touch: without hover there is no other
                // way to reach the demo from the grid.
                className="b4w-card-float pointer-events-auto flex items-center gap-2 rounded-full border border-white/25 bg-bg/55 px-4 py-2 font-SpaceGrotesk text-[11px] font-semibold uppercase tracking-[0.05em] !text-white opacity-0 shadow-lg backdrop-blur-lg transition-opacity duration-300 hover:bg-bg/75 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand group-hover:opacity-100 max-md:opacity-100"
              >
                <Play className="h-3.5 w-3.5" />
                Play demo
              </button>
            </span>
          </>
        ) : (
          tile
        )}
      </div>
    </div>
  );
}
