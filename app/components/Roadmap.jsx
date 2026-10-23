"use client";
import React from "react";
import Image from "next/image";
import Wordmark from "./Wordmark";
import { STAGE_LETTER, STAGE_WORDMARK_MAX } from "./Stage";
import { artFor } from "@/data/gameArt";
import Link from "next/link";
import { ArrowRight } from "./Icons";
import { trackEvent } from "@/app/lib/analytics";
import { liveCatalogue } from "@/app/lib/catalogue";

// Roadmap ids are the games' URL slugs, so a delivered title can link to its
// own page once it is in the live catalogue.
const isLive = (id) => liveCatalogue.some((e) => e.slug === id);

// What ships next, presented the way the live games are: the next title in its
// own scene, with its own hero and wordmark, because its marketing pack exists
// before it launches. The rest of the public schedule follows as a dated list.
//
// A title with no art yet falls back to its name set in type — nothing here
// draws a placeholder for artwork that hasn't been approved.
export default function Roadmap({ releases }) {
  if (!releases?.length) return null;

  const next = releases.find((r) => r.isNext);
  const art = next ? artFor(next.id) : null;
  const rest = releases.filter((r) => r !== next);

  return (
    <section id="roadmap" aria-labelledby="roadmap-heading" className="relative isolate overflow-hidden bg-bg">
      {art && (
        <>
          <Image src={art.scene} alt="" fill sizes="100vw" className="-z-10 object-cover" />
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(8,9,14,0.92)_0%,rgba(8,9,14,0.6)_45%,rgba(8,9,14,0.1)_80%)] max-lg:bg-[linear-gradient(180deg,rgba(8,9,14,0.35)_0%,rgba(8,9,14,0.9)_60%)]"
          />
          <div aria-hidden="true" className="absolute inset-x-0 top-0 -z-10 h-32 bg-gradient-to-b from-bg to-transparent" />
          <div aria-hidden="true" className="absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-t from-bg to-transparent" />
        </>
      )}

      <div className="mx-auto grid max-w-[1280px] gap-8 px-5 py-12 md:px-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:items-center">
        <div className="order-2 flex flex-col items-start gap-5 lg:order-1">
          <h2
            id="roadmap-heading"
            className="b4w-display !mb-0 !text-[clamp(1.8rem,1.2rem+2vw,3rem)] !text-ink"
          >
            Coming next
          </h2>
          {next && (
            <>
              <p className="b4w-figure !mb-0 font-Text text-[17px] font-semibold text-ink">
                {next.label} · {next.category}
              </p>
              {art ? (
                <h3 className="!mb-0">
                  <Wordmark
                    art={art}
                    alt={next.title}
                    letter={STAGE_LETTER}
                    maxWidth={STAGE_WORDMARK_MAX}
                    sizes="(min-width:768px) 680px, 90vw"
                    className="drop-shadow-[0_8px_20px_rgba(0,0,0,0.6)]"
                  />
                </h3>
              ) : (
                <h3 className="b4w-display !mb-0 !text-[clamp(1.6rem,1.2rem+1.4vw,2.4rem)] !text-ink">
                  {next.title}
                </h3>
              )}
              <p className="!mb-0 max-w-[30rem] font-Text !text-[clamp(0.9rem,0.78rem+0.5vw,1.05rem)] !leading-[1.5] !text-ink">
                {next.teaser}
              </p>
            </>
          )}
          <p className="!mb-0 max-w-md b4w-copy font-Text text-muted">
            One original a month, each on the integration you already have. The
            full schedule, including titles we haven&rsquo;t announced, goes out
            under NDA.
          </p>
          <a
            href="mailto:info@bet4.win?subject=Full%20roadmap%20request"
            onClick={() => trackEvent("cta_click", { label: "request_roadmap", cta_type: "email" })}
            className="b4w-btn b4w-btn--primary b4w-btn--lg"
          >
            Request the full roadmap
          </a>
        </div>

        {art && (
          <div className="relative order-1 h-[38svh] min-h-[240px] lg:order-2 lg:h-[46svh] lg:max-h-[480px]">
            <Image
              src={art.art}
              alt=""
              fill
              sizes="(min-width:992px) 55vw, 90vw"
              className="object-contain drop-shadow-[0_30px_40px_rgba(0,0,0,0.55)]"
            />
          </div>
        )}
      </div>

      {rest.length > 0 && (
        <div className="mx-auto max-w-[1280px] px-5 pb-12 md:px-12">
          <ol className="!mb-0 flex list-none flex-col gap-px overflow-hidden rounded-xl border border-line bg-line p-0 sm:flex-row">
            {rest.map((r) => (
              <li key={r.id} className="flex flex-1 flex-col gap-1 bg-bg/90 p-5">
                <p className="b4w-figure !mb-0 font-Text text-[14px] text-muted">
                  {r.label}
                  {r.delivered && <span className="ml-2 font-semibold text-accent">Delivered</span>}
                </p>
                <div className="flex items-center justify-between gap-3">
                  <h3 className="!mb-0 font-Text text-[18px] font-bold !text-ink">{r.title}</h3>
                  {isLive(r.id) && (
                    <Link
                      href={`/games/${r.id}`}
                      aria-label={`${r.title} — game page`}
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/30 text-ink transition-colors hover:border-white hover:bg-white hover:text-bg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                    >
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  )}
                </div>
                <p className="!mb-0 font-Text text-[14px] leading-snug text-muted">{r.teaser}</p>
              </li>
            ))}
          </ol>
        </div>
      )}
    </section>
  );
}
