// What's coming next — the release schedule the homepage roadmap renders.
//
// This is deliberately NOT part of `games.js`. A catalogue entry needs art, a
// launch URL and a set of published figures; a roadmap entry is a name, a
// mechanic and a month. Keeping unbuilt titles out of `games.js` is also what
// stops them appearing in the grid, the sitemap and the share-card generator,
// all of which key off `status === "active"` but would still need a thumbnail to
// render at all.
//
// Chicken is the one title that exists in BOTH files, and since 2026-09-17 it is
// there for the opposite reason to before. It used to be listed here because it
// was unbuilt; it stays listed here now because it SHIPPED in the month this rail
// promised it in, and `delivered: true` badges it as such. A roadmap that only
// ever shows unkept promises is a wish list — the one node an operator can check
// against the catalogue above is the whole reason to believe the rest of it.
//
// A delivered title is deliberately never the "next" one: `upcomingReleases`
// skips it when it picks `nextId`, so the accent stays on what is actually still
// coming. Its live catalogue entry (art, launch URL, published figures) lives in
// `games.js`; this entry is still just a name, a mechanic and a month.
//
// !! SHIP WINDOWS ARE UNCONFIRMED except Chicken's, which is now a fact rather
// than a forecast. The rest is placed on the "a new original every month" cadence
// the rest of the site promises. Those are the one thing on this page nobody can
// check from the outside, so they want a real sign-off before this goes live —
// edit `ships` below and nothing else changes.
//
// `ships` is YYYY-MM. It is parsed, not printed: the section sorts on it, labels
// it, and works out which title is next.
export const roadmap = [
  {
    id: "chicken",
    title: "Chicken",
    category: "Minefield",
    ships: "2026-09",
    delivered: true,
    // Mechanic, not flavour. An operator scanning the rail is asking "is this
    // another one of the same" — so each line has to say what the player is
    // actually doing.
    teaser:
      "Cross the traffic one lane at a time. Every lane clear steps the multiplier; one wrong step ends the run.",
  },
  {
    id: "diamond-mine",
    title: "Diamond Mine",
    category: "Crash",
    ships: "2026-10",
    // Description condensed from the game's own spec (apps/diamond-mine/
    // game.spec.yaml in the games repo), not written from scratch.
    teaser:
      "First-person dwarven mining on the crash ladder. Swing until the pillar fails — or cash out before the roof does.",
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
