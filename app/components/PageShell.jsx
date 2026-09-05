import React from "react";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";

// Every route renders through this, so the header, the skip link and the footer
// stay identical across the site instead of being re-declared per page.
export default function PageShell({ children }) {
  return (
    <div className="min-h-screen bg-bg font-SpaceGrotesk text-ink antialiased">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-brand-strong focus:px-4 focus:py-2 focus:font-SpaceGrotesk focus:text-[13px] focus:!text-white"
      >
        Skip to content
      </a>
      <Header />
      <main id="main">{children}</main>
      <Footer />
    </div>
  );
}
