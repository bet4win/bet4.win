"use client";
import React, { useEffect, useId, useRef, useState } from "react";
import { ChevronDown, Play } from "./Icons";

// The demo launcher for a game that ships seasonal variants.
//
// Split, rather than a dropdown that swallows the whole control: launching the
// demo is the action, and a reader who has never heard of seasonal dressing
// should not have to make a choice before they can press play. The main button
// fires the first option — the standard build — so the second half is the only
// thing anyone has to notice, and only if they want the other one.
//
// The trigger wears the seasons' own glyphs rather than a bare chevron. A
// chevron says "there is more" and nothing about what; an orange ghost on the
// button says what is behind it before anyone opens it, which is the only
// reason a reader who isn't hunting for it would ever look. The chevron stays
// alongside, small — it is what makes the segment read as a menu at all.
//
// Not `role="menu"`. That pattern promises arrow-key roving and a focus trap,
// and this is a short list of buttons in a popover; `aria-expanded` plus the
// natural tab order is the honest description of what it actually does.
export default function SeasonLaunch({ options, onLaunch }) {
  // The undressed build is always first; the rest are the seasons, and they
  // are what the trigger advertises.
  const [standard, ...variants] = options;

  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);
  const toggleRef = useRef(null);
  const panelId = useId();

  // Escape closes and hands focus back to the control that opened it —
  // otherwise focus is left on a button that no longer exists.
  useEffect(() => {
    if (!open) return;

    const onKey = (e) => {
      if (e.key !== "Escape") return;
      setOpen(false);
      toggleRef.current?.focus();
    };

    // Pointer-down rather than click: a click that lands outside should close
    // the panel AND do its own job, and waiting for the click means the first
    // press on any control behind the panel is spent dismissing it.
    const onPointerDown = (e) => {
      if (!wrapRef.current?.contains(e.target)) setOpen(false);
    };

    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  // Tabbing off the end of the panel closes it. `focusout` fires before focus
  // lands, so the new target comes off the event rather than off the document.
  const onFocusOut = (e) => {
    if (!wrapRef.current?.contains(e.relatedTarget)) setOpen(false);
  };

  const choose = (option) => {
    setOpen(false);
    onLaunch(option.url, option);
  };

  return (
    <div ref={wrapRef} className="relative mt-7" onBlur={onFocusOut}>
      <div className="flex">
        <button
          type="button"
          onClick={() => onLaunch(standard.url, standard)}
          // The two halves are one pill with a seam down it: the primary's
          // rounding is dropped on the facing edges so they read as a single
          // object rather than two buttons that happen to touch.
          className="b4w-btn b4w-btn--primary b4w-btn--lg flex flex-1 !rounded-r-none"
        >
          <Play className="h-4 w-4" />
          Play demo
        </button>
        <button
          ref={toggleRef}
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls={panelId}
          aria-label="Choose a seasonal variant"
          className="b4w-btn b4w-btn--primary b4w-btn--lg b4w-split-end !gap-1.5 !rounded-l-none !px-3"
        >
          {variants.map(({ id, Icon, tint }) => (
            <Icon key={id} className="h-[18px] w-[18px]" style={{ color: tint }} />
          ))}
          <ChevronDown
            className={`h-3 w-3 opacity-80 transition-transform duration-200 ${
              open ? "rotate-180" : ""
            }`}
          />
        </button>
      </div>

      {open && (
        <div
          id={panelId}
          className="b4w-pop absolute right-0 top-[calc(100%+0.5rem)] z-20 w-full min-w-[15rem] overflow-hidden rounded-xl border border-line bg-panel-high pb-1.5 shadow-2xl"
        >
          <p className="!mb-0 px-4 pb-1.5 pt-3 font-SpaceGrotesk text-[10px] uppercase tracking-[0.1em] text-faint">
            Launch a variant
          </p>
          {options.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => choose(option)}
              className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left font-SpaceGrotesk text-[13px] text-ink transition-colors hover:bg-bg/60 focus-visible:bg-bg/60 focus-visible:outline-none"
            >
              <option.Icon
                className="h-4 w-4 shrink-0"
                style={{ color: option.tint }}
              />
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
