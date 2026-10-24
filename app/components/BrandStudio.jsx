"use client";
import React, { useState } from "react";
import Image from "next/image";
import { liveCatalogue } from "@/app/lib/catalogue";
import { artFor } from "@/data/gameArt";

// The branding page's centrepiece: one real game, re-skinned per operator in
// front of you. The window is Mines in its own room; the operator's logo,
// palette, typeface and controls are the theme. Beside it, the theme itself —
// the handful of values an operator actually supplies — and under both, a row
// of the catalogue wearing the same theme, because the point is that one theme
// lands on every title at once.
//
// The brands are invented. The typefaces are ones every browser already has
// (a serif, a condensed cut of the display face, the system's rounded face), so
// switching costs no font download and still shows a real change of voice.
const BRANDS = [
  {
    id: "rouge",
    label: "Rouge Club",
    name: "ROUGE CLUB",
    mark: "RC",
    accent: "#e5384a",
    onAccent: "#ffffff",
    surface: "rgba(24, 8, 12, 0.86)",
    tile: "#331219",
    edge: "rgba(229, 56, 74, 0.35)",
    font: "var(--font-Display)",
    fontLabel: "Condensed sans",
    fontStyle: { fontWeight: 800, fontStretch: "75%", letterSpacing: "0.02em" },
  },
  {
    id: "golden",
    label: "Golden Palace",
    name: "Golden Palace",
    mark: "GP",
    accent: "#e8b04a",
    onAccent: "#1d1203",
    surface: "rgba(20, 14, 6, 0.86)",
    tile: "#2a2111",
    edge: "rgba(232, 176, 74, 0.35)",
    font: "Georgia, 'Times New Roman', serif",
    fontLabel: "Serif",
    fontStyle: { fontWeight: 700, letterSpacing: "0.01em" },
  },
  {
    id: "aqua",
    label: "AquaSpin",
    name: "aquaspin",
    mark: "as",
    accent: "#2ad4e8",
    onAccent: "#002227",
    surface: "rgba(4, 22, 26, 0.86)",
    tile: "#0d3138",
    edge: "rgba(42, 212, 232, 0.35)",
    font: "ui-rounded, 'SF Pro Rounded', 'Nunito', system-ui, sans-serif",
    fontLabel: "Rounded sans",
    fontStyle: { fontWeight: 800 },
  },
];

// Tiles already turned over in the preview round: gems, and no bomb yet.
const REVEALED = new Set([1, 7, 8, 12, 18]);
const MINES = artFor("mines");
const ROW = ["punch", "plinko", "dice", "crash", "keno", "roulette"]
  .map((slug) => liveCatalogue.find((e) => e.slug === slug))
  .filter(Boolean);

export default function BrandStudio() {
  const [brand, setBrand] = useState(BRANDS[0]);
  // The first operator is on the board when the page loads; only a switch
  // re-deals it.
  const [switched, setSwitched] = useState(false);
  const type = { fontFamily: brand.font, ...brand.fontStyle };

  return (
    <section aria-labelledby="studio-heading" className="bg-bg py-16 md:py-24">
      <div className="mx-auto max-w-[1280px] px-5 md:px-12">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="min-w-0">
            <h2
              id="studio-heading"
              className="b4w-display !mb-0 !text-[clamp(1.8rem,1.2rem+2vw,3rem)] !text-ink"
            >
              Try it in someone else&rsquo;s colours
            </h2>
            <p className="!mb-0 mt-3 max-w-xl b4w-copy font-Text text-muted">
              Three made-up operators, one game. Pick one: the logo, palette,
              typeface and controls change; the game underneath doesn&rsquo;t.
            </p>
          </div>

          <div role="group" aria-label="Choose an operator" className="flex shrink-0 flex-wrap gap-2 md:flex-nowrap">
            {BRANDS.map((b) => {
              const on = b.id === brand.id;
              return (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => {
                    setBrand(b);
                    setSwitched(true);
                  }}
                  aria-pressed={on}
                  className={`flex items-center gap-2.5 rounded-lg border px-3.5 py-2.5 font-Text text-[15px] font-semibold transition-colors ${
                    on ? "border-white bg-white text-bg" : "border-line text-ink/80 hover:border-ink/50 hover:text-ink"
                  }`}
                >
                  <span className="h-3.5 w-3.5 rounded-full" style={{ backgroundColor: b.accent }} />
                  {b.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,7fr)_minmax(0,4fr)] lg:items-stretch">
          {/* --- The game, in the operator's skin ---------------------------- */}
          <div
            className="relative isolate overflow-hidden rounded-xl transition-[box-shadow] duration-500"
            style={{ boxShadow: `0 0 0 1px ${brand.edge}, 0 30px 80px -30px ${brand.accent}55` }}
          >
            <Image src={MINES.scene} alt="" fill sizes="(min-width:992px) 60vw, 100vw" className="-z-10 object-cover" />
            <div className="absolute inset-0 -z-10 bg-black/35" />

            {/* Operator header */}
            <div
              className="flex items-center justify-between px-4 py-3 transition-colors duration-500 md:px-5"
              style={{ backgroundColor: brand.surface, borderBottom: `1px solid ${brand.edge}` }}
            >
              <div className="flex items-center gap-3">
                <span
                  className="flex h-8 w-8 items-center justify-center rounded-md text-[13px] transition-colors duration-500"
                  style={{ backgroundColor: brand.accent, color: brand.onAccent, ...type }}
                >
                  {brand.mark}
                </span>
                <span key={brand.id} className={`text-[18px] text-white ${switched ? "b4w-swap" : ""}`} style={type}>
                  {brand.name}
                </span>
              </div>
              <span
                className="b4w-figure rounded-full px-3 py-1 text-[14px] font-semibold transition-colors duration-500"
                style={{ backgroundColor: brand.tile, color: brand.accent, border: `1px solid ${brand.edge}` }}
              >
                € 1,000.00
              </span>
            </div>

            {/* The board */}
            <div className="flex justify-center px-4 py-7 md:py-10">
              <div key={brand.id} className="grid w-full max-w-[400px] grid-cols-5 gap-2">
                {Array.from({ length: 25 }).map((_, i) => {
                  const open = REVEALED.has(i);
                  return (
                    <div
                      key={i}
                      className={`relative aspect-square rounded-lg ${switched ? "b4w-tile" : ""}`}
                      style={{
                        "--i": (i % 5) + Math.floor(i / 5),
                        backgroundColor: open ? `${brand.accent}26` : brand.tile,
                        border: `1px solid ${open ? brand.accent : brand.edge}`,
                      }}
                    >
                      {open && (
                        <svg viewBox="0 0 24 24" className="absolute inset-[22%]" aria-hidden="true">
                          <path d="M6 3h12l4 6-10 12L2 9z" fill={brand.accent} />
                          <path d="M2 9h20M9 3l3 6 3-6M12 9v12" stroke={brand.onAccent} strokeOpacity="0.35" fill="none" />
                        </svg>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Controls */}
            <div
              className="flex flex-wrap items-center gap-2 px-4 py-3 transition-colors duration-500 md:px-5"
              style={{ backgroundColor: brand.surface, borderTop: `1px solid ${brand.edge}` }}
            >
              <span
                className="b4w-figure flex-1 rounded-md px-3 py-2.5 text-[15px] text-white/85"
                style={{ backgroundColor: brand.tile, border: `1px solid ${brand.edge}` }}
              >
                € 10.00
              </span>
              {["½", "2×"].map((q) => (
                <span
                  key={q}
                  className="rounded-md px-3 py-2.5 text-[15px] text-white/80"
                  style={{ backgroundColor: brand.tile, border: `1px solid ${brand.edge}` }}
                >
                  {q}
                </span>
              ))}
              <span
                className="rounded-md px-6 py-2.5 text-[16px] transition-colors duration-500"
                style={{ backgroundColor: brand.accent, color: brand.onAccent, ...type }}
              >
                Cash out 2.47×
              </span>
            </div>
          </div>

          {/* --- The theme behind it ------------------------------------------ */}
          <aside aria-label="The theme" className="flex flex-col rounded-xl border border-line bg-panel p-5 md:p-6">
            <h3 className="!mb-0 font-Text text-[17px] font-bold !text-ink">What the operator supplied</h3>
            <p className="!mb-0 mt-1.5 font-Text text-[14px] text-muted">
              That&rsquo;s the whole theme. Every game reads it when it opens.
            </p>
            <dl className="!mb-0 mt-5 flex flex-col">
              {[
                ["Logo", <span key="l" style={type}>{brand.name}</span>],
                [
                  "Accent",
                  <span key="a" className="inline-flex items-center gap-2">
                    <span className="h-4 w-4 rounded" style={{ backgroundColor: brand.accent }} />
                    <span className="font-JetBrainsMono text-[13px]">{brand.accent}</span>
                  </span>,
                ],
                [
                  "Surface",
                  <span key="s" className="inline-flex items-center gap-2">
                    <span className="h-4 w-4 rounded border border-white/20" style={{ backgroundColor: brand.tile }} />
                    <span className="font-JetBrainsMono text-[13px]">{brand.tile}</span>
                  </span>,
                ],
                ["Typeface", <span key="t" style={type}>{brand.fontLabel}</span>],
                ["Currency", <span key="c">EUR</span>],
              ].map(([k, v]) => (
                <div key={k} className="flex items-center justify-between gap-4 border-t border-line py-3 font-Text text-[15px]">
                  <dt className="text-muted">{k}</dt>
                  <dd className="!mb-0 text-right text-ink">{v}</dd>
                </div>
              ))}
            </dl>
            <p className="!mb-0 mt-auto border-t border-line pt-4 font-Text text-[13px] leading-relaxed text-faint">
              Live, it arrives with the game launch as your brand&rsquo;s theme,
              so one change reaches every title at once.
            </p>
          </aside>
        </div>

        {/* --- …and the rest of the catalogue ------------------------------- */}
        <div className="mt-8">
          <p className="!mb-0 font-Text text-[15px] text-muted">The same theme, across the catalogue:</p>
          <ul className="!mb-0 mt-4 grid list-none grid-cols-3 gap-3 p-0 sm:grid-cols-6">
            {ROW.map((e) => (
              <li
                key={e.slug}
                className="overflow-hidden rounded-lg transition-[box-shadow] duration-500"
                style={{ boxShadow: `0 0 0 2px ${brand.accent}` }}
              >
                <div className="relative aspect-square">
                  <Image src={e.game.image} alt={e.game.title} fill sizes="200px" className="object-cover" />
                </div>
                <div
                  className="truncate px-2.5 py-2 text-center text-[13px] transition-colors duration-500"
                  style={{ backgroundColor: brand.surface, color: brand.accent, ...type }}
                >
                  {e.game.title}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
