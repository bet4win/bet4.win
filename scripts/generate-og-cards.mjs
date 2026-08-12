// Generates all Open Graph art (1200x630):
//   • app/opengraph-image.png (+ app/twitter-image.png copy) — the default site card
//   • public/og/<slug>.jpg                                    — per-game cards
// Referenced by the metadata in app/layout.jsx (default) and app/page.jsx
// generateMetadata() (per game, for /?game=<slug> unfurls).
//
// Run from the repo root (regenerates everything; clears public/og first):
//   npm run gen:og
//
// Keep GAMES in sync with the active (status: "active") entries in data/games.js.
// (data/games.js can't be imported here directly — it uses build-time image imports.)
import sharp from "sharp";
import { readFileSync, mkdirSync, rmSync, copyFileSync } from "node:fs";

const OUT = "public/og";
const BG = "#0b1120";
rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });

const GAMES = [
  { slug: "crash", file: "crash.jpg", title: "Crash", desc: "Cash out before the multiplier crashes." },
  { slug: "mines", file: "mines.jpg", title: "Mines", desc: "Uncover the gems, dodge the mines." },
  { slug: "plinko", file: "plinko.jpg", title: "Plinko", desc: "Drop the ball, chase the multiplier." },
  { slug: "dice", file: "dice.jpg", title: "Dice", desc: "Roll over or under to win." },
  { slug: "wheel", file: "wheel.jpg", title: "Wheel", desc: "Spin the wheel for your multiplier." },
  { slug: "diamonds", file: "diamonds.jpg", title: "Diamonds", desc: "Match the gems, take the payout." },
  { slug: "keno", file: "keno.jpg", title: "Keno", desc: "Pick your numbers, match the draw." },
  { slug: "limbo", file: "limbo.jpg", title: "Limbo", desc: "Set a target, beat the multiplier." },
  { slug: "dragon", file: "dragon2.jpg", title: "Dragon", desc: "Climb the tower, dodge the traps." },
  { slug: "punch", file: "punch.jpg", title: "Punch", desc: "Keep punching, cash out before the bag tears." },
];

const logo = readFileSync("public/assets/img/b4w-logo.svg", "utf8")
  // Dark wordmark shadow (reads as a drop-shadow on the dark card, not a white halo).
  .replaceAll("#222845", "#2a3157")
  .replaceAll("#4270ff", "#5b8cff");
const logoData = `data:image/svg+xml;base64,${Buffer.from(logo).toString("base64")}`;

const W = 1200, H = 630;
// Art is centered (not right-aligned) so the card is "square-safe": compact link
// previews (Teams, WhatsApp, X summary) center-crop the 1.91:1 image to a square,
// keeping only the middle ~630px — so all key content must live in that band.
const ART = 300, ARTX = Math.round((W - ART) / 2), ARTY = 96;
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");

async function card({ slug, file, title, desc }) {
  const artRaw = await sharp(`public/assets/img/icons/thumbnails3/${file}`)
    .resize(ART, ART, { fit: "cover" })
    .toBuffer();
  const mask = Buffer.from(
    `<svg width="${ART}" height="${ART}"><rect width="${ART}" height="${ART}" rx="28" ry="28" fill="#fff"/></svg>`,
  );
  const art = await sharp(artRaw).composite([{ input: mask, blend: "dest-in" }]).png().toBuffer();
  const logoW = 320, logoH = Math.round(logoW * (203 / 1038));
  const logoX = Math.round((W - logoW) / 2);
  const cx = W / 2;

  const bg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
    <defs>
      <radialGradient id="g1" cx="22%" cy="20%" r="60%"><stop offset="0%" stop-color="#22d3ee" stop-opacity="0.20"/><stop offset="100%" stop-color="#22d3ee" stop-opacity="0"/></radialGradient>
      <radialGradient id="g2" cx="78%" cy="82%" r="55%"><stop offset="0%" stop-color="#818cf8" stop-opacity="0.24"/><stop offset="100%" stop-color="#818cf8" stop-opacity="0"/></radialGradient>
    </defs>
    <rect width="${W}" height="${H}" fill="${BG}"/>
    <rect width="${W}" height="${H}" fill="url(#g1)"/>
    <rect width="${W}" height="${H}" fill="url(#g2)"/>
    <rect x="0" y="0" width="${W}" height="6" fill="#22d3ee"/>
    <text x="${cx}" y="62" text-anchor="middle" fill="#22d3ee" font-family="'Space Grotesk', Menlo, 'DejaVu Sans Mono', monospace" font-size="22" letter-spacing="5" font-weight="600">PROVABLY-FAIR ORIGINAL</text>
    <rect x="${ARTX - 2}" y="${ARTY - 2}" width="${ART + 4}" height="${ART + 4}" rx="28" fill="none" stroke="#243049" stroke-width="2"/>
    <text x="${cx}" y="462" text-anchor="middle" fill="#f1f5f9" font-family="'Space Grotesk', Helvetica, Arial, sans-serif" font-size="60" font-weight="700" letter-spacing="-1">${esc(title)}</text>
    <text x="${cx}" y="504" text-anchor="middle" fill="#cbd5e1" font-family="'Space Grotesk', Helvetica, Arial, sans-serif" font-size="26">${esc(desc)}</text>
    <image href="${logoData}" x="${logoX}" y="532" width="${logoW}" height="${logoH}"/>
  </svg>`;

  await sharp(Buffer.from(bg))
    .composite([{ input: art, left: ARTX, top: Math.round(ARTY) }])
    .jpeg({ quality: 86, mozjpeg: true })
    .toFile(`${OUT}/${slug}.jpg`);
  console.log("wrote", `${OUT}/${slug}.jpg`);
}

// Default site card (centered wordmark + tagline) — no game art.
async function mainCard() {
  const logoW = 600;
  const logoH = Math.round(logoW * (203 / 1038));
  const logoX = (W - logoW) / 2;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
    <defs>
      <radialGradient id="g1" cx="22%" cy="28%" r="55%"><stop offset="0%" stop-color="#22d3ee" stop-opacity="0.20"/><stop offset="100%" stop-color="#22d3ee" stop-opacity="0"/></radialGradient>
      <radialGradient id="g2" cx="78%" cy="76%" r="55%"><stop offset="0%" stop-color="#818cf8" stop-opacity="0.22"/><stop offset="100%" stop-color="#818cf8" stop-opacity="0"/></radialGradient>
    </defs>
    <rect width="${W}" height="${H}" fill="${BG}"/>
    <rect width="${W}" height="${H}" fill="url(#g1)"/>
    <rect width="${W}" height="${H}" fill="url(#g2)"/>
    <rect x="0" y="0" width="${W}" height="6" fill="#22d3ee"/>
    <text x="${W / 2}" y="168" text-anchor="middle" fill="#22d3ee" font-family="'Space Grotesk', Menlo, 'DejaVu Sans Mono', monospace" font-size="26" letter-spacing="6" font-weight="600">REMOTE GAMING SERVER · CERTIFIED RNG</text>
    <image href="${logoData}" x="${logoX}" y="232" width="${logoW}" height="${logoH}"/>
    <text x="${W / 2}" y="452" text-anchor="middle" fill="#cbd5e1" font-family="'Space Grotesk', Helvetica, Arial, sans-serif" font-size="40" font-weight="600">Provably-fair originals, built for operators.</text>
    <text x="${W / 2}" y="508" text-anchor="middle" fill="#94a3b8" font-family="'Space Grotesk', Helvetica, Arial, sans-serif" font-size="28">Bespoke design and branding · Single integration</text>
  </svg>`;
  await sharp(Buffer.from(svg)).png().toFile("app/opengraph-image.png");
  copyFileSync("app/opengraph-image.png", "app/twitter-image.png");
  console.log("wrote app/opengraph-image.png + app/twitter-image.png");
}

await mainCard();
for (const g of GAMES) await card(g);
