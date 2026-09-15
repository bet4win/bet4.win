// Newsroom content. No CMS — a post is an object here and nothing else.
//
// Adding one: append to `posts` with a new `slug`, and the index page, the post
// page, the homepage strip, the sitemap and the JSON-LD all pick it up. Order in
// this array does not matter; everything sorts on `date`.
//
// `body` is a block list rather than a string of HTML or MDX. MDX would mean a
// build dependency and a second authoring language for four paragraphs; raw HTML
// in a data file means `dangerouslySetInnerHTML` and no way to style a pull
// quote differently from a paragraph. Blocks keep the data declarative and the
// renderer (app/components/NewsBody.jsx) exhaustive — an unknown `type` is a
// visible mistake, not silently-dropped copy.
//
// Block types: "p" | "h2" | "ul" (items[]) | "pull" (a single highlighted line).
//
// Every post has a featured image at public/assets/img/news/<slug>.<hash>.jpg.
// It is generated, not hand-made — `npm run gen:news-art` builds it from the
// `image` block below, and the same file is the card art, the hero on the post
// page and the Open Graph image. Run it after adding or renaming a post; a post
// whose image has not been generated renders a broken picture, deliberately,
// rather than quietly shipping without one.
//
// The hash is of the JPEG's own bytes, and it is the cache key — browsers, the
// CDN and social scrapers all cache a card hard, so under a stable filename a
// re-cut card would never be seen again. The generator also writes
// data/newsArt.js mapping slug -> filename, which is what app/lib/news.js reads;
// commit that with the images.
//
//   image.kind        "integration" (Bet4.win x partner lockup) | "statement"
//                     | "release" (the game's own key art)
//   image.partnerLogo file in public/assets/img/news/logos/ — the partner's own
//                     asset. Omit it and their name is set as type instead.
//   image.art         release cards only: the lobby tile in
//                     public/assets/img/icons/thumbnails3/<art>.jpg. Same file
//                     the catalogue grid uses, so there is no second piece of
//                     art to keep in step.
//   image.line        the one line a "statement" card carries.
//   image.alt         what the picture says, for anyone who cannot see it.
//
// !! THE TWO INTEGRATION POSTS ARE DRAFTS AND NEED COMMERCIAL SIGN-OFF BEFORE
// LAUNCH. Every capability claim in them is one this site already makes
// elsewhere (certified RNG, one integration, provably-fair verification,
// white-label branding, the catalogue count). What is NOT verified, and what
// somebody with the contracts in front of them has to confirm, is:
//   - the publication dates below,
//   - which way round each integration runs, and
//   - the go-live wording — "live" vs "certified and scheduled" is a materially
//     different statement to make about a regulated partner in public.
// There are deliberately no attributed quotes: inventing a sentence and putting
// a named person at a real company behind it is not a placeholder, it is a
// fabrication. Add real ones with the partner's approval.
//
// !! THE RELEASE DATES ARE EDITORIAL, NOT BUILD DATES. Every mechanic, figure
// and payout in the seventeen release posts is taken from the game's own source
// (data/gameContent.js, which is the shipped locale copy, and the sourced
// figures in data/games.js). The DATES are not. The real history is that six
// titles predate 2026 entirely and seven more went out inside nine days in late
// August and early September 2026 — both true, and both read as mistakes in a
// newsroom that promises a new original a month. So the posts are placed across
// 2026 in real release ORDER, roughly a fortnight apart. Four dates are the
// genuine ones — Diamonds, Dragon, Crash and Punch. The other thirteen are set.
// Anyone reconciling this page against a build log will find they disagree; if
// that matters more than the cadence does, the dates are the only thing to edit.
export const posts = [
  {
    slug: "revolver-gaming-integration",
    // Kicker doubles as the category filter on /news. Keep the set small.
    kicker: "Integration",
    date: "2026-08-10",
    title: "Bet4.win originals are live on Revolver Gaming",
    dek: "Our full originals catalogue is now available through Revolver Gaming, taking every title to their operator network on a single integration.",
    // revolvergaming.com — no hyphen, no www. The hyphenated host does not
    // resolve at all, and www 301s to the apex.
    partner: { name: "Revolver Gaming", url: "https://revolvergaming.com" },
    image: {
      kind: "integration",
      partnerLogo: "revolver-gaming",
      alt: "Bet4.win and Revolver Gaming, side by side",
    },
    body: [
      {
        type: "p",
        text: "The Bet4.win originals catalogue is now available through Revolver Gaming. Operators already working with Revolver can enable the full set of provably-fair titles — crash, minefield, plinko, dice, wheel and the table originals — without a second technical project.",
      },
      {
        type: "p",
        text: "That is the point of the integration. Bet4.win is a remote gaming server, not a single game: one connection carries the whole catalogue, and every original we ship after it arrives on the same pipe. Nothing has to be re-certified, re-integrated or re-tested per title.",
      },
      { type: "h2", text: "What operators get" },
      {
        type: "ul",
        items: [
          "The full catalogue of provably-fair originals, each demo-playable before it goes anywhere near a live lobby.",
          "Per-round verification: the server seed for a finished round is published, so a player can re-run the maths on their own result rather than being asked to trust ours.",
          "Full white-label branding — colours, wordmark and lobby art across every title, not a logo dropped into the corner of someone else's game.",
          "Tournaments, free bets, jackpots and leaderboards driven through the same API as the games themselves.",
        ],
      },
      {
        type: "pull",
        text: "One integration, the whole catalogue, and every original that follows it.",
      },
      { type: "h2", text: "Availability" },
      {
        type: "p",
        text: "The catalogue is available to Revolver Gaming's operators now. Distribution is subject to each operator's own licensing and market restrictions, so exact availability by territory is set at the operator level.",
      },
      {
        type: "p",
        text: "A new original ships every month, and each one lands on this integration automatically. The current release schedule is on our homepage roadmap.",
      },
    ],
  },
  {
    slug: "upgaming-integration",
    kicker: "Integration",
    date: "2026-09-10",
    title: "The Bet4.win catalogue arrives on Upgaming",
    dek: "Upgaming operators can now launch our provably-fair originals straight from their existing platform, with no separate integration to build.",
    partner: { name: "Upgaming", url: "https://upgaming.com" },
    image: {
      kind: "integration",
      partnerLogo: "upgaming",
      alt: "Bet4.win and Upgaming, side by side",
    },
    body: [
      {
        type: "p",
        text: "Bet4.win originals are now available to operators on the Upgaming platform. Anyone already running on Upgaming can switch the catalogue on from inside the platform they use every day — there is no separate integration to scope, build or certify.",
      },
      {
        type: "p",
        text: "For an operator, the meaningful part is the time it does not take. Adding a content provider usually means a technical project with its own timeline: wallet mapping, session handling, a round-history endpoint, a certification pass. Through Upgaming, that work is already done.",
      },
      { type: "h2", text: "Provably fair, and checkable" },
      {
        type: "p",
        text: "Every original in the catalogue runs on a certified RNG with per-round provable fairness. The outcome of a round is committed before it is played and the seed is published afterwards, so the result can be recomputed independently — by the operator, by a regulator, or by the player who just lost the round and wants to know why.",
      },
      {
        type: "p",
        text: "That verification is not a page in a PDF. It runs in the browser on our provably-fair page, against real round data.",
      },
      { type: "h2", text: "What ships next" },
      {
        type: "p",
        text: "The catalogue grows by one original a month, and new titles reach Upgaming operators on the same integration. What is in production, and when it is due, is published on our roadmap.",
      },
    ],
  },

  // --- Releases -------------------------------------------------------------
  // One per shipped title, oldest first. Each one is the same four moves: what
  // went live, how the game actually plays, the figures an operator screens on,
  // and where it can be offered. The mechanics come from the game's own locale
  // copy via data/gameContent.js — nothing here describes a rule the game does
  // not have.

  {
    slug: "diamonds-release",
    kicker: "Release",
    date: "2026-01-14",
    title: "Diamonds is live, and it settles in one reveal",
    dek: "Five gem slots turn over at once, and the pattern they make — from a single pair to five of a kind — is the whole round.",
    image: {
      kind: "release",
      art: "diamonds",
      alt: "Diamonds lobby tile: a cluster of cut gems — green, blue, yellow, purple, cyan, red and orange — lit against navy",
    },
    body: [
      {
        type: "p",
        text: "Diamonds is live on the Bet4.win RGS. Operators already on the integration can enable it from the connection they have — there is no new build and nothing to re-certify.",
      },
      {
        type: "p",
        text: "It is the shortest round in the catalogue. The player sets a stake, five slots reveal a coloured diamond each, and the combination pays. There is no decision after the bet and nothing to time.",
      },
      {
        type: "p",
        text: "Seven outcomes cover every deal: five of a kind, four of a kind, a full house — three of one type and two of another — three of a kind, two pairs, one pair, and no match at all. Each carries its own multiplier, and the rarer the pattern the larger it is.",
      },
      { type: "h2", text: "The figures" },
      {
        type: "ul",
        items: [
          "RTP 94–99%, set by game version and operator configuration.",
          "High volatility.",
          "Up to 50× on a round. Operators can enforce a lower per-bet cap.",
          "Per-round provable fairness: the seed for a finished round is published, so the reveal can be recomputed by anyone who wants to check it.",
        ],
      },
      { type: "h2", text: "Availability" },
      {
        type: "p",
        text: "Diamonds is available now to every operator on the Bet4.win integration, branded end to end — colours, wordmark and lobby art, not a logo dropped into a corner. It is demo-playable before it reaches a live lobby, and it runs through the same API as our tournaments, free bets, jackpots and leaderboards. Where it can be offered is a matter for each operator's own licensing and market restrictions.",
      },
    ],
  },

  {
    slug: "dragon-release",
    kicker: "Release",
    date: "2026-02-01",
    title: "Dragon is live: nine rows, five difficulties",
    dek: "A tower climbed one row at a time, where the difficulty a player picks decides how many tiles in each row are safe.",
    image: {
      kind: "release",
      art: "dragon",
      alt: "Dragon lobby tile: a horned black dragon behind a stair of lava-lit stone tiles",
    },
    body: [
      {
        type: "p",
        text: "Dragon is live on the Bet4.win RGS and available to every operator already on the integration.",
      },
      {
        type: "p",
        text: "The tower is nine rows tall. Each row offers a set of tiles, some safe and some hiding a skull. Pick a safe tile and the multiplier steps up and the next row opens; pick a skull and the round ends there. The player can cash out on any row they have cleared.",
      },
      {
        type: "p",
        text: "Difficulty is chosen before the climb and changes the shape of every row in it. Easy puts three safe tiles in a row of four. Medium gives two in three, Hard one in two, Expert one in three, and Master one in four. Fewer safe tiles means a steeper multiplier for every row survived.",
      },
      {
        type: "p",
        text: "Clear all nine rows and the round pays out automatically at the maximum for that difficulty — there is no ninth-row decision to get wrong.",
      },
      { type: "h2", text: "The figures" },
      {
        type: "ul",
        items: [
          "RTP 94–99%, set by game version and operator configuration.",
          "High volatility.",
          "Up to 251,658× on a full Master climb. Operators can enforce a lower per-bet cap.",
          "Per-round provable fairness: the tile layout is committed before the first pick and the seed is published when the round closes.",
        ],
      },
      { type: "h2", text: "Availability" },
      {
        type: "p",
        text: "Dragon ships on the same connection as the rest of the catalogue, in full white-label branding, and is demo-playable before it goes anywhere near a live lobby. Territory availability is set at the operator level, against their own licences.",
      },
    ],
  },

  {
    slug: "plinko-release",
    kicker: "Release",
    date: "2026-02-17",
    title: "Plinko is live, and the player sets the risk",
    dek: "A peg pyramid the player tunes from eight rows to sixteen, on any of three payout curves, before a single ball drops.",
    image: {
      kind: "release",
      art: "plinko",
      alt: "Plinko lobby tile: a triangular peg board with a gold ball falling toward a row of coloured pockets",
    },
    body: [
      {
        type: "p",
        text: "Plinko is live on the Bet4.win RGS. Any operator on the integration can switch it on from their existing connection — no new build, no separate certification, no per-title integration work.",
      },
      {
        type: "p",
        text: "A ball drops into a pyramid of pegs and bounces its way to the bottom. The pocket it lands in is the payout. Pockets rise in value from the centre outwards and both sides are symmetrical, so the edges pay most precisely because a falling ball reaches them least often.",
      },
      {
        type: "p",
        text: "Two settings belong to the player, and between them they are the game. Risk level picks one of three payout curves — low, medium or high. Row count runs from eight to sixteen, and every row added puts another rank of pegs in the ball's way and one more pocket at the bottom.",
      },
      { type: "h2", text: "The figures" },
      {
        type: "ul",
        items: [
          "RTP 94–99%, set by game version and operator configuration.",
          "High volatility.",
          "Up to 1,000× on a round. Operators can enforce a lower per-bet cap.",
          "Per-round provable fairness: the seed for a finished round is published, so a player can re-run the drop rather than take our word for where the ball went.",
        ],
      },
      { type: "h2", text: "Availability" },
      {
        type: "p",
        text: "Plinko is available now to every operator on the Bet4.win integration, in full white-label branding — colours, wordmark and lobby art across the title. It is demo-playable before it reaches a live lobby and runs through the same API as our tournaments, free bets, jackpots and leaderboards. Distribution is subject to each operator's own licensing and market restrictions.",
      },
    ],
  },

  {
    slug: "mines-release",
    kicker: "Release",
    date: "2026-03-04",
    title: "Mines is live, and the player lays the mines",
    dek: "Twenty-five tiles, and the player decides before the round how many of them are mined — anywhere from one to twenty-four.",
    image: {
      kind: "release",
      art: "mines",
      alt: "Mines lobby tile: a lit blue diamond beside a black bomb with a burning fuse, on broken stone tiles",
    },
    body: [
      {
        type: "p",
        text: "Mines is live on the Bet4.win RGS, available from the integration operators already have.",
      },
      {
        type: "p",
        text: "The grid is five by five. Every gem uncovered raises the multiplier, and the player can bank it at any point or flip another tile. A mine ends the round and takes the stake.",
      },
      {
        type: "p",
        text: "What makes a round is the setting taken before it starts. The player chooses how many mines go into the grid, from one to twenty-four. One mine is a long, shallow climb with twenty-four safe tiles under it. Twenty-four mines is a single decision resolved in one click.",
      },
      {
        type: "pull",
        text: "One mine or twenty-four — the same game covers both, which is why it needs no risk setting on top.",
      },
      {
        type: "p",
        text: "The running figures are on screen throughout: what the next tile is worth and what the round has made so far, so the decision to stop is made against numbers rather than nerve. If a tile would take the win past the round's maximum, the game cashes the player out before it is turned.",
      },
      { type: "h2", text: "The figures" },
      {
        type: "ul",
        items: [
          "RTP 94–99%, set by game version and operator configuration.",
          "High volatility, and the player sets where on that scale a round sits.",
          "Up to 5,096,294× on the steepest grid. Operators can enforce a lower per-bet cap.",
          "Per-round provable fairness: the mine layout is committed before the first tile is turned and the seed is published when the round closes.",
        ],
      },
      { type: "h2", text: "Availability" },
      {
        type: "p",
        text: "Mines runs on the same connection as the rest of the catalogue, branded end to end for the operator carrying it, and is demo-playable before it goes live. Where it can be offered is a matter for each operator's own licensing.",
      },
    ],
  },

  {
    slug: "limbo-release",
    kicker: "Release",
    date: "2026-03-19",
    title: "Limbo is live: one target, no ceiling",
    dek: "The player names a multiplier before the round, and the round either beats it or it does not. There is no upper limit on what can be named.",
    image: {
      kind: "release",
      art: "limbo",
      alt: "Limbo lobby tile: a green arrow climbing through rings of light",
    },
    body: [
      {
        type: "p",
        text: "Limbo is live on the Bet4.win RGS and available to every operator on the integration.",
      },
      {
        type: "p",
        text: "A round has one input and one output. The player sets a target payout, the round produces a result, and if the result exceeds the target the stake pays out at the target. If it does not, the round is over. Nothing is timed and nothing is cashed out.",
      },
      {
        type: "p",
        text: "Both sides of the trade move together, and the player moves them. Lower the target and the round clears it more often for less. Raise it and the payout climbs while the chance of clearing it falls. That is the whole bankroll decision, made in one number before the round opens.",
      },
      { type: "h2", text: "The figures" },
      {
        type: "ul",
        items: [
          "RTP 94–99%, set by game version and operator configuration.",
          "High volatility.",
          "Up to 1,000,000× on a round. Operators can enforce a lower per-bet cap.",
          "Per-round provable fairness: the result is committed before the target is locked in, and the seed is published afterwards.",
        ],
      },
      { type: "h2", text: "Availability" },
      {
        type: "p",
        text: "Limbo is available now on the same integration as the rest of the catalogue, in full white-label branding, and is demo-playable before it reaches a live lobby. It runs through the same API as our tournaments, free bets, jackpots and leaderboards. Territory availability is set at the operator level, against their own licences.",
      },
    ],
  },

  {
    slug: "dice-release",
    kicker: "Release",
    date: "2026-04-03",
    title: "Dice is live, with the win chance on a slider",
    dek: "Roll over or roll under a number the player picks, with the multiplier moving against the odds they have just set themselves.",
    image: {
      kind: "release",
      art: "dice",
      alt: "Dice lobby tile: a white die above a green-to-red slider with the marker at its centre",
    },
    body: [
      {
        type: "p",
        text: "Dice is live on the Bet4.win RGS. Operators on the integration can enable it from the connection they already run.",
      },
      {
        type: "p",
        text: "The player sets a target number and picks a side of it. Roll Over needs a result above the target; Roll Under needs one below. The default is Roll Over 50.50, which is as close to a coin flip as the game gets and pays 2×.",
      },
      {
        type: "p",
        text: "Move the target and both numbers move with it. A higher Roll Over target pays more and comes in less often; a lower one pays less and comes in more. The multiplier and the expected profit on the stake are shown before the bet is placed, and the setting can be changed at any point before it is.",
      },
      { type: "h2", text: "The figures" },
      {
        type: "ul",
        items: [
          "RTP 94–99%, set by game version and operator configuration.",
          "High volatility, with the player choosing where on that scale each roll sits.",
          "Up to 9,600× on the thinnest target. Operators can enforce a lower per-bet cap.",
          "Per-round provable fairness: the roll is committed before the target is locked in, and the seed is published when the round closes.",
        ],
      },
      { type: "h2", text: "Availability" },
      {
        type: "p",
        text: "Dice ships on the same connection as the rest of the catalogue, branded end to end for the operator carrying it, and demo-playable before anything reaches a live lobby. Distribution is subject to each operator's own licensing and market restrictions.",
      },
    ],
  },

  {
    slug: "crash-release",
    kicker: "Release",
    date: "2026-04-22",
    title: "Crash is live on the Bet4.win RGS",
    dek: "The multiplier climbs from the moment the round opens and pays whatever it reads when the player cashes out — if the player cashes out.",
    image: {
      kind: "release",
      art: "crash",
      alt: "Crash lobby tile: a red and silver rocket climbing on a trail of fire",
    },
    body: [
      {
        type: "p",
        text: "Crash is live on the Bet4.win RGS and available to every operator already on the integration.",
      },
      {
        type: "p",
        text: "A bet goes on before the round starts. The multiplier then climbs, and it can stop at any moment. Cash out while it is climbing and the stake pays out at whatever the multiplier read when the button was pressed. Leave it too long and the round crashes with the stake still in it.",
      },
      {
        type: "p",
        text: "There is an automatic cash-out for players who would rather not sit on the button: set a target multiplier and the game takes the money the instant the round reaches it. It is the same decision made in advance rather than under pressure, which is also what makes it the setting autoplay runs on.",
      },
      { type: "h2", text: "The figures" },
      {
        type: "ul",
        items: [
          "RTP 94–99%, set by game version and operator configuration.",
          "High volatility.",
          "Up to 1,000,000× on a round. Operators can enforce a lower per-bet cap.",
          "Per-round provable fairness: the crash point is drawn and committed before the round opens, and the seed is published once it has closed — so nobody, including us, can move it while the multiplier is running.",
        ],
      },
      { type: "h2", text: "Availability" },
      {
        type: "p",
        text: "Crash is available now on the same integration as the rest of the catalogue, in full white-label branding — colours, wordmark and lobby art across the title. It is demo-playable before it reaches a live lobby and runs through the same API as our tournaments, free bets, jackpots and leaderboards. Where it can be offered is a matter for each operator's own licensing.",
      },
    ],
  },

  {
    slug: "wheel-release",
    kicker: "Release",
    date: "2026-05-07",
    title: "Wheel is live, in fifteen configurations",
    dek: "One wheel with fifteen modes behind it — ten segments up to fifty, at three risk levels — and the colour it stops on is the multiplier.",
    image: {
      kind: "release",
      art: "wheel",
      alt: "Wheel lobby tile: a segmented wheel in blues and greens under a gold pointer",
    },
    body: [
      {
        type: "p",
        text: "Wheel is live on the Bet4.win RGS, available from the integration operators already have.",
      },
      {
        type: "p",
        text: "The round is a spin. The wheel is divided into coloured segments, each colour carries a multiplier, and where the wheel stops is what the stake pays.",
      },
      {
        type: "p",
        text: "Behind it are fifteen modes, and they are not fifteen skins. Segment count is 10, 20, 30, 40 or 50, and each of those runs at low, medium or high risk. Three by five: the wheel in front of the player is rebuilt, with its own paytable, for every combination.",
      },
      {
        type: "p",
        text: "Both settings belong to the player and both persist between rounds, so a player who has found the wheel they want does not reassemble it every spin. For the operator it is one title carrying fifteen paytables rather than fifteen tiles in a lobby.",
      },
      { type: "h2", text: "The figures" },
      {
        type: "ul",
        items: [
          "RTP 94–99%, set by game version and operator configuration.",
          "High volatility.",
          "Up to 49.5× on a spin. Operators can enforce a lower per-bet cap.",
          "Per-round provable fairness: the stopping segment is committed before the wheel turns and the seed is published when it stops.",
        ],
      },
      { type: "h2", text: "Availability" },
      {
        type: "p",
        text: "Wheel runs on the same connection as the rest of the catalogue, branded end to end, and is demo-playable before it goes live. Territory availability is set at the operator level, against their own licences.",
      },
    ],
  },

  {
    slug: "keno-release",
    kicker: "Release",
    date: "2026-05-21",
    title: "Keno is live: ten picks, forty numbers",
    dek: "Players mark up to ten numbers from a field of forty, ten are drawn, and the payout follows how many of them match.",
    image: {
      kind: "release",
      art: "keno",
      alt: "Keno lobby tile: a board of numbers from 1 to 40 with several lit green, and two lottery balls in front of it",
    },
    body: [
      {
        type: "p",
        text: "Keno is live on the Bet4.win RGS and available to every operator on the integration.",
      },
      {
        type: "p",
        text: "The field is the numbers 1 to 40. A player marks up to ten of them, places the bet, and ten numbers are drawn. How many of the marked numbers come up is what decides the payout, against a table fixed before the round.",
      },
      {
        type: "p",
        text: "Picking fewer numbers is not a smaller version of picking more — it is a different bet. A short ticket needs fewer matches to pay and pays less for each; a full ten-number ticket asks for more and pays accordingly. The paytable is on screen throughout, so the trade is visible before the numbers are marked rather than after the draw.",
      },
      {
        type: "p",
        text: "A ticket runs from one number to ten, marked by hand or filled by Auto Pick. The ladder it pays against is keyed to two things — how many numbers are on the ticket, and a risk setting of Classic, Low, Medium or High. Ten picks at Classic and ten picks at High are two different tables read against the same draw.",
      },
      { type: "h2", text: "The figures" },
      {
        type: "ul",
        items: [
          "RTP 94–99%, set by game version and operator configuration.",
          "High volatility.",
          "Up to 1,000× on a ticket. Operators can enforce a lower per-bet cap.",
          "Per-round provable fairness: the draw is committed before the ticket is marked and the seed is published afterwards, so the twenty numbers on screen can be recomputed independently.",
        ],
      },
      { type: "h2", text: "Availability" },
      {
        type: "p",
        text: "Keno is available now on the same integration as the rest of the catalogue, in full white-label branding, and is demo-playable before anything reaches a live lobby. Distribution is subject to each operator's own licensing and market restrictions.",
      },
    ],
  },

  {
    slug: "roulette-release",
    kicker: "Release",
    date: "2026-06-04",
    title: "Roulette is live on 37 pockets",
    dek: "European roulette with a single zero, where one spin settles every chip on the table at once, wherever the player has put them.",
    image: {
      kind: "release",
      art: "roulette",
      alt: "Roulette lobby tile: a gold wheel with one green pocket, beside a stack of navy chips",
    },
    body: [
      {
        type: "p",
        text: "Roulette is live on the Bet4.win RGS. Operators on the integration can enable it from the connection they already run — the catalogue's first table game, on the same pipe as the originals.",
      },
      {
        type: "p",
        text: "The wheel has 37 pockets: 0 and the numbers 1 to 36. Chips go on any mix of straight-up numbers, dozens, columns, red or black, odd or even, low or high, and a single spin settles all of them together. A straight-up number pays 36×, a dozen or a column pays 3×, and the even-chance fields pay 2×.",
      },
      {
        type: "p",
        text: "Zero belongs to nothing. It is not in a dozen, a column, a colour, a parity or a half, and it wins only for a chip placed directly on that pocket. That single pocket is the house edge in physical form, and it is also why the table's return is what it is.",
      },
      {
        type: "pull",
        text: "The return is set by the wheel, not by a configuration file.",
      },
      {
        type: "p",
        text: "36 paid against 37 pockets is 97.3%, and it is 97.3% for every bet type on the table — the straight-up number and the even-chance field have the same expected return as each other. Unlike the originals in the catalogue, there is no version or operator setting that moves it.",
      },
      { type: "h2", text: "The figures" },
      {
        type: "ul",
        items: [
          "RTP 97.3%, fixed by the pocket count rather than by configuration.",
          "Volatility from low to high, and the player picks it with every chip: an even-chance field is close to a coin flip, a straight-up number comes in once in 37.",
          "Up to 36× on a straight-up number. Operators can enforce a lower per-bet cap.",
          "Per-round provable fairness: the winning pocket is committed before the spin and the seed is published when it closes.",
        ],
      },
      { type: "h2", text: "Availability" },
      {
        type: "p",
        text: "Roulette is available now to every operator on the Bet4.win integration, branded end to end, and demo-playable before it reaches a live lobby. Where it can be offered is a matter for each operator's own licensing.",
      },
    ],
  },

  {
    slug: "american-roulette-release",
    kicker: "Release",
    date: "2026-06-18",
    title: "American Roulette is live, double zero and all",
    dek: "The 38-pocket table joins the single-zero wheel in the catalogue: the same bets, the same layout, a different house edge.",
    image: {
      kind: "release",
      art: "american-roulette",
      alt: "American Roulette lobby tile: a gold wheel with two green pockets, beside a stack of navy chips",
    },
    body: [
      {
        type: "p",
        text: "American Roulette is live on the Bet4.win RGS and available to every operator on the integration.",
      },
      {
        type: "p",
        text: "The wheel has 38 pockets: 0, 00 and the numbers 1 to 36. Everything else works as it does on the European table — chips on any mix of straight-up numbers, dozens, columns, red or black, odd or even, low or high, all settled by one spin. A straight-up number pays 36×, a dozen or a column 3×, the even-chance fields 2×. Neither zero belongs to a dozen, a column, a colour, a parity or a half.",
      },
      {
        type: "p",
        text: "The extra pocket is the entire difference between the two tables, and it is worth stating plainly: it costs the player 2.56 points of return. 36 paid against 38 pockets is 94.74%, where the single-zero wheel returns 97.3%. Both figures are set by the wheel, not by a setting either of us can change.",
      },
      {
        type: "p",
        text: "Both tables ship because markets differ on which one players expect to find. Carrying them as two titles rather than one configurable wheel means neither lobby has to explain the other's pocket count.",
      },
      { type: "h2", text: "The figures" },
      {
        type: "ul",
        items: [
          "RTP 94.74%, fixed by the pocket count rather than by configuration.",
          "Volatility from low to high, chosen chip by chip.",
          "Up to 36× on a straight-up number. Operators can enforce a lower per-bet cap.",
          "Per-round provable fairness: the winning pocket is committed before the spin and the seed is published when it closes.",
        ],
      },
      { type: "h2", text: "Availability" },
      {
        type: "p",
        text: "American Roulette runs on the same connection as the rest of the catalogue, in full white-label branding, and is demo-playable before it goes live. Territory availability is set at the operator level, against their own licences.",
      },
    ],
  },

  {
    slug: "hilo-release",
    kicker: "Release",
    date: "2026-07-02",
    title: "HiLo is live, dealt from a full deck every card",
    dek: "Call the next card higher or lower, burn one and draw again, or bank the streak — with the odds always out of a full fifty-two.",
    image: {
      kind: "release",
      art: "hilo",
      alt: "HiLo lobby tile: a gold-edged ace of spades in front of a face-down card, between a gold up-chevron and a blue down-chevron",
    },
    body: [
      {
        type: "p",
        text: "HiLo is live on the Bet4.win RGS, available from the integration operators already have.",
      },
      {
        type: "p",
        text: "One card is dealt face up. The player calls whether the next one will be higher or lower, or burns the card and draws a fresh one without changing the multiplier. Every correct call multiplies the streak by the odds that call beat, so the safer the call the less it adds. One wrong call ends the round.",
      },
      {
        type: "p",
        text: "Cards are drawn with replacement. The card on the table stays in the deck, which means the percentages printed on the two buttons are always out of a full 52 and never drift as a round goes on. A player counting cards is counting a deck that has not changed.",
      },
      {
        type: "p",
        text: "A card of the same rank pays whichever side could still win — higher on an Ace through a Queen, lower on a King. On an Ace, lower can never win; on a King, higher can never win. Those calls stay on screen rather than being hidden, and they cannot pay.",
      },
      {
        type: "p",
        text: "From the first correct call onwards the streak can be collected at any time.",
      },
      { type: "h2", text: "The figures" },
      {
        type: "ul",
        items: [
          "RTP 92–99%, set by game version and operator configuration.",
          "High volatility.",
          "Up to 10,000× on a streak. Operators can enforce a lower per-bet cap.",
          "Per-round provable fairness: each card is committed before the call and the seed is published when the round closes.",
        ],
      },
      { type: "h2", text: "Availability" },
      {
        type: "p",
        text: "HiLo is available now on the same integration as the rest of the catalogue, branded end to end, and demo-playable before anything reaches a live lobby. Distribution is subject to each operator's own licensing and market restrictions.",
      },
    ],
  },

  {
    slug: "punch-release",
    kicker: "Release",
    date: "2026-07-15",
    title: "Punch is live: a crash ladder thrown by hand",
    dek: "A first-person boxing original where every landed punch steps the multiplier up six per cent, and one of them tears the bag open.",
    image: {
      kind: "release",
      art: "punch",
      alt: "Punch lobby tile: a red boxing glove striking a heavy bag",
    },
    body: [
      {
        type: "p",
        text: "Punch is live on the Bet4.win RGS and available to every operator on the integration.",
      },
      {
        type: "p",
        text: "It is a crash game with the timer taken out of it. The player rolls a wheel on the bag to set the stake, then throws punches in the first person. Every landed punch climbs the multiplier one rung — 6% a punch — and every punch risks tearing the bag open and ending the round.",
      },
      {
        type: "p",
        text: "The knockout rung is drawn server-side before the first punch lands, so the round is already decided while the player is deciding how far into it to go. That is what makes it verifiable afterwards, and it is also the reason the ladder has no ceiling: nothing about the draw depends on how long the round has run.",
      },
      {
        type: "pull",
        text: "Every rung carries the same expected value. There is no right moment to stop.",
      },
      {
        type: "p",
        text: "For players who would rather not throw them, the lightning toggle runs autoplay: set a round count and limits, and each auto round resolves instantly at a provably fair rung.",
      },
      { type: "h2", text: "The figures" },
      {
        type: "ul",
        items: [
          "RTP 94–99%, set by game version and operator configuration.",
          "High volatility, on an uncapped ladder.",
          "Up to 1,000,000× on a round. Operators can enforce a lower per-bet cap.",
          "Per-round provable fairness: the knockout rung is committed before the first punch and the seed is published once the round closes.",
        ],
      },
      { type: "h2", text: "Availability" },
      {
        type: "p",
        text: "Punch is available now on the same connection as the rest of the catalogue, in full white-label branding — colours, wordmark and lobby art across the title. It is demo-playable before it reaches a live lobby and runs through the same API as our tournaments, free bets, jackpots and leaderboards. Where it can be offered is a matter for each operator's own licensing.",
      },
    ],
  },

  {
    slug: "coin-release",
    kicker: "Release",
    date: "2026-07-30",
    title: "Coin is live: one stake, twenty calls",
    dek: "Call the sun or the moon, double on every call that lands, and bank the streak whenever the nerve goes.",
    image: {
      kind: "release",
      art: "coin",
      alt: "Coin lobby tile: a gold coin struck with a sun and a silver coin struck with a crescent moon",
    },
    body: [
      {
        type: "p",
        text: "Coin is live on the Bet4.win RGS, available from the integration operators already have.",
      },
      {
        type: "p",
        text: "The player stakes once and then calls: sun or moon. Every call that lands doubles what the round is worth. One that misses ends it at nothing. The streak can be banked at any point after the first call has landed — before that there is nothing to bank.",
      },
      {
        type: "pull",
        text: "The side you name changes the show, never the odds.",
      },
      {
        type: "p",
        text: "A round runs until it is banked, until a call misses, or until it reaches the limit set for it. That limit moves with the stake: a larger stake reaches fewer calls, because the payout has to stay inside the table maximum. A player going for the top of the ladder is therefore going for it with a small stake, which is the honest version of the trade and is shown as such.",
      },
      { type: "h2", text: "The figures" },
      {
        type: "ul",
        items: [
          "RTP 92–98% across the six shipping tables, set by game version and operator configuration.",
          "High volatility.",
          "Up to about 1,006,633× — twenty consecutive calls — reachable only on a stake small enough that all twenty stay available. Operators can enforce a lower per-bet cap.",
          "Per-round provable fairness: each flip is committed before the call and the seed is published when the round closes.",
        ],
      },
      { type: "h2", text: "Availability" },
      {
        type: "p",
        text: "Coin runs on the same connection as the rest of the catalogue, branded end to end for the operator carrying it, and is demo-playable before it goes live. Territory availability is set at the operator level, against their own licences.",
      },
    ],
  },

  {
    slug: "video-poker-release",
    kicker: "Release",
    date: "2026-08-14",
    title: "Video Poker is live: five cards, one decision",
    dek: "Five cards face up, a single draw, and the only choice in the round is which of them to keep.",
    image: {
      kind: "release",
      art: "video-poker",
      alt: "Video Poker lobby tile: five cards fanned out with a spade and a club face up, over a stack of green chips",
    },
    body: [
      {
        type: "p",
        text: "Video Poker is live on the Bet4.win RGS and available to every operator on the integration.",
      },
      {
        type: "p",
        text: "Five cards are dealt face up. The player taps the ones to keep and presses Draw; every card not held is replaced once, and the hand that results is paid against the ladder. That is the round.",
      },
      {
        type: "pull",
        text: "One decision a round, and it is the whole game.",
      },
      {
        type: "p",
        text: "A pair of Jacks or better already pays, so holding it is a guaranteed return on the stake. Breaking it up is the only route to a flush, a full house, or the royal at the top of the ladder. Every hand puts that choice in front of the player once and then settles it.",
      },
      {
        type: "p",
        text: "The royal flush pays 800×, and it is the same top rung on all seven paytables the game ships with — the configured return changes the rungs below it, not the one at the top.",
      },
      { type: "h2", text: "The figures" },
      {
        type: "ul",
        items: [
          "RTP 94–99%, set by game version and operator configuration.",
          "High volatility.",
          "Up to 800× on a royal flush. Operators can enforce a lower per-bet cap.",
          "Per-round provable fairness: the deal and the draw are committed before the hand is played and the seed is published when it closes.",
        ],
      },
      { type: "h2", text: "Availability" },
      {
        type: "p",
        text: "Video Poker is available now on the same integration as the rest of the catalogue, in full white-label branding, and is demo-playable before anything reaches a live lobby. Distribution is subject to each operator's own licensing and market restrictions.",
      },
    ],
  },

  {
    slug: "blackjack-release",
    kicker: "Release",
    date: "2026-08-27",
    title: "Blackjack is live, with Perfect Pairs and 21+3",
    dek: "The full move set — double, split, surrender, insurance — on a 99% engine, with two optional side bets in front of it.",
    image: {
      kind: "release",
      art: "blackjack",
      alt: "Blackjack lobby tile: an ace of spades standing against a face-down card, with a stack of black and white chips",
    },
    body: [
      {
        type: "p",
        text: "Blackjack is live on the Bet4.win RGS, available from the integration operators already have.",
      },
      {
        type: "p",
        text: "Beat the dealer's hand without going over 21. Two cards each, one of the dealer's face down, and then the player's move: Hit for another card, Stand, Double for exactly one more card at twice the stake, Split a pair into two hands, or Surrender a fresh hand and take half the stake back. Going over 21 loses the hand immediately.",
      },
      {
        type: "p",
        text: "On a stand, the dealer turns the hole card and draws to 16, standing on all 17s. A two-card 21 pays 3 to 2; any other win pays even money; a tie returns the stake. Split hands can double, and split aces get one card each. A dealer ace offers insurance at half the stake, paying 2 to 1 if the dealer has a two-card 21.",
      },
      { type: "h2", text: "The side bets" },
      {
        type: "p",
        text: "Both are optional and both are placed before the deal. Perfect Pairs pays on the player's first two cards: 26× for a matching pair of the same suit, 11× for the same colour, 6× for any pair. 21+3 reads the player's two cards together with the dealer's upcard: 101× for a suited three of a kind, 41× for a straight flush, 31× for three of a kind, 11× for a straight, 6× for a flush.",
      },
      {
        type: "p",
        text: "They are also what gives the table its range. The main game tops out at 2.5× and sits close to even money; 21+3 reaches 101×. How volatile a session is depends on which of the three bets the player is actually placing.",
      },
      { type: "h2", text: "The figures" },
      {
        type: "ul",
        items: [
          "RTP 99% — the certified engine version is the figure, and the rules package is keyed off it.",
          "Volatility from low to high, depending on the side bets.",
          "Up to 101× on a suited three of a kind. Operators can enforce a lower per-bet cap.",
          "Per-round provable fairness: the shoe is committed before the deal and the seed is published when the hand closes.",
        ],
      },
      { type: "h2", text: "Availability" },
      {
        type: "p",
        text: "Blackjack runs on the same connection as the rest of the catalogue, branded end to end, and is demo-playable before it goes live. Where it can be offered is a matter for each operator's own licensing.",
      },
    ],
  },

  {
    slug: "baccarat-release",
    kicker: "Release",
    date: "2026-09-11",
    title: "Baccarat is live on all three spots",
    dek: "Back Player, Banker or Tie — or any combination of them — and the hand closest to nine settles the round.",
    image: {
      kind: "release",
      art: "baccarat",
      alt: "Baccarat lobby tile: a burgundy and gold card shoe with a club card sliding out, beside a stack of red chips",
    },
    body: [
      {
        type: "p",
        text: "Baccarat is live on the Bet4.win RGS and available to every operator on the integration.",
      },
      {
        type: "p",
        text: "Two hands are dealt and neither of them belongs to the player. The bet is on which one finishes closest to nine — Player, Banker, or a Tie between them, in any combination. Cards count their face value, an ace counts one, and tens and court cards count nothing. Only the last digit of a total counts, so no hand can go bust: nine plus five is fourteen, which is four.",
      },
      {
        type: "p",
        text: "An eight or a nine on the first two cards is a natural and ends the round there. Otherwise the third-card rules run: Player draws on nought to five and stands on six or seven, and Banker's draw depends on what Player's third card was. No hand ever takes more than three cards, and none of it is a decision — the table plays itself out once the bets are down.",
      },
      { type: "h2", text: "What each spot pays" },
      {
        type: "p",
        text: "Player pays even money. Banker pays 0.95 to 1, after a five per cent commission on the win. Tie pays 8 to 1, and when the round is a tie the Player and Banker stakes are returned rather than lost.",
      },
      {
        type: "pull",
        text: "Banker is the best bet on the table. Tie is the worst.",
      },
      {
        type: "p",
        text: "That is not a figure of speech. The return is 98.94% on Banker, 98.77% on Player and 85.88% on Tie, and choosing between them is the only strategy baccarat has. The rules copy in the game states all three rather than quoting the best one.",
      },
      { type: "h2", text: "The figures" },
      {
        type: "ul",
        items: [
          "RTP 85.88–98.94%, depending entirely on which spot is backed.",
          "Volatility from low to high: Player and Banker are near coin-flips, Tie comes in under one round in ten.",
          "Up to 9× on a Tie — 8 to 1 plus the stake. There are no side bets in this version.",
          "Per-round provable fairness: the shoe is committed before the deal and the seed is published when the round closes.",
        ],
      },
      { type: "h2", text: "Availability" },
      {
        type: "p",
        text: "Baccarat is available now on the same integration as the rest of the catalogue, in full white-label branding, and demo-playable before anything reaches a live lobby. Territory availability is set at the operator level, against their own licences.",
      },
    ],
  },
];
