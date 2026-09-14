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
data/             the content — games, game copy, trade shows, proof figures
public/assets/    game art (banners, thumbnails), logo, compliance marks
public/og/        generated per-game share cards
scripts/          build-time tooling
```

`data/games.js` is the catalogue. Adding a game means an entry there plus its art
in `public/assets/img/banners/` and `public/assets/img/icons/thumbnails3/`.

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
