"use client";
import { useEffect, useRef } from "react";

// Scroll-reveal plumbing shared by every animated element on the page.
//
// One IntersectionObserver serves the whole document rather than one per
// component — with ~12 cards plus every section, per-instance observers add up
// for no benefit. Each element fires once and is immediately unobserved: these
// are entrance animations, not scroll-linked effects, so re-running them on
// scroll-back would only cause flicker.

let observer = null;
const callbacks = new Map();

export function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

function getObserver() {
  if (observer) return observer;
  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const cb = callbacks.get(entry.target);
        observer.unobserve(entry.target);
        callbacks.delete(entry.target);
        cb?.();
      }
    },
    // Fire slightly before the element is fully on screen so the motion reads as
    // "already settling" by the time it's centred, not as a delayed pop-in. The
    // negative bottom margin is what does that; the threshold is deliberately 0.
    //
    // It used to be 0.08, which is a proportion OF THE ELEMENT and therefore
    // grows without bound as the element does. Once an element is taller than
    // root/0.08 the condition can never be met — 8% of it does not fit on the
    // screen — and it stays at opacity 0 forever. The news index is one
    // <Reveal> around the whole post list: at 10,380px on a 390px-wide phone it
    // needed 830px of a 776px root, so /news rendered as an empty page on every
    // handset while reading correctly on a desktop, where the grid is short
    // enough. At 0 the rule is "any part of it has crossed the line", which is
    // what the rootMargin was always expressing and does not depend on size.
    { rootMargin: "0px 0px -8% 0px", threshold: 0 },
  );
  return observer;
}

// Runs `cb` once, when `el` first scrolls into view. Falls through immediately
// when motion is unwanted or unsupported, so the final state is applied without
// animating — never leaving content stuck in its hidden pre-reveal state.
export function onceInView(el, cb) {
  if (!el) return () => {};
  if (prefersReducedMotion() || typeof IntersectionObserver === "undefined") {
    cb();
    return () => {};
  }
  callbacks.set(el, cb);
  getObserver().observe(el);
  return () => {
    observer?.unobserve(el);
    callbacks.delete(el);
  };
}

// For a section that arrives with a choreography of its own (see "Arrivals" in
// globals.css). Returns a ref; if the element starts below the fold it is
// marked `data-motion="pending"`, and `"in"` once its top crosses 70% of the
// screen. Anything already on screen is left alone, so nothing visible ever
// blinks out to animate back in.
export function useArrival() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion() || typeof IntersectionObserver === "undefined") return;
    if (el.getBoundingClientRect().top < window.innerHeight * 0.7) return;
    el.dataset.motion = "pending";
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        el.dataset.motion = "in";
        io.disconnect();
      },
      { rootMargin: "0px 0px -30% 0px", threshold: 0 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return ref;
}
