"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";

// A game's wordmark, sized by the height of its LETTERS rather than by its box.
//
// The wordmarks come in every shape — PUNCH is a chunky 2:1 block, AMERICAN
// ROULETTE a 10:1 strip — so fitting each into the same box made one title's
// letters three times the size of the next. `art.letter` (measured at import,
// scripts/import-game-art.mjs) is the share of the image's height the lettering
// takes up; dividing the target letter size by it gives the image height that
// puts every title's letters at about the same size.
//
// `letter` is any CSS length. `maxWidth` still caps the widest marks, which
// then come out smaller — a 10:1 title cannot match a 2:1 one inside a column
// without overflowing it.
//
// `glint` sweeps a band of light across the letters: "arrive" once as it lands,
// "hover" whenever the surrounding `.group` is hovered. The band is masked by
// the file the <img> actually loaded (its currentSrc, so no second download),
// and it only exists once that file is in. Until then the wrapper says
// `data-state="wait"`, which also holds a wipe back (globals.css).
export default function Wordmark({
  art,
  alt,
  letter,
  maxWidth = "100%",
  align = "left",
  priority = false,
  glint = null,
  sizes,
  className = "",
}) {
  const center = align === "center";
  const [src, setSrc] = useState(null);
  // Unset on the server, so the server's HTML never hides a wordmark.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <span
      data-state={src ? "ready" : mounted ? "wait" : undefined}
      className={`b4w-wordmark relative block w-fit ${center ? "mx-auto" : ""} ${className}`}
      style={{ maxWidth }}
    >
      <Image
        src={art.wordmark}
        alt={alt}
        priority={priority}
        // A wordmark that wipes on is held clipped to nothing until it loads,
        // and Chrome never lazy-loads an image clipped to nothing.
        loading={priority || glint !== "arrive" ? undefined : "eager"}
        sizes={sizes}
        onLoad={(e) => setSrc(e.currentTarget.currentSrc || e.currentTarget.src)}
        className={`block w-auto max-w-full object-contain ${center ? "object-center" : "object-left"}`}
        style={{ height: `calc(${letter} / ${art.letter || 0.85})` }}
      />
      {glint && src && (
        <span
          aria-hidden="true"
          className={`b4w-glint b4w-glint--${glint}`}
          style={{
            "--glint-mask": `url("${src}")`,
            "--glint-pos": center ? "center" : "left center",
          }}
        />
      )}
    </span>
  );
}

// `sizes` for a wordmark set at a letter height between `small` (phones) and
// `large` px, no wider than `cap` px: the width it really draws at, which is
// the letter height over its share of the image, times the image's aspect.
export function wordmarkSizes(art, { small, large, cap, phoneCap = 350 }) {
  const aspect = art.wordmark.width / art.wordmark.height;
  const at = (px, max) => Math.ceil(Math.min(max, (px / (art.letter || 0.85)) * aspect));
  return `(max-width: 767px) ${at(small, phoneCap)}px, ${at(large, cap)}px`;
}
