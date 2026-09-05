import React from "react";
import PageShell from "@/app/components/PageShell";
import PageHeader from "@/app/components/PageHeader";
import Services from "@/app/components/Services";
import Integration from "@/app/components/Integration";
import TrustBar from "@/app/components/TrustBar";
import ClosingCta from "@/app/components/ClosingCta";
import Reveal from "@/app/components/Reveal";

export const metadata = {
  title: "The platform",
  description:
    "One certified Remote Gaming Server, a single API integration, and the promo tooling operators run on — built for concurrency and white-labelled as your own.",
  alternates: { canonical: "/platform" },
};

export default function PlatformPage() {
  return (
    <PageShell>
      <PageHeader
        eyebrow="Platform"
        title="One integration. The whole catalogue."
        intro="A certified Remote Gaming Server behind every original we ship, connected once and reported on in one place — so adding next month's game costs you nothing but a config change."
      />
      <TrustBar />
      <Reveal>
        <Services />
      </Reveal>
      <Reveal>
        <Integration />
      </Reveal>
      <ClosingCta />
    </PageShell>
  );
}
