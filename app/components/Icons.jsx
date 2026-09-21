// The site's icon set: Remix Icon, wrapped once here.
//
// This file used to hold fourteen hand-drawn SVG paths. They were serviceable
// but inconsistent — different optical weights, different corner radii, and a
// shield that had to be drawn twice because one of the two call sites wanted a
// tick in it. Remix Icon is a real system: 24px grid, one stroke weight, and a
// `Line`/`Fill` pair for every glyph, so a badge and an outline can be the same
// icon at two weights instead of two drawings that nearly match.
//
// Everything still goes through named exports rather than importing `Ri*` at
// call sites. That keeps the *choice* of glyph in one file: swapping the icon
// for "fairness" is an edit here, not a sweep across nine components. It also
// means the tree-shaking story stays honest — only the icons named below are
// pulled out of the package.
import React from "react";
import {
  RiArrowDownSLine,
  RiArrowLeftLine,
  RiArrowLeftSLine,
  RiArrowRightLine,
  RiArrowRightSLine,
  RiArrowRightUpLine,
  RiCalendarEventLine,
  RiCheckLine,
  RiCloseLine,
  RiFlashlightLine,
  RiGhostFill,
  RiLinkedinFill,
  RiMailLine,
  RiMenuLine,
  RiPaletteLine,
  RiPlayFill,
  RiPulseLine,
  RiRefreshLine,
  RiServerLine,
  RiShieldCheckLine,
  RiSparklingFill,
  RiTimeLine,
} from "@remixicon/react";

// Every icon on this site sits beside a label, so the default is decorative.
// A call site that needs the icon announced passes `aria-hidden={false}` and a
// `title`/`aria-label` of its own; nothing does yet.
//
// Sizing stays in CSS (`className="h-4 w-4"`). Remix renders width/height
// attributes at its default 24, and a CSS width beats a presentation attribute,
// so the utilities at the call sites keep working exactly as they did.
function decorative(Glyph, name) {
  const Icon = (props) => <Glyph aria-hidden="true" focusable="false" {...props} />;
  Icon.displayName = name;
  return Icon;
}

// --- Navigation and controls ------------------------------------------------
export const ArrowRight = decorative(RiArrowRightLine, "ArrowRight");
export const ArrowLeft = decorative(RiArrowLeftLine, "ArrowLeft");
export const ArrowUpRight = decorative(RiArrowRightUpLine, "ArrowUpRight");
export const ChevronLeft = decorative(RiArrowLeftSLine, "ChevronLeft");
export const ChevronRight = decorative(RiArrowRightSLine, "ChevronRight");
export const ChevronDown = decorative(RiArrowDownSLine, "ChevronDown");
export const Close = decorative(RiCloseLine, "Close");
export const Menu = decorative(RiMenuLine, "Menu");
export const Refresh = decorative(RiRefreshLine, "Refresh");
export const Play = decorative(RiPlayFill, "Play");

// --- Meaning ----------------------------------------------------------------
// There is no plain `Shield`. Fairness is the only thing a shield stands for on
// this site, and a shield without a tick in it reads as "protected from" rather
// than "verified" — so the only shield available is the one with the check.
export const ShieldCheck = decorative(RiShieldCheckLine, "ShieldCheck");
export const Check = decorative(RiCheckLine, "Check");
export const Bolt = decorative(RiFlashlightLine, "Bolt");
export const Server = decorative(RiServerLine, "Server");
export const Palette = decorative(RiPaletteLine, "Palette");
export const Clock = decorative(RiTimeLine, "Clock");
export const Calendar = decorative(RiCalendarEventLine, "Calendar");
export const Pulse = decorative(RiPulseLine, "Pulse");
export const Sparkle = decorative(RiSparklingFill, "Sparkle");

// --- Seasons ----------------------------------------------------------------
// One glyph per season the client dresses a game in, named here so
// app/lib/seasons.js can hold the mapping without importing `Ri*` itself.
// `Fill` for both, because they render at 14px inside a chip on artwork: a
// hairline outline at that size against a photograph is a smudge, and the two
// have to read as one set when they are stacked in the launch menu.
export const Ghost = decorative(RiGhostFill, "Ghost");

// --- Contact ----------------------------------------------------------------
// The `Fill` weight for LinkedIn and the `Line` weight for mail, deliberately:
// LinkedIn's mark is a solid glyph everywhere it is published and a hairline
// outline of it reads as a different logo, while a filled envelope beside it
// would be the heaviest thing in the footer.
export const Linkedin = decorative(RiLinkedinFill, "Linkedin");
export const Mail = decorative(RiMailLine, "Mail");
