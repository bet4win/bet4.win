// Seasonal variants of a game: what they are called, what they look like on
// this site, and where they launch.
//
// On this site a seasonal variant is simply a second launch URL: the same
// client with `season=<id>`, which is what it dresses itself from (see `demo`
// in data/games.js). On the RGS each variant is its own registered game.
//
// What lives here is only the presentation half — the glyph and the label that
// tell an operator the variant exists. The dressing itself is the client's,
// in ../ui/lib/season/.
import { Ghost, Play, Snowflake } from "@/app/components/Icons";

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
  christmas: {
    label: "Christmas",
    Icon: Snowflake,
    // Baby blue, NOT the client's `--season-accent` (#d6332a): on a card the
    // chip sits beside reds and golds of the art itself, and a red chip on a
    // red-and-green Christmas tile disappears. Icy blue says winter at a glance.
    tint: "#89cff0",
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
