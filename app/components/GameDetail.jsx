"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import GameModal from "./GameModal";
import { ArrowRight, Play, ShieldCheck } from "./Icons";
import { trackEvent } from "@/app/lib/analytics";

const fmt = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });

export default function GameDetail({ game, content }) {
  // The page itself is the shareable URL, so unlike the catalogue modal there is
  // no history/param juggling here — just open and close.
  const [open, setOpen] = useState(false);

  const launch = () => {
    trackEvent("game_launch", {
      game_id: game.id,
      game_title: game.title,
      source: "game_page",
    });
    setOpen(true);
  };

  const stats = [
    game.maxMultiplier && {
      label: "Max multiplier",
      value: `${fmt.format(game.maxMultiplier)}×`,
      money: true, // gold is reserved for figures that are money
    },
    game.rtp && { label: "RTP", value: game.rtp },
    game.volatility && { label: "Volatility", value: game.volatility },
  ].filter(Boolean);

  return (
    <>
      <section className="mx-auto max-w-[1280px] px-5 pb-16 pt-28 md:px-12 md:pt-36">
        <nav aria-label="Breadcrumb" className="mb-6">
          <Link
            href="/games"
            className="inline-flex items-center gap-1.5 font-SpaceGrotesk text-[12px] uppercase tracking-[0.06em] !text-muted transition-colors hover:!text-ink focus-visible:outline-none focus-visible:!text-ink"
          >
            <ArrowRight className="h-4 w-4 rotate-180" />
            The catalogue
          </Link>
        </nav>

        <div className="overflow-hidden rounded-2xl border border-line shadow-2xl">
          <Image
            src={game.bannerWide}
            alt={`${game.title} — key art`}
            priority
            sizes="(min-width:1280px) 1232px, 92vw"
            className="h-auto w-full"
          />
        </div>

        <div className="mt-10 flex flex-col gap-10 lg:flex-row lg:gap-16">
          <div className="flex-1">
            <p className="font-SpaceGrotesk text-[12px] uppercase tracking-[0.08em] text-cyan">
              {game.category} · Live
            </p>
            <h1 className="b4w-display mt-2 !text-[clamp(2.4rem,1.5rem+2.8vw,3.5rem)] !text-ink">
              {game.title}
            </h1>

            {content?.paragraphs?.length > 0 && (
              <div className="mt-7">
                <h2 className="font-SpaceGrotesk !text-[12px] !font-normal uppercase !tracking-[0.1em] !text-faint">
                  How it plays
                </h2>
                <div className="mt-4 flex flex-col gap-4">
                  {content.paragraphs.map((p, i) => (
                    <p
                      key={i}
                      className="!mb-0 max-w-2xl font-SpaceGrotesk text-[1rem] leading-[1.7] text-muted"
                    >
                      {p}
                    </p>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Spec panel — the figures an operator actually screens on. */}
          <aside className="w-full lg:w-[340px] lg:shrink-0">
            <div className="machined-surface rounded-xl border border-line bg-panel-low p-6">
              <dl className="flex flex-col gap-5">
                {stats.map((s) => (
                  <div
                    key={s.label}
                    className="flex flex-col-reverse border-b border-line/60 pb-4 last:border-b-0 last:pb-0"
                  >
                    <dt className="mt-1 font-SpaceGrotesk text-[11px] uppercase tracking-[0.08em] text-faint">
                      {s.label}
                    </dt>
                    <dd
                      className={`!mb-0 font-JetBrainsMono text-[1.5rem] font-semibold !leading-none !tracking-[-0.02em] tabular-nums ${
                        s.money ? "!text-cyan" : "!text-ink"
                      }`}
                    >
                      {s.value}
                    </dd>
                  </div>
                ))}
              </dl>

              <button
                type="button"
                onClick={launch}
                // !uppercase — globals.css resets `button` to normal-case, which
                // otherwise silently beats the plain `uppercase` utility.
                className="mt-7 inline-flex w-full items-center justify-center gap-2.5 rounded-md b4w-sheen bg-brand-strong px-6 py-4 font-SpaceGrotesk text-[15px] font-semibold !uppercase tracking-[0.04em] !text-white shadow-[0_0_26px_-4px_rgba(37,99,235,0.5)] transition-colors hover:bg-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-panel-low"
              >
                <Play className="h-4 w-4" />
                Play demo
              </button>

              <Link
                href="/provably-fair"
                className="mt-4 inline-flex w-full items-center justify-center gap-1.5 font-SpaceGrotesk text-[12px] uppercase tracking-[0.06em] !text-cyan transition-colors hover:!text-ink focus-visible:outline-none focus-visible:!text-cyan"
              >
                <ShieldCheck className="h-4 w-4" />
                Verify a round
              </Link>

              <p className="!mb-0 mt-6 border-t border-line/60 pt-5 font-SpaceGrotesk text-[0.8rem] leading-[1.6] text-faint">
                Figures show the default configuration. Live values follow the
                game version and the setup agreed per operator — see{" "}
                <Link href="/terms" className="!text-muted underline underline-offset-2 hover:!text-ink">
                  our terms
                </Link>
                .
              </p>
            </div>
          </aside>
        </div>
      </section>

      <GameModal game={open ? game : null} onClose={() => setOpen(false)} />
    </>
  );
}
