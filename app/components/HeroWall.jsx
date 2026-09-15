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
        className="b4w-drift pointer-events-none absolute -inset-10 -z-10 rounded-full opacity-80 blur-3xl"
        style={{
          // Blue behind the deck, one mint patch low and right. The accent is the
          // only non-blue light in the hero and it is what makes the key art
          // read as lit rather than pasted on.
          background:
            "radial-gradient(circle at 30% 28%, rgba(51,88,230,0.30), transparent 55%), radial-gradient(circle at 74% 72%, rgba(58,227,152,0.14), transparent 52%)",
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
                  className="group block rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-4 focus-visible:ring-offset-bg"
                >
                  <CardBody game={game} interactive priority={index === 0} />
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

function CardBody({ game, interactive = false, priority = false }) {
  return (
    <div className="b4w-bezel relative overflow-hidden rounded-2xl border border-line bg-panel-high">
      {/* Portrait, not square — a playing card is taller than it is wide, and
          the deck reads as a hand of them rather than a row of thumbnails. The
          art is square and object-cover, so this crops the sides; every piece of
          key art centres its subject, so that lands safely. */}
      <div className="relative aspect-[3/4] overflow-hidden">
        <Image
          src={game.image}
          alt={interactive ? `${game.title} key art` : ""}
          fill
          sizes="(min-width:1024px) 320px, 62vw"
          // The deck is real content now, not the decorative wall this replaced,
          // so its centre card is the page's LCP element. Only the card that is
          // centre on first paint gets priority — preloading is a first-paint
          // concern, and flagging all five would preload four images nobody has
          // asked to see.
          priority={priority}
          className="b4w-cover-art object-cover"
        />
        {game.isNew && (
          <span className="absolute left-2.5 top-2.5 inline-flex items-center rounded-full bg-accent px-2.5 py-1 font-SpaceGrotesk text-[10px] font-bold uppercase tracking-[0.1em] text-accent-ink shadow-[0_4px_14px_-4px_rgba(58,227,152,0.75)]">
            New
          </span>
        )}

        {interactive && (
          <span className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
            <span className="b4w-btn b4w-btn--glass b4w-card-float">
              <Play className="h-3.5 w-3.5" />
              Play demo
            </span>
          </span>
        )}

      {/* Caption floats over the foot of the key art on frosted glass rather
          than sitting in a solid block beneath it. This is one of the few places
          on the site where backdrop-blur earns its keep — there is real artwork
          behind it to refract. The scrim under the blur is what keeps the type
          legible over the brighter pieces of art. */}
      <div className="absolute inset-x-0 bottom-0 border-t border-white/10 bg-gradient-to-t from-panel-high/95 to-panel-high/70 px-4 py-3 backdrop-blur-md">
        {/* Always visible: what the game is called and what kind it is. */}
        <div className="flex items-baseline justify-between gap-2">
          <p className="b4w-display !mb-0 line-clamp-2 text-[0.8rem] !leading-[1.15] !text-ink">
            {game.title}
          </p>
          {game.category && (
            <span className="shrink-0 rounded-full border border-line bg-bg/60 px-2 py-0.5 font-SpaceGrotesk text-[9px] font-semibold uppercase tracking-[0.1em] text-muted">
              {game.category}
            </span>
          )}
        </div>

        {/* The figures stay folded away until you show interest in this card.
            Collapsed by grid-template-rows 0fr -> 1fr, which is the one way to
            transition to an auto height without measuring it in JS. */}
        <div className="b4w-cover-detail">
          <div>
        <dl className="!mb-0 mt-2 flex items-baseline justify-between gap-3 border-t border-line/60 pt-2">
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
              <dd className="!mb-0 font-JetBrainsMono text-[12px] font-semibold !text-accent tabular-nums">
                {fmt.format(game.maxMultiplier)}×
              </dd>
            </div>
          )}
        </dl>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
