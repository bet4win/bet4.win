import React from "react";
import LegalPage from "@/app/components/LegalPage";

export const metadata = {
  title: "Terms of Use",
  description:
    "The terms governing use of the bet4.win website and the play-money game demos it hosts.",
  alternates: { canonical: "/terms" },
  robots: { index: true, follow: true },
};

const UPDATED = "12 August 2026";

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Use"
      updated={UPDATED}
      intro="These terms govern your use of the bet4.win website and the play-money demos on it. By using the site you accept them."
    >
      <p className="b4w-todo">
        Before publishing: confirm the governing law and jurisdiction, and the
        registered legal entity named in clause 1. Have a qualified adviser
        review this text — it is drafted from what the site actually does, not as
        legal advice.
      </p>

      <h2>1. About this site</h2>
      <p>
        Bet4.win supplies a Remote Gaming Server and a catalogue of
        provably-fair original games to licensed gaming operators. This website
        is business-to-business marketing material aimed at those operators. It
        is not a casino, it offers no real-money play, and it accepts no
        deposits, wagers or withdrawals.
      </p>
      <p className="b4w-todo">
        TO CONFIRM — registered company name, number and address.
      </p>

      <h2>2. Age requirement</h2>
      <p>
        This site presents real-money casino game content and is intended for
        people aged 18 or over. You must confirm you meet that requirement before
        viewing it. If you are under 18, do not use this site.
      </p>

      <h2>3. The demos</h2>
      <p>
        Games on this site run in demo mode with play money only. No stake is
        accepted, nothing can be won, and no balance shown in a demo has any
        monetary value or can be withdrawn. Demos are provided to let prospective
        partners evaluate the games, and may be changed, interrupted or removed
        at any time without notice.
      </p>

      <h2>4. Game figures are indicative</h2>
      <p>
        Return to player, maximum multiplier, volatility and similar figures
        shown on this site describe a game&rsquo;s default configuration. The
        live values depend on the game version and on the configuration agreed
        with each operator, and the operator&rsquo;s own maximum-win cap applies
        in play. Treat everything published here as indicative. Contractual
        figures are the ones set out in a signed integration agreement, and those
        prevail over anything on this website.
      </p>

      <h2>5. Responsible gambling</h2>
      <p>
        Gambling should be entertainment, never a way to make money. If it stops
        feeling that way, free confidential help is available at{" "}
        <a
          href="https://www.gambleaware.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          GambleAware.org
        </a>
        .
      </p>

      <h2>6. Acceptable use</h2>
      <p>You agree not to:</p>
      <ul>
        <li>
          attempt to gain unauthorised access to this site, the gaming server or
          any connected system;
        </li>
        <li>
          probe, scan, overload or disrupt the site or its infrastructure, or
          interfere with anyone else&rsquo;s use of it;
        </li>
        <li>
          scrape or systematically extract content, or reuse it to build a
          competing catalogue;
        </li>
        <li>
          reverse engineer, decompile or tamper with any game, other than
          performing the fairness verification the site openly invites.
        </li>
      </ul>
      <p>
        Verifying a game result using the published seeds and hashes is expressly
        permitted — that is what provably-fair means, and the site provides the
        tools for it.
      </p>

      <h2>7. Intellectual property</h2>
      <p>
        The games, artwork, wordmarks, copy and code on this site belong to
        Bet4.win or its licensors and are protected by copyright and trade mark
        law. Nothing here grants you a licence to use them. Third-party marks
        shown on the site remain the property of their respective owners and
        appear for identification only.
      </p>

      <h2>8. Availability and accuracy</h2>
      <p>
        The site is provided &ldquo;as is&rdquo;. We do not warrant that it will
        be uninterrupted or error-free, and we may change or withdraw any part of
        it at any time. We take reasonable care over the accuracy of what we
        publish but do not warrant that it is complete or current.
      </p>

      <h2>9. Liability</h2>
      <p>
        To the extent permitted by law, we are not liable for indirect or
        consequential loss, or for loss of profit, revenue, business or data,
        arising from your use of this website. Nothing in these terms limits
        liability for death or personal injury caused by negligence, for fraud,
        or for anything else that cannot lawfully be limited.
      </p>

      <h2>10. External links</h2>
      <p>
        Where we link to another organisation&rsquo;s site, we do so for
        reference. We are not responsible for its content or its privacy
        practices.
      </p>

      <h2>11. Privacy</h2>
      <p>
        Our <a href="/privacy">Privacy &amp; Cookie Policy</a> explains what this
        site stores on your device and how we handle personal data.
      </p>

      <h2>12. Changes</h2>
      <p>
        We may revise these terms. The date at the top always reflects the
        current version, and continuing to use the site means accepting the
        version then in force.
      </p>

      <h2>13. Governing law</h2>
      <p className="b4w-todo">
        TO CONFIRM — governing law and the courts having exclusive jurisdiction.
      </p>

      <h2>14. Contact</h2>
      <p>
        Questions about these terms:{" "}
        <a href="mailto:info@bet4.win">info@bet4.win</a>.
      </p>
    </LegalPage>
  );
}
