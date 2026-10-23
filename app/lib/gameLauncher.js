import { trackEvent } from "@/app/lib/analytics";

// Lets any button on the page open the demo modal that <DemoHost> owns.
//
// DemoHost's open/close path is entangled with pushState/popstate handling so
// the modal is shareable and Back-closable. Hoisting that into a context would
// mean rewiring the page tree; this keeps it in one place and gives it a
// global entry point instead.
let handler = null;

// <DemoHost> registers itself on mount. Last mount wins — there is only ever one.
export function registerGameLauncher(fn) {
  handler = fn;
  return () => {
    if (handler === fn) handler = null;
  };
}

// Open a game by slug (e.g. "punch"), optionally in one of its seasonal
// builds ("christmas"). Returns false if no DemoHost is mounted, so an <a href>
// fallback can still navigate.
export function launchGame(slug, season = null) {
  if (!handler) return false;
  return handler(slug, season);
}

// The one call a "Play the demo" control makes: attribute the launch, then
// open it. `source` says which control it was ("stage", "lobby", …).
export function playDemo(game, slug, source, season = null) {
  trackEvent("game_launch", {
    game_id: game.id,
    game_title: game.title,
    source,
    ...(season ? { season } : {}),
  });
  return launchGame(slug, season);
}
