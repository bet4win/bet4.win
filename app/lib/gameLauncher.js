// Lets a button outside the catalogue (the Punch spotlight) open the game modal
// that <Games> owns.
//
// Games' open/close path is entangled with pushState/popstate history handling
// so the modal is shareable and Back-closable. Hoisting that into a context
// would mean moving the history logic and rewiring the page tree; this keeps it
// where it is and just gives it a second entry point.
let handler = null;

// <Games> registers itself on mount. Last mount wins — there is only ever one.
export function registerGameLauncher(fn) {
  handler = fn;
  return () => {
    if (handler === fn) handler = null;
  };
}

// Open a game by slug (its lowercased title, e.g. "punch"). No-op if the
// catalogue hasn't mounted yet, which is why the spotlight's Play demo button
// falls back to the #games anchor.
export function launchGame(slug) {
  if (!handler) return false;
  return handler(slug);
}
