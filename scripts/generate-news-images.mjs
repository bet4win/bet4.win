// Featured images for the newsroom — 1200x630, one per post.
//
//   npm run gen:news-art            # every post
//   npm run gen:news-art -- <slug>  # just one
//
// Writes public/assets/img/news/<slug>.jpg. The same file is the card image on
// /news and the homepage strip AND the Open Graph image for the post, which is
// the whole reason it is 1200x630 — a news post is written to be shared, and a
// second crop to maintain is a second crop to forget.
//
// WHY THIS IS A COMPOSITOR, NOT A TYPESETTER
// The site's three faces (Archivo Black, Space Grotesk, JetBrains Mono) are
// loaded by next/font at build time and are not installed on most machines, so
// anything this script sets in them would render differently — or in Helvetica —
// depending on who ran it. So the marks are vector: the Bet4.win wordmark is the
// site's own SVG, the "x" is drawn as two strokes, and a partner's mark is their
// supplied file. The only real text is one line of mono, where every system's
// fallback (Menlo, DejaVu Sans Mono) is close enough to JetBrains Mono that the
// difference does not show at 22px.
//
// PARTNER LOGOS
// Drop the partner's own published file in public/assets/img/news/logos/<name>
// (.svg preferred) and name it in the post's `image.partnerLogo`. Fetch it from
// their site or press kit — never trace, recolour or approximate one, because
// the result is a trademark they never approved on the very asset announcing the
// partnership. It must be the reversed/white variant: the card is navy. Record
// where it came from in that folder's SOURCES.md. With no file the script sets
// their name as type, which is a usable card but not the one to ship.
//
// KEY ART
// A release card names its game in `image.art` and the script pulls
// public/assets/img/icons/thumbnails3/<art>.jpg — the same lobby tile the
// catalogue grid uses, so a game's card art lives in one place. A missing one
// throws rather than writing a card with a hole in it, because a share image is
// the one asset nobody reviews before it is out.
//
// CACHE KEY
// The output is <slug>.<8 hex>.jpg, where the hex is a hash of the JPEG's own
// bytes. A news card is referenced by three things that all cache hard — the
// browser, whatever CDN sits in front of the site, and every social scraper
// that has ever unfurled the URL — and under a stable filename none of them
// ever look again. Re-cut a card and the name changes, so there is nothing to
// purge and no ?v= to remember to bump.
//
// The app cannot derive that name from the slug, so this writes data/newsArt.js
// alongside the images and app/lib/news.js reads it. That file is generated:
// edit it and the next run overwrites you. Commit it with the JPEGs — a post
// whose entry is missing renders a deliberately broken picture rather than
// silently shipping without art.
import sharp from "sharp";
import { createHash } from "node:crypto";
import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  unlinkSync,
  writeFileSync,
} from "node:fs";
import { posts } from "../data/news.js";

const OUT = "public/assets/img/news";
const LOGO_DIR = `${OUT}/logos`;
const MANIFEST = "data/newsArt.js";

// Mirrors the tokens in app/globals.css. Hard-coded because this runs in node
// with no stylesheet — if the palette moves, it moves here too.
const C = {
  bg: "#060a16",
  line: "#2f4a93",
  brand: "#7e9bff",
  brandStrong: "#3358e6",
  brandDeep: "#2743b8",
  accent: "#3ae398",
  accentDeep: "#14c489",
  ink: "#f1f4fc",
  muted: "#a6b5da",
  faint: "#8f9fc8",
};

const W = 1200;
const H = 630;

// Compact link previews (Teams, WhatsApp, the X summary card) centre-crop a
// 1.91:1 image to a square and keep only the middle ~630px. Everything that
// carries meaning has to live inside that band, which is what sizes the lockup
// below — two marks and the cross fit in 600px, not in the full width.
const SAFE = 630;

const logoSvg = readFileSync("public/assets/img/b4w-logo.svg", "utf8");
const logoData = `data:image/svg+xml;base64,${Buffer.from(logoSvg).toString("base64")}`;
const LOGO_RATIO = 203 / 1038; // the wordmark's own aspect

const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// --- Background -------------------------------------------------------------
// Always the site's canvas — navy floor, a vignette, a hairline along the top —
// but the field underneath is DIFFERENT PER KIND, and that is load-bearing.
// /news is a two-column grid and the homepage strip is a pair of cards; if two
// kinds differ only in what sits in the middle, a page of them reads as one
// texture and the reader has to get down to the kicker to tell them apart.
//
// The first version of this varied only the line pattern — lattice, rings,
// rules — and it failed the test that matters, which is a card at 560px wide in
// peripheral vision. Line work at 0.3 opacity is not there at that size. HUE is
// what carries, so each kind now owns one:
//
//   integration  ROYAL BLUE, and no mint anywhere on it. Square lattice, two
//                washes pulled in from opposite corners: two fields meeting.
//   release      MINT, centred on the tile so the glow has a source, over a
//                deep blue floor. Rings coming off it. The only green card.
//   statement    NEAR-BLACK. Horizontal rules, a hard vignette, one narrow band
//                off the top edge. The quietest, because it is one line of type.
//
// The 4px top rule is coloured to match: blue joins, mint ships, grey states.
//
// Built from explicit elements rather than <pattern>/<mask> so it renders
// identically under librsvg and resvg.
const FILL = (id) => `<rect width="${W}" height="${H}" fill="url(#${id})"/>`;

function lattice() {
  const out = [];
  const s = `stroke="${C.line}" stroke-width="1" stroke-opacity="0.38"`;
  for (let x = 72; x < W; x += 72) {
    out.push(`<line x1="${x}" y1="0" x2="${x}" y2="${H}" ${s}/>`);
  }
  for (let y = 72; y < H; y += 72) {
    out.push(`<line x1="0" y1="${y}" x2="${W}" y2="${y}" ${s}/>`);
  }
  return out.join("");
}

// Centred on the art plate, so the innermost rings tuck behind it and the rest
// read as coming off it. Mint rather than line-blue: on this card the rings are
// part of what makes it the green one. Opacity falls with radius rather than
// being masked — a <radialGradient> in a stroke is the kind of thing the two
// renderers disagree about.
function rings(cx, cy) {
  const out = [];
  for (let r = 190; r <= 820; r += 52) {
    const o = Math.max(0.06, 0.46 - (r - 190) / 1900);
    out.push(
      `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${C.accent}" stroke-width="1.5" stroke-opacity="${o.toFixed(3)}"/>`,
    );
  }
  return out.join("");
}

function rules() {
  const out = [];
  for (let y = 70; y < H; y += 70) {
    out.push(
      `<line x1="0" y1="${y}" x2="${W}" y2="${y}" stroke="${C.line}" stroke-width="1" stroke-opacity="0.22"/>`,
    );
  }
  return out.join("");
}

const FIELDS = {
  integration: () => `${lattice()}${FILL("vignette")}${FILL("washA")}${FILL("washB")}`,
  // 274 is the centre of the 300px plate at y=124 in the release layout.
  release: () => `${rings(W / 2, 274)}${FILL("vignette")}${FILL("burst")}${FILL("mintFloor")}`,
  statement: () => `${rules()}${FILL("vignetteHard")}${FILL("crown")}`,
};

// Also the top rule's colour. Defined here rather than in DEFS because the
// gradients below are generated from it — one place to change a kind's hue.
const RULE_COLOUR = {
  integration: C.brand,
  release: C.accent,
  statement: C.faint,
};

function background(kind = "integration") {
  const known = RULE_COLOUR[kind] ? kind : "integration";
  return `
    <rect width="${W}" height="${H}" fill="${C.bg}"/>
    ${FIELDS[known]()}
    <rect x="0" y="0" width="${W}" height="4" fill="url(#rule-${known})"/>`;
}

// The top rule, one per kind, generated from RULE_COLOUR so a kind's hue lives
// in exactly one place. Three near-identical gradients written out by hand is
// three places to forget to change.
const ruleDefs = Object.entries(RULE_COLOUR)
  .map(
    ([kind, col]) => `<linearGradient id="rule-${kind}" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="${col}" stop-opacity="0"/>
      <stop offset="50%" stop-color="${col}" stop-opacity="0.9"/>
      <stop offset="100%" stop-color="${col}" stop-opacity="0"/>
    </linearGradient>`,
  )
  .join("");

// One <defs> shared by all three cards. An unused gradient costs nothing to
// ship; three near-identical DEFS blocks cost the next person the time it takes
// to work out that they are near-identical.
const DEFS = `
  <defs>
    <!-- Pulls the field back to nothing at the edges, so it reads as atmosphere
         behind the lockup rather than as graph paper. -->
    <radialGradient id="vignette" cx="50%" cy="46%" r="62%">
      <stop offset="45%" stop-color="${C.bg}" stop-opacity="0"/>
      <stop offset="100%" stop-color="${C.bg}" stop-opacity="1"/>
    </radialGradient>
    <!-- statement's closes in much harder: the card is one line of type and
         everything around it should fall away to nearly black. -->
    <radialGradient id="vignetteHard" cx="50%" cy="46%" r="52%">
      <stop offset="10%" stop-color="${C.bg}" stop-opacity="0"/>
      <stop offset="100%" stop-color="${C.bg}" stop-opacity="1"/>
    </radialGradient>

    <!-- INTEGRATION — royal blue, and deliberately no mint on the field. The
         only mint on the card is the cross between the two marks, which is the
         point of it. -->
    <radialGradient id="washA" cx="14%" cy="12%" r="66%">
      <stop offset="0%" stop-color="${C.brand}" stop-opacity="0.32"/>
      <stop offset="100%" stop-color="${C.brand}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="washB" cx="86%" cy="90%" r="64%">
      <stop offset="0%" stop-color="${C.brandStrong}" stop-opacity="0.50"/>
      <stop offset="100%" stop-color="${C.brandStrong}" stop-opacity="0"/>
    </radialGradient>

    <!-- RELEASE — light coming off the tile, centred on the plate rather than on
         the card so the glow has a source, over a deep blue floor. -->
    <radialGradient id="burst" cx="50%" cy="43.5%" r="54%">
      <stop offset="0%" stop-color="${C.accent}" stop-opacity="0.32"/>
      <stop offset="42%" stop-color="${C.accentDeep}" stop-opacity="0.15"/>
      <stop offset="100%" stop-color="${C.accent}" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="mintFloor" x1="0" y1="0" x2="0" y2="1">
      <stop offset="38%" stop-color="${C.brandDeep}" stop-opacity="0"/>
      <stop offset="100%" stop-color="${C.brandDeep}" stop-opacity="0.42"/>
    </linearGradient>

    <!-- STATEMENT — one narrow band off the top edge, and nothing else. -->
    <linearGradient id="crown" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${C.brandDeep}" stop-opacity="0.30"/>
      <stop offset="40%" stop-color="${C.brandDeep}" stop-opacity="0"/>
    </linearGradient>

    ${ruleDefs}
  </defs>`;

// Mono, letter-spaced, centred, upper case. One helper because every card uses
// exactly this treatment for its two lines of type and nothing else. Uppercased
// here rather than in the data so a kicker reads normally everywhere else on the
// site and only shouts on the card.
function mono(text, { y, size = 22, fill = C.faint, tracking = 5 }) {
  return `<text x="${W / 2}" y="${y}" text-anchor="middle" fill="${fill}"
    font-family="'JetBrains Mono', Menlo, 'DejaVu Sans Mono', monospace"
    font-size="${size}" font-weight="500" letter-spacing="${tracking}">${esc(
      String(text).toUpperCase(),
    )}</text>`;
}

// Rasterise a partner's name to a transparent PNG and trim to the ink.
//
// Measured, not estimated. The layout below centres a three-part lockup, so it
// needs the real width of each piece — and the width of a word depends on which
// font actually resolved, which this script cannot know in advance. Rendering
// then trimming sidesteps the question entirely: whatever the system drew, these
// are its true dimensions. One retry handles a name too long for its box.
async function typeMark(name, maxWidth, size = 44) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="200">
    <text x="${W / 2}" y="120" text-anchor="middle" fill="${C.ink}"
      font-family="'Space Grotesk', 'Helvetica Neue', Helvetica, Arial, sans-serif"
      font-size="${size}" font-weight="700" letter-spacing="-0.5">${esc(name)}</text>
  </svg>`;

  const { data, info } = await sharp(Buffer.from(svg))
    .trim({ background: { r: 0, g: 0, b: 0, alpha: 0 }, threshold: 0 })
    .png()
    .toBuffer({ resolveWithObject: true });

  if (info.width > maxWidth && size > 24) {
    return typeMark(name, maxWidth, Math.max(24, Math.floor((size * maxWidth) / info.width)));
  }
  return { data, width: info.width, height: info.height };
}

// The multiplication sign between the two marks. Drawn, not typed: at this size
// a font's own glyph varies enough in weight and x-height between systems to
// throw the lockup off centre.
function cross(cx, cy, r = 15) {
  const s = `stroke="${C.accent}" stroke-width="4" stroke-linecap="round"`;
  return `<line x1="${cx - r}" y1="${cy - r}" x2="${cx + r}" y2="${cy + r}" ${s}/>
          <line x1="${cx - r}" y1="${cy + r}" x2="${cx + r}" y2="${cy - r}" ${s}/>`;
}

function findPartnerLogo(name) {
  if (!name) return null;
  for (const ext of ["svg", "png", "jpg", "webp"]) {
    const p = `${LOGO_DIR}/${name.replace(/\.[^.]+$/, "")}.${ext}`;
    if (existsSync(p)) return p;
  }
  return null;
}

// --- Layouts ----------------------------------------------------------------

// [Bet4.win] x [partner]. The default for an integration announcement, and the
// one that earns its place: the whole story is which two names are now joined.
async function integration(post) {
  const { partner } = post;
  const cfg = post.image || {};
  const cy = 318;

  // The lockup is laid out as a real three-part row — left mark, cross, right
  // mark — measured and then centred as a whole. An earlier version gave each
  // side a fixed cell and centred within it, which put a short name like
  // "Upgaming" miles from the cross and pushed a long one like "Revolver
  // Gaming" into it. Two names are never the same width; the gaps have to be
  // the constant, not the cells.
  const GAP = 34;
  const CROSS_R = 15;
  const CROSS_W = CROSS_R * 2;

  const logoW = 220;
  const logoH = Math.round(logoW * LOGO_RATIO);
  // Whatever the square-safe band has left once our own mark and the two gaps
  // are taken out. A partner mark wider than this is scaled down, never
  // allowed to push the lockup outside the crop.
  const rightMax = SAFE - logoW - GAP * 2 - CROSS_W;

  const logoFile = findPartnerLogo(cfg.partnerLogo);
  let right;

  if (logoFile) {
    const isSvg = /\.svg$/i.test(logoFile);
    // An SVG declares its own tiny CSS size — Upgaming's header mark is 119x32 —
    // and sharp rasterises at that size unless told otherwise, which would put a
    // 119px-wide bitmap on a 1200px canvas. `density` rasterises it large first;
    // `inside` then scales it back down, so the mark is sharp at whatever size
    // the lockup needs.
    const source = isSvg ? sharp(logoFile, { density: 600 }) : sharp(logoFile);

    const { data, info } = await source
      .resize(rightMax, 92, {
        // `inside` preserves the partner's own proportions — their mark is
        // never stretched, only fitted.
        fit: "inside",
        // Raster marks are never enlarged. Revolver publish their horizontal
        // lockup at 193x55 and nothing bigger; blown up to fill the box it goes
        // visibly soft, and a blurry partner logo on an announcement about that
        // partner is worse than a small sharp one. Vectors have no such limit.
        withoutEnlargement: !isSvg,
      })
      .png()
      .toBuffer({ resolveWithObject: true });
    right = { data, width: info.width, height: info.height };
  } else {
    // No supplied asset: set the name instead. A lockup of a logo and a name is
    // still a lockup; a logo and a missing box is not.
    right = await typeMark(partner?.name || "", rightMax);
  }

  const total = logoW + GAP + CROSS_W + GAP + right.width;
  const startX = Math.round((W - total) / 2);
  const crossCx = startX + logoW + GAP + CROSS_R;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
    ${DEFS}
    ${background("integration")}
    ${mono(cfg.kicker || post.kicker || "Integration", { y: 96, size: 22, fill: C.accent, tracking: 7 })}
    <image href="${logoData}" x="${startX}" y="${cy - logoH / 2}" width="${logoW}" height="${logoH}"/>
    ${cross(crossCx, cy, CROSS_R)}
    <line x1="${(W - SAFE) / 2 + 60}" y1="466" x2="${(W + SAFE) / 2 - 60}" y2="466" stroke="${C.line}" stroke-width="1" stroke-opacity="0.8"/>
    ${mono(cfg.footline || "Provably-fair originals for operators", { y: 522, size: 21, fill: C.muted, tracking: 4 })}
  </svg>`;

  return {
    svg,
    note: logoFile ? `partner logo: ${logoFile}` : "partner name set as type — no logo file",
    composites: [
      {
        input: right.data,
        left: Math.round(startX + total - right.width),
        top: Math.round(cy - right.height / 2),
      },
    ],
  };
}

// Everything that is not two names meeting: a release, a certification, a
// milestone. The wordmark above one line of type — deliberately plain, because
// the line is the news and decoration around it would only compete.
async function statement(post) {
  const cfg = post.image || {};
  const logoW = 300;
  const logoH = Math.round(logoW * LOGO_RATIO);

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
    ${DEFS}
    ${background("statement")}
    ${mono(cfg.kicker || post.kicker || "News", { y: 96, size: 22, fill: C.accent, tracking: 7 })}
    <image href="${logoData}" x="${(W - logoW) / 2}" y="228" width="${logoW}" height="${logoH}"/>
    <text x="${W / 2}" y="392" text-anchor="middle" fill="${C.ink}"
      font-family="'Space Grotesk', 'Helvetica Neue', Helvetica, Arial, sans-serif"
      font-size="44" font-weight="700" letter-spacing="-0.5">${esc(cfg.line || "")}</text>
    <line x1="${(W - SAFE) / 2 + 60}" y1="470" x2="${(W + SAFE) / 2 - 60}" y2="470" stroke="${C.line}" stroke-width="1" stroke-opacity="0.8"/>
    ${mono(cfg.footline || "Provably-fair originals for operators", { y: 524, size: 21, fill: C.muted, tracking: 4 })}
  </svg>`;

  return { svg, composites: [] };
}

// A new original: the game's lobby tile in a plate, our mark underneath.
//
// The tile, not the wide banner in public/assets/img/banners. Two reasons. A
// 680x440 banner has to be narrowed enough to clear the kicker and the wordmark,
// which leaves the art small in both directions, where a square of the same
// height fills the card's centre. And every banner has the game's logotype baked
// into it — set against the headline directly below the card, that is the same
// name three times. The tile is the art alone.
async function release(post) {
  const cfg = post.image || {};
  const file = `public/assets/img/icons/thumbnails3/${cfg.art}.jpg`;
  if (!existsSync(file)) {
    throw new Error(`${post.slug}: no key art at ${file} — check image.art`);
  }

  // The lobby tile, at the same 300px the per-game OG cards use. Square rather
  // than the wide banner: a 1.55:1 plate has to be narrow enough to clear the
  // kicker and the wordmark, which leaves the art small in both directions,
  // where a square of the same height fills the card's centre.
  const ART = 300;
  const artX = Math.round((W - ART) / 2);
  const artY = 124;

  const mask = Buffer.from(
    `<svg width="${ART}" height="${ART}"><rect width="${ART}" height="${ART}" rx="28" ry="28" fill="#fff"/></svg>`,
  );
  const art = await sharp(file)
    .resize(ART, ART, { fit: "cover" })
    .composite([{ input: mask, blend: "dest-in" }])
    .png()
    .toBuffer();

  const logoW = 176;
  const logoH = Math.round(logoW * LOGO_RATIO);
  const ruleY = artY + ART + 42;

  // The border is drawn two pixels outside the art and rendered before it:
  // composites land on top of the SVG, so a stroke inside these bounds would
  // be painted over by the key art it is supposed to frame.
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
    ${DEFS}
    ${background("release")}
    ${mono(cfg.kicker || post.kicker || "Release", { y: 92, size: 22, fill: C.accent, tracking: 7 })}
    <rect x="${artX - 2}" y="${artY - 2}" width="${ART + 4}" height="${ART + 4}" rx="30"
      fill="none" stroke="${C.line}" stroke-width="2"/>
    <line x1="${(W - SAFE) / 2 + 60}" y1="${ruleY}" x2="${(W + SAFE) / 2 - 60}" y2="${ruleY}" stroke="${C.line}" stroke-width="1" stroke-opacity="0.8"/>
    <image href="${logoData}" x="${(W - logoW) / 2}" y="${ruleY + 28}" width="${logoW}" height="${logoH}"/>
  </svg>`;

  return {
    svg,
    note: `key art: ${file}`,
    composites: [{ input: art, left: artX, top: artY }],
  };
}

const LAYOUTS = { integration, statement, release };

// Every cut of a slug's card except the one just written. Matches the legacy
// unhashed name too, so the first run after this change clears the old files
// rather than leaving a second copy of every card on disk.
function sweep(slug, keep) {
  const stale = new RegExp(`^${slug.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(\\.[0-9a-f]{8})?\\.jpg$`);
  for (const f of readdirSync(OUT)) {
    if (f !== keep && stale.test(f)) unlinkSync(`${OUT}/${f}`);
  }
}

async function render(post) {
  const kind = post.image?.kind || (post.partner ? "integration" : "statement");
  const layout = LAYOUTS[kind];
  if (!layout) throw new Error(`${post.slug}: unknown image kind "${kind}"`);

  const { svg, composites, note } = await layout(post);

  const buf = await sharp(Buffer.from(svg))
    .composite(composites)
    // 88 rather than the catalogue's 86: this art is flat colour and hairlines,
    // where JPEG ringing round a 1px line is the first thing that shows.
    .jpeg({ quality: 88, mozjpeg: true })
    .toBuffer();

  // Hashed from the encoded bytes, so a card that did not actually change keeps
  // its name and stays cached. Only a card that looks different gets a new URL.
  const key = createHash("sha1").update(buf).digest("hex").slice(0, 8);
  const file = `${post.slug}.${key}.jpg`;

  writeFileSync(`${OUT}/${file}`, buf);
  sweep(post.slug, file);

  console.log(`wrote ${OUT}/${file}  (${kind}${note ? ` — ${note}` : ""})`);
  return file;
}

// Merged, not rebuilt: `gen:news-art -- <slug>` re-cuts one card and must not
// drop the other eighteen entries. A full run also prunes slugs that no longer
// exist in data/news.js.
async function writeManifest(entries, full) {
  let art = {};
  if (existsSync(MANIFEST)) {
    ({ newsArt: art } = await import(`../${MANIFEST}?t=${Date.now()}`));
    art = { ...art };
  }
  Object.assign(art, entries);
  if (full) {
    const live = new Set(posts.map((p) => p.slug));
    for (const slug of Object.keys(art)) if (!live.has(slug)) delete art[slug];
  }

  const rows = Object.keys(art)
    .sort()
    .map((slug) => `  ${JSON.stringify(slug)}: ${JSON.stringify(art[slug])},`)
    .join("\n");

  writeFileSync(
    MANIFEST,
    `// GENERATED by scripts/generate-news-images.mjs — do not edit by hand.\n` +
      `//\n` +
      `// slug -> the current cut of that post's featured image. The filename\n` +
      `// carries a hash of the file's own bytes, so re-cutting a card changes its\n` +
      `// URL and nothing downstream has to be purged. app/lib/news.js reads this;\n` +
      `// run \`npm run gen:news-art\` and commit the result with the JPEGs.\n` +
      `export const newsArt = {\n${rows}\n};\n`,
  );
  console.log(`wrote ${MANIFEST}  (${Object.keys(art).length} entries)`);
}

const only = process.argv[2];
const targets = only ? posts.filter((p) => p.slug === only) : posts;
if (only && !targets.length) {
  console.error(`No post with slug "${only}". Known: ${posts.map((p) => p.slug).join(", ")}`);
  process.exit(1);
}

mkdirSync(OUT, { recursive: true });
const written = {};
for (const post of targets) written[post.slug] = await render(post);
await writeManifest(written, !only);
