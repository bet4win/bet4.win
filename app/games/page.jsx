import React from "react";
import PageShell from "@/app/components/PageShell";
import PageHeader from "@/app/components/PageHeader";
import FeaturedGame from "@/app/components/FeaturedGame";
import GameGrid from "@/app/components/GameGrid";
import ClosingCta from "@/app/components/ClosingCta";
import Reveal from "@/app/components/Reveal";
import { games } from "@/data/games";

const liveCount = games.filter((g) => g.status === "active").length;

export const metadata = {
  title: "The catalogue",
  description: `Every provably-fair original from Bet4.win — ${liveCount} games live, a new one every month. Crash, mines, plinko, dice and more, each demo-playable and fully brandable.`,
  alternates: { canonical: "/games" },
};

export default function GamesPage() {
  return (
    <PageShell>
      <PageHeader
        eyebrow="A new original every month"
        title="The catalogue"
        intro={`${liveCount} provably-fair originals you can launch as a casino game provider — crash, mines, plinko, dice and more. Every title is demo-playable here and fully brandable for your platform.`}
      />

      <FeaturedGame slug="punch" />

      <section
        aria-labelledby="all-games"
        className="mx-auto max-w-[1280px] px-5 py-10 md:px-12"
      >
        <Reveal>
          <h2
            id="all-games"
            className="mb-8 font-SpaceGrotesk !text-[12px] !font-normal uppercase !tracking-[0.1em] !text-faint"
          >
            All originals
          </h2>
        </Reveal>
        <GameGrid items={games} />
      </section>

      <ClosingCta />
    </PageShell>
  );
}
