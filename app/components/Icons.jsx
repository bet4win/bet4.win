// The site's icon set: Gravity UI (Yandex, MIT), wrapped once here.
//
// Drawn on a 16px grid with one sturdy stroke and rounded caps. Nearly every
// icon here renders at 16px (`h-4 w-4`), so the strokes land on whole pixels
// instead of being resampled from a 24px drawing, and the weight sits with the
// heavy display face rather than reading as a hairline beside it. It is also
// not the set every other product page uses.
//
// Everything still goes through named exports rather than importing glyphs at
// call sites. That keeps the *choice* of glyph in one file: swapping the icon
// for "fairness" is an edit here, not a sweep across nine components. It also
// means the tree-shaking story stays honest — only the icons named below are
// pulled out of the package.
import React from "react";
import {
  ArrowLeft as GArrowLeft,
  ArrowRight as GArrowRight,
  ArrowRotateRight,
  ArrowUpRight as GArrowUpRight,
  ArrowUpRightFromSquare,
  Bars,
  Calendar as GCalendar,
  Check as GCheck,
  ChevronDown as GChevronDown,
  ChevronLeft as GChevronLeft,
  ChevronRight as GChevronRight,
  Clock as GClock,
  Envelope,
  Ghost as GGhost,
  LogoLinkedin,
  Palette as GPalette,
  PauseFill,
  PlayFill,
  Pulse as GPulse,
  Server as GServer,
  ShieldCheck as GShieldCheck,
  Snowflake as GSnowflake,
  SparklesFill,
  Thunderbolt,
  Xmark,
} from "@gravity-ui/icons";

// Every icon on this site sits beside a label, so the default is decorative.
// A call site that needs the icon announced passes `aria-hidden={false}` and a
// `title`/`aria-label` of its own; nothing does yet.
//
// Sizing stays in CSS (`className="h-4 w-4"`): a CSS width beats the 16px
// width/height attributes the package renders.
function decorative(Glyph, name) {
  const Icon = (props) => <Glyph aria-hidden="true" focusable="false" {...props} />;
  Icon.displayName = name;
  return Icon;
}

// --- Navigation and controls ------------------------------------------------
export const ArrowRight = decorative(GArrowRight, "ArrowRight");
export const ArrowLeft = decorative(GArrowLeft, "ArrowLeft");
export const ArrowUpRight = decorative(GArrowUpRight, "ArrowUpRight");
export const ChevronLeft = decorative(GChevronLeft, "ChevronLeft");
export const ChevronRight = decorative(GChevronRight, "ChevronRight");
export const ChevronDown = decorative(GChevronDown, "ChevronDown");
export const Close = decorative(Xmark, "Close");
export const Menu = decorative(Bars, "Menu");
export const Refresh = decorative(ArrowRotateRight, "Refresh");
export const Play = decorative(PlayFill, "Play");
export const Pause = decorative(PauseFill, "Pause");
// "Leaves this page" — the box-with-an-arrow, not the bare ArrowUpRight above.
// The plain arrow already means "go deeper into the site" wherever it appears
// here, and the demo pop-out is the one control that hands the reader to a
// different origin.
export const ExternalLink = decorative(ArrowUpRightFromSquare, "ExternalLink");

// --- Meaning ----------------------------------------------------------------
// There is no plain `Shield`. Fairness is the only thing a shield stands for on
// this site, and a shield without a tick in it reads as "protected from" rather
// than "verified" — so the only shield available is the one with the check.
export const ShieldCheck = decorative(GShieldCheck, "ShieldCheck");
export const Check = decorative(GCheck, "Check");
export const Bolt = decorative(Thunderbolt, "Bolt");
export const Server = decorative(GServer, "Server");
export const Palette = decorative(GPalette, "Palette");
export const Clock = decorative(GClock, "Clock");
export const Calendar = decorative(GCalendar, "Calendar");
export const Pulse = decorative(GPulse, "Pulse");
export const Sparkle = decorative(SparklesFill, "Sparkle");

// --- Seasons ----------------------------------------------------------------
// One glyph per season the client dresses a game in, named here so
// app/lib/seasons.js can hold the mapping without importing glyphs itself.
// Gravity's stroke is heavy enough to hold at 14px on artwork, so these are the
// line glyphs, matching each other in the launch menu.
export const Ghost = decorative(GGhost, "Ghost");
export const Snowflake = decorative(GSnowflake, "Snowflake");

// --- Contact ----------------------------------------------------------------
export const Linkedin = decorative(LogoLinkedin, "Linkedin");
export const Mail = decorative(Envelope, "Mail");
