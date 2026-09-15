"use client";
import React, { useState } from "react";
import { Check, Palette } from "./Icons";
import Section from "./Section";

// Three fictional operator brands, chosen to be as far apart as three casino
// palettes realistically get — warm gold, crimson, aqua. None of them is ours,
// which is the point: this panel exists to show that the catalogue wears
// somebody else's colours, so it must not look like it is wearing ours.
//
// The middle slot used to be a violet. It was dropped for the same reason the
// site's own surfaces were: violet beside the gold above it read as a
// competitor's pair, on our own homepage, in the one component whose whole job
// is showing off brands.
const brands = [
  {
    id: "amber",
    label: "Golden Palace",
    initials: "GP",
    accent: "#E8A045",
    glow: "rgba(232,160,69,0.20)",
    btnText: "#1a0c00",
    surface: "#14202e",
    cellBg: "#1b2d3f",
    cellBorder: "rgba(232,160,69,0.18)",
  },
  {
    id: "crimson",
    label: "Rouge Club",
    initials: "RC",
    accent: "#E0394B",
    glow: "rgba(224,57,75,0.20)",
    btnText: "#ffffff",
    surface: "#1d0f13",
    cellBg: "#2c171c",
    cellBorder: "rgba(224,57,75,0.18)",
  },
  {
    id: "cyan",
    label: "AquaSpin",
    initials: "AS",
    accent: "#22D3EE",
    glow: "rgba(34,211,238,0.20)",
    btnText: "#001a18",
    surface: "#0c1e1c",
    cellBg: "#112a28",
    cellBorder: "rgba(34,211,238,0.18)",
  },
];

const features = [
  "Swap the colour palette globally — one change lands across every game",
  "Drop in your logo, set your typeface, and theme backgrounds per title",
  "Full-bleed artwork and textured chrome for a truly immersive feel",
  "Social-casino language and freeplay mode, ready to activate",
];

const cells = Array.from({ length: 25 });

export default function Theming() {
  const [brand, setBrand] = useState(brands[0]);

  return (
    <Section id="branding" surface="raised" rule texture innerClassName="py-12 md:py-20">
      <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-14">

        {/* Copy */}
        <div>
          <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1.5 font-SpaceGrotesk text-[11px] font-semibold uppercase tracking-[0.1em] text-accent">
            <Palette className="h-3.5 w-3.5" />
            Bespoke branding
          </span>
          <h2 className="mb-4 max-w-md b4w-display !text-[clamp(2rem,1.3rem+2.2vw,3rem)] max-[359px]:!text-[1.75rem] !text-ink">
            Every pixel,<br />your brand.
          </h2>
          <p className="mb-10 max-w-md b4w-copy font-SpaceGrotesk text-muted">
            Hand your players a game that feels native to your platform.
            Colours, logos, typefaces, and background artwork all bend
            to your brand — across every title in the catalogue, at once.
          </p>

          <ul className="flex flex-col gap-4">
            {features.map((f) => (
              <li
                key={f}
                className="flex items-start gap-3 b4w-copy font-SpaceGrotesk text-muted"
              >
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-accent/30 bg-accent/10 text-accent">
                  <Check className="h-3.5 w-3.5" />
                </span>
                {f}
              </li>
            ))}
          </ul>
        </div>

        {/* Interactive brand preview */}
        <div className="flex flex-col items-center gap-5">

          {/* Game mockup */}
          <div
            className="w-full max-w-[340px] overflow-hidden rounded-2xl transition-all duration-500"
            style={{
              backgroundColor: brand.surface,
              border: `1px solid ${brand.cellBorder}`,
              boxShadow: `0 0 56px ${brand.glow}, 0 0 0 1px ${brand.cellBorder}`,
            }}
          >
            {/* Topbar */}
            <div
              className="flex items-center justify-between px-4 py-3"
              style={{ borderBottom: `1px solid ${brand.cellBorder}` }}
            >
              <div className="flex items-center gap-2.5">
                <span
                  className="flex h-6 w-6 items-center justify-center rounded font-SpaceGrotesk text-[10px] font-bold transition-colors duration-500"
                  style={{ backgroundColor: brand.accent, color: brand.btnText }}
                >
                  {brand.initials}
                </span>
                <span className="font-SpaceGrotesk text-[13px] font-semibold text-ink transition-all duration-500">
                  {brand.label}
                </span>
              </div>
              <span className="font-SpaceGrotesk text-[11px] text-muted">
                ◎ 1,000.00
              </span>
            </div>

            {/* Game label */}
            <div className="px-4 pb-1.5 pt-3">
              <span className="font-SpaceGrotesk text-[10px] uppercase tracking-[0.08em] text-muted">
                Mines
              </span>
            </div>

            {/* 5×5 grid */}
            <div className="grid grid-cols-5 gap-1.5 px-4 pb-3">
              {cells.map((_, i) => (
                <div
                  key={i}
                  className="aspect-square rounded-lg transition-colors duration-500"
                  style={{
                    backgroundColor: brand.cellBg,
                    border: `1px solid ${brand.cellBorder}`,
                  }}
                />
              ))}
            </div>

            {/* Action bar */}
            <div
              className="flex items-center gap-2 px-4 py-3"
              style={{ borderTop: `1px solid ${brand.cellBorder}` }}
            >
              <div
                className="flex-1 rounded-lg px-3 py-2 font-SpaceGrotesk text-[12px] text-muted"
                style={{
                  backgroundColor: brand.cellBg,
                  border: `1px solid ${brand.cellBorder}`,
                }}
              >
                100.00
              </div>
              <div className="flex gap-1">
                {["½", "2×"].map((q) => (
                  <div
                    key={q}
                    className="rounded-lg px-2 py-2 font-SpaceGrotesk text-[11px] text-muted transition-colors duration-500"
                    style={{
                      backgroundColor: brand.cellBg,
                      border: `1px solid ${brand.cellBorder}`,
                    }}
                  >
                    {q}
                  </div>
                ))}
              </div>
              <div
                className="flex-1 rounded-lg py-2 text-center font-SpaceGrotesk text-[12px] font-bold uppercase tracking-[0.06em] transition-colors duration-500"
                style={{ backgroundColor: brand.accent, color: brand.btnText }}
              >
                Play
              </div>
            </div>
          </div>

          {/* Brand selector */}
          <div className="flex gap-2">
            {brands.map((b) => (
              <button
                key={b.id}
                type="button"
                onClick={() => setBrand(b)}
                aria-pressed={b.id === brand.id}
                // The one place on the site where a control's colour is NOT
                // ours: each pill wears the brand it switches to, which is the
                // whole point being demonstrated.
                className="b4w-btn b4w-btn--sm min-h-[44px] sm:min-h-0"
                style={
                  b.id === brand.id
                    ? {
                        backgroundColor: `${b.accent}1f`,
                        borderColor: `${b.accent}80`,
                        color: b.accent,
                      }
                    : {
                        backgroundColor: "transparent",
                        borderColor: "var(--color-line)",
                        color: "var(--color-faint)",
                      }
                }
              >
                {b.label}
              </button>
            ))}
          </div>

          <p className="font-SpaceGrotesk text-[11px] uppercase tracking-[0.06em] text-faint">
            Try switching brands ↑
          </p>
        </div>

      </div>
    </Section>
  );
}
