import React from "react";
import Section from "./Section";
import Image from "next/image";
// Static imports → content-hashed, immutably-cacheable asset URLs.
import serverIcon from "@/public/assets/img/icons/gaming/server.png";
import fairIcon from "@/public/assets/img/icons/gaming/fair.png";
import originalsIcon from "@/public/assets/img/icons/gaming/originals.png";
import retentionIcon from "@/public/assets/img/icons/gaming/retention.png";

const items = [
  {
    img: serverIcon,
    title: "Remote Gaming Server (RGS)",
    body: "One battle-tested RGS to launch, manage and report on every game — built for massive concurrency, integrated once and white-labelled as your own.",
  },
  {
    img: fairIcon,
    title: "Provably Fair RNG",
    body: "Certified random number generation. Every result is independently verifiable — trust by math, not by promise.",
  },
  {
    img: originalsIcon,
    title: "Next-gen Originals",
    body: "A curated suite of fast-paced originals — crash, mines, plinko and more — with social, multiplayer and crypto-native mechanics on our provably-fair engine.",
  },
  {
    img: retentionIcon,
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
          className="b4w-display !text-[clamp(1.35rem,1.175rem+0.9vw,1.75rem)] !text-ink"
        >
          Engineered for scale
        </h2>
        <p className="b4w-copy mt-1 font-SpaceGrotesk text-muted">
          The complete infrastructure for modern iGaming operators.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {items.map(({ img, title, body }) => (
          <div
            key={title}
            className="b4w-bezel group relative overflow-hidden rounded-2xl border border-line bg-panel-high p-6 transition-[border-color,translate] duration-300 hover:-translate-y-1 hover:border-accent/45"
          >
            <div className="pointer-events-none absolute -right-16 -top-16 h-32 w-32 rounded-full bg-accent/10 opacity-50 blur-[40px] transition-opacity duration-300 group-hover:opacity-100" />
            {/* w-full is sized for the lg four-up, where the card is ~278px and
                the render lands at ~218px. Below lg the grid drops to two
                columns and then one, so the same rule grew the mark to 292px on
                a phone — larger than it ever gets on a desktop, and the reason
                each of these four cards ran to 570px. Capped until the grid is
                actually narrow enough to want a full-width illustration. */}
            <Image
              src={img}
              alt=""
              width={256}
              height={256}
              className="mb-5 w-full max-w-[7.5rem] object-contain transition-[scale] duration-300 group-hover:scale-105 lg:max-w-none"
            />
            <h3 className="mb-2 font-SpaceGrotesk !text-[clamp(1.05rem,1.006rem+0.225vw,1.15rem)] !font-semibold !text-ink">
              {title}
            </h3>
            <p className="b4w-copy font-SpaceGrotesk text-muted">
              {body}
            </p>
          </div>
        ))}
      </div>
    </Section>
  );
}
