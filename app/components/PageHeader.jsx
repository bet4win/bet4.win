import React from "react";
import Image from "next/image";
import { artFor } from "@/data/gameArt";

// Opening band for an interior page: the page's single <h1> plus the framing the
// section below it doesn't provide. The sections keep their own <h2>, so each
// page ends up with one h1 and a real heading hierarchy under it.
//
// `scene` sets the band in a game's room, the way the home stage is, so an
// interior page opens in the same world the homepage does. `art` adds that
// game's cut-out hero on the right. Pages that are mostly reading (a news post,
// the legal pages) pass neither and open on the plain floor.
//
// `titleSize` exists because a page title is a fixed phrase somebody chose
// ("The catalogue") and a news headline is a sentence whose length nobody
// controls; posts step the clamp down a size rather than every page shrinking
// to accommodate them. The floors are set by the longest unbreakable word any
// title contains — "integration." on /platform — which has to fit the 340px a
// 390px phone has between its gutters.
const TITLE_SIZE = {
  default: "!text-[clamp(1.75rem,1.2rem+2.6vw,3.6rem)] max-[359px]:!text-[1.5rem]",
  sm: "!text-[clamp(1.6rem,1.2rem+1.7vw,2.6rem)] max-[359px]:!text-[1.4rem]",
};

export default function PageHeader({
  eyebrow,
  title,
  intro,
  titleSize = "default",
  scene,
  art,
  children,
}) {
  const sceneArt = scene ? artFor(scene) : null;
  const heroArt = art ? artFor(art) : null;

  return (
    <section className={`relative isolate overflow-hidden bg-bg ${sceneArt ? "border-b border-line/60" : ""}`}>
      {sceneArt && (
        <>
          <Image src={sceneArt.scene} alt="" fill priority sizes="100vw" quality={90} className="b4w-settle-scene -z-10 object-cover" />
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(8,9,14,0.94)_0%,rgba(8,9,14,0.7)_45%,rgba(8,9,14,0.2)_85%)] max-md:bg-[rgba(8,9,14,0.72)]"
          />
          <div aria-hidden="true" className="absolute inset-x-0 -bottom-px -z-10 h-24 bg-gradient-to-t from-bg to-transparent" />
        </>
      )}

      <div
        className={`mx-auto grid max-w-[1280px] items-center gap-8 px-5 md:px-12 ${
          sceneArt ? "py-14 md:py-20" : "pb-6 pt-10 md:pb-8 md:pt-20"
        } ${heroArt ? "md:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]" : ""}`}
      >
        <div>
          {eyebrow && (
            <p className="!mb-0 font-Text text-[15px] font-semibold text-brand">{eyebrow}</p>
          )}
          <h1 className={`b4w-display max-w-3xl !text-ink ${eyebrow ? "mt-4" : ""} ${TITLE_SIZE[titleSize]}`}>
            {title}
          </h1>
          {intro && (
            <p className="mt-5 max-w-2xl b4w-copy--lead font-Text text-ink/80">{intro}</p>
          )}
          {children}
        </div>
        {heroArt && (
          <div className="relative hidden h-[300px] md:block lg:h-[360px]">
            <Image
              src={heroArt.art}
              alt=""
              fill
              priority
              sizes="(min-width:768px) 40vw, 0px"
              className="b4w-land-hero object-contain drop-shadow-[0_24px_32px_rgba(0,0,0,0.55)]"
            />
          </div>
        )}
      </div>
    </section>
  );
}
