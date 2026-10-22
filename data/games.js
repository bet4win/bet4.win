// Thumbnails are statically imported (not referenced as /public string paths)
// so the build emits them to /_next/static/media with a content hash. That
// makes their URLs change whenever the bytes change, so they can be cached
// immutably (1yr) with no risk of serving stale art. next/image uses the
// hashed file as its optimization source.
import crash from "@/public/assets/img/icons/thumbnails3/crash.jpg";
import mines from "@/public/assets/img/icons/thumbnails3/mines.jpg";
import plinko from "@/public/assets/img/icons/thumbnails3/plinko.jpg";
import dice from "@/public/assets/img/icons/thumbnails3/dice.jpg";
import wheel from "@/public/assets/img/icons/thumbnails3/wheel.jpg";
import diamonds from "@/public/assets/img/icons/thumbnails3/diamonds.jpg";
import keno from "@/public/assets/img/icons/thumbnails3/keno.jpg";
import limbo from "@/public/assets/img/icons/thumbnails3/limbo.jpg";
// `dragon.jpg`, not `dragon2.jpg`: both hold the same art, but site-assets.mjs
// writes `dragon.jpg`, so importing the `2` variant meant regenerating dragon's
// tile from the shipped lobby art silently had no effect. dragon2.jpg is now
// unreferenced and can be deleted.
import dragon from "@/public/assets/img/icons/thumbnails3/dragon.jpg";
import chicken from "@/public/assets/img/icons/thumbnails3/chicken.jpg";
import hilo from "@/public/assets/img/icons/thumbnails3/hilo.jpg";
import coin from "@/public/assets/img/icons/thumbnails3/coin.jpg";
import punch from "@/public/assets/img/icons/thumbnails3/punch.jpg";
import roulette from "@/public/assets/img/icons/thumbnails3/roulette.jpg";
import americanRoulette from "@/public/assets/img/icons/thumbnails3/american-roulette.jpg";
import videoPoker from "@/public/assets/img/icons/thumbnails3/video-poker.jpg";
import blackjack from "@/public/assets/img/icons/thumbnails3/blackjack.jpg";
import baccarat from "@/public/assets/img/icons/thumbnails3/baccarat.jpg";
import kenoParty from "@/public/assets/img/icons/thumbnails3/keno-party.jpg";
import diamondMine from "@/public/assets/img/icons/thumbnails3/diamond-mine.jpg";
// Wide key art per game: `<slug>.jpg` (680x440) for the homepage spotlight,
// `<slug>-wide.jpg` (1400x430) for the banner on /games/<slug>.
import crashBanner from "@/public/assets/img/banners/crash.jpg";
import crashWide from "@/public/assets/img/banners/crash-wide.jpg";
import dragonBanner from "@/public/assets/img/banners/dragon.jpg";
import dragonWide from "@/public/assets/img/banners/dragon-wide.jpg";
import punchBanner from "@/public/assets/img/banners/punch.jpg";
import punchWide from "@/public/assets/img/banners/punch-wide.jpg";
import minesBanner from "@/public/assets/img/banners/mines.jpg";
import minesWide from "@/public/assets/img/banners/mines-wide.jpg";
import plinkoBanner from "@/public/assets/img/banners/plinko.jpg";
import plinkoWide from "@/public/assets/img/banners/plinko-wide.jpg";
import diceBanner from "@/public/assets/img/banners/dice.jpg";
import diceWide from "@/public/assets/img/banners/dice-wide.jpg";
import wheelBanner from "@/public/assets/img/banners/wheel.jpg";
import wheelWide from "@/public/assets/img/banners/wheel-wide.jpg";
import diamondsBanner from "@/public/assets/img/banners/diamonds.jpg";
import diamondsWide from "@/public/assets/img/banners/diamonds-wide.jpg";
import kenoBanner from "@/public/assets/img/banners/keno.jpg";
import kenoWide from "@/public/assets/img/banners/keno-wide.jpg";
import limboBanner from "@/public/assets/img/banners/limbo.jpg";
import limboWide from "@/public/assets/img/banners/limbo-wide.jpg";
import rouletteBanner from "@/public/assets/img/banners/roulette.jpg";
import rouletteWide from "@/public/assets/img/banners/roulette-wide.jpg";
import americanRouletteBanner from "@/public/assets/img/banners/american-roulette.jpg";
import americanRouletteWide from "@/public/assets/img/banners/american-roulette-wide.jpg";
import coinBanner from "@/public/assets/img/banners/coin.jpg";
import coinWide from "@/public/assets/img/banners/coin-wide.jpg";
import hiloBanner from "@/public/assets/img/banners/hilo.jpg";
import hiloWide from "@/public/assets/img/banners/hilo-wide.jpg";
import videoPokerBanner from "@/public/assets/img/banners/video-poker.jpg";
import videoPokerWide from "@/public/assets/img/banners/video-poker-wide.jpg";
import blackjackBanner from "@/public/assets/img/banners/blackjack.jpg";
import blackjackWide from "@/public/assets/img/banners/blackjack-wide.jpg";
import baccaratBanner from "@/public/assets/img/banners/baccarat.jpg";
import baccaratWide from "@/public/assets/img/banners/baccarat-wide.jpg";
import chickenBanner from "@/public/assets/img/banners/chicken.jpg";
import chickenWide from "@/public/assets/img/banners/chicken-wide.jpg";
import kenoPartyBanner from "@/public/assets/img/banners/keno-party.jpg";
import kenoPartyWide from "@/public/assets/img/banners/keno-party-wide.jpg";
import diamondMineBanner from "@/public/assets/img/banners/diamond-mine.jpg";
import diamondMineWide from "@/public/assets/img/banners/diamond-mine-wide.jpg";
// Each game ships a pre-blurred 16:9 scene from its own marketing pack
// (marketing/<game>/backgrounds/<game>_bg-main-blur.png). It is the room the
// game is actually played in, out of focus — which is what the homepage
// spotlight uses as its backdrop, so the card is lit by the game it features
// rather than by a gradient somebody picked. Already blurred at source, so
// these compress to ~12KB each.
import punchBackdrop from "@/public/assets/img/backdrops/punch.jpg";
import crashBackdrop from "@/public/assets/img/backdrops/crash.jpg";
import dragonBackdrop from "@/public/assets/img/backdrops/dragon.jpg";
import videoPokerBackdrop from "@/public/assets/img/backdrops/video-poker.jpg";
import blackjackBackdrop from "@/public/assets/img/backdrops/blackjack.jpg";
import baccaratBackdrop from "@/public/assets/img/backdrops/baccarat.jpg";
import rouletteBackdrop from "@/public/assets/img/backdrops/roulette.jpg";
import americanRouletteBackdrop from "@/public/assets/img/backdrops/american-roulette.jpg";
import coinBackdrop from "@/public/assets/img/backdrops/coin.jpg";
import hiloBackdrop from "@/public/assets/img/backdrops/hilo.jpg";
import minesBackdrop from "@/public/assets/img/backdrops/mines.jpg";
import plinkoBackdrop from "@/public/assets/img/backdrops/plinko.jpg";
import diceBackdrop from "@/public/assets/img/backdrops/dice.jpg";
import wheelBackdrop from "@/public/assets/img/backdrops/wheel.jpg";
import diamondsBackdrop from "@/public/assets/img/backdrops/diamonds.jpg";
import kenoBackdrop from "@/public/assets/img/backdrops/keno.jpg";
import limboBackdrop from "@/public/assets/img/backdrops/limbo.jpg";
import chickenBackdrop from "@/public/assets/img/backdrops/chicken.jpg";
import kenoPartyBackdrop from "@/public/assets/img/backdrops/keno-party.jpg";
import diamondMineBackdrop from "@/public/assets/img/backdrops/diamond-mine.jpg";

// Per-game card figures. All three are game-specific — there is no catalogue-wide
// default, so a game that omits a field simply doesn't show it on its card.
//
//   maxMultiplier — the client's default max-win cap, read from the game sources
//                   in ../ui/apps/<game>/. The backend can enforce a lower
//                   per-bet cap per operator.
//   rtp           — quoted as a range: it moves with the game version and the
//                   operator's configuration rather than being one fixed number.
//                   The two roulette tables are the exception — their RTP is
//                   fixed by the wheel's pocket count (36/37 and 36/38), not by
//                   configuration, so they carry a single exact figure.
//   volatility    — the title's risk profile.
//
// Optional per-game fields:
//
//   slug          — URL segment, when it can't be derived from the title. Titles
//                   are lowercased to build /games/<slug>, which breaks on any
//                   multi-word title ("American Roulette" -> "american roulette",
//                   a URL with a literal space). Set this and `slugFor` uses it.
//   isNew         — renders a NEW badge on the card. Drop the flag once the
//                   title is no longer a recent release; nothing expires it.
//   seasons       — seasonal variants of this title, as season id -> launch
//                   URL. Each variant is its own game on the RGS, so this is a
//                   second `url` rather than a flag. Puts a glyph on the card
//                   and an entry in the launch menu. Ids must be listed in
//                   app/lib/seasons.js; anything else is ignored.
export const games = [
  {
    id: "16",
    category: "Crash",
    title: "Punch",
    banner: punchBanner,
    bannerWide: punchWide,
    backdrop: punchBackdrop,
    // Four versions, 94–97 (Bet4win catalogue, 2026-10-15).
    rtp: "94–97%",
    volatility: "High",
    // The insane ladder's cap (Bet4win catalogue, 2026-10-15). Three ladder
    // profiles cap at 1,000x / 10,000x / 100,000x (punch-game/src/app/game/
    // ladder.ts LADDER_CAP); there is no profile picker on screen yet, so rounds
    // currently play the standard ladder (10,000x).
    maxMultiplier: 100000,
    image: punch,
    status: "active",
    url: "https://remote-gaming-dev.systems.bet4.win/api/launch?game=5539fc3e4671414fb3229a9eee641720&token=DEMO&operator=5e41c28de3724d1290bbafbf6ee31cee&lang=en&site=bet4.win",
    aspectRatio: "16/9",
    // Seasonal variants: season id -> its own launch URL. Each is a separate
    // game on the RGS with its own id, and the launch endpoint resolves it to
    // a client URL already carrying `?season=<id>` — see app/lib/seasons.js.
    // Punch, Dragon, Chicken, Keno, Keno Party and Plinko are the titles with a
    // Christmas build.
    seasons: {
      halloween:
        "https://remote-gaming-dev.systems.bet4.win/api/launch?game=987f5a63ff4b4ede9790989d6e874eba&token=DEMO&operator=5e41c28de3724d1290bbafbf6ee31cee&lang=en&site=bet4.win",
      christmas:
        "https://remote-gaming-dev.systems.bet4.win/api/launch?game=9fd2de7ee70e4c0ca4aac8aea2356e42&token=DEMO&operator=5e41c28de3724d1290bbafbf6ee31cee&lang=en&site=bet4.win",
    },
    // Drives the homepage spotlight. Move this block to another game to change
    // which original is featured — see <FeaturedGame /> in app/page.jsx.
    // Figures from the Bet4win catalogue (2026-10-15) and the shipped ladders
    // (punch-game/src/app/game/ladder.ts): three profiles — safe 1.01x first rung,
    // 79 rungs, 1,000x; standard 1.02x, 61 rungs, 10,000x; insane 1.10x, 25
    // rungs, 100,000x. Rounds play the standard ladder until a picker ships.
    featured: {
      eyebrow: "New original · Live now",
      headline: "Every punch climbs the ladder. One too many tears the bag.",
      body: "A first-person comic-book boxer built on our crash ladder. Every landed punch steps the multiplier up a rung, but the bust rung is drawn server-side before the round opens — so players can cash out whenever their nerve goes, then verify the round they just played.",
      stats: [
        { value: "94–97%", label: "RTP" },
        { value: "61", label: "rungs to the top" },
        // "10,000×" overflows the tile on a phone (80px in 66px at 390 wide).
        { value: "10K×", label: "ladder top" },
      ],
    },
  },
  {
    id: "3",
    category: "Minefield",
    title: "Chicken",
    banner: chickenBanner,
    bannerWide: chickenWide,
    backdrop: chickenBackdrop,
    // Seven certified payout packs ship with the engine — 92, 94, 95, 96, 97, 98
    // and 99 — and the client renders the ladder for whichever one the live round
    // reports, so the range is the shipping tables rather than one configured
    // figure. (apps/chicken/src/app/game/ladders/.)
    rtp: "92–99%",
    // Player-chosen, and the spread IS the game rather than a footnote to it:
    // Easy puts one car on a twenty-lane road and tops out at 19.2x, while on
    // Expert there are ten cars and the very first lane already pays 1.92x —
    // about a coin flip. Same shape as roulette's, for the same reason.
    volatility: "Low–High",
    // A full Expert crossing at RTP 99: RTP x 184,756 — ten cars on twenty lanes,
    // all ten safe lanes cleared, a 1 in 184,756 chance (Bet4win catalogue, 2026-10-15).
    maxMultiplier: 182908.44,
    image: chicken,
    status: "active",
    isNew: true,
    url: "https://remote-gaming-dev.systems.bet4.win/api/launch?game=3c5e5c0ebd5f4e76b8465300b2f5f50b&token=DEMO&operator=5e41c28de3724d1290bbafbf6ee31cee&lang=en&site=bet4.win",
    seasons: {
      christmas:
        "https://remote-gaming-dev.systems.bet4.win/api/launch?game=9b3f8ebbce8240ee920ad8691848dd5f&token=DEMO&operator=5e41c28de3724d1290bbafbf6ee31cee&lang=en&site=bet4.win",
    },
  },
  {
    id: "15",
    category: "Crash",
    title: "Crash",
    banner: crashBanner,
    bannerWide: crashWide,
    backdrop: crashBackdrop,
    // One version; the catalogue lists it as "Crash 96" with an RTP of 0.97, and
    // the RTP column is the figure quoted (Bet4win catalogue, 2026-10-15).
    rtp: "97%",
    volatility: "High",
    // Set server-side by CRASH_MAX_MULTIPLIER (Bet4win catalogue, 2026-10-15).
    maxMultiplier: 10000,
    image: crash,
    status: "active",
    url: "https://remote-gaming-dev.systems.bet4.win/api/launch?game=a444355ce84b419ea48869d9c15734ab&token=DEMO&operator=5e41c28de3724d1290bbafbf6ee31cee&lang=en&site=bet4.win&branding=test",
  },
  {
    id: "23",
    category: "Instant",
    // The repo slug is `multiplayer-keno`; the game is marketed as Keno Party, and two
    // words means the title can't produce the URL segment on its own.
    title: "Keno Party",
    slug: "keno-party",
    banner: kenoPartyBanner,
    bannerWide: kenoPartyWide,
    backdrop: kenoPartyBackdrop,
    // One version on the RGS, "Keno Multiplayer 95" (Bet4win catalogue, 2026-10-15). The client bundles
    // all seven engine tables (multiplayer-keno/src/app/game/payouts.ts) but only the 95
    // one is served.
    rtp: "95%",
    // The player picks one of four risk levels (classic, low, medium, high), and the low
    // table's top rungs are where the 1,000x lives. Same shape as roulette's.
    volatility: "Low–High",
    // The top rung of every table, and the catalogue's max exposure.
    maxMultiplier: 1000,
    image: kenoParty,
    status: "active",
    isNew: true,
    url: "https://remote-gaming-dev.systems.bet4.win/api/launch?game=88cf5bf1f9114f319763ecaf4f1a7a15&token=DEMO&operator=5e41c28de3724d1290bbafbf6ee31cee&lang=en&site=bet4.win",
    seasons: {
      christmas:
        "https://remote-gaming-dev.systems.bet4.win/api/launch?game=5368a1df315d465a80e8e99d3d02f5b6&token=DEMO&operator=5e41c28de3724d1290bbafbf6ee31cee&lang=en&site=bet4.win",
    },
  },
  {
    id: "24",
    category: "Crash",
    title: "Diamond Mine",
    // Two words, so the title can't produce the URL segment on its own.
    slug: "diamond-mine",
    banner: diamondMineBanner,
    bannerWide: diamondMineWide,
    backdrop: diamondMineBackdrop,
    // Not in the Bet4win catalogue, 2026-10-15. It runs Punch's manual-crash engine and
    // ladders on its own backend game, so it carries Punch's figures until it is listed.
    rtp: "94–97%",
    volatility: "High",
    // Punch's insane-ladder cap; rounds currently play the standard ladder (10,000x).
    maxMultiplier: 100000,
    image: diamondMine,
    status: "active",
    isNew: true,
    url: "https://remote-gaming-dev.systems.bet4.win/api/launch?game=d3c40d524d9346118c835272955e21ac&token=DEMO&operator=5e41c28de3724d1290bbafbf6ee31cee&lang=en&site=bet4.win",
  },
  {
    id: "9",
    category: "Minefield",
    title: "Dragon",
    banner: dragonBanner,
    bannerWide: dragonWide,
    backdrop: dragonBackdrop,
    rtp: "92–99%",
    volatility: "High",
    // Dragon 99 (Bet4win catalogue, 2026-10-15).
    maxMultiplier: 259522.56,
    image: dragon,
    status: "active",
    url: "https://remote-gaming-dev.systems.bet4.win/api/launch?game=14fdde34d95011f08de90242ac120002&token=DEMO&operator=5e41c28de3724d1290bbafbf6ee31cee&lang=en&site=bet4.win",
    seasons: {
      christmas:
        "https://remote-gaming-dev.systems.bet4.win/api/launch?game=a8fb301d5ba74e949504d2e40dda95c1&token=DEMO&operator=5e41c28de3724d1290bbafbf6ee31cee&lang=en&site=bet4.win",
    },
    aspectRatio: "4/3",
  },
  {
    id: "20",
    category: "Cards",
    title: "Video Poker",
    // Two words, so the title can't produce the URL segment on its own.
    slug: "video-poker",
    banner: videoPokerBanner,
    bannerWide: videoPokerWide,
    backdrop: videoPokerBackdrop,
    rtp: "92–99%",
    volatility: "High",
    // The royal flush, and the only rung that pays it: `maxWin` in
    // video-poker/game.spec.yaml, identical across all seven paytables. The
    // client never bakes the figure — it comes from payTableConfig at runtime —
    // so the spec is the right thing to quote here.
    maxMultiplier: 800,
    image: videoPoker,
    status: "active",
    isNew: true,
    url: "https://remote-gaming-dev.systems.bet4.win/api/launch?game=4518a8a7b97b475f83f16e473a78e3ab&token=DEMO&operator=5e41c28de3724d1290bbafbf6ee31cee&lang=en&site=bet4.win",
  },
  {
    id: "21",
    category: "Cards",
    title: "Blackjack",
    banner: blackjackBanner,
    bannerWide: blackjackWide,
    backdrop: blackjackBackdrop,
    // The certified engine version IS the figure: `rules.ts` keys its rules
    // package off `CONFIG.engineVersionRTP`, and the only version the client
    // recognises is "99". Quoting anything else would be inventing one.
    rtp: "99%",
    // The base game is near coin-flip — even money on most wins, 3:2 on a
    // natural — but the two optional side bets reach 101x, so the range is real
    // and depends on how the player bets. Same shape as roulette.
    volatility: "Low\u2013High",
    // 21+3's suited three-of-a-kind, and no round can pay more than 101x of
    // everything staked. Each bet has its own maximum: 8x on the main hand
    // (split, then double both hands), 101x on 21+3, 26x on Perfect Pairs
    // (Bet4win catalogue, 2026-10-15).
    maxMultiplier: 101,
    image: blackjack,
    status: "active",
    isNew: true,
    url: "https://remote-gaming-dev.systems.bet4.win/api/launch?game=97c9ed6766cd46e7a8bb1c711069d655&token=DEMO&operator=5e41c28de3724d1290bbafbf6ee31cee&lang=en&site=bet4.win",
  },
  {
    id: "22",
    category: "Cards",
    title: "Baccarat",
    banner: baccaratBanner,
    bannerWide: baccaratWide,
    backdrop: baccaratBackdrop,
    // A RANGE, and unusually for this catalogue the range is the game's whole
    // strategy rather than a configuration artefact: the return depends only on
    // which of the three spots the player backs. 98.94% on Banker, 98.77% on
    // Player, 85.88% on Tie — the figures are in `game/payouts.ts` and quoted in
    // full in the rules copy. Banker's is the headline because it is the best
    // bet available on the table.
    rtp: "85.88–98.94%",
    // Player and Banker are near coin-flip and pay about even money; Tie is an
    // 8:1 shot that comes in under one round in ten. So the volatility is
    // genuinely whatever the player chooses, the same shape as roulette's and
    // blackjack's.
    volatility: "Low–High",
    // Tie pays 8 to 1, so a round returns 9x the staked amount on that spot.
    // The base game has no higher rung — there are no side bets in V1.
    maxMultiplier: 9,
    image: baccarat,
    status: "active",
    isNew: true,
    url: "https://remote-gaming-dev.systems.bet4.win/api/launch?game=dde705cf2dfe4d26bf0b9306d6c7515d&token=DEMO&operator=5e41c28de3724d1290bbafbf6ee31cee&lang=en&site=bet4.win",
  },
  {
    id: "17",
    category: "Roulette",
    title: "Roulette",
    banner: rouletteBanner,
    bannerWide: rouletteWide,
    backdrop: rouletteBackdrop,
    // Fixed by the wheel, not by configuration: a straight-up number pays 36x
    // against 37 pockets, so 36/37 = 97.3%. Every bet type on a single-zero
    // table returns the same figure.
    rtp: "97.3%",
    // Spans the range by design — an even-chance field (red/black, odd/even) is
    // near coin-flip, a straight-up number hits 1 in 37.
    volatility: "Low–High",
    maxMultiplier: 36, // roulette/game.spec.yaml maxWin
    image: roulette,
    status: "active",
    isNew: true,
    url: "https://remote-gaming-dev.systems.bet4.win/api/launch?game=9abd83cf9b4542909b127c814eba03cb&token=DEMO&operator=5e41c28de3724d1290bbafbf6ee31cee&lang=en&site=bet4.win",
  },
  {
    id: "19",
    category: "Streak",
    title: "Coin",
    banner: coinBanner,
    bannerWide: coinWide,
    backdrop: coinBackdrop,
    // The engine serves 92 / 94 / 95 / 96 / 97 / 98 and defaults to 96 for an
    // unknown version, so the range is the six shipping tables, not a guess.
    rtp: "92–98%",
    volatility: "High",
    // 0.98 x 2^20 on the 98 table, the highest of the six (Bet4win catalogue, 2026-10-15) — twenty
    // consecutive calls, reachable only on a stake small enough that the exposure cap
    // leaves all twenty available.
    maxMultiplier: 1027604.48,
    image: coin,
    status: "active",
    isNew: true,
    url: "https://remote-gaming-dev.systems.bet4.win/api/launch?game=86eb86d3a9cf4141bc9ef30e20ea514b&token=DEMO&operator=5e41c28de3724d1290bbafbf6ee31cee&lang=en&site=bet4.win",
  },
  {
    id: "5",
    category: "Streak",
    // The game's own name is "HiLo" (apps/hilo/game.spec.yaml). Lowercasing it
    // still yields the `hilo` slug the assets and OG card are named for.
    title: "HiLo",
    banner: hiloBanner,
    bannerWide: hiloWide,
    backdrop: hiloBackdrop,
    // One version, HiLo 98 (Bet4win catalogue, 2026-10-15).
    rtp: "98%",
    volatility: "High",
    // No maxMultiplier: the catalogue lists HiLo's max exposure as Unlimited
    // (Bet4win catalogue, 2026-10-15), and the card shows no figure rather than an invented one.
    image: hilo,
    status: "active",
    isNew: true,
    url: "https://remote-gaming-dev.systems.bet4.win/api/launch?game=cd1a3052f0cb479aa7c167e4f377ec96&token=DEMO&operator=5e41c28de3724d1290bbafbf6ee31cee&lang=en&site=bet4.win",
  },
  {
    id: "1",
    category: "Minefield",
    title: "Mines",
    banner: minesBanner,
    bannerWide: minesWide,
    backdrop: minesBackdrop,
    rtp: "92–99%",
    volatility: "High",
    // Mines 99 (Bet4win catalogue, 2026-10-15).
    maxMultiplier: 5148297,
    image: mines,
    status: "active",
    url: "https://remote-gaming-dev.systems.bet4.win/api/launch?game=9943920c44b211f0be34cdfe93e2b2d7&token=DEMO&operator=5e41c28de3724d1290bbafbf6ee31cee&lang=en&site=bet4.win",
  },
  {
    id: "2",
    category: "Instant",
    title: "Plinko",
    banner: plinkoBanner,
    bannerWide: plinkoWide,
    backdrop: plinkoBackdrop,
    rtp: "92–99%",
    volatility: "High",
    maxMultiplier: 1000, // plinko/src/app/app.tsx
    image: plinko,
    status: "active",
    url: "https://remote-gaming-dev.systems.bet4.win/api/launch?game=78106d6ed4d247fbb7ac517ad8aa40d5&token=DEMO&operator=5e41c28de3724d1290bbafbf6ee31cee&lang=en&site=bet4.win",
    seasons: {
      christmas:
        "https://remote-gaming-dev.systems.bet4.win/api/launch?game=961d461bd6704d82a1e9233d5c61bd60&token=DEMO&operator=5e41c28de3724d1290bbafbf6ee31cee&lang=en&site=bet4.win",
    },
  },
  {
    id: "18",
    category: "Roulette",
    title: "American Roulette",
    // Two words, so the title can't produce the URL segment on its own.
    slug: "american-roulette",
    banner: americanRouletteBanner,
    bannerWide: americanRouletteWide,
    backdrop: americanRouletteBackdrop,
    // 36/38 = 94.74%. The double zero is the whole difference between the two
    // tables, and it costs the player 2.56 points of RTP.
    rtp: "94.74%",
    volatility: "Low–High",
    maxMultiplier: 36, // american-roulette/game.spec.yaml maxWin
    image: americanRoulette,
    status: "active",
    isNew: true,
    url: "https://remote-gaming-dev.systems.bet4.win/api/launch?game=35886cb3d441489a845c089d47264058&token=DEMO&operator=5e41c28de3724d1290bbafbf6ee31cee&lang=en&site=bet4.win",
  },
  {
    id: "4",
    category: "Instant",
    title: "Dice",
    banner: diceBanner,
    bannerWide: diceWide,
    backdrop: diceBackdrop,
    rtp: "92–99%",
    volatility: "High",
    // Dice 99 (Bet4win catalogue, 2026-10-15).
    maxMultiplier: 9900.99,
    image: dice,
    status: "active",
    url: "https://remote-gaming-dev.systems.bet4.win/api/launch?game=5dcfc14083094c6b963d0dc6ad82ba68&token=DEMO&operator=5e41c28de3724d1290bbafbf6ee31cee&lang=en&site=bet4.win",
  },
  {
    id: "6",
    category: "Instant",
    title: "Wheel",
    banner: wheelBanner,
    bannerWide: wheelWide,
    backdrop: wheelBackdrop,
    rtp: "92–99%",
    volatility: "High",
    maxMultiplier: 49.5, // lib/components winBands.ts WIN_BANDS.wheel
    image: wheel,
    status: "active",
    url: "https://remote-gaming-dev.systems.bet4.win/api/launch?game=8d74f1b250c74e0ca003ca551ec9bd90&token=DEMO&operator=5e41c28de3724d1290bbafbf6ee31cee&lang=en&site=bet4.win",
  },
  {
    id: "7",
    category: "Instant",
    title: "Diamonds",
    banner: diamondsBanner,
    bannerWide: diamondsWide,
    backdrop: diamondsBackdrop,
    // Six versions, 92–98 (Bet4win catalogue, 2026-10-15).
    rtp: "92–98%",
    volatility: "High",
    maxMultiplier: 50, // diamonds/src/app/app.tsx fallback (?? 50)
    image: diamonds,
    status: "active",
    url: "https://remote-gaming-dev.systems.bet4.win/api/launch?game=e07d949ed84911f08de90242ac120002&token=DEMO&operator=5e41c28de3724d1290bbafbf6ee31cee&lang=en&site=bet4.win",
  },
  {
    id: "8",
    category: "Instant",
    title: "Keno",
    banner: kenoBanner,
    bannerWide: kenoWide,
    backdrop: kenoBackdrop,
    rtp: "92–99%",
    volatility: "High",
    maxMultiplier: 1000, // keno/src/app/app.tsx
    image: keno,
    status: "active",
    url: "https://remote-gaming-dev.systems.bet4.win/api/launch?game=25eb025cd4bf11f08de90242ac120002&token=DEMO&operator=5e41c28de3724d1290bbafbf6ee31cee&lang=en&site=bet4.win",
    seasons: {
      christmas:
        "https://remote-gaming-dev.systems.bet4.win/api/launch?game=ffcaad5af8c34a0f90b2ab3e9be51537&token=DEMO&operator=5e41c28de3724d1290bbafbf6ee31cee&lang=en&site=bet4.win",
    },
  },
  {
    id: "10",
    category: "Crash",
    title: "Limbo",
    banner: limboBanner,
    bannerWide: limboWide,
    backdrop: limboBackdrop,
    rtp: "92–99%",
    volatility: "High",
    maxMultiplier: 1000000, // limbo/src/app/app.tsx
    image: limbo,
    status: "active",
    url: "https://remote-gaming-dev.systems.bet4.win/api/launch?game=17709360010649fa8f081e5c9920c42c&token=DEMO&operator=5e41c28de3724d1290bbafbf6ee31cee&lang=en&site=bet4.win",
  },
];
