import React from "react";
import PageShell from "@/app/components/PageShell";
import PageHeader from "@/app/components/PageHeader";
import BrandStudio from "@/app/components/BrandStudio";
import BrandProcess from "@/app/components/BrandProcess";
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
        title="Games that look like they were built for you."
        scene="diamonds"
        art="diamonds"
        intro="White-labelling here is not a logo in the corner. Your logo, colours and typeface go into one theme, and every game in the catalogue wears it — see it on a real game below."
      />
      <BrandStudio />
      <BrandProcess />
      <ClosingCta />
    </PageShell>
  );
}
