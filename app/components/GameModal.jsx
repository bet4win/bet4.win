"use client";
import { useEffect } from "react";
import { Close, ExternalLink } from "./Icons";

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
          {/* truncate, because the controls beside it are now two buttons wide
              and the windowed container derives its width from a header that is
              assumed to be exactly 2.75rem tall (see .game-modal-container). A
              long title wrapping to a second line would silently distort the
              game's aspect ratio. */}
          <span className="min-w-0 truncate font-SpaceGrotesk text-[12px] uppercase tracking-[0.06em] text-accent">
            {game.title} · demo
            {/* The variant is named in the season's own colour, so the header
                says which build is running without a second chip. Only the
                seasonal options set it; "Standard" leaves the header alone. */}
            {season && (
              <span style={{ color: season.tint }}> · {season.label}</span>
            )}
          </span>
          <div className="flex shrink-0 items-center gap-1">
            {/* An anchor, not a button that calls window.open: the browser only
                treats a new tab as wanted if it comes from a real navigation, so
                a popup blocker swallows the scripted version on some setups —
                and this way cmd-click, middle-click and "open in new window"
                all behave. The modal closes on the way out, because leaving it
                running behind the new tab means two copies of the same demo
                talking to the RGS at once. */}
            <a
              href={src}
              target="_blank"
              rel="noopener noreferrer"
              onClick={onClose}
              aria-label={`Open ${game.title} demo in a new tab`}
              className="b4w-btn b4w-btn--ghost b4w-btn--icon b4w-btn--sm"
            >
              <ExternalLink className="h-4 w-4" />
            </a>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close game"
              className="b4w-btn b4w-btn--ghost b4w-btn--icon b4w-btn--sm"
            >
              <Close className="h-4 w-4" />
            </button>
          </div>
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
