"use client";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import LobbyArt from "./LobbyArt";
import Wordmark from "./Wordmark";
import Reel from "./Reel";
import Weather from "./Weather";
import { ArrowLeft, ArrowRight, Pause, Play } from "./Icons";
import { liveCatalogue } from "@/app/lib/catalogue";
import { playDemo } from "@/app/lib/gameLauncher";
import { trackEvent } from "@/app/lib/analytics";
import { SEASONS } from "@/app/lib/seasons";
import { prefersReducedMotion } from "@/app/lib/motion";

// The seasons any live game ships a build for, in the order SEASONS lists them,
// each with how many games have it.
const SEASON_TABS = Object.keys(SEASONS)
  .map((id) => ({ id, count: liveCatalogue.filter((e) => e.art?.seasons?.[id]).length }))
  .filter((s) => s.count > 0);

// A game's art in the chosen season, or its standard art if it has no such build.
const artIn = (entry, season) => (season && entry.art?.seasons?.[season]) || entry.art;
const hasSeason = (entry, season) => Boolean(season && entry.art?.seasons?.[season]);

// The homepage's first screen, presented the way a games studio launches a
// title: the whole viewport is one game's own painted room, its cut-out hero at
// full height and its own wordmark as the title. Along the bottom is the lobby
// itself — every game as a full card — and picking one changes the room. The
// stage and the lobby are one thing: the lobby is how you choose what's on the
// stage. The company's pitch is the one line at the top; the games make the
// rest of the argument.
//
// The previous scene stays mounted underneath the incoming one, so a change
// fades from room to room rather than through black while the new picture
// loads.
//
// The season switch on the lobby dresses the whole lobby for a holiday: every
// game with that build swaps to its seasonal art, the rest step back, and the
// stage and its Play button follow. It is how the catalogue's seasonal builds
// are shown — one click turns the floor to Christmas.
// Pads the rail so its first card lines up with the page's content edge,
// while the row itself still runs to both edges of the screen.
const GUTTER = "max(1.25rem, calc((100vw - 1280px) / 2 + 3rem))";

// The size every title's LETTERS come out at on the stage (see <Wordmark>).
export const STAGE_LETTER = "clamp(40px, 3.4vw + 23px, 76px)";
// Capped at the copy column. Letting the widest titles (American Roulette,
// 10:1) run on into the room put them under the hero; inside the column they
// come out a little smaller instead, which reads better than half a word.
export const STAGE_WORDMARK_MAX = "min(640px, 100%)";

// How long each game holds the stage while the lobby tours itself.
const TOUR_MS = 7000;

export default function Stage({ initialSlug }) {
  const start = Math.max(0, liveCatalogue.findIndex((e) => e.slug === initialSlug));
  const [index, setIndex] = useState(start);
  const [season, setSeason] = useState(null);
  // The scene being faded away from, kept mounted underneath the new one.
  const [under, setUnder] = useState(null);
  // Which side the new game came from: +1 from the right, -1 from the left.
  const [dir, setDir] = useState(1);
  // The attract loop: on until the visitor takes over (picks anything), and
  // held while they're looking along the rail or the stage is off screen.
  const [touring, setTouring] = useState(true);
  const [railHover, setRailHover] = useState(false);
  const [inView, setInView] = useState(true);
  const sectionRef = useRef(null);
  const railRef = useRef(null);
  const held = railHover || !inView;

  useEffect(() => {
    if (prefersReducedMotion()) setTouring(false);
    const el = sectionRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.5 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Pointer parallax: the room drifts against the pointer and the hero with
  // it, eased toward the target each frame. Written straight to the section's
  // custom properties — nothing re-renders.
  const parallax = useRef({ x: 0, y: 0, tx: 0, ty: 0, raf: 0 });
  const tick = () => {
    const p = parallax.current;
    p.x += (p.tx - p.x) * 0.08;
    p.y += (p.ty - p.y) * 0.08;
    const el = sectionRef.current;
    if (el) {
      el.style.setProperty("--mx", p.x.toFixed(4));
      el.style.setProperty("--my", p.y.toFixed(4));
    }
    p.raf = Math.abs(p.tx - p.x) + Math.abs(p.ty - p.y) > 0.001 ? requestAnimationFrame(tick) : 0;
  };
  const aim = (tx, ty) => {
    const p = parallax.current;
    p.tx = tx;
    p.ty = ty;
    if (!p.raf) p.raf = requestAnimationFrame(tick);
  };
  useEffect(() => () => cancelAnimationFrame(parallax.current.raf), []);
  const onPointerMove = (e) => {
    if (e.pointerType !== "mouse" || prefersReducedMotion()) return;
    const r = e.currentTarget.getBoundingClientRect();
    aim(((e.clientX - r.left) / r.width) * 2 - 1, ((e.clientY - r.top) / r.height) * 2 - 1);
  };

  const entry = liveCatalogue[index];
  const { game, slug, line, max } = entry;
  const inSeason = hasSeason(entry, season);
  const art = artIn(entry, season);
  const look = `${slug}-${inSeason ? season : "standard"}`;

  // Selects the game at index `i` (and optionally a season) on the stage.
  const select = (i, nextSeason, via, nextDir = i >= index ? 1 : -1) => {
    if (via !== "auto") setTouring(false);
    if (i === index && nextSeason === season) return;
    setUnder(art.scene);
    setIndex(i);
    setSeason(nextSeason);
    setDir(nextDir);
    if (i !== index && via !== "auto") {
      trackEvent("stage_select", { game_title: liveCatalogue[i].game.title, via });
    }
    keepInView(i, via !== "auto");
  };

  // Steps through the games in the current season (all of them in Standard),
  // wrapping at either end.
  const step = (by, via = "arrow") => {
    const pool = liveCatalogue
      .map((e, i) => i)
      .filter((i) => !season || hasSeason(liveCatalogue[i], season));
    const at = pool.indexOf(index);
    const i = pool[(at + by + pool.length) % pool.length] ?? index;
    select(i, season, via, by);
  };

  // A season the current game doesn't ship moves the stage to the first game
  // that does, so the switch always shows a dressed room.
  const pickSeason = (id) => {
    trackEvent("stage_season", { season: id ?? "standard" });
    if (id && !hasSeason(entry, id)) {
      select(
        liveCatalogue.findIndex((e) => hasSeason(e, id)),
        id,
        "season",
        1,
      );
    } else {
      select(index, id, "season", 1);
    }
  };

  const keepInView = (i, page) => {
    // Keep the picked card in view along the rail. Computed rather than
    // scrollIntoView, which would also scroll the page vertically.
    const rail = railRef.current;
    const card = rail?.querySelector(`[data-i="${i}"]`);
    if (rail && card) {
      const pad = parseFloat(getComputedStyle(rail).paddingLeft) || 0;
      const left = card.offsetLeft - pad;
      const right = card.offsetLeft + card.offsetWidth - rail.clientWidth + pad;
      if (left < rail.scrollLeft) rail.scrollTo({ left, behavior: "smooth" });
      else if (right > rail.scrollLeft) rail.scrollTo({ left: right, behavior: "smooth" });
    }

    // Picked from below the fold (the rail can sit under it on a short
    // screen): bring the room into view, or the change happens off-screen.
    const top = sectionRef.current?.getBoundingClientRect().top ?? 0;
    if (page && top < -40) window.scrollTo({ top: window.scrollY + top, behavior: "smooth" });
  };

  const show = (i, via) => select(i, season, via);


  const figures = [
    ["RTP", game.rtp],
    ["Max win", max ?? "Set per operator"],
    ["Volatility", game.volatility],
  ].filter(([, v]) => v);

  return (
    <section
      ref={sectionRef}
      id="games"
      aria-label="The lobby"
      onPointerMove={onPointerMove}
      onPointerLeave={() => aim(0, 0)}
      style={{ "--dir": dir }}
      className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-bg"
    >
      {/* The room, oversized by the parallax's reach so its edges never show. */}
      <div aria-hidden="true" className="b4w-parallax-scene absolute -inset-6 -z-10 !w-auto">
        {under && (
          <Image
            key={`under-${under.src ?? under}`}
            src={under}
            alt=""
            fill
            sizes="100vw"
            className="object-cover"
          />
        )}
        <Image
          key={`scene-${look}`}
          src={art.scene}
          alt=""
          fill
          priority={index === start}
          sizes="100vw"
          className="b4w-stage-scene object-cover"
        />
      </div>
      {/* Darkens the copy side and melts the bottom into the page, so the
          strip and the lobby below read as one surface. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(8,9,14,0.9)_0%,rgba(8,9,14,0.55)_42%,rgba(8,9,14,0.08)_72%)] max-lg:bg-[linear-gradient(180deg,rgba(8,9,14,0.55)_0%,rgba(8,9,14,0.75)_55%)]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 -z-10 h-[42%] bg-gradient-to-t from-bg via-bg/70 to-transparent"
      />
      {/* Under the overlaid header, so the nav reads on any room. */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 -z-10 h-40 bg-gradient-to-b from-bg/85 to-transparent"
      />
      {inSeason && <Weather key={season} season={season} className="-z-10" />}

      {/* The page's heading, for search and screen readers. On screen the
          games carry the pitch; a line of company copy over a game's room read
          as a caption that belonged to neither. */}
      <h1 className="sr-only">
        Bet4.win: {liveCatalogue.length} provably fair originals for operators, on one
        integration. A new one every month.
      </h1>

      {/* Clears the overlaid header. */}
      <div className="h-[72px] md:h-[84px]" />

      <div className="mx-auto grid w-full max-w-[1280px] flex-1 items-center gap-6 px-5 md:px-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-8">
        <div key={`copy-${look}`} className="b4w-stage-copy relative z-10 order-2 flex min-w-0 flex-col items-start gap-4 pb-4 md:gap-5 lg:order-1 lg:py-2">
          {inSeason && (
            <p className="!mb-0 inline-flex items-center gap-2 font-Text text-[15px] font-semibold" style={{ color: SEASONS[season].tint }}>
              {React.createElement(SEASONS[season].Icon, { className: "h-4 w-4" })}
              {SEASONS[season].label} edition
            </p>
          )}
          <h2 className="!mb-0 w-full">
            <Wordmark
              art={art}
              alt={game.title}
              letter={STAGE_LETTER}
              maxWidth={STAGE_WORDMARK_MAX}
              glint="arrive"
              sizes="(min-width:768px) 680px, 90vw"
              className="drop-shadow-[0_8px_20px_rgba(0,0,0,0.6)]"
            />
          </h2>
          <p className="!mb-0 max-w-[30rem] font-Text !text-[clamp(0.9rem,0.78rem+0.5vw,1.05rem)] !font-medium !leading-[1.45] !text-ink">
            {line}
          </p>
          <dl className="!mb-0 flex flex-wrap gap-x-8 gap-y-3">
            {figures.map(([k, v]) => (
              <div key={k} className="flex flex-col">
                <dt className="order-2 font-Text text-[14px] text-ink/65">{k}</dt>
                <dd className="b4w-figure order-1 !mb-0 text-[clamp(1.15rem,0.9rem+1vw,1.4rem)] font-bold leading-tight text-ink">
                  <Reel value={v} />
                </dd>
              </div>
            ))}
          </dl>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <a
              href={`/games/${slug}`}
              onClick={(e) => {
                setTouring(false);
                if (playDemo(game, slug, "stage", inSeason ? season : null)) e.preventDefault();
              }}
              className="b4w-btn b4w-btn--primary b4w-btn--lg"
            >
              <Play className="h-4 w-4" />
              Play the demo
            </a>
            <Link href={`/games/${slug}`} className="b4w-btn b4w-btn--quiet b4w-btn--lg !px-0">
              About {game.title}
            </Link>
          </div>
        </div>

        <div className="b4w-parallax-hero relative order-1 h-[32svh] min-h-[200px] lg:order-2 lg:h-full lg:min-h-[420px]">
          <div className="b4w-float absolute inset-0">
            <Image
              key={`art-${look}`}
              src={art.art}
              alt=""
              fill
              priority={index === start}
              sizes="(min-width:992px) 55vw, 90vw"
              className="b4w-stage-hero object-contain drop-shadow-[0_30px_40px_rgba(0,0,0,0.6)] lg:p-[6%]"
            />
          </div>
        </div>
      </div>

      {/* The lobby. Full cards, not thumbnails: this is the catalogue an
          operator is buying, and the thing they choose with. */}
      <div className="relative pb-6 md:pb-8">
        <div className="mx-auto mb-1 flex max-w-[1280px] flex-wrap items-end justify-between gap-x-6 gap-y-3 px-5 md:px-12">
          <h2 className="!mb-0 font-Display text-[clamp(1.1rem,0.95rem+0.6vw,1.45rem)] font-extrabold !leading-none tracking-[-0.02em] !text-ink [font-stretch:125%]">
            The lobby
            <span className="b4w-figure ml-3 hidden font-Text text-[15px] font-medium tracking-normal text-ink/60 [font-stretch:100%] sm:inline">
              {liveCatalogue.length} games
            </span>
          </h2>

          {/* Dress the lobby for a season. */}
          {SEASON_TABS.length > 0 && (
            <div role="group" aria-label="Show the lobby in a season" className="order-3 flex w-full items-center gap-1 rounded-lg border border-white/15 bg-black/40 p-1 sm:order-none sm:w-auto">
              {[{ id: null, count: liveCatalogue.length }, ...SEASON_TABS].map(({ id, count }) => {
                const on = season === id;
                const meta = id ? SEASONS[id] : null;
                return (
                  <button
                    key={id ?? "standard"}
                    type="button"
                    onClick={() => pickSeason(id)}
                    aria-pressed={on}
                    className={`flex min-w-0 flex-1 items-center justify-center gap-1.5 rounded-md px-2 py-2 font-Text text-[13px] font-semibold transition-colors sm:flex-none sm:gap-2 sm:px-3 sm:text-[14px] ${
                      on ? "bg-white text-bg" : "text-ink/75 hover:bg-white/10 hover:text-ink"
                    }`}
                  >
                    {meta &&
                      React.createElement(meta.Icon, {
                        className: "b4w-glyph h-4 w-4",
                        style: { color: on ? undefined : meta.tint },
                      })}
                    {meta ? meta.label : "Standard"}
                    {meta && <span className={`b4w-figure hidden text-[12px] sm:inline ${on ? "text-bg/60" : "text-ink/50"}`}>{count}</span>}
                  </button>
                );
              })}
            </div>
          )}

          <div className="flex items-center gap-2">
            <Link href="/games" className="b4w-btn b4w-btn--quiet mr-2 hidden lg:inline-flex">
              See them all
            </Link>
            <button
              type="button"
              onClick={() => setTouring((t) => !t)}
              aria-pressed={touring}
              aria-label={touring ? "Stop the lobby tour" : "Tour the lobby"}
              title={touring ? "Stop the lobby tour" : "Tour the lobby"}
              className="b4w-btn b4w-btn--ghost b4w-btn--icon !border-white/25"
            >
              {touring ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 translate-x-px" />}
            </button>
            <button
              type="button"
              onClick={() => step(-1)}
              aria-label="Previous game"
              className="b4w-btn b4w-btn--ghost b4w-btn--icon !border-white/25"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => step(1)}
              aria-label="Next game"
              className="b4w-btn b4w-btn--ghost b4w-btn--icon !border-white/25"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <ul
          ref={railRef}
          aria-label="Choose a game"
          onPointerEnter={() => setRailHover(true)}
          onPointerLeave={() => setRailHover(false)}
          className="!mb-0 flex list-none gap-3 overflow-x-auto pb-2 pt-5 [scrollbar-width:none] md:gap-4"
          style={{ paddingInline: GUTTER, scrollPaddingInline: GUTTER }}
        >
          {liveCatalogue.map((e, i) => {
            const on = i === index;
            // Out of season: still pickable, but stepped back so the dressed
            // games read as the set.
            const off = season && !hasSeason(e, season) && !on;
            return (
              <li key={e.slug} className="b4w-deal relative shrink-0" style={{ "--i": i }}>
                <button
                  type="button"
                  data-i={i}
                  onClick={() => show(i, "lobby")}
                  aria-pressed={on}
                  aria-label={e.game.title}
                  className={`group block w-[128px] rounded-xl text-left transition-[transform,opacity] duration-300 sm:w-[148px] lg:w-[158px] ${
                    on
                      ? "-translate-y-3 opacity-100"
                      : off
                        ? "opacity-25 grayscale hover:opacity-60 focus-visible:opacity-60"
                        : "opacity-60 hover:-translate-y-1.5 hover:opacity-100 focus-visible:opacity-100"
                  } focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand`}
                >
                  <LobbyArt
                    entry={e}
                    season={season}
                    sizes="160px"
                    className={`transition-shadow duration-300 ${
                      on
                        ? "shadow-[0_0_0_2px_#fff,0_18px_40px_-12px_rgba(0,0,0,0.9)]"
                        : "shadow-[0_10px_30px_-14px_rgba(0,0,0,0.9)]"
                    }`}
                  />
                </button>
                {/* The tour's clock, in the gap the lifted card leaves. */}
                {on && touring && (
                  <span aria-hidden="true" className="absolute inset-x-2 bottom-[3px] h-[2px] overflow-hidden rounded-full bg-white/20">
                    <span
                      key={look}
                      className="b4w-autoplay-bar block h-full bg-white"
                      style={{ "--autoplay-ms": `${TOUR_MS}ms` }}
                      data-paused={held ? "" : undefined}
                      onAnimationEnd={() => step(1, "auto")}
                    />
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
