"use client";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock, Play } from "./Icons";
import { onceInView, prefersReducedMotion } from "@/app/lib/motion";

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
  const [revealed, setRevealed] = useState(false);
  const counted = useCountUp(game.maxMultiplier, revealed);

  useEffect(() => onceInView(ref.current, () => setRevealed(true)), []);

  const tile = (
    <article
      className={`b4w-card b4w-bezel group relative flex h-full flex-col overflow-hidden rounded-xl border border-line bg-panel text-left ${
        live ? "b4w-card--live" : ""
      }`}
    >
      <div className="relative aspect-square overflow-hidden">
        <Image
          src={game.image}
          alt={game.title}
          fill
          sizes="(min-width:992px) 300px, (min-width:768px) 31vw, 46vw"
          className={`object-cover !rounded-b-[0] transition-transform duration-500 ease-out ${
            live ? "group-hover:scale-[1.06]" : "grayscale"
          }`}
        />
        {/* Grounds the art into the card body so the seam doesn't read as a cut */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-panel to-transparent" />
        <span
          className={`absolute right-2.5 top-2.5 inline-flex items-center gap-1.5 rounded-md border px-2 py-1 font-SpaceGrotesk text-[11px] uppercase tracking-[0.05em] backdrop-blur ${
            live ? "border-line bg-bg/70 text-cyan" : "border-line bg-bg/70 text-muted"
          }`}
          aria-hidden="true"
        >
          {live ? (
            <>
              <span className="h-1.5 w-1.5 rounded-full bg-brand-strong b4w-pulse" />
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
          <h3 className="b4w-display !mb-0 text-[1.15rem] !text-ink">
            {game.title}
          </h3>
          {live && (
            <ArrowRight
              className="h-4 w-4 shrink-0 -translate-x-1 text-cyan opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
              aria-hidden="true"
            />
          )}
        </div>

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
      {live ? (
        // The card is a real link so the game pages are crawlable and openable
        // in a new tab; the demo button sits alongside it rather than inside,
        // since a <button> nested in an <a> is invalid and un-clickable.
        <div className="group relative h-full">
          <Link
            href={`/games/${game.title.toLowerCase()}`}
            className="block h-full rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
            aria-label={`${game.title} — game details`}
          >
            {tile}
          </Link>
          <button
            type="button"
            onClick={() => onLaunch(game)}
            aria-label={`Play ${game.title} demo`}
            // Top-left: the status badge already owns the top-right corner.
            // Always visible on touch, where there is no hover to reveal it.
            className="absolute left-2.5 top-2.5 z-10 flex h-9 w-9 items-center justify-center rounded-md border border-cyan/50 bg-brand-strong text-black opacity-0 shadow-[0_0_20px_-4px_rgba(37,99,235,0.7)] transition-all duration-300 hover:bg-brand focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand group-hover:opacity-100 max-md:opacity-100"
          >
            <Play className="h-4 w-4" />
          </button>
        </div>
      ) : (
        tile
      )}
    </div>
  );
}
