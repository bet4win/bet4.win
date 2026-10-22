"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import Section from "./Section";
import { ArrowRight } from "./Icons";
import { trackEvent } from "@/app/lib/analytics";
import { bookingUrl } from "@/app/lib/site";
import { openBooking } from "@/app/lib/booking";
import { slugFor } from "@/app/lib/slug";
import { games } from "@/data/games";

const LIVE = games.filter((g) => g.status === "active");

// The hero is the lobby. The catalogue is what an operator is buying, and at
// twenty titles it is big enough to be the argument on its own: every tile, at
// once, beside one sentence about what it costs to take them. It replaces a
// tilting three-card carousel that showed one game at a time and hid the rest
// behind a swipe.
export default function Hero() {
  return (
    <Section
      surface="base"
      innerClassName="grid gap-10 pb-14 pt-10 md:pb-20 md:pt-16 lg:grid-cols-[minmax(0,11fr)_minmax(0,13fr)] lg:items-center lg:gap-14"
    >
      <div className="flex flex-col items-start gap-6">
        {/* The count is computed, so the headline is never out of date with
            the catalogue it sits beside. */}
        <h1 className="b4w-display !mb-0 !text-[clamp(1.9rem,1.1rem+2.2vw,2.75rem)] !text-ink [text-wrap:balance]">
          {LIVE.length} provably fair originals. One integration.
        </h1>

        <p className="b4w-copy--lead !mb-0 max-w-[34rem] font-Text text-muted">
          Crash, mines, plinko, cards, roulette and more. Every round can be
          checked by the player who played it, every game takes your brand, and
          a new title ships each month on the integration you already have.
        </p>

        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center sm:gap-5">
          <a
            href={bookingUrl("hero")}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => {
              trackEvent("cta_click", { label: "hero_book_demo", cta_type: "booking" });
              if (openBooking("hero")) e.preventDefault();
            }}
            className="b4w-btn b4w-btn--primary b4w-btn--lg"
          >
            Book a demo
          </a>
          <a
            href="#games"
            onClick={() =>
              trackEvent("cta_click", { label: "hero_compare_games", cta_type: "anchor" })
            }
            className="b4w-btn b4w-btn--quiet b4w-btn--lg self-start sm:self-auto"
          >
            Compare all {LIVE.length} games
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>

      <LobbyWall />
    </Section>
  );
}

// Every live title as a square tile, in catalogue order. Five across from sm
// up (twenty is four even rows), four across on a phone, where the tiles come
// out at ~85px and all twenty still fit in about one screen.
function LobbyWall() {
  return (
    <ul
      aria-label="The catalogue"
      className="!mb-0 grid list-none grid-cols-4 gap-1.5 p-0 sm:grid-cols-5 md:gap-2"
    >
      {LIVE.map((game, i) => (
        <li key={game.id}>
          <Link
            href={`/games/${slugFor(game)}`}
            className="group relative block aspect-square overflow-hidden rounded-md bg-panel outline-offset-2 focus-visible:outline-2 focus-visible:outline-brand"
          >
            <Image
              src={game.image}
              alt={game.title}
              fill
              sizes="(min-width:1280px) 140px, (min-width:992px) 11vw, (min-width:576px) 18vw, 23vw"
              // The first row is above the fold on every layout.
              priority={i < 5}
              className="object-cover transition-[filter] duration-200 group-hover:brightness-110"
            />
            {/* The name, on hover and focus. The art carries no wordmark, and
                a wall of twenty unlabelled pictures is a quiz. */}
            <span
              aria-hidden="true"
              className="absolute inset-x-0 bottom-0 translate-y-full bg-bg/90 px-2 py-1.5 font-Text text-[13px] font-semibold leading-tight text-ink transition-transform duration-200 group-hover:translate-y-0 group-focus-visible:translate-y-0"
            >
              {game.title}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
