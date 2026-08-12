"use client";
import { useEffect, useMemo, useState } from "react";
import {
  getVerifiableGames,
  verifyFairness,
  coerceParam,
  randomHex,
  formatOutcome,
  labelFor,
} from "@/app/lib/fairness";
import { Refresh } from "./Icons";

const DEFAULT_SERVER_SEED =
  "f9e2d1c3b4a5968778695a4b3c2d1e0f1122334455667788990011223344556677";

const inputCls =
  "w-full !rounded-md border border-line bg-bg px-3 py-2 font-JetBrainsMono text-[13px] text-ink placeholder:text-faint focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan/60";
const labelCls =
  "mb-1 block font-JetBrainsMono text-[11px] uppercase tracking-[0.05em] text-muted";

function defaultsFor(game) {
  const out = {};
  (game?.params ?? []).forEach((f) => (out[f.name] = f.default));
  return out;
}

export default function FairnessVerifier() {
  const games = useMemo(() => getVerifiableGames(), []);
  const initialIdx = Math.max(
    0,
    games.findIndex((g) => g.title === "Mines"),
  );

  const [idx, setIdx] = useState(initialIdx);
  const game = games[idx];

  const [clientSeed, setClientSeed] = useState("player-demo-seed");
  const [serverSeed, setServerSeed] = useState(DEFAULT_SERVER_SEED);
  const [nonce, setNonce] = useState(1);
  const [params, setParams] = useState(() => defaultsFor(games[initialIdx]));

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    setParams(defaultsFor(game));
    setResult(null);
    setError(null);
  }, [idx]); // eslint-disable-line react-hooks/exhaustive-deps

  async function onVerify(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const built = {};
      game.params.forEach((f) => {
        built[f.name] = coerceParam(f, params[f.name] ?? f.default);
      });
      const r = await verifyFairness({
        gameId: game.gameId,
        launchVars: game.launchVars,
        clientSeed,
        serverSeed,
        nonce: Number(nonce),
        params: built,
      });
      setResult(r);
    } catch (err) {
      setError(err?.message || "Verification failed.");
    } finally {
      setLoading(false);
    }
  }

  const out = result?.verifyFairnessResponse;
  const rows = out ? formatOutcome(game.title, out.result) : [];

  return (
    <form
      onSubmit={onVerify}
      className="relative overflow-hidden rounded-xl border border-line bg-panel-low p-5 shadow-2xl"
    >
      <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-cyan to-violet" />
      <div className="mb-4 flex items-center justify-between border-b border-line pb-3 font-JetBrainsMono text-[12px] text-muted">
        <span>Verification terminal</span>
        <span className="text-faint">live · SHA-256</span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2">
          <label className={labelCls} htmlFor="fv-game">Game</label>
          <select
            id="fv-game"
            value={idx}
            onChange={(e) => setIdx(Number(e.target.value))}
            className={inputCls}
          >
            {games.map((g, i) => (
              <option key={g.gameId} value={i}>
                {g.title}
              </option>
            ))}
          </select>
        </div>

        <div className="col-span-2">
          <label className={labelCls} htmlFor="fv-client">Client seed</label>
          <input id="fv-client" className={inputCls} value={clientSeed}
            onChange={(e) => setClientSeed(e.target.value)} spellCheck={false} />
        </div>

        <div className="col-span-2">
          <label className={labelCls} htmlFor="fv-server">Server seed (revealed)</label>
          <div className="flex items-stretch gap-2">
            <input id="fv-server" className={inputCls} value={serverSeed}
              onChange={(e) => setServerSeed(e.target.value)} spellCheck={false} />
            <button type="button" onClick={() => setServerSeed(randomHex())}
              aria-label="Randomize server seed" title="Randomize server seed"
              className="flex aspect-square w-[48px] h-[48px] shrink-0 items-center justify-center !rounded-md border border-line text-muted transition-colors hover:bg-panel hover:text-cyan focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan/60">
              <Refresh className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div>
          <label className={labelCls} htmlFor="fv-nonce">Nonce</label>
          <input id="fv-nonce" type="number" min={0} className={inputCls} value={nonce}
            onChange={(e) => setNonce(e.target.value)} />
        </div>

        {game.params.map((f) => (
          <div key={f.name}>
            <label className={labelCls} htmlFor={`fv-${f.name}`}>{f.label}</label>
            {f.type === "select" ? (
              <select id={`fv-${f.name}`} className={inputCls}
                value={params[f.name] ?? f.default}
                onChange={(e) => setParams((p) => ({ ...p, [f.name]: e.target.value }))}>
                {f.options.map((o) => (
                  <option key={o} value={o}>{labelFor(o)}</option>
                ))}
              </select>
            ) : (
              <input id={`fv-${f.name}`} className={inputCls}
                type={f.type === "number" ? "number" : "text"}
                min={f.min} max={f.max} step={f.step}
                value={params[f.name] ?? f.default}
                onChange={(e) => setParams((p) => ({ ...p, [f.name]: e.target.value }))} />
            )}
          </div>
        ))}
      </div>

      <button type="submit" disabled={loading}
        className="!mt-4 w-full !rounded-md b4w-sheen bg-cyan px-4 py-2.5 font-JetBrainsMono text-[12px] font-semibold uppercase tracking-[0.04em] !text-black transition-colors hover:bg-cyan/85 disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-bg">
        {loading ? "Verifying…" : "Verify fairness"}
      </button>

      {/* Output */}
      {(out || error) && (
        <div className="mt-4 border-t border-line pt-4 font-JetBrainsMono text-[13px]">
          {error ? (
            <p className="text-[#ffb4ab]">⚠ {error}</p>
          ) : (
            <>
              <p className="mb-3 flex items-center gap-2 text-cyan">
                <span>✓</span>
                {result.result || "Fairness verified"}
              </p>
              <div className="flex flex-col gap-2">
                {rows.map((row) =>
                  row.primary ? (
                    <div key={row.label} className="flex items-baseline gap-3">
                      <span className="text-[11px] uppercase tracking-[0.05em] text-faint">
                        {row.label}
                      </span>
                      <span className="font-SpaceGrotesk text-[1.7rem] font-bold !text-ink">
                        {row.value}
                      </span>
                    </div>
                  ) : (
                    <div key={row.label} className="flex gap-3">
                      <span className="w-32 shrink-0 text-faint">{row.label}</span>
                      <span className="break-all text-ink">{row.value}</span>
                    </div>
                  ),
                )}
              </div>
            </>
          )}
        </div>
      )}
      <p className="!mt-3 !mb-0 font-SpaceGrotesk text-[12px] text-faint">
        Recomputed from the seeds above by the live RGS — change the nonce and
        re-run to see a different, deterministic outcome.
      </p>
    </form>
  );
}
