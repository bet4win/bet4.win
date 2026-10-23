import React from "react";
import Image from "next/image";
import { artFor } from "@/data/gameArt";

// How branding actually happens, in the order it happens, and what is in scope.
// Numbered because it is a sequence; each step is something the operator does
// or receives, not a feature.
const STEPS = [
  {
    title: "Send us your brand",
    body: "Logo, palette, typeface and any background art you want used. Your brand guidelines are the brief.",
  },
  {
    title: "We build your theme",
    body: "One theme for your brand, not a skin per game. Every title reads it when it opens.",
  },
  {
    title: "Review it on demo links",
    body: "Every game in your colours, on links you can pass round your product and compliance teams before anything goes live.",
  },
  {
    title: "Switch it on",
    body: "Your launches carry your brand from then on — and next month's release arrives already wearing it.",
  },
];

// What a theme covers. The last one is the exception that proves the rule:
// a title's own art can be redrawn for a brand, and Punch already ships that way.
const SCOPE = [
  ["Colour palette", "Buttons, surfaces, highlights and win states, from your colours."],
  ["Logo", "In the game header and on the loading screen."],
  ["Typeface", "Your brand's type in the game's controls and figures."],
  ["Backgrounds", "Each title's room, retinted or replaced with your art."],
  ["Wording", "Social-casino language and a freeplay mode, for sweepstakes and free-to-play brands."],
  ["Game art, on request", "A title's own characters and props redrawn for your brand."],
];

const PUNCH = artFor("punch");

export default function BrandProcess() {
  return (
    <>
      <section aria-labelledby="process-heading" className="bg-panel py-16 md:py-24">
        <div className="mx-auto max-w-[1280px] px-5 md:px-12">
          <h2
            id="process-heading"
            className="b4w-display !mb-0 !text-[clamp(1.8rem,1.2rem+2vw,3rem)] !text-ink"
          >
            How it works
          </h2>
          <ol className="!mb-0 mt-10 grid list-none gap-x-8 gap-y-10 p-0 md:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s, i) => (
              <li key={s.title} className="relative border-t-2 border-white/90 pt-5">
                <span className="b4w-figure font-Display text-[44px] font-extrabold leading-none text-white/15 [font-stretch:125%]">
                  {i + 1}
                </span>
                <h3 className="!mb-0 mt-3 font-Text text-[19px] font-bold !leading-snug !text-ink">{s.title}</h3>
                <p className="!mb-0 mt-2 b4w-copy font-Text text-muted">{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section aria-labelledby="scope-heading" className="relative isolate overflow-hidden bg-bg py-16 md:py-24">
        <div className="mx-auto grid max-w-[1280px] gap-10 px-5 md:px-12 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:items-center lg:gap-14">
          <div>
            <h2
              id="scope-heading"
              className="b4w-display !mb-0 !text-[clamp(1.8rem,1.2rem+2vw,3rem)] !text-ink"
            >
              What a theme changes
            </h2>
            <dl className="!mb-0 mt-8 grid gap-x-8 sm:grid-cols-2">
              {SCOPE.map(([k, v]) => (
                <div key={k} className="border-t border-line py-4">
                  <dt className="font-Text text-[17px] font-bold text-ink">{k}</dt>
                  <dd className="!mb-0 mt-1 b4w-copy font-Text text-muted">{v}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* The on-request case, shown rather than described: Punch's own art. */}
          <figure className="!mb-0 relative isolate overflow-hidden rounded-xl">
            <div className="relative aspect-[4/5]">
              <Image src={PUNCH.scene} alt="" fill sizes="(min-width:992px) 40vw, 100vw" className="-z-10 object-cover" />
              <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
              <Image
                src={PUNCH.art}
                alt="Punch's heavy bag and glove"
                fill
                sizes="(min-width:992px) 40vw, 100vw"
                className="!inset-x-[8%] !top-[8%] !h-[70%] !w-[84%] object-contain drop-shadow-[0_20px_30px_rgba(0,0,0,0.6)]"
              />
            </div>
            <figcaption className="absolute inset-x-0 bottom-0 p-5 font-Text text-[15px] text-ink/85">
              <span className="font-semibold text-ink">Punch</span> ships its bag,
              gloves and gym as a per-brand art pack, so a branded launch can change
              the game itself, not just its frame.
            </figcaption>
          </figure>
        </div>
      </section>
    </>
  );
}
