import React from "react";
import { Bolt, Palette, Pulse, ShieldCheck } from "./Icons";

// Four facts, each with the icon that actually depicts it — the row used to run
// a tick, a bolt, a shield and a pair of braces, and only two of those had
// anything to do with the words beside them.
const stats = [
  { icon: Pulse, label: "Uptime 99.99%" },
  { icon: Bolt, label: "Blazing fast response times globally" },
  { icon: ShieldCheck, label: "Certified RGS and RNG" },
  { icon: Palette, label: "Bespoke design and branding" },
];

export default function TrustBar() {
  return (
    // Solid rather than translucent: this strip and the ticker above it are one
    // continuous `raised` band now, and a /40 fill let the section boundary show
    // through as a seam that was never meant to be there.
    <section className="border-b border-line/40 bg-panel">
      <div className="mx-auto flex max-w-[1280px] flex-wrap items-center justify-between gap-x-6 gap-y-4 px-5 py-5 font-SpaceGrotesk text-[13px] text-muted md:px-12">
        {stats.map(({ icon: Icon, label }) => (
          <div key={label} className="flex items-center gap-2.5">
            {/* The icon sits in its own small disc. On a flat strip an unboxed
                icon reads as a bullet point; a disc makes it a mark. */}
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-line/80 bg-panel-high/60 text-accent">
              <Icon className="h-3.5 w-3.5" />
            </span>
            <span>{label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
