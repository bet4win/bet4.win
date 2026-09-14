"use client";
import { prefersReducedMotion } from "./motion";

// Scroll parallax for section backgrounds.
//
// One rAF loop and one IntersectionObserver for the whole document, following
// the same reasoning as motion.js: a dozen sections each running their own
// scroll listener costs more than it buys. Elements only contribute while they
// are actually on screen, and the loop stops itself when none are.
//
// Publishes --sy on each registered element: -1 when the element's centre is a
// viewport below the middle, +1 when it is a viewport above. Backgrounds
// translate by some fraction of that, so they drift against the content instead
// of moving with it.

const visible = new Set();
let io = null;
let raf = 0;

function frame() {
  const mid = window.innerHeight / 2;
  for (const el of visible) {
    const r = el.getBoundingClientRect();
    const centre = r.top + r.height / 2;
    const sy = Math.max(-1, Math.min(1, (mid - centre) / window.innerHeight));
    el.style.setProperty("--sy", sy.toFixed(4));
  }
  raf = visible.size ? requestAnimationFrame(frame) : 0;
}

function getObserver() {
  if (io) return io;
  io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) visible.add(e.target);
        else visible.delete(e.target);
      }
      if (visible.size && !raf) raf = requestAnimationFrame(frame);
    },
    { rootMargin: "20% 0px 20% 0px" },
  );
  return io;
}

export function registerParallax(el) {
  if (!el || prefersReducedMotion() || typeof IntersectionObserver === "undefined") {
    return () => {};
  }
  getObserver().observe(el);
  return () => {
    io?.unobserve(el);
    visible.delete(el);
    el.style.removeProperty("--sy");
  };
}
