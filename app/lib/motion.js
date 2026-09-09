"use client";

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
    // "already settling" by the time it's centred, not as a delayed pop-in.
    { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
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
