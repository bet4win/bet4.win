"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Check, Close } from "./Icons";
import { trackEvent } from "@/app/lib/analytics";
import { BOOKING_EVENT } from "@/app/lib/booking";
import { BOOKING_URL, bookingEmbedUrl } from "@/app/lib/site";

// The scheduler, in our own dialog.
//
// Calendly's API cannot create a booking — there is no endpoint for it — so an
// iframe is the only way to keep someone on the site while they pick a slot.
// What we can own is everything around it: this is our chrome, our close
// control, our surface, with their widget dropped into the middle. Their own
// pop-up would have put a white sheet with their branding over the page.
//
// Loaded on demand. `widget.js` and the app behind it are a substantial
// third-party payload, and — the part that actually matters here — Calendly
// sets its own cookies. This site deliberately sets none before consent, so
// nothing of theirs is fetched until somebody actively asks to book. That is
// also why their GDPR banner is left switched on inside the frame: our consent
// layer covers our analytics, not theirs.

const WIDGET_SRC = "https://assets.calendly.com/assets/external/widget.js";

// Module-level so the script is fetched once per page load however many times
// the dialog is opened and closed.
let widgetPromise = null;

function loadWidget() {
  if (typeof window === "undefined") return Promise.reject(new Error("no window"));
  if (window.Calendly) return Promise.resolve(window.Calendly);
  if (widgetPromise) return widgetPromise;

  widgetPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = WIDGET_SRC;
    script.async = true;
    script.onload = () =>
      window.Calendly
        ? resolve(window.Calendly)
        : reject(new Error("widget.js loaded but window.Calendly is missing"));
    script.onerror = () => {
      // Cleared so a second attempt can retry — the usual cause is a blocker or
      // a flaky network, both of which can change between one click and the next.
      widgetPromise = null;
      reject(new Error("widget.js failed to load"));
    };
    document.head.appendChild(script);
  });

  return widgetPromise;
}

export default function BookingDialog() {
  const [open, setOpen] = useState(false);
  const [source, setSource] = useState(null);
  const [status, setStatus] = useState("idle"); // idle | loading | ready | error
  const [booked, setBooked] = useState(false);
  // Phone-shaped: the sheet gives the scheduler one screenful, so the frame is
  // sized to the sheet and Calendly scrolls inside it. See the note where the
  // widget is initialised.
  const [compact, setCompact] = useState(false);

  const embedRef = useRef(null);
  const closeRef = useRef(null);
  // Whatever had focus when the dialog opened, so it can be handed back.
  const returnFocusRef = useRef(null);

  const close = useCallback(() => setOpen(false), []);

  // --- Opening ---------------------------------------------------------------
  useEffect(() => {
    const onOpen = (e) => {
      returnFocusRef.current = document.activeElement;
      setSource(e.detail?.source || null);
      setBooked(false);
      setOpen(true);
    };
    window.addEventListener(BOOKING_EVENT, onOpen);
    return () => window.removeEventListener(BOOKING_EVENT, onOpen);
  }, []);

  // --- Escape + scroll lock --------------------------------------------------
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && close();
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, close]);

  // Focus in on open, back out on close. There is deliberately no focus trap:
  // the scheduler is an iframe, and a Tab handler that keeps focus inside this
  // component would make the calendar itself unreachable by keyboard. Escape,
  // `aria-modal` and moving focus in are what an iframe dialog can honestly do.
  useEffect(() => {
    if (open) {
      closeRef.current?.focus();
      return;
    }
    const el = returnFocusRef.current;
    if (el && typeof el.focus === "function") el.focus();
  }, [open]);

  // --- The widget ------------------------------------------------------------
  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    // Read once, here, rather than held in state and read on the next render:
    // this value decides how the widget is initialised, and initialising is the
    // thing that happens in this effect.
    const isCompact = !window.matchMedia("(min-width: 768px)").matches;
    setCompact(isCompact);
    setStatus("loading");

    loadWidget()
      .then((Calendly) => {
        if (cancelled || !embedRef.current) return;
        // Cleared first: reopening mounts a fresh container, and initialising
        // twice into a populated node stacks two schedulers.
        embedRef.current.innerHTML = "";
        Calendly.initInlineWidget({
          url: bookingEmbedUrl(),
          parentElement: embedRef.current,
          // Calendly sizes the iframe to its own content. Without it the frame
          // is a fixed box and their scheduler floats in the middle of it with
          // a white margin all round — `background_color` themes their card but
          // not the page it sits on, so that margin cannot be recoloured and
          // has to be removed instead. Their docs allow one auto-resizing embed
          // per page; this is the only one on the site.
          //
          // NOT on a phone. There the scheduler is ~830px of content and the
          // sheet can offer ~715px, so a self-sized frame is 120px taller than
          // the box it sits in and gets clipped by it — an iframe overflowing a
          // scrollable ancestor is the one arrangement mobile browsers handle
          // badly, and the symptom is taps inside the frame landing at the wrong
          // offset or not registering at all. At this width the frame is given
          // the sheet's own height instead and Calendly scrolls inside it: one
          // scroll surface, nothing clipped, and no white margin either, because
          // their content is the taller of the two here.
          resize: !isCompact,
          prefill: {},
          // camelCase here — the widget maps these onto the booking record, and
          // they are what tells us which control produced a meeting.
          utm: {
            utmSource: "bet4win",
            utmMedium: source || "site",
          },
        });
        setStatus("ready");
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });

    return () => {
      cancelled = true;
    };
  }, [open, source]);

  // --- Booking confirmation --------------------------------------------------
  useEffect(() => {
    if (!open) return;
    const onMessage = (e) => {
      if (e.origin !== "https://calendly.com") return;
      const name = e.data?.event;
      if (typeof name !== "string" || !name.startsWith("calendly.")) return;
      if (name !== "calendly.event_scheduled") return;

      setBooked(true);
      // The name of the event and which CTA produced it — nothing else. The
      // payload carries invitee and event URIs that resolve to a real person's
      // booking, and those do not belong in a third-party analytics property.
      trackEvent("booking_completed", {
        label: source || "site",
        cta_type: "booking",
      });
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [open, source]);

  if (!open) return null;

  return (
    <div
      // Above the sticky header (z-50) and the age gate, matching the game
      // modal's own ceiling.
      className="fixed inset-0 z-[9999] flex items-end justify-center bg-black/80 backdrop-blur-sm sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label="Book a demo with Bet4.win"
      onClick={close}
    >
      <div
        // 1060px. Calendly switches from stacking the event details above the
        // calendar to setting them side by side somewhere just under 1100px of
        // frame width, and the two-column form is both shorter — it fits the
        // dialog without scrolling — and the arrangement people recognise.
        // Width is cheap here precisely because the embed's page is white and
        // so is this panel: any surplus is invisible.
        // svh, not vh and not dvh. On a phone this is a bottom sheet pinned to
        // the bottom of the screen, and the three units mean three different
        // things there:
        //   vh  — the LARGE viewport, the height the page has once the address
        //         bar has collapsed. With the bar showing, 92vh is taller than
        //         what is visible, so the sheet's header sat under the chrome.
        //   dvh — whatever is visible right now, which sounds correct and is
        //         worse: it changes as the address bar collapses, so the sheet
        //         resizes underneath a finger that is mid-scroll.
        //   svh — the SMALL viewport, the height with the bar showing. Fits in
        //         every state and never changes, which is what a fixed overlay
        //         wants: the one thing a sheet must not do is move while it is
        //         being touched.
        className="b4w-bezel flex h-[92svh] w-full flex-col overflow-hidden border border-line bg-panel-low shadow-2xl sm:h-auto sm:max-h-[86svh] sm:w-[1060px] sm:max-w-full sm:rounded-2xl"
        // The sheet reaches the bottom edge, so on a device with a home
        // indicator the last row of the scheduler sat underneath it.
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex min-h-12 shrink-0 items-center justify-between gap-4 border-b border-line bg-bg/80 px-4">
          <span className="inline-flex items-center gap-2 font-SpaceGrotesk text-[12px] uppercase tracking-[0.06em] text-accent">
            {booked ? (
              <>
                <Check className="h-4 w-4" />
                Booked — check your inbox
              </>
            ) : (
              "Book a demo · 30 minutes"
            )}
          </span>
          <button
            type="button"
            ref={closeRef}
            onClick={close}
            aria-label="Close booking"
            className="b4w-btn b4w-btn--ghost b4w-btn--icon b4w-btn--sm"
          >
            <Close className="h-4 w-4" />
          </button>
        </div>

        {/* Scrolls rather than clipping: with `resize: true` the iframe's height
            is Calendly's to decide and it grows once a date is picked and the
            time list appears. The dialog caps at 86vh and this scrolls inside
            it. */}
        <div
          className={`relative flex-1 ${
            compact ? "overflow-hidden" : "overflow-y-auto"
          }`}
        >
          {status === "error" ? (
            // A blocked script is a normal outcome, not an edge case — plenty of
            // people run one. Hand them the plain link rather than an empty box.
            <div className="flex h-full flex-col items-center justify-center gap-5 p-8 text-center">
              <p className="!mb-0 max-w-sm b4w-copy font-SpaceGrotesk text-muted">
                The scheduler could not load — a content blocker will usually be
                why. You can open it directly instead.
              </p>
              <a
                href={BOOKING_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="b4w-btn b4w-btn--primary"
              >
                Open the scheduler
              </a>
              <a
                href="mailto:info@bet4.win?subject=Demo%20request"
                className="b4w-btn b4w-btn--quiet !font-JetBrainsMono !text-[13px] !normal-case !tracking-normal"
              >
                info@bet4.win
              </a>
            </div>
          ) : (
            <>
              {status !== "ready" && (
                <p className="absolute inset-0 flex items-center justify-center font-SpaceGrotesk text-[12px] uppercase tracking-[0.08em] text-faint">
                  Loading the scheduler…
                </p>
              )}
              {/* White to match the embed's own page, which is a fixed white
                  that no Calendly parameter recolours — see the note on
                  BOOKING_EMBED_COLOURS. Matching it is what makes the scheduler
                  read as one white panel framed by our chrome, instead of a
                  card floating on a sheet of someone else's background.
                  `color-scheme: light` keeps a browser in dark mode from
                  force-inverting the seam. */}
              <div
                ref={embedRef}
                style={{ colorScheme: "light" }}
                // Compact: exactly the sheet's height, so the frame inside it
                // has somewhere definite to fill and nothing overflows.
                // Otherwise min-h holds the panel open while the widget boots,
                // so the dialog does not appear as a title bar and then jump.
                className={`w-full bg-white ${
                  compact ? "h-full" : "min-h-[34rem]"
                }`}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
