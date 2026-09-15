"use client";
import React from "react";
import Link from "next/link";
import { Linkedin, Mail } from "./Icons";
import { trackEvent } from "@/app/lib/analytics";
import { slugFor } from "@/app/lib/slug";
import { bookingUrl } from "@/app/lib/site";
import { openBooking } from "@/app/lib/booking";
import { games } from "@/data/games";
// Official mark, self-hosted like every other asset here. The charity rebranded
// from BeGambleAware to GambleAware (begambleaware.org 301s to gambleaware.org),
// so this is their current wordmark — already a reversed variant, which is why
// it reads on the dark footer without a filter.
import gambleAware from "@/public/assets/img/compliance/gambleaware.svg";
import logo from "@/public/assets/img/b4w-logo.svg";

const CONTACT = "info@bet4.win";

// https + www, not the bare `linkedin.com` the profile is usually pasted as:
// that host 301s, and a redirect on every outbound click is a hop we control and
// can simply not make.
const LINKEDIN = "https://www.linkedin.com/company/bet4-win";

// Five titles, deep-linked. Not decoration — these are the only pages on the
// site a search engine cannot reach from the main nav in one hop, and the
// catalogue index is a client-filtered grid rather than a set of links.
const FEATURED_GAMES = games.filter((g) => g.status === "active").slice(0, 5);

// Columns are declared as data so the markup below stays one loop. Everything
// links to a page that exists — no "coming soon" entries, and no anchor that
// only resolves on the homepage except the roadmap, which is homepage-only by
// design and marked as such.
const COLUMNS = [
  {
    heading: "Platform",
    links: [
      { label: "How it works", href: "/platform" },
      { label: "Provably fair", href: "/provably-fair" },
      { label: "White-label branding", href: "/branding" },
      { label: "Roadmap", href: "/#roadmap" },
    ],
  },
  {
    heading: "Games",
    links: [
      { label: "All originals", href: "/games" },
      ...FEATURED_GAMES.map((g) => ({
        label: g.title,
        href: `/games/${slugFor(g)}`,
      })),
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "News", href: "/news" },
      {
        label: "Book a demo",
        href: bookingUrl("footer"),
        track: "footer_demo",
        kind: "booking",
        external: true,
      },
      { label: CONTACT, href: `mailto:${CONTACT}`, track: "footer_contact", kind: "email", mono: true },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Privacy & cookies", href: "/privacy" },
      { label: "Terms of use", href: "/terms" },
    ],
  },
];

// A real outline on focus, not just the hover colour. Seventeen links in four
// columns is exactly the situation where a keyboard user needs to see where they
// are, and a colour change alone is invisible to anyone who can't distinguish
// the two greys — including on a bad screen in a bright room.
//
// inline-block + vertical padding, because a 13px link in a flow layout is a
// 17px-tall target: seventeen of them stacked on a phone is seventeen chances to
// hit the wrong one. The padding is taken back out of the list's gap below, so
// the target grows from 17px to 37px without the column getting any taller.
const linkClass =
  "inline-block py-1.5 font-SpaceGrotesk text-[13px] !text-muted transition-colors hover:!text-accent focus-visible:!text-accent focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-4";

function FooterLink({ link }) {
  const className = `${linkClass}${link.mono ? " !font-JetBrainsMono !text-[12px]" : ""}`;
  const onClick = (e) => {
    if (link.track) {
      trackEvent("cta_click", { label: link.track, cta_type: link.kind || "internal" });
    }
    // Booking opens in the site's own dialog; the href is the fallback for a
    // reader without JS. See app/lib/booking.js.
    if (link.kind === "booking" && openBooking("footer")) e.preventDefault();
  };

  // mailto:, the scheduler and the homepage anchor are real navigations out of
  // the router's hands, so they stay plain anchors; everything else is a <Link>
  // and prefetches like the rest of the site.
  return link.href.startsWith("/") && !link.href.startsWith("/#") ? (
    <Link href={link.href} className={className}>
      {link.label}
    </Link>
  ) : (
    <a
      href={link.href}
      onClick={onClick}
      {...(link.external
        ? { target: "_blank", rel: "noopener noreferrer" }
        : null)}
      className={className}
    >
      {link.label}
    </a>
  );
}

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative border-t border-line/40 bg-panel">
      {/* The same accent hairline the events strip carries, so the page opens and
          closes on the same note. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,var(--color-accent),transparent)] opacity-40"
      />

      <div className="mx-auto max-w-[1280px] px-5 md:px-12">
        <div className="grid grid-cols-2 gap-x-8 gap-y-8 py-10 md:gap-y-11 md:py-14 md:grid-cols-4 lg:grid-cols-6">
          {/* Brand column. Two of six at lg so the blurb gets a readable measure
              instead of being squeezed into a nav column's width. */}
          <div className="col-span-2 md:col-span-4 lg:col-span-2">
            <Link
              href="/"
              aria-label="Bet4.win — home"
              className="inline-flex items-center"
            >
              <img
                src={logo.src}
                alt="Bet4.win"
                width={143}
                height={28}
                // Deliberately not lazy: it is the same file the sticky header
                // loads eagerly, so it is already in cache by the time anyone
                // scrolls here — and `loading="lazy"` on an image whose CSS
                // width is `auto` is what Chrome flags as a layout-shift risk.
                className="h-7 w-auto"
              />
            </Link>
            <p className="mt-5 max-w-sm font-SpaceGrotesk text-[13px] leading-[1.7] text-muted">
              A provably-fair remote gaming server for iGaming operators. One
              integration, a certified RNG, and a new original every month —
              every title fully brandable as your own.
            </p>

            <div className="mt-6 flex items-center gap-2.5">
              <a
                href={LINKEDIN}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Bet4.win on LinkedIn"
                onClick={() =>
                  trackEvent("cta_click", {
                    label: "footer_linkedin",
                    cta_type: "outbound",
                  })
                }
                className="b4w-btn b4w-btn--ghost b4w-btn--icon"
              >
                <Linkedin className="h-4 w-4" />
              </a>
              <a
                href={`mailto:${CONTACT}`}
                aria-label={`Email ${CONTACT}`}
                onClick={() =>
                  trackEvent("cta_click", {
                    label: "footer_email_icon",
                    cta_type: "email",
                  })
                }
                className="b4w-btn b4w-btn--ghost b4w-btn--icon"
              >
                <Mail className="h-4 w-4" />
              </a>
            </div>
          </div>

          {COLUMNS.map((col) => (
            <nav key={col.heading} aria-labelledby={`footer-${col.heading}`}>
              {/* A real heading, not a styled <p>: this is how a screen reader
                  user gets four navigable groups instead of one list of
                  seventeen links with no structure. */}
              <h2
                id={`footer-${col.heading}`}
                className="!mb-4 font-SpaceGrotesk !text-[11px] !font-semibold uppercase !tracking-[0.1em] !text-ink"
              >
                {col.heading}
              </h2>
              {/* gap-0, not gap-2.5: the spacing now lives inside the links as
                  padding so it is part of the tap target rather than dead space
                  between two small ones. Same rhythm on screen. */}
              <ul className="!mb-0 flex flex-col">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <FooterLink link={link} />
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        {/* Compliance band. Deliberately just these two marks: licence badges
            (MGA, UKGC) must only appear for licences actually held. */}
        <div className="flex flex-col gap-5 border-t border-line/40 py-7 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-5">
            <span
              role="img"
              aria-label="18 plus only"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-accent/50 font-SpaceGrotesk text-[11px] font-semibold tracking-[0.02em] text-accent"
            >
              18+
            </span>
            <a
              href="https://www.gambleaware.org"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() =>
                trackEvent("cta_click", {
                  label: "footer_gambleaware",
                  cta_type: "outbound",
                })
              }
              className="opacity-80 transition-opacity hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-4 focus-visible:ring-offset-panel"
            >
              <img
                src={gambleAware.src}
                alt="GambleAware — help and support for anyone affected by gambling"
                width={152}
                height={21}
                className="h-[21px] w-auto"
              />
            </a>
          </div>

          {/* The single most important sentence in the footer. This site sells to
              operators; a visitor who arrives from a search for a game name has
              to be told, unambiguously, that they cannot play here for money. */}
          <p className="!mb-0 max-w-xl font-SpaceGrotesk text-[12px] leading-[1.6] text-faint md:text-right">
            Bet4.win is a B2B games supplier for licensed operators — not a
            consumer casino. 18+ only. Please gamble responsibly.
          </p>
        </div>

        {/* Registered entity, address and any licence numbers belong on this
            line. They are left out rather than guessed — see data/proof.js for
            the same rule applied to the diligence figures. */}
        <div className="border-t border-line/40 py-6">
          <p className="!mb-0 font-SpaceGrotesk text-[12px] text-faint">
            © {year} Bet4.win. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
