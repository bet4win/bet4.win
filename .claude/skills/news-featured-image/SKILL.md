---
name: news-featured-image
description: Use when a Bet4.win news post needs its featured image — generating one, adding a partner logo, adding a new card layout, or fixing a lockup that sits wrong. Wraps scripts/generate-news-images.mjs.
---

# Featured image for a news post

Every post has one. It is generated, never hand-made, and the same 1200×630 JPEG
is the card art on `/news`, the hero on the post page and the Open Graph image —
one file, so there is no second crop to forget.

```bash
npm run gen:news-art              # every post
npm run gen:news-art -- <slug>    # one post
```

Output: `public/assets/img/news/<slug>.<hash>.jpg`, **plus `data/newsArt.js`**.
Commit both, in the same commit — the image without the manifest entry is a
404, and the entry without the image is the same 404.

### The cache key

The hash is of the JPEG's own bytes. A card is cached hard by the browser, by
whatever CDN is in front of the site, and by every social scraper that has ever
unfurled the URL; under a stable filename none of them ever look again, which
is why re-cutting a card used to appear to do nothing. Now the name changes with
the bytes, so there is nothing to purge and no `?v=` to remember to bump.

Two consequences worth knowing:

- **A card that did not actually change keeps its name.** The hash is of the
  output, so re-running the script over untouched posts is a no-op on disk and
  the CDN keeps its copy. Only a card that genuinely looks different gets a new
  URL.
- **`data/newsArt.js` is generated.** Edit it and the next run overwrites you.
  A full run prunes slugs no longer in `data/news.js`; `-- <slug>` merges a
  single entry and leaves the rest alone. Old cuts of a slug are deleted as the
  new one is written, so the folder never accumulates.
- **Hashed cards are served `immutable, max-age=31536000`** by a rule in
  `next.config.mjs` that matches the hash, not the folder — so `logos/` in the
  same directory stays on the bounded 30-day rule. That rule sits *after*
  `/assets/:path*`: where two entries match a path, Next keeps the last
  `Cache-Control`, so ordering it "most specific first" silently loses.

`app/lib/news.js` → `featuredImage` reads the manifest. A slug with no entry
resolves to `<slug>.NOT-GENERATED.jpg`, which 404s on purpose: a visibly broken
picture is louder than a post quietly shipping without art, and the fix is one
command.

## Configuring a post

The `image` block in `data/news.js` drives it:

```js
image: {
  kind: "integration",          // or "statement" | "release"
  partnerLogo: "revolver-gaming",  // file in public/assets/img/news/logos/ — optional
  art: "punch",                    // release cards: the game's lobby tile
  alt: "Bet4.win and Revolver Gaming, side by side",
  // kicker:   overrides post.kicker on the card
  // footline: overrides "Provably-fair originals for operators"
  // line:     the one line a "statement" card carries
}
```

**`integration`** — `[Bet4.win] ✕ [partner]`. The default when a post has a
`partner`. This is the right card for an integration because the whole story is
which two names are now joined; anything else on it is decoration.

**`statement`** — the wordmark over one line of type. For a certification or a
milestone. Keep `line` under about six words; it is set at 44px and it is the
only thing on the card.

**`release`** — a new original. `art` names the game's lobby tile in
`public/assets/img/icons/thumbnails3/<art>.jpg`, composited at 300px with the
wordmark under it. The same file the catalogue grid uses, so a game's art lives
in one place; a missing one throws rather than writing a card with a hole in it.

Use the **tile, not the wide banner** in `public/assets/img/banners/`. A 680×440
banner has to be narrowed enough to clear the kicker and the wordmark, which
leaves it small in both directions where a square of the same height fills the
card's centre — and every banner has the game's logotype baked in, which against
the headline directly below the card is the same name three times. Nothing is
typeset on a release card for the same reason: the tile is the game, the wordmark
is us, and a title between them would only repeat the headline.

## One background per kind

Each kind owns a **hue**, and that is what tells them apart — not the line work.
`/news` is a two-column grid, so the test is a card at ~560px wide in peripheral
vision, and line work at 0.3 opacity is simply not there at that size. An earlier
version varied only the pattern (lattice / rings / rules) and was indistinguishable
in the grid; don't repeat it.

| kind | hue | field | top rule |
| --- | --- | --- | --- |
| `integration` | royal blue, **no mint on the field** | 72px square lattice, washes from opposite corners — two fields meeting | `--color-brand` |
| `release` | mint — the only green card | rings in mint off the tile, deep blue floor | `--color-accent` |
| `statement` | near-black | horizontal rules, hard vignette, one band off the top | `--color-faint` |

The shared parts — navy floor, vignette, the 4px top rule, the mono footline —
are what keep them one family. Vary hue and field; leave those alone.

A kind's colour lives in `RULE_COLOUR` at the top of the background section; the
rule gradients are generated from it, so changing a hue is one edit.

## Partner logos

An integration card carries the partner's **real mark**. The script looks for
`public/assets/img/news/logos/<partnerLogo>.{svg,png,jpg,webp}`; with no file it
sets their name as type instead, which is a usable card but not the one to ship.

**Fetch their own published asset — never draw one.** Their site, their press
kit, or the file they sent. Downloading the mark a company publishes in order to
say truthfully that you work with them is ordinary practice; tracing it,
recolouring it or generating an approximation is not, because the result is a
trademark they never approved and it will be subtly wrong on the one asset
announcing the partnership.

### Finding it

Start with the site and work down:

```bash
curl -sL https://partner.example -o /tmp/p.html
grep -oiE '(src|href)="[^"]*(logo|brand)[^"]*"' /tmp/p.html | sort -u
grep -oiE '"[^"]*\.(svg|png|webp)"' /tmp/p.html | sort -u
```

- **The header mark is often inline `<svg>`**, not a file — Upgaming's is. Pull
  the whole element out, `<clipPath>`/`<defs>` included, and save it verbatim.
  Look for one whose `width`/`height` is a header-ish ratio (theirs is 119×32).
- **Beware near-misses.** Upgaming's `/wp-content/uploads/logo.webp` is an
  awards badge, not their logo. Render anything you find before trusting the
  filename.
- Their site's own uploads folder will be full of **other people's** logos
  (their content partners, certification bodies). Check you have theirs.
- If only a dark-on-light version exists, ask them for the reversed one. Do not
  invert theirs — that is drawing a new mark.

### Checking it

Render onto navy **and** white before committing. The card is navy, so the mark
must be the reversed/white variant; if it looks right on white and vanishes on
navy, it is the wrong file.

- **Prefer SVG.** Vectors are rasterised at `density: 600` and scale to fit.
- **Rasters are never enlarged.** Revolver publish their horizontal lockup at
  193×55 and nothing bigger, so it renders at native size — small and sharp
  beats filling the box and going soft.
- Aspect is preserved (`fit: "inside"`); a mark is fitted, never stretched.
- **Look at the JPEG afterwards.** A logo with baked-in padding sits optically
  off-centre even when the arithmetic is right.

### Recording it

Add a row to `public/assets/img/news/logos/SOURCES.md` — file, exact URL, date,
and which variant it is. Logos get refreshed, and the next person should be able
to re-fetch rather than go hunting again.

**While you are there, check `partner.url` resolves.** `revolver-gaming.com`
was published in a post and does not exist; the real host is
`revolvergaming.com`. One `curl -o /dev/null -w '%{http_code}'` per post.

## Design constraints

Change these knowingly, not by accident.

- **The square-safe band.** Teams, WhatsApp and the X summary card centre-crop a
  1.91:1 image to a square and keep only the middle ~630px. The whole lockup is
  sized to fit that band. Widening it means the crop cuts a name in half.
- **The script is a compositor, not a typesetter.** Archivo Black, Space Grotesk
  and JetBrains Mono come from `next/font` at build time and are not installed on
  most machines — anything set in them renders differently depending on who ran
  the script. So: our mark is the site's own SVG, the ✕ is drawn as two strokes,
  a partner's mark is their file, and the only real text is mono, where the
  system fallback is close enough not to show. A partner's name set as type is
  measured by rendering and trimming it, never by guessing its width.
- **The palette is copied from `app/globals.css`** into `C` at the top of the
  script. If the site's tokens move, move them here too — a share card in an old
  palette is worse than no share card.
- **No dates burned into the image.** The post page carries the date; an image
  with a date in it is stale the moment the post is re-shared.

## Adding a layout

Write an `async function(post) → { svg, composites, note }` and register it in
`LAYOUTS`. Reuse `DEFS`, `mono()` and `typeMark()` so a new card sits in the same
world as the existing three. An unknown `kind` throws with the slug in the
message rather than writing a blank image.

A new kind needs **its own hue**, or it will be indistinguishable from whichever
existing kind it is closest to: add it to `RULE_COLOUR` and to `FIELDS`, then
call `background("<kind>")` from the layout. `background()` falls back to the
integration field for an unregistered kind, so a layout that forgets one of the
two silently inherits blue.

**Composites land on top of the SVG.** Anything meant to frame a composited
image — a border, a plate — has to be drawn outside its bounds, or the image
paints over it. That is why the release card's border rect sits two pixels
outside the art.

## Checklist

- [ ] `image` block added to the post.
- [ ] `npm run gen:news-art -- <slug>` run.
- [ ] The JPEG opened and looked at — lockup centred, nothing clipped, partner
      mark legible on navy.
- [ ] Partner mark is their real published asset, reversed variant, logged in
      `logos/SOURCES.md` — not typeset placeholder text.
- [ ] `partner.url` returns 200, not a redirect or a dead host.
- [ ] `alt` says what the picture shows, not what the headline says.
- [ ] The card is obviously its own kind next to the others — open `/news` and
      look at the grid, not at one JPEG on its own.
- [ ] JPEG **and `data/newsArt.js`** committed alongside the post.
- [ ] `curl -s localhost:3000/news/<slug> | grep og:image` resolves, and the URL
      carries a hash.

**If a card looks stale in the browser, it is not the script.** Check the hash
in `data/newsArt.js` against the file on disk; if they match, the page is
serving what was generated and it is the browser holding an old copy under a
name that no longer exists.
