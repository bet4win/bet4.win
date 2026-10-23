"use client";
import React, { useRef } from "react";
import Link from "next/link";
import LobbyCard from "./LobbyCard";
import { ArrowLeft, ArrowRight } from "./Icons";
import { liveCatalogue } from "@/app/lib/catalogue";

// Pads the scroller so its first card lines up with the page's content edge,
// while the row itself still runs to both edges of the screen.
const GUTTER = "max(1.25rem, calc((100vw - 1280px) / 2 + 3rem))";

// The whole catalogue as one row of lobby cards, under the stage. The stage
// shows one game at a time at full size; this is where a reader sees the
// range at once and goes deeper.
export default function LobbyRail() {
  const rowRef = useRef(null);

  const page = (dir) => {
    const row = rowRef.current;
    if (!row) return;
    row.scrollBy({ left: dir * row.clientWidth * 0.8, behavior: "smooth" });
  };

  return (
    <section id="games" aria-labelledby="lobby-heading" className="relative bg-bg pb-16 pt-14 md:pb-24 md:pt-20">
      <div className="mx-auto flex max-w-[1280px] items-end justify-between gap-6 px-5 md:px-12">
        <div>
          <h2
            id="lobby-heading"
            className="b4w-display !mb-0 !text-[clamp(1.8rem,1.2rem+2vw,3rem)] !text-ink"
          >
            The lobby
          </h2>
          <p className="!mb-0 mt-3 max-w-xl b4w-copy font-Text text-muted">
            Every title is playable here as a demo, and every one ships in your
            brand.
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Link href="/games" className="b4w-btn b4w-btn--quiet mr-3 hidden sm:inline-flex">
            All {liveCatalogue.length} games
          </Link>
          <button
            type="button"
            onClick={() => page(-1)}
            aria-label="Scroll the lobby back"
            className="b4w-btn b4w-btn--ghost b4w-btn--icon hidden md:inline-flex"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => page(1)}
            aria-label="Scroll the lobby forward"
            className="b4w-btn b4w-btn--ghost b4w-btn--icon hidden md:inline-flex"
          >
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <ul
        ref={rowRef}
        className="!mb-0 mt-8 flex list-none snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [scrollbar-width:none] md:mt-10 md:gap-5"
        style={{ paddingInline: GUTTER, scrollPaddingInline: GUTTER }}
      >
        {liveCatalogue.map((entry) => (
          <li key={entry.slug} className="w-[62vw] max-w-[300px] shrink-0 snap-start sm:w-[260px] md:w-[290px]">
            <LobbyCard entry={entry} sizes="(min-width:768px) 290px, 62vw" />
          </li>
        ))}
      </ul>

      <div className="mx-auto mt-6 max-w-[1280px] px-5 sm:hidden">
        <Link href="/games" className="b4w-btn b4w-btn--ghost w-full">
          All {liveCatalogue.length} games
        </Link>
      </div>
    </section>
  );
}
