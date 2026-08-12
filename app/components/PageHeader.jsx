import React from "react";

// Opening band for an interior page: the page's single <h1> plus the framing the
// section below it doesn't provide. The sections keep their own <h2>, so each
// page ends up with one h1 and a real heading hierarchy under it.
export default function PageHeader({ eyebrow, title, intro, children }) {
  return (
    <section className="mx-auto max-w-[1280px] px-5 pb-4 pt-32 md:px-12 md:pt-40">
      {eyebrow && (
        <p className="font-SpaceGrotesk text-[12px] uppercase tracking-[0.1em] text-cyan">
          {eyebrow}
        </p>
      )}
      <h1 className="b4w-display mt-3 max-w-3xl !text-[clamp(2.4rem,1.5rem+2.8vw,3.6rem)] !text-ink">
        {title}
      </h1>
      {intro && (
        <p className="mt-5 max-w-2xl font-SpaceGrotesk text-[1.05rem] leading-[1.65] text-muted">
          {intro}
        </p>
      )}
      {children}
    </section>
  );
}
