# Studio & catalogue deck — design

Date: 2026-09-21
Branch: `redesign/studio-depth`

## Why

We have no deck. What exists is `marketing/linkedin/` — a 10-page document post
built for a stranger scrolling a feed, in 4:5, ending on a trade-show CTA. It is
not a thing you present, and it is not aimed at the reader we now want.

That reader is an **aggregation network**: someone deciding whether to carry the
catalogue on a platform their own operators already run. They are not evaluating
a game. They are evaluating whether integrating us costs them anything, whether
the certification story survives their compliance review, and whether we will
still be shipping in six months.

SBC Summit is 29 Sep – 1 Oct 2026. This is eight days out.

## Format, and the trade-off we accepted

**Editable `.pptx`**, generated. Sales can retitle a slide or drop a prospect's
logo in before a call without running anything.

The cost is real and worth stating plainly: the existing LinkedIn pipeline is a
generator precisely so its figures cannot go stale, and an editable artifact
gives that up the first time somebody edits it by hand. A title ships roughly
every fortnight; Diamond Mine lands in October.

Two mitigations, both structural rather than hopeful:

1. **Figures are concentrated.** Counted values (catalogue size, categories,
   network count, roadmap) appear on four slides, not scattered across eleven.
   The refresh surface is small and listed explicitly in `marketing/deck/README.md`.
2. **Regenerating is cheap.** `npm run gen:deck` re-renders from `data/`. The
   expectation is that you regenerate and re-apply per-prospect edits, not that
   you maintain the deck by hand.

## Architecture

```
scripts/deck/
  index.mjs        entry point; npm run gen:deck
  content.mjs      every sentence and every claim, each with a `source`
  claims.mjs       the source guard — throws on an unsourced claim
  backgrounds.mjs  slide backgrounds as PNG, via sharp + scripts/social/brand.mjs
  slides.mjs       one function per slide, emitting pptxgenjs calls
  tiles.mjs        the 18-banner portfolio grid composite

marketing/deck/
  README.md        how to regenerate, what to re-check, the claims register
  assets/bet4win-studio-deck.pptx
```

**One new devDependency: `pptxgenjs`.** Nothing in the current tree can emit an
editable deck — `sharp` rasterises, and a raster is the thing we were asked not
to produce. It is dev-only and never enters the Next.js bundle.

**Backgrounds are images, text is native.** The brand's lattice, gradients and
radial glow are SVG effects that PowerPoint's shape model cannot express. Each
slide gets one full-bleed PNG rendered through the existing
`scripts/social/brand.mjs` (same hexes, same 45° lattice, same 8px pitch), with
every word laid on top as an editable text box. Edit the copy, keep the brand.

**Data comes through the existing loader.** `scripts/social/data.mjs` already
neutralises the `@/public` image imports in `data/games.js` so it can be read
outside Next. Reuse it rather than writing a second one — the LinkedIn README
calls out `scripts/generate-og-cards.mjs` keeping a hand-copied catalogue list
as the anti-pattern to avoid.

**Fonts.** Archivo Black, Space Grotesk and JetBrains Mono are all on Google
Fonts, so they survive a Google Slides import. `.pptx` references fonts by name
rather than embedding them, so an editor without them installed sees
substitutes. `README.md` says so.

## The claim guard

Every string in `content.mjs` that asserts something carries a source:

```js
claim("Credit-backed 99.99% uptime SLA", { source: "confirmed 2026-09-21" })
claim(`${LIVE} live titles`,             { source: "counted: data/games.js" })
claim("Live operators: 340",             { source: null })   // throws
```

A claim with `source: null` fails the render. This mirrors what the existing
scripts already do — `carousel.mjs` throws when the provably-fair steps would
collide with the call-out, and `stills.mjs` throws when copy runs into the date
panel, both on the principle that a silently-wrong asset is worse than a build
error. `data/proof.js` keeps licence number, test lab, operator count and market
count as deliberately empty slots for the same reason.

The guard does not verify a claim is *true*. It verifies somebody said where it
came from.

## Slides

Eleven. Slides 5 and 7 of the original sketch (One API, Cadence) and the closing
Lisbon CTA are dropped; the roadmap sits directly after the portfolio.

### 1 — Cover

> **We build the originals your network is already being asked for.**
> Certified RNG. One integration for the whole catalogue. A new original every month.
>
> `18 LIVE TITLES · 6 CATEGORIES · 6 NETWORKS`

Counted. Wordmark, eyebrow `PROVABLY-FAIR RGS`.

### 2 — Team

> **Built by people who have shipped this before.**
> Key people each bring 15+ years in iGaming, across operators and suppliers
> including Flutter, 888 and Microgaming.

Named at your explicit instruction. `content.mjs` exposes a per-person array
(role, years) so individual figures can replace the blanket "15+" without a
layout change; it renders the single line until that array is filled.

### 3 — Foundation

> **A certified RGS that has been in production, not in a pitch deck.**
> Low-latency, deployed across EU, US and Africa, behind a credit-backed 99.99%
> uptime SLA. The engine runs slots as well as originals.

Four tiles: `99.99%` credit-backed SLA · `Certified` RGS and RNG ·
`EU · US · AFRICA` · `Slot-capable` engine.

The slot line is deliberately about the *engine*, because that is what shipped.
Titles are on slide 6.

### 4 — Provably fair

> **Trust by maths, not by promise.**
> Every outcome is fixed before the bet and recomputable afterwards by anyone
> holding the seeds.

Commit → Play → Reveal → Verify, lifted from the live `/provably-fair` page.
Footer: `Run it yourself → bet4.win/provably-fair`. This is the only claim on
the deck a reader can check from their seat, which is why it gets a full slide.

### 5 — Portfolio

> **18 originals, 6 categories.**

Banner tiles for all eighteen, grouped by category (Crash 3 · Minefield 3 ·
Cards 3 · Instant 5 · Roulette 2 · Streak 2). Composited by `tiles.mjs` into one
image; a title added to `data/games.js` appears here on the next render.

### 6 — Roadmap

> **We publish the roadmap, then mark what shipped.**

| Chicken | Sep 2026 | **DELIVERED** |
| Diamond Mine | Oct 2026 | **NEXT** |
| Slots | engine live, titles in production | **IN BUILD** |

Rows one and two come from `data/roadmap.js`. The slots row does not exist there
and is a `content.mjs` addition — flagged, because the site's roadmap and the
deck's now disagree. Adding it to `data/roadmap.js` would fix that and publish
it; that is a separate call and not made here.

### 7 — Configuration

> **Your market, your return.**
> Certified payout packs ship with each engine and the operator picks which one
> runs. Bet ranges, currency and per-brand game availability are operator-set.

RTP pack chips 92–99. The roulette exception (97.3% on 37 pockets, 94.74% on 38)
as a footnote. No single headline RTP figure, because there isn't one.

### 8 — Branding

> **Games that look like they were built for your operators.**
> Swap the palette once and it lands across every title at once — colours,
> typefaces and background art, plus social-casino language and freeplay mode.

Palette chips from the live `/branding` switcher. Adds operator exclusives,
seasonal themes and multi-language.

### 9 — Promos and retention

Split, because half of this has shipped and half has not.

> **LIVE TODAY** — Tournaments, free bets, jackpots and leaderboards, through
> the same API as the games.
>
> **IN BUILD** — A gamification layer and buyable bonuses.

The upper band is asserted on the live site. The lower band is marked in-build
in the deck's own visual language (outlined, not filled), the same treatment the
roadmap uses for an unshipped title. Presenting an unshipped bonus engine as
live is the exact failure `.claude/skills/writing-news` exists to prevent.

### 10 — Business intelligence

> **Player data that tells you what to do next.**
> Player-level behaviour, retention cohorts and revenue, on top of the
> back-office reporting and reconciliation every integration already gets.

Deliberately modest. "Powerful BI surfacing actionable data" says nothing a
reader can act on, and the specifics behind it are still open — see Open
questions.

### 11 — Distribution

> **Live on six aggregation networks.**
> Upgaming · Relax Gaming · Revolver Gaming · Digitain · Alea · Betfounders
>
> `20,000 DAU` across all distribution, trailing 30 days.

All six confirmed live, our games on their platforms — direction confirmed
2026-09-21, because `.claude/skills/writing-news` treats the two directions as
different deals.

The deck closes here rather than on a CTA, at your instruction. For an
aggregator audience that works: the last thing on screen is who already carries
us.

## Blocked on assets

`public/assets/img/news/logos/` has three of the six marks. **Digitain, Alea and
Betfounders are missing.** `SOURCES.md` requires each partner's own published
reversed mark, fetched unmodified and recorded — tracing or recolouring produces
a mark they never approved, of their trademark, in a document we hand to their
competitors.

Slide 11 renders names-only until the three land, and `README.md` records the
gap. Fetching them needs a go-ahead.

## Verification

`npm run gen:deck` must be run and the output opened before the deck is called
done. Three automated checks run as part of it:

1. Every claim in `content.mjs` has a non-null `source`, or the render throws.
2. Every game in `data/games.js` with `status: "active"` appears on slide 5, or
   the render throws. A category quietly dropping off the portfolio is the worst
   version of this bug: the deck looks fine and is simply missing games.
3. Text measured against its box on every slide; overflow throws rather than
   clipping.

Manual: open the `.pptx`, and import once into Google Slides to confirm the
fonts resolve and the backgrounds are not re-compressed to mush.

## Open questions

- **BI specifics.** "Player data, retention, etc." is enough for slide 10 as
  written but not enough to make it good. Two or three concrete things it shows
  that the back-office reporting does not would change that slide from defensible
  to persuasive.
- **Per-person years.** The team array renders a blanket "15+ years" until real
  roles and figures are supplied.
- **The site says three networks, the deck says six.** Updating
  `scripts/social/stills.mjs:NETWORKS` and the live site is a separate task.
