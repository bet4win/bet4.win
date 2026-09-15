---
name: writing-news
description: Use when writing, editing or reviewing a Bet4.win news post — integration announcements, releases, certifications. Covers house style, what to cut, what may never be asserted, and the steps to publish.
---

# Writing a Bet4.win news post

A post is an object in `data/news.js`. There is no CMS, no draft state and no
preview build — what you write is what ships, so it has to be right before it is
committed.

## The one rule

**Everything here is something that shipped.** No announcements of
announcements, no "we are excited to be working towards", no roadmap items
dressed as news. If it has not happened, it belongs on the roadmap
(`data/roadmap.js`), not here.

## Before you write: what you may assert

This is a regulated industry and every post names a real company. Work from the
site itself, not from memory.

**Safe** — claims Bet4.win already makes elsewhere on this site:
certified RNG, per-round provable fairness, one integration for the whole
catalogue, a new original every month, full white-label branding, tournaments /
free bets / jackpots / leaderboards via the same API, the catalogue count
(counted from `data/games.js`, never typed in).

**Never, without someone putting their name to it:**

- **Quotes.** Do not write a sentence and attribute it to a person at a real
  company. Not as a placeholder, not "to be confirmed". A post with no quote is
  normal; a post with a fabricated one is a fabrication. Add real ones only with
  the partner's written approval.
- **Dates** you have not been given. Put a placeholder in and flag it at the top
  of the file the way the existing posts do.
- **Direction of an integration.** "Our games are on their platform" and "their
  games are on our RGS" are different deals. Ask. Do not infer it from the
  partner's category.
- **Status wording.** "Live" and "certified and scheduled" are materially
  different statements to make in public about a licensed partner.
- Lab names, licence numbers, certification dates, operator counts, GGR,
  retention benchmarks, market share. `data/proof.js` leaves these as empty,
  clearly-marked slots for a reason — do not fill them from a press release.
- Any comparison with a named competitor. Unverifiable competitor claims in
  iGaming are an advertising-standards exposure, not a taste question.

## Shape

```js
{
  slug:    "partner-name-integration",   // lowercase, hyphenated, permanent — it is the URL
  kicker:  "Integration",                // keep the set tiny: Integration | Release | Certification
  date:    "2026-09-08",                 // ISO. Sorting and the sitemap key off it
  title:   "Bet4.win originals are live on Revolver Gaming",
  dek:     "One sentence: what changed, for whom.",
  partner: { name: "Revolver Gaming", url: "https://…" },   // when there is one
  image:   { kind: "integration", partnerLogo: "revolver-gaming", alt: "…" },
  //       a release instead names the game's lobby tile:
  //       { kind: "release", art: "punch", alt: "…" }
  body:    [ /* blocks */ ],
}
```

Blocks: `{type:"p",text}` · `{type:"h2",text}` · `{type:"ul",items:[]}` ·
`{type:"pull",text}` (one highlighted line, set at display size — at most one
per post, and only if there is a sentence worth that much room).

## Register

**Title.** State what happened. Active voice, both parties named, no more than
about nine words. It is a headline, not a subject line.

- ✅ "Bet4.win originals are live on Revolver Gaming"
- ✅ "The Bet4.win catalogue arrives on Upgaming"
- ❌ "Bet4.win is pleased to announce a strategic partnership with…"
- ❌ "Expanding our reach: a new chapter for Bet4.win"

**Dek.** One sentence, ~20 words, saying what an operator can now do. Not a
summary of the title in different words.

**Body.** 250–400 words. Four moves:

1. **The fact.** First sentence, no preamble. Who can now do what.
2. **Why it matters.** The work the reader does *not* have to do. Be concrete —
   wallet mapping, session handling, round history, a certification pass — not
   "seamless" and "frictionless".
3. **What they get.** A short list, or two paragraphs. Capability, not adjective.
4. **Availability.** Where it applies and what the licensing caveat is.

Then stop. Do not add a closing paragraph about the future of the partnership.

## What to cut

Industry newsrooms — Pragmatic Play, Evolution, Relax Gaming, Play'n GO, Hacksaw,
and the trade press that reprints them — are worth reading for length and pacing
(most posts are 250–400 words, four or five paragraphs). They are also a catalogue
of everything to leave out. Cut all of this:

- **"About [Company]" boilerplate** at the foot. Anyone who wants it clicks the
  partner link in the byline.
- **Adjective stacking**: leading, innovative, cutting-edge, world-class,
  best-in-class, robust, seamless, exciting, dynamic. If the sentence needs an
  adjective to carry it, the sentence has no fact in it.
- **"Strategic", "synergy", "ecosystem", "vertical", "footprint"**, and any
  sentence containing the phrase "is delighted to".
- **The corporate handshake paragraph** — how long the talks took, how well the
  teams worked together, how the relationship will deepen.
- **Booth numbers, stand locations and event logistics.** The events strip above
  the header already carries shows; a post about a trade-show booth is an ad.
- **Internal detail**: sprint names, team sizes, which office did the work,
  internal tooling, ticket numbers.
- **Repeating the dek** as the first line of the body.
- **Numbers with no source.** If you cannot point at where a figure comes from,
  the sentence goes.

## Publishing

1. Add the object to `data/news.js`.
2. Add the `image` block, then `npm run gen:news-art -- <slug>`. Every post has
   a featured image — see the `news-featured-image` skill. Commit **the JPEG and
   `data/newsArt.js`**: the filename carries a content hash, and that generated
   manifest is how the app finds it. One without the other is a 404.
3. `npm run dev` and check `/news`, `/news/<slug>` and the homepage strip. Look
   at the index grid, not just the post — the card has to read as its own kind
   next to the others.
4. Confirm the `og:image` tag resolves:
   `curl -s localhost:3000/news/<slug> | grep og:image`
5. The sitemap picks the post up automatically. Nothing else to update.

A card that looks stale in the browser is almost never the script. Check the
hash in `data/newsArt.js` against the file on disk; if they match, you are
looking at a cached copy under a name that no longer exists.

## Checklist

- [ ] It already happened.
- [ ] Every capability claim appears somewhere else on this site.
- [ ] No quote from a person who has not approved it.
- [ ] Date, integration direction and status wording confirmed — or flagged as
      unconfirmed in a comment at the top of the file.
- [ ] Under 400 words.
- [ ] No "About us" block, no adjective stack, no closing puff.
- [ ] Featured image generated, and both the JPEG and `data/newsArt.js` committed.
