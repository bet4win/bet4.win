import "./globals.css";
import { Archivo, Libre_Franklin, JetBrains_Mono } from "next/font/google";
import { cookies } from "next/headers";
import AgeGate from "@/app/components/AgeGate";
import BookingDialog from "@/app/components/BookingDialog";
import CookieConsent from "@/app/components/CookieConsent";
import EventsBar from "@/app/components/EventsBar";
import { AGE_COOKIE, AGE_COOKIE_VALUE } from "@/app/lib/ageGate";
import { CONSENT_COOKIE, CONSENT_COOKIE_VALUE } from "@/app/lib/consent";
import {
  EVENTS_COOKIE,
  countdownLabel,
  eventsSignature,
} from "@/app/lib/eventsBar";
import { upcomingEvents } from "@/data/events";
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION } from "@/app/lib/site";

// Self-hosted at build time (no render-blocking Google Fonts <link>, no FOUT).
// The CSS variables are wired into the Tailwind @theme tokens in globals.css so
// the existing font utilities resolve to them.
//
// Archivo for headlines, at its widest (wdth 125) and set in sentence case:
// an expanded gothic reads like casino signage and a sports scoreboard, which
// is the world these games come from. Libre Franklin for everything a person
// reads — the same American-gothic lineage, built for running text. Space
// Grotesk went because it had become the default face of AI-generated landing
// pages; the site read as a template before anyone reached the games.
const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-archivo",
  display: "swap",
});

const franklin = Libre_Franklin({
  subsets: ["latin"],
  variable: "--font-franklin",
  display: "swap",
});

// Hashes, seeds and code on the fairness pages. Not for figures any more — a
// multiplier is a number, and the text face sets it in tabular lining figures.
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

const TITLE = "Bet4.win — Provably-fair originals, built for operators";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLE,
    template: "%s — Bet4.win",
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    url: SITE_URL,
    locale: "en_US",
    title: TITLE,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: SITE_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  category: "technology",
};

export const viewport = {
  themeColor: "#060a16",
  colorScheme: "dark",
  // Extend the page under the iOS safe areas so a fullscreen game modal can
  // cover the whole screen (incl. the home-indicator strip) instead of leaving
  // the site visible behind it. Enables env(safe-area-inset-*).
  viewportFit: "cover",
};

// Reading the age cookie here makes every route dynamic. "/" already is (its
// generateMetadata reads searchParams for per-game share cards), so the only
// cost is not-found losing static rendering — worth it to render the gate in
// the initial HTML rather than flashing the site before a client-side check.
export default async function RootLayout({ children }) {
  const store = await cookies();
  const showAgeGate = store.get(AGE_COOKIE)?.value !== AGE_COOKIE_VALUE;
  const hasConsent = store.get(CONSENT_COOKIE)?.value === CONSENT_COOKIE_VALUE;

  // Shows that have already finished are dropped here, so the strip empties
  // itself rather than advertising last month's expo. The dismissal cookie
  // stores the event-id set, so publishing a new show re-shows a hidden strip.
  // The countdown is resolved here, on the server, and travels with the event —
  // see countdownLabel() for why it isn't computed in the strip itself.
  const shows = upcomingEvents().map((e) => ({
    ...e,
    countdown: countdownLabel(e),
  }));
  const eventsDismissed =
    shows.length > 0 &&
    store.get(EVENTS_COOKIE)?.value === eventsSignature(shows);

  return (
    <html
      lang="en"
      className={`${archivo.variable} ${franklin.variable} ${jetbrainsMono.variable}`}
      // The inline script below adds `js` to this element before React hydrates,
      // so the server markup and the live DOM legitimately differ by that one
      // class. Scoped to <html>'s own attributes — descendants are still checked.
      suppressHydrationWarning
    >
      <head>
        {/* Marks scripting as available before first paint. Every entrance
            animation's hidden state is scoped to html.js, so a reader without
            JS (or a crawler that doesn't run it) gets the content outright
            instead of a page of invisible sections. */}
        <script
          dangerouslySetInnerHTML={{
            __html: "document.documentElement.classList.add('js')",
          }}
        />
      </head>
      {/* Locking scroll via a class (not an effect) holds before hydration too;
          AgeGate clears it once the visitor confirms. */}
      <body className={`home-dark${showAgeGate ? " age-gate-locked" : ""}`}>
        {showAgeGate && <AgeGate />}
        <EventsBar events={shows} initialDismissed={eventsDismissed} />
        {children}

        {/* Mounted once for the whole site — every booking CTA opens this one
            dialog through a DOM event rather than through props. Renders null
            until opened, and fetches nothing from Calendly before then. */}
        <BookingDialog />

        {/* Owns the cookie notice AND the GA4 tags: analytics is not injected
            until consent exists, so a first visit sets no tracking cookies. */}
        <CookieConsent
          initialConsent={hasConsent}
          ageGatePending={showAgeGate}
        />
      </body>
    </html>
  );
}
