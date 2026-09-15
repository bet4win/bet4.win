import React from "react";
import Section from "./Section";
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
      // Raised. The homepage surfaces strictly alternate, and the roadmap now
      // sits between the catalogue and this one — so everything from here down
      // flips to keep bands from doubling up. See the order in app/page.jsx.
      surface="raised"
      rule
      depth
      aria-labelledby="proof-heading"
      innerClassName="py-16 md:py-20"
    >
      <Reveal>
        <p className="font-SpaceGrotesk text-[12px] uppercase tracking-[0.08em] text-accent">
          Diligence
        </p>
        <h2
          id="proof-heading"
          className="mt-2 b4w-display !text-[clamp(2.1rem,1.3rem+2.4vw,3.1rem)] !text-ink"
        >
          Checkable, not claimable
        </h2>
        {/* Addressed to the person who has to sign this off, not to us.
            The previous line — "every figure here is either published elsewhere
            on this site or counted from the live catalogue" — was the house rule
            from the top of data/proof.js pasted onto the page: passive, about
            our editorial process, and of no use to a reader deciding whether to
            integrate. The rule still holds; it just belongs in the data file.
            What belongs here is the consequence of it, which is the one thing on
            this section worth saying out loud: the empty slots are the argument. */}
        {/* 2xl, not the xl the other section intros use: at xl this sets to
            three lines with "the page." alone on the last one, and
            `text-wrap: pretty` does not help because it only rescues a
            single-word last line. Widening the measure was the cheaper fix —
            cutting the sentence down to fit was making it terse and cryptic,
            which is the opposite of what this paragraph is for. */}
        <p className="mt-4 max-w-2xl font-SpaceGrotesk text-[0.95rem] leading-[1.6] text-muted [text-wrap:pretty]">
          Ask your compliance team what they&rsquo;d want evidenced. Everything
          here survives that conversation — and anything we can&rsquo;t evidence
          yet isn&rsquo;t on the page.
        </p>
      </Reveal>

      <Reveal>
        <dl className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-4">
          {figures.map((f) => (
            // order swaps them visually so the value reads first, while the DOM
            // keeps dt = term (label) and dd = description (value) — the same
            // pattern the featured-game footer uses.
            <div
              key={f.label}
              className="flex flex-col gap-1.5 bg-panel-high/70 p-5 backdrop-blur-md md:p-6"
            >
              <dd
                className={`!mb-0 order-1 leading-none !text-accent ${
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
    </Section>
  );
}
