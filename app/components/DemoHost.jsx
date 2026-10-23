"use client";
import React, { useEffect, useRef, useState } from "react";
import { games } from "@/data/games";
import GameModal from "./GameModal";
import { registerGameLauncher } from "@/app/lib/gameLauncher";
import { trackEvent } from "@/app/lib/analytics";
import { slugFor } from "@/app/lib/slug";
import { SEASONS } from "@/app/lib/seasons";

const isLive = (game) => game.status === "active";

// Searches the whole catalogue, so a shared ?game= link opens any live title
// whatever the page happens to render.
const findBySlug = (slug) => {
  if (!slug) return null;
  const s = slug.toLowerCase();
  return games.find((g) => isLive(g) && (g.id === s || slugFor(g) === s)) || null;
};

// A season id is only honoured if the game actually ships that build.
const seasonFor = (game, season) =>
  game && season && game.seasons?.[season] && SEASONS[season] ? season : null;

// What the URL says should be open: ?game=<slug>[&season=<id>].
const fromUrl = () => {
  const params = new URLSearchParams(window.location.search);
  const game = findBySlug(params.get("game"));
  return game ? { game, season: seasonFor(game, params.get("season")) } : null;
};

const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"];

// The demo player and everything that goes with it: the modal, the ?game= URL
// it writes so a demo is shareable and Back closes it, and the global launcher
// every "Play the demo" button on the page calls through (launchGame in
// app/lib/gameLauncher). Mount one per page that can launch a demo.
//
// This used to live inside the catalogue grid, which meant a demo could only
// be opened on a page that rendered the grid, and the hero had to fall back to
// scrolling to it.
export default function DemoHost() {
  const [active, setActive] = useState(null);
  // Whether the open modal pushed its own history entry (a click) or arrived
  // by a shared link (the param was already in the URL). Decides how to close.
  const pushedRef = useRef(false);

  const openGame = (game, season = null) => {
    const params = new URLSearchParams(window.location.search);
    params.set("game", slugFor(game));
    if (season) params.set("season", season);
    else params.delete("season");
    window.history.pushState(null, "", `?${params}`);
    pushedRef.current = true;
    setActive({ game, season });
  };

  const closeGame = () => {
    if (pushedRef.current) {
      pushedRef.current = false;
      window.history.back(); // pops our entry; the popstate handler clears `active`
      return;
    }
    const params = new URLSearchParams(window.location.search);
    params.delete("game");
    params.delete("season");
    const qs = params.toString();
    window.history.replaceState(null, "", qs ? `?${qs}` : window.location.pathname);
    setActive(null);
  };

  // openGame only closes over window and setActive, both stable.
  useEffect(
    () =>
      registerGameLauncher((slug, season) => {
        const match = findBySlug(slug);
        if (!match) return false;
        openGame(match, seasonFor(match, season));
        return true;
      }),
    [],
  );

  useEffect(() => {
    const onPop = () => {
      pushedRef.current = false;
      setActive(fromUrl());
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  // A shared link: open the game on first load and attribute the launch.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const match = fromUrl();
    if (!match) return;

    const utmParams = Object.fromEntries(
      UTM_KEYS.flatMap((k) => {
        const v = params.get(k);
        return v ? [[k, v]] : [];
      }),
    );

    const timer = setTimeout(() => {
      setActive(match);
      trackEvent("game_launch", {
        game_id: match.game.id,
        game_title: match.game.title,
        source: "deep_link",
        ...(match.season ? { season: match.season } : {}),
        ...utmParams,
      });
    }, 150);

    return () => clearTimeout(timer);
  }, []);

  const season = active?.season;
  return (
    <GameModal
      game={active?.game ?? null}
      url={season ? active.game.seasons[season] : undefined}
      season={season ? SEASONS[season] : null}
      onClose={closeGame}
    />
  );
}
