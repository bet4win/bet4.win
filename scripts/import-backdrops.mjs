// Imports each game's pre-blurred play scene from the marketing repo into
//   public/assets/img/backdrops/<slug>.jpg
// These are what the homepage / catalogue spotlight (<FeaturedGame />) paints
// behind its glass, so the card is lit by the game it is featuring.
//
// Run from the repo root, with ../ui checked out beside this repo:
//   npm run gen:backdrops
//
// The source (`marketing/<dir>/backgrounds/<dir>_bg-main-blur.png`) is a 1920x1080
// PNG that is already out of focus at source, which is why 1280x720 at q62
// lands around 12KB a file — the whole set is ~215KB. Do NOT re-blur here: the
// blur radius is an art-direction decision that lives in the marketing pack.
//
// SLUGS maps our URL slug to the marketing pack's folder name; the two differ
// wherever the game's marketing folder is named after the full title
// (punch -> punch-game, dragon -> dragon-tower). Keep it in sync with the
// active entries in data/games.js.
import sharp from "sharp";
import { existsSync, mkdirSync, statSync } from "node:fs";
import path from "node:path";

const SRC = "../ui/marketing";
const OUT = "public/assets/img/backdrops";

const SLUGS = {
  punch: "punch-game",
  crash: "crash",
  dragon: "dragon-tower",
  "video-poker": "video-poker",
  blackjack: "blackjack",
  baccarat: "baccarat",
  roulette: "roulette",
  "american-roulette": "american-roulette",
  coin: "coin",
  hilo: "hilo",
  mines: "mines",
  plinko: "plinko",
  dice: "dice",
  wheel: "wheel",
  diamonds: "diamonds",
  keno: "keno",
  limbo: "limbo",
  chicken: "chicken",
};

mkdirSync(OUT, { recursive: true });

let missing = 0;
for (const [slug, dir] of Object.entries(SLUGS)) {
  const src = path.join(SRC, dir, "backgrounds", `${dir}_bg-main-blur.png`);
  if (!existsSync(src)) {
    console.warn(`  MISSING  ${slug} -> ${src}`);
    missing += 1;
    continue;
  }
  const out = path.join(OUT, `${slug}.jpg`);
  await sharp(src)
    .resize(1280, 720, { fit: "cover" })
    .jpeg({ quality: 62, mozjpeg: true })
    .toFile(out);
  console.log(`  ${slug.padEnd(18)} ${(statSync(out).size / 1024).toFixed(0)}KB`);
}

if (missing) {
  console.error(`\n${missing} backdrop(s) had no source. Is ../ui checked out?`);
  process.exitCode = 1;
}
