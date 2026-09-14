"use client";
import React, { useEffect, useRef, useState } from "react";
import { ArrowRight } from "./Icons";
import { trackEvent } from "@/app/lib/analytics";
import { eventsSignature, rememberEventsDismissed } from "@/app/lib/eventsBar";

const ROTATE_MS = 6000;

// Trade-show strip above the header. Both competitors in this space run one, and
// we were attending shows without saying so anywhere on the site.
//
// One show at a time rather than a static row: the two 2026 dates overlap almost
// exactly, so side-by-side would read as a single smeared date range.
//
// Structural note — the rotating slides carry TEXT ONLY. Every interactive
// element (the two CTAs, the controls) lives outside the fading stack and reads
// its href off the active event. Putting links inside slides would leave
// focusable anchors sitting at opacity 0, which is a keyboard trap that `inert`
// only partially solves. Screen readers get the full list from the sr-only
// summary below instead of having to wait out the rotation.
export default function EventsBar({ events, initialDismissed = false }) {
  const [hidden, setHidden] = useState(initialDismissed);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);
  const regionRef = useRef(null);

  // Tracked live rather than sampled once: someone can flip the OS setting with
  // the page already open, and the auto-advance should stop when they do.
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const count = events.length;

  useEffect(() => {
    if (hidden || paused || reduced || count < 2) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % count), ROTATE_MS);
    return () => clearInterval(id);
  }, [hidden, paused, reduced, count]);

  if (hidden || !count) return null;

  // Reduced motion doesn't just mean "don't animate the crossfade" — with the
  // timer off, a carousel would strand the reader on whichever show happened to
  // be first. So that mode drops the carousel entirely and lists every show at
  // once, which is both motionless and more informative. There are two of them;
  // stacked, they cost about 28px.
  const showAll = reduced;
  const active = events[showAll ? 0 : index];
  const go = (next) => setIndex(((next % count) + count) % count);

  const dismiss = () => {
    rememberEventsDismissed(eventsSignature(events));
    setHidden(true);
  };

  return (
    <div
      ref={regionRef}
      role="region"
      aria-label="Upcoming events"
      // Rotation is decorative repetition of content already stated in full
      // below, so announcing each tick would be noise.
      aria-live="off"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      className="relative z-40 border-b border-line/60 bg-panel-high"
    >
      <div className="mx-auto flex max-w-[1280px] items-center gap-2 px-5 py-2 md:gap-5 md:px-12">
        <span className="hidden shrink-0 rounded-full border border-cyan/35 bg-cyan/10 px-2.5 py-1 font-SpaceGrotesk text-[10px] font-semibold uppercase tracking-[0.1em] text-cyan sm:inline-block">
          Upcoming
        </span>

        {/* All slides share one grid cell, so the strip is as tall as the
            tallest and the crossfade needs no absolute positioning or measured
            height. Under `showAll` the same children stack in normal flow
            instead, which is the whole difference between the two modes. */}
        <div
          className={showAll ? "flex min-w-0 flex-1 flex-col gap-0.5" : "grid min-w-0 flex-1"}
          aria-hidden="true"
        >
          {events.map((event, i) => (
            <div
              key={event.id}
              style={showAll ? undefined : { gridArea: "1 / 1" }}
              // Stacked on phones, inline from sm up. On one line at 390px the
              // name and dates needed ~174px of the ~119px the flex row could
              // spare, and the date ran under the carousel dots. Two lines cost
              // ~14px of bar height and remove the constraint entirely.
              className={`b4w-event-slide flex min-w-0 flex-col items-start gap-0 sm:flex-row sm:items-baseline sm:gap-3 ${
                showAll || i === index ? "opacity-100" : "opacity-0"
              }`}
            >
              <span className="shrink-0 whitespace-nowrap font-SpaceGrotesk text-[13px] font-semibold leading-tight tracking-[-0.01em] text-ink">
                {event.name}
              </span>
              {/* Mono numerals for dates, matching how every other figure on the
                  site is set — it is the one typographic signature we have that
                  neither competitor does. */}
              <span className="shrink-0 whitespace-nowrap font-JetBrainsMono text-[12px] leading-tight text-cyan tabular-nums">
                {event.dates}
              </span>
              <span className="hidden truncate font-SpaceGrotesk text-[12px] text-muted lg:inline">
                · {event.location}
              </span>
            </div>
          ))}
        </div>

        {/* Controls and CTAs sit outside the fading stack and always target the
            active event, so focus order never lands on an invisible slide. */}
        {!showAll && count > 1 && (
          <div className="flex shrink-0 items-center gap-1">
            <button
              type="button"
              onClick={() => go(index - 1)}
              aria-label="Previous event"
              // Chevrons are desktop-only. On a phone the strip has room for
              // either these or the CTA, and an announcement nobody can act on
              // is not worth the pixels — the dots are tappable and do the same
              // job.
              className="hidden h-6 w-6 items-center justify-center rounded text-muted transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand sm:flex"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-3.5 w-3.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>

            {/* Dots are the only control on a phone (the chevrons are hidden),
                but below sm even they cost more width than the strip can spare
                once the CTA is in. Auto-rotation covers the gap there; reduced
                motion never reaches this branch because showAll lists them all. */}
            <div className="hidden items-center gap-1.5 px-0.5 sm:flex">
              {events.map((event, i) => (
                <button
                  key={event.id}
                  type="button"
                  onClick={() => go(i)}
                  aria-label={`Show ${event.name}`}
                  aria-current={i === index ? "true" : undefined}
                  className={`h-1.5 rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand ${
                    i === index ? "w-4 bg-brand" : "w-1.5 bg-line"
                  }`}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={() => go(index + 1)}
              aria-label="Next event"
              className="hidden h-6 w-6 items-center justify-center rounded text-muted transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand sm:flex"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-3.5 w-3.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M9 6l6 6-6 6" />
              </svg>
            </button>
          </div>
        )}

        <a
          href={active.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() =>
            trackEvent("cta_click", {
              label: "event_site",
              cta_type: "external",
              event_id: active.id,
            })
          }
          className="hidden shrink-0 font-SpaceGrotesk text-[11px] uppercase tracking-[0.06em] !text-muted transition-colors hover:!text-ink focus-visible:outline-none focus-visible:!text-ink xl:inline"
        >
          Event site ↗
        </a>

        <a
          href={`mailto:info@bet4.win?subject=${encodeURIComponent(
            `Meeting at ${active.name} (${active.dates})`,
          )}`}
          onClick={() =>
            trackEvent("cta_click", {
              label: "event_book_meeting",
              cta_type: "email",
              event_id: active.id,
            })
          }
          className="b4w-sheen inline-flex shrink-0 items-center gap-1.5 rounded-md border border-brand/50 px-3 py-1.5 font-SpaceGrotesk text-[11px] font-semibold uppercase tracking-[0.04em] !text-ink transition-colors hover:border-brand hover:bg-brand/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
        >
          {/* Shortened rather than dropped on phones: the strip exists to get a
              meeting booked, so the action survives every breakpoint. */}
          <span className="hidden sm:inline">Book a meeting</span>
          <span className="sm:hidden">Meet us</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </a>

        <button
          type="button"
          onClick={dismiss}
          aria-label="Hide event announcements"
          className="flex h-6 w-6 shrink-0 items-center justify-center rounded text-faint transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-3.5 w-3.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
      </div>

      {/* Stated once, in full, for assistive tech — the rotation above is
          aria-hidden, exactly as the ticker's marquee is. */}
      <p className="sr-only">
        Meet us at:{" "}
        {events
          .map((e) => `${e.name}, ${e.dates}, ${e.location}`)
          .join(". ")}
        .
      </p>
    </div>
  );
}
