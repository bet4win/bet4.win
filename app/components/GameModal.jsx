"use client";
import { useEffect } from "react";

// Launches a game. On wide AND tall viewports (desktops/tablets) it's a
// centered window whose iframe keeps the game's aspect ratio; on phones (either
// orientation) it goes fullscreen, covering iOS safe areas. `game` is null when
// closed.
export default function GameModal({ game, onClose }) {
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

  return (
    <div
      className="fixed inset-0 z-[9999] bg-black/85 backdrop-blur-sm win:flex win:items-center win:justify-center win:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={`${game.title} demo`}
      onClick={onClose}
    >
      <div
        className="game-modal-container absolute inset-0 flex flex-col overflow-hidden bg-panel-low shadow-2xl win:static win:inset-auto win:h-auto win:max-h-[90vh] win:rounded-xl win:border win:border-line"
        style={{ '--game-ratio': ratio }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="game-modal-header flex min-h-11 shrink-0 items-center justify-between border-b border-line bg-bg/80">
          <span className="font-SpaceGrotesk text-[12px] uppercase tracking-[0.06em] text-cyan">
            {game.title} · demo
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close game"
            className="flex h-7 w-7 items-center justify-center rounded text-muted transition-colors hover:bg-panel hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        <div className="game-iframe-wrapper relative flex-1 win:flex-none">
          <iframe
            key={game.id}
            src={game.url}
            title={`${game.title} demo`}
            className="absolute inset-0 h-full w-full border-0"
            allow="autoplay; fullscreen; clipboard-write"
          />
        </div>
      </div>
    </div>
  );
}
