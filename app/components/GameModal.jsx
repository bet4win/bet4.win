"use client";
import { useEffect } from "react";
import { Close } from "./Icons";

// Launches a game. On wide AND tall viewports (desktops/tablets) it's a
// centered window whose iframe keeps the game's aspect ratio; on phones (either
// orientation) it goes fullscreen, covering iOS safe areas. `game` is null when
// closed.
//
// `url` overrides the game's own launch URL, and `season` names the variant it
// opens — both come from the game page's launcher, since a seasonal variant is
// a separate game on the RGS with its own launch URL. Every other caller passes
// neither and gets `game.url`.
export default function GameModal({ game, url, season, onClose }) {
  useEffect(() => {
    if (!game) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [game, onClose]);

  if (!game) return null;

  const ratio = game.aspectRatio ?? "16/9";
  const src = url ?? game.url;

  return (
    <div
      className="fixed inset-0 z-[9999] bg-black/85 backdrop-blur-sm win:flex win:items-center win:justify-center win:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={`${game.title} demo`}
      onClick={onClose}
    >
      <div
        className="game-modal-container absolute inset-0 flex flex-col overflow-hidden bg-panel-low shadow-2xl win:static win:inset-auto win:h-auto win:max-h-[90vh] win:rounded-2xl win:border win:border-line"
        style={{ '--game-ratio': ratio }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="game-modal-header flex min-h-11 shrink-0 items-center justify-between border-b border-line bg-bg/80">
          <span className="font-SpaceGrotesk text-[12px] uppercase tracking-[0.06em] text-accent">
            {game.title} · demo
            {/* The variant is named in the season's own colour, so the header
                says which build is running without a second chip. Only the
                seasonal options set it; "Standard" leaves the header alone. */}
            {season && (
              <span style={{ color: season.tint }}> · {season.label}</span>
            )}
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close game"
            className="b4w-btn b4w-btn--ghost b4w-btn--icon b4w-btn--sm"
          >
            <Close className="h-4 w-4" />
          </button>
        </div>

        <div className="game-iframe-wrapper relative flex-1 win:flex-none">
          <iframe
            // Keyed on the URL rather than the game id: a title's variants
            // share `game.id` and differ only in where they launch, so a key
            // that can't tell them apart would hold the old document on
            // screen if anything ever swapped one for the other in place.
            key={src}
            src={src}
            title={`${game.title} demo`}
            className="absolute inset-0 h-full w-full border-0"
            allow="autoplay; fullscreen; clipboard-write"
          />
        </div>
      </div>
    </div>
  );
}
