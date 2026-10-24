"use client";
import React, { useState } from "react";
import LobbyCard from "./LobbyCard";
import { trackEvent } from "@/app/lib/analytics";
import { liveCatalogue } from "@/app/lib/catalogue";

const ALL = "All";

// The full catalogue as a grid of lobby cards, filterable by mechanic. Demos
// open through the page's <DemoHost>, so this renders cards and nothing else.
export default function GameGrid() {
  const [filter, setFilter] = useState(ALL);
  const visible =
    filter === ALL ? liveCatalogue : liveCatalogue.filter((e) => e.game.category === filter);

  return (
    <div>
      <CategoryFilter
        value={filter}
        onChange={(next) => {
          setFilter(next);
          trackEvent("catalogue_filter", { category: next });
        }}
      />
      <ul className="!mb-0 mt-8 grid list-none grid-cols-1 gap-x-5 gap-y-10 p-0 min-[400px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {visible.map((entry, i) => (
          <li key={`${filter}-${entry.slug}`} className="b4w-redeal" style={{ "--i": i }}>
            <LobbyCard
              entry={entry}
              source="catalogue"
              sizes="(min-width:992px) 300px, (min-width:768px) 31vw, 46vw"
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

// Quick filters by mechanic family, derived from the catalogue in catalogue
// order, so a category can never appear with nothing behind it.
//
// Toggle buttons rather than a radiogroup: aria-pressed says what they do
// without promising arrow-key roving the component does not implement. Text
// with a count, not pills — the count says what each holds before it's pressed.
function CategoryFilter({ value, onChange }) {
  const counts = new Map();
  for (const { game } of liveCatalogue) {
    if (!game.category) continue;
    counts.set(game.category, (counts.get(game.category) || 0) + 1);
  }
  if (counts.size < 2) return null;

  const options = [ALL, ...counts.keys()];

  return (
    <div
      role="group"
      aria-label="Filter the catalogue by mechanic"
      className="-mx-5 flex gap-6 overflow-x-auto border-b border-line px-5 [scrollbar-width:none] md:mx-0 md:flex-wrap md:overflow-visible md:px-0 [&::-webkit-scrollbar]:hidden"
    >
      {options.map((label) => {
        const on = label === value;
        const count = label === ALL ? liveCatalogue.length : counts.get(label);
        return (
          <button
            key={label}
            type="button"
            onClick={() => onChange(label)}
            aria-pressed={on}
            className={`-mb-px flex min-h-[48px] shrink-0 items-baseline gap-1.5 border-b-2 pt-3 font-Text text-[16px] transition-colors ${
              on
                ? "border-ink font-semibold text-ink"
                : "border-transparent text-muted hover:text-ink"
            }`}
          >
            {label}
            <span className="b4w-figure text-[13px] text-faint">{count}</span>
          </button>
        );
      })}
    </div>
  );
}
