"use client";
import { useEffect } from "react";
import { prefersReducedMotion } from "./motion";

// Pointer-driven 3D tilt, published as CSS custom properties so the transform
// itself stays in the stylesheet next to the rest of the motion system.
//
// Damped, not snapped: the surface eases toward the pointer each frame and
// settles, rather than tracking it exactly and twitching on every micro
// movement. At this scale that difference is most of what separates a
// well-made control from a gimmick.
//
// Skipped entirely on coarse pointers — a tilt that needs hover is dead weight
// on a phone — and under prefers-reduced-motion.
//
// Sets:
//   --tilt-x / --tilt-y   rotation in deg
//   --tilt-nx / --tilt-ny normalised -1..1, for parallaxing children
// Pointer position in the element's OWN box, as percentages, undamped.
//
// Deliberately separate from useTilt. The tilt is damped so the card settles
// instead of twitching, and it is measured against whatever element drives the
// rotation — for the hero that is the whole carousel stage, not one card. A
// highlight driven off those numbers lags the cursor and is anchored to the
// wrong box, which is exactly how the glare ended up not sitting under the
// pointer. Light does not ease, and it belongs to the surface it is falling on,
// so this tracks raw and local.
export function useGlare(ref) {
  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty("--gx", `${((e.clientX - r.left) / r.width) * 100}%`);
      el.style.setProperty("--gy", `${((e.clientY - r.top) / r.height) * 100}%`);
    };
    const onLeave = () => {
      el.style.removeProperty("--gx");
      el.style.removeProperty("--gy");
    };

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, [ref]);
}

export function useTilt(ref, { max = 6, damp = 0.1 } = {}) {
  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    let raf = 0;
    let tx = 0;
    let ty = 0; // target, -1..1
    let cx = 0;
    let cy = 0; // current
    let tracking = false;

    const frame = () => {
      cx += (tx - cx) * damp;
      cy += (ty - cy) * damp;
      el.style.setProperty("--tilt-x", `${(cy * -max).toFixed(3)}deg`);
      el.style.setProperty("--tilt-y", `${(cx * max).toFixed(3)}deg`);
      el.style.setProperty("--tilt-nx", cx.toFixed(4));
      el.style.setProperty("--tilt-ny", cy.toFixed(4));

      // Keep the loop alive only while there is meaningful distance left to
      // travel. A permanently-running rAF for a surface nobody is touching is
      // just battery.
      if (tracking || Math.abs(tx - cx) > 0.0015 || Math.abs(ty - cy) > 0.0015) {
        raf = requestAnimationFrame(frame);
      } else {
        raf = 0;
      }
    };

    const kick = () => {
      if (!raf) raf = requestAnimationFrame(frame);
    };

    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      tx = ((e.clientX - r.left) / r.width) * 2 - 1;
      ty = ((e.clientY - r.top) / r.height) * 2 - 1;
      tracking = true;
      kick();
    };

    const onLeave = () => {
      tx = 0;
      ty = 0;
      tracking = false;
      kick();
    };

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [ref, max, damp]);
}
