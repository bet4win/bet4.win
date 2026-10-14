// What's coming next — the release schedule the homepage roadmap renders.
//
// This is deliberately NOT part of `games.js`. A catalogue entry needs art, a
// launch URL and a set of published figures; a roadmap entry is a name, a
// mechanic and a month. Keeping unbuilt titles out of `games.js` is also what
// stops them appearing in the grid, the sitemap and the share-card generator,
// all of which key off `status === "active"` but would still need a thumbnail to
// render at all.
//
// A title stays on the rail after it SHIPS, flagged `delivered: true`, rather than coming off
// it. A roadmap that only ever shows unkept promises is a wish list — the nodes an operator can
// check against the catalogue above are the whole reason to believe the rest of it. Delivered
// titles rotate off once newer ones have proved the cadence (Chicken, September, did on
// 2026-10-15).
//
// A delivered title is deliberately never the "next" one: `upcomingReleases` skips it when it
// picks `nextId`, so the accent stays on what is actually still coming. Its live catalogue entry
// (art, launch URL, published figures) lives in `games.js`; this entry is still just a name, a
// mechanic and a month.
//
// !! SHIP WINDOWS ARE UNCONFIRMED except the delivered ones, which are facts rather
// than forecasts. The rest is placed on the "a new original every month" cadence
// the rest of the site promises. Those are the one thing on this page nobody can
// check from the outside, so they want a real sign-off before this goes live —
// edit `ships` below and nothing else changes.
//
// `ships` is YYYY-MM. It is parsed, not printed: the section sorts on it, labels
// it, and works out which title is next.
export const roadmap = [
  {
    id: "diamond-mine",
    title: "Diamond Mine",
    category: "Crash",
    ships: "2026-10",
    delivered: true,
    // Mechanic, not flavour. An operator scanning the rail is asking "is this
    // another one of the same" — so each line has to say what the player is
    // actually doing. Condensed from the game's own spec (apps/diamond-mine/
    // game.spec.yaml in the games repo), not written from scratch.
    teaser:
      "First-person dwarven mining on the crash ladder. Swing until the pillar fails — or cash out before the roof does.",
  },
  {
    id: "keno-party",
    title: "Keno Party",
    category: "Instant",
    ships: "2026-10",
    delivered: true,
    // Condensed from the game's own rules copy (multiplayer-keno/public/locales/en/game.json).
    teaser:
      "Keno on a shared draw. Every player at the table picks up to ten numbers, then one draw settles every ticket at once.",
  },
  {
    id: "sunset-peak",
    // WORKING TITLE — confirm the name before this rail goes live.
    title: "Sunset Peak",
    // Unconfirmed: the mechanic isn't locked yet. Climbing originals in development run on
    // the crash ladder, so it sits there until the spec says otherwise.
    category: "Crash",
    ships: "2026-11",
    // The brief as given (2026-10-15): a climb up a steep mountain for the sunset view. Kept to
    // what that brief commits to — ledge-by-ledge risk — and nothing more specific.
    teaser:
      "Climb a steep mountain face for the sunset at the top. Every ledge gained raises the multiplier; one slip ends the climb.",
  },
];

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

// "2026-10" -> "Oct 2026". Built by hand rather than with Intl.DateTimeFormat:
// this string is rendered on the server and then hydrated on the client, and the
// two run in different time zones often enough that a Date-based month can
// legitimately disagree across the boundary.
export function shipLabel(ships) {
  const [year, month] = ships.split("-");
  return `${MONTHS[Number(month) - 1]} ${year}`;
}

// Sorted, and with the nearest release flagged. `now` is injectable so the
// caller can pass a fixed date in a test; in the app it is the render time.
export function upcomingReleases(now = new Date()) {
  const current = `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, "0")}`;
  const sorted = [...roadmap].sort((a, b) => a.ships.localeCompare(b.ships));
  // The first title whose window has not already passed. Everything before it
  // stays on the rail — a roadmap that silently drops last month's release
  // looks like it was never promised.
  // Delivered titles are excluded: one that shipped this month would otherwise
  // win `ships >= current` and take the "Next" marker off the title that is
  // actually still coming.
  const nextId = sorted.find((r) => !r.delivered && r.ships >= current)?.id;
  return sorted.map((r) => ({
    ...r,
    label: shipLabel(r.ships),
    isNext: r.id === nextId,
    // Only ever refines the "Next" marker into "This month". The month name
    // itself is always rendered — it is the rail's axis, and a node labelled
    // only "This month" is the one stop you cannot place against the others.
    isThisMonth: r.ships === current,
  }));
}
