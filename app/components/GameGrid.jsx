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

  // Cards are links to the game pages now; the modal below is still mounted
  // here because the spotlight, the hero deck and ?game= deep links all open it
  // through registerGameLauncher. The grid no longer opens it itself.
  const cards = visible.map((game, i) => (
    <GameCard key={game.id} game={game} index={i} ceiling={CEILING} />
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

      {/* One column under 360px. Two columns there give each card a 94px body,
          and the catalogue has single-word titles — "Blackjack", "Baccarat",
          "Roulette" — that cannot wrap and were simply cut off. Every phone from
          an iPhone SE 2 up is 375px or wider and gets the two-up grid. */}
      <div className="grid grid-cols-1 gap-3 min-[360px]:grid-cols-2 md:grid-cols-3 md:gap-4 lg:grid-cols-4">
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
// new family needs no change here.
function CategoryFilter({ items, value, onChange }) {
  const counts = new Map();
  for (const g of items) {
    if (!g.category) continue;
    counts.set(g.category, (counts.get(g.category) || 0) + 1);
  }
  if (counts.size < 2) return null;

  const options = [ALL, ...counts.keys()];

  return (
    // A group of toggles rather than a radiogroup: these are buttons that change
    // what is listed below, and aria-pressed says exactly that without promising
    // arrow-key roving that the component does not implement.
    // Desktop only. Seven pills wrap to three rows on a phone — about 170px of
    // screen, before the catalogue they are filtering has shown a single card.
    // The grid below is already ordered and finite, and scrolling it is cheaper
    // than reading a control panel first.
    <div
      role="group"
      aria-label="Filter the catalogue by category"
      className="mb-6 hidden flex-wrap gap-2 md:flex"
    >
      {options.map((label) => {
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
            className={`b4w-btn min-h-[44px] sm:min-h-0 ${
              on ? "b4w-btn--primary" : "b4w-btn--ghost"
            }`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}

