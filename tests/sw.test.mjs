/* Test del service worker: allowlist esplicita e routing per rotta.
   Carica sw.js in un contesto finto (self/caches/registration). */
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const src = readFileSync(path.join(here, "..", "sw.js"), "utf8");

function bootSw() {
  const listeners = {};
  const self = {
    location: { href: "https://example.test/app/sw.js", origin: "https://example.test" },
    registration: { scope: "https://example.test/app/" },
    addEventListener: (n, f) => { listeners[n] = f; },
    skipWaiting: async () => {}, clients: { claim: async () => {} },
  };
  const ctx = { self, URL, Set, Promise, caches: { open: async () => ({ addAll: async () => {} , match: async () => undefined, put: async () => {} }), keys: async () => [] }, fetch: async () => ({ ok: true, clone() { return this; } }) };
  ctx.globalThis = ctx;
  vm.createContext(ctx);
  vm.runInContext(src, ctx);
  return { self, listeners };
}

test("PRECACHE generata: contiene solo asset versionati, pagine, icone, manifest", () => {
  const m = src.match(/const PRECACHE = (\[[\s\S]*?\]);/);
  assert.ok(m, "blocco PRECACHE presente");
  const list = JSON.parse(m[1]);
  assert.ok(list.length > 10);
  for (const p of list) {
    assert.ok(/^\.\/(manifest\.webmanifest|[a-z]+\.html|icons\/.+\.png|assets\/(?:[a-z0-9-]+-v\d+\.(?:js|css)|md\.js|plancia\.js))$/.test(p), "voce inattesa: " + p);
  }
  assert.ok(list.includes("./kit.html") && list.includes("./index.html"));
});

test("routing: solo allowlist; API, SEO e sconosciuti NON vengono intercettati", () => {
  const { self } = bootSw();
  const r = self.__lccRoute;
  assert.equal(r("/app/kit.html"), "page");
  assert.equal(r("/app/"), "page");
  assert.equal(r("/app/index.html"), "page");
  assert.equal(r("/app/manifest.webmanifest"), "asset");
  assert.equal(r("/v1/complete"), null);
  assert.equal(r("/api/auth/sign-in/email"), null);
  assert.equal(r("/stipendi/account-executive-milano"), null);
  assert.equal(r("/app/assets/qualcosa-non-in-lista.js"), null);
});

test("routing: gli asset versionati referenziati dalle pagine sono in allowlist come 'asset'", () => {
  const { self } = bootSw();
  const m = src.match(/const PRECACHE = (\[[\s\S]*?\]);/); const list = JSON.parse(m[1]);
  const js = list.filter((p) => /-v\d+\.js$/.test(p));
  assert.ok(js.length >= 5);
  for (const p of js) assert.equal(self.__lccRoute(p.replace(/^\.\//, "/app/")), "asset", p);
});

test("registra install/activate/fetch", () => {
  const { listeners } = bootSw();
  assert.ok(listeners.install && listeners.activate && listeners.fetch);
});
