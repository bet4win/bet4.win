import "./globals.css";
import { Space_Grotesk, JetBrains_Mono, Archivo_Black } from "next/font/google";
import { cookies } from "next/headers";
import AgeGate from "@/app/components/AgeGate";
import CookieConsent from "@/app/components/CookieConsent";
import EventsBar from "@/app/components/EventsBar";
import { AGE_COOKIE, AGE_COOKIE_VALUE } from "@/app/lib/ageGate";
import { CONSENT_COOKIE, CONSENT_COOKIE_VALUE } from "@/app/lib/consent";
import { EVENTS_COOKIE, eventsSignature } from "@/app/lib/eventsBar";
import { upcomingEvents } from "@/data/events";
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION } from "@/app/lib/site";

// Self-hosted at build time (no render-blocking Google Fonts <link>, no FOUT).
// The CSS variables are wired into the Tailwind @theme tokens in globals.css so
// the existing font utilities resolve to them.
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

// Poster-weight display face, used only for headline moments and the ticker.
// Space Grotesk alone reads like a SaaS dashboard; the catalogue is comic-book
// arcade art and needs a voice with some shout in it. Deliberately not one of
// the ubiquitous condensed poster faces.
const archivoBlack = Archivo_Black({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-archivo-black",
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
  themeColor: "#06080f",
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
  const shows = upcomingEvents();
  const eventsDismissed =
    shows.length > 0 &&
    store.get(EVENTS_COOKIE)?.value === eventsSignature(shows);

  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} ${archivoBlack.variable}`}
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
