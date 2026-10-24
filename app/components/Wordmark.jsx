import React from "react";
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
// the wordmark file itself, so a glinting mark is served unoptimised — the
// mask and the picture are then one download (the files are 900px webp).
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
  return (
    <span
      className={`b4w-wordmark relative block w-fit ${center ? "mx-auto" : ""} ${className}`}
      style={{ maxWidth }}
    >
      <Image
        src={art.wordmark}
        alt={alt}
        priority={priority}
        sizes={sizes}
        unoptimized={glint === "arrive"}
        className={`block w-auto max-w-full object-contain ${center ? "object-center" : "object-left"}`}
        style={{ height: `calc(${letter} / ${art.letter || 0.85})` }}
      />
      {glint && (
        <span
          aria-hidden="true"
          className={`b4w-glint b4w-glint--${glint}`}
          style={{
            "--glint-mask": `url("${art.wordmark.src}")`,
            "--glint-pos": center ? "center" : "left center",
          }}
        />
      )}
    </span>
  );
}
