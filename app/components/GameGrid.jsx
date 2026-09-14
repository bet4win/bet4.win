"use client";
import React, { useState, useEffect, useRef } from "react";
import { games } from "@/data/games";
import GameCard from "./GameCard";
import GameModal from "./GameModal";
import { registerGameLauncher } from "@/app/lib/gameLauncher";
import { trackEvent } from "@/app/lib/analytics";
// Shareable URL slug for a game (matches the ?game= param + the OG card name).
import { slugFor } from "@/app/lib/slug";

const isLive = (game) => game.status === "active";

// Deliberately searches the whole catalogue, not the rendered subset: the home
// page shows only a few cards but a shared ?game= link must still open any game.
const findBySlug = (slug) => {
  if (!slug) return null;
  const s = slug.toLowerCase();
  return games.find((g) => isLive(g) && (g.id === s || slugFor(g) === s)) || null;
};

const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"];

// Biggest ceiling in the catalogue — the reference the cards' magnitude bars are
// scaled against, so a subset of cards still shares the full catalogue's scale.
const CEILING = Math.max(...games.map((g) => g.maxMultiplier || 0));

const ALL = "All";

// The grid plus the demo modal and all the URL/history handling that goes with
// it. Render one per page: it registers the global launcher and a popstate
// listener. `items` controls which cards appear; everything else works off the
// full catalogue.
export default function GameGrid({
  items,
  scrollTargetId = "games",
  // Cap on how many cards render AFTER filtering. The home page shows a taste
  // of the catalogue; /games shows all of it.
  limit,
  filterable = false,
}) {
  const [active, setActive] = useState(null);
  const [filter, setFilter] = useState(ALL);
  const sectionRef = useRef(null);
  // Tracks whether the currently-open modal added its own history entry (a tile
  // click), vs. having been opened by a shared/deep link (the param was already
  // in the URL on load). Determines how we tidy up on close.
  const pushedRef = useRef(false);

  const openGame = (game) => {
    const params = new URLSearchParams(window.location.search);
    params.set("game", slugFor(game));
    window.history.pushState(null, "", `?${params}`);
    pushedRef.current = true;
    setActive(game);
  };

  const closeGame = () => {
    if (pushedRef.current) {
      pushedRef.current = false;
      window.history.back(); // pops our entry → popstate handler clears `active`
      return;
    }
    const params = new URLSearchParams(window.location.search);
    params.delete("game");
    const qs = params.toString();
    window.history.replaceState(null, "", qs ? `?${qs}` : window.location.pathname);
    setActive(null);
  };

  // Lets buttons outside this grid (the featured spotlight) open the modal.
  // openGame only closes over window + setActive, both stable, so the empty dep
  // list is safe.
  useEffect(
    () =>
      registerGameLauncher((slug) => {
        const match = findBySlug(slug);
        if (!match) return false;
        openGame(match);
        return true;
      }),
    [],
  );

  useEffect(() => {
    const onPop = () => {
      pushedRef.current = false;
      setActive(findBySlug(new URLSearchParams(window.location.search).get("game")));
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  // Initial deep link: open (and scroll to) the shared game on first load.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const match = findBySlug(params.get("game"));
    if (!match) return;

    const utmParams = Object.fromEntries(
      UTM_KEYS.flatMap((k) => {
        const v = params.get(k);
        return v ? [[k, v]] : [];
      }),
    );

    const timer = setTimeout(() => {
      sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      setActive(match);
      trackEvent("game_launch", {
        game_id: match.id,
        game_title: match.title,
        source: "deep_link",
        ...utmParams,
      });
    }, 150);

    return () => clearTimeout(timer);
  }, []);

  // Filter first, cap second. The home page passes the whole live catalogue with
  // limit=8, so picking "Cards" there searches all 17 titles and then shows up
  // to eight — rather than filtering the eight that happened to be previewed and
  // turning up nothing.
  const pool = filter === ALL ? items : items.filter((g) => g.category === filter);
  const visible = limit ? pool.slice(0, limit) : pool;

  const cards = visible.map((game, i) => (
    <GameCard
      key={game.id}
      game={game}
      index={i}
      ceiling={CEILING}
      onLaunch={(g) => {
        trackEvent("game_launch", { game_id: g.id, game_title: g.title });
        openGame(g);
      }}
    />
  ));

  return (
    <div ref={sectionRef} id={scrollTargetId}>
      {filterable && (
        <CategoryFilter
          items={items}
          value={filter}
          onChange={(next) => {
            setFilter(next);
            trackEvent("catalogue_filter", { category: next });
          }}
        />
      )}

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4">
        {cards}
      </div>

      <GameModal game={active} onClose={closeGame} />
    </div>
  );
}

// Quick filters by mechanic family.
//
// Options are derived from whatever is actually in `items`, in catalogue order,
// so a category can never appear with nothing behind it and adding a game to a
// new family needs no change here. Counts are shown because "Roulette (2)" sets
// an expectation that "Roulette" does not.
function CategoryFilter({ items, value, onChange }) {
  const counts = new Map();
  for (const g of items) {
    if (!g.category) continue;
    counts.set(g.category, (counts.get(g.category) || 0) + 1);
  }
  if (counts.size < 2) return null;

  const options = [[ALL, items.length], ...counts];

  return (
    // A group of toggles rather than a radiogroup: these are buttons that change
    // what is listed below, and aria-pressed says exactly that without promising
    // arrow-key roving that the component does not implement.
    <div
      role="group"
      aria-label="Filter the catalogue by category"
      className="mb-6 flex flex-wrap gap-2"
    >
      {options.map(([label, count]) => {
        const on = label === value;
        return (
          <button
            key={label}
            type="button"
            onClick={() => onChange(label)}
            aria-pressed={on}
            // min-h on touch only: these are the primary control for the
            // catalogue and at the desktop padding they measured 36px tall,
            // under the 44px target guidance.
            className={`inline-flex min-h-[44px] items-center gap-1.5 rounded-md border px-3 py-1.5 font-SpaceGrotesk text-[11px] font-semibold uppercase tracking-[0.07em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-bg sm:min-h-0 ${
              on
                ? "border-brand bg-brand-strong !text-white"
                : "border-line bg-panel-high/50 !text-muted hover:border-brand/50 hover:!text-ink"
            }`}
          >
            {label}
            <span
              className={`font-JetBrainsMono text-[10px] tabular-nums ${
                on ? "text-white/70" : "text-faint"
              }`}
            >
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
}

