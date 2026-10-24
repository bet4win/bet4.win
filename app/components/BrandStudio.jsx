"use client";
import React, { useState } from "react";
import Image from "next/image";
import { liveCatalogue } from "@/app/lib/catalogue";
import { prefersReducedMotion } from "@/app/lib/motion";

// The branding page's centrepiece: one game, re-skinned in front of you. The
// window is a Mines board on a plain backdrop lit by the theme's own colours —
// no game's room, so nothing reads as one title's art. The visitor's theme is
// the operator's —
// a name, two colours, a typeface and a currency, the handful of values an
// operator actually supplies. Under both, a row of the catalogue wearing the
// same theme, because the point is that one theme lands on every title at once.
//
// Everything else the skin needs (text on the accent, panel glass, borders,
// the logo mark) is derived from those values, as it is live.
//
// The typefaces are ones every browser already has (a serif, a condensed cut
// of the display face, the system's rounded face), so switching costs no font
// download and still shows a real change of voice.
const FONTS = [
  {
    id: "condensed",
    label: "Condensed",
    font: "var(--font-Display)",
    style: { fontWeight: 800, fontStretch: "75%", letterSpacing: "0.02em" },
  },
  { id: "serif", label: "Serif", font: "Georgia, 'Times New Roman', serif", style: { fontWeight: 700, letterSpacing: "0.01em" } },
  {
    id: "rounded",
    label: "Rounded",
    font: "ui-rounded, 'SF Pro Rounded', 'Nunito', system-ui, sans-serif",
    style: { fontWeight: 800 },
  },
];
const CURRENCIES = ["EUR", "USD", "GBP", "BRL", "INR"];
const HEX = /^#[0-9a-f]{6}$/i;

const channels = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
const luminance = (hex) =>
  channels(hex)
    .map((c) => (c / 255 <= 0.03928 ? c / 255 / 12.92 : ((c / 255 + 0.055) / 1.055) ** 2.4))
    .reduce((sum, c, i) => sum + c * [0.2126, 0.7152, 0.0722][i], 0);
const initials = (name) => {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "";
  return (words.length > 1 ? words[0][0] + words[1][0] : words[0].slice(0, 2)).toUpperCase();
};

function skin({ name, accent, tile, font, currency }) {
  const money = new Intl.NumberFormat("en", { style: "currency", currency });
  const [r, g, b] = channels(tile).map((c) => Math.round(c * 0.55));
  return {
    name: name.trim() || "Your brand",
    mark: initials(name) || "YB",
    accent,
    onAccent: luminance(accent) > 0.4 ? "#111111" : "#ffffff",
    tile,
    surface: `rgba(${r}, ${g}, ${b}, 0.86)`,
    edge: `${accent}59`,
    type: { fontFamily: font.font, ...font.style },
    balance: money.format(1000),
    stake: money.format(10),
  };
}

const inputCls =
  "h-[44px] w-full !rounded-md border border-line bg-bg px-3 font-Text text-[15px] text-ink placeholder:text-faint focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60";
const labelCls = "mb-1.5 block font-Text text-[13px] text-muted";

// A colour as a swatch you can pick from and a hex you can paste. The hex is
// a draft until it's a whole colour, so typing through "#e5" doesn't repaint
// the game with nothing.
function ColourField({ id, label, value, onChange }) {
  const [draft, setDraft] = useState(value);
  return (
    <div>
      <label className={labelCls} htmlFor={id}>
        {label}
      </label>
      <div className="flex gap-2">
        <input
          type="color"
          aria-label={`${label} picker`}
          value={value}
          onChange={(e) => {
            setDraft(e.target.value);
            onChange(e.target.value);
          }}
          className="b4w-swatch h-[44px] w-[52px] shrink-0 cursor-pointer !rounded-md border border-line bg-bg p-1"
        />
        <input
          id={id}
          value={draft}
          spellCheck={false}
          maxLength={7}
          onChange={(e) => {
            const v = e.target.value.startsWith("#") ? e.target.value : `#${e.target.value}`;
            setDraft(v);
            if (HEX.test(v)) onChange(v.toLowerCase());
          }}
          onBlur={() => setDraft(value)}
          className={`${inputCls} font-JetBrainsMono !text-[13px]`}
        />
      </div>
    </div>
  );
}

// The titles the preview can stand in for — the ones whose whole game is one
// board and a bet bar, so a still frame of it is honest. Each is a picture of a
// round in progress, not a playable game: one entrance move, then it holds.
const GAMES = {
  keno: "Bet",
  mines: "Cash out 2.47×",
  plinko: "Drop ball",
  dice: "Roll dice",
  crash: "Cash out 1.84×",
  wheel: "Spin",
};
const ROW = Object.keys(GAMES)
  .map((slug) => liveCatalogue.find((e) => e.slug === slug))
  .filter(Boolean);

// Tiles already turned over in the preview round: gems, and no bomb yet.
const REVEALED = new Set([1, 7, 8, 12, 18]);

function MinesFrame({ brand, deal }) {
  return (
    <div className="grid w-full max-w-[300px] grid-cols-5 gap-2 md:max-w-[400px]">
      {Array.from({ length: 25 }).map((_, i) => {
        const open = REVEALED.has(i);
        return (
          <div
            key={i}
            className={`relative aspect-square rounded-md ${deal ? "b4w-tile" : ""}`}
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
  );
}

// Eight rows of pegs, three to ten wide, 36 apart; the ball falls onto a peg in
// every row and is knocked half a gap left or right by the next.
const PEG_ROWS = Array.from({ length: 8 }, (_, r) =>
  Array.from({ length: r + 3 }, (_, i) => ({ x: 200 + (i - (r + 2) / 2) * 36, y: 40 + r * 34 })),
);
const PLINKO_PAYS = [9, 3, 1.4, 0.7, 0.4, 0.7, 1.4, 3, 9];
const BALL_PATH = [1, -1, 1, 1, -1, -1, 1, 1].reduce(
  (acc, d, r) => {
    const y = 31 + r * 34;
    return { x: acc.x + d * 18, d: `${acc.d} Q${acc.x + d * 9},${y - 14} ${acc.x + d * 18},${y + 34}` };
  },
  { x: 200, d: "M200,8 L200,31" },
).d;

function PlinkoFrame({ brand }) {
  return (
    <svg viewBox="0 0 400 340" className="h-full max-h-[300px] w-full md:max-h-[400px]" aria-hidden="true">
      {PEG_ROWS.flat().map((p) => (
        <circle key={`${p.x}-${p.y}`} cx={p.x} cy={p.y} r="3.5" fill="#ffffff" fillOpacity="0.75" />
      ))}
      {PLINKO_PAYS.map((m, i) => (
        <g key={i}>
          <rect
            x={39 + i * 36}
            y="300"
            width="34"
            height="26"
            rx="5"
            fill={brand.accent}
            fillOpacity={0.25 + (m / 9) * 0.75}
          />
          <text
            x={56 + i * 36}
            y="317"
            textAnchor="middle"
            fontSize="10"
            fill={m >= 3 ? brand.onAccent : "#ffffff"}
            style={brand.type}
          >
            {m}×
          </text>
        </g>
      ))}
      <circle r="7" fill={brand.accent} stroke={brand.onAccent} strokeOpacity="0.4" strokeWidth="1.5">
        {!prefersReducedMotion() && <animateMotion dur="2.4s" repeatCount="indefinite" path={BALL_PATH} />}
      </circle>
    </svg>
  );
}

function Stat({ brand, label, value }) {
  return (
    <div className="rounded-md px-3 py-2" style={{ backgroundColor: brand.tile, border: `1px solid ${brand.edge}` }}>
      <div className="font-Text text-[11px] text-white/55">{label}</div>
      <div className="b4w-figure text-[15px] text-white">{value}</div>
    </div>
  );
}

function DiceFrame({ brand }) {
  return (
    <div className="flex w-full max-w-[460px] flex-col items-center gap-8">
      <div className="b4w-pop text-[64px] leading-none md:text-[88px]" style={{ ...brand.type, color: brand.accent }}>
        48.21
      </div>
      <div className="w-full">
        <div className="relative h-3 rounded-full" style={{ backgroundColor: brand.tile, border: `1px solid ${brand.edge}` }}>
          <div className="absolute inset-y-0 left-0 w-[50.5%] rounded-full" style={{ backgroundColor: brand.accent }} />
          <div
            className="b4w-slide absolute top-1/2 h-7 w-7 -translate-x-1/2 -translate-y-1/2 rounded-md border-2 border-white"
            style={{ "--to": "48.21%", left: "48.21%", backgroundColor: brand.surface }}
          />
        </div>
        <div className="mt-2 flex justify-between font-JetBrainsMono text-[11px] text-white/45">
          {[0, 25, 50, 75, 100].map((n) => (
            <span key={n}>{n}</span>
          ))}
        </div>
      </div>
      <div className="grid w-full grid-cols-3 gap-2">
        <Stat brand={brand} label="Multiplier" value="1.96×" />
        <Stat brand={brand} label="Roll under" value="50.50" />
        <Stat brand={brand} label="Win chance" value="50.50%" />
      </div>
    </div>
  );
}

// Eight picks against ten drawn: four hits, so the 4-hit rung of the paytable
// is the lit one.
const KENO_PICKS = new Set([3, 7, 12, 18, 21, 26, 30, 35]);
const KENO_DRAWN = new Set([7, 9, 12, 15, 21, 24, 30, 33, 38, 40]);
const KENO_PAYS = [
  [3, "1.5×"],
  [4, "4×"],
  [5, "10×"],
  [6, "50×"],
  [7, "200×"],
  [8, "1000×"],
];

function KenoFrame({ brand, deal }) {
  return (
    <div className="flex w-full max-w-[460px] flex-col gap-5">
      <div className="grid grid-cols-8 gap-1.5">
        {Array.from({ length: 40 }, (_, i) => {
          const n = i + 1;
          const picked = KENO_PICKS.has(n);
          const drawn = KENO_DRAWN.has(n);
          const hit = picked && drawn;
          return (
            <div
              key={n}
              className={`b4w-figure flex aspect-square items-center justify-center rounded-md text-[13px] md:text-[15px] ${deal ? "b4w-tile" : ""}`}
              style={{
                "--i": (i % 8) + Math.floor(i / 8),
                backgroundColor: hit ? brand.accent : picked ? `${brand.accent}26` : brand.tile,
                border: `1px solid ${picked ? brand.accent : drawn ? "#ffffff99" : brand.edge}`,
                color: hit ? brand.onAccent : picked ? brand.accent : drawn ? "#ffffff" : "#ffffff66",
              }}
            >
              {n}
            </div>
          );
        })}
      </div>
      <div className="grid grid-cols-6 gap-1.5">
        {KENO_PAYS.map(([hits, pay]) => {
          const on = hits === 4;
          return (
            <div
              key={hits}
              className="rounded-md py-1.5 text-center"
              style={{
                backgroundColor: on ? brand.accent : brand.tile,
                border: `1px solid ${on ? brand.accent : brand.edge}`,
                color: on ? brand.onAccent : "#ffffffaa",
              }}
            >
              <div className="b4w-figure text-[12px] md:text-[13px]">{pay}</div>
              <div className="font-Text text-[10px] opacity-70">{hits} hits</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const CRASH_CURVE = Array.from({ length: 41 }, (_, i) => {
  const t = i / 40;
  return `${i ? "L" : "M"}${(30 + t * 340).toFixed(1)},${(270 - ((Math.exp(2.4 * t) - 1) / (Math.exp(2.4) - 1)) * 220).toFixed(1)}`;
}).join(" ");

function CrashFrame({ brand }) {
  return (
    <div className="relative w-full max-w-[520px]">
      <svg viewBox="0 0 400 300" className="w-full" aria-hidden="true">
        {[90, 150, 210, 270].map((y) => (
          <line key={y} x1="30" x2="370" y1={y} y2={y} stroke="#ffffff" strokeOpacity="0.08" />
        ))}
        <path d={`${CRASH_CURVE} L370,270 Z`} fill={brand.accent} fillOpacity="0.14" className="b4w-fade-late" />
        <path
          d={CRASH_CURVE}
          pathLength="1"
          fill="none"
          stroke={brand.accent}
          strokeWidth="4"
          strokeLinecap="round"
          className="b4w-draw"
        />
        <circle cx="370" cy="50" r="7" fill={brand.accent} className="b4w-fade-late" />
      </svg>
      <div
        className="b4w-pop absolute left-[12%] top-[8%] text-[48px] leading-none md:text-[64px]"
        style={{ ...brand.type, color: "#ffffff" }}
      >
        1.84×
      </div>
    </div>
  );
}

const WHEEL_SEGMENTS = 20;

function WheelFrame({ brand }) {
  const fills = [brand.accent, brand.tile, `${brand.accent}66`, brand.tile];
  return (
    <div className="relative aspect-square h-full max-h-[300px] md:max-h-[400px]">
      <svg viewBox="-110 -110 220 220" className="b4w-spin h-full w-full" aria-hidden="true">
        {Array.from({ length: WHEEL_SEGMENTS }).map((_, i) => {
          const a0 = (i / WHEEL_SEGMENTS) * Math.PI * 2;
          const a1 = ((i + 1) / WHEEL_SEGMENTS) * Math.PI * 2;
          return (
            <path
              key={i}
              d={`M0,0 L${100 * Math.sin(a0)},${-100 * Math.cos(a0)} A100,100 0 0 1 ${100 * Math.sin(a1)},${-100 * Math.cos(a1)} Z`}
              fill={fills[i % fills.length]}
              stroke={brand.edge}
              strokeWidth="0.75"
            />
          );
        })}
        <circle r="62" fill="#0b0c10" stroke={brand.edge} />
      </svg>
      <svg viewBox="0 0 20 16" className="absolute left-1/2 top-0 w-6 -translate-x-1/2 -translate-y-1/3" aria-hidden="true">
        <path d="M0 0h20L10 16z" fill="#ffffff" />
      </svg>
      <div
        className="b4w-fade-late absolute inset-0 flex items-center justify-center text-[36px] md:text-[48px]"
        style={{ ...brand.type, color: brand.accent }}
      >
        2.00×
      </div>
    </div>
  );
}

const FRAMES = {
  keno: KenoFrame,
  mines: MinesFrame,
  plinko: PlinkoFrame,
  dice: DiceFrame,
  crash: CrashFrame,
  wheel: WheelFrame,
};

export default function BrandStudio() {
  const [name, setName] = useState("Emerald Bay");
  const [accent, setAccent] = useState("#47f592");
  const [tile, setTile] = useState("#273654");
  const [fontId, setFontId] = useState(FONTS[0].id);
  const [currency, setCurrency] = useState(CURRENCIES[0]);
  const [game, setGame] = useState("keno");
  // The board is dealt once when the page loads; only a change of typeface or
  // game re-deals it. Colours just repaint — they move under a dragged picker.
  const [switched, setSwitched] = useState(false);
  const Frame = FRAMES[game];
  const font = FONTS.find((f) => f.id === fontId);
  const brand = skin({ name, accent, tile, font, currency });
  const { type } = brand;

  return (
    <section aria-labelledby="studio-heading" className="bg-bg py-16 md:py-24">
      <div className="mx-auto max-w-[1280px] px-5 md:px-12">
        <div className="min-w-0">
          <h2
            id="studio-heading"
            className="b4w-display !mb-0 !text-[clamp(1.8rem,1.2rem+2vw,3rem)] !text-ink"
          >
            Branded to the last pixel
          </h2>
          <p className="!mb-0 mt-3 max-w-xl b4w-copy font-Text text-muted">
            Set a name, two colours and a typeface. The logo, palette and
            controls change; the game underneath doesn&rsquo;t.
          </p>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,7fr)_minmax(0,4fr)] lg:items-stretch">
          {/* --- The game, in the operator's skin ---------------------------- */}
          <div
            className="relative isolate overflow-hidden rounded-lg transition-[box-shadow] duration-200"
            style={{ boxShadow: `0 0 0 1px ${brand.edge}, 0 30px 80px -30px ${brand.accent}55` }}
          >
            <div
              aria-hidden="true"
              className="absolute inset-0 -z-10 transition-[background] duration-200"
              style={{
                background: `radial-gradient(rgba(255, 255, 255, 0.06) 1px, transparent 1px) 0 0 / 22px 22px, radial-gradient(ellipse 70% 55% at 50% 45%, ${brand.accent}24, transparent 70%), linear-gradient(180deg, ${brand.surface}, #050608)`,
              }}
            />

            {/* Operator header */}
            <div
              className="flex items-center justify-between px-4 py-3 transition-colors duration-200 md:px-5"
              style={{ backgroundColor: brand.surface, borderBottom: `1px solid ${brand.edge}` }}
            >
              <div className="flex items-center gap-3">
                <span
                  className="flex h-8 w-8 items-center justify-center rounded-md text-[13px] transition-colors duration-200"
                  style={{ backgroundColor: brand.accent, color: brand.onAccent, ...type }}
                >
                  {brand.mark}
                </span>
                <span key={fontId} className={`text-[18px] text-white ${switched ? "b4w-swap" : ""}`} style={type}>
                  {brand.name}
                </span>
              </div>
              <span
                className="b4w-figure rounded-md px-3 py-1 text-[14px] font-semibold transition-colors duration-200"
                style={{ backgroundColor: brand.tile, color: brand.accent, border: `1px solid ${brand.edge}` }}
              >
                {brand.balance}
              </span>
            </div>

            {/* The board */}
            <div
              key={`${game}-${fontId}`}
              className="flex h-[360px] items-center justify-center px-4 py-7 md:h-[480px] md:py-10"
            >
              <Frame brand={brand} deal={switched} />
            </div>

            {/* Controls */}
            <div
              className="flex flex-wrap items-center gap-2 px-4 py-3 transition-colors duration-200 md:px-5"
              style={{ backgroundColor: brand.surface, borderTop: `1px solid ${brand.edge}` }}
            >
              <span
                className="b4w-figure flex-1 rounded-md px-3 py-2.5 text-[15px] text-white/85"
                style={{ backgroundColor: brand.tile, border: `1px solid ${brand.edge}` }}
              >
                {brand.stake}
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
                className="rounded-md px-6 py-2.5 text-center text-[16px] transition-colors duration-200 max-sm:basis-full"
                style={{ backgroundColor: brand.accent, color: brand.onAccent, ...type }}
              >
                {GAMES[game]}
              </span>
            </div>
          </div>

          {/* --- The theme behind it ------------------------------------------ */}
          <aside aria-labelledby="theme-heading" className="flex flex-col rounded-lg border border-line bg-panel p-5 md:p-6">
            <h3 id="theme-heading" className="!mb-0 font-Text text-[17px] font-bold !text-ink">
              Your theme
            </h3>
            <p className="!mb-0 mt-1.5 font-Text text-[14px] text-muted">
              A very simplified preview of our theming engine. A live theme
              reaches much further, down to backgrounds and in-game art.
            </p>
            <div className="mt-5 flex flex-col gap-4">
              <div>
                <label className={labelCls} htmlFor="studio-name">
                  Brand name
                </label>
                <input
                  id="studio-name"
                  value={name}
                  maxLength={18}
                  placeholder="Your brand"
                  onChange={(e) => setName(e.target.value)}
                  className={inputCls}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2 sm:gap-3 lg:grid-cols-1 xl:grid-cols-2">
                <ColourField id="studio-accent" label="Accent" value={accent} onChange={setAccent} />
                <ColourField id="studio-surface" label="Surface" value={tile} onChange={setTile} />
              </div>
              <div role="group" aria-labelledby="studio-type">
                <span id="studio-type" className={labelCls}>
                  Typeface
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {FONTS.map((f) => {
                    const on = f.id === fontId;
                    return (
                      <button
                        key={f.id}
                        type="button"
                        aria-pressed={on}
                        onClick={() => {
                          setFontId(f.id);
                          setSwitched(true);
                        }}
                        style={{ fontFamily: f.font, ...f.style }}
                        className={`h-[44px] rounded-md border px-2 text-[15px] transition-colors ${
                          on ? "border-white bg-white text-bg" : "border-line text-ink/80 hover:border-ink/50 hover:text-ink"
                        }`}
                      >
                        {f.label}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div>
                <label className={labelCls} htmlFor="studio-currency">
                  Currency
                </label>
                <select
                  id="studio-currency"
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className={inputCls}
                >
                  {CURRENCIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <p className="!mb-0 mt-auto border-t border-line pt-4 font-Text text-[13px] leading-relaxed text-faint max-lg:mt-6">
              Live, it arrives with the game launch as your brand&rsquo;s theme,
              so one change reaches every title at once.
            </p>
          </aside>
        </div>

        {/* --- …and the rest of the catalogue ------------------------------- */}
        <div className="mt-8">
          <p className="!mb-0 font-Text text-[15px] text-muted">The same theme on other games. Pick one to preview it:</p>
          <div role="group" aria-label="Preview game" className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-6">
            {ROW.map((e) => {
              const on = e.slug === game;
              return (
                <button
                  key={e.slug}
                  type="button"
                  aria-pressed={on}
                  onClick={() => {
                    setGame(e.slug);
                    setSwitched(true);
                  }}
                  className={`overflow-hidden rounded-lg text-left transition-[box-shadow,opacity,translate] duration-200 ${
                    on ? "-translate-y-1" : "opacity-70 hover:opacity-100"
                  }`}
                  style={{ boxShadow: `0 0 0 ${on ? 3 : 1}px ${on ? brand.accent : brand.edge}` }}
                >
                  <div className="relative aspect-square">
                    <Image src={e.game.image} alt="" fill sizes="200px" className="object-cover" />
                  </div>
                  <div
                    className="truncate px-2.5 py-2 text-center text-[13px] transition-colors duration-200"
                    style={{ backgroundColor: brand.surface, color: brand.accent, ...type }}
                  >
                    {e.game.title}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
