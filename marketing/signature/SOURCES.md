# Email signature banner — OpenArt

Generated 2026-09-23 for the `/signature` generator. `raw/banner-b.png` and
`raw/alternates/banner-a.png` are build inputs: `node scripts/signature/build.mjs`
crops each to 3:1, sets the type on top in Chrome, and writes
`public/assets/img/email/b4w-signature-banner.png` (from b) and the temporary
`b4w-signature-sbc.png` SBC Summit invitation (from a), both set at 1440x480, shipped as 960x320 PNGs with the corners cut in, shown at
480x160, plus the social icons. OpenArt has no seed, so the render cannot be reproduced — keep it.

Model `gpt-image-2-5-sunburst`, `image2image`, 21:9, 2K, medium, 2 images
(~80 credits). References: `punch-arm.png`, `punch-kv.png`, `dragon-hero.png`,
`coin-kv.png` (the deck uploads; OpenArt recorded only the first two as used).

Pick: **b**. Dragon centred on its tower (one head, two wings, one tail),
glove punching through with the starburst, left side clean for the wordmark.
`raw/alternates/banner-a.png` has a coin crossing the dragon's wing and a
busier right edge; it became the SBC Summit banner, which takes the studio banner's place
while the show is on.

No keying: the banner is opaque and carries its own background, which is what
makes it read the same on light and dark mail clients.

Prompt (abridged): ultra-wide game-studio key art, left 45% dark navy negative
space with royal-blue volumetric light; right 55%: first-person RIGHT red
boxing glove seen from behind thrown toward the left, gold comic starburst at
impact; behind it the black dragon perched on its rune tower; sun/moon coins
and two gems tumbling. Comic-style glove, photoreal props, royal-blue rim
light. No text, letters, numbers, logos, UI or watermark.
