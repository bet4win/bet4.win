// How each game plays, lifted verbatim from that game's own English locale file
// (../ui/apps/<app>/public/locales/en/game.json -> description_html). Kept as
// first-party copy rather than rewritten marketing text so the site can never
// describe a mechanic the game does not actually have. Runtime placeholders
// (e.g. the {{maxWin}} sentence) are dropped — those values are per operator.
export const gameContent = {
  roulette: {
    source: "roulette/public/locales/en/game.json",
    paragraphs: [
      "European roulette on a 37-pocket wheel: 0 and the numbers 1 to 36. Place chips on any mix of straight-up numbers, dozens, columns, red or black, odd or even, and low or high, then spin. A single spin settles every chip on the table at once.",
      "A straight-up number pays 36x, a dozen or a column pays 3x, and the even-chance fields pay 2x. 0 wins only for a chip placed directly on that pocket — it belongs to no dozen, column, colour, parity or half.",
      "Winnings are rounded down to the smallest currency unit (e.g., one cent).",
    ],
  },
  "american-roulette": {
    source: "american-roulette/public/locales/en/game.json",
    paragraphs: [
      "American roulette on a 38-pocket wheel: 0, 00 and the numbers 1 to 36. Place chips on any mix of straight-up numbers, dozens, columns, red or black, odd or even, and low or high, then spin. A single spin settles every chip on the table at once.",
      "A straight-up number pays 36x, a dozen or a column pays 3x, and the even-chance fields pay 2x. 0 and 00 win only for a chip placed directly on that pocket — they belong to no dozen, column, colour, parity or half.",
      "Winnings are rounded down to the smallest currency unit (e.g., one cent).",
    ],
  },
  crash: {
    source: "crash/public/locales/en/game.json",
    paragraphs: [
      "Crash is a multiplier game where a climbing multiplier can crash at any moment. Place your bet before the round starts, watch the multiplier rise, and cash out before it crashes to lock in your winnings.",
      "You can set an automatic cashout multiplier so the game cashes you out instantly when the multiplier reaches your target — useful if you want a hands-off approach or a specific profit goal.",
      "If the multiplier crashes before you cash out, you lose your bet. The later you cash out, the higher your potential reward — but the greater the risk.",
    ],
  },
  dragon: {
    source: "dragon-tower/public/locales/en/game.json",
    paragraphs: [
      "Dragon Tower is an exciting climbing game where you ascend a mysterious tower guarded by a dragon! The tower has 9 rows, and your goal is to climb as high as possible by choosing the right tiles while avoiding the deadly skulls.",
      "Before starting, set your bet amount and choose your difficulty level. Higher difficulty means fewer safe tiles per row, but much bigger potential rewards. The difficulty levels are:",
      "Each row you successfully climb increases your multiplier. You can cash out at any time to secure your winnings, or keep climbing for bigger rewards. But beware - hitting a skull ends your round and you lose your bet!",
      "If you successfully climb all 9 rows without hitting a skull, you'll automatically receive your maximum payout for that difficulty level.",
    ],
  },
  punch: {
    source: "punch-game/public/locales/en/game.json",
    paragraphs: [
      "Punch Game is a first-person boxing crash game: step up to the heavy bag and punch your way up the multiplier ladder!",
      "Roll the wheel on the bag to set your bet amount, then hit BET to start the round. Every punch you land climbs the multiplier one rung — and every punch risks tearing the bag open. The knockout blow is hidden and provably fair, drawn before your first punch lands.",
      "Every rung has the same expected value, so there is no \"right\" time to cash out — climb as far as your nerve holds.",
      "Use the lightning toggle for autoplay: set your rounds and limits, and each auto round resolves instantly at a provably fair rung.",
    ],
  },
  mines: {
    source: "mines/public/locales/en/game.json",
    paragraphs: [
      "Mines is an exciting 5x5 grid game where you reveal tiles to find Gems while avoiding bombs! Every Gem you uncover increases your payout multiplier, giving you the choice to keep going, flip a random tile, or cash out. But watch out—hitting a bomb ends the round and you lose everything.",
      "Before starting, set your bet amount and choose how many mines to place on the grid (from 1 to 24). More mines mean higher volatility and bigger potential payouts, but also greater risk of hitting a bomb early. The mine count you choose reflects your risk tolerance and how much you're willing to chase big rewards.",
      "As you successfully reveal Gems, the game shows you the potential winnings for the next tile flip and your total profit so far. This helps you decide whether to cash out or continue. Once your bet and mine count are set, you can click as many tiles as you want during the round. The game continues until you hit a bomb or decide to cash out.",
      "If revealing a tile would result in a win exceeding the maximum limit, you will be automatically cashed out before this action occurs.",
    ],
  },
  plinko: {
    source: "plinko/public/locales/en/game.json",
    paragraphs: [
      "Plinko is a popular chance-based game where a ball drops from the top of a multi-row pyramid and bounces randomly off pegs as it falls. The pocket where the ball lands determines your win, with the highest-paying pockets located near the edges and lower-paying ones in the center. Inspired by Japanese Pachinko, Plinko lets you customize both risk levels and multipliers. You control your risk and rewards through two main settings:",
      "Risk Level: Choose from three volatility levels—low, medium, and high. Higher risk can mean bigger payouts or bigger losses, so managing risk is key.",
      "Number of Rows: Select between 8 and 16 rows in the pyramid. More rows mean more pegs that affect the ball's path, which impacts potential payouts. The number of payout pockets in each round depends on the row count, with each extra row adding one more pocket.",
      "Each Plinko round starts with the ball dropping down the pyramid, bouncing off pegs until it lands in a pocket. Payouts gradually increase from the center toward the edges, with both sides of the pyramid being symmetrical. Even-numbered rows create a single minimum payout pocket in the center, while odd-numbered rows create two. Since balls tend to fall toward the middle more often, edge pockets offer the highest payouts because they're less likely to be hit.",
    ],
  },
  dice: {
    source: "dice/public/locales/en/game.json",
    paragraphs: [
      "Dice is a virtual dice game where you set a \"Roll Over\" or \"Roll Under\" target number. Winning depends on whether your roll meets this threshold, and you can adjust the payout multiplier to control your potential rewards.",
      "If you choose \"Roll Over,\" you need to roll a number greater than your target. With \"Roll Under,\" you need to roll below the target number.",
      "You can see your expected profit from a winning roll based on your bet amount and the multiplier, which changes based on your Roll Over/Under setting. Setting a higher Roll Over value increases both the multiplier and potential payout, but it also reduces your chances of winning. The default setting is Roll Over 50.50, which gives a 2x multiplier, but you can change this anytime before placing your bet.",
    ],
  },
  wheel: {
    source: "wheel/public/locales/en/game.json",
    paragraphs: [
      "The Wheel provides 15 distinct game modes, allowing you to customize the experience to match your preferences. Each mode offers unique combinations of multipliers and risk levels. The color where the wheel stops determines your payout, which corresponds to that segment's multiplier.",
    ],
  },
  diamonds: {
    source: "diamonds/public/locales/en/game.json",
    paragraphs: [
      "Diamonds is a chance-based game where five gem slots reveal colored diamonds, and your payout depends on the combination of matching diamonds you get. Each round reveals five diamonds across the slots, and the matching pattern determines your win multiplier.",
      "There are seven possible outcomes based on the diamond combinations: 5 of a Kind (all five match), 4 of a Kind, Full House (three of one type and two of another), 3 of a Kind, Two Pairs, One Pair, or No Match. Each combination offers a different payout multiplier, with rarer combinations like 5 of a Kind providing the highest rewards.",
      "Before each round, set your bet amount. The game then reveals the five diamonds, and your winnings are calculated by multiplying your bet by the multiplier for the combination you received. Higher-value combinations are less common but offer significantly larger payouts.",
    ],
  },
  keno: {
    source: "keno/public/locales/en/game.json",
    paragraphs: [
      "Keno is a classic lottery-style game where players pick up to 10 numbers from 1 to 40. Once a bet is placed, 10 numbers are randomly drawn. Your payout depends on how many of your selected numbers match the drawn numbers, following a predetermined payout structure.",
      "The more matches you get, the bigger your reward!",
    ],
  },
  limbo: {
    source: "limbo/public/locales/en/game.json",
    paragraphs: [
      "Limbo plays similarly to dice games but is uniquely designed to remove upper limits and provide fair odds. When the round result exceeds your target payout, you instantly win your bet multiplied by that target value. What makes Limbo special is its ability to let you adjust both your winning probability and potential payouts, which is essential for managing your bankroll effectively. To improve your chances of winning (with smaller potential payouts), lower the multiplier. If you want the biggest possible payouts, raise the multiplier—just make sure you have enough funds to cover the bet!",
    ],
  },
};
