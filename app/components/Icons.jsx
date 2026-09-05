// Minimal inline-SVG icon set for the dark studio homepage.
// Stroke-based, inherits `currentColor`, no external icon font.
import React from "react";

const base = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  viewBox: "0 0 24 24",
  "aria-hidden": true,
};

export const ArrowRight = (p) => (
  <svg {...base} {...p}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

export const Shield = (p) => (
  <svg {...base} {...p}>
    <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" />
  </svg>
);

export const ShieldCheck = (p) => (
  <svg {...base} {...p}>
    <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" />
    <path d="M9 12l2 2 4-4" />
  </svg>
);

export const Check = (p) => (
  <svg {...base} {...p}>
    <path d="M5 12l4 4 10-10" />
  </svg>
);

export const Bolt = (p) => (
  <svg {...base} {...p}>
    <path d="M13 3L4 14h7l-1 7 9-11h-7l1-7z" />
  </svg>
);

export const Server = (p) => (
  <svg {...base} {...p}>
    <rect x="4" y="4" width="16" height="7" rx="1.5" />
    <rect x="4" y="13" width="16" height="7" rx="1.5" />
    <path d="M8 7.5h.01M8 16.5h.01" />
  </svg>
);

export const Lock = (p) => (
  <svg {...base} {...p}>
    <rect x="5" y="11" width="14" height="9" rx="2" />
    <path d="M8 11V8a4 4 0 0 1 8 0v3" />
  </svg>
);

export const Grid = (p) => (
  <svg {...base} {...p}>
    <rect x="4" y="4" width="7" height="7" rx="1.5" />
    <rect x="13" y="4" width="7" height="7" rx="1.5" />
    <rect x="4" y="13" width="7" height="7" rx="1.5" />
    <rect x="13" y="13" width="7" height="7" rx="1.5" />
  </svg>
);

export const TrendingUp = (p) => (
  <svg {...base} {...p}>
    <path d="M4 16l5-5 4 4 7-7" />
    <path d="M15 8h5v5" />
  </svg>
);

export const Terminal = (p) => (
  <svg {...base} {...p}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="M7 10l3 2-3 2M13 14h4" />
  </svg>
);

export const Braces = (p) => (
  <svg {...base} {...p}>
    <path d="M8 4c-2 0-2 2-2 4s0 3-2 4c2 1 2 2 2 4s0 4 2 4" />
    <path d="M16 4c2 0 2 2 2 4s0 3 2 4c-2 1-2 2-2 4s0 4-2 4" />
  </svg>
);

export const Clock = (p) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="12" r="8" />
    <path d="M12 8v4l3 2" />
  </svg>
);

export const Refresh = (p) => (
  <svg {...base} {...p}>
    <path d="M20 11a8 8 0 1 0-.6 4" />
    <path d="M20 4v7h-7" />
  </svg>
);

export const Play = (p) => (
  <svg {...base} fill="currentColor" stroke="none" viewBox="0 0 24 24" aria-hidden {...p}>
    <path d="M8 5.5v13l11-6.5-11-6.5z" />
  </svg>
);
