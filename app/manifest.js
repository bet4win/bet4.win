import { SITE_NAME, SITE_DESCRIPTION } from "@/app/lib/site";

// Served at /manifest.webmanifest; Next auto-injects <link rel="manifest">.
export default function manifest() {
  return {
    name: `${SITE_NAME} — Provably-fair RGS for iGaming operators`,
    short_name: SITE_NAME,
    description: SITE_DESCRIPTION,
    start_url: "/",
    display: "standalone",
    background_color: "#0b1120",
    theme_color: "#0b1120",
    icons: [
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icon-180.png", sizes: "180x180", type: "image/png", purpose: "any" },
    ],
  };
}
