import React from "react";
import Image from "next/image";
import Wordmark from "./Wordmark";

// The picture on a lobby card: the game's own play scene, its cut-out hero
// standing in it, and its wordmark as the title — the three pieces of its
// marketing pack, composed the way a casino lobby presents a game. Shared by
// the catalogue card (a link) and the stage's selector (a button), so a game
// looks the same wherever it is picked.
export default function LobbyArt({ entry, sizes, className = "" }) {
  const { game, art } = entry;

  return (
    <div className={`relative aspect-[3/4] overflow-hidden rounded-xl bg-panel [container-type:inline-size] ${className}`}>
      <Image
        src={art.scene}
        alt=""
        fill
        sizes={sizes}
        className="object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/5 to-transparent" />
      <Image
        src={art.art}
        alt=""
        fill
        sizes={sizes}
        className="!top-[6%] !h-[64%] object-contain drop-shadow-[0_16px_18px_rgba(0,0,0,0.5)] transition-transform duration-500 group-hover:-translate-y-2"
      />
      {/* Letters sized to the card's width (cqw), so they match from card to
          card at any card size. */}
      <div className="absolute inset-x-0 bottom-[6%] flex justify-center">
        <Wordmark
          art={art}
          alt={game.title}
          letter="13cqw"
          maxWidth="88%"
          align="center"
          sizes={sizes}
          className="drop-shadow-[0_4px_10px_rgba(0,0,0,0.6)]"
        />
      </div>
      {game.isNew && (
        <span className="absolute left-3 top-3 rounded-sm bg-accent px-1.5 py-px font-Text text-[12px] font-bold text-accent-ink">
          New
        </span>
      )}
    </div>
  );
}
