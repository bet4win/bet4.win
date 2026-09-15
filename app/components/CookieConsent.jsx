"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Script from "next/script";
import { rememberConsent } from "@/app/lib/consent";
import { onAgeConfirmed } from "@/app/lib/ageGate";

const GA_ID = "G-0GHLVCP489";

// Owns both the cookie notice and the analytics tags, because one gates the
// other: GA4 is not injected until consent exists. Keeping them in one component
// avoids having to sync "has consented" across two trees.
export default function CookieConsent({ initialConsent, ageGatePending }) {
  const [consented, setConsented] = useState(initialConsent);
  // On a first visit the age gate is already covering the screen; queue the
  // notice behind it rather than stacking two dialogs.
  const [waitingForAge, setWaitingForAge] = useState(ageGatePending);

  useEffect(() => {
    if (!waitingForAge) return;
    return onAgeConfirmed(() => setWaitingForAge(false));
  }, [waitingForAge]);

  const accept = () => {
    rememberConsent();
    setConsented(true);
  };

  if (consented) {
    return (
      <>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_ID}');`}
        </Script>
      </>
    );
  }

  if (waitingForAge) return null;

  return (
    <div
      role="region"
      aria-label="Cookie notice"
      className="fixed inset-x-0 bottom-0 z-[9998] border-t border-line bg-panel/95 backdrop-blur-md"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="mx-auto flex max-w-[1280px] flex-col items-start gap-4 px-5 py-5 md:flex-row md:items-center md:justify-between md:px-12">
        <p className="!mb-0 max-w-3xl font-SpaceGrotesk text-[0.9rem] leading-[1.6] text-muted">
          We use cookies to measure how this site is used and improve it. By
          continuing you consent to our use of cookies as described in our{" "}
          <Link
            href="/privacy"
            className="!text-accent underline underline-offset-2 transition-colors hover:!text-ink focus-visible:!text-ink"
          >
            Privacy &amp; Cookie Policy
          </Link>
          .
        </p>
        <button
          type="button"
          onClick={accept}
          className="b4w-btn b4w-btn--primary b4w-btn--lg w-full md:w-auto"
        >
          OK
        </button>
      </div>
    </div>
  );
}
