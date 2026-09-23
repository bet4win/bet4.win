// Builds the email-signature images:
//
//   node scripts/signature/build.mjs
//
// - b4w-signature-banner.jpg — the studio banner under every signature.
// - b4w-signature-sbc.jpg — the temporary SBC Summit invitation.
// - icon-<network>.png — the social icons.
//
// The banners are OpenArt renders from marketing/signature/raw/, cropped to 3:1,
// with the type set on top in the real brand faces through headless Chrome
// (generated text comes out garbled, so the art is generated without any).
// Each is 1440x480 and shown at 480x160, so it is sharp at 3x.
import { execFile } from "node:child_process";
import { existsSync } from "node:fs";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { promisify } from "node:util";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { RiLinkedinFill, RiTelegram2Fill, RiTwitterXFill } from "@remixicon/react";
import sharp from "sharp";

const run = promisify(execFile);

const CHROME = [
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/Applications/Brave Browser.app/Contents/MacOS/Brave Browser",
].find((p) => existsSync(p));

const HOME = process.env.HOME;
const FONTS = {
  "Archivo Black": `${HOME}/Library/Fonts/ArchivoBlack-Regular.ttf`,
  "JetBrains Mono": `${HOME}/Library/Fonts/JetBrainsMono[wght].ttf`,
};

const LOGO = "public/assets/img/b4w-logo.svg";
const OUT_DIR = "public/assets/img/email";

const W = 1440;
const H = 480;

// Same accent as the business cards, so the signature and the card read as one
// set. The icon disc is the signature card's own navy, one step lighter.
const CYAN = "#22E8FF";
const DISC = "#1f2a5c";

const BANNERS = [
  {
    out: "b4w-signature-banner.jpg",
    art: "marketing/signature/raw/banner-b.png",
    // As high as the window can sit without clipping the dragon's crest.
    cropTop: 50,
    copy: async () => {
      // White face on the dark art, as on the cards. The navy extrusion stays;
      // on this background it reads as a shadow.
      const logo = (await readFile(LOGO, "utf8")).replaceAll("#4270ff", "#ffffff");
      return `<div class="logo">${logo}</div>
  <div class="row"><span class="pill">Game studio</span><span class="url">www.bet4.win</span></div>`;
    },
  },
  {
    out: "b4w-signature-sbc.jpg",
    art: "marketing/signature/raw/alternates/banner-a.png",
    cropTop: 0,
    copy: async () => `<div class="row"><span class="url">SBC Summit · 29 Sep – 1 Oct</span></div>
  <div class="head">Let's meet<br>in Lisbon.</div>
  <div class="row"><span class="pill">Book a meeting →</span></div>`,
  },
];

const ICONS = { linkedin: RiLinkedinFill, x: RiTwitterXFill, telegram: RiTelegram2Fill };
// Shown at 24px; drawn at 3x.
const ICON_PX = 72;

async function buildBanner(dir, b) {
  const meta = await sharp(b.art).metadata();
  const cropH = Math.round(meta.width / 3);
  const art = join(dir, `${b.out}.art.jpg`);
  await sharp(b.art)
    .extract({ left: 0, top: b.cropTop, width: meta.width, height: cropH })
    .resize(W, H)
    .jpeg({ quality: 95 })
    .toFile(art);

  const faces = Object.entries(FONTS)
    .map(([family, file]) => `@font-face{font-family:"${family}";src:url("file://${encodeURI(file)}");font-weight:100 900}`)
    .join("\n");

  const html = `<!doctype html><meta charset="utf-8"><style>
${faces}
* { margin:0; box-sizing:border-box }
html, body { width:${W}px; height:${H}px; overflow:hidden; background:#0b1230 }
.art { position:absolute; inset:0; background:url("file://${art}") center/cover }
/* Holds the left side dark enough for the type whatever the render put there. */
.wash { position:absolute; inset:0;
  background:linear-gradient(90deg, rgba(8,12,34,.92) 0%, rgba(8,12,34,.7) 32%, rgba(8,12,34,0) 55%) }
.copy { position:absolute; left:72px; top:0; bottom:0; display:flex; flex-direction:column; justify-content:center; gap:26px }
.logo svg { display:block; width:470px; height:auto; filter:drop-shadow(0 6px 18px rgba(0,0,0,.55)) }
.head { font-family:"Archivo Black"; font-size:78px; line-height:.98; letter-spacing:-.01em; color:#fff;
  text-shadow:0 6px 18px rgba(0,0,0,.55) }
.row { display:flex; align-items:center; gap:22px; font-family:"JetBrains Mono"; font-weight:700;
  text-transform:uppercase; font-size:26px; letter-spacing:.22em }
.pill { background:${CYAN}; color:#060a16; border-radius:999px; padding:10px 22px 10px 26px }
.url { color:${CYAN} }
</style>
<div class="art"></div><div class="wash"></div>
<div class="copy">
  ${await b.copy()}
</div>`;

  const src = join(dir, `${b.out}.html`);
  const shot = join(dir, `${b.out}.png`);
  await writeFile(src, html, "utf8");
  await run(CHROME, [
    "--headless=new",
    "--disable-gpu",
    "--no-sandbox",
    "--hide-scrollbars",
    "--allow-file-access-from-files",
    "--force-device-scale-factor=1",
    `--window-size=${W},${H}`,
    "--virtual-time-budget=8000",
    `--screenshot=${shot}`,
    `file://${src}`,
  ]);

  const out = join(OUT_DIR, b.out);
  const info = await sharp(shot).jpeg({ quality: 82, mozjpeg: true }).toFile(out);
  console.log(`${out} ${info.width}x${info.height} ${(info.size / 1024).toFixed(0)} KB`);
}

// PNG, not SVG: Gmail and Outlook do not render SVG images. The disc is baked
// in so the icon looks the same whatever surface a client puts behind it.
async function buildIcon(name, Icon) {
  const glyph = renderToStaticMarkup(createElement(Icon, { size: 24, color: "#ffffff" }))
    .replace(/<svg[^>]*>/, "")
    .replace("</svg>", "");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="${ICON_PX}" height="${ICON_PX}">
<circle cx="24" cy="24" r="24" fill="${DISC}"/>
<g transform="translate(12 12)" fill="#ffffff">${glyph}</g></svg>`;
  const out = join(OUT_DIR, `icon-${name}.png`);
  const info = await sharp(Buffer.from(svg), { density: 216 })
    .resize(ICON_PX, ICON_PX)
    .png({ compressionLevel: 9 })
    .toFile(out);
  console.log(`${out} ${info.width}x${info.height} ${(info.size / 1024).toFixed(1)} KB`);
}

async function main() {
  if (!CHROME) throw new Error("No Chrome found — the banners are rendered through it.");
  for (const f of [LOGO, ...BANNERS.map((b) => b.art), ...Object.values(FONTS)]) {
    if (!existsSync(f)) throw new Error(`Missing ${f}`);
  }

  const dir = await mkdtemp(join(tmpdir(), "b4w-sig-"));
  try {
    for (const b of BANNERS) await buildBanner(dir, b);
    for (const [name, Icon] of Object.entries(ICONS)) await buildIcon(name, Icon);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
