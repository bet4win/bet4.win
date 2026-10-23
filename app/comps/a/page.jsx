import React from "react";
import Link from "next/link";
import logo from "@/public/assets/img/b4w-logo.svg";
import { catalogue, bySlug } from "../data";

export const metadata = { title: "Comp A — The cast", robots: { index: false } };

// COMP A — "The cast".
// A games publisher's poster: one loud flat field (the gold of the Punch, Chicken
// and Coin wordmarks), a headline at billboard scale, and the catalogue's own
// characters lined up along the bottom edge like a cast photo, standing on the
// lip of the dark lobby below. The page's colour comes from the games; the
// field is there to make them pop.
const INK = "#0d1033";
const GOLD = "#ffc928";

// Left edge (% of the stage), height (px at desktop) and stacking order. Tuned
// by eye so silhouettes overlap without hiding anyone's face.
// Punch enters from the left edge, arm first, so the glove is the first thing
// moving into the frame.
const CAST = [
  { slug: "punch", left: -13, h: 320, z: 2 },
  { slug: "roulette", left: 21, h: 230, z: 3 },
  { slug: "chicken", left: 35, h: 370, z: 5 },
  { slug: "dragon", left: 51, h: 440, z: 4 },
  { slug: "diamond-mine", left: 66, h: 250, z: 3 },
  { slug: "crash", left: 79, h: 330, z: 2 },
  { slug: "coin", left: 89, h: 190, z: 1 },
];

export default function CompA() {
  return (
    <div className="font-Text antialiased" style={{ background: INK }}>
      <section className="relative" style={{ background: GOLD, color: INK }}>
        <nav className="mx-auto flex max-w-[1320px] items-center justify-between px-6 py-6 md:px-12">
          <img src={logo.src} alt="Bet4.win" className="h-8 w-auto" />
          <div className="hidden items-center gap-9 text-[16px] font-semibold lg:flex">
            {["Games", "Platform", "Provably fair", "Branding", "News"].map((l) => (
              <span key={l} className="cursor-pointer hover:underline">
                {l}
              </span>
            ))}
          </div>
          <span
            className="rounded-md px-4 py-2.5 text-[15px] font-bold"
            style={{ background: INK, color: GOLD }}
          >
            Book a demo
          </span>
        </nav>

        <div className="mx-auto max-w-[1320px] px-6 pt-6 md:px-12 md:pt-10">
          <h1
            className="!mb-0 font-Display font-black leading-[0.88] tracking-[-0.035em]"
            style={{ fontStretch: "125%", fontSize: "min(7.2vw, 108px)", color: INK }}
          >
            20 originals.
            <br />
            One integration.
          </h1>

          <div className="mt-8 flex flex-col gap-6 md:mt-10 md:flex-row md:items-end md:justify-between">
            <p className="!mb-0 max-w-[30rem] text-[19px] font-medium leading-[1.45]" style={{ color: INK }}>
              Crash, mines, plinko, cards and roulette, built in-house and
              provably fair. Every title takes your brand, and a new one ships
              each month.
            </p>
            <div className="flex items-center gap-6">
              <span
                className="rounded-md px-6 py-3.5 text-[17px] font-bold"
                style={{ background: INK, color: GOLD }}
              >
                Book a demo
              </span>
              <span className="text-[17px] font-bold underline decoration-2 underline-offset-[6px]">
                Play the games
              </span>
            </div>
          </div>
        </div>

        {/* The cast stands on the boundary: the stage is pulled down so feet
            land on the dark section's top edge and the tallest heads rise into
            the copy's lower margin. */}
        <div className="relative mx-auto -mt-6 h-[300px] max-w-[1320px] md:h-[440px]">
          <div className="absolute inset-x-6 bottom-[-70px] top-0 md:inset-x-12">
            {CAST.map(({ slug, left, h, z }) => (
              <img
                key={slug}
                src={bySlug[slug].art}
                alt={bySlug[slug].title}
                className="absolute bottom-0 w-auto max-w-none"
                style={{
                  left: `${left}%`,
                  height: `min(${h}px, ${(h / 1320) * 100}vw)`,
                  zIndex: z,
                  filter: "drop-shadow(0 22px 22px rgba(13,16,51,0.45))",
                }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* The lobby the cast is standing on. */}
      <section className="relative pb-24 pt-[120px] text-white">
        <div className="mx-auto flex max-w-[1320px] items-end justify-between px-6 md:px-12">
          <h2
            className="!mb-0 font-Display font-black leading-none tracking-[-0.03em] !text-white"
            style={{ fontStretch: "125%", fontSize: "min(4.4vw, 60px)" }}
          >
            The lobby
          </h2>
          <span className="text-[16px] font-semibold" style={{ color: GOLD }}>
            All {catalogue.length} games →
          </span>
        </div>

        <ul
          className="!mb-0 mt-10 flex list-none snap-x gap-5 overflow-x-auto pb-4 [scrollbar-width:none]"
          style={{ paddingInline: "max(24px, calc((100vw - 1320px) / 2 + 48px))", scrollPaddingInline: "max(24px, calc((100vw - 1320px) / 2 + 48px))" }}
        >
          {catalogue.map((g) => (
            <li key={g.slug} className="w-[280px] shrink-0 snap-start md:w-[300px]">
              <Link href={`/games/${g.slug}`} className="group block">
                <div className="relative aspect-[3/4] overflow-hidden rounded-xl">
                  <img
                    src={g.scene}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  <img
                    src={g.art}
                    alt=""
                    className="absolute left-1/2 top-[8%] h-[62%] w-auto max-w-[88%] -translate-x-1/2 object-contain transition-transform duration-500 group-hover:-translate-y-2"
                    style={{ filter: "drop-shadow(0 16px 18px rgba(0,0,0,0.5))" }}
                  />
                  <img
                    src={g.wordmark}
                    alt={g.title}
                    className="absolute bottom-5 left-1/2 max-h-[64px] w-auto max-w-[80%] -translate-x-1/2 object-contain"
                  />
                </div>
                <div className="mt-3 flex items-baseline justify-between text-[15px]">
                  <span className="text-white/70">{g.category}</span>
                  {g.max && <span className="b4w-figure font-bold text-white">{g.max} max</span>}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
