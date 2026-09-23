import React from "react";
import PageShell from "@/app/components/PageShell";
import PageHeader from "@/app/components/PageHeader";
import Section from "@/app/components/Section";
import SignatureGenerator from "@/app/components/SignatureGenerator";

// Internal tool. Kept out of the index three ways: noindex here, a Disallow in
// app/robots.js, and no entry in app/sitemap.js. Nothing links to it.
export const metadata = {
  title: "Email signature",
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
};

export default function SignaturePage() {
  return (
    <PageShell>
      <PageHeader
        eyebrow="Internal"
        title="Email signature"
        titleSize="sm"
        intro="Fill in your details, copy the signature, paste it into your mail client's signature settings. Nothing you type leaves this page."
      />
      <Section surface="base" innerClassName="pb-24 pt-4">
        <SignatureGenerator />
      </Section>
    </PageShell>
  );
}
