import Link from "next/link";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import { ArrowRight } from "@/app/components/Icons";
import Motes from "@/app/components/Motes";
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
        {/* The same two aurora layers the homepage sections carry, so a 404 is
            still recognisably this site rather than a bare error page. */}
        <span aria-hidden="true" className="b4w-mesh" />
        <span aria-hidden="true" className="b4w-mesh b4w-mesh--warm" />
        <Motes count={8} />
        {/* `relative`, and nothing here sets a z-index — the ambient layers
            above are absolutely positioned, so static content would paint
            UNDER them. Same arrangement, and the same reasoning, as
            <Section>. */}
        <div className="relative flex flex-col items-center">
          <p className="mb-4 font-SpaceGrotesk text-[13px] uppercase tracking-[0.08em] text-accent">
            Error 404
          </p>
          <h1 className="mb-3 max-w-xl b4w-display !text-[clamp(2rem,1.4rem+2vw,2.9rem)] max-[359px]:!text-[1.75rem] !text-ink">
            This page rolled snake eyes.
          </h1>
          <p className="mb-8 max-w-md b4w-copy--lead font-SpaceGrotesk text-muted">
            The page you&rsquo;re looking for has moved or never existed.
            Let&rsquo;s get you back to the catalogue.
          </p>
          <Link href="/" className="b4w-btn b4w-btn--primary b4w-btn--lg">
            Back to homepage
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
