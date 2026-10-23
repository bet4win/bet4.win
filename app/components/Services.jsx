import React from "react";
import Section from "./Section";
// Static imports → content-hashed, immutably-cacheable asset URLs.

const items = [
  {
    title: "Remote Gaming Server (RGS)",
    body: "One battle-tested RGS to launch, manage and report on every game — built for massive concurrency, integrated once and white-labelled as your own.",
  },
  {
    title: "Provably Fair RNG",
    body: "Certified random number generation. Every result is independently verifiable — trust by math, not by promise.",
  },
  {
    title: "Next-gen Originals",
    body: "A curated suite of fast-paced originals — crash, mines, plinko and more — with social, multiplayer and crypto-native mechanics on our provably-fair engine.",
  },
  {
    title: "Promos & Retention",
    body: "Tournaments, free bets, jackpots and leaderboards via API — the levers that lift player lifetime value.",
  },
];

export default function Services() {
  return (
    <Section
      id="platform"
      surface="base"
      rule
      aria-labelledby="platform-heading"
      innerClassName="py-12 md:py-20"
    >
      <div className="mb-7 md:mb-10">
        <h2
          id="platform-heading"
          className="b4w-display !text-[clamp(1.6rem,1.15rem+1.6vw,2.4rem)] !text-ink"
        >
          Engineered for scale
        </h2>
        <p className="b4w-copy mt-1 font-Text text-muted">
          The complete infrastructure for modern iGaming operators.
        </p>
      </div>

      {/* Four capabilities as four columns of type under a rule. They used to
          be four glossy 3D icons in glowing cards — stock illustration that
          said "technology" and nothing about this platform. */}
      <div className="grid grid-cols-1 gap-x-10 gap-y-10 md:grid-cols-2 lg:grid-cols-4">
        {items.map(({ title, body }) => (
          <div key={title} className="border-t border-line pt-5">
            <h3 className="!mb-0 font-Display text-[clamp(1.15rem,1rem+0.5vw,1.4rem)] font-extrabold !leading-[1.1] tracking-[-0.02em] !text-ink [font-stretch:125%]">
              {title}
            </h3>
            <p className="!mb-0 mt-3 b4w-copy font-Text text-muted">{body}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}
