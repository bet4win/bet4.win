// Imports each game's presentation art from the marketing repo into
//   public/assets/img/art/<slug>/{art,wordmark,scene}.webp
//
//   art       the cut-out key visual (transparent), drawn over the scene
//   wordmark  the game's own logotype (transparent), used as its title
//   scene     the clear, in-focus play scene the game is set in
//
// These are what the homepage stage, the lobby cards and each game page are
// built from. The script also writes data/gameArt.js, which imports them
// statically so next/image hashes and resizes them like every other image on
// the site.
//
// WORDMARKS are cropped to their ink and measured. They arrive on canvases of
// every shape — PUNCH fills a 2:1 box, AMERICAN ROULETTE is a 10:1 strip, some
// sit in the middle of an empty 16:9 frame — so fitting them into one box gave
// letters of wildly different sizes. Each one's `letter` figure is the share of
// its cropped height that the lettering occupies (the rest is arcs, gems,
// swooshes); <Wordmark> sizes by letter height using it, so every title's
// letters come out about the same size wherever it is shown.
//
// Run from the repo root, with ../ui checked out beside this repo:
//   npm run gen:art
//
// Chicken, Dragon and the two roulette tables use the `hero` cut-out: their
// key visual has the scene painted into it. SLUGS maps our URL slug to the
// marketing folder, as in import-backdrops.mjs; roadmap titles are included so
// an announced game can be shown before it is live.
import sharp from "sharp";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
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

// Crops a wordmark to its ink and finds its lettering band. Rows and columns
// are counted by solid pixels (alpha > 128) so a faint glow spread across the
// canvas doesn't count as ink. The band is the run of rows at least a quarter
// as full as the fullest row; the crop keeps anything at least 2% as full,
// which holds on to the decoration above and below the letters.
async function measureWordmark(src) {
  const { data, info } = await sharp(src).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width: W, height: H } = info;
  const rows = new Array(H).fill(0);
  const cols = new Array(W).fill(0);
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      if (data[(y * W + x) * 4 + 3] > 128) {
        rows[y]++;
        cols[x]++;
      }
    }
  }
  const span = (counts, frac) => {
    const max = Math.max(...counts);
    let a = -1;
    let b = -1;
    counts.forEach((c, i) => {
      if (c > max * frac) {
        if (a < 0) a = i;
        b = i;
      }
    });
    return [a, b];
  };
  const [band0, band1] = span(rows, 0.25);
  const [top, bottom] = span(rows, 0.02);
  const [left, right] = span(cols, 0.02);
  const pad = 2;
  const crop = {
    left: Math.max(0, left - pad),
    top: Math.max(0, top - pad),
    width: Math.min(W, right + pad + 1) - Math.max(0, left - pad),
    height: Math.min(H, bottom + pad + 1) - Math.max(0, top - pad),
  };
  return { crop, letter: (band1 - band0 + 1) / crop.height };
}

const metrics = {};
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
    if (kind === "wordmark") {
      const { crop, letter } = await measureWordmark(src);
      metrics[slug] = Math.round(letter * 1000) / 1000;
      await img.extract(crop).resize(900, 300, { fit: "inside", withoutEnlargement: true }).webp({ quality: 85 }).toFile(out);
    }
    if (kind === "scene") await img.resize(1920).webp({ quality: 72 }).toFile(out);
  }
  console.log(`  ok       ${slug}`);
}

if (missing) {
  console.error(`${missing} source file(s) missing`);
  process.exit(1);
}

// data/gameArt.js — static imports plus each wordmark's letter share.
const id = (s) => s.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
const kinds = ["art", "wordmark", "scene"];
const slugs = Object.keys(SLUGS).sort();
const lines = [
  "// GENERATED by scripts/import-game-art.mjs (`npm run gen:art`) — do not edit by hand.",
  "//",
  "// Presentation art per game: cut-out key visual, wordmark and clear play",
  "// scene, imported statically so next/image hashes and resizes them. `letter`",
  "// is the share of the wordmark's height its lettering takes up; <Wordmark>",
  "// sizes by it so every title's letters match.",
  ...slugs.flatMap((s) =>
    kinds.map(
      (k) => `import ${id(s)}${k[0].toUpperCase()}${k.slice(1)} from "@/public/assets/img/art/${s}/${k}.webp";`,
    ),
  ),
  "",
  "export const gameArt = {",
  ...slugs.map(
    (s) =>
      `  "${s}": { art: ${id(s)}Art, wordmark: ${id(s)}Wordmark, scene: ${id(s)}Scene, letter: ${metrics[s]} },`,
  ),
  "};",
  "",
  "export const artFor = (slug) => gameArt[slug] ?? null;",
  "",
];
writeFileSync("data/gameArt.js", lines.join("\n"));
console.log("  wrote    data/gameArt.js");
