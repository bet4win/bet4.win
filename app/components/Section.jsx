"use client";
import React, { useEffect, useRef } from "react";
import Motes from "./Motes";
import { registerParallax } from "@/app/lib/parallax";

// Full-bleed surface outside, max-width container inside.
//
// Every homepage section used to be written as
//   <section className="mx-auto max-w-[1280px] px-5">
// which made the section element its own content container — so there was no
// full-bleed element left to paint a background onto, and the whole page
// rendered as one unbroken #0b1120 field. Splitting the two roles is what lets
// the surface change from section to section.

// Two surfaces, strictly alternating down the page. There used to be three, and
// three reads as three separate decisions rather than one rhythm — a page has a
// floor and a raised band, not a gradient of moods. panel-high is now purely a
// card fill, so a card always sits one step above whatever it is resting on.
const SURFACE_CLASS = {
  base: "bg-bg",
  raised: "bg-panel",
};

export default function Section({
  surface = "base",
  rule = false,
  depth = false,
  // Drifting gradient mesh. Reserved for the sections that can carry it — every
  // section wearing texture is the same as none of them doing.
  texture = false,
  // Rising embers. Strictly a sub-set of `texture`: the motes are the loudest
  // ambient layer, so they only appear where the aurora already is, and only on
  // the two sections that open and close the page.
  motes = 0,
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

  // The grid wash is wider than the section, so the x-axis is clipped to stop it
  // scrolling the page sideways on phones. The ambient texture layers overflow
  // on BOTH axes (the mesh animates out to scale 1.09), so those sections clip
  // both — otherwise it drifts into its neighbours. Clip
  // rather than hidden: see the note on .b4w-contain-x in globals.css for why
  // making these scroll containers breaks anchor scrolling.
  const clip = texture ? " b4w-contain" : depth ? " b4w-contain-x" : "";

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
          {/* Two washes, not one: the cool pair drifts one way on a 34s cycle,
              the warm pair the other way on 47s. Co-prime-ish periods are the
              whole trick — with a single layer the eye learns the loop inside a
              minute and the atmosphere turns into a tic. */}
          <span aria-hidden="true" className="b4w-mesh" />
          <span aria-hidden="true" className="b4w-mesh b4w-mesh--warm" />
        </>
      )}
      {motes > 0 && <Motes count={motes} />}
      {/* Decoration first, content last, and NOTHING here sets a z-index.
          Every layer is position:absolute/relative with z-index:auto, so they
          paint in tree order — mesh, grid wash, then content. That is
          deliberate: an earlier version put `z-10` on the content container,
          which made it a stacking context, and the fullscreen game modal nested
          inside <GamesPreview> had its z-9999 resolved *within* that context.
          The sticky z-50 header then painted over a modal that was supposed to
          cover the screen. Same class of trap as the transform note in
          Reveal.jsx. */}
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
