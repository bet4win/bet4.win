import { games } from "@/data/games";
import { gameContent } from "@/data/gameContent";
import { slugFor } from "@/app/lib/slug";

// Art direction comps only. Each game's cut-out key visual, wordmark and clear
// play scene come from its marketing pack in ../ui/marketing/<game>/, resized
// into public/assets/img/comps/. Chicken, Dragon and the two roulette tables use
// the `hero` cut-out: their key visual has the scene painted in.
const HERO = new Set(["chicken", "dragon", "roulette", "american-roulette"]);

const fmt = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });

const firstSentence = (text = "") => {
  const m = text.match(/^.*?[.!?](\s|$)/);
  return (m ? m[0] : text).trim();
};

export const catalogue = games
  .filter((g) => g.status === "active")
  .map((g) => {
    const slug = slugFor(g);
    const base = `/assets/img/comps/${slug}`;
    return {
      ...g,
      slug,
      art: `${base}-${HERO.has(slug) ? "hero" : "kv"}.webp`,
      wordmark: `${base}-wm.webp`,
      scene: `${base}-bg.webp`,
      line: firstSentence(gameContent[slug]?.paragraphs?.[0]),
      max: g.maxMultiplier ? `${fmt.format(g.maxMultiplier)}×` : null,
    };
  });

export const bySlug = Object.fromEntries(catalogue.map((g) => [g.slug, g]));
