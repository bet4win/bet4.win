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
export default function Wordmark({
  art,
  alt,
  letter,
  maxWidth = "100%",
  align = "left",
  priority = false,
  sizes,
  className = "",
}) {
  return (
    <Image
      src={art.wordmark}
      alt={alt}
      priority={priority}
      sizes={sizes}
      className={`block w-auto object-contain ${align === "center" ? "mx-auto object-center" : "object-left"} ${className}`}
      style={{ height: `calc(${letter} / ${art.letter || 0.85})`, maxWidth }}
    />
  );
}
