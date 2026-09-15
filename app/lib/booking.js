"use client";

// Opening the booking dialog from anywhere.
//
// The five booking CTAs live in four components — the header (twice), the
// footer, the closing CTA and the events strip — and none of them share a
// parent that could own the modal's state. The catalogue's own modal is driven
// by an `onLaunch` prop because its trigger and its modal are both inside
// <GameGrid>; there is no equivalent ancestor here short of wrapping the whole
// app in a context provider for one boolean.
//
// So: a DOM event. Any client component can fire it, a single <BookingDialog />
// mounted in the root layout listens, and nothing has to be threaded through
// the tree.
export const BOOKING_EVENT = "b4w:open-booking";

// Returns true if the dialog took the click, false if the caller should let the
// browser follow the href instead. Every CTA keeps its real Calendly URL in
// `href` and only calls preventDefault when this says yes — so with JS off, a
// blocked third-party script, or this module failing to load, the link still
// works exactly as it did before the dialog existed.
export function openBooking(source) {
  if (typeof window === "undefined" || typeof CustomEvent !== "function") {
    return false;
  }
  window.dispatchEvent(new CustomEvent(BOOKING_EVENT, { detail: { source } }));
  return true;
}
