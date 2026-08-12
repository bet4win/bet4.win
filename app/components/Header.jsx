"use client";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight } from "./Icons";
import logo from "@/public/assets/img/b4w-logo.svg";

// Real routes now, not same-page anchors — each label goes somewhere.
const NAV = [
  { label: "Platform", href: "/platform" },
  { label: "Games", href: "/games" },
  { label: "Provably Fair", href: "/provably-fair" },
  { label: "Branding", href: "/branding" },
];

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const panelRef = useRef(null);

  // A game page is "under" Games, so the section stays lit while you're in it.
  const isActive = (href) =>
    pathname === href || (href === "/games" && pathname.startsWith("/games/"));

  // Route change closes the menu — without this it stays open over the new page.
  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="fixed top-0 z-50 w-full border-b border-line/40 bg-bg/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1280px] items-center justify-between px-5 py-4 md:px-12">
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

        <nav aria-label="Main" className="hidden items-center gap-9 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href) ? "page" : undefined}
              className={`font-SpaceGrotesk text-[12px] uppercase tracking-[0.06em] transition-colors hover:!text-ink focus-visible:!text-ink focus-visible:outline-none ${
                isActive(item.href) ? "!text-cyan" : "!text-muted"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            // A direct action rather than "/#contact": from an interior page
            // that anchor would navigate you off the page you're reading.
            href="mailto:info@bet4.win?subject=Demo%20request"
            className="hidden items-center gap-1.5 rounded-md b4w-sheen bg-brand-strong px-4 py-2 font-SpaceGrotesk text-[12px] font-semibold !uppercase tracking-[0.04em] !text-white shadow-[0_0_26px_-4px_rgba(37,99,235,0.5)] transition-colors hover:bg-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-bg sm:inline-flex"
          >
            Book a demo
            <ArrowRight className="h-4 w-4" />
          </Link>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            className="flex h-10 w-10 items-center justify-center rounded-md border border-line text-ink transition-colors hover:bg-panel focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand md:hidden"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              aria-hidden="true"
            >
              {open ? (
                <path d="M6 6l12 12M18 6L6 18" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile navigation — the site had none before, so phones had no way to
          move between pages at all. */}
      {open && (
        <div
          id="mobile-nav"
          ref={panelRef}
          className="border-t border-line/40 bg-bg/95 backdrop-blur-md md:hidden"
        >
          <nav aria-label="Main" className="flex flex-col px-5 py-3">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive(item.href) ? "page" : undefined}
                className={`border-b border-line/40 py-3.5 font-SpaceGrotesk text-[13px] uppercase tracking-[0.06em] transition-colors last:border-b-0 hover:!text-ink focus-visible:!text-ink focus-visible:outline-none ${
                  isActive(item.href) ? "!text-cyan" : "!text-muted"
                }`}
              >
                {item.label}
              </Link>
            ))}
            <Link
              // A direct action rather than "/#contact": from an interior page
              // that anchor would navigate you off the page you are reading.
              href="mailto:info@bet4.win?subject=Demo%20request"
              className="mt-4 inline-flex items-center justify-center gap-1.5 rounded-md b4w-sheen bg-brand-strong px-4 py-3 font-SpaceGrotesk text-[13px] font-semibold !uppercase tracking-[0.04em] !text-white transition-colors hover:bg-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
            >
              Book a demo
              <ArrowRight className="h-4 w-4" />
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
