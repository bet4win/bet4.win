import React from "react";
import LegalPage from "@/app/components/LegalPage";

export const metadata = {
  title: "Privacy & Cookie Policy",
  description:
    "How Bet4.win handles personal data and cookies on this website, the analytics we use, and the rights you have under the GDPR.",
  alternates: { canonical: "/privacy" },
  robots: { index: true, follow: true },
};

const UPDATED = "12 August 2026";

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy & Cookie Policy"
      updated={UPDATED}
      intro="This policy covers the bet4.win website only. It explains what this site stores on your device, the one analytics service it uses, and how to exercise your rights over that data."
    >
      <p className="b4w-todo">
        Before publishing: replace the placeholders marked TO CONFIRM below with
        the registered legal entity, its address and company number, and the
        contact point for data-protection requests. Have a qualified adviser
        review this text — it is drafted from what the site technically does, not
        as legal advice.
      </p>

      <h2>Who we are</h2>
      <p>
        This website is operated by Bet4.win (&ldquo;we&rdquo;,
        &ldquo;us&rdquo;). We provide a Remote Gaming Server and a catalogue of
        provably-fair original games to licensed gaming operators. This is a
        business-to-business marketing site: it does not offer real-money play
        and does not accept deposits.
      </p>
      <p className="b4w-todo">
        TO CONFIRM — registered company name, registration number, registered
        address, and the data controller&rsquo;s contact details.
      </p>

      <h2>What we collect</h2>
      <p>
        We do not operate accounts on this website, and there is no registration
        or payment form. We do not ask you for your name, address or any
        financial detail. In practice we handle personal data in only two ways:
      </p>
      <ul>
        <li>
          <strong>Analytics data</strong> — if you accept cookies, Google
          Analytics records the pages you view, approximate location derived from
          your IP address, device and browser type, and the events described
          below. This is pseudonymous: it is tied to a randomly generated
          identifier, not to you by name.
        </li>
        <li>
          <strong>Email correspondence</strong> — if you write to us at{" "}
          <a href="mailto:info@bet4.win">info@bet4.win</a>, we hold your email
          address and whatever you choose to put in the message so we can reply.
        </li>
      </ul>

      <h2>Cookies this site sets</h2>
      <p>
        Two cookies are strictly necessary — they exist only to remember choices
        you have already made, and are set whether or not you accept analytics:
      </p>
      <ul>
        <li>
          <code>b4w_age_ok</code> — records that you confirmed you are 18 or
          over, so you are not asked on every visit. Expires after one year.
        </li>
        <li>
          <code>b4w_cookie_ok</code> — records that you acknowledged the cookie
          notice. Expires after one year.
        </li>
      </ul>
      <p>
        Neither identifies you. Both hold a single value and no personal data.
      </p>
      <p>
        <strong>Analytics cookies</strong> (<code>_ga</code> and{" "}
        <code>_ga_*</code>) are set by Google Analytics 4 and last up to two
        years. They are not loaded at all until you accept the cookie notice — on
        a first visit, no analytics script runs and no analytics cookie is
        written.
      </p>
      <p>
        We record a small number of events to understand which games draw
        interest: which demo was opened, which call-to-action was clicked, and
        the answer given to the age prompt. These carry no personal identifiers.
      </p>

      <h2>Legal basis</h2>
      <ul>
        <li>
          <strong>Consent</strong> for analytics cookies. You give it by
          accepting the cookie notice, and you can withdraw it at any time (see
          below).
        </li>
        <li>
          <strong>Legitimate interest</strong> for the strictly necessary
          cookies, which are required to deliver a function you asked for — not
          being re-prompted on every page.
        </li>
        <li>
          <strong>Legitimate interest</strong> in replying to business
          correspondence you initiate.
        </li>
      </ul>

      <h2>Who else receives data</h2>
      <p>
        <strong>Google</strong> processes the analytics data as our processor.
        Google may transfer it outside the European Economic Area; those
        transfers rely on the European Commission&rsquo;s Standard Contractual
        Clauses and the EU–US Data Privacy Framework.
      </p>
      <p>
        <strong>Game demos</strong> run inside an embedded frame served from our
        own gaming server. Opening a demo loads content from that server, which
        receives the request in the ordinary course of serving it.
      </p>
      <p>
        Typefaces are compiled into this site at build time, so no request is
        made to any font service while you browse. We do not sell personal data,
        and we do not run advertising or cross-site tracking.
      </p>

      <h2>How long we keep it</h2>
      <p>
        Analytics records are retained by Google for 14 months from your last
        visit and then deleted automatically. Cookies expire on the schedule
        listed above. Email correspondence is kept for as long as needed to deal
        with your enquiry and our ordinary business records.
      </p>

      <h2>Your rights</h2>
      <p>
        If the GDPR or UK GDPR applies to you, you may request access to your
        personal data, ask for it to be corrected or erased, restrict or object
        to how we use it, and ask for a portable copy. You may withdraw consent
        at any time without affecting processing already carried out.
      </p>
      <p>
        To exercise any of these, write to{" "}
        <a href="mailto:info@bet4.win">info@bet4.win</a>. You also have the right
        to complain to your national data protection authority.
      </p>

      <h2>Withdrawing consent</h2>
      <p>
        Delete this site&rsquo;s cookies in your browser settings. The next time
        you visit, the cookie notice appears again and no analytics script will
        load until you accept it. You can also install Google&rsquo;s{" "}
        <a
          href="https://tools.google.com/dlpage/gaoptout"
          target="_blank"
          rel="noopener noreferrer"
        >
          Analytics opt-out add-on
        </a>{" "}
        to block it across every site.
      </p>

      <h2>Changes</h2>
      <p>
        We may update this policy as the site changes. The date at the top always
        reflects the current version.
      </p>

      <h2>Contact</h2>
      <p>
        Questions about this policy: <a href="mailto:info@bet4.win">info@bet4.win</a>.
      </p>
    </LegalPage>
  );
}
