import React from "react";
import PageShell from "@/app/components/PageShell";

// Shared shell for the policy pages. Prose typography lives in the `b4w-prose`
// class in globals.css rather than on every element, because these pages are
// long-form copy and the template stylesheet already styles bare tags.
export default function LegalPage({ title, updated, intro, children }) {
  return (
    <PageShell>
      <div className="mx-auto max-w-[820px] px-5 pb-24 pt-32 md:px-12 md:pt-40">
        <p className="font-SpaceGrotesk text-[12px] uppercase tracking-[0.08em] text-cyan">
          Legal
        </p>
        <h1 className="mt-3 b4w-display !text-[clamp(2rem,1.4rem+2vw,2.9rem)] !text-ink">
          {title}
        </h1>
        <p className="mt-4 font-SpaceGrotesk text-[12px] uppercase tracking-[0.06em] text-muted">
          Last updated {updated}
        </p>
        {intro && (
          <p className="mt-6 font-SpaceGrotesk text-[1.05rem] leading-[1.65] text-muted">
            {intro}
          </p>
        )}
        <div className="b4w-prose mt-10">{children}</div>
      </div>
    </PageShell>
  );
}
