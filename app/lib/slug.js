// One definition of a game's URL segment, because six places used to derive it
// independently as `game.title.toLowerCase()`. That works only while every title
// is a single word — "American Roulette" produces "american roulette", a URL with
// a literal space, which breaks the route, the sitemap entry, the canonical link
// and the OG image path all at once.
//
// A game may set `slug` explicitly; otherwise the title is lowercased and its
// spaces hyphenated.
export const slugFor = (game) =>
  game.slug ?? game.title.toLowerCase().replace(/\s+/g, "-");
