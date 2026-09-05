import Link from "next/link";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import { ArrowRight } from "@/app/components/Icons";
import React from "react";

export const metadata = {
  title: "Page not found",
  description:
    "This page doesn't exist. Explore Bet4.win's provably-fair RGS and originals catalogue for iGaming operators.",
  robots: { index: false, follow: true },
};

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col bg-bg font-SpaceGrotesk text-ink antialiased">
      <Header />
      <main className="relative flex flex-grow flex-col items-center justify-center overflow-hidden px-5 py-32 text-center md:px-12">
        {/* Signature glow, matching the homepage sections */}
        <div
          className="pointer-events-none absolute inset-0 -z-10 opacity-60 blur-[120px]"
          style={{
            background:
              "radial-gradient(circle at 50% 38%, rgba(34,211,238,0.10), transparent 55%), radial-gradient(circle at 62% 62%, rgba(129,140,248,0.11), transparent 55%)",
          }}
        />
        <p className="mb-4 font-SpaceGrotesk text-[13px] uppercase tracking-[0.08em] text-cyan">
          Error 404
        </p>
        <h1 className="mb-3 max-w-xl b4w-display !text-[clamp(2rem,1.4rem+2vw,2.9rem)] !text-ink">
          This page rolled snake eyes.
        </h1>
        <p className="mb-8 max-w-md font-SpaceGrotesk text-[1.05rem] leading-[1.6] text-muted">
          The page you&rsquo;re looking for has moved or never existed. Let&rsquo;s
          get you back to the catalogue.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-md b4w-sheen bg-brand-strong px-7 py-3 font-SpaceGrotesk text-[13px] font-semibold uppercase tracking-[0.04em] !text-white shadow-[0_0_26px_-4px_rgba(37,99,235,0.5)] transition-colors hover:bg-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
        >
          Back to homepage
          <ArrowRight className="h-4 w-4" />
        </Link>
      </main>
      <Footer />
    </div>
  );
}
