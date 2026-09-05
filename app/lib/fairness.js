// Browser-side client for the RGS fairness API. Mirrors the obfuscation and
// AUTH→verifyFairness flow used in the game apps (ui/lib/components/src/lib/api).
// The BFF reflects our Origin and allows credentialed CORS, so this runs
// directly from the page — no server proxy needed. A launch token (DEMO) is
// exchanged for a JWT via AUTH, then used to call verifyFairness.
import { games } from "@/data/games";

const RGS_URL = "https://remote-gaming-dev.systems.bet4.win/api";

function obfuscate(payload) {
  const bytes = new TextEncoder().encode(JSON.stringify(payload));
  let bin = "";
  bytes.forEach((b) => (bin += String.fromCharCode(b)));
  return JSON.stringify({ data: btoa(bin) });
}

function deobfuscate(value) {
  const env = typeof value === "string" ? JSON.parse(value) : value;
  if (env && typeof env === "object" && "data" in env && Object.keys(env).length === 1) {
    const bytes = Uint8Array.from(atob(env.data), (c) => c.charCodeAt(0));
    return deobfuscate(JSON.parse(new TextDecoder().decode(bytes)));
  }
  return env;
}

async function postBFF(payload, token) {
  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest",
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
    headers["X-RGS_SESSION_TOKEN"] = token;
  }
  const res = await fetch(RGS_URL, {
    method: "POST",
    headers,
    body: obfuscate(payload),
  });
  return deobfuscate(await res.json());
}

const jwtCache = new Map();

async function authForGame(gameId, launchVars) {
  if (jwtCache.has(gameId)) return jwtCache.get(gameId);
  const r = await postBFF({ cmd: "AUTH", game_id: gameId, launch_vars: launchVars });
  const jwt = r?.AUTH?.jwt_token;
  if (!jwt) throw new Error(r?.ALERT?.message || "Could not start a demo session.");
  jwtCache.set(gameId, jwt);
  return jwt;
}

// Content-addressed cache: identical inputs (game + seeds + nonce + params)
// resolve from cache instead of hitting the API again. We cache the in-flight
// promise so concurrent duplicate clicks share one request.
const verifyCache = new Map();
const cacheKey = (o) =>
  JSON.stringify({ g: o.gameId, c: o.clientSeed, s: o.serverSeed, n: o.nonce, p: o.params });

export async function verifyFairness(args) {
  const key = cacheKey(args);
  if (verifyCache.has(key)) return verifyCache.get(key);

  const { gameId, launchVars, clientSeed, serverSeed, nonce, params } = args;
  const run = (async () => {
    const jwt = await authForGame(gameId, launchVars);
    const r = await postBFF(
      { cmd: "FAIRNESS", method: "verifyFairness", clientSeed, serverSeed, gameId, nonce, params },
      jwt,
    );
    if (r?.ALERT?.fatal) throw new Error(r.ALERT.message || "Verification failed.");
    return r;
  })();

  verifyCache.set(key, run);
  try {
    return await run;
  } catch (err) {
    verifyCache.delete(key); // let a failed lookup be retried
    throw err;
  }
}

// Turn a raw verifyFairness result into display rows — a single multiplier where
// the game has one, falling back to index/number lists only where required.
const mult = (v) => `${Number(v).toFixed(2)}×`;

export function formatOutcome(title, r) {
  if (!r || typeof r !== "object") return [];
  switch (title) {
    case "Crash":
      return [{ label: "Crash point", value: mult(r.crashPoint), primary: true }];
    case "Limbo":
    case "Wheel":
    case "Diamonds":
      return [{ label: "Multiplier", value: mult(r.multiplier), primary: true }];
    case "Plinko":
      return [
        { label: "Multiplier", value: mult(r.multiplier), primary: true },
      ];
    case "Dice":
      return [{ label: "Roll", value: Number(r.rolledNumber).toFixed(2), primary: true }];
    case "Mines":
      return [{ label: "Mine positions", value: (r.minePositions ?? []).join(", ") }];
    case "Keno":
      return [{ label: "Drawn numbers", value: (r.finalDrawnNumbers ?? []).join(", ") }];
    case "Dragon":
      return [
        {
          label: "Safe tiles per row",
          value: (r.revealedEgPositions ?? [])
            .map((row, i) => `R${i + 1}: ${row.join("/")}`)
            .join("   "),
        },
      ];
    default:
      if (r.multiplier != null)
        return [{ label: "Multiplier", value: mult(r.multiplier), primary: true }];
      return Object.entries(r).map(([k, v]) => ({
        label: humanize(k),
        value: Array.isArray(v) ? v.join(", ") : String(v),
      }));
  }
}

function humanize(k) {
  return k
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/^./, (c) => c.toUpperCase());
}

// Capitalize a string option for display while keeping its raw value.
export const labelFor = (o) =>
  typeof o === "string" ? o.charAt(0).toUpperCase() + o.slice(1) : o;

// Per-game parameter schema (mirrors each game's *ParamsComponent in the ui repo).
export const PARAM_SCHEMAS = {
  Mines: [{ name: "mines", label: "Mines", type: "number", min: 1, max: 24, step: 1, default: 3 }],
  Plinko: [
    { name: "risk", label: "Risk", type: "select", options: ["low", "medium", "high"], default: "medium" },
    { name: "rows", label: "Rows", type: "number", min: 8, max: 16, step: 1, default: 16 },
  ],
  Wheel: [
    { name: "risk", label: "Risk", type: "select", options: ["low", "medium", "high"], default: "medium" },
    { name: "segments", label: "Segments", type: "select", options: [10, 20, 30, 40, 50], default: 30, numeric: true },
  ],
  Dice: [
    { name: "target", label: "Target", type: "number", min: 0.01, max: 99.99, step: 0.01, default: 50 },
    { name: "condition", label: "Condition", type: "select", options: ["over", "under"], default: "over" },
  ],
  Limbo: [{ name: "multiplier", label: "Target multiplier", type: "number", min: 1.01, step: 0.01, default: 2 }],
  Dragon: [
    { name: "risk", label: "Difficulty", type: "select", options: ["easy", "medium", "hard", "expert", "master"], default: "medium" },
  ],
  Keno: [
    { name: "risk", label: "Risk", type: "select", options: ["classic", "low", "medium", "high"], default: "classic" },
    { name: "pickedNumbers", label: "Picks (1–40, comma-separated)", type: "text", default: "1,2,3,4,5", list: true },
  ],
  Crash: [],
  Diamonds: [],
};

// Build the list of verifiable games from data/games.js (live games with a real
// game id), parsing launch vars straight out of each launch URL.
export function getVerifiableGames() {
  return games
    .filter((g) => g.status === "active")
    .map((g) => {
      const q = new URL(g.url).searchParams;
      return {
        title: g.title,
        gameId: q.get("game"),
        launchVars: { operator: q.get("operator"), token: q.get("token"), site: q.get("site") },
        params: PARAM_SCHEMAS[g.title] ?? [],
      };
    })
    .filter((g) => g.gameId && g.gameId !== "{}");
}

// Convert a field's raw string value into the typed value the API expects.
export function coerceParam(field, raw) {
  if (field.list) {
    return String(raw)
      .split(",")
      .map((s) => parseInt(s.trim(), 10))
      .filter((n) => Number.isFinite(n));
  }
  if (field.type === "number" || field.numeric) return Number(raw);
  return raw;
}

export function randomHex(bytes = 32) {
  const a = new Uint8Array(bytes);
  crypto.getRandomValues(a);
  return Array.from(a, (b) => b.toString(16).padStart(2, "0")).join("");
}
