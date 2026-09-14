// Dismissal flag for the trade-show strip. A single non-identifying preference,
// so it needs no consent banner — same reasoning as the 18+ cookie.
//
// Deliberately NOT marked "use client": the root layout reads these on the
// server, and in a "use client" module they would arrive there as
// client-reference stubs and silently never match. See app/lib/consent.js,
// which carries the same caveat for the same reason.
//
// The stored value is the event-id set rather than a bare "1", so publishing a
// new show re-shows a bar someone dismissed for the previous one.
export const EVENTS_COOKIE = "b4w_events_hidden";
const ONE_YEAR = 60 * 60 * 24 * 365;

// Joined with "." rather than "," so the value needs no percent-encoding to
// survive a round trip through Set-Cookie and Next's cookie parser.
export function eventsSignature(list) {
  return list
    .map((e) => e.id)
    .sort()
    .join(".");
}

export function rememberEventsDismissed(signature) {
  // Secure is dropped on localhost — Safari and Firefox reject Secure cookies
  // over plain http, which would silently break this in `next dev`.
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${EVENTS_COOKIE}=${encodeURIComponent(
    signature,
  )}; Max-Age=${ONE_YEAR}; Path=/; SameSite=Lax${secure}`;
}
