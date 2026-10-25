# Aggregator logos

The "Get our games from" wall on the homepage (`app/components/Aggregators.jsx`,
listed in `data/aggregators.js`). Each file is the company's **own published
mark**, downloaded from their site unmodified. The wall draws every mark as a
white silhouette with a CSS filter; the files themselves are left as published.

A mark that doesn't survive that filter is left off rather than edited: an
opaque background, lettering cut out of a plate, or detail that only exists in
colour all come out as solid shapes. Ask the company for a mono version instead.

| File | Source | Fetched | Notes |
| --- | --- | --- | --- |
| `revolver-gaming.svg` | `https://revolvergaming.com/brand/logo-horizontal-white.svg` | 2026-10-25 | Reversed horizontal lockup. |
| `upgaming.svg` | Inline header `<svg>` on `https://upgaming.com/` | 2026-10-25 | Extracted verbatim. |
| `relax-gaming.svg` | `https://www.relax-gaming.com/static/img/logo.svg` | 2026-10-25 | Reversed. |
| `digitain.svg` | `https://fresh-respect-a21a463441.media.strapiapp.com/digitain_logo_2a83c4130b.svg` | 2026-10-25 | digitain.com's header logo, on their CMS media host. |
| `alea.png` | `https://resources.alea.com/img/global/alea.png` | 2026-10-25 | 200×129, the largest they publish; no SVG. |
| `softswiss.svg` | `https://www.softswiss.com/wp-content/themes/softswiss2022/assets/images/logo/logo-footer.svg` | 2026-10-25 | Header logo. Their brandbook also offers a logo pack zip. |
| `everymatrix.svg` | `https://everymatrix.com/wp-content/themes/everymatrix/assets/img/everymatrix-logo.svg` | 2026-10-25 | Stacked lockup. |
| `hub88.svg` | Inline header `<svg>` on `https://hub88.io/` | 2026-10-25 | Extracted verbatim. |
| `softgamings.svg` | `https://st.softgamings.com/themes/softgamings/images/svg/logo.svg` | 2026-10-25 | Includes the tagline and a generous viewBox, so it draws small. |
| `betconstruct.svg` | `https://www.betconstruct.com/fs/userFiles-v2/bcv2/images/logo.svg?v=1762874492` | 2026-10-25 | Current header mark, "BETCONSTRUCT AI". |
| `playtech.svg` | `https://www.playtech.com/app/uploads/2023/08/logo-asset.svg` | 2026-10-25 | Reversed. |
| `groove.svg` | `https://cdn.prod.website-files.com/6388c29791c10823c3f5f22a/6388c2ab54cf146b2cd7f20a_logo.svg` | 2026-10-25 | groovetech.com's header asset on its Webflow CDN. |
| `bragg-gaming.svg` | Inline header `<svg>` on `https://bragg.group/` | 2026-10-25 | Stands in for Oryx Gaming: oryxgaming.com redirects to its parent, Bragg, and no Oryx mark is published. |
| `1gamehub.png` | `https://1gamehub.com/_nuxt/img/logo-game-hub.bda0e11.png` | 2026-10-25 | 361×115. |
| `uplatform.svg` | `https://uplatform.com/wp-content/themes/uplatform/img/logo_uplatform.svg` | 2026-10-25 | |
| `nuxgame.svg` | `https://nuxgame.com/wp-content/themes/nux/assets/images/logo.svg` | 2026-10-25 | The company trades as NuxGame. |
| `salsa-technology.png` | `https://salsatechnology.com/wp-content/uploads/2025/09/Salsa_Technology_Logo.png` | 2026-10-25 | |
| `virtualsoft.png` | `https://virtualsoftlatam.com/wp-content/uploads/2025/06/Group-1.png` | 2026-10-25 | virtualsoft.tech redirects to virtualsoftlatam.com. |

## Left off, and why

- **Pariplay** — the only wordmark published has an opaque background, and the live site now carries Aristocrat Interactive branding.
- **Slotegrator** — lettering knocked out of a lime plate; whitened, it is a solid bar.
- **QTech Games** — a white paw inside a red disc; whitened, the paw disappears.
- **WeAreCasino** — the mark's reflection and fade turn to noise as a silhouette.
- **Digimatrix** — no site we could confirm as theirs (digimatrix.com is parked).
- **Solid Gaming** — solidgaming.net was down (Cloudflare 522) when fetched.
