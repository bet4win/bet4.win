"use client";
import React from "react";
import Image from "next/image";
import { trackEvent } from "@/app/lib/analytics";
import { bookingUrl } from "@/app/lib/site";
import { openBooking } from "@/app/lib/booking";
import { artFor } from "@/data/gameArt";
import { useArrival } from "@/app/lib/motion";

// The ask, at a table: Blackjack's empty felt under a single lamp, which is
// what a meeting about games should look like. Said plainly, left-aligned like
// the rest of the site, with the email address written out for a reader who
// wants to ask something before booking half an hour.
const SCENE = artFor("blackjack").scene;

export default function ClosingCta() {
  const ref = useArrival();
  return (
    <section ref={ref} id="contact" aria-labelledby="contact-heading" className="relative isolate overflow-hidden bg-bg">
      <Image src={SCENE} alt="" fill sizes="100vw" className="b4w-lamp -z-10 object-cover object-[50%_70%] brightness-125" />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(8,9,14,0.9)_0%,rgba(8,9,14,0.45)_55%,rgba(8,9,14,0.1)_100%)]"
      />
      <div aria-hidden="true" className="absolute inset-x-0 top-0 -z-10 h-32 bg-gradient-to-b from-bg to-transparent" />

      <div className="mx-auto flex max-w-[1280px] flex-col items-start gap-6 px-5 py-20 md:px-12 md:py-32">
        <h2
          id="contact-heading"
          className="b4w-display !mb-0 max-w-3xl !text-[clamp(2rem,1.2rem+3vw,4rem)] !text-ink [text-wrap:balance]"
        >
          Book a <span className="whitespace-nowrap">30-minute</span> demo
        </h2>
        <p className="!mb-0 max-w-xl b4w-copy--lead font-Text text-ink/80">
          We&rsquo;ll walk your team through the catalogue, the integration and
          the branding, on a call that fits your calendar.
        </p>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
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
          <p className="!mb-0 font-Text text-[16px] text-ink/80">
            or write to{" "}
            <a
              href="mailto:info@bet4.win"
              onClick={() => trackEvent("cta_click", { label: "email_direct", cta_type: "email" })}
              className="font-semibold !text-ink underline decoration-white/40 underline-offset-4 hover:decoration-white"
            >
              info@bet4.win
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
