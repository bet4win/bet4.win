"use client";
import React, { useEffect, useRef, useState } from "react";
import { games } from "@/data/games";
import GameModal from "./GameModal";
import { registerGameLauncher } from "@/app/lib/gameLauncher";
import { trackEvent } from "@/app/lib/analytics";
import { slugFor } from "@/app/lib/slug";

const isLive = (game) => game.status === "active";

// Searches the whole catalogue, so a shared ?game= link opens any live title
// whatever the page happens to render.
const findBySlug = (slug) => {
  if (!slug) return null;
  const s = slug.toLowerCase();
  return games.find((g) => isLive(g) && (g.id === s || slugFor(g) === s)) || null;
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
      window.history.back(); // pops our entry; the popstate handler clears `active`
      return;
    }
    const params = new URLSearchParams(window.location.search);
    params.delete("game");
    const qs = params.toString();
    window.history.replaceState(null, "", qs ? `?${qs}` : window.location.pathname);
    setActive(null);
  };

  // openGame only closes over window and setActive, both stable.
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

  // A shared link: open the game on first load and attribute the launch.
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

  return <GameModal game={active} onClose={closeGame} />;
}
