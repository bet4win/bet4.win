"use client";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock } from "./Icons";
import { onceInView, prefersReducedMotion } from "@/app/lib/motion";
import { useTilt } from "@/app/lib/tilt";
import { slugFor } from "@/app/lib/slug";
import { SEASONS, seasonsFor } from "@/app/lib/seasons";

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

export default function GameCard({ game, ceiling, index }) {
  const live = isLive(game);
  const seasons = seasonsFor(game);
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
      // `border` without `border-line`: the resting colour is set by .b4w-card
      // in globals.css so that .b4w-card--live:hover can override it. A
      // border-line utility here would win on layer order alone — utilities beat
      // components whatever the specificity — and the hover warm never landed.
      className={`b4w-card b4w-bezel group relative flex h-full flex-col overflow-hidden rounded-2xl border bg-panel-high text-left ${
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
          // Opposite corner to the status pill, and SOLID where that one is
          // outlined. The two badges have to differ by more than hue — a reader
          // scanning a grid of twelve cards reads shape before colour. Not
          // aria-hidden: unlike the Live pill, this is information the card
          // states nowhere else.
          <span className="absolute left-2.5 top-2.5 inline-flex items-center rounded-full bg-accent px-2.5 py-1 font-SpaceGrotesk text-[10px] font-bold uppercase tracking-[0.1em] text-accent-ink shadow-[0_4px_14px_-4px_rgba(58,227,152,0.75)]">
            New
          </span>
        )}
        {/* Only the exceptions get a badge now.
            "Live" used to sit on every tile in the catalogue, because every
            title in it is live — a label that appears on all seventeen cards
            distinguishes none of them, and it was competing with the NEW chip
            opposite for the one corner a reader actually checks. What is left
            is the case that says something: a title that is NOT yet live says
            when it arrives. */}
        {!live && (
          <span
            className="absolute right-2.5 top-2.5 inline-flex items-center gap-1.5 rounded-full border border-line bg-bg/70 px-2.5 py-1 font-SpaceGrotesk text-[10px] uppercase tracking-[0.08em] text-muted backdrop-blur"
            aria-hidden="true"
          >
            <Clock className="h-3 w-3" />
            {game.status}
          </span>
        )}

        {/* Seasonal builds this title ships. The corner is the one the status
            pill would use, which is free on exactly the games that can have a
            season — an unreleased title has no build to dress. */}
        {live && seasons.length > 0 && (
          <span
            className="absolute right-2.5 top-2.5 inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-bg/70 px-2 py-1 backdrop-blur"
            // Named rather than aria-hidden: nothing else on the card says
            // this game has a seasonal build. The wrapper carries the whole
            // label, so the visible word below is not announced twice.
            aria-label={`Seasonal versions: ${seasons
              .map((id) => SEASONS[id].label)
              .join(", ")}`}
            role="img"
          >
            {seasons.map((id) => {
              const { Icon, tint } = SEASONS[id];
              return (
                <Icon key={id} className="h-3.5 w-3.5" style={{ color: tint }} />
              );
            })}
            {/* The word, once a card is wide enough to hold it. A glyph alone
                is a puzzle — a reader scanning the grid has to hover or open
                the page to find out what it means. Below md the card body is
                ~124px and there is no room, so the glyph goes back to
                carrying it alone; and past one season the names would be
                longer than the art, so they drop out there too. */}
            {seasons.length === 1 && (
              <span
                className="hidden font-SpaceGrotesk text-[10px] font-bold uppercase tracking-[0.1em] md:inline"
                style={{ color: SEASONS[seasons[0]].tint }}
              >
                {SEASONS[seasons[0]].label}
              </span>
            )}
          </span>
        )}
      </div>

      <div className="machined-surface flex flex-1 flex-col gap-3 p-4 md:p-5">
        <div className="flex items-start justify-between gap-2">
          {/* line-clamp-2, not truncate, and the size comes down with the card.
              Two columns on a 390px screen give the title a 124px box; at a flat
              1.15rem "Video Poker" needed 188px of it and a single clipped line
              rendered the catalogue's longest names as "VIDE…". Two lines of
              display face at 0.85rem fit every title in the catalogue, and the
              grid's h-full already equalises the rows. */}
          <h3 className="b4w-display !mb-0 line-clamp-2 text-[clamp(0.85rem,0.72rem+0.674vw,1.15rem)] !text-ink [text-wrap:balance]">
            {game.title}
          </h3>
          {live && (
            // xl, because that is the first width at which the card can spare
            // the 36px. The arrow only ever appears on hover, so below that it
            // was invisible on a phone and invisible on a tablet while still
            // holding the title's box open — which is what turned "Blackjack"
            // into "Blackja…" in the two-up and three-up grids.
            <ArrowRight
              className="hidden h-4 w-4 shrink-0 -translate-x-1 text-accent opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 xl:block"
              aria-hidden="true"
            />
          )}
        </div>

        {/* Mechanic family. Every game used to read "Originals", which told an
            operator nothing; these say what the player is actually asked to do.
            Off below md, with the RTP and volatility row underneath. On a phone
            the card body is ~124px wide, and four stacked facts in it is a spec
            sheet at thumbnail size. The art, the name and the ceiling are the
            pitch; the rest is on the game's own page, one tap away. */}
        {game.category && (
          <span className="-mt-1 hidden w-fit rounded-full border border-line bg-bg/60 px-1.5 py-0.5 font-SpaceGrotesk text-[9px] font-semibold uppercase tracking-[0.1em] text-muted md:inline-block">
            {game.category}
          </span>
        )}

        {game.maxMultiplier ? (
          // mt-auto below md, where the RTP row that used to carry it is hidden.
          // Without it the slack in a row collects under the last element, so a
          // card with a one-line title sat its figures 35px higher than the card
          // beside it — and the whole point of a grid of ceilings is that you can
          // read down the column. At md the figures row takes the job back.
          <div className="mt-auto md:mt-0">
            <p className="!mb-0 font-SpaceGrotesk text-[11px] uppercase tracking-[0.09em] text-faint">
              Max multiplier
            </p>
            {/* Gold: this is money. The chrome stays cool, the numbers don't. */}
            {/* The floor comes down to 0.95rem for the same reason the title's
                does: "1,000,000×" is ten glyphs, and at the old 1.15rem floor
                they measured 138px inside a 124px card body. */}
            <p className="!mb-0 mt-1 font-JetBrainsMono text-[clamp(0.95rem,0.65rem+1.1vw,1.65rem)] font-semibold !leading-none !tracking-[-0.02em] !text-accent tabular-nums">
              {fmt.format(counted)}
              <span className="ml-0.5 text-accent">×</span>
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
          <dl className="!mb-0 mt-auto hidden flex-wrap items-center gap-x-3.5 gap-y-1 border-t border-line/70 pt-3 font-SpaceGrotesk text-[11px] uppercase tracking-[0.05em] md:flex">
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
      {/* The tilt is published from HERE rather than from the <article> so that
          --tilt-* inherits down to everything the card is made of. */}
      <div ref={tiltRef} className="group relative h-full">
        {live ? (
          // The card is a real link so the game pages stay crawlable and
          // openable in a new tab. It used to have a "Play demo" button laid
          // over the artwork as a sibling — forced permanently visible on touch,
          // because there is no hover to reveal it — which put a glass pill over
          // every piece of key art in the grid. The card is one target again;
          // the demo is a full-width button on the page it opens.
          <Link
            href={`/games/${slugFor(game)}`}
            className="block h-full rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
            aria-label={`${game.title} — game details`}
          >
            {tile}
          </Link>
        ) : (
          tile
        )}
      </div>
    </div>
  );
}
