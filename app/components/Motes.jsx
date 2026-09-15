import React from "react";

// A sparse field of embers lifting through a section.
//
// The positions are a fixed table rather than Math.random(): these render on the
// server, and a random field would differ between the server HTML and the first
// client render — a hydration mismatch for pure decoration. A hand-tuned table
// is also better looking. Random points clump; these are spread across the width
// with irregular gaps, which is what "scattered" actually looks like.
//
// Two colours only, and mostly accent: the field has to read as one thing drifting
// through the room, not as confetti.
const FIELD = [
  { x: "6%", size: 2, dur: 26, delay: 0, drift: 18, peak: 0.5 },
  { x: "14%", size: 3, dur: 34, delay: -9, drift: -14, peak: 0.36, cool: true },
  { x: "23%", size: 2, dur: 22, delay: -17, drift: 10, peak: 0.55 },
  { x: "31%", size: 4, dur: 39, delay: -4, drift: 22, peak: 0.3 },
  { x: "42%", size: 2, dur: 29, delay: -22, drift: -18, peak: 0.45, cool: true },
  { x: "49%", size: 3, dur: 24, delay: -13, drift: 12, peak: 0.42 },
  { x: "57%", size: 2, dur: 36, delay: -28, drift: -10, peak: 0.5 },
  { x: "64%", size: 3, dur: 31, delay: -6, drift: 16, peak: 0.33, cool: true },
  { x: "72%", size: 2, dur: 27, delay: -19, drift: -20, peak: 0.52 },
  { x: "79%", size: 4, dur: 41, delay: -11, drift: 14, peak: 0.28 },
  { x: "86%", size: 2, dur: 23, delay: -25, drift: -12, peak: 0.48 },
  { x: "94%", size: 3, dur: 33, delay: -2, drift: 20, peak: 0.38, cool: true },
];

// `count` trims from the end of the table, so a narrow or short section can
// carry a thinner field without the spacing collapsing to one side.
export default function Motes({ count = FIELD.length, className = "" }) {
  return (
    <span
      aria-hidden="true"
      className={`b4w-motes${className ? ` ${className}` : ""}`}
    >
      {FIELD.slice(0, count).map((m, i) => (
        <span
          key={i}
          className="b4w-mote"
          style={{
            "--mote-x": m.x,
            "--mote-size": `${m.size}px`,
            "--mote-dur": `${m.dur}s`,
            // Negative delays start each mote part-way through its own cycle, so
            // the field is already populated on the first frame instead of
            // fading up all at once.
            "--mote-delay": `${m.delay}s`,
            "--mote-drift": `${m.drift}px`,
            "--mote-peak": m.peak,
            "--mote-colour": m.cool
              ? "var(--color-brand)"
              : "var(--color-accent)",
          }}
        />
      ))}
    </span>
  );
}
