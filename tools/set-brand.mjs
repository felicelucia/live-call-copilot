#!/usr/bin/env node
/* Cambio nome brand nei file STATICI (HTML/manifest: title, OG, testo). Il JS
   legge LCC.BRAND (assets/lcc-core-vN.js) e il backend BRAND_NAME (env).
   Uso: node tools/set-brand.mjs "VecchioNome" "NuovoNome" — poi aggiorna la
   riga BRAND nel nucleo e BRAND_NAME sul container. */
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
const [oldName, newName] = process.argv.slice(2);
if (!oldName || !newName) { console.error("uso: set-brand.mjs <vecchio> <nuovo>"); process.exit(1); }
let n = 0;
for (const f of [...readdirSync(".").filter((x) => x.endsWith(".html")), "manifest.webmanifest"]) {
  const s = readFileSync(f, "utf8"); if (!s.includes(oldName)) continue;
  writeFileSync(f, s.split(oldName).join(newName)); n++;
}
console.log("file aggiornati:", n);
