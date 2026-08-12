"use client";
import React from "react";
import { trackEvent } from "@/app/lib/analytics";

export default function ClosingCta() {
  return (
    <section id="contact" className="relative px-5 py-28 text-center md:px-12">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-transparent to-panel-low" />
      <div className="mx-auto flex max-w-2xl flex-col items-center">
        <h2 className="mb-3 b4w-display !text-[clamp(2rem,1.3rem+2.2vw,3rem)] !text-ink">
          Ready to integrate?
        </h2>
        <p className="mb-8 font-SpaceGrotesk text-[1.05rem] text-muted">
          Add a verifiably-fair originals suite to your brand.
        </p>
        <div className="flex flex-col items-center gap-3 sm:flex-row">
          <a
            href="mailto:info@bet4.win?subject=Demo%20request"
            onClick={() => trackEvent("cta_click", { label: "book_demo", cta_type: "email" })}
            className="rounded-md b4w-sheen bg-brand-strong px-7 py-3 font-SpaceGrotesk text-[13px] font-semibold uppercase tracking-[0.04em] !text-white shadow-[0_0_26px_-4px_rgba(37,99,235,0.5)] transition-colors hover:bg-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
          >
            Book a demo
          </a>
          <a
            href="mailto:info@bet4.win"
            onClick={() => trackEvent("cta_click", { label: "email_direct", cta_type: "email" })}
            className="px-4 py-3 font-SpaceGrotesk text-[13px] !text-muted transition-colors hover:!text-ink focus-visible:outline-none focus-visible:!text-ink"
          >
            info@bet4.win
          </a>
        </div>
      </div>
    </section>
  );
}
