"use client";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, Close, Menu } from "./Icons";
import { trackEvent } from "@/app/lib/analytics";
import { prefersReducedMotion } from "@/app/lib/motion";
import { bookingUrl } from "@/app/lib/site";
import { openBooking } from "@/app/lib/booking";
import logo from "@/public/assets/img/b4w-logo.svg";

// How far down the page the bar has to be before it is allowed to hide. It has
// to clear the events strip plus its own height (~154px on a phone, ~150px on a
// desktop) or the first flick of a scroll would slide the header up over a strip
// that is still on screen.
const HIDE_BELOW = 180;
// Momentum scrolling and trackpads emit a lot of 1-2px events, and a bar that
// flips direction on every one of them is worse than one that never moves.
// Travel accumulates until it passes this, so a real direction change is needed.
const DIRECTION_DELTA = 8;

// Real routes now, not same-page anchors — each label goes somewhere.
const NAV = [
  { label: "Platform", href: "/platform" },
  { label: "Games", href: "/games" },
  { label: "Provably Fair", href: "/provably-fair" },
  { label: "Branding", href: "/branding" },
  { label: "News", href: "/news" },
];

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const panelRef = useRef(null);

  // A game page is "under" Games and a post is "under" News, so the section
  // stays lit while you're inside it.
  const isActive = (href) =>
    pathname === href ||
    ((href === "/games" || href === "/news") && pathname.startsWith(`${href}/`));

  // Route change closes the menu — without this it stays open over the new page.
  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  // Hide going down, reappear going up — from anywhere on the page, not only
  // from the top. Reading is a downward activity and the bar is 75px of a phone
  // screen; wanting the nav is an upward one, and the gesture people already
  // make for it is a scroll up. Waiting until the top of the document to give it
  // back makes every visitor scroll past everything they were reading.
  //
  // Under reduced motion the bar simply stays put. A 75px slab appearing and
  // disappearing on every direction change is precisely the kind of unrequested
  // movement that setting exists to switch off, and the same rule the ambient
  // mesh follows applies here: the surface stays, the motion goes.
  useEffect(() => {
    if (open) {
      setHidden(false);
      return;
    }
    if (prefersReducedMotion()) return;

    let last = window.scrollY;
    let queued = false;

    const update = () => {
      queued = false;
      const y = window.scrollY;
      const travelled = y - last;
      // `last` is deliberately NOT updated below the threshold: the distance
      // accumulates, so a slow drag still registers once it adds up.
      if (Math.abs(travelled) < DIRECTION_DELTA) return;
      last = y;
      setHidden(y > HIDE_BELOW && travelled > 0);
    };

    const onScroll = () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(update);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [open]);

  return (
    // sticky, not fixed: the events strip sits above this in normal flow, so a
    // fixed header would overlap it until the page scrolled. Sticky lets the
    // strip scroll away and the nav take over the top edge, with no offset
    // arithmetic and no layout shift when the strip is dismissed.
    <header
      data-hidden={hidden ? "" : undefined}
      // A hidden bar is still in the tab order, so tabbing into it off-screen
      // would be a trap. focus bubbles, so anything inside it — the logo, a nav
      // link, the menu button — brings the whole bar back.
      onFocus={() => setHidden(false)}
      className="b4w-header sticky top-0 z-50 w-full border-b border-line/40 bg-bg/80 backdrop-blur-md"
    >
      {/* py-3 on phones. The bar is sticky, so its height is subtracted from
          every screenful of every page rather than paid once — and at py-4 around
          a 2.5rem menu button it measured 91px of an 844px viewport. With the
          button at 44px (see .b4w-btn--icon in globals.css) this comes to 70px,
          still comfortably clear of the logo. */}
      <div className="mx-auto flex max-w-[1280px] items-center justify-between px-5 py-3 md:px-12 md:py-4">
        <Link href="/" className="flex items-center" aria-label="Bet4.win home">
          <img
            src={logo.src}
            alt="Bet4.win"
            width={143}
            height={28}
            fetchPriority="high"
            className="h-7 w-auto"
          />
        </Link>

        {/* lg, not md. The horizontal nav needs ~900px to sit beside the logo
            and the CTA; at the 768px md breakpoint the row measured 901px wide
            in a 785px viewport and was only invisible because the template's
            `body { overflow-x: hidden }` clipped it. That was already true with
            four items — News is the fifth — so the breakpoint moves rather than
            the type shrinking. Tablets get the same menu phones do. */}
        <nav aria-label="Main" className="hidden items-center gap-9 lg:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href) ? "page" : undefined}
              className={`relative font-SpaceGrotesk text-[12px] uppercase tracking-[0.06em] transition-colors hover:!text-ink focus-visible:!text-ink focus-visible:outline-none ${
                isActive(item.href) ? "!text-accent" : "!text-muted"
              }`}
            >
              {item.label}
              {/* The current section is underscored as well as coloured — the
                  colour alone is the only signal a screen reader can't use and
                  a colour-blind reader may not catch. */}
              {isActive(item.href) && (
                <span
                  aria-hidden="true"
                  className="absolute -bottom-1.5 left-0 h-px w-full bg-accent"
                />
              )}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            // A direct action rather than "/#contact": from an interior page
            // that anchor would navigate you off the page you're reading.
            //
            // The click is normally taken by the booking dialog, which keeps the
            // reader on the site. This href is the fallback path — a real
            // Calendly URL, opening in a new tab so that even then the page
            // being read survives.
            href={bookingUrl("header")}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => {
              trackEvent("cta_click", {
                label: "header_book_demo",
                cta_type: "booking",
              });
              // The href stays the real Calendly URL; preventDefault only fires
              // when the dialog actually took the click, so this degrades to the
              // plain link if the module never ran.
              if (openBooking("header")) e.preventDefault();
            }}
            className="b4w-btn b4w-btn--primary hidden sm:inline-flex"
          >
            Book a demo
            <ArrowRight className="h-4 w-4" />
          </a>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            className="b4w-btn b4w-btn--ghost b4w-btn--icon lg:hidden"
          >
            {open ? <Close className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile navigation — the site had none before, so phones had no way to
          move between pages at all. */}
      {open && (
        <div
          id="mobile-nav"
          ref={panelRef}
          className="border-t border-line/40 bg-bg/95 backdrop-blur-md lg:hidden"
        >
          <nav aria-label="Main" className="flex flex-col px-5 py-3">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive(item.href) ? "page" : undefined}
                className={`border-b border-line/40 py-3.5 font-SpaceGrotesk text-[13px] uppercase tracking-[0.06em] transition-colors last:border-b-0 hover:!text-ink focus-visible:!text-ink focus-visible:outline-none ${
                  isActive(item.href) ? "!text-accent" : "!text-muted"
                }`}
              >
                {item.label}
              </Link>
            ))}
            <a
              href={bookingUrl("header_mobile")}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => {
                trackEvent("cta_click", {
                  label: "header_book_demo_mobile",
                  cta_type: "booking",
                });
                if (openBooking("header_mobile")) e.preventDefault();
              }}
              className="b4w-btn b4w-btn--primary b4w-btn--lg mt-5 w-full"
            >
              Book a demo
              <ArrowRight className="h-4 w-4" />
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
