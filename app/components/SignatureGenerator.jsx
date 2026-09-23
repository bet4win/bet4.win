"use client";
import { useRef, useState } from "react";
import { SITE_URL, bookingUrl } from "@/app/lib/site";
import { upcomingEvents } from "@/data/events";
import { Check } from "./Icons";

// Everything is served from the production origin, not window.location: a
// signature generated on a dev server or a preview deploy must still point at
// images that will exist for as long as the signature is in use. The preview
// swaps in the local path so it shows before the images are deployed.
const IMG = "/assets/img/email";

// Both banners are 960x320, shown at half that so they stay sharp on retina.
// Built by scripts/signature/build.mjs.
//
// The card's corners are split by what each part can do. The banner's bottom
// corners are cut into the image, because CSS cannot clip an image inside a
// pasted table. The top corners are CSS on the text cell's own background,
// which Apple Mail keeps — checked against the .mailsignature file it writes.
// Outlook desktop ignores border-radius, so there the top corners are square.
const CARD_W = 480;
const BANNER_H = 160;
const ICON = 24;

// Email clients ignore stylesheets and web fonts, so everything below is table
// layout with inline styles and a system font stack. The brand faces live in
// the banners, which are images.
//
// The text sits on its own navy card rather than on whatever the client's
// background is. That is what keeps one set of colours legible on a white
// compose window and in dark mode alike, and it makes the text and the banner
// read as one piece.
const CARD = "#0b1230";
const RULE = "#222b55";
const NAME = "#ffffff";
const ROLE = "#22E8FF"; // the banners' and the business cards' accent
const SOFT = "#c3c9dc";
const FONT = "'Helvetica Neue', Helvetica, Arial, sans-serif";

// Approximations of the two surfaces a signature actually lands on: a light
// compose window, and Gmail/Outlook dark mode.
const PREVIEW_BG = { light: "#ffffff", dark: "#1f1f1f" };

// The show the temporary invitation banner is for. While it is on, it takes
// the studio banner's place in the card. It only appears while
// upcomingEvents() still lists it, so the option disappears from the generator
// the day after the show — but a signature already pasted keeps it until its
// owner regenerates.
const SBC = upcomingEvents().find((e) => e.id === "sbc-summit-2026");

const SOCIALS = [
  {
    key: "linkedin",
    label: "LinkedIn",
    placeholder: "linkedin.com/in/your-name",
    base: "https://www.linkedin.com/in/",
    strip: /^(in\/)/,
  },
  { key: "x", label: "X", placeholder: "@handle", base: "https://x.com/" },
  { key: "telegram", label: "Telegram", placeholder: "@handle", base: "https://t.me/" },
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function esc(s) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// Accepts a full URL, a bare host path ("linkedin.com/in/x") or a handle
// ("@x"). Only ever returns an https/http URL, so nothing typed here can turn
// into a javascript: href.
function toUrl(value, { base, strip }) {
  let v = value.trim();
  if (!v) return null;
  if (/^https?:\/\//i.test(v)) return v;
  if (/^[\w-]+\.[\w.-]+\//.test(v)) return `https://${v}`;
  v = v.replace(/^@/, "");
  if (strip) v = v.replace(strip, "");
  return base + v.replace(/^\/+/, "");
}

function img(src, w, h, alt, style = "") {
  return `<img src="${src}" width="${w}" height="${h}" alt="${esc(alt)}" style="display:block;border:0;outline:none;width:${w}px;height:${h}px;${style}">`;
}

function buildSignature({ name, role, email, socials, sbc }, origin = SITE_URL) {
  const links = SOCIALS.map((s) => {
    const url = toUrl(socials[s.key] || "", s);
    return url && { ...s, url };
  }).filter(Boolean);

  const icons = links
    .map(
      (l, i) =>
        `<td style="padding:0 0 0 ${i ? 8 : 0}px;"><a href="${esc(l.url)}" style="text-decoration:none;">${img(
          `${origin}${IMG}/icon-${l.key}.png`, ICON, ICON, l.label,
        )}</a></td>`,
    )
    .join("");

  const banner = (file, href, alt) =>
    `<a href="${esc(href)}" style="text-decoration:none;">${img(
      `${origin}${IMG}/${file}`, CARD_W, BANNER_H, alt, "max-width:100%;height:auto;",
    )}</a>`;

  const html = [
    // separate, not collapse: a collapsed table ignores border-radius on cells.
    `<table cellpadding="0" cellspacing="0" border="0" role="presentation" width="${CARD_W}" style="border-collapse:separate;border-spacing:0;width:${CARD_W}px;max-width:100%;font-family:${FONT};">`,
    `<tr><td bgcolor="${CARD}" style="padding:22px 24px 18px;background:${CARD};border-radius:12px 12px 0 0;">`,
    `<div style="font-size:20px;line-height:24px;font-weight:bold;letter-spacing:-0.2px;color:${NAME};">${esc(name)}</div>`,
    `<div style="padding-top:5px;font-size:11px;line-height:14px;font-weight:bold;letter-spacing:1.6px;text-transform:uppercase;color:${ROLE};">${esc(role)}</div>`,
    `<table cellpadding="0" cellspacing="0" border="0" role="presentation" width="100%" style="border-collapse:collapse;margin-top:16px;border-top:1px solid ${RULE};">`,
    `<tr><td style="padding-top:14px;font-size:13px;line-height:${ICON}px;"><a href="mailto:${esc(email)}" style="color:${SOFT};text-decoration:none;">${esc(email)}</a></td>`,
    icons
      ? `<td align="right" style="padding-top:14px;"><table cellpadding="0" cellspacing="0" border="0" role="presentation" style="border-collapse:collapse;"><tr>${icons}</tr></table></td>`
      : "",
    `</tr></table>`,
    `</td></tr>`,
    `<tr><td style="padding:0;font-size:0;line-height:0;">${
      sbc
        ? banner(
            "b4w-signature-sbc.png",
            bookingUrl("email_signature", sbc.id),
            `Meet Bet4.win at ${sbc.name}, ${sbc.dates} — book a meeting`,
          )
        : banner("b4w-signature-banner.png", SITE_URL, "Bet4.win — game studio")
    }</td></tr>`,
    `</table>`,
  ].join("");

  const text = [
    name,
    role,
    "Bet4.win — game studio",
    email,
    "www.bet4.win",
    ...links.map((l) => `${l.label}: ${l.url}`),
    ...(sbc
      ? [`Meet us at ${sbc.name}, ${sbc.dates}: ${bookingUrl("email_signature", sbc.id)}`]
      : []),
  ].join("\n");

  return { html, text };
}

const inputCls =
  "w-full !rounded-xl border border-line bg-bg px-3.5 py-2.5 font-SpaceGrotesk text-[14px] text-ink placeholder:text-faint focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60";
const labelCls =
  "mb-1 block font-JetBrainsMono text-[11px] uppercase tracking-[0.05em] text-muted";

function Field({ label, optional, ...props }) {
  return (
    <label className="block">
      <span className={labelCls}>
        {label}
        {optional && <span className="normal-case text-faint"> — optional</span>}
      </span>
      <input className={inputCls} {...props} />
    </label>
  );
}

export default function SignatureGenerator() {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [socials, setSocials] = useState({});
  const [copied, setCopied] = useState(null);
  const [theme, setTheme] = useState("light");
  const copyRef = useRef(null);
  const [withSbc, setWithSbc] = useState(Boolean(SBC));

  const ready = name.trim() && role.trim() && EMAIL_RE.test(email.trim());

  const fields = {
    name: name.trim() || "Your Name",
    role: role.trim() || "Your role",
    email: email.trim() || "name@bet4.win",
    socials,
    sbc: withSbc ? SBC : null,
  };
  const signature = buildSignature(fields);
  // The preview loads the images from whichever server is rendering this page, so
  // it shows before the image has been deployed. What gets copied always carries
  // the production URL.
  const preview = buildSignature(fields, "").html;

  function flash(kind) {
    setCopied(kind);
    setTimeout(() => setCopied((k) => (k === kind ? null : k)), 2000);
  }

  // Copies a real selection of the rendered signature rather than writing
  // text/html to the clipboard. The browser then puts its own rich format on
  // the pasteboard — in Safari a WebArchive carrying the images themselves,
  // which is what Apple Mail's signature editor needs; given bare HTML it
  // drops remote images. Selected from a copy kept rendered off-screen, with
  // production image URLs, because the images have to be loaded already and
  // Safari only allows the copy synchronously inside the click.
  async function copyRich() {
    const sel = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(copyRef.current);
    sel.removeAllRanges();
    sel.addRange(range);
    const ok = document.execCommand("copy");
    sel.removeAllRanges();
    if (!ok) {
      await navigator.clipboard.write([
        new ClipboardItem({
          "text/html": new Blob([signature.html], { type: "text/html" }),
          "text/plain": new Blob([signature.text], { type: "text/plain" }),
        }),
      ]);
    }
    flash("rich");
  }

  async function copySource() {
    await navigator.clipboard.writeText(signature.html);
    flash("source");
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
      <form
        className="rounded-2xl border border-line bg-panel-high p-5"
        onSubmit={(e) => e.preventDefault()}
      >
        <div className="grid gap-4">
          <Field label="Name" value={name} onChange={(e) => setName(e.target.value)}
            placeholder="Jane Doe" autoComplete="name" required />
          <Field label="Role" value={role} onChange={(e) => setRole(e.target.value)}
            placeholder="Head of Partnerships" autoComplete="organization-title" required />
          <Field label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
            placeholder="name@bet4.win" autoComplete="email" required />
          <div className="mt-2 border-t border-line pt-4 grid gap-4">
            {SOCIALS.map((s) => (
              <Field key={s.key} label={s.label} optional placeholder={s.placeholder}
                value={socials[s.key] || ""}
                onChange={(e) => setSocials((p) => ({ ...p, [s.key]: e.target.value }))} />
            ))}
          </div>
          {SBC && (
            <label className="mt-2 flex items-start gap-3 border-t border-line pt-4">
              <input type="checkbox" checked={withSbc} onChange={(e) => setWithSbc(e.target.checked)}
                className="mt-1 h-4 w-4 accent-accent" />
              <span className="font-SpaceGrotesk text-[14px] text-ink">
                {SBC.name} banner
                <span className="block text-[12px] text-faint">
                  Replaces the studio banner. Temporary — regenerate your signature without it after {SBC.dates.split("–").pop().trim()}.
                </span>
              </span>
            </label>
          )}
        </div>
      </form>

      <div>
        <div className="mb-1 flex items-center justify-between">
          <p className={`${labelCls} !mb-0`}>Preview</p>
          <div role="group" aria-label="Preview background"
            className="flex gap-1 rounded-full border border-line p-0.5">
            {Object.keys(PREVIEW_BG).map((t) => (
              <button key={t} type="button" aria-pressed={theme === t}
                onClick={() => setTheme(t)}
                className={`rounded-full px-3 py-1 font-JetBrainsMono text-[11px] uppercase tracking-[0.05em] ${
                  theme === t ? "bg-ink/10 text-ink" : "text-muted"
                }`}>
                {t}
              </button>
            ))}
          </div>
        </div>
        {/* A mail client's surface, not this site's: a light compose window or
            a dark-mode one. */}
        <div className="rounded-2xl border border-line p-6"
          style={{ background: PREVIEW_BG[theme] }}>
          <div dangerouslySetInnerHTML={{ __html: preview }} />
        </div>
        <div ref={copyRef} aria-hidden="true"
          style={{ position: "fixed", left: -10000, top: 0 }}
          dangerouslySetInnerHTML={{ __html: signature.html }} />

        <div className="mt-5 flex flex-wrap gap-3">
          <button type="button" onClick={copyRich} disabled={!ready}
            className="b4w-btn b4w-btn--primary">
            {copied === "rich" ? "Copied" : "Copy signature"}
            {copied === "rich" && <Check className="h-4 w-4" />}
          </button>
          <button type="button" onClick={copySource} disabled={!ready}
            className="b4w-btn b4w-btn--ghost">
            {copied === "source" ? "Copied" : "Copy HTML source"}
            {copied === "source" && <Check className="h-4 w-4" />}
          </button>
        </div>
        <p className="!mt-3 !mb-0 font-SpaceGrotesk text-[12px] text-faint">
          {ready
            ? "Paste “Copy signature” straight into Gmail, Outlook or Apple Mail signature settings. Use the HTML source for clients that take raw HTML."
            : "Name, role and a valid email are required before copying."}
        </p>
        <details className="mt-4 rounded-xl border border-line p-4 font-SpaceGrotesk text-[13px] text-muted">
          <summary className="cursor-pointer text-ink">Apple Mail</summary>
          <ol className="mt-3 list-decimal space-y-1.5 pl-5">
            <li>Open this page in <strong className="text-ink">Safari</strong> and use “Copy signature”. Copied from Chrome, Mail drops the images.</li>
            <li>In Mail → Settings → Signatures, create a signature and <strong className="text-ink">untick “Always match my default message font”</strong> — ticked, it strips the formatting.</li>
            <li>Select the placeholder text in the signature editor and paste over it.</li>
            <li>If the images still show as blank boxes, turn on remote content (Settings → Privacy, “Block all remote content” off). They load when a message is sent either way.</li>
          </ol>
        </details>
      </div>
    </div>
  );
}
