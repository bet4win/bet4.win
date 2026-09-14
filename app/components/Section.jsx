"use client";
import React, { useEffect, useRef } from "react";
import { registerParallax } from "@/app/lib/parallax";

// Full-bleed surface outside, max-width container inside.
//
// Every homepage section used to be written as
//   <section className="mx-auto max-w-[1280px] px-5">
// which made the section element its own content container — so there was no
// full-bleed element left to paint a background onto, and the whole page
// rendered as one unbroken #0b1120 field. Splitting the two roles is what lets
// the surface change from section to section.

// Three steps, chosen because they are the ones you can actually see. Measured
// against --color-bg: panel-low is 1.007:1 (invisible — it is a card fill, not a
// surface), panel is 1.105:1 and panel-high is 1.202:1. The first pass of this
// used panel-low for the middle step and the page looked exactly as flat as
// before, because it was.
const SURFACE_CLASS = {
  base: "bg-bg",
  raised: "bg-panel",
  high: "bg-panel-high",
};

export default function Section({
  surface = "base",
  rule = false,
  depth = false,
  // Drifting gradient mesh + animated grain. Reserved for the sections that can
  // carry it — every section wearing texture is the same as none of them doing.
  texture = false,
  ghost,
  className = "",
  innerClassName = "",
  children,
  ...rest
}) {
  const ref = useRef(null);

  // Publishes --sy while the section is on screen; the grid wash and the
  // watermark translate against it so the backdrop drifts relative to the
  // content instead of moving with it. No-ops under reduced motion.
  useEffect(() => registerParallax(ref.current), []);

  // The grid wash, the mesh and the oversized watermark are all deliberately
  // wider than the section; clipping the x-axis keeps them from scrolling the
  // page sideways on phones. Clip rather than hidden, and on one axis only —
  // see the note on .b4w-contain-x in globals.css for why <html> must stay
  // scrollable.
  const clip = depth || ghost || texture ? " b4w-contain-x" : "";

  return (
    <section
      ref={ref}
      className={`relative ${SURFACE_CLASS[surface]}${rule ? " b4w-rule" : ""}${
        depth ? " b4w-grid" : ""
      }${clip}${className ? ` ${className}` : ""}`}
      {...rest}
    >
      {texture && (
        <>
          <span aria-hidden="true" className="b4w-mesh" />
          <span aria-hidden="true" className="b4w-grain" />
        </>
      )}
      {/* Decoration first, content last, and NOTHING here sets a z-index.
          Every layer is position:absolute/relative with z-index:auto, so they
          paint in tree order — grid wash, then ghost, then content. That is
          deliberate: an earlier version put `z-10` on the content container,
          which made it a stacking context, and the fullscreen game modal nested
          inside <GamesPreview> had its z-9999 resolved *within* that context.
          The sticky z-50 header then painted over a modal that was supposed to
          cover the screen. Same class of trap as the transform note in
          Reveal.jsx. */}
      {ghost && (
        <span aria-hidden="true" className="b4w-ghost">
          {ghost}
        </span>
      )}
      <div
        className={`relative mx-auto max-w-[1280px] px-5 md:px-12${
          innerClassName ? ` ${innerClassName}` : ""
        }`}
      >
        {children}
      </div>
    </section>
  );
}
