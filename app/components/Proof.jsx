import React from "react";
import Section from "./Section";
import Partners from "./Partners";
import Reveal from "./Reveal";
import { claims, pendingClaims } from "@/data/proof";
import { games } from "@/data/games";

const fmt = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });

const live = games.filter((g) => g.status === "active");
const ceiling = live.reduce((max, g) => Math.max(max, g.maxMultiplier || 0), 0);

// The figures an operator actually screens on, at a size they can be read from.
//
// The two claims we already made lived inside a 64px TrustBar strip set in 13px
// muted text, which is where a due-diligence fact goes to be ignored. Both
// competitors give this material a whole section; so does this.
//
// Counts come from the catalogue rather than being typed in, so shipping a new
// original updates the page. See data/proof.js for why the other four slots both
// competitors fill are deliberately empty here.
const derived = [
  { value: String(live.length), label: "Originals live", mono: true },
  ...(ceiling
    ? [{ value: `${fmt.format(ceiling)}×`, label: "Peak multiplier", mono: true }]
    : []),
];

const figures = [
  ...claims,
  ...derived,
  ...pendingClaims.filter((c) => c.value),
];

export default function Proof() {
  return (
    <Section
      surface="high"
      rule
      depth
      ghost="Proof"
      aria-labelledby="proof-heading"
      innerClassName="py-16 md:py-20"
    >
      <Reveal>
        <p className="font-SpaceGrotesk text-[12px] uppercase tracking-[0.08em] text-cyan">
          Diligence
        </p>
        <h2
          id="proof-heading"
          className="mt-2 b4w-display !text-[clamp(2.1rem,1.3rem+2.4vw,3.1rem)] !text-ink"
        >
          Checkable, not claimable
        </h2>
        <p className="mt-4 max-w-xl font-SpaceGrotesk text-[0.95rem] leading-[1.6] text-muted">
          Every figure here is either published elsewhere on this site or counted
          from the live catalogue.
        </p>
      </Reveal>

      <Reveal>
        <dl className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-line bg-line md:grid-cols-4">
          {figures.map((f) => (
            // order swaps them visually so the value reads first, while the DOM
            // keeps dt = term (label) and dd = description (value) — the same
            // pattern the featured-game footer uses.
            <div
              key={f.label}
              className="flex flex-col gap-1.5 bg-panel p-5 md:p-6"
            >
              <dd
                className={`!mb-0 order-1 leading-none !text-cyan ${
                  f.mono
                    ? "font-JetBrainsMono text-[1.5rem] font-semibold tabular-nums"
                    : "b4w-display !text-[1.5rem]"
                }`}
              >
                {f.value}
              </dd>
              <dt className="order-2 font-SpaceGrotesk text-[11px] uppercase tracking-[0.07em] text-muted">
                {f.label}
              </dt>
            </div>
          ))}
        </dl>
      </Reveal>

      <div className="mt-14">
        <Partners />
      </div>
    </Section>
  );
}
