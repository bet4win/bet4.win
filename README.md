# bet4.win

Marketing site for the Bet4.win remote gaming server — the game catalogue, the
provably-fair explainer, and the operator-facing pages.

Next.js App Router, Tailwind v4, no CMS. Everything renders from `data/`.

## Running it

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

Use the dev server while iterating. `next build` overwrites `.next`, which makes
a subsequent `next dev` recompile from cold and can surface phantom errors.

## Layout

```
app/              the site — routes, components, and client-side libs
  components/     every UI component (nothing lives outside this tree)
  lib/            cookies, analytics, fairness maths, pointer/motion helpers
  globals.css     the whole stylesheet: Tailwind v4 @theme tokens + b4w-* helpers
data/             the content — games, game copy, trade shows, proof figures,
                  the release roadmap and the news posts
public/assets/    game art (banners, thumbnails), logo, compliance marks
public/og/        generated per-game share cards
scripts/          build-time tooling
```

`data/games.js` is the catalogue. Adding a game means an entry there plus its art
in `public/assets/img/banners/`, `public/assets/img/icons/thumbnails3/` and
`public/assets/img/backdrops/`.

## Newsroom

A post is an object in `data/news.js` — nothing else. Add one and the index
(`/news`), the post page, the homepage strip, the sitemap and the JSON-LD all
pick it up; everything sorts on `date`, so order in the file doesn't matter.

`body` is a list of blocks (`p` / `h2` / `ul` / `pull`) rather than MDX or HTML.
`app/components/NewsBody.jsx` renders them, and an unrecognised `type` falls
through to a paragraph so copy can never silently vanish. Long-form typography
is the `b4w-prose` class the policy pages already use.

There are no bylines and no attributed quotes. Posts are authored by the
organisation, which is what the `NewsArticle` JSON-LD says; a quote goes in only
when a real person at the named company has approved it.

Every post has a featured image, generated from its `image` block:

```bash
npm run gen:news-art              # every post
npm run gen:news-art -- <slug>    # one post
```

It writes `public/assets/img/news/<slug>.jpg` at 1200×630 — one file serving as
the card art, the hero on the post page and the Open Graph image. Commit it. The
path is derived from the slug, so a post whose image was never generated shows a
broken picture rather than silently shipping without one.

For an integration the card is a `[Bet4.win] ✕ [partner]` lockup. Drop the
partner's own asset in `public/assets/img/news/logos/` and name it in
`image.partnerLogo`; with no file the script sets their name as type instead.
Use the mark the partner published — don't trace or scrape one.

Two skills in `.claude/skills/` carry the detail: **writing-news** (house style,
what may never be asserted, what to cut) and **news-featured-image** (the script,
partner logos, the square-safe crop).

## Roadmap

`data/roadmap.js` holds the titles that aren't released yet, and the homepage
renders them on a dated rail. It's kept out of `games.js` on purpose — a
catalogue entry needs art, a launch URL and published figures, and everything
that walks `games.js` (the grid, the sitemap, the share-card script) would need
a thumbnail that doesn't exist yet.

**The ship windows are the one unverifiable thing on the homepage.** Only
Chicken's matches something real (its `status` in `games.js`); the rest are
placed on the monthly cadence the site promises. Confirm them before launch —
edit `ships` (`YYYY-MM`) and nothing else changes.

## Design system

Everything visual is declared once in `app/globals.css` and used by name:

- **Colour.** Three roles, no free-for-all — `brand` (actions, links, focus, and
  the aurora behind the sections), `accent` (figures, eyebrows, the fairness
  layer), `live` (one badge). Surfaces are royal navy: `bg` and `panel` alternate
  down the page, `panel-high` is a card fill and never a section. The accent is
  a mint green — one weight, bright enough to carry small type on a card and to
  take dark text when it's a filled chip. There is no third status hue: Live is
  a neutral pill with a pulsing accent dot, and NEW is the only filled badge.
  Nothing here is violet or orange: that pair is Revolver's, and it stays theirs.
- **Controls.** One class family: `b4w-btn` plus a variant
  (`--primary` / `--accent` / `--ghost` / `--quiet` / `--glass`) and optionally a
  size (`--sm` / `--lg`) or `--icon`. Every button and button-shaped link on the
  site is a full pill built from these; nothing writes its own padding, radius or
  focus ring.
- **Icons.** Remix Icon, re-exported by name from `app/components/Icons.jsx`.
  Import from there rather than from `@remixicon/react`, so the choice of glyph
  for a concept lives in one file.
- **Motion.** Every animation is a `b4w-*` class and every one of them is
  switched off in the single `prefers-reduced-motion` block at the foot of
  `globals.css`. Add an animation, add it there.

## Booking

Every "Book a demo" / "Book a meeting" control opens the Calendly scheduler in
the site's own dialog, so nobody is sent to another domain to pick a slot.

- The link lives once, in `app/lib/site.js` (`BOOKING_URL` + `bookingUrl()`).
  UTMs are per-control, and the events strip adds the show's id as
  `utm_campaign` — Calendly records them against the booking, so a meeting
  arrives labelled with what produced it.
- The CTAs keep that Calendly URL in `href` and only `preventDefault()` when the
  dialog takes the click (`app/lib/booking.js`). With JS off, or the widget
  script blocked, they still work as plain links.
- `widget.js` is fetched on first open, never on page load. That is deliberate:
  Calendly sets its own cookies, and this site sets none before consent. Their
  GDPR banner is left switched on inside the frame for the same reason — hiding
  it would make our consent layer responsible for their cookies.
- Only `primary_color` is themed. `background_color` repaints Calendly's card
  but not the page behind it, which is a fixed white — so a navy card ended up
  in a white sheet in a navy dialog. The scheduler stays light and our chrome
  frames it.

## Backdrops

```bash
npm run gen:backdrops
```

Pulls each game's pre-blurred play scene out of the marketing repo (`../ui`
must be checked out beside this one) into `public/assets/img/backdrops/<slug>.jpg`.
That is what the spotlight card paints behind its glass.

## Share art

```bash
npm run gen:og
```

Regenerates `public/og/<slug>.jpg` and the default card at
`app/opengraph-image.png`. The script clears `public/og` first and writes only
the games listed in its own `GAMES` array — keep that array in sync with the
`status: "active"` entries in `data/games.js` or active games lose their card.

## Deployment

Vercel. The apex-to-www 308 is a redirect rule in `next.config.mjs`, applied at
Vercel's proxy layer. Canonical host is `https://www.bet4.win`.
