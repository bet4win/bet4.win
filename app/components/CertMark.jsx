import React from "react";
import { ShieldCheck } from "./Icons";
import { rngCertificate as cert } from "@/data/proof";

// The RNG certification, stated the same way everywhere it appears: who tested
// it and for which jurisdiction. "For the UKGC jurisdiction", never a bare
// "UKGC": the certificate is a test against that regulator's standards, and a
// regulator's name on its own reads as a licence, which this is not. No report reference — that goes to an
// operator's compliance team on request, not onto a marketing page.
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
        </span>{" "}
        for the{" "}
        <abbr title={cert.jurisdictionName} className="font-semibold text-ink no-underline">
          {cert.jurisdiction}
        </abbr>{" "}
        jurisdiction
      </span>
    </p>
  );
}
