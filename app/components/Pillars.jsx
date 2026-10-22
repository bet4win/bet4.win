import React from "react";
import Link from "next/link";
import Section from "./Section";
import { ArrowRight } from "./Icons";
import { claims } from "@/data/proof";

// What an operator gets besides the games, and the page that proves each part.
// Three columns of prose on the page's own floor. It replaces three things that
// said the same in louder ways: a strip of icon-in-a-disc slogans, a grid of
// glass stat tiles, and three "door" cards with animated diagrams.
//
// The certified figures come from data/proof.js, the same source the platform
// page reads, so they are stated once and only where they can be evidenced.
const uptime = claims.find((c) => c.label === "Platform uptime")?.value;

const PILLARS = [
  {
    title: "The whole catalogue on one API",
    body: `A certified RGS and RNG with one integration behind every game we ship. Next month's release arrives as a config change${
      uptime ? `, on a platform running at ${uptime} uptime` : ""
    }.`,
    href: "/platform",
    link: "How the platform works",
  },
  {
    title: "Players can check every round",
    body: "The server seed is hashed and shown before the bet, which fixes the outcome in advance. After the round, anyone can recompute it in the browser.",
    href: "/provably-fair",
    link: "How verification works",
  },
  {
    title: "Your brand on every game",
    body: "Colours, logos, typefaces and background art follow your brand. Set them once and they land on every title in the catalogue.",
    href: "/branding",
    link: "See the branding options",
  },
];

export default function Pillars() {
  return (
    <Section
      surface="base"
      aria-labelledby="pillars-heading"
      innerClassName="py-14 md:py-20"
    >
      <h2
        id="pillars-heading"
        className="b4w-display !mb-0 max-w-2xl !text-[clamp(1.7rem,1.2rem+1.6vw,2.4rem)] !text-ink"
      >
        What comes with the integration
      </h2>

      <div className="mt-8 grid gap-10 md:mt-12 md:grid-cols-3 md:gap-12">
        {PILLARS.map((p) => (
          <div key={p.href} className="flex flex-col items-start border-t border-line pt-5">
            <h3 className="!mb-0 font-Text text-[clamp(1.05rem,0.95rem+0.4vw,1.25rem)] font-bold !leading-snug !text-ink">
              {p.title}
            </h3>
            <p className="!mb-0 mt-3 b4w-copy font-Text text-muted">{p.body}</p>
            <Link href={p.href} className="b4w-btn b4w-btn--quiet -ml-1 mt-4">
              {p.link}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ))}
      </div>
    </Section>
  );
}
