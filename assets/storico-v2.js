import { renderMd } from "./md.js";

const $ = (id) => document.getElementById(id);
const BACKEND = location.protocol.startsWith("http") ? location.origin : "http://127.0.0.1:8787";
const api = (p, o = {}) => fetch(BACKEND + p, Object.assign({ credentials: "include" }, o));

const T = {
  it: {
    brandSub: "Storico e prontezza", toKit: "✨ Kit", openApp: "Apri l'app per accedere",
    needLogin: "Lo storico e il punteggio di prontezza vivono sul tuo account: accedi per vederli.",
    readyH: "La tua prontezza",
    comp: { training: "Allenamento", profile: "Profilo", kits: "Kit generati", recency: "Attività recente" },
    kitsH: "Kit salvati", exportAll: "⬇ Esporta tutto", deleteAll: "🗑 Cancella tutto",
    back: "← Torna allo storico", tabCv: "CV su misura", tabMail: "Mail", tabQ: "Domande",
    open: "Apri", regen: "↻", regenTitle: "Rigenera il kit per questo annuncio", exportOne: "⬇", deleteOne: "🗑",
    empty: "Nessun kit salvato ancora — genera un kit e spunta «salva» per costruire la tua prontezza provata.",
    emptyCta: "Genera il primo kit →",
    confirmOne: "Eliminare questo kit? L'operazione è definitiva.",
    confirmAll: "Cancellare TUTTO lo storico? L'operazione è definitiva.",
    deleted: "Eliminato.", deletedAll: "Storico cancellato.",
    foot: "Contenuti cifrati a riposo su server UE · esportabili e cancellabili in ogni momento · rimossi dopo 24 mesi.",
    of: "su", err: "Errore: ",
  },
  en: {
    brandSub: "History & readiness", toKit: "✨ Kit", openApp: "Open the app to sign in",
    needLogin: "Your history and readiness score live on your account: sign in to see them.",
    readyH: "Your readiness",
    comp: { training: "Training", profile: "Profile", kits: "Kits generated", recency: "Recent activity" },
    kitsH: "Saved kits", exportAll: "⬇ Export all", deleteAll: "🗑 Delete all",
    back: "← Back to history", tabCv: "Tailored CV", tabMail: "Email", tabQ: "Questions",
    open: "Open", regen: "↻", regenTitle: "Regenerate the kit for this ad", exportOne: "⬇", deleteOne: "🗑",
    empty: "No saved kits yet — generate a kit and tick “save” to build your proven readiness.",
    emptyCta: "Generate your first kit →",
    confirmOne: "Delete this kit? This cannot be undone.",
    confirmAll: "Delete your ENTIRE history? This cannot be undone.",
    deleted: "Deleted.", deletedAll: "History deleted.",
    foot: "Content encrypted at rest on EU servers · exportable and deletable anytime · removed after 24 months.",
    of: "of", err: "Error: ",
  },
};
let LANG = (navigator.language || "en").toLowerCase().startsWith("it") ? "it" : "en";
const t = (k) => T[LANG][k] ?? k;
function applyLang() {
  document.documentElement.lang = LANG;
  document.querySelectorAll("[data-i]").forEach((el) => (el.textContent = t(el.getAttribute("data-i"))));
}
$("langSeg").addEventListener("click", (e) => {
  const b = e.target.closest("button"); if (!b) return;
  LANG = b.getAttribute("data-lang");
  [...$("langSeg").children].forEach((c) => c.classList.toggle("on", c === b));
  applyLang(); loadAll();
});

const esc = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
function setK(m, c) { $("kStatus").textContent = m; $("kStatus").className = "ds-status " + (c || ""); }

/* ── prontezza (stat-tile + barre per componente, una tinta, testo = identità) ── */
async function loadReadiness() {
  const r = await api("/v1/readiness");
  if (!r.ok) return false;
  const d = await r.json();
  $("readyNum").textContent = d.score;
  $("readyRole").textContent = d.role || "";
  const box = $("readyBreak"); box.innerHTML = "";
  for (const c of d.breakdown) {
    const div = document.createElement("div");
    div.className = "comp";
    div.innerHTML =
      `<div class="row1"><span class="lbl">${esc(t("comp")[c.key] || c.key)}</span>` +
      `<span class="pts">${c.points} ${t("of")} ${c.max}</span></div>` +
      `<div class="track"><div class="fill" style="width:${Math.round((c.points / c.max) * 100)}%"></div></div>` +
      `<div class="why">${esc(c.why)}</div>`;
    box.appendChild(div);
  }
  $("readyCard").style.display = "";
  return true;
}

/* ── lista kit ── */
let kits = [];
async function loadKits() {
  const r = await api("/v1/kits");
  if (!r.ok) return false;
  const d = await r.json();
  kits = d.kits || [];
  $("quota").textContent = `${d.used} / ${d.limit}`;
  const box = $("kitList"); box.innerHTML = "";
  if (!kits.length) {
    box.innerHTML = `<div class="empty">${esc(t("empty"))}<br><a href="kit.html">${esc(t("emptyCta"))}</a></div>`;
    $("exportAllBtn").style.display = "none"; $("deleteAllBtn").style.display = "none";
  } else {
    $("exportAllBtn").style.display = ""; $("deleteAllBtn").style.display = "";
    kits.forEach((k, i) => {
      const who = esc(k.role || "—") + (k.company ? " @ " + esc(k.company) : "");
      const models = k.meta?.models ? [...new Set(k.meta.models.filter(Boolean))].length : null;
      const row = document.createElement("div");
      row.className = "krow";
      row.innerHTML =
        `<div class="who"><b>${who}</b>` +
        `<div class="date">${new Date(k.createdAt).toLocaleDateString(LANG === "it" ? "it-IT" : "en-GB", { day: "numeric", month: "short", year: "numeric" })}` +
        (models ? ` · ${models} LLM` : "") + `</div></div>` +
        (k.meta?.allEu ? '<span class="ds-eu">EU</span>' : "") +
        `<button class="ds-btn ds-btn-ghost ds-btn-sm" data-open="${i}">${esc(t("open"))}</button>` +
        `<button class="ds-btn ds-btn-ghost ds-btn-sm" data-regen="${i}" title="${esc(t("regenTitle"))}">${t("regen")}</button>` +
        `<button class="ds-btn ds-btn-ghost ds-btn-sm" data-exp="${i}" title="export">${t("exportOne")}</button>` +
        `<button class="ds-btn ds-btn-ghost ds-btn-sm" data-del="${i}" title="delete">${t("deleteOne")}</button>`;
      box.appendChild(row);
    });
  }
  $("kitsCard").style.display = "";
  return true;
}

$("kitList").addEventListener("click", async (e) => {
  const open = e.target.closest("[data-open]"), exp = e.target.closest("[data-exp]"), del = e.target.closest("[data-del]"), regen = e.target.closest("[data-regen]");
  if (open) return openKit(kits[Number(open.getAttribute("data-open"))]);
  if (regen) {
    // Rigenera: l'annuncio viene decifrato dal server (stessa rotta di "Apri")
    // e passa al Kit via sessionStorage — effimero, mai in URL né in log.
    const k = kits[Number(regen.getAttribute("data-regen"))];
    regen.disabled = true;
    const r = await api("/v1/kits/" + k.id);
    if (!r.ok) { setK(t("err") + r.status, "err"); regen.disabled = false; return; }
    const full = await r.json();
    if (!full.jobAd) { setK(t("err") + "no jobAd", "err"); regen.disabled = false; return; }
    try { sessionStorage.setItem("lcc_kit_prefill", JSON.stringify({ jobAd: String(full.jobAd).slice(0, 12000), autostart: true })); } catch (_) {}
    location.href = "kit.html";
    return;
  }
  if (exp) { const k = kits[Number(exp.getAttribute("data-exp"))]; window.open(BACKEND + "/v1/kits/" + k.id + "/export", "_blank"); return; }
  if (del) {
    const k = kits[Number(del.getAttribute("data-del"))];
    if (!confirm(t("confirmOne"))) return;
    await api("/v1/kits/" + k.id, { method: "DELETE" });
    setK(t("deleted"), "ok"); loadKits(); loadReadiness();
  }
});
$("exportAllBtn").addEventListener("click", () => window.open(BACKEND + "/v1/kits/export", "_blank"));
$("deleteAllBtn").addEventListener("click", async () => {
  if (!confirm(t("confirmAll"))) return;
  await api("/v1/kits", { method: "DELETE" });
  setK(t("deletedAll"), "ok"); loadKits(); loadReadiness();
});

/* ── dettaglio in sola lettura ── */
let detail = null, activeTab = "cv";
async function openKit(k) {
  const r = await api("/v1/kits/" + k.id);
  if (!r.ok) { setK(t("err") + r.status, "err"); return; }
  detail = await r.json();
  $("detailTitle").textContent = (detail.role || "—") + (detail.company ? " @ " + detail.company : "");
  showTab("cv");
  $("kitsCard").style.display = "none"; $("readyCard").style.display = "none";
  $("detailCard").style.display = "";
  window.scrollTo(0, 0);
}
function showTab(tab) {
  activeTab = tab;
  document.querySelectorAll("#detailCard .ds-tab").forEach((b) => b.classList.toggle("on", b.getAttribute("data-tab") === tab));
  $("detailBody").innerHTML = renderMd(detail?.[tab === "questions" ? "questions" : tab] || "");
}
document.querySelectorAll("#detailCard .ds-tab").forEach((b) =>
  b.addEventListener("click", () => showTab(b.getAttribute("data-tab"))));
$("backBtn").addEventListener("click", () => {
  $("detailCard").style.display = "none";
  $("readyCard").style.display = ""; $("kitsCard").style.display = "";
});

/* ── avvio ── */
async function loadAll() {
  const me = await api("/v1/me");
  if (me.status === 401) {
    $("loginCard").style.display = ""; $("readyCard").style.display = "none"; $("kitsCard").style.display = "none";
    // dopo il login si torna qui (return_to)
    const a = $("loginCard").querySelector("a"); if (a) a.href = "index.html?return_to=storico";
    return;
  }
  $("loginCard").style.display = "none";
  await Promise.all([loadReadiness(), loadKits()]);
}
applyLang();
loadAll();
