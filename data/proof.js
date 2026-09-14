// Figures for the Proof section.
//
// House rule for this file: every value must already be stated elsewhere on the
// live site, or be derivable from data/games.js. Nothing here is an estimate.
// If a buyer asked us to evidence a number on this page, we should be able to.
//
// This is also why we don't copy the competitor-comparison bars CROCO runs
// ("Provider A: 12.83%" against their own figure). Unverifiable comparative
// claims in a regulated vertical are an advertising-standards exposure, not
// just a question of taste.
export const claims = [
  { value: "99.99%", label: "Platform uptime", mono: true },
  { value: "Certified", label: "RGS and RNG", mono: false },
];

// --- Not yet filled in -------------------------------------------------------
// Both competitors publish all four of these and we currently cannot evidence
// any of them, so they render as nothing. Give one a `value` and it appears in
// the grid automatically — no component change needed.
//
// Do not populate these with approximations. An operator's compliance team will
// ask for the certificate behind whatever is written here.
export const pendingClaims = [
  { key: "licence", value: "", label: "Licence number", mono: true },
  { key: "lab", value: "", label: "Independent test lab", mono: false },
  { key: "operators", value: "", label: "Live operators", mono: true },
  { key: "markets", value: "", label: "Regulated markets", mono: true },
];
