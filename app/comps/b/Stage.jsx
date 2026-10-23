"use client";
import React, { useState } from "react";
import logo from "@/public/assets/img/b4w-logo.svg";
import { catalogue } from "../data";

// COMP B — "The stage".
// The homepage is a launch screen, the way a game studio presents a title: the
// whole viewport is one game's own painted room, its cut-out key art at full
// height and its own wordmark as the headline. The strip along the bottom is
// the catalogue — pick a tile and the room changes. The company's pitch is one
// sentence at the top; the games make the rest of the argument.
export default function Stage() {
  const [active, setActive] = useState(catalogue[0]);

  return (
    <div className="bg-black font-Text text-white antialiased">
      <section className="relative flex min-h-[100svh] flex-col overflow-hidden">
        {/* The room. Keyed so each change remounts and fades in over the last. */}
        <img
          key={`bg-${active.slug}`}
          src={active.scene}
          alt=""
          className="comp-fade absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.82)_0%,rgba(0,0,0,0.45)_45%,rgba(0,0,0,0.05)_75%)]" />
        <div className="absolute inset-x-0 bottom-0 h-[45%] bg-gradient-to-t from-black via-black/60 to-transparent" />

        <nav className="relative z-10 mx-auto flex w-full max-w-[1320px] items-center justify-between px-6 py-6 md:px-12">
          <img src={logo.src} alt="Bet4.win" className="h-8 w-auto" />
          <p className="!mb-0 hidden text-[15px] text-white/80 lg:block">
            Provably fair originals for operators. {catalogue.length} live, one integration, a new one every month.
          </p>
          <span className="rounded-md bg-white px-4 py-2.5 text-[15px] font-bold text-black">
            Book a demo
          </span>
        </nav>

        <div className="relative z-10 mx-auto grid w-full max-w-[1320px] flex-1 items-center gap-8 px-6 md:px-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
          <div key={`copy-${active.slug}`} className="comp-rise flex flex-col items-start gap-6 py-10">
            <h1 className="!mb-0">
              <img
                src={active.wordmark}
                alt={active.title}
                className="h-auto max-h-[150px] w-auto max-w-[min(520px,100%)] object-contain object-left"
                style={{ filter: "drop-shadow(0 8px 20px rgba(0,0,0,0.6))" }}
              />
            </h1>
            <p className="!mb-0 max-w-[30rem] text-[20px] font-medium leading-[1.45] text-white">
              {active.line}
            </p>
            <dl className="!mb-0 flex gap-8">
              {[
                ["RTP", active.rtp],
                ["Max win", active.max ?? "Per operator"],
                ["Volatility", active.volatility],
              ]
                .filter(([, v]) => v)
                .map(([k, v]) => (
                  <div key={k} className="flex flex-col">
                    <dt className="order-2 text-[14px] text-white/60">{k}</dt>
                    <dd className="b4w-figure order-1 !mb-0 text-[26px] font-bold leading-tight text-white">
                      {v}
                    </dd>
                  </div>
                ))}
            </dl>
            <div className="flex items-center gap-6">
              <span className="rounded-md bg-white px-6 py-3.5 text-[17px] font-bold text-black">
                Play the demo
              </span>
              <span className="text-[17px] font-semibold underline decoration-white/50 underline-offset-[6px]">
                Game details
              </span>
            </div>
          </div>

          <div className="relative hidden h-full min-h-[520px] lg:block">
            <img
              key={`art-${active.slug}`}
              src={active.art}
              alt=""
              className="comp-pop absolute inset-0 m-auto max-h-[78%] max-w-[92%] object-contain"
              style={{ filter: "drop-shadow(0 30px 40px rgba(0,0,0,0.6))" }}
            />
          </div>
        </div>

        {/* The catalogue as the channel strip. */}
        <div className="relative z-10 mx-auto w-full max-w-[1320px] px-6 pb-6 md:px-12">
          <div className="mb-3 flex items-baseline justify-between text-[14px] text-white/70">
            <span>
              {catalogue.indexOf(active) + 1} of {catalogue.length}
            </span>
            <span>All games →</span>
          </div>
          <ul className="!mb-0 flex list-none gap-2 overflow-x-auto p-0 pb-1 [scrollbar-width:none]">
            {catalogue.map((g) => {
              const on = g.slug === active.slug;
              return (
                <li key={g.slug} className="shrink-0">
                  <button
                    type="button"
                    onClick={() => setActive(g)}
                    aria-pressed={on}
                    aria-label={g.title}
                    className={`block h-[58px] w-[58px] overflow-hidden rounded-md transition-[opacity,outline-color] duration-200 ${
                      on
                        ? "opacity-100 outline outline-2 outline-offset-2 outline-white"
                        : "opacity-55 hover:opacity-100"
                    }`}
                  >
                    <img src={g.image.src} alt="" className="h-full w-full object-cover" />
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <style>{`
        .comp-fade { animation: comp-fade .6s ease both; }
        .comp-rise { animation: comp-rise .5s cubic-bezier(.2,.7,.2,1) both; }
        .comp-pop { animation: comp-pop .6s cubic-bezier(.2,.7,.2,1) both; }
        @keyframes comp-fade { from { opacity: 0 } }
        @keyframes comp-rise { from { opacity: 0; transform: translateY(14px) } }
        @keyframes comp-pop { from { opacity: 0; transform: translateY(24px) scale(.96) } }
        @media (prefers-reduced-motion: reduce) { .comp-fade, .comp-rise, .comp-pop { animation: none } }
      `}</style>
    </div>
  );
}
