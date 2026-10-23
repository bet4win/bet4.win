import { games } from "@/data/games";
import { gameContent } from "@/data/gameContent";
import { artFor } from "@/data/gameArt";
import { slugFor } from "@/app/lib/slug";

const fmt = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });

const firstSentence = (text = "") => {
  const m = text.match(/^.*?[.!?](\s|$)/);
  return (m ? m[0] : text).trim();
};

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
