import React from "react";
import { ShieldCheck } from "./Icons";
import { rngCertificate as cert } from "@/data/proof";

// The RNG certification, stated the same way everywhere it appears: who tested
// it. No jurisdiction — the certificate transfers to whichever market an
// operator licenses in, so naming one would understate it — and no report
// reference, which goes to an operator's compliance team on request rather
// than onto a marketing page.
//
// `tone="light"` is for sitting on a game's room, where muted grey text would
// sink into the picture.
export default function CertMark({ className = "", tone = "muted" }) {
  return (
    <p
      className={`!mb-0 inline-flex items-center gap-2.5 font-Text text-[14px] ${
        tone === "light" ? "text-ink/85" : "text-muted"
      } ${className}`}
    >
      <ShieldCheck className="h-4 w-4 shrink-0 text-accent" />
      <span>
        RNG certified by{" "}
        <span className="font-semibold text-ink">
          {cert.lab} ({cert.labShort})
        </span>
      </span>
    </p>
  );
}
