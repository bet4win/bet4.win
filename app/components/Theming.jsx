"use client";
import React, { useState } from "react";
import { Check } from "./Icons";

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
    id: "violet",
    label: "Club Violet",
    initials: "CV",
    accent: "#7C3AED",
    glow: "rgba(124,58,237,0.20)",
    btnText: "#ffffff",
    surface: "#160f2a",
    cellBg: "#221640",
    cellBorder: "rgba(124,58,237,0.18)",
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
    <section id="branding" className="relative overflow-hidden py-20">

      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-50 blur-[130px]"
        style={{
          background:
            "radial-gradient(circle at 68% 38%, rgba(129,140,248,0.13), transparent 55%), radial-gradient(circle at 28% 72%, rgba(37,99,235,0.10), transparent 50%)",
        }}
      />

      <div className="mx-auto grid max-w-[1280px] grid-cols-1 items-center gap-14 px-5 md:px-12 lg:grid-cols-2">

        {/* Copy */}
        <div>
          <span className="mb-5 inline-block rounded border border-violet/30 bg-violet/10 px-2.5 py-1 font-SpaceGrotesk text-[12px] uppercase tracking-[0.06em] text-violet">
            Bespoke branding
          </span>
          <h2 className="mb-4 max-w-md b4w-display !text-[clamp(2rem,1.3rem+2.2vw,3rem)] !text-ink">
            Every pixel,<br />your brand.
          </h2>
          <p className="mb-10 max-w-md font-SpaceGrotesk leading-[1.6] text-muted">
            Hand your players a game that feels native to your platform.
            Colours, logos, typefaces, and background artwork all bend
            to your brand — across every title in the catalogue, at once.
          </p>

          <ul className="flex flex-col gap-4">
            {features.map((f) => (
              <li
                key={f}
                className="flex items-start gap-3 font-SpaceGrotesk text-[0.9rem] text-muted"
              >
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-cyan" />
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
                onClick={() => setBrand(b)}
                className="rounded-lg px-4 py-2 font-SpaceGrotesk text-[11px] uppercase tracking-[0.05em] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                style={
                  b.id === brand.id
                    ? {
                        backgroundColor: `${b.accent}1a`,
                        border: `1px solid ${b.accent}70`,
                        color: b.accent,
                      }
                    : {
                        backgroundColor: "transparent",
                        border: "1px solid #243049",
                        color: "#64748b",
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
    </section>
  );
}
