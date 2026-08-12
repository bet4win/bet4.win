"use client";
import React, { useState, useEffect, useRef } from "react";
import { games } from "@/data/games";
import GameCard from "./GameCard";
import GameModal from "./GameModal";
import { registerGameLauncher } from "@/app/lib/gameLauncher";
import { trackEvent } from "@/app/lib/analytics";

const isLive = (game) => game.status === "active";

// Shareable URL slug for a game (matches the ?game= param + the OG card name).
const slugFor = (game) => game.title.toLowerCase();
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

// The grid plus the demo modal and all the URL/history handling that goes with
// it. Render one per page: it registers the global launcher and a popstate
// listener. `items` controls which cards appear; everything else works off the
// full catalogue.
export default function GameGrid({ items, scrollTargetId = "games" }) {
  const [active, setActive] = useState(null);
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

  return (
    <div ref={sectionRef} id={scrollTargetId}>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4">
        {items.map((game, i) => (
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
        ))}
      </div>

      <GameModal game={active} onClose={closeGame} />
    </div>
  );
}
