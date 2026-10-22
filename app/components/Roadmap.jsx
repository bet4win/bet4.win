"use client";
import React from "react";
import Section from "./Section";
import { ArrowRight } from "./Icons";
import { trackEvent } from "@/app/lib/analytics";

// The release schedule, as a schedule: one dated row per title, month first,
// because the month is what the list is ordered by and what an operator plans
// against. It used to be a rail of hatched placeholder cards; the plates
// promised artwork nobody had drawn yet, and a row of text promises only what
// is actually settled — the name, the mechanic and the month.
export default function Roadmap({ releases }) {
  if (!releases?.length) return null;

  return (
    <Section
      id="roadmap"
      surface="raised"
      aria-labelledby="roadmap-heading"
      innerClassName="grid gap-8 py-14 md:py-20 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:gap-14"
    >
      <div>
        <h2
          id="roadmap-heading"
          className="b4w-display !mb-0 !text-[clamp(1.7rem,1.2rem+1.6vw,2.4rem)] !text-ink"
        >
          What ships next
        </h2>
        <p className="!mb-0 mt-3 max-w-md b4w-copy font-Text text-muted">
          One original a month. Each arrives on the integration you already
          have, with nothing to re-certify and nothing to rebuild.
        </p>
      </div>

      <div>
        <ol className="!mb-0 list-none border-t border-line p-0">
          {releases.map((r) => (
            <li
              key={r.id}
              className="grid grid-cols-[5.5rem_minmax(0,1fr)] gap-x-5 gap-y-1 border-b border-line py-5 md:grid-cols-[7rem_minmax(0,1fr)]"
            >
              <p className="b4w-figure !mb-0 pt-1 text-[15px] text-muted">
                {r.label}
                {(r.isNext || r.delivered) && (
                  <span
                    className={`mt-1 block text-[13px] font-semibold ${
                      r.delivered ? "text-accent" : "text-brand"
                    }`}
                  >
                    {r.delivered ? "Delivered" : r.isThisMonth ? "This month" : "Next"}
                  </span>
                )}
              </p>
              <div>
                <h3 className="!mb-0 flex flex-wrap items-baseline gap-x-3 font-Text text-[clamp(1.1rem,0.95rem+0.5vw,1.3rem)] font-bold !leading-tight !text-ink">
                  {r.title}
                  <span className="text-[14px] font-normal text-muted">{r.category}</span>
                </h3>
                <p className="!mb-0 mt-1.5 max-w-2xl b4w-copy font-Text text-muted">
                  {r.teaser}
                </p>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-6 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="!mb-0 max-w-md b4w-copy font-Text text-muted">
            The full schedule, including titles we haven&rsquo;t announced, goes
            out under NDA.
          </p>
          <a
            href="mailto:info@bet4.win?subject=Full%20roadmap%20request"
            onClick={() =>
              trackEvent("cta_click", { label: "request_roadmap", cta_type: "email" })
            }
            className="b4w-btn b4w-btn--quiet"
          >
            Request the full roadmap
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </Section>
  );
}
