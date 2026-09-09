import React from "react";
import FairnessVerifier from "./FairnessVerifier";

const steps = [
  {
    n: "01",
    title: "Commitment",
    body: "The server generates a seed, hashes it with SHA-256, and shows you the hash before the bet — fixing the outcome in advance.",
    tone: "text-cyan",
  },
  {
    n: "02",
    title: "Input",
    body: "The player contributes their own client seed. From this point neither party can know the result alone.",
    tone: "text-cyan",
  },
  {
    n: "03",
    title: "Resolution",
    body: "Server seed, client seed and nonce combine into a deterministic, unalterable result you can re-hash and confirm.",
    tone: "text-cyan",
  },
];

export default function ProvablyFair() {
  return (
    <section id="provably-fair" className="relative overflow-hidden py-20">
      {/* Signature glow — the one place colour leaves the game tiles */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-60 blur-[110px]"
        style={{
          background:
            "radial-gradient(circle at 20% 40%, rgba(34,211,238,0.10), transparent 50%), radial-gradient(circle at 60% 60%, rgba(129,140,248,0.12), transparent 55%)",
        }}
      />
      <div className="mx-auto grid max-w-[1280px] grid-cols-1 items-center gap-14 px-5 md:px-12 lg:grid-cols-2">
        <div>
          <span className="mb-5 inline-block rounded border border-cyan/30 bg-cyan/10 px-2.5 py-1 font-SpaceGrotesk text-[12px] uppercase tracking-[0.06em] text-cyan">
            Absolute transparency
          </span>
          <h2 className="mb-8 max-w-md b4w-display !text-[clamp(2rem,1.3rem+2.2vw,3rem)] !text-ink">
            Verify every result yourself.
          </h2>

          <div className="flex flex-col gap-6">
            {steps.map((s) => (
              <div key={s.n} className="flex items-start gap-5">
                <span
                  className={`mt-0.5 font-SpaceGrotesk text-[14px] font-semibold ${s.tone}`}
                >
                  {s.n}
                </span>
                <div>
                  <h3 className="font-SpaceGrotesk !text-[1.1rem] !font-semibold !text-ink">
                    {s.title}
                  </h3>
                  <p className="mt-1 max-w-md font-SpaceGrotesk text-[0.9rem] leading-[1.55] text-muted">
                    {s.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live verifier — calls the same RGS fairness API the games use */}
        <FairnessVerifier />
      </div>
    </section>
  );
}
