import React from "react";
import PageShell from "@/app/components/PageShell";
import PageHeader from "@/app/components/PageHeader";
import CertMark from "@/app/components/CertMark";
import ProvablyFair from "@/app/components/ProvablyFair";
import ClosingCta from "@/app/components/ClosingCta";

export const metadata = {
  title: "Provably fair",
  description:
    "Every Bet4.win round is committed before the bet and verifiable after it: server seed hash, client seed and nonce through SHA-256. Check a live result yourself.",
  alternates: { canonical: "/provably-fair" },
};

export default function ProvablyFairPage() {
  return (
    <PageShell>
      <PageHeader
        title="Trust by maths, not by promise."
        scene="dice"
        art="dice"
        intro="Every outcome is fixed before the bet is placed and can be recomputed afterwards by anyone holding the seeds. Nothing about it requires taking our word — the terminal below runs against the live RGS."
      >
        <CertMark tone="light" className="mt-6" />
      </PageHeader>
      <ProvablyFair />
      <ClosingCta />
    </PageShell>
  );
}
