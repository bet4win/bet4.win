import React from "react";
import Image from "next/image";
import Arrive from "./Arrive";
import { aggregators } from "@/data/aggregators";

// Where an operator can already switch the catalogue on: a wall of the
// aggregators and platforms we're integrated with. The partners an operator is
// most likely to be on get the large tiles; the rest fill the wall below them.
//
// Every mark is drawn white, whatever colour its file is, so the wall reads as
// one surface and no partner's brand colour shouts over the others. The files
// themselves stay exactly as each partner publishes them (see
// public/assets/img/partners/SOURCES.md).
export default function Aggregators() {
  const primary = aggregators.filter((a) => a.primary);
  const rest = aggregators.filter((a) => !a.primary);

  return (
    <Arrive as="section" aria-labelledby="aggregators-heading" className="bg-bg pb-12 pt-12">
      <div className="mx-auto max-w-[1280px] px-5 md:px-12">
        <h2
          id="aggregators-heading"
          className="b4w-display !mb-0 max-w-3xl !text-[clamp(1.8rem,1.2rem+2vw,3rem)] !text-ink"
        >
          Get our games from
        </h2>
        <p className="!mb-0 mt-4 max-w-2xl b4w-copy font-Text text-muted">
          Already on one of these? The whole catalogue is a switch away, with no new integration to build.
        </p>

        <ul className="!mb-0 mt-8 grid list-none grid-cols-2 gap-2 p-0 sm:grid-cols-3 sm:gap-3 md:mt-10">
          {primary.map((a) => (
            <Tile key={a.name} aggregator={a} className="h-[96px] sm:h-[112px] md:h-[150px]" logoClassName="h-[44px] w-[70%] md:h-[60px]" />
          ))}
        </ul>
        {/* Wraps rather than grids, and centres its last row, so the wall
            stays even however many partners it lists. */}
        <ul className="!mb-0 mt-2 flex list-none flex-wrap justify-center gap-2 p-0 sm:mt-3 sm:gap-3">
          {rest.map((a) => (
            <Tile
              key={a.name}
              aggregator={a}
              className="h-[64px] basis-[calc((100%-1rem)/3)] sm:h-[80px] sm:basis-[calc((100%-1.5rem)/3)] md:h-[96px] md:basis-[calc((100%-2.25rem)/4)] lg:basis-[calc((100%-4.5rem)/7)]"
              logoClassName="h-[24px] w-[76%] sm:h-[30px] sm:w-[72%] md:h-[36px]"
            />
          ))}
        </ul>
      </div>
    </Arrive>
  );
}

function Tile({ aggregator: { name, logo }, className, logoClassName }) {
  return (
    <li className={`group flex items-center justify-center rounded-lg border border-line/40 bg-panel/50 transition-colors duration-300 hover:bg-panel ${className}`}>
      {/* Every mark gets the same box and is fitted inside it, so a wide
          wordmark and a stacked lockup carry about the same weight. */}
      <div className={`relative ${logoClassName}`}>
        <Image
          src={logo}
          alt={name}
          title={name}
          fill
          sizes="(min-width:768px) 280px, 45vw"
          className="object-contain opacity-70 brightness-0 invert transition-opacity duration-300 group-hover:opacity-100"
        />
      </div>
    </li>
  );
}
