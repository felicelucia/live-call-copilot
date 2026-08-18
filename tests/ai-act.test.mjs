/* AI Act art. 50 (Modulo 2): disclosure di interazione + marcatura machine-readable
   dell'export + checkbox di veridicità; deny-list marketing su tutte le pagine. */
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (p) => readFileSync(path.join(root, p), "utf8");
const latest = (prefix) => readdirSync(path.join(root, "assets")).filter((f) => f.startsWith(prefix) && /-v\d+\.js$/.test(f)).sort((a, b) => Number(a.match(/-v(\d+)/)[1]) - Number(b.match(/-v(\d+)/)[1])).pop();

test("disclosure di interazione presente in app, kit, practice, storie", () => {
  assert.match(read("assets/" + latest("app-v")), /Stai interagendo con un sistema di IA/);
  assert.match(read("assets/" + latest("kit-v")), /Stai interagendo con un sistema di IA/);
  assert.match(read("assets/" + latest("practice-v")), /intervistatore è una simulazione IA/);
  assert.match(read("assets/" + latest("storie-v")), /sistema di IA/);
  assert.match(read("practice.html"), /AI simulation/);
});

test("export PDF: marker machine-readable (meta generator, ai-generated, data-ai-mark) + checkbox di veridicità obbligatoria", () => {
  const kit = read("assets/" + latest("kit-v"));
  assert.match(kit, /<meta name="generator" content="\$\{BRAND\} — AI-assisted draft">/);
  assert.match(kit, /<meta name="ai-generated" content="true">/);
  assert.match(kit, /data-ai-mark="true"/);
  assert.match(kit, /if \(!\$\("truthChk"\)\.checked\)/, "il download deve fermarsi senza conferma");
  assert.match(read("kit.html"), /id="truthChk"/);
});

test("deny-list marketing: nessuna frase da intermediazione nelle pagine/copy", () => {
  const files = [...readdirSync(root).filter((f) => f.endsWith(".html")), ...readdirSync(path.join(root, "assets")).filter((f) => /-v\d+\.js$/.test(f)).map((f) => "assets/" + f)];
  const deny = /(troviamo lavoro per te|ti abbiniamo|abbinat[oaie] a te|reverse recruit|gestiamo la tua ricerca|ti portiamo ai colloqui|candidature gestite|paghi solo se|opportunit[àa] nascost|posizione nascosta|we find you a job|we match you|matched to you|hidden opportunity)/i;
  for (const f of files) assert.doesNotMatch(read(f), deny, f);
});

test("copy 'Interview Sprint' a prezzo fisso, niente success fee", () => {
  const app = read("assets/" + latest("app-v"));
  assert.match(app, /Interview Sprint/);
  assert.doesNotMatch(app, /success fee|paghi solo se/i);
});
