# Homepage studio depth — design

Date: 2026-09-14
Branch: `redesign/studio-depth` (off `redesign/dark-studio-stitch`)

## Why

A visual audit against two competitors in the same B2B iGaming space —
crocogames.com and galaxsys.co — found one structural difference that explains
most of the perceived quality gap.

Measured at 1440×900:

| | bet4.win | galaxsys.co | crocogames.com |
| --- | --- | --- | --- |
| Page height | 3,871px | 5,122px | 11,548px |
| Sections | 6 | ~9 | ~12 |
| Section backgrounds | all `transparent` | navy ↔ near-white | near-black ↔ deep purple |

Every `<section>` on our homepage computes to `rgba(0,0,0,0)` over a single
`#0b1120` body. The whole page is one flat field. Both competitors change the
surface under the reader roughly every 800px.

The mechanical cause: each section element *is* its own max-width container
(`<section className="mx-auto max-w-[1280px] px-5">`), so there is no
full-bleed element to paint a background onto.

Secondary gaps, in the order they cost us:

1. No proof content — no logos, certifications, or figures an operator can
   screen on. `Partners.jsx` exists and is imported at `app/page.jsx:8` but is
   never rendered.
2. Uniform card treatment — nothing is hero-scale or colour-coded.
3. No background depth layer — no grid, ghost type, or texture.
4. No non-straight edges anywhere.
5. Primary CTA fill (`--color-brand-strong` `#2563eb`) sits close in luminance
   to the `#0b1120` canvas, so CTAs recede.

Both competitors also run a trade-show announcement bar. We attend SBC Summit
and G2E and say so nowhere.

## Decisions taken

- **Stay dark.** Three dark surface levels rather than Galaxsys's light/dark
  alternation. Keeps the dark-studio identity and avoids giving every component
  a light variant.
- **Scope: homepage + shared chrome.** Interior pages inherit tokens, header,
  footer and the events bar but keep their layouts.
- **Events bar: rotating carousel** (CROCO's pattern), not a static pair.

## Design

### 1. `Section` primitive — `app/components/Section.jsx`

Splits the two roles the current sections conflate: a full-bleed `<section>`
that paints the surface, and an inner `max-w-[1280px] px-5 md:px-12` container
that holds content.

Props:

- `surface` — `base` (`--color-bg`) · `low` (`--color-panel-low`) ·
  `high` (`--color-panel-high`). All three tokens are already defined at
  `globals.css:36-38` and have never been used at section scale.
- `seamFrom` — the surface of the section above. Paints a shallow chevron of
  that colour over this section's top edge, so the boundary is a V rather than
  a straight line. Passing the previous colour explicitly keeps the seam
  correct for any pair of surfaces.
- `depth` — adds the grid + radial wash layer, and `b4w-contain-x` so the
  oversized glows cannot scroll the page sideways.
- `ghost` — optional watermark string rendered in `.b4w-display` outline at low
  opacity behind the section heading. `aria-hidden`.

### 2. Surface rhythm

| Section | Surface | Seam |
| --- | --- | --- |
| Hero | `base` + depth | — |
| Ticker | `raised` | — |
| TrustBar | `raised` | — |
| FeaturedGame | `base` | wedge from `raised` |
| GamesPreview | `raised` + ghost | — |
| **Proof** (new) | `high` + depth + ghost | wedge from `raised` |
| ExploreLinks | `base` | — |
| ClosingCta | `raised` + ghost | wedge from `base` |

The middle step is `--color-panel` (`#111c30`), **not** `--color-panel-low`. See
implementation note 1.

### 3. Events bar — `app/components/EventsBar.jsx`, `data/events.js`

One event at a time, prev/next controls, dot indicators, ~6s auto-advance.

- **Placement.** A static strip at the top of the document, mounted in
  `app/layout.jsx` (already `async` and already reading cookies, so this costs
  no new plumbing). `Header` changes from `fixed top-0` to `sticky top-0`: the
  bar scrolls away and the nav then sticks, which is CROCO's actual behaviour
  and avoids all fixed-offset arithmetic.
  - Risk: the template base sets `html, body { height: 100% }` and
    `body { display: flex; overflow-x: hidden }` (`globals.css:537-548`). The
    comment at `globals.css:156` already flags that this makes scroll-container
    behaviour fragile. Verify sticky in-browser; fall back to keeping `fixed`
    and offsetting `main` by a CSS variable if it misbehaves.
- **Auto-expiry.** Entries carry ISO `start`/`end`. Anything past `end` is
  filtered out; if nothing survives, the bar does not render. Without this the
  bar goes stale on 2026-10-02.
- **Motion.** Auto-advance pauses on pointer hover and on keyboard focus within
  the bar, and is disabled entirely under `prefers-reduced-motion` with manual
  controls left working. Matches the existing motion system at
  `globals.css:~294-390`.
- **Accessibility.** Labelled region; `aria-live="off"` so rotation is not
  announced on every tick; an `sr-only` list of every event so a screen reader
  gets the full message without waiting for rotation — the same approach
  `Ticker.jsx` already uses for the marquee.
- **Dismissal.** A cookie, mirroring `app/lib/consent.js` exactly (including the
  localhost `Secure` caveat), read server-side in `layout.jsx` and passed as
  `initialDismissed`. The cookie value encodes the event-id set, so adding a
  future event re-shows a previously dismissed bar.
- **No Swiper.** It is already in `package.json` but only as dead template
  weight; it is not in the live bundle. A two-slide rotator is ~40 lines.

Content, verified against the official sites on 2026-09-14:

| Event | Dates | Venue |
| --- | --- | --- |
| SBC Summit | 29 Sep – 1 Oct 2026 | Feira Internacional de Lisboa, Lisbon |
| G2E | 28 Sep – 1 Oct 2026 | The Venetian Expo, Las Vegas |

Open question left with the user: the two overlap on opposite continents.
Built listing both.

### 4. Proof — `app/components/Proof.jsx`, `data/proof.js`

On the `high` surface. Contains **only claims already made on the live site or
derived from our own data**:

- `Partners` logos (Relax Gaming, Revolver Gaming) — enabling the component
  already imported and never rendered.
- "Certified RGS and RNG" and "Uptime 99.99%", promoted out of the 64px
  `TrustBar` into display-scale figures.
- Catalogue size and peak multiplier, computed from `data/games.js`.

Lab names, licence numbers, operator counts and retention benchmarks are left
as empty, clearly-marked slots in `data/proof.js`. They are not invented.

This is also why CROCO's "Provider A" benchmark bars are deliberately not
copied: unverifiable competitor comparisons in regulated iGaming are an
advertising-standards exposure, not just a taste question.

### 5. Depth, seams, contrast

- `.b4w-grid` — fine grid via `repeating-linear-gradient`, radially masked so it
  fades out. Pairs with the `.b4w-drift` washes Hero already uses.
- `.b4w-seam` — the chevron described above, with a brand-tinted `drop-shadow`
  rim so the cut reads as lit rather than as a hole.
- `.b4w-ghost` — outlined display-face watermark.
- ~~Primary CTA fill moves `--color-brand-strong` → `--color-brand`.~~
  **Dropped during implementation.** Measured:

  | Fill | vs `#0b1120` page | White label on it |
  | --- | --- | --- |
  | `#2563eb` brand-strong (current) | 3.64:1 | **5.17:1** |
  | `#3b82f6` brand (proposed) | 5.12:1 | **3.68:1** |

  Brightening the fill buys button-vs-page prominence by spending
  label-vs-button contrast, and 3.68:1 fails WCAG AA for normal text — these
  buttons are 13–14px, so they do not qualify for the large-text 3:1 threshold.

  The version that would work is CROCO's actual move, a high-luminance fill with
  a dark label (`#22d3ee` on `--color-brand-ink` measures 10.42:1 against the
  page and 9.86:1 for the label). It is not taken because cyan is reserved for
  live status and the provably-fair layer by the palette roles at
  `globals.css:41-52`, and that role discipline is one of the few things this
  site already does better than either competitor. CTAs are left unchanged; the
  surface rhythm gives them more contrast against their backgrounds anyway.

### 6. Optional

Per-game accent on catalogue cards (hover glow and LIVE/NEW chip) instead of
every card being cyan. Adds an `accent` field to `data/games.js`. Droppable.

## Files

New: `Section.jsx`, `EventsBar.jsx`, `Proof.jsx`, `app/lib/eventsBar.js`,
`data/events.js`, `data/proof.js`

Modified: `globals.css`, `layout.jsx`, `Header.jsx`, `page.jsx`, `Hero.jsx`,
`FeaturedGame.jsx`, `GamesPreview.jsx`, `ExploreLinks.jsx`, `ClosingCta.jsx`,
`Partners.jsx`, optionally `GameCard.jsx` + `data/games.js`

## Verification

The repo has no test framework — dependencies are Next plus leftover template
libraries, and there is no jest/vitest/playwright config. Verification is
therefore:

1. `npm run build` passes.
2. Homepage checked at 1440×900 and 390×844 in Chrome DevTools.
3. Events bar driven by keyboard (tab to controls, arrow/enter), and re-checked
   under `prefers-reduced-motion: reduce`.
4. Sticky header confirmed against the fullscreen game modal and the
   `body.age-gate-locked` scroll lock.
5. Before/after screenshots.

Results reported as observed, including anything that fails.

## Implementation notes

Things the design got wrong, found by building it.

**1. `panel-low` is not a surface.** The first pass used `--color-panel-low`
for the middle step and the page looked exactly as flat as before — because it
was. Measured against `--color-bg`:

| Token | Value | Contrast vs `bg` |
| --- | --- | --- |
| `panel-low` | `#0a1222` | **1.007:1** |
| `panel` | `#111c30` | 1.105:1 |
| `panel-high` | `#18233a` | 1.202:1 |

`panel-low` is a card fill that happens to sit a hair under the page colour; at
1.007:1 it is invisible. The ladder is now `bg` → `panel` → `panel-high`.
Cards that previously used `panel-low` on a `base` section (the featured-game
panel, the explore cards) were lifted to `panel` for the same reason — they had
been relying entirely on their borders to be visible at all.

**2. `z-10` on the content container broke the game modal.** `Section` first
wrapped its children in `relative z-10`, which makes a stacking context. The
fullscreen game modal (`fixed`, `z-9999`) is nested inside `<GamesPreview>`, so
its z-index was resolved *within* that context and the sticky `z-50` header
painted straight over a modal that is supposed to cover the screen. Fixed by
removing every z-index from `Section` and ordering the layers by tree order
instead: grid wash → seam → ghost → content. This is the same trap the comment
in `Reveal.jsx` documents for `transform`.

**3. Reduced motion needed its own layout, not just a stopped timer.** With the
auto-advance disabled and no rotation, a reduced-motion reader would be stranded
on whichever show happened to be first. Under `prefers-reduced-motion` the strip
now drops the carousel entirely and lists every show at once — motionless and
strictly more informative. The carousel controls are not rendered in that mode.

**4. The strip did not fit a phone.** At 390px the name and dates needed ~174px
of the ~119px the flex row could spare, and the date ran underneath the carousel
dots. Name and dates now stack below `sm`; the chevrons and dots are desktop-only
(auto-rotation covers phones, and reduced motion never reaches that branch);
the CTA survives every breakpoint, shortened to "Meet us" below `sm`, because a
trade-show announcement nobody can act on is not worth the pixels.

**5. `#games` did not exist.** The `href="#games"` fallbacks in `Hero.jsx` and
`FeaturedGame.jsx` had no target anywhere on the site and silently scrolled
nowhere. The id now lives on the catalogue `Section`.

**6. Section 6 (per-game accent colours) was not built.** Deliberately left out
rather than guessed. Doing it honestly needs either a per-game colour decided by
someone who has seen all 17 pieces of key art, or a build-time dominant-colour
extraction step using `sharp` (already a devDependency). Inventing seventeen hex
values would have been the third option and is not one. `data/games.js` is
untouched; this is a clean follow-up.
