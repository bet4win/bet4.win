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
  const deckRef = useRef(null);
  const swipedRef = useRef(false);
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

  // Swipe. The deck is a hand of cards, so on a phone the obvious thing to do
  // to it is push one aside — and until this, the only way to move it was to hit
  // a neighbour, which is a small target sitting right next to the big one you
  // are trying not to hit.
  //
  // The cards travel with the finger rather than waiting for the gesture to end
  // and then jumping. `touch-action: pan-y pinch-zoom` on the stage is what makes
  // that safe: the browser keeps scrolling and zooming for itself and hands us
  // the horizontal axis only, so there is no preventDefault anywhere here and no
  // way for this to trap the page.
  //
  // LISTENS ON THE STAGE, WRITES TO THE DECK. The deck is `pointer-events: none`
  // so that a click aimed at a neighbour reaches it instead of being swallowed by
  // the empty parent sitting in front of it (see .b4w-deck in globals.css) — and
  // an element that is not a hit target cannot be the one you start a drag on.
  // Hanging the gesture on the stage is not a workaround for that but a better
  // surface anyway: the whole column swipes, including the corners of the deck
  // where the shorter neighbours do not reach and the slivers of card that
  // overhang the deck's own box.
  //
  // Nothing to collide with up there. useTilt is bound to this same element but
  // bails out unless (hover: hover) and (pointer: fine), and this is touch and
  // pen only, so the two never see the same pointermove.
  useEffect(() => {
    const stage = stageRef.current;
    const deck = deckRef.current;
    if (!stage || !deck || LIVE.length < 2) return;

    let g = null; // the gesture in flight
    // --drag and data-dragging stay on the deck: they inherit to the cards and
    // key the rule that drops their transition mid-swipe.
    const offset = (px) => deck.style.setProperty("--drag", `${Math.round(px)}px`);

    const release = (dir) => {
      if (!g) return;
      const swiped = g.axis === "x";
      g = null;
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onCancel);
      if (!swiped) return;
      // The click the browser fires after the finger lifts is still coming, and
      // it lands on whatever card the swipe started on. Mark it for swallowing
      // (see onClick) or every swipe also launches a game.
      swipedRef.current = true;
      deck.removeAttribute("data-dragging");
      offset(0);
      setPaused(false);
      if (dir) setIndex((i) => (i + dir + LIVE.length) % LIVE.length);
    };

    const onMove = (e) => {
      if (!g || e.pointerId !== g.id) return;
      const dx = e.clientX - g.x;
      const dy = e.clientY - g.y;

      // Which axis this is gets decided once, at the first movement big enough
      // to have a direction, and is never revisited — a gesture that began as a
      // scroll must not become a swipe halfway down the page.
      if (!g.axis) {
        if (Math.abs(dx) < 10 && Math.abs(dy) < 10) return;
        if (Math.abs(dy) >= Math.abs(dx)) return release(0);
        g.axis = "x";
        deck.setAttribute("data-dragging", "");
        setPaused(true);
      }

      g.dx = dx;
      offset(dx);
    };

    const onUp = (e) => {
      if (!g || e.pointerId !== g.id) return;
      // Distance OR speed: a deliberate drag past a fifth of the deck, or a
      // flick that never travelled far because it was over so quickly.
      // Measured against the deck, not the stage the listener is on — the
      // threshold is calibrated to the width of the cards being moved, and the
      // stage is wider than they are.
      const far = Math.abs(g.dx) > deck.offsetWidth * 0.18;
      const fast = Math.abs(g.dx) > 24 && e.timeStamp - g.t < 300;
      release(far || fast ? (g.dx < 0 ? 1 : -1) : 0);
    };

    // Not `release` itself: the event would arrive as `dir` and a PointerEvent
    // is truthy.
    const onCancel = () => release(0);

    const onDown = (e) => {
      swipedRef.current = false;
      if (g || e.pointerType === "mouse") return;
      g = { id: e.pointerId, x: e.clientX, y: e.clientY, dx: 0, t: e.timeStamp, axis: null };
      // On window, not the stage: a finger routinely leaves a 460px-wide deck
      // mid-swipe, and listeners on the element stop hearing it the moment it
      // does — including the pointerup that would end the gesture.
      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerup", onUp);
      window.addEventListener("pointercancel", onCancel);
    };

    const onClick = (e) => {
      if (!swipedRef.current) return;
      swipedRef.current = false;
      e.preventDefault();
      e.stopPropagation();
    };

    stage.addEventListener("pointerdown", onDown);
    stage.addEventListener("click", onClick, true);
    return () => {
      stage.removeEventListener("pointerdown", onDown);
      stage.removeEventListener("click", onClick, true);
      release(0);
    };
  }, []);

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

  // Opacity per distance from centre. Size and paint order are no longer set
  // here: the deck is a real 3D rendering context now, so a card's size is what
  // the perspective does to it at its depth and its paint order is what the
  // browser works out from that. Both are then continuous through a move, which
  // an integer z-index can never be. See .b4w-deck in globals.css.
  const OPACITY = { 0: 1, 1: 0.45, 2: 0 };

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
            "radial-gradient(circle at 30% 28%, rgba(33,105,222,0.30), transparent 55%), radial-gradient(circle at 74% 72%, rgba(58,227,152,0.14), transparent 52%)",
        }}
      />

      <div ref={deckRef} className="b4w-deck relative mx-auto max-w-[460px]">
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
          return (
            <div
              key={game.id}
              // Only the ghost ring is hidden from assistive tech. The side
              // cards are real controls now, and aria-hidden on something
              // focusable is a trap rather than a tidy-up.
              aria-hidden={role === "ghost" ? true : undefined}
              data-role={role}
              className="b4w-cover"
              style={{ "--o": offset, "--d": distance, "--op": OPACITY[distance] }}
            >
              {/* The pointer tilt is applied HERE rather than to .b4w-cover, so
                  that the card's slot placement and its tilt are two separate
                  transforms on two separate elements. See the note on
                  .b4w-cover-tilt in globals.css for what sharing one cost. */}
              <div className="b4w-cover-tilt">
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
                  // The neighbours are the controls. Clicking the one on the
                  // left steps back, the one on the right steps forward — which
                  // is what the layout already implies, so the arrows and the
                  // NN/17 counter were spelling out something the deck said
                  // better.
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
          // Forced visible where there is no hover, the same way the catalogue
          // cards do it. Without this the deck's centre card carried no visible
          // affordance at all on a phone: it is the page's LCP element and it
          // looked like a picture rather than the button it is.
          <span className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100 max-md:opacity-100">
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
            // Dropped under 360px. The chip is shrink-0 and the title is not, so
            // on the narrowest phones it took the caption down to 54px and
            // line-clamp cut single-word titles like "Diamonds" in half. Between
            // the name of the game and the family it belongs to, the name wins.
            <span className="hidden shrink-0 rounded-full border border-line bg-bg/60 px-2 py-0.5 font-SpaceGrotesk text-[9px] font-semibold uppercase tracking-[0.1em] text-muted min-[360px]:inline-block">
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
