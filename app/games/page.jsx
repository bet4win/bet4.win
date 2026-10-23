import React from "react";
import PageShell from "@/app/components/PageShell";
import PageHeader from "@/app/components/PageHeader";
import GameGrid from "@/app/components/GameGrid";
import ClosingCta from "@/app/components/ClosingCta";
import DemoHost from "@/app/components/DemoHost";
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
        title="The catalogue"
        scene="chicken"
        art="chicken"
        intro={`${liveCount} provably fair originals: crash, mines, plinko, cards, roulette and more. Every title is playable here as a demo, and every one ships in your brand.`}
      />

      <section aria-label="All games" className="mx-auto max-w-[1320px] px-5 pb-20 pt-6 md:px-12 md:pb-28">
        <GameGrid />
      </section>

      <ClosingCta />
      <DemoHost />
    </PageShell>
  );
}
