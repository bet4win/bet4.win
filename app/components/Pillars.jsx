import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "./Icons";
import { claims } from "@/data/proof";
import { artFor } from "@/data/gameArt";
import CertMark from "./CertMark";

// What an operator gets besides the games, and the page that proves each part.
// Three tall panels, each set in a game's room so the section belongs to the
// same world as the stage above it: the rocket's launch sky for the platform,
// the dice table for fairness, the gem cavern for branding.
//
// The certified figures come from data/proof.js, the same source the platform
// page reads, so they are stated once and only where they can be evidenced.
const uptime = claims.find((c) => c.label === "Platform uptime")?.value;

const PILLARS = [
  {
    title: "One integration, the whole catalogue",
    body: `A certified RGS and RNG behind every game we ship. Next month's release arrives as a config change${
      uptime ? `, on a platform running at ${uptime} uptime` : ""
    }.`,
    href: "/platform",
    link: "How the platform works",
    scene: "crash",
  },
  {
    title: "Players can check every round",
    body: "The server seed is hashed and shown before the bet, which fixes the outcome in advance. After the round, anyone can recompute it in the browser.",
    href: "/provably-fair",
    link: "How verification works",
    scene: "dice",
    cert: true,
  },
  {
    title: "Your brand on every game",
    body: "Colours, logos, typefaces and background art follow your brand. Set them once and they land on every title in the catalogue.",
    href: "/branding",
    link: "See the branding options",
    scene: "diamonds",
  },
];

export default function Pillars() {
  return (
    <section aria-labelledby="pillars-heading" className="bg-bg py-12">
      <div className="mx-auto max-w-[1280px] px-5 md:px-12">
        <h2
          id="pillars-heading"
          className="b4w-display !mb-0 max-w-3xl !text-[clamp(1.8rem,1.2rem+2vw,3rem)] !text-ink"
        >
          What comes with the integration
        </h2>

        <ul className="!mb-0 mt-8 grid list-none gap-5 p-0 md:mt-10 md:grid-cols-3 [&>li]:h-full">
          {PILLARS.map((p) => (
            <li key={p.href}>
              <Link
                href={p.href}
                className="group relative isolate flex h-full min-h-[420px] flex-col overflow-hidden rounded-xl p-6 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand md:min-h-[430px] md:p-7"
              >
                <Image
                  src={artFor(p.scene).scene}
                  alt=""
                  fill
                  sizes="(min-width:768px) 33vw, 100vw"
                  className="-z-10 object-cover brightness-125 transition-transform duration-700 group-hover:scale-105"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 -z-10 bg-gradient-to-t from-black/90 via-black/45 via-45% to-transparent"
                />
                {/* The same box, at the same place, on every panel. The cut-outs
                    are cropped to their outline at import, so object-contain
                    sizes each one to the box rather than to its canvas. */}
                <div className="relative mb-auto h-[160px] md:h-[170px]">
                  <Image
                    src={artFor(p.scene).art}
                    alt=""
                    fill
                    sizes="(min-width:768px) 25vw, 70vw"
                    className="object-contain drop-shadow-[0_20px_24px_rgba(0,0,0,0.55)] transition-transform duration-500 group-hover:-translate-y-1.5"
                  />
                </div>
                <h3 className="!mb-0 mt-8 font-Display text-[clamp(1.2rem,1.05rem+0.6vw,1.5rem)] font-extrabold !leading-[1.05] tracking-[-0.02em] !text-ink [font-stretch:125%]">
                  {p.title}
                </h3>
                <p className="!mb-0 mt-3 b4w-copy font-Text text-ink/80">{p.body}</p>
                {p.cert && <CertMark tone="light" className="mt-3 !text-[13px]" />}
                <span className="mt-5 inline-flex items-center gap-2 font-Text text-[15px] font-semibold text-ink">
                  {p.link}
                  <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
