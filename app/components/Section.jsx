import React from "react";

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
  // A full-bleed layer behind the content — a photograph, a wash — rendered
  // before the container. It has to live here rather than in `children`: the
  // container is positioned and max-width, so anything absolutely positioned
  // inside it stops at the gutters.
  backdrop = null,
  // Retired ambient layers (aurora mesh, rising motes, lattice wash). Still
  // accepted so a call site that passes them doesn't spread them onto the
  // <section> as unknown DOM attributes; they render nothing.
  texture: _texture,
  motes: _motes,
  depth: _depth,
  className = "",
  innerClassName = "",
  children,
  ...rest
}) {
  return (
    <section
      className={`relative ${SURFACE_CLASS[surface]}${rule ? " b4w-rule" : ""}${
        className ? ` ${className}` : ""
      }`}
      {...rest}
    >
      {backdrop}
      {/* NOTHING here sets a z-index. An earlier version put `z-10` on the
          content container,
          which made it a stacking context, and the fullscreen game modal nested
          inside the catalogue had its z-9999 resolved *within* that context.
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
