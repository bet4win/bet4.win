import React from "react";
import { Check } from "./Icons";

const bullets = [
  "Seamless or transfer wallet integration",
  "Real-time webhook events for every critical action",
  "Full back-office reporting and reconciliation",
  "Fiat and crypto, multi-language, white-label branding",
];

export default function Integration() {
  return (
    <section
      id="integration"
      className="mx-auto max-w-[1280px] border-t border-line px-5 py-20 md:px-12"
    >
      <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-2">
        {/* Real launch endpoint — mirrors the pattern in data/games.js */}
        <div className="order-2 overflow-x-auto rounded-xl border border-line bg-panel-low p-6 lg:order-1">
          <div className="whitespace-pre font-JetBrainsMono text-[13px] leading-[1.7] !text-muted">
            <span className="!text-cyan">GET</span> /api/launch{"\n"}
            {"  "}?<span className="!text-cyan">game</span>=
            <span className="!text-cyan">9943920c44b211f0be34cdfe93e2b2d7</span>
            {"\n"}
            {"  "}&<span className="!text-cyan">token</span>=
            <span className="!text-cyan">{"{SESSION_TOKEN}"}</span>
            {"\n"}
            {"  "}&<span className="!text-cyan">operator</span>=
            <span className="!text-cyan">{"{OPERATOR_ID}"}</span>
            {"\n"}
            {"  "}&<span className="!text-cyan">lang</span>=
            <span className="!text-cyan">en</span>
            {"\n"}
            {"  "}&<span className="!text-cyan">site</span>=
            <span className="!text-cyan">bet4.win</span>
            {"\n"}
            {"  "}&<span className="!text-cyan">branding</span>=
            <span className="!text-cyan">{"{BRAND}"}</span>
            {"\n\n"}
            <span className="!text-faint">{"// 200 OK"}</span>
            {"\n"}
            {"{\n"}
            {"  "}
            <span className="!text-cyan">"launch_url"</span>:{" "}
            <span className="!text-cyan">"https://…/games/mines?session=…"</span>
            {"\n}"}
          </div>
        </div>

        <div className="order-1 lg:order-2">
          <h2 className="mb-3 b4w-display !text-[1.75rem] !text-ink">
            One API. Every game.
          </h2>
          <p className="mb-6 max-w-md font-SpaceGrotesk leading-[1.6] text-muted">
            Drop one endpoint into your platform and the entire b4w originals
            catalogue comes with it. Manage balances, track sessions and run
            promos without writing game-specific logic.
          </p>
          <ul className="flex flex-col gap-3">
            {bullets.map((b) => (
              <li
                key={b}
                className="flex items-center gap-2.5 font-SpaceGrotesk text-[0.9rem] text-muted"
              >
                <Check className="h-4 w-4 shrink-0 text-cyan" />
                {b}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
