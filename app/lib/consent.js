// Cookie-consent flag. Analytics does not load until this is set, so the first
// visit is tracking-free until the visitor acknowledges the notice.
//
// Deliberately NOT marked "use client": the root layout reads these constants on
// the server. In a "use client" module they arrive there as client-reference
// stubs (functions), so `cookie.value === CONSENT_COOKIE_VALUE` silently never
// matches and the notice reappears on every visit. rememberConsent() touches
// `document`, but it is only ever called from a client component.
export const CONSENT_COOKIE = "b4w_cookie_ok";
export const CONSENT_COOKIE_VALUE = "1";
const ONE_YEAR = 60 * 60 * 24 * 365;

export function rememberConsent() {
  // Secure is dropped on localhost — Safari and Firefox reject Secure cookies
  // over plain http, which would silently break consent in `next dev`.
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${CONSENT_COOKIE}=${CONSENT_COOKIE_VALUE}; Max-Age=${ONE_YEAR}; Path=/; SameSite=Lax${secure}`;
}
