import React from "react";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";

// Every route renders through this, so the header, the skip link and the footer
// stay identical across the site instead of being re-declared per page.
// `snap` makes each top-level section of <main> a full screen that the page
// snaps to, so Space / Page Down move one section at a time (see .b4w-snap in
// globals.css). The homepage uses it; reading pages don't.
export default function PageShell({ children, overlayHeader = false, snap = false }) {
  return (
    // shrink-0 is load-bearing, and the reason is three properties away from
    // here. The template's base layer sets `body { display: flex; height: 100% }`,
    // which makes this div a flex item in an 844px-tall column. A flex item's
    // automatic minimum size would normally stop it being shrunk below its
    // content — but declaring min-height (which `min-h-screen` does, for the
    // 404 page's benefit) REPLACES that automatic minimum. So this box was
    // being compressed to exactly 100vh while holding ~11,000px of page.
    //
    // Nothing looked wrong, because the content simply overflowed visibly. What
    // broke was the sticky header inside it: a sticky element cannot travel
    // past its containing block, so the header unstuck about one viewport down
    // and scrolled away with the page for the rest of the site.
    <div className="relative min-h-screen shrink-0 bg-bg font-Text text-ink antialiased">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-brand-strong focus:px-4 focus:py-2 focus:font-Text focus:text-[13px] focus:!text-white"
      >
        Skip to content
      </a>
      <Header overlay={overlayHeader} />
      <main id="main" className={snap ? "b4w-snap" : undefined}>
        {children}
      </main>
      <Footer />
    </div>
  );
}
