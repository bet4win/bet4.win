"use client";
import React from "react";
import Section from "./Section";
import { trackEvent } from "@/app/lib/analytics";
import { bookingUrl } from "@/app/lib/site";
import { openBooking } from "@/app/lib/booking";

// The ask, said plainly and left-aligned like everything above it. It used to
// be a centred "Ready to integrate?" on a drifting aurora with embers rising
// through it — the closing block every generated landing page ends on.
export default function ClosingCta() {
  return (
    <Section
      id="contact"
      surface="base"
      rule
      innerClassName="grid gap-8 py-14 md:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] md:items-end md:gap-14 md:py-20"
    >
      <div>
        <h2 className="b4w-display !mb-0 !text-[clamp(1.9rem,1.3rem+2vw,2.9rem)] !text-ink [text-wrap:balance]">
          Book a <span className="whitespace-nowrap">30-minute</span> demo
        </h2>
        <p className="!mb-0 mt-4 max-w-xl b4w-copy--lead font-Text text-muted">
          We&rsquo;ll walk your team through the catalogue, the integration and
          the branding, on a call that fits your calendar.
        </p>
      </div>

      <div className="flex flex-col items-start gap-4 md:items-end">
        <a
          href={bookingUrl("closing_cta")}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => {
            trackEvent("cta_click", { label: "book_demo", cta_type: "booking" });
            if (openBooking("closing_cta")) e.preventDefault();
          }}
          className="b4w-btn b4w-btn--primary b4w-btn--lg"
        >
          Pick a time
        </a>
        {/* The address, written out: a reader who wants to ask a question first
            can copy it without opening a mail client. */}
        <p className="!mb-0 font-Text text-[15px] text-muted">
          Or write to{" "}
          <a
            href="mailto:info@bet4.win"
            onClick={() => trackEvent("cta_click", { label: "email_direct", cta_type: "email" })}
            className="!text-ink underline decoration-line underline-offset-4 hover:decoration-ink"
          >
            info@bet4.win
          </a>
        </p>
      </div>
    </Section>
  );
}
