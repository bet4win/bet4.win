// 18+ gate. A single non-identifying flag — no PII, and strictly necessary for
// the function the visitor asked for — so it needs no consent banner.
//
// Only "yes" is persisted. A "no" is deliberately not stored: the denied screen
// lasts until the visitor reloads, so a mis-tap doesn't lock anyone out.
export const AGE_COOKIE = "b4w_age_ok";
export const AGE_COOKIE_VALUE = "1";
const ONE_YEAR = 60 * 60 * 24 * 365;

// The cookie notice waits for the age gate to clear rather than stacking two
// dialogs on a first visit. AgeGate announces here; CookieConsent listens.
const ageListeners = new Set();

export function onAgeConfirmed(fn) {
  ageListeners.add(fn);
  return () => ageListeners.delete(fn);
}

export function rememberAgeConfirmed() {
  // `Secure` is dropped on localhost — Safari and Firefox reject Secure cookies
  // over plain http, which would silently break the gate in `next dev`.
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${AGE_COOKIE}=${AGE_COOKIE_VALUE}; Max-Age=${ONE_YEAR}; Path=/; SameSite=Lax${secure}`;
  ageListeners.forEach((fn) => fn());
}
