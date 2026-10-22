"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { games } from "@/data/games";
import Section from "./Section";
import { ArrowRight, Play } from "./Icons";
import { launchGame } from "@/app/lib/gameLauncher";
import { trackEvent } from "@/app/lib/analytics";
import { slugFor } from "@/app/lib/slug";

// Spotlight for one original, lit by the game itself: the band behind it is
// that title's own play scene, already blurred in its marketing pack, so
// Punch's spotlight sits in a boxing gym and Roulette's would sit at a table.
// Nothing in front of it is glass and nothing moves; the picture is the
// atmosphere.
//
// Everything it renders comes from that game's `featured` block in
// data/games.js, so featuring next month's release is a data change.
export default function FeaturedGame({ slug }) {
  const game = games.find(
    (g) => g.status === "active" && slugFor(g) === slug && g.featured,
  );
  if (!game) return null;

  const { headline, body, stats, eyebrow } = game.featured;

  const play = (e) => {
    trackEvent("game_launch", {
      game_id: game.id,
      game_title: game.title,
      source: "featured_hero",
    });
    // Anchor href is the fallback: if the catalogue hasn't mounted, the click
    // falls through and scrolls to #games instead of doing nothing.
    if (launchGame(slug)) e.preventDefault();
  };

  return (
    <Section
      surface="raised"
      aria-labelledby="featured-heading"
      className="overflow-hidden"
      backdrop={
        <>
          <Image
            src={game.backdrop}
            alt=""
            aria-hidden="true"
            fill
            sizes="100vw"
            className="object-cover opacity-45"
          />
          {/* Weighted to the copy side, so the prose has a floor and the art side
              keeps some of the room's light. */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[linear-gradient(90deg,rgba(6,10,22,0.35)_0%,rgba(6,10,22,0.85)_70%)]"
          />
        </>
      }
      innerClassName="grid gap-8 py-14 md:py-20 lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)] lg:items-center lg:gap-14"
    >
      <div className="relative aspect-[680/440] overflow-hidden rounded-lg">
        <Image
          src={game.banner}
          alt={`${game.title} — key art`}
          fill
          sizes="(min-width:1280px) 640px, (min-width:992px) 52vw, 92vw"
          className="object-cover"
        />
      </div>

      <div className="relative flex flex-col items-start gap-5">
        {eyebrow && (
          <p className="!mb-0 font-Text text-[15px] font-semibold text-brand">
            {eyebrow}
          </p>
        )}
        <div>
          <h2
            id="featured-heading"
            className="b4w-display !mb-0 !text-[clamp(2.2rem,1.3rem+2.6vw,3.4rem)] !text-ink"
          >
            {game.title}
          </h2>
          <p className="!mb-0 mt-3 max-w-lg font-Text !text-[clamp(1rem,0.87rem+0.67vw,1.2rem)] !font-semibold !leading-snug !text-ink [text-wrap:balance]">
            {headline}
          </p>
        </div>

        <p className="!mb-0 hidden max-w-xl b4w-copy font-Text text-muted md:block">
          {body}
        </p>

        {/* The figures as a spec line, read left to right, rather than three
            frosted tiles: they are three facts about one game, not three
            products. */}
        <dl className="!mb-0 grid w-full grid-cols-3 border-y border-white/15">
          {stats.map((s, i) => (
            <div
              key={s.label}
              className={`flex flex-col gap-1 py-3 ${i > 0 ? "border-l border-white/15 pl-4" : ""}`}
            >
              <dt className="order-2 font-Text text-[13px] leading-tight text-muted">
                {s.label}
              </dt>
              <dd className="b4w-figure order-1 !mb-0 text-[clamp(1.05rem,0.8rem+1vw,1.5rem)] font-bold leading-none text-ink">
                {s.value}
              </dd>
            </div>
          ))}
        </dl>

        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center sm:gap-5">
          <a href="#games" onClick={play} className="b4w-btn b4w-btn--primary b4w-btn--lg">
            <Play className="h-4 w-4" />
            Play the demo
          </a>
          <Link
            href={`/games/${slug}`}
            className="b4w-btn b4w-btn--quiet b4w-btn--lg self-start sm:self-auto"
          >
            Game details
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </Section>
  );
}
