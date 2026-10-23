"use client";
import React, { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Play } from "./Icons";
import { liveCatalogue } from "@/app/lib/catalogue";
import { playDemo } from "@/app/lib/gameLauncher";
import { trackEvent } from "@/app/lib/analytics";

// The homepage's first screen, presented the way a games studio launches a
// title: the whole viewport is one game's own painted room, its cut-out hero at
// full height and its own wordmark as the title. The strip along the bottom is
// the catalogue — pick a tile and the room changes. The company's pitch is the
// one line at the top; the games make the rest of the argument.
//
// The previous scene stays mounted underneath the incoming one, so a change
// fades from room to room rather than through black while the new picture
// loads.
export default function Stage({ initialSlug }) {
  const start = Math.max(0, liveCatalogue.findIndex((e) => e.slug === initialSlug));
  const [index, setIndex] = useState(start);
  const [prevIndex, setPrevIndex] = useState(null);
  const stripRef = useRef(null);

  const entry = liveCatalogue[index];
  const prev = prevIndex === null ? null : liveCatalogue[prevIndex];
  const { game, slug, art, line, max } = entry;

  const show = (next, via) => {
    const i = (next + liveCatalogue.length) % liveCatalogue.length;
    if (i === index) return;
    setPrevIndex(index);
    setIndex(i);
    trackEvent("stage_select", { game_title: liveCatalogue[i].game.title, via });
    stripRef.current
      ?.querySelector(`[data-i="${i}"]`)
      ?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "nearest" });
  };

  const figures = [
    ["RTP", game.rtp],
    ["Max win", max ?? "Set per operator"],
    ["Volatility", game.volatility],
  ].filter(([, v]) => v);

  return (
    <section
      aria-label="Featured games"
      className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-bg"
    >
      {prev && (
        <Image
          key={`under-${prev.slug}`}
          src={prev.art.scene}
          alt=""
          fill
          sizes="100vw"
          className="-z-20 object-cover"
        />
      )}
      <Image
        key={`scene-${slug}`}
        src={art.scene}
        alt=""
        fill
        priority={index === start}
        sizes="100vw"
        className="b4w-stage-fade -z-10 object-cover"
      />
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

      {/* Clears the overlaid header. */}
      <div className="h-[76px] md:h-[92px]" />

      <div className="mx-auto grid w-full max-w-[1280px] flex-1 items-center gap-6 px-5 md:px-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-8">
        <div key={`copy-${slug}`} className="b4w-stage-rise order-2 flex flex-col items-start gap-5 pb-6 md:gap-6 lg:order-1 lg:py-10">
          <h1 className="!mb-0 max-w-[34rem] font-Text !text-[clamp(0.8rem,0.7rem+0.35vw,0.95rem)] !font-medium !leading-snug !text-ink/85">
            {liveCatalogue.length} provably fair originals for operators, on one
            integration. A new one every month.
          </h1>
          <h2 className="!mb-0">
            <Image
              src={art.wordmark}
              alt={game.title}
              sizes="(min-width:768px) 520px, 80vw"
              className="h-auto max-h-[clamp(70px,12vw,150px)] w-auto max-w-[min(520px,100%)] object-contain object-left drop-shadow-[0_8px_20px_rgba(0,0,0,0.6)]"
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
                  {v}
                </dd>
              </div>
            ))}
          </dl>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <a
              href={`/games/${slug}`}
              onClick={(e) => {
                if (playDemo(game, slug, "stage")) e.preventDefault();
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

        <div className="relative order-1 h-[34svh] min-h-[220px] lg:order-2 lg:h-full lg:min-h-[520px]">
          <Image
            key={`art-${slug}`}
            src={art.art}
            alt=""
            fill
            priority={index === start}
            sizes="(min-width:992px) 55vw, 90vw"
            className="b4w-stage-pop object-contain drop-shadow-[0_30px_40px_rgba(0,0,0,0.6)] lg:p-[6%]"
          />
        </div>
      </div>

      {/* The catalogue as the channel strip. */}
      <div className="mx-auto w-full max-w-[1280px] px-5 pb-6 md:px-12 md:pb-8">
        <div className="mb-3 flex items-center justify-between gap-4 font-Text text-[14px] text-ink/70">
          <span className="b4w-figure" aria-live="polite">
            {game.title} · {index + 1} of {liveCatalogue.length}
          </span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => show(index - 1, "arrow")}
              aria-label="Previous game"
              className="b4w-btn b4w-btn--ghost b4w-btn--icon !border-white/25"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => show(index + 1, "arrow")}
              aria-label="Next game"
              className="b4w-btn b4w-btn--ghost b4w-btn--icon !border-white/25"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
        <ul
          ref={stripRef}
          aria-label="Choose a game"
          className="!mb-0 -mx-5 flex list-none gap-2 overflow-x-auto px-5 py-1 [scrollbar-width:none] md:mx-0 md:px-0"
        >
          {liveCatalogue.map((e, i) => {
            const on = i === index;
            return (
              <li key={e.slug} className="shrink-0">
                <button
                  type="button"
                  data-i={i}
                  onClick={() => show(i, "strip")}
                  aria-pressed={on}
                  aria-label={e.game.title}
                  className={`relative block h-[52px] w-[52px] overflow-hidden rounded-md transition-[opacity,outline-color] duration-200 md:h-[60px] md:w-[60px] ${
                    on
                      ? "opacity-100 outline outline-2 outline-offset-2 outline-white"
                      : "opacity-50 outline-none hover:opacity-100 focus-visible:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand"
                  }`}
                >
                  <Image src={e.game.image} alt="" fill sizes="60px" className="object-cover" />
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
