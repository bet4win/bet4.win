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
export const games = [
  {
    id: "16",
    category: "Originals",
    title: "Punch",
    banner: punchBanner,
    bannerWide: punchWide,
    rtp: "94–99%",
    volatility: "High",
    maxMultiplier: 1000000, // punch-game/src/app/app.tsx
    image: punch,
    status: "active",
    url: "https://remote-gaming-dev.systems.bet4.win/api/launch?game=5539fc3e4671414fb3229a9eee641720&token=DEMO&operator=5e41c28de3724d1290bbafbf6ee31cee&lang=en&site=bet4.win",
    aspectRatio: "16/9",
    // Drives the homepage spotlight. Move this block to another game to change
    // which original is featured — see <FeaturedGame /> in app/page.jsx.
    // Figures come from the game spec (manual-crash archetype, growth 1.06,
    // rtp 96, uncapped ladder).
    featured: {
      eyebrow: "New original · Live now",
      headline: "Every punch climbs the ladder. One too many tears the bag.",
      body: "A first-person comic-book boxer built on our crash ladder. Every landed punch steps the multiplier up 6%, but the bust rung is drawn server-side before the round opens — so players can cash out whenever their nerve goes, then verify the round they just played.",
      stats: [
        { value: "96%", label: "RTP" },
        { value: "×1.06", label: "per punch" },
        { value: "∞", label: "uncapped ladder" },
      ],
    },
  },
  {
    id: "15",
    category: "Originals",
    title: "Crash",
    banner: crashBanner,
    bannerWide: crashWide,
    rtp: "94–99%",
    volatility: "High",
    maxMultiplier: 1000000, // crash/src/app/app.tsx
    image: crash,
    status: "active",
    url: "https://remote-gaming-dev.systems.bet4.win/api/launch?game=a444355ce84b419ea48869d9c15734ab&token=DEMO&operator=5e41c28de3724d1290bbafbf6ee31cee&lang=en&site=bet4.win&branding=test",
  },
  {
    id: "9",
    category: "Originals",
    title: "Dragon",
    banner: dragonBanner,
    bannerWide: dragonWide,
    rtp: "94–99%",
    volatility: "High",
    maxMultiplier: 251658.24, // dragon-tower IDragonTowerPaytableConfig.ts default
    image: dragon,
    status: "active",
    url: "https://remote-gaming-dev.systems.bet4.win/api/launch?game=14fdde34d95011f08de90242ac120002&token=DEMO&operator=5e41c28de3724d1290bbafbf6ee31cee&lang=en&site=bet4.win",
    aspectRatio: "4/3",
  },
  {
    id: "20",
    category: "Originals",
    title: "Video Poker",
    // Two words, so the title can't produce the URL segment on its own.
    slug: "video-poker",
    banner: videoPokerBanner,
    bannerWide: videoPokerWide,
    rtp: "94–99%",
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
    category: "Originals",
    title: "Blackjack",
    banner: blackjackBanner,
    bannerWide: blackjackWide,
    // The certified engine version IS the figure: `rules.ts` keys its rules
    // package off `CONFIG.engineVersionRTP`, and the only version the client
    // recognises is "99". Quoting anything else would be inventing one.
    rtp: "99%",
    // The base game is near coin-flip — even money on most wins, 3:2 on a
    // natural — but the two optional side bets reach 101x, so the range is real
    // and depends on how the player bets. Same shape as roulette.
    volatility: "Low\u2013High",
    // 21+3's suited three-of-a-kind, the top rung of either side paytable and
    // the same 101 the win-tier bands in lib/components are built around. The
    // main game alone tops out at 2.5x.
    maxMultiplier: 101,
    image: blackjack,
    status: "active",
    isNew: true,
    url: "https://remote-gaming-dev.systems.bet4.win/api/launch?game=97c9ed6766cd46e7a8bb1c711069d655&token=DEMO&operator=5e41c28de3724d1290bbafbf6ee31cee&lang=en&site=bet4.win",
  },
  {
    id: "17",
    category: "Originals",
    title: "Roulette",
    banner: rouletteBanner,
    bannerWide: rouletteWide,
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
    id: "18",
    category: "Originals",
    title: "American Roulette",
    // Two words, so the title can't produce the URL segment on its own.
    slug: "american-roulette",
    banner: americanRouletteBanner,
    bannerWide: americanRouletteWide,
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
    id: "19",
    category: "Originals",
    title: "Coin",
    banner: coinBanner,
    bannerWide: coinWide,
    // The engine serves 92 / 94 / 95 / 96 / 97 / 98 and defaults to 96 for an
    // unknown version, so the range is the six shipping tables, not a guess.
    rtp: "92–98%",
    volatility: "High",
    // 0.96 x 2^20 — the ceiling rung, reachable only on a stake small enough
    // that the exposure cap leaves all twenty calls available.
    maxMultiplier: 1006632.96, // lib/components winBands.ts WIN_BANDS.coin
    image: coin,
    status: "active",
    isNew: true,
    url: "https://remote-gaming-dev.systems.bet4.win/api/launch?game=86eb86d3a9cf4141bc9ef30e20ea514b&token=DEMO&operator=5e41c28de3724d1290bbafbf6ee31cee&lang=en&site=bet4.win",
  },
  {
    id: "5",
    category: "Originals",
    // The game's own name is "HiLo" (apps/hilo/game.spec.yaml). Lowercasing it
    // still yields the `hilo` slug the assets and OG card are named for.
    title: "HiLo",
    banner: hiloBanner,
    bannerWide: hiloWide,
    // Shipping tables run 92–99; the engine falls back to 99 for an unknown
    // version, which is what the client assumes when CONFIG carries no RTP.
    rtp: "92–99%",
    volatility: "High",
    maxMultiplier: 10000, // lib/components winBands.ts WIN_BANDS.hilo
    image: hilo,
    status: "active",
    isNew: true,
    url: "https://remote-gaming-dev.systems.bet4.win/api/launch?game=cd1a3052f0cb479aa7c167e4f377ec96&token=DEMO&operator=5e41c28de3724d1290bbafbf6ee31cee&lang=en&site=bet4.win",
  },
  {
    id: "1",
    category: "Originals",
    title: "Mines",
    banner: minesBanner,
    bannerWide: minesWide,
    rtp: "94–99%",
    volatility: "High",
    maxMultiplier: 5096294, // mines/src/app/app.tsx
    image: mines,
    status: "active",
    url: "https://remote-gaming-dev.systems.bet4.win/api/launch?game=9943920c44b211f0be34cdfe93e2b2d7&token=DEMO&operator=5e41c28de3724d1290bbafbf6ee31cee&lang=en&site=bet4.win",
  },
  {
    id: "2",
    category: "Originals",
    title: "Plinko",
    banner: plinkoBanner,
    bannerWide: plinkoWide,
    rtp: "94–99%",
    volatility: "High",
    maxMultiplier: 1000, // plinko/src/app/app.tsx
    image: plinko,
    status: "active",
    url: "https://remote-gaming-dev.systems.bet4.win/api/launch?game=78106d6ed4d247fbb7ac517ad8aa40d5&token=DEMO&operator=5e41c28de3724d1290bbafbf6ee31cee&lang=en&site=bet4.win",
  },
  {
    id: "4",
    category: "Originals",
    title: "Dice",
    banner: diceBanner,
    bannerWide: diceWide,
    rtp: "94–99%",
    volatility: "High",
    maxMultiplier: 9600, // dice getMaxWin(96) = floor(10001*96/100)
    image: dice,
    status: "active",
    url: "https://remote-gaming-dev.systems.bet4.win/api/launch?game=5dcfc14083094c6b963d0dc6ad82ba68&token=DEMO&operator=5e41c28de3724d1290bbafbf6ee31cee&lang=en&site=bet4.win",
  },
  {
    id: "6",
    category: "Originals",
    title: "Wheel",
    banner: wheelBanner,
    bannerWide: wheelWide,
    rtp: "94–99%",
    volatility: "High",
    maxMultiplier: 49.5, // lib/components winBands.ts WIN_BANDS.wheel
    image: wheel,
    status: "active",
    url: "https://remote-gaming-dev.systems.bet4.win/api/launch?game=8d74f1b250c74e0ca003ca551ec9bd90&token=DEMO&operator=5e41c28de3724d1290bbafbf6ee31cee&lang=en&site=bet4.win",
  },
  {
    id: "7",
    category: "Originals",
    title: "Diamonds",
    banner: diamondsBanner,
    bannerWide: diamondsWide,
    rtp: "94–99%",
    volatility: "High",
    maxMultiplier: 50, // diamonds/src/app/app.tsx fallback (?? 50)
    image: diamonds,
    status: "active",
    url: "https://remote-gaming-dev.systems.bet4.win/api/launch?game=e07d949ed84911f08de90242ac120002&token=DEMO&operator=5e41c28de3724d1290bbafbf6ee31cee&lang=en&site=bet4.win",
  },
  {
    id: "8",
    category: "Originals",
    title: "Keno",
    banner: kenoBanner,
    bannerWide: kenoWide,
    rtp: "94–99%",
    volatility: "High",
    maxMultiplier: 1000, // keno/src/app/app.tsx
    image: keno,
    status: "active",
    url: "https://remote-gaming-dev.systems.bet4.win/api/launch?game=25eb025cd4bf11f08de90242ac120002&token=DEMO&operator=5e41c28de3724d1290bbafbf6ee31cee&lang=en&site=bet4.win",
  },
  {
    id: "10",
    category: "Originals",
    title: "Limbo",
    banner: limboBanner,
    bannerWide: limboWide,
    rtp: "94–99%",
    volatility: "High",
    maxMultiplier: 1000000, // limbo/src/app/app.tsx
    image: limbo,
    status: "active",
    url: "https://remote-gaming-dev.systems.bet4.win/api/launch?game=17709360010649fa8f081e5c9920c42c&token=DEMO&operator=5e41c28de3724d1290bbafbf6ee31cee&lang=en&site=bet4.win",
  },
  {
    id: "3",
    category: "Originals",
    title: "Chicken",
    image: chicken,
    status: "09/2026",
    url: "https://remote-gaming-dev.systems.bet4.win/api/launch?game={}&token=DEMO&operator=5e41c28de3724d1290bbafbf6ee31cee&lang=en&site=bet4.win",
  },
];
