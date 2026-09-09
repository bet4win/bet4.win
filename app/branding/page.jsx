import React from "react";
import PageShell from "@/app/components/PageShell";
import PageHeader from "@/app/components/PageHeader";
import Theming from "@/app/components/Theming";
import ClosingCta from "@/app/components/ClosingCta";

export const metadata = {
  title: "Branding",
  description:
    "Colours, logos, typefaces and background art bend to your brand across every title in the Bet4.win catalogue at once — plus social-casino language and freeplay mode.",
  alternates: { canonical: "/branding" },
};

export default function BrandingPage() {
  return (
    <PageShell>
      <PageHeader
        eyebrow="Branding"
        title="Games that look like they were built for you."
        intro="White-labelling here is not a logo in the corner. Swap the palette once and it lands across the whole catalogue — try the brand switcher below."
      />
      <Theming />
      <ClosingCta />
    </PageShell>
  );
}
