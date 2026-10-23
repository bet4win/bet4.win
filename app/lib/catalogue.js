import { games } from "@/data/games";
import { gameContent } from "@/data/gameContent";
import { artFor } from "@/data/gameArt";
import { slugFor } from "@/app/lib/slug";
import { posts } from "@/data/news";

const fmt = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });

const firstSentence = (text = "") => {
  const m = text.match(/^.*?[.!?](\s|$)/);
  return (m ? m[0] : text).trim();
};

// When a title went live: the date of its release post (`<slug>-release` in
// data/news.js). One source for it, so the newsroom and the NEW badge can't
// disagree.
const RELEASED = Object.fromEntries(
  posts.filter((p) => p.slug.endsWith("-release")).map((p) => [p.slug.slice(0, -"-release".length), p.date]),
);

// NEW for one calendar month after release, then it drops off by itself. It
// used to be an `isNew` flag on each game that somebody had to remember to
// remove, and ten games were still wearing it months after launch.
export function isNewRelease(game, now = new Date()) {
  const released = RELEASED[slugFor(game)];
  if (!released) return false;
  const until = new Date(`${released}T00:00:00Z`);
  until.setUTCMonth(until.getUTCMonth() + 1);
  return now < until;
}

// "100,000×", or null for a title whose cap is set per operator (HiLo).
export const formatMax = (value) => (value ? `${fmt.format(value)}×` : null);

// Every live title with what the presentation needs: its slug, its art from
// data/gameArt.js, and one line about it. The line is the spotlight headline
// where a game has one, and otherwise the first sentence of its own rules copy
// (data/gameContent.js) — first-party text, so it can't promise a mechanic the
// game doesn't have.
export const liveCatalogue = games
  .filter((g) => g.status === "active")
  .map((g) => {
    const slug = slugFor(g);
    return {
      game: g,
      slug,
      art: artFor(slug),
      line: g.featured?.headline ?? firstSentence(gameContent[slug]?.paragraphs?.[0]),
      max: formatMax(g.maxMultiplier),
    };
  });

export const catalogueEntry = (slug) => liveCatalogue.find((e) => e.slug === slug) ?? null;
