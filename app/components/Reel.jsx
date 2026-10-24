import React from "react";

const STRIP = "012345678901234567890".split("");

// A figure that rolls onto its value like a reel landing (see .b4w-reel).
// Digits roll; everything else — separators, %, ×, words — just stands there.
// Remount it (a `key`) to roll again.
export default function Reel({ value }) {
  const text = String(value);
  if (!/\d/.test(text)) return text;

  let k = 0;
  return (
    <>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true" className="b4w-reel">
        {text.split("").map((ch, i) =>
          /\d/.test(ch) ? (
            <span key={i}>
              <span className="b4w-reel-strip" style={{ "--v": Number(ch), "--k": k++ }}>
                {STRIP.map((d, j) => (
                  <span key={j}>{d}</span>
                ))}
              </span>
            </span>
          ) : (
            <span key={i}>{ch === " " ? " " : ch}</span>
          ),
        )}
      </span>
    </>
  );
}
