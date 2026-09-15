import React from "react";
import Link from "next/link";
import Section from "./Section";
import { ArrowRight, Palette, Server, ShieldCheck } from "./Icons";
import { games } from "@/data/games";

const LIVE_COUNT = games.filter((g) => g.status === "active").length;

// The three interior pages, each with a picture of what is actually behind the
// door rather than a generic glyph.
//
// The block used to be three identical cards carrying three identical 20px
// icons in three identical rounded squares — the layout said "here are three
// equivalent things", which is both untrue (the platform page is the one an
// operator has to read first) and most of why none of them got clicked. Now the
// platform gets the wide card and its own diagram; fairness and branding sit
// beside it at half the size with theirs.
const LINKS = [
  {
    href: "/platform",
    icon: Server,
    label: "Platform",
    title: "One integration. The whole catalogue.",
    body: "A certified RGS, one API, and every original we ship behind it — connect once and next month's release arrives as a config change.",
    art: PlatformArt,
    feature: true,
  },
  {
    href: "/provably-fair",
    icon: ShieldCheck,
    label: "Provably fair",
    title: "Verify every result yourself.",
    body: "Commit, reveal, recompute. Check a live round in the browser.",
    art: FairnessArt,
  },
  {
    href: "/branding",
    icon: Palette,
    label: "Branding",
    title: "Every pixel, your brand.",
    body: "Swap the palette once; it lands across the whole catalogue.",
    art: BrandingArt,
  },
];

export default function ExploreLinks() {
  const [feature, ...rest] = LINKS;

  return (
    <Section
      // Raised — see the note in GamesPreview.jsx. The alternation inverted
      // when the catalogue moved to the floor.
      surface="raised"
      rule
      aria-labelledby="explore-heading"
      innerClassName="py-16 md:py-20"
    >
      <div className="mb-8 flex items-baseline gap-4">
        <h2
          id="explore-heading"
          className="!mb-0 font-SpaceGrotesk !text-[12px] !font-normal uppercase !tracking-[0.1em] !text-faint"
        >
          Explore
        </h2>
        <span aria-hidden="true" className="h-px flex-1 bg-line/60" />
      </div>

      <div className="grid gap-4 md:grid-cols-12">
        <Door {...feature} className="md:col-span-7" />
        <div className="flex flex-col gap-4 md:col-span-5">
          {rest.map((link) => (
            <Door key={link.href} {...link} />
          ))}
        </div>
      </div>
    </Section>
  );
}

function Door({
  href,
  icon: Icon,
  label,
  title,
  body,
  art: Art,
  feature = false,
  className = "",
}) {
  return (
    <Link
      href={href}
      // The lift, the shadow and the timing live on .b4w-door in globals.css.
      // The border warm has to stay a utility: `border-line` below is one too,
      // and the utilities layer outranks the components layer whatever the
      // specificity, so a components-layer border-color would never land.
      className={`b4w-door b4w-bezel group relative flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-panel-high hover:border-accent/45 focus-visible:border-accent/45 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-panel${
        className ? ` ${className}` : ""
      }`}
    >
      {/* The diagram sits on the darker floor colour, so it reads as a window
          cut into the card rather than as clip art laid on top of it. */}
      <div
        aria-hidden="true"
        // The feature's diagram GROWS. Its card is as tall as the two beside it
        // stacked, and a fixed-height art window left ~140px of empty card
        // under the copy; letting the window take the slack puts the picture
        // where the dead space was.
        className={`relative overflow-hidden border-b border-line/70 bg-bg/60 ${
          feature ? "min-h-[212px] flex-1" : "h-[128px]"
        }`}
      >
        <Art />
        {/* Grounds the diagram into the body copy below it. */}
        <span className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-panel-high to-transparent" />
      </div>

      <div className={`flex flex-col ${feature ? "p-7" : "flex-1 p-6"}`}>
        <p className="!mb-0 flex items-center gap-2 font-SpaceGrotesk text-[11px] uppercase tracking-[0.1em] text-accent">
          <Icon className="h-4 w-4" />
          {label}
        </p>
        <p
          className={`!mb-0 mt-3 font-SpaceGrotesk font-semibold !leading-[1.22] !tracking-[-0.015em] !text-ink ${
            feature ? "text-[1.6rem]" : "text-[1.15rem]"
          }`}
        >
          {title}
        </p>
        <p
          className={`!mb-0 mt-3 font-SpaceGrotesk leading-[1.6] text-muted ${
            feature ? "max-w-md text-[0.98rem]" : "text-[0.9rem]"
          }`}
        >
          {body}
        </p>
        {/* mt-auto so the CTAs line up even when the titles above them wrap to
            different numbers of lines. */}
        <span className="mt-auto inline-flex items-center gap-1.5 pt-5 font-SpaceGrotesk text-[12px] uppercase tracking-[0.06em] text-ink">
          Read more
          {/* transition-[translate], not transition-transform: Tailwind v4's
              translate-x-1 sets the `translate` property, which a transform
              transition does not cover. The arrow was jumping, not sliding. */}
          <ArrowRight className="h-4 w-4 text-accent transition-[translate] duration-300 group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}

// --- The three diagrams ------------------------------------------------------

// One endpoint, wired out to the live catalogue. The count under the stack is
// the real number of live titles, so the picture can't drift from the data.
function PlatformArt() {
  const rows = [0, 1, 2, 3, 4,];
  return (
    <div className="absolute inset-0 flex items-center justify-center px-5">
      <svg
        viewBox="0 0 320 140"
        className="h-full w-full max-w-[430px]"
        fill="none"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Wires, drawn twice: a dim static line, then a dashed overlay whose
            dashes are the packets. One path with a dash pattern would give a
            dotted wire; two gives a wire with traffic on it. */}
        {rows.map((i) => {
          const y = 26 + i * 22;
          const d = `M100 70 C 152 70, 160 ${y}, 212 ${y}`;
          return (
            <g key={i}>
              <path d={d} stroke="var(--color-line)" strokeWidth="1.25" />
              <path
                d={d}
                className="b4w-flow"
                stroke="var(--color-accent)"
                strokeWidth="1.75"
                strokeLinecap="round"
                // Negative, so the five wires open already staggered instead of
                // sitting still until a positive delay elapses. What the eye
                // reads is the 12-unit dash period (1.125s at this speed), not
                // the 4.5s cycle — 0.9s steps land the rows 1/5 of a dash apart,
                // so no two wires ever show their packets in line.
                style={{ animationDelay: `-${i * 0.9}s` }}
              />
            </g>
          );
        })}

        {/* The endpoint */}
        <rect
          x="16"
          y="53"
          width="84"
          height="34"
          rx="17"
          fill="var(--color-panel-high)"
          stroke="var(--color-brand)"
          strokeWidth="1.25"
        />
        <text
          className="font-JetBrainsMono"
          x="58"
          y="74"
          textAnchor="middle"
          fontSize="11"
          fill="var(--color-brand)"
        >
          /launch
        </text>

        {/* The catalogue */}
        {rows.map((i) => (
          <rect
            key={i}
            x="212"
            y={26 + i * 22 - 8}
            width="94"
            height="16"
            rx="5"
            fill="var(--color-panel-high)"
            stroke="var(--color-line)"
            strokeWidth="1"
          />
        ))}
        <text
          className="font-JetBrainsMono"
          x="259"
          y="138"
          textAnchor="middle"
          fontSize="10"
          fill="var(--color-faint)"
        >
          {LIVE_COUNT} games
        </text>
      </svg>
    </div>
  );
}

// A committed hash resolving to one result. The strings are fixed, not random:
// this renders on the server, and a random hash would differ between the server
// HTML and the first client render.
const HASH_ROWS = [
  "a3f9c1e8 7b40d2aa 65cf1903 e8b7",
  "commit → client seed → nonce",
  "9f2e11c4 0a83bd57 4e6120fa 71dc",
];

function FairnessArt() {
  return (
    <div className="absolute inset-0 flex flex-col justify-center gap-2 px-5">
      {HASH_ROWS.map((row, i) => (
        <p
          key={row}
          className={`!mb-0 truncate font-JetBrainsMono text-[10px] leading-[1.5] tracking-[0.02em] ${
            i === 1 ? "b4w-settle text-accent" : "text-faint/60"
          }`}
        >
          {row}
        </p>
      ))}
      {/* The seal. Oversized and running off the edge, so it reads as stamped
          onto the record rather than as another icon in a row. */}
      <ShieldCheck className="absolute -right-4 top-1/2 h-24 w-24 -translate-y-1/2 text-accent/20" />
    </div>
  );
}

// The same game mockup, re-skinning itself. Three stops, matching the three
// demo brands the /branding switcher offers.
function BrandingArt() {
  const cells = Array.from({ length: 12 });
  // Three of the twelve take the brand colour, and so does the action bar. A
  // grid where every cell changes reads as a disco rather than as a theme
  // landing on a game.
  const branded = new Set([2, 7, 9]);
  return (
    <div className="absolute inset-0 flex items-center gap-4 px-5">
      {/* Six across, two down. The window is 128px tall, so a four-column grid
          of square cells is 280px of grid in 128px of space — it overflowed the
          card and the bottom row was cut in half. */}
      <div className="grid flex-1 grid-cols-6 gap-1.5">
        {cells.map((_, i) => (
          <span
            key={i}
            className={`aspect-square rounded-[5px] border border-line/70 ${
              branded.has(i) ? "b4w-rebrand" : "bg-panel-high"
            }`}
            style={branded.has(i) ? { animationDelay: `${i * 0.1}s` } : undefined}
          />
        ))}
      </div>
      <div className="flex w-[78px] shrink-0 flex-col gap-2">
        <span className="h-2 w-full rounded-full bg-line/80" />
        <span className="h-2 w-2/3 rounded-full bg-line/50" />
        <span className="b4w-rebrand h-6 w-full rounded-full" />
      </div>
    </div>
  );
}
