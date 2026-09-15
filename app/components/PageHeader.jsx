import React from "react";
import Section from "./Section";

// Opening band for an interior page: the page's single <h1> plus the framing the
// section below it doesn't provide. The sections keep their own <h2>, so each
// page ends up with one h1 and a real heading hierarchy under it.
//
// Rendered through <Section> so an interior page opens on the same lit canvas
// the homepage hero does — the grid wash, the two aurora layers and a thin field
// of motes. It used to be a bare <section> on flat colour, which is why every
// interior page started colder than the page that linked to it.
// `titleSize` exists for one reason: a page title is a fixed phrase somebody
// chose ("The catalogue", "News") and a news headline is a sentence whose length
// nobody controls. At the poster size the page titles want, a three-line
// headline in the display face takes over the screen — so posts step the clamp
// down a size rather than every page shrinking to accommodate them.
const TITLE_SIZE = {
  default: "!text-[clamp(2.4rem,1.5rem+2.8vw,3.6rem)]",
  sm: "!text-[clamp(1.9rem,1.35rem+1.9vw,2.7rem)]",
};

export default function PageHeader({
  eyebrow,
  title,
  intro,
  titleSize = "default",
  children,
}) {
  return (
    <Section
      surface="base"
      depth
      texture
      motes={7}
      // Reduced from pt-32/md:pt-40 when the header went from fixed to sticky —
      // that padding existed only to clear a header that no longer overlaps.
      innerClassName="pb-8 pt-16 md:pt-24"
    >
      {eyebrow && (
        <p className="!mb-0 flex items-center gap-3 font-SpaceGrotesk text-[11px] uppercase tracking-[0.12em] text-accent">
          {eyebrow}
          <span aria-hidden="true" className="h-px w-12 bg-accent/40" />
        </p>
      )}
      <h1
        className={`b4w-display mt-4 max-w-3xl !text-ink ${TITLE_SIZE[titleSize]}`}
      >
        {title}
      </h1>
      {intro && (
        <p className="mt-5 max-w-2xl font-SpaceGrotesk text-[1.05rem] leading-[1.65] text-muted">
          {intro}
        </p>
      )}
      {children}
    </Section>
  );
}
