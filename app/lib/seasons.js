// Seasonal variants of a game: what they are called, what they look like on
// this site, and where they launch.
//
// A seasonal variant is its OWN registered game on the RGS, not a flag on the
// standard one. Punch Halloween has its own game id, and the launch endpoint
// resolves it to a client URL that already carries `?season=halloween` —
// configured against the game, not passed by whoever launched it. So there is
// nothing for this site to append: a variant is simply a second launch URL,
// and that is the whole integration.
//
// (Worth knowing if you are tempted to add `&season=…` to a URL by hand: the
// launch endpoint copies only an allowlist of query parameters through to the
// client, and `season` is not on it. A hand-added one is silently dropped.)
//
// What lives here is only the presentation half — the glyph and the label that
// tell an operator the variant exists. The dressing itself is the client's,
// in ../ui/lib/season/.
import { Ghost, Play } from "@/app/components/Icons";

export const SEASONS = {
  halloween: {
    label: "Halloween",
    Icon: Ghost,
    // The season's own `--season-accent`, copied from the client's
    // seasons/halloween.ts so the chip on the card is lit by the same colour
    // the game is. Deliberately not a brand colour: the chip's whole job is to
    // say "Halloween", and navy or mint would say "Bet4.win" instead.
    tint: "#ff7518",
  },
};

// The id of the undressed game in a launch menu. Not a season — it is the
// entry that launches `game.url`, the same thing every other title's button
// does — but it needs a name so the menu can key and report it.
export const STANDARD = "standard";

// The seasons a game declares, minus any this site doesn't know how to draw.
// Filtered rather than trusted so a game pointed at a season that hasn't been
// given a glyph yet renders nothing, instead of an undefined icon.
export const seasonsFor = (game) =>
  Object.keys(game.seasons ?? {}).filter((id) => Object.hasOwn(SEASONS, id));

// Every build of a game, in menu order: the standard one first, then each
// season it ships. Empty for a game with no variants, which is how the
// launcher knows to stay a plain button.
//
// The first entry is also what the launcher's main button fires, so pressing
// play without opening the menu always gets the standard build.
export function seasonOptions(game) {
  const ids = seasonsFor(game);
  if (ids.length === 0) return [];

  return [
    {
      id: STANDARD,
      label: "Standard",
      // The main button's own glyph, reused. This row and that button launch
      // the same thing, and sharing the icon says so; a neutral dot in the
      // slot was a shape with nothing behind it.
      Icon: Play,
      tint: "var(--color-faint)",
      url: game.url,
    },
    ...ids.map((id) => ({
      id,
      label: SEASONS[id].label,
      Icon: SEASONS[id].Icon,
      tint: SEASONS[id].tint,
      url: game.seasons[id],
    })),
  ];
}
