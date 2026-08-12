import React from "react";
import Link from "next/link";
import { ArrowRight, Server, ShieldCheck, Grid } from "./Icons";

// The home page's job is to route people, so the three interior pages get an
// explicit door each rather than being buried in the nav.
const LINKS = [
  {
    href: "/platform",
    icon: Server,
    label: "Platform",
    title: "One integration. The whole catalogue.",
    body: "A certified RGS, one API, and every original we ship behind it.",
  },
  {
    href: "/provably-fair",
    icon: ShieldCheck,
    label: "Provably fair",
    title: "Verify every result yourself.",
    body: "Commit, reveal, recompute. Check a live round in the browser.",
  },
  {
    href: "/branding",
    icon: Grid,
    label: "Branding",
    title: "Every pixel, your brand.",
    body: "Swap the palette once; it lands across the whole catalogue.",
  },
];

export default function ExploreLinks() {
  return (
    <section
      aria-labelledby="explore-heading"
      className="mx-auto max-w-[1280px] px-5 py-16 md:px-12"
    >
      <h2
        id="explore-heading"
        className="mb-8 font-SpaceGrotesk !text-[12px] !font-normal uppercase !tracking-[0.1em] !text-faint"
      >
        Explore
      </h2>
      <div className="grid gap-4 md:grid-cols-3">
        {LINKS.map(({ href, icon: Icon, label, title, body }) => (
          <Link
            key={href}
            href={href}
            className="machined-surface group flex flex-col rounded-xl border border-line bg-panel-low p-6 transition-colors hover:border-cyan/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
          >
            <span
              className="mb-5 flex h-10 w-10 items-center justify-center rounded-md border border-line bg-panel text-cyan"
              aria-hidden="true"
            >
              <Icon className="h-5 w-5" />
            </span>
            <p className="!mb-0 font-SpaceGrotesk text-[11px] uppercase tracking-[0.08em] text-faint">
              {label}
            </p>
            <p className="!mb-0 mt-2 font-SpaceGrotesk text-[1.15rem] font-semibold !leading-[1.25] !tracking-[-0.01em] !text-ink">
              {title}
            </p>
            <p className="!mb-0 mt-3 font-SpaceGrotesk text-[0.92rem] leading-[1.6] text-muted">
              {body}
            </p>
            {/* mt-auto so the three CTAs line up even when the titles above
                them wrap to different numbers of lines. */}
            <span className="mt-auto inline-flex items-center gap-1.5 pt-5 font-SpaceGrotesk text-[12px] uppercase tracking-[0.06em] text-cyan transition-colors group-hover:text-cyan">
              Read more
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
