import React from "react";
import relaxGaming from "@/public/assets/img/partners/relax-gaming.svg";
import revolverGaming from "@/public/assets/img/partners/revolver-gaming.png";

// Both marks are already white/silver, so they sit on the dark canvas without a
// grayscale filter — only opacity is dialled back so they read as supporting
// evidence rather than competing with the page's own brand.
//
// Third-party trade marks, shown for identification only (see /terms clause 7).
// Heights are tuned per lockup, not shared: Relax is a wordmark, Revolver pairs
// a badge with a two-line wordmark, so matching their pixel heights would leave
// Revolver's type visibly smaller. These values match them optically instead.
const PARTNERS = [
  { name: "Relax Gaming", src: relaxGaming, height: 30 },
  { name: "Revolver Gaming", src: revolverGaming, height: 42 },
];

// Centred label above the logos, inside a hairline-ruled band. Only two logos,
// so it stays a single deliberate line rather than a grid — a wide multi-column
// wall with two entries reads as unfinished. The label sits a step brighter than
// it first did, which is the difference between quiet and overlooked.
export default function Partners() {
  return (
    <section
      aria-labelledby="partners-heading"
      className="mx-auto max-w-[1280px] px-5 py-12 md:px-12"
    >
      <div className="flex flex-col items-center gap-7 border-y border-line/60 py-10">
        <h2
          id="partners-heading"
          className="!mb-0 text-center font-SpaceGrotesk !text-[14px] !font-semibold uppercase !tracking-[0.16em] !text-muted"
        >
          Partners
        </h2>
        <ul className="flex flex-wrap items-center justify-center gap-x-16 gap-y-8">
          {PARTNERS.map((p) => (
            <li key={p.name}>
              <img
                src={p.src.src}
                alt={p.name}
                width={p.src.width}
                height={p.src.height}
                loading="lazy"
                className="w-auto opacity-70 transition-opacity duration-300 hover:opacity-100"
                style={{ height: `${p.height}px` }}
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
