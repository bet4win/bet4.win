"use client";
import React from "react";
import Section from "./Section";
import { ArrowRight } from "./Icons";
import { trackEvent } from "@/app/lib/analytics";
import { bookingUrl } from "@/app/lib/site";
import { openBooking } from "@/app/lib/booking";

export default function ClosingCta() {
  return (
    <Section
      id="contact"
      surface="raised"
      rule
      texture
      motes={8}
      innerClassName="py-16 text-center md:py-28"
    >
      <div className="mx-auto flex max-w-2xl flex-col items-center">
        <h2 className="mb-3 b4w-display !text-[clamp(2rem,1.3rem+2.2vw,3rem)] max-[359px]:!text-[1.75rem] !text-ink">
          Ready to integrate?
        </h2>
        <p className="mb-8 b4w-copy--lead font-SpaceGrotesk text-muted">
          Add a verifiably-fair originals suite to your brand.
        </p>
        <div className="flex flex-col items-center gap-3 sm:flex-row">
          {/* The pair is deliberate: pick a slot, or just write to us. Somebody
              who wants to ask a question before committing to half an hour of
              someone's calendar still has a door. */}
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
            Book a demo
            <ArrowRight className="h-4 w-4" />
          </a>
          <a
            href="mailto:info@bet4.win"
            onClick={() => trackEvent("cta_click", { label: "email_direct", cta_type: "email" })}
            // The address is set in mono and NOT uppercased — it is a literal
            // string someone may want to read character by character, which is
            // the one thing the button family's tracking-out label style is
            // worst at.
            className="b4w-btn b4w-btn--quiet !font-JetBrainsMono !text-[13px] !normal-case !tracking-normal"
          >
            info@bet4.win
          </a>
        </div>
      </div>
    </Section>
  );
}
