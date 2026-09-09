"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { rememberAgeConfirmed } from "@/app/lib/ageGate";
import { trackEvent } from "@/app/lib/analytics";
import { ShieldCheck } from "./Icons";

// Rendered by the root layout only when the confirmation cookie is absent, so
// it arrives in the initial HTML — no flash of the site before the gate paints,
// which a useEffect-based check would give us.
//
// The overlay sits *on top of* the page rather than replacing it: the homepage
// carries the JSON-LD entity graph and per-game share cards, and swapping the
// document body out for a gate would hide all of it from crawlers.
export default function AgeGate() {
  const [status, setStatus] = useState("asking"); // asking | denied | confirmed
  const panelRef = useRef(null);

  // Body scroll is locked server-side via a class on <body> (so it holds before
  // hydration too). confirm() below is the only thing that clears it — doing it
  // in an effect cleanup instead would unlock on StrictMode's dev remount while
  // the gate is still on screen. The denied screen keeps the lock.

  // Move focus into the dialog, and keep it there. Escape is deliberately not
  // wired up: unlike the game modal, this one isn't dismissible.
  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;

    const focusable = () =>
      panel.querySelectorAll("button, a[href]");

    focusable()[0]?.focus();

    const onKey = (e) => {
      if (e.key !== "Tab") return;
      const items = focusable();
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [status]);

  const confirm = useCallback(() => {
    rememberAgeConfirmed();
    trackEvent("age_gate", { choice: "yes" });
    document.body.classList.remove("age-gate-locked");
    setStatus("confirmed");
  }, []);

  const reject = useCallback(() => {
    trackEvent("age_gate", { choice: "no" });
    setStatus("denied");
  }, []);

  if (status === "confirmed") return null;

  return (
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center bg-bg/95 px-5 backdrop-blur-xl"
      role="dialog"
      aria-modal="true"
      aria-labelledby="age-gate-heading"
      style={{
        paddingTop: "env(safe-area-inset-top)",
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      <div
        ref={panelRef}
        className="machined-surface w-full max-w-md rounded-xl border border-line bg-panel-low p-7 text-center shadow-2xl md:p-9"
      >
        {status === "denied" ? (
          <>
            <h2
              id="age-gate-heading"
              className="font-SpaceGrotesk !text-[1.4rem] !font-bold !tracking-[-0.02em] !text-ink"
            >
              Access denied
            </h2>
            <p className="mt-3 font-SpaceGrotesk text-[0.95rem] leading-[1.6] text-muted">
              You must be 18 or over to view this site. Reload the page if you
              answered by mistake.
            </p>
            <a
              href="https://www.gambleaware.org"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex font-SpaceGrotesk text-[12px] uppercase tracking-[0.06em] !text-cyan transition-colors hover:!text-ink focus-visible:outline-none focus-visible:!text-ink"
            >
              Get support at GambleAware.org
            </a>
          </>
        ) : (
          <>
            <span
              className="mx-auto mb-5 flex h-11 w-11 items-center justify-center rounded-md border border-line bg-panel text-cyan"
              aria-hidden="true"
            >
              <ShieldCheck className="h-5 w-5" />
            </span>
            <h2
              id="age-gate-heading"
              className="font-SpaceGrotesk !text-[1.4rem] !font-bold !tracking-[-0.02em] !text-ink"
            >
              Are you over 18?
            </h2>
            <p className="mt-3 font-SpaceGrotesk text-[0.95rem] leading-[1.6] text-muted">
              This site showcases real-money casino games. You must confirm you
              are 18 or over to continue.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={confirm}
                className="flex-1 rounded-md b4w-sheen bg-brand-strong px-5 py-3 font-SpaceGrotesk text-[13px] font-semibold uppercase tracking-[0.04em] !text-white shadow-[0_0_26px_-4px_rgba(37,99,235,0.5)] transition-colors hover:bg-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-panel-low"
              >
                Yes, I am 18+
              </button>
              <button
                type="button"
                onClick={reject}
                className="flex-1 rounded-md border border-line px-5 py-3 font-SpaceGrotesk text-[13px] uppercase tracking-[0.04em] !text-ink transition-colors hover:bg-panel focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-line focus-visible:ring-offset-2 focus-visible:ring-offset-panel-low"
              >
                No
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
