import React from "react";
import Image from "next/image";

// The picture on a lobby card: the game's own play scene, its cut-out hero
// standing in it, and its wordmark as the title — the three pieces of its
// marketing pack, composed the way a casino lobby presents a game. Shared by
// the catalogue card (a link) and the stage's selector (a button), so a game
// looks the same wherever it is picked.
export default function LobbyArt({ entry, sizes, className = "" }) {
  const { game, art } = entry;

  return (
    <div className={`relative aspect-[3/4] overflow-hidden rounded-xl bg-panel ${className}`}>
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
      <Image
        src={art.wordmark}
        alt={game.title}
        sizes={sizes}
        className="absolute bottom-[6%] left-1/2 h-auto max-h-[18%] w-auto max-w-[82%] -translate-x-1/2 object-contain drop-shadow-[0_4px_10px_rgba(0,0,0,0.6)]"
      />
      {game.isNew && (
        <span className="absolute left-3 top-3 rounded-sm bg-accent px-1.5 py-px font-Text text-[12px] font-bold text-accent-ink">
          New
        </span>
      )}
    </div>
  );
}
