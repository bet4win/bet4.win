"use client";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { games } from "@/data/games";
import { useTilt, useGlare } from "@/app/lib/tilt";
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

  useTilt(stageRef, { max: 11, damp: 0.12 });

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
          const distance = Math.abs(offset);
          // centre — the one you can play. side — click it to bring it forward.
          // ghost — the invisible outer ring that exists only so cards have
          // somewhere to fade in from and out to.
          const role = distance === 0 ? "centre" : distance === 1 ? "side" : "ghost";
          const { s, op, z } = STYLE[distance];
          return (
            <div
              key={game.id}
              // Only the ghost ring is hidden from assistive tech. The side
              // cards are real controls now, and aria-hidden on something
              // focusable is a trap rather than a tidy-up.
              aria-hidden={role === "ghost" ? true : undefined}
              data-role={role}
              className="b4w-cover"
              style={{ "--o": offset, "--s": s, "--op": op, "--z": z }}
            >
              {role === "centre" && (
                <a
                  href="#games"
                  onClick={(e) => play(e, game)}
                  className="group block rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-4 focus-visible:ring-offset-bg"
                >
                  <CardBody game={game} interactive />
                </a>
              )}
              {role === "side" && (
                // The neighbours are the controls. Clicking the one on the left
                // steps back, the one on the right steps forward — which is what
                // the layout already implies, so the arrows and the NN/17
                // counter were spelling out something the deck said better.
                <button
                  type="button"
                  onClick={() => go(index + offset)}
                  aria-label={`Show ${game.title}`}
                  className="block w-full text-left focus-visible:outline-none"
                >
                  <CardBody game={game} />
                </button>
              )}
              {role === "ghost" && <CardBody game={game} />}
            </div>
          );
        })}
      </div>

    </div>
  );
}

function CardBody({ game, interactive = false }) {
  // Every card tracks the pointer against its own box; only the centre one ever
  // shows the result, via :hover in CSS. Cheaper than threading a ref down to
  // whichever card happens to be centre, and correct as the carousel advances.
  const ref = useRef(null);
  useGlare(ref);

  return (
    <div
      ref={ref}
      className="b4w-bezel relative overflow-hidden rounded-xl border border-line bg-panel-high"
    >
      {/* Recess — see the matching note in GameCard. The tile's surface and the
          key art are two separate things. */}
      <div className="relative aspect-square overflow-hidden bg-bg p-2.5">
        <div className="relative h-full w-full overflow-hidden rounded-lg border border-line/50">
          <Image
            src={game.image}
            alt={interactive ? `${game.title} key art` : ""}
            fill
            sizes="(min-width:1024px) 320px, 62vw"
            className="b4w-cover-art object-cover"
          />
        </div>

        {game.isNew && (
          <span className="absolute left-4 top-4 inline-flex items-center rounded-md border border-new/45 bg-new/10 px-2 py-1 font-SpaceGrotesk text-[10px] font-semibold uppercase tracking-[0.08em] text-new backdrop-blur">
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

      {/* Spans the bezel because that is the box useGlare measures --gx/--gy
          against; anchored to the smaller art well the light would land off
          the pointer. */}
      <span aria-hidden="true" className="b4w-glare" />
    </div>
  );
}
