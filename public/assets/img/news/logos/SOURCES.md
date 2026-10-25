# Partner logos

Each file is the partner's **own published mark**, downloaded from their site
unmodified. Nothing here is traced, recoloured or redrawn — a partner
announcement is the worst place to get a partner's mark wrong, and an
approximation is both wrong and their trademark.

Record the source when you add one, so the next person can re-fetch it rather
than guess.

| File | Source | Fetched | Notes |
| --- | --- | --- | --- |
| `revolver-gaming.png` | `https://revolvergaming.com/wp-content/themes/RevolverGames/images/logo-sm.png` | 2026-09-15 | Horizontal lockup, reversed (white) — reads on the navy card. 193×55, which is the largest horizontal version they publish; the script does not upscale raster marks, so it renders at native size. |
| `upgaming.svg` | Inline `<svg id="upgaming logo-01 1">` in the site header at `https://upgaming.com` | 2026-09-15 | Vector, reversed: white wordmark with their teal (`#1DE9B6`) icon. Extracted verbatim, `<clipPath>` included. |
| `funz.svg` | `https://funzcasino.com/wp-content/uploads/2025/12/Funz-Color-Logo-Dark-Background-2.svg` | 2026-10-25 | Header logo, made for dark backgrounds. Funz is operated by Digi Matrix Inc. |
| `peakplay.svg` | `https://cdn.prod.website-files.com/68f993099a632d41af3be426/68facc05063d1ccd16785bed_peakplay-logo.svg` | 2026-10-25 | Header `<img>` on peakplay.com, served from the site's own Webflow CDN. White wordmark, blue icon. |
| `spincity-mozambique.svg` | `https://spincity.co.mz/_nuxt/casino-logo.Ce0KUNOs.svg` | 2026-10-25 | Header logo. Byte-identical to the Namibia file. The `_nuxt` hash changes when the site redeploys. |
| `spincity-namibia.svg` | `https://spincity.co.na/_nuxt/casino-logo.Ce0KUNOs.svg` | 2026-10-25 | Header logo. Same mark as Mozambique. |
| `slotpesa.svg` | `https://slotpesa.co.tz/logo.svg` | 2026-10-25 | The site's runtime-config `DESKTOP_LOGO`. |
| `winpesa-nigeria.svg` | `https://winpesa.ng/logo.svg` | 2026-10-25 | The site's runtime-config `DESKTOP_LOGO`. Stacked; no horizontal version published. NOT `/_nuxt/logo_mobile.*.svg`, which is a Slotpesa mark left in the shared bundle. |
| `pridespins.svg` | `https://pridespins.com.gh/logo.svg` | 2026-10-25 | The site's runtime-config `DESKTOP_LOGO`. Horizontal. |
| `winbucks.svg` | `https://winbucks.co.zw/_nuxt/casino-logo.DetIqsS6.svg` | 2026-10-25 | Header logo of the Zimbabwe site (the brand plays in USD). A Lesotho site, winbucks.ls, also exists. |

## Picking the right variant

The card is navy, so a **reversed / white** variant is what's needed. If a
partner only publishes a dark-on-light mark, ask them for the reversed one —
inverting theirs yourself produces a mark they never approved.

Prefer SVG. Rasters are composited at native size and never enlarged, so a small
PNG simply renders small.
