/* Test del nucleo condiviso (assets/lcc-core-v2.js) — zero dipendenze:
   `node --test tests/`. Simula localStorage/sessionStorage/fetch e verifica:
   registro storage + purge totale, migrazione legacy, opt-in reale,
   helper API su 204/401/500/timeout/offline. */
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";
import { fileURLToPath } from "node:url";
import path from "node:path";

const here = path.dirname(fileURLToPath(import.meta.url));
const src = readFileSync(path.join(here, "..", "assets", "lcc-core-v2.js"), "utf8");

class MemStorage {
  #m = new Map();
  get length() { return this.#m.size; }
  key(i) { return [...this.#m.keys()][i] ?? null; }
  getItem(k) { return this.#m.has(k) ? this.#m.get(k) : null; }
  setItem(k, v) { this.#m.set(String(k), String(v)); }
  removeItem(k) { this.#m.delete(k); }
  clear() { this.#m.clear(); }
  keys() { return [...this.#m.keys()]; }
}

function boot({ local = {}, session = {}, fetchImpl } = {}) {
  const localStorage = new MemStorage(), sessionStorage = new MemStorage();
  for (const [k, v] of Object.entries(local)) localStorage.setItem(k, v);
  for (const [k, v] of Object.entries(session)) sessionStorage.setItem(k, v);
  const win = { localStorage, sessionStorage, fetch: fetchImpl, AbortController, DOMException, setTimeout, clearTimeout, Object, Error, Number, Promise, TextDecoder, TextEncoder, JSON };
  win.window = win;
  vm.createContext(win);
  vm.runInContext(src, win);
  return { LCC: win.LCC, localStorage, sessionStorage };
}

test("purge totale: ogni namespace nostro sparisce da ENTRAMBI gli storage, il resto resta", () => {
  const { LCC, localStorage, sessionStorage } = boot({
    local: { v5_key_gemini: "AIza-x", v7_cv: "cv", prac_key_groq: "gsk", lcc_kit_draft: "annuncio", v5_remember: "1", altro_sito: "keep" },
    session: { v6_promodel: "auto", prac_role: "PM", lcc_kit_prefill: "{}", theirs: "keep" },
  });
  const n = LCC.purgeAll();
  assert.ok(n >= 8, "deve aver rimosso tutte le chiavi nostre: " + n);
  assert.deepEqual(localStorage.keys(), ["altro_sito"]);
  assert.deepEqual(sessionStorage.keys(), ["theirs"]);
});

test("migrazione legacy senza opt-in: le copie in localStorage passano in sessione e spariscono", () => {
  const { LCC, localStorage, sessionStorage } = boot({ local: { v5_key_openai: "sk-legacy", prac_cv: "cv-legacy", other: "x" } });
  // la migrazione gira al boot
  assert.equal(localStorage.getItem("v5_key_openai"), null);
  assert.equal(localStorage.getItem("prac_cv"), null);
  assert.equal(localStorage.getItem("other"), "x");
  assert.equal(sessionStorage.getItem("v5_key_openai"), "sk-legacy");
  assert.equal(sessionStorage.getItem("prac_cv"), "cv-legacy");
  assert.equal(LCC.hasOptIn(), false);
});

test("con opt-in valido nulla viene migrato e localStorage si legge", () => {
  const { LCC, localStorage } = boot({ local: { v5_remember: "1", v5_key_openai: "sk" } });
  assert.equal(localStorage.getItem("v5_key_openai"), "sk");
  assert.equal(LCC.store.get("v5_key_openai"), "sk");
});

test("senza opt-in localStorage NON si legge nemmeno se qualcuno ci scrive dopo", () => {
  const { LCC, localStorage } = boot();
  localStorage.setItem("v5_key_openai", "sk-scritto-dopo");
  assert.equal(LCC.store.get("v5_key_openai"), null);
  LCC.store.set("v5_lang", "it");
  assert.equal(localStorage.getItem("v5_lang"), null, "senza opt-in si scrive solo in sessione");
});

test("setOptIn(false) rimuove ogni copia persistente nostra", () => {
  const { LCC, localStorage } = boot({ local: { v5_remember: "1", v5_key_x: "k", prac_role: "r", keep: "1" } });
  LCC.store.setOptIn(false);
  assert.deepEqual(localStorage.keys(), ["keep"]);
});

const mkRes = (status, body, headers = {}) => ({
  ok: status >= 200 && status < 300, status,
  headers: { get: (h) => headers[h.toLowerCase()] ?? null },
  json: async () => body,
});

test("api: 2xx passa, 204 → json() null", async () => {
  const { LCC } = boot({ fetchImpl: async () => mkRes(204) });
  const r = await LCC.api("/x", { method: "DELETE" });
  assert.equal(r.status, 204);
  assert.equal(await LCC.api.json("/x", { method: "DELETE" }), null);
});

test("api: 401 lancia ApiError con status e dettaglio del server", async () => {
  const { LCC } = boot({ fetchImpl: async () => mkRes(401, { error: "unauthenticated" }) });
  await assert.rejects(LCC.api("/v1/profile", { method: "DELETE" }), (e) => e.name === "ApiError" && e.status === 401 && e.message === "unauthenticated");
});

test("api: 500 lancia (mai successo silenzioso)", async () => {
  const { LCC } = boot({ fetchImpl: async () => mkRes(500, {}) });
  await assert.rejects(LCC.api("/v1/kits", { method: "DELETE" }), (e) => e.status === 500 && e.message === "HTTP 500");
});

test("api: 429 espone retryAfter", async () => {
  const { LCC } = boot({ fetchImpl: async () => mkRes(429, { error: "rate_limited" }, { "retry-after": "7" }) });
  await assert.rejects(LCC.api("/v1/x"), (e) => e.status === 429 && e.retryAfter === 7);
});

test("api: offline (fetch rifiuta) → ApiError 'network'", async () => {
  const { LCC } = boot({ fetchImpl: async () => { throw new TypeError("Failed to fetch"); } });
  await assert.rejects(LCC.api("/v1/x"), (e) => e.name === "ApiError" && e.message === "network" && e.status === 0);
});

test("api: timeout → ApiError 'timeout' e la richiesta viene abortita", async () => {
  let aborted = false;
  const fetchImpl = (_u, init) => new Promise((_res, rej) => {
    init.signal.addEventListener("abort", () => { aborted = true; const e = new Error("aborted"); e.name = "AbortError"; rej(e); });
  });
  const { LCC } = boot({ fetchImpl });
  await assert.rejects(LCC.api("/v1/slow", { timeoutMs: 30 }), (e) => e.message === "timeout");
  assert.equal(aborted, true);
});

/* ── stream SSE ── */
function sseBody(chunks) {
  let i = 0;
  return { getReader: () => ({ read: async () => i < chunks.length ? { done: false, value: new TextEncoder().encode(chunks[i++]) } : { done: true } }) };
}
const mkStream = (status, chunks, headers = {}) => ({ ok: status < 300, status, headers: { get: (h) => headers[h] ?? null }, json: async () => ({ error: "x" }), body: sseBody(chunks) });

test("stream: heartbeat ': ping' e righe vuote ignorati, eventi consegnati", async () => {
  const { LCC } = boot({ fetchImpl: async () => mkStream(200, [": ping\n\n", 'data: {"type":"delta","text":"ci"}\n\n', ": ping\n", 'data: {"type":"delta","text":"ao"}\ndata: [DONE]\n\n']) });
  const got = [];
  const r = await LCC.stream("/v1/x", { onEvent: (e) => got.push(e.text) });
  assert.deepEqual(got, ["ci", "ao"]);
  assert.equal(r.partial, false); assert.equal(r.events, 2);
});

test("stream: 429 prima dei dati → ApiError con retryAfter", async () => {
  const { LCC } = boot({ fetchImpl: async () => mkStream(429, [], { "retry-after": "12" }) });
  await assert.rejects(LCC.stream("/v1/x"), (e) => e.status === 429 && e.retryAfter === 12);
});

test("stream: interrotto DOPO dati → risultato parziale (non eccezione)", async () => {
  let n = 0;
  const body = { getReader: () => ({ read: async () => { n++; if (n === 1) return { done: false, value: new TextEncoder().encode('data: {"t":1}\n') }; const e = new Error("net"); e.name = "TypeError"; throw e; } }) };
  const { LCC } = boot({ fetchImpl: async () => ({ ok: true, status: 200, headers: { get: () => null }, body }) });
  const r = await LCC.stream("/v1/x", { onEvent: () => {} });
  assert.equal(r.partial, true); assert.equal(r.reason, "network"); assert.equal(r.events, 1);
});

test("stream: timeout primo-token senza dati → ApiError timeout_first_token", async () => {
  const fetchImpl = (_u, init) => new Promise((_res, rej) => init.signal.addEventListener("abort", () => { const e = new Error("a"); e.name = "AbortError"; rej(e); }));
  const { LCC } = boot({ fetchImpl });
  await assert.rejects(LCC.stream("/v1/x", { firstTokenMs: 20, totalMs: 0 }), (e) => e.message === "timeout_first_token");
});

test("abortScope: la nuova richiesta annulla la precedente", async () => {
  const { LCC } = boot();
  const a = LCC.abortScope("k"); const b = LCC.abortScope("k");
  assert.equal(a.signal.aborted, true); assert.equal(b.signal.aborted, false);
});
