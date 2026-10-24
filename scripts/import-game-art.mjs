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

// Seasonal builds that have their own marketing pack: slug -> season id ->
// marketing folder. Season ids match app/lib/seasons.js and data/games.js.
// Edges where a pack's hero is CUT rather than drawn — Punch's arm, Crash's
// flame trail, the ibex's chest — that need fading out. Detection catches a
// subject that runs off its canvas; these are cut a few pixels inside it, where
// the numbers can't tell a cut from a flat edge that is meant to be there (the
// dice's bar), so they are named.
const FADE_EDGES = {
  "punch-game": ["left"],
  crash: ["bottom"],
  limbo: ["bottom"],
  "sunset-peak": ["bottom"],
};

// How far in from a cut edge the fade runs, as a share of the image. The
// default is long because Punch's arm and the crash trails are meant to trail
// away. The seasonal Punch heroes are cut on three sides (chains, sleeve, the
// bag's foot), and a long ramp on all three washed the whole subject out —
// they only need the cut line itself softened.
const FADE_RAMP = { "punch-christmas": 0.07, "punch-halloween": 0.07 };

// Whole subjects that touch their canvas because they're cropped tight, not
// because they're cut — the roulette wheels. Detection reads that as a bleed
// and fades every side; these keep the edges they were drawn with.
const WHOLE = new Set(["roulette", "american-roulette"]);

// Packs keyed off a green screen whose edges still carry green painted into
// the art itself (the ibex's fur tips). A key can't remove colour that belongs
// to the subject's pixels, so these get a green despill: green is held to the
// larger of red and blue wherever it exceeds both.
const DESPILL_GREEN = new Set(["sunset-peak"]);

// Packs whose "clear" background has the hero painted into it, so standing the
// cut-out in front of it shows the subject twice. These use the blurred
// background as their room instead.
const SCENE_FROM_BLUR = new Set(["punch-halloween"]);

const SEASONAL = {
  punch: { halloween: "punch-halloween", christmas: "punch-christmas" },
  chicken: { christmas: "chicken-christmas" },
  dragon: { christmas: "dragon-tower-christmas" },
  keno: { christmas: "keno-christmas" },
  "keno-party": { christmas: "multiplayer-keno-christmas" },
  plinko: { christmas: "plinko-christmas" },
};

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

// A key visual is either a cut-out (transparent around the subject) or a whole
// picture with its scene painted in — several seasonal packs only ship the
// latter. Cut-outs are cropped to the subject so they size consistently in any
// box; whole pictures are kept as they are and flagged `framed`, and the site
// shows them as a picture rather than standing them in a room.
async function prepareArt(src) {
  const { data, info } = await sharp(src).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width: W, height: H } = info;
  const corner = (x, y) => data[(y * W + x) * 4 + 3];
  const framed = corner(2, 2) > 200 && corner(W - 3, H - 3) > 200;
  if (framed) return { framed, crop: null };
  let x0 = W, y0 = H, x1 = -1, y1 = -1;
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      if (data[(y * W + x) * 4 + 3] > 24) {
        if (x < x0) x0 = x;
        if (x > x1) x1 = x;
        if (y < y0) y0 = y;
        if (y > y1) y1 = y;
      }
    }
  }
  // Edges the subject runs off: more than 3% of the outermost row/column is
  // solid. An arm cut by the canvas edge would otherwise end in a hard line.
  const solid = (x, y) => data[(y * W + x) * 4 + 3] > 200;
  const along = (n, f) => {
    let c = 0;
    for (let i = 0; i < n; i++) if (f(i)) c++;
    return c / n > 0.03;
  };
  const bleed = {
    left: along(H, (y) => solid(0, y)),
    right: along(H, (y) => solid(W - 1, y)),
    top: along(W, (x) => solid(x, 0)),
    bottom: along(W, (x) => solid(x, H - 1)),
  };
  const pad = 4;
  const left = Math.max(0, x0 - pad);
  const top = Math.max(0, y0 - pad);
  return {
    framed,
    bleed,
    crop: { left, top, width: Math.min(W, x1 + pad + 1) - left, height: Math.min(H, y1 + pad + 1) - top },
  };
}

// Fades a cut-out's alpha to nothing over the last stretch of every edge it
// runs off, so a cropped arm or tower trails away instead of stopping at a
// straight line wherever it is placed.
async function fadeBleed(pipeline, bleed, despill = false, ramp = 0.24) {
  const { data, info } = await pipeline.ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width: W, height: H } = info;
  const floor = ramp < 0.24 ? 24 : 60;
  const rampX = Math.max(floor, Math.round(W * ramp));
  const rampY = Math.max(floor, Math.round(H * ramp));
  const ease = (t) => t * t * (3 - 2 * t);
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      let k = 1;
      if (bleed.left && x < rampX) k *= ease(x / rampX);
      if (bleed.right && x >= W - rampX) k *= ease((W - 1 - x) / rampX);
      if (bleed.top && y < rampY) k *= ease(y / rampY);
      if (bleed.bottom && y >= H - rampY) k *= ease((H - 1 - y) / rampY);
      const i = (y * W + x) * 4;
      if (k < 1) data[i + 3] = Math.round(data[i + 3] * k);
      if (despill) {
        const cap = Math.max(data[i], data[i + 2]);
        if (data[i + 1] > cap) data[i + 1] = cap;
      }
    }
  }
  return sharp(data, { raw: { width: W, height: H, channels: 4 } });
}

// Writes one art set (art, wordmark, scene) into outDir and returns its facts.
async function importSet(dir, outDir, { hero = false } = {}) {
  const kg = path.join(SRC, dir, "key-graphics");
  const sources = {
    // A `_hero` cut-out wins wherever one exists: the seasonal packs' heroes
    // were isolated from their key visuals with Photoshop Select Subject
    // (tools/marketing-gen/ps-select-subject.mjs --file).
    art: path.join(kg, `${dir}_${hero || existsSync(path.join(kg, `${dir}_hero.png`)) ? "hero" : "key-visual"}.png`),
    wordmark: path.join(SRC, dir, "wordmarks", `${dir}_wordmark-h.png`),
    scene: path.join(SRC, dir, "backgrounds", `${dir}_bg-main-clear.png`),
    blur: path.join(SRC, dir, "backgrounds", `${dir}_bg-main-blur.png`),
  };
  mkdirSync(outDir, { recursive: true });
  const facts = {};
  for (const [kind, src] of Object.entries(sources)) {
    if (!existsSync(src)) {
      if (kind === "blur") continue;
      console.warn(`  MISSING  ${dir} ${kind} -> ${src}`);
      missing += 1;
      continue;
    }
    let img = sharp(src);
    const out = path.join(outDir, `${kind}.webp`);
    if (kind === "art") {
      const { framed, crop, bleed } = await prepareArt(src);
      facts.framed = framed;
      if (crop) img = img.extract(crop);
      img = img.resize(1100, 1100, { fit: "inside", withoutEnlargement: true });
      if (WHOLE.has(dir)) for (const edge of Object.keys(bleed ?? {})) bleed[edge] = false;
      for (const edge of FADE_EDGES[dir] ?? []) bleed[edge] = true;
      const despill = DESPILL_GREEN.has(dir);
      if (!framed && (despill || Object.values(bleed).some(Boolean))) img = await fadeBleed(img, bleed, despill, FADE_RAMP[dir]);
      await img.webp({ quality: 82 }).toFile(out);
    }
    if (kind === "wordmark") {
      const { crop, letter } = await measureWordmark(src);
      facts.letter = Math.round(letter * 1000) / 1000;
      await img.extract(crop).resize(900, 300, { fit: "inside", withoutEnlargement: true }).webp({ quality: 85 }).toFile(out);
    }
    if (kind === "scene" && !SCENE_FROM_BLUR.has(dir)) await img.resize(1920).webp({ quality: 72 }).toFile(out);
    if (kind === "blur" && SCENE_FROM_BLUR.has(dir)) {
      await img.resize(1920).webp({ quality: 72 }).toFile(path.join(outDir, "scene.webp"));
      continue;
    }
    // Only framed sets need the blurred room: the picture stands in front of it.
    if (kind === "blur" && facts.framed) {
      await img.resize(1600).webp({ quality: 62 }).toFile(out);
      facts.blur = true;
    }
  }
  return facts;
}

const facts = {};
let missing = 0;
for (const [slug, dir] of Object.entries(SLUGS)) {
  facts[slug] = { base: await importSet(dir, path.join(OUT, slug), { hero: HERO.has(slug) }), seasons: {} };
  for (const [season, sdir] of Object.entries(SEASONAL[slug] ?? {})) {
    facts[slug].seasons[season] = await importSet(sdir, path.join(OUT, slug, season));
  }
  console.log(`  ok       ${slug}${Object.keys(facts[slug].seasons).length ? ` (+ ${Object.keys(facts[slug].seasons).join(", ")})` : ""}`);
}

if (missing) {
  console.error(`${missing} source file(s) missing`);
  process.exit(1);
}

// data/gameArt.js — static imports plus each set's facts.
const id = (s) => s.replace(/[-/]([a-z])/g, (_, c) => c.toUpperCase());
const imports = [];
const entry = (key, dirPath, f) => {
  const name = (k) => `${id(key)}${k[0].toUpperCase()}${k.slice(1)}`;
  const kinds = ["art", "wordmark", "scene", ...(f.blur ? ["blur"] : [])];
  for (const k of kinds) imports.push(`import ${name(k)} from "@/public/assets/img/art/${dirPath}/${k}.webp";`);
  return `{ ${kinds.map((k) => `${k}: ${name(k)}`).join(", ")}, letter: ${f.letter}${f.framed ? ", framed: true" : ""} }`;
};
const body = Object.keys(SLUGS)
  .sort()
  .map((slug) => {
    const base = entry(slug, slug, facts[slug].base);
    const seasons = Object.entries(facts[slug].seasons);
    if (!seasons.length) return `  "${slug}": ${base},`;
    const s = seasons.map(([season, f]) => `${season}: ${entry(`${slug}-${season}`, `${slug}/${season}`, f)}`).join(",\n      ");
    return `  "${slug}": {\n    ...${base},\n    seasons: {\n      ${s},\n    },\n  },`;
  });
const lines = [
  "// GENERATED by scripts/import-game-art.mjs (`npm run gen:art`) — do not edit by hand.",
  "//",
  "// Presentation art per game: key visual, wordmark and clear play scene,",
  "// imported statically so next/image hashes and resizes them. `letter` is the",
  "// share of the wordmark's height its lettering takes up (<Wordmark> sizes by",
  "// it). `framed` marks a key visual that is a whole picture rather than a",
  "// cut-out; those sets also carry `blur`, the out-of-focus room it stands in.",
  "// `seasons` holds the seasonal builds' sets, keyed by season id.",
  ...imports,
  "",
  "export const gameArt = {",
  ...body,
  "};",
  "",
  "export const artFor = (slug) => gameArt[slug] ?? null;",
  "",
  "// A game's art in a season, or its standard art when it has no such build.",
  "export const seasonArtFor = (slug, season) =>",
  "  (season && gameArt[slug]?.seasons?.[season]) || gameArt[slug] || null;",
  "",
];
writeFileSync("data/gameArt.js", lines.join("\n"));
console.log("  wrote    data/gameArt.js");
