import React from "react";
import Section from "./Section";
import FairnessVerifier from "./FairnessVerifier";
import { ShieldCheck } from "./Icons";

const steps = [
  {
    n: "01",
    title: "Commitment",
    body: "The server generates a seed, hashes it with SHA-256, and shows you the hash before the bet — fixing the outcome in advance.",
  },
  {
    n: "02",
    title: "Input",
    body: "The player contributes their own client seed. From this point neither party can know the result alone.",
  },
  {
    n: "03",
    title: "Resolution",
    body: "Server seed, client seed and nonce combine into a deterministic, unalterable result you can re-hash and confirm.",
  },
];

export default function ProvablyFair() {
  return (
    <Section
      id="provably-fair"
      surface="raised"
      rule
      texture
      innerClassName="py-12 md:py-20"
    >
      <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-2">
        <div>
          <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1.5 font-SpaceGrotesk text-[11px] font-semibold uppercase tracking-[0.1em] text-accent">
            <ShieldCheck className="h-3.5 w-3.5" />
            Absolute transparency
          </span>
          <h2 className="mb-8 max-w-md b4w-display !text-[clamp(2rem,1.3rem+2.2vw,3rem)] max-[359px]:!text-[1.75rem] !text-ink">
            Verify every result yourself.
          </h2>

          {/* Numbered because this genuinely is a sequence — the commitment has
              to exist before the player's seed, and the result cannot be
              computed before either. The rule between the markers is what says
              "and then", which a list of bullets would not. */}
          <ol className="!mb-0 flex list-none flex-col gap-6 !pl-0">
            {steps.map((s, i) => (
              <li key={s.n} className="relative flex items-start gap-5">
                <span className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-accent/35 bg-accent/10 font-JetBrainsMono text-[12px] font-semibold text-accent tabular-nums">
                  {s.n}
                  {/* The connector to the next step. Drawn from the marker, not
                      between the rows, so it stays put when the copy wraps. */}
                  {i < steps.length - 1 && (
                    <span
                      aria-hidden="true"
                      className="absolute left-1/2 top-full h-6 w-px -translate-x-1/2 bg-gradient-to-b from-accent/35 to-transparent"
                    />
                  )}
                </span>
                <div>
                  <h3 className="font-SpaceGrotesk !text-[clamp(1rem,0.956rem+0.225vw,1.1rem)] !font-semibold !text-ink">
                    {s.title}
                  </h3>
                  <p className="mt-1 max-w-md b4w-copy font-SpaceGrotesk text-muted">
                    {s.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        {/* Live verifier — calls the same RGS fairness API the games use */}
        <FairnessVerifier />
      </div>
    </Section>
  );
}
