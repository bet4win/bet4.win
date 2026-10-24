import React from "react";

// Seasonal weather over a game's room: the snow the Christmas builds fall
// through, the embers of the Halloween ones. Positions come from a fixed seed,
// so server and client draw the same sky.
function seeded(seed) {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function particles(count, seed, make) {
  const r = seeded(seed);
  return Array.from({ length: count }, () => make(r));
}

const SNOW = particles(42, 7, (r) => {
  const t = 10 + r() * 10;
  return {
    "--x": `${(r() * 100).toFixed(1)}%`,
    "--s": `${(2 + r() * 3.5).toFixed(1)}px`,
    "--o": (0.35 + r() * 0.5).toFixed(2),
    "--b": `${(r() * 1.6).toFixed(1)}px`,
    "--t": `${t.toFixed(1)}s`,
    "--d": `${(-r() * t).toFixed(1)}s`,
    "--sway": `${((r() - 0.5) * 70).toFixed(0)}px`,
  };
});

const EMBERS = particles(22, 31, (r) => {
  const t = 7 + r() * 7;
  return {
    "--x": `${(r() * 100).toFixed(1)}%`,
    "--s": `${(2 + r() * 2).toFixed(1)}px`,
    "--o": (0.5 + r() * 0.45).toFixed(2),
    "--t": `${t.toFixed(1)}s`,
    "--d": `${(-r() * t).toFixed(1)}s`,
    "--sway": `${((r() - 0.5) * 90).toFixed(0)}px`,
  };
});

const KINDS = { christmas: ["snow", SNOW], halloween: ["embers", EMBERS] };

export default function Weather({ season, className = "" }) {
  const kind = KINDS[season];
  if (!kind) return null;
  const [name, list] = kind;
  return (
    <div
      aria-hidden="true"
      className={`b4w-weather b4w-weather--${name} pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      {list.map((style, i) => (
        <i key={i} style={style} />
      ))}
    </div>
  );
}
