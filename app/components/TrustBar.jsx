import React from "react";
import { Check, Bolt, ShieldCheck, Braces } from "./Icons";

const stats = [
  { icon: Check, label: "Uptime 99.99%", tone: "text-faint" },
  { icon: Bolt, label: "Blazing fast response times globally", tone: "text-faint" },
  { icon: ShieldCheck, label: "Certified RGS and RNG", tone: "text-faint" },
  { icon: Braces, label: "Bespoke design and branding", tone: "text-faint" },
];

export default function TrustBar() {
  return (
    <section className="border-y border-line/40 bg-panel-low/40 backdrop-blur-sm">
      <div className="mx-auto flex max-w-[1280px] flex-wrap items-center justify-between gap-6 px-5 py-4 font-SpaceGrotesk text-[13px] text-muted md:px-12">
        {stats.map(({ icon: Icon, label, tone }) => (
          <div key={label} className="flex items-center gap-2">
            <Icon className={`h-4 w-4 ${tone}`} />
            <span>{label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
