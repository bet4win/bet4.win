// Imports each game's presentation art from the marketing repo into
//   public/assets/img/art/<slug>/{art,wordmark,scene}.webp
//
//   art       the cut-out key visual (transparent), drawn over the scene
//   wordmark  the game's own logotype (transparent), used as its title
//   scene     the clear, in-focus play scene the game is set in
//
// These are what the homepage stage, the lobby cards and each game page are
// built from. data/gameArt.js imports them statically so next/image hashes and
// resizes them like every other image on the site.
//
// Run from the repo root, with ../ui checked out beside this repo:
//   npm run gen:art
//
// Chicken, Dragon and the two roulette tables use the `hero` cut-out: their
// key visual has the scene painted into it. SLUGS maps our URL slug to the
// marketing folder, as in import-backdrops.mjs; roadmap titles are included so
// an announced game can be shown before it is live.
import sharp from "sharp";
import { existsSync, mkdirSync } from "node:fs";
import path from "node:path";

const SRC = "../ui/marketing";
const OUT = "public/assets/img/art";

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
  "keno-party": "multiplayer-keno",
  "diamond-mine": "diamond-mine",
  "sunset-peak": "sunset-peak",
};

const HERO = new Set(["chicken", "dragon", "roulette", "american-roulette"]);

let missing = 0;
for (const [slug, dir] of Object.entries(SLUGS)) {
  const kg = path.join(SRC, dir, "key-graphics");
  const sources = {
    art: path.join(kg, `${dir}_${HERO.has(slug) ? "hero" : "key-visual"}.png`),
    wordmark: path.join(SRC, dir, "wordmarks", `${dir}_wordmark-h.png`),
    scene: path.join(SRC, dir, "backgrounds", `${dir}_bg-main-clear.png`),
  };
  const outDir = path.join(OUT, slug);
  mkdirSync(outDir, { recursive: true });

  for (const [kind, src] of Object.entries(sources)) {
    if (!existsSync(src)) {
      console.warn(`  MISSING  ${slug} ${kind} -> ${src}`);
      missing += 1;
      continue;
    }
    const img = sharp(src);
    const out = path.join(outDir, `${kind}.webp`);
    if (kind === "art") await img.resize(1100, 1100, { fit: "inside" }).webp({ quality: 82 }).toFile(out);
    if (kind === "wordmark") await img.resize(800, null, { fit: "inside" }).webp({ quality: 85 }).toFile(out);
    if (kind === "scene") await img.resize(1920).webp({ quality: 72 }).toFile(out);
  }
  console.log(`  ok       ${slug}`);
}

if (missing) {
  console.error(`${missing} source file(s) missing`);
  process.exit(1);
}
