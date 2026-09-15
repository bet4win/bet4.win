import React from "react";
import Section from "./Section";
import { Check } from "./Icons";

const bullets = [
  "Seamless or transfer wallet integration",
  "Real-time webhook events for every critical action",
  "Full back-office reporting and reconciliation",
  "Fiat and crypto, multi-language, white-label branding",
];

export default function Integration() {
  return (
    <Section id="integration" surface="raised" rule innerClassName="py-12 md:py-20">
      <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-2">
        {/* Real launch endpoint — mirrors the pattern in data/games.js */}
        {/* Two colours, not one. The whole sample used to be a single accent
            hue, which is the same as no highlighting at all — the reader still
            had to parse it character by character to see what was a parameter
            name and what was its value. Names take the brand blue, values and
            the response take the accent, and the method gets the accent because
            it is the one word that says what this does. */}
        <div className="order-2 overflow-x-auto rounded-2xl border border-line bg-panel-high p-6 lg:order-1">
          <div className="whitespace-pre font-JetBrainsMono text-[13px] leading-[1.7] !text-muted">
            <span className="!text-accent">GET</span>{" "}
            <span className="!text-ink">/api/launch</span>
            {"\n"}
            {"  "}?<span className="!text-brand">game</span>=
            <span className="!text-accent">9943920c44b211f0be34cdfe93e2b2d7</span>
            {"\n"}
            {"  "}&<span className="!text-brand">token</span>=
            <span className="!text-accent">{"{SESSION_TOKEN}"}</span>
            {"\n"}
            {"  "}&<span className="!text-brand">operator</span>=
            <span className="!text-accent">{"{OPERATOR_ID}"}</span>
            {"\n"}
            {"  "}&<span className="!text-brand">lang</span>=
            <span className="!text-accent">en</span>
            {"\n"}
            {"  "}&<span className="!text-brand">site</span>=
            <span className="!text-accent">bet4.win</span>
            {"\n"}
            {"  "}&<span className="!text-brand">branding</span>=
            <span className="!text-accent">{"{BRAND}"}</span>
            {"\n\n"}
            <span className="!text-faint">{"// 200 OK"}</span>
            {"\n"}
            {"{\n"}
            {"  "}
            <span className="!text-brand">"launch_url"</span>:{" "}
            <span className="!text-accent">"https://…/games/mines?session=…"</span>
            {"\n}"}
          </div>
        </div>

        <div className="order-1 lg:order-2">
          <h2 className="mb-3 b4w-display !text-[clamp(1.35rem,1.175rem+0.9vw,1.75rem)] !text-ink">
            One API. Every game.
          </h2>
          <p className="mb-6 max-w-md b4w-copy font-SpaceGrotesk text-muted">
            Drop one endpoint into your platform and the entire b4w originals
            catalogue comes with it. Manage balances, track sessions and run
            promos without writing game-specific logic.
          </p>
          <ul className="flex flex-col gap-3">
            {bullets.map((b) => (
              <li
                key={b}
                className="flex items-center gap-3 b4w-copy font-SpaceGrotesk text-muted"
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-accent/30 bg-accent/10 text-accent">
                  <Check className="h-3.5 w-3.5" />
                </span>
                {b}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}
