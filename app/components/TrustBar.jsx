import React from "react";

// Four facts about the platform, as a plain list. Each used to sit beside an
// icon in a glowing disc, which turned four sentences into four badges and is
// the strip every generated SaaS page opens with.
const stats = [
  "Uptime 99.99%",
  "Fast response times worldwide",
  "Certified RGS and RNG",
  "Bespoke design and branding",
];

export default function TrustBar() {
  return (
    <section className="border-b border-line/40 bg-panel">
      <ul className="!mb-0 mx-auto flex max-w-[1280px] list-none flex-wrap gap-x-8 gap-y-2 px-5 py-5 font-Text text-[15px] text-muted md:px-12">
        {stats.map((label) => (
          <li key={label}>{label}</li>
        ))}
      </ul>
    </section>
  );
}
