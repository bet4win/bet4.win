import React from "react";
import { games } from "@/data/games";

const fmt = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });

const ENTRIES = games
  .filter((g) => g.status === "active" && g.maxMultiplier)
  .map((g) => ({ title: g.title, max: `${fmt.format(g.maxMultiplier)}×` }));

// The catalogue's real ceilings, running past on a loop. It is a marquee, but
// it carries actual data rather than slogans — the numbers are the pitch, and
// seeing 5,096,294× slide by says more than a paragraph claiming "big wins".
export default function Ticker() {
  if (!ENTRIES.length) return null;

  // Rendered twice so the -50% translation loops with no visible seam.
  const run = [...ENTRIES, ...ENTRIES];

  return (
    <div
      className="b4w-marquee relative overflow-hidden border-y border-line bg-panel-low/70 py-3.5"
      role="marquee"
      aria-label="Maximum multiplier for each original"
    >
      <div className="b4w-marquee-track" aria-hidden="true">
        {run.map((e, i) => (
          <span key={i} className="flex shrink-0 items-center gap-3 px-6">
            <span className="b4w-display text-[15px] text-ink">{e.title}</span>
            <span className="font-JetBrainsMono text-[15px] font-semibold text-cyan tabular-nums">
              {e.max}
            </span>
            <span className="ml-3 h-1 w-1 rounded-full bg-brand-strong" />
          </span>
        ))}
      </div>

      {/* Fades the strip into the canvas at both ends so it reads as continuous
          rather than starting and stopping at the viewport edge. */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-bg to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-bg to-transparent" />

      {/* The animated copy is aria-hidden; this states the same facts once for
          assistive tech without the duplicated, looping list. */}
      <p className="sr-only">
        Maximum multipliers:{" "}
        {ENTRIES.map((e) => `${e.title} ${e.max}`).join(", ")}.
      </p>
    </div>
  );
}
