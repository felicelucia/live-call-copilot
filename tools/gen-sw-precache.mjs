#!/usr/bin/env node
/* Genera l'allowlist di precache del service worker leggendo le pagine HTML:
   ogni asset versionato (-vN.js/.css) referenziato + pagine + icone + manifest.
   Riscrive il blocco tra i marker in sw.js. Uso: node tools/gen-sw-precache.mjs
   (da rilanciare quando si aggiunge/rinomina un asset; il commit lo include). */
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const pages = readdirSync(root).filter((f) => f.endsWith(".html")).sort();
const assets = new Set();
for (const p of pages) {
  const html = readFileSync(path.join(root, p), "utf8");
  for (const m of html.matchAll(/(?:src|href)="(assets\/[a-z0-9-]+-v\d+\.(?:js|css))"/g)) assets.add("./" + m[1]);
  // moduli importati staticamente dai -vN (md.js, plancia.js) restano NON versionati: li includiamo dai file
}
for (const f of readdirSync(path.join(root, "assets"))) if (/^(md|plancia)\.js$/.test(f)) assets.add("./assets/" + f);
const icons = readdirSync(path.join(root, "icons")).filter((f) => /\.png$/.test(f)).map((f) => "./icons/" + f);
const list = ["./manifest.webmanifest", ...pages.map((p) => "./" + p), ...icons, ...[...assets].sort()];
const sw = path.join(root, "sw.js");
let src = readFileSync(sw, "utf8");
const start = "/* @generated-precache-start */", end = "/* @generated-precache-end */";
const i = src.indexOf(start), j = src.indexOf(end);
if (i < 0 || j < 0) throw new Error("marker mancanti in sw.js");
const block = start + "\nconst PRECACHE = " + JSON.stringify(list, null, 2) + ";\n" + end;
src = src.slice(0, i) + block + src.slice(j + end.length);
writeFileSync(sw, src);
console.log("precache:", list.length, "voci");
