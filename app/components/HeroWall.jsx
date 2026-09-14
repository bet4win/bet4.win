"use client";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { games } from "@/data/games";
import { useTilt } from "@/app/lib/tilt";
import { prefersReducedMotion } from "@/app/lib/motion";
import { launchGame } from "@/app/lib/gameLauncher";
import { trackEvent } from "@/app/lib/analytics";
import { slugFor } from "@/app/lib/slug";
import { Play } from "./Icons";

const LIVE = games.filter((g) => g.status === "active");
const ADVANCE_MS = 4500;

// Matches the catalogue cards — Dragon's ceiling is 251658.24 and rendering the
// pennies made the hero and the grid disagree about the same number.
const fmt = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });

// One game at a time, centre stage, with its neighbours turned away behind it.
//
// Replaces the static six-tile wall the hero used to carry. A grid of thumbnails
// shows that a catalogue exists; a deck that deals one card at a time shows the
// catalogue, one title actually getting looked at. The whole deck also tilts
// toward the pointer, so it reads as an object rather than a slideshow.
//
// Only the centre card is exposed to assistive tech and the tab order — the
// neighbours are the same content a moment earlier or later, and announcing
// three copies of a carousel is how carousels get a bad name.
export default function HeroWall() {
  const stageRef = useRef(null);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);

  useTilt(stageRef, { max: 6, damp: 0.09 });

  useEffect(() => setReduced(prefersReducedMotion()), []);

  // Native listeners rather than React's onMouseEnter/onFocus props. React
  // synthesises enter/leave out of delegated mouseover/mouseout, and pairing it
  // with the pointer* listeners useTilt already binds to this same element made
  // the pause unreliable — it measurably did not fire. pointerenter/leave and
  // focusin/out are dispatched by the browser directly at the element, so there
  // is nothing to get out of sync.
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const hold = () => setPaused(true);
    const release = () => setPaused(false);
    el.addEventListener("pointerenter", hold);
    el.addEventListener("pointerleave", release);
    el.addEventListener("focusin", hold);
    el.addEventListener("focusout", release);
    return () => {
      el.removeEventListener("pointerenter", hold);
      el.removeEventListener("pointerleave", release);
      el.removeEventListener("focusin", hold);
      el.removeEventListener("focusout", release);
    };
  }, []);

  useEffect(() => {
    if (reduced || paused || LIVE.length < 2) return;
    const id = setInterval(
      () => setIndex((i) => (i + 1) % LIVE.length),
      ADVANCE_MS,
    );
    return () => clearInterval(id);
  }, [reduced, paused, index]);

  const go = (next) => setIndex(((next % LIVE.length) + LIVE.length) % LIVE.length);

  const centre = LIVE[index];

  // Five, not three. Only three are ever visible, but cards have to be mounted
  // *before* they are seen and stay mounted after they leave, or every advance
  // pops a card into existence at its final position with nothing to animate.
  // The outer ring sits at opacity 0, so a card fades up as it travels inward
  // and fades out as it leaves — the entrance and exit are the same transition
  // as the move.
  //
  // Keyed by game id, never by offset: React has to recognise a card as the
  // same DOM node at its new offset, otherwise it remounts and the transition
  // never runs. (Safe while the catalogue is larger than the ring; at 17 live
  // titles there is no chance of the same game appearing twice.)
  const deck = [-2, -1, 0, 1, 2].map((offset) => ({
    offset,
    game: LIVE[(index + offset + LIVE.length * 2) % LIVE.length],
  }));

  const STYLE = {
    0: { s: 1, op: 1, z: 3 },
    1: { s: 0.82, op: 0.45, z: 2 },
    2: { s: 0.64, op: 0, z: 1 },
  };

  const play = (e, game) => {
    trackEvent("game_launch", {
      game_id: game.id,
      game_title: game.title,
      source: "hero_deck",
    });
    // Anchor fallback: if the catalogue below hasn't mounted its launcher yet,
    // the click falls through and scrolls to #games instead of doing nothing.
    if (launchGame(slugFor(game))) e.preventDefault();
  };

  return (
    <div
      ref={stageRef}
      className="b4w-tilt-stage relative w-full flex-1"
      role="group"
      aria-roledescription="carousel"
      aria-label="Featured originals"
    >
      <div
        aria-hidden="true"
        className="b4w-drift pointer-events-none absolute -inset-10 -z-10 rounded-full opacity-70 blur-3xl"
        style={{
          background:
            "radial-gradient(circle at 30% 30%, rgba(37,99,235,0.24), transparent 55%), radial-gradient(circle at 70% 70%, rgba(129,140,248,0.17), transparent 55%)",
        }}
      />

      <div className="b4w-deck relative mx-auto max-w-[460px]">
        {/* Invisible sizer in normal flow: the deck's height comes from a real
            card, so it adapts to the caption instead of needing a magic aspect
            ratio that breaks the first time a title wraps. */}
        <div aria-hidden="true" className="invisible mx-auto w-[78%] sm:w-[68%]">
          <CardBody game={centre} />
        </div>

        {deck.map(({ offset, game }) => {
          const isCentre = offset === 0;
          const { s, op, z } = STYLE[Math.abs(offset)];
          return (
            <div
              key={game.id}
              aria-hidden={!isCentre}
              data-centre={isCentre ? "true" : "false"}
              className="b4w-cover"
              style={{ "--o": offset, "--s": s, "--op": op, "--z": z }}
            >
              {isCentre ? (
                <a
                  href="#games"
                  onClick={(e) => play(e, game)}
                  className="group block rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-4 focus-visible:ring-offset-bg"
                >
                  <CardBody game={game} interactive />
                </a>
              ) : (
                <CardBody game={game} />
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-5 flex items-center justify-center gap-4">
        {[
          { dir: -1, d: "M15 18l-6-6 6-6", label: "Previous game" },
          { dir: 1, d: "M9 6l6 6-6 6", label: "Next game" },
        ].map(({ dir, d, label }, i) => (
          <React.Fragment key={dir}>
            {i === 1 && (
              <p
                className="min-w-[4.5rem] text-center font-JetBrainsMono text-[11px] tabular-nums text-faint"
                aria-live="polite"
              >
                {String(index + 1).padStart(2, "0")} / {String(LIVE.length).padStart(2, "0")}
              </p>
            )}
            <button
              type="button"
              onClick={() => go(index + dir)}
              aria-label={label}
              className="flex h-9 w-9 items-center justify-center rounded-md border border-line text-muted transition-colors hover:border-brand/60 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d={d} />
              </svg>
            </button>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

function CardBody({ game, interactive = false }) {
  return (
    <div className="b4w-bezel overflow-hidden rounded-xl border border-line bg-panel">
      <div className="relative aspect-square overflow-hidden">
        <Image
          src={game.image}
          alt={interactive ? `${game.title} key art` : ""}
          fill
          sizes="(min-width:1024px) 320px, 62vw"
          className="b4w-cover-art object-cover"
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-panel to-transparent" />

        {game.isNew && (
          <span className="absolute left-2.5 top-2.5 inline-flex items-center rounded-md border border-new/45 bg-new/10 px-2 py-1 font-SpaceGrotesk text-[10px] font-semibold uppercase tracking-[0.08em] text-new backdrop-blur">
            New
          </span>
        )}

        {interactive && (
          <span className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
            <span className="flex items-center gap-2 rounded-md bg-brand-strong px-4 py-2.5 font-SpaceGrotesk text-[12px] font-semibold uppercase tracking-[0.05em] !text-white shadow-lg">
              <Play className="h-3.5 w-3.5" />
              Play demo
            </span>
          </span>
        )}
      </div>

      {/* Title gets its own line. Sharing it with the figures meant the longer
          names truncated to make room for a number, which is backwards — the
          name is the thing being advertised. */}
      <div className="flex flex-col gap-2 px-4 py-3">
        <div className="flex items-baseline justify-between gap-2">
          <p className="b4w-display !mb-0 truncate text-[0.85rem] !text-ink">
            {game.title}
          </p>
          {game.category && (
            <span className="shrink-0 rounded border border-line bg-bg/60 px-1.5 py-0.5 font-SpaceGrotesk text-[9px] font-semibold uppercase tracking-[0.1em] text-muted">
              {game.category}
            </span>
          )}
        </div>

        <dl className="!mb-0 flex items-baseline justify-between gap-3 border-t border-line/60 pt-2">
          {game.rtp && (
            <div className="flex items-baseline gap-1.5">
              <dt className="font-SpaceGrotesk text-[9px] uppercase tracking-[0.08em] text-faint">
                RTP
              </dt>
              <dd className="!mb-0 font-JetBrainsMono text-[11px] text-muted tabular-nums">
                {game.rtp}
              </dd>
            </div>
          )}
          {game.maxMultiplier && (
            <div className="flex items-baseline gap-1.5">
              <dt className="font-SpaceGrotesk text-[9px] uppercase tracking-[0.08em] text-faint">
                Max win
              </dt>
              <dd className="!mb-0 font-JetBrainsMono text-[12px] font-semibold !text-cyan tabular-nums">
                {fmt.format(game.maxMultiplier)}×
              </dd>
            </div>
          )}
        </dl>
      </div>
    </div>
  );
}
