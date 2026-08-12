"use client";
import React from "react";
import { trackEvent } from "@/app/lib/analytics";
// Official mark, self-hosted like every other asset here. The charity rebranded
// from BeGambleAware to GambleAware (begambleaware.org 301s to gambleaware.org),
// so this is their current wordmark — already a reversed variant, which is why
// it reads on the dark footer without a filter.
import gambleAware from "@/public/assets/img/compliance/gambleaware.svg";

const links = [
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
  {
    label: "Contact",
    href: "mailto:info@bet4.win",
    onClick: () =>
      trackEvent("cta_click", { label: "footer_contact", cta_type: "email" }),
  },
];

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-line/40 bg-panel-low">
      <div className="mx-auto flex max-w-[1280px] flex-col items-center justify-between gap-6 px-5 py-12 md:flex-row md:px-12">
        {links.length > 0 && (
          <nav
            aria-label="Footer"
            className="flex flex-wrap items-center justify-center gap-6"
          >
            {links.map((l) => (
              <a
                key={l.label}
                href={l.href}
                onClick={l.onClick}
                className="font-SpaceGrotesk text-[12px] uppercase tracking-[0.05em] !text-muted transition-colors hover:!text-ink focus-visible:outline-none focus-visible:!text-ink"
              >
                {l.label}
              </a>
            ))}
          </nav>
        )}
        {/* Responsible-gambling badges. Deliberately just these two: licence
            marks (MGA, UKGC) must only appear for licences actually held. */}
        <div className="flex items-center gap-5">
          <span
            role="img"
            aria-label="18 plus only"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-muted/60 font-SpaceGrotesk text-[11px] font-semibold tracking-[0.02em] text-muted"
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
            className="opacity-80 transition-opacity hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-4 focus-visible:ring-offset-panel-low"
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

        <p className="font-SpaceGrotesk text-[13px] text-muted !mb-0">
          © {year} Bet4.win. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
