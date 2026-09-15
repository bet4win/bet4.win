"use client";
import React from "react";
import Section from "./Section";
import Reveal from "./Reveal";
import { ArrowRight } from "./Icons";
import { trackEvent } from "@/app/lib/analytics";

// What's coming, on a rail.
//
// The catalogue section above this one answers "what can I take today". This one
// answers the question an operator asks straight afterwards — "and then what" —
// which is the whole basis of the "a new original every month" claim the site
// leads with. A list of names would state the claim; a dated rail evidences it.
//
// `releases` is computed on the server and handed down (see app/page.jsx) rather
// than being derived here. The "This month" label depends on today's date, and a
// client component deriving that from its own clock would disagree with the
// server's markup for anyone rendering across a month boundary — the same
// hydration trap the events-strip countdown hit.
export default function Roadmap({ releases }) {
  if (!releases?.length) return null;

  return (
    <Section
      id="roadmap"
      surface="raised"
      rule
      // The same -45° drafting hatch the plates on this section's own cards
      // wear, at section scale. "In production" looks like something in
      // production.
      depth="hatch"
      aria-labelledby="roadmap-heading"
      innerClassName="py-12 md:py-20"
    >
      <Reveal>
        <p className="font-SpaceGrotesk text-[12px] uppercase tracking-[0.08em] text-accent">
          In production
        </p>
        <h2
          id="roadmap-heading"
          className="mt-2 b4w-display !text-[clamp(2.1rem,1.3rem+2.4vw,3.1rem)] max-[359px]:!text-[1.8rem] !text-ink"
        >
          What ships next
        </h2>
        <p className="mt-4 max-w-xl b4w-copy font-SpaceGrotesk text-muted">
          One original a month, named and dated. Each one arrives on the
          integration you already have — nothing to re-certify, nothing to
          rebuild.
        </p>
      </Reveal>

      <Reveal>
        <div className="relative mt-7 md:mt-12">
          {/* The rail. Lit at the near end, neutral through the middle, and gone
              by the right-hand edge — the fade is the argument for the button
              underneath it. Only drawn at lg, where the grid is a single row and
              the nodes actually line up along one axis; below that the nodes
              read perfectly well as ticks on their own. */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-[5px] hidden h-px bg-[linear-gradient(90deg,var(--color-accent)_0%,var(--color-line)_46%,transparent_96%)] lg:block"
          />

          {/* auto-FILL, not auto-fit, and not a fixed `lg:grid-cols-4`.
              The number of announced titles changes — it is four one quarter and
              two the next — and the card should not change size with it. Fixed
              columns left two cards squeezed into half a row; auto-fit would
              have stretched them to 600px each and turned the title band into a
              billboard. auto-fill keeps the track width constant and simply
              leaves the surplus tracks empty, which is the truthful picture:
              the rail runs on past the last announced title into open space,
              and the button underneath is what continues it. */}
          <ol className="grid gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-[repeat(auto-fill,minmax(250px,1fr))]">
            {releases.map((r) => (
              // Two layouts, because there are two contexts.
              //
              // Below lg there is no rail: the dot and the month are one line in
              // normal flow, dot first, reading as a label on the card under it.
              // They used to be two absolutely-positioned elements stacked
              // inside 45px of reserved padding, which on a phone read as a
              // stray dot with a caption beneath it.
              //
              // At lg the rail appears and the two separate again — the dot goes
              // ON the line and the month goes BELOW it. They cannot share a y
              // there: the rail sits at top-[5px] and 11px type on the same
              // centre puts the hairline straight through the middle of the
              // capitals.
              <li key={r.id} className="relative flex flex-col lg:block lg:pt-9">
                <p
                  className={`!mb-0 flex items-center whitespace-nowrap font-JetBrainsMono text-[11px] uppercase leading-none tracking-[0.08em] lg:absolute lg:left-0 lg:top-[15px] lg:block ${
                    r.isNext ? "text-accent" : "text-faint"
                  }`}
                >
                  {/* Out of flow at lg, 15px back up the li, so its centre lands
                      on the rail's own y while the month sits clear underneath.
                      mr-2 rather than a `gap` on the parent: the parent is only
                      a flex container below lg, and the separator below needs
                      its own spacing either way — a gap would double up on it. */}
                  <span
                    aria-hidden="true"
                    className={`mr-2 h-2.5 w-2.5 shrink-0 rounded-full border lg:absolute lg:left-0 lg:top-[-15px] ${
                      r.isNext
                        ? "border-accent bg-accent"
                        : "border-line bg-panel-high"
                    }`}
                  />
                  {/* The month is the axis, so it is always the month — "This
                      month" alone would have been the one node on the rail you
                      could not place against the others. The nearest release is
                      marked beside it instead. */}
                  {r.label}
                  {r.isNext && (
                    // ml-1, not a leading space in the string: below lg this is a
                    // flex item, flex items are blockified, and leading
                    // whitespace inside a block is collapsed away.
                    <span className="ml-1 text-accent">
                      {r.isThisMonth ? "· This month" : "· Next"}
                    </span>
                  )}
                </p>

                {/* flex-1 below lg (the li is a flex column, so the card takes
                    the slack and every plate in a row ends on the same line);
                    h-full at lg, where the li is a block again. */}
                <article
                  className={`b4w-bezel mt-3 flex flex-1 flex-col overflow-hidden rounded-2xl border bg-panel-high lg:mt-0 lg:h-full ${
                    r.isNext ? "border-accent/45" : "border-line"
                  }`}
                >
                  {/* The plate. These titles have no key art — not "we haven't
                      picked any yet" but "it isn't drawn": the art team is
                      working on games that ship after these. Rendering a
                      placeholder game tile would promise a look nobody has
                      approved, so the plate shows the one thing that IS settled,
                      the name, set as artwork on a punched sheet. */}
                  {/* Wider ratio on phones. The plate is an aspect box, so at
                      one column it is as wide as the screen — at 2:1 that is
                      170px of empty hatch above the name. 3:1 keeps it a title
                      band until the grid splits into columns. */}
                  <div className="b4w-plate relative flex aspect-[3/1] items-end border-b border-line/70 bg-bg p-4 sm:aspect-[2/1]">
                    {/* `relative` on purpose: the plate's texture is an
                        absolutely-positioned ::before, and a positioned
                        pseudo-element paints over its in-flow siblings. */}
                    <h3 className="relative !mb-0 b4w-display !text-[clamp(1.35rem,1rem+1vw,1.85rem)] !leading-[0.92] !text-ink [text-wrap:balance]">
                      {r.title}
                    </h3>
                  </div>

                  <div className="flex flex-1 flex-col gap-3 p-4">
                    <span className="w-fit rounded-full border border-line bg-bg/60 px-1.5 py-0.5 font-SpaceGrotesk text-[9px] font-semibold uppercase tracking-[0.1em] text-muted">
                      {r.category}
                    </span>
                    <p className="!mb-0 b4w-copy font-SpaceGrotesk text-muted">
                      {r.teaser}
                    </p>
                  </div>
                </article>
              </li>
            ))}
          </ol>
        </div>
      </Reveal>

      {/* Sits under the faded end of the rail on desktop: the line runs out, and
          this is what continues it. */}
      <Reveal>
        <div className="mt-8 flex flex-col items-start gap-4 border-t border-line/50 pt-6 sm:flex-row sm:items-center sm:justify-between md:mt-10 md:pt-8">
          <p className="!mb-0 max-w-md b4w-copy font-SpaceGrotesk text-muted">
            The public rail stops here. The full schedule — mechanics, dates and
            the titles we haven&rsquo;t announced — goes out under NDA.
          </p>
          <a
            href="mailto:info@bet4.win?subject=Full%20roadmap%20request"
            onClick={() =>
              trackEvent("cta_click", {
                label: "request_roadmap",
                cta_type: "email",
              })
            }
            className="b4w-btn b4w-btn--ghost b4w-btn--lg"
          >
            Request full roadmap
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </Reveal>
    </Section>
  );
}
