import { createPlancia } from "./plancia.js";
import { cleanMd, renderMd } from "./md.js";

const $ = (id) => document.getElementById(id);
const BACKEND = location.protocol.startsWith("http") ? location.origin : "http://127.0.0.1:8787";

/* ── i18n ─────────────────────────────────────────────────────────── */
const T = {
  it: {
    brandSub: "Kit di candidatura · beta",
    heroH: "Un annuncio. Il tuo profilo. Il kit completo.",
    heroP: "Tre agenti AI leggono l'annuncio e il tuo percorso, e preparano un CV su misura e le probabili domande del colloquio. I tuoi dati restano su modelli europei <span class=\"ds-eu\">EU</span> — sempre.",
    adL: "Annuncio di lavoro (incollalo qui)",
    srcL: "Chi sei tu?",
    srcProfile: "📇 Usa il profilo del mio account",
    srcCv: "📄 Incollo un CV",
    cvPh: "Incolla il tuo CV o i punti chiave della tua esperienza…",
    go: "✨ Genera il kit",
    working: "Gli agenti sono al lavoro…",
    planciaH: "L'orchestra al lavoro",
    tabCv: "CV su misura",
    tabMail: "Mail",
    tabQ: "Domande probabili",
    tabCoach: "Coach",
    tabCritico: "Critico",
    agentCoach: "🎯 Coach — Come migliorare",
    agentCritico: "🥊 Critico — Mettimi alla prova",
    agentHint: "Approfondimenti a richiesta, sugli stessi modelli europei.",
    agentWorking: "L'agente è al lavoro…",
    copy: "⧉ Copia markdown",
    copied: "Copiato ✓",
    pdf: "⬇ Scarica PDF",
    pdfName: "CV-su-misura",
    cvFor: "CV per",
    saveL: "Salva questo kit nel mio storico",
    saveNote: "Salvato cifrato su server UE · cancellabile in ogni momento · rimosso dopo 24 mesi.",
    savedOk: "Kit salvato nello storico",
    savedLink: "apri lo Storico",
    savedFull: "Storico pieno — cancella un kit dallo Storico o passa a Pro.",
    foot: "Il kit è effimero: non salviamo nulla sui nostri server. Solo tu hai il risultato.",
    needLogin: "Serve un account (gratis).",
    openApp: "Apri l'app per accedere →",
    hello: "Ciao",
    plan: "piano",
    adShort: "Incolla l'annuncio (almeno 50 caratteri).",
    netErr: "Backend non raggiungibile: controlla che sia acceso.",
    labels: { queued:"in coda", working:"al lavoro", done:"fatto", error:"errore", recapTitle:"Chi ha fatto cosa", agents:"agenti", models:"modelli", euData:"dati in UE", seconds:"s totali", chars:"caratteri" },
    lang: "italiano",
  },
  en: {
    brandSub: "Application Kit · beta",
    heroH: "One job ad. Your profile. The full kit.",
    heroP: "Three AI agents read the ad and your background, then craft a tailored CV and the likely interview questions. Your data stays on European models <span class=\"ds-eu\">EU</span> — always.",
    adL: "Job ad (paste it here)",
    srcL: "Who are you?",
    srcProfile: "📇 Use my account profile",
    srcCv: "📄 Paste a CV",
    cvPh: "Paste your CV or the key points of your experience…",
    go: "✨ Generate the kit",
    working: "The agents are at work…",
    planciaH: "The orchestra at work",
    tabCv: "Tailored CV",
    tabMail: "Cover email",
    tabQ: "Likely questions",
    tabCoach: "Coach",
    tabCritico: "Critic",
    agentCoach: "🎯 Coach — How to improve",
    agentCritico: "🥊 Critic — Challenge me",
    agentHint: "On-demand deep dives, on the same European models.",
    agentWorking: "The agent is at work…",
    copy: "⧉ Copy markdown",
    copied: "Copied ✓",
    pdf: "⬇ Download PDF",
    pdfName: "Tailored-CV",
    cvFor: "CV for",
    saveL: "Save this kit to my history",
    saveNote: "Stored encrypted on EU servers · deletable anytime · removed after 24 months.",
    savedOk: "Kit saved to your history",
    savedLink: "open History",
    savedFull: "History full — delete a kit from History or go Pro.",
    foot: "The kit is ephemeral: nothing is stored on our servers. Only you have the result.",
    needLogin: "You need a (free) account.",
    openApp: "Open the app to sign in →",
    hello: "Hi",
    plan: "plan",
    adShort: "Paste the job ad (at least 50 characters).",
    netErr: "Backend unreachable: make sure it is running.",
    labels: { queued:"queued", working:"working", done:"done", error:"error", recapTitle:"Who did what", agents:"agents", models:"models", euData:"data in EU", seconds:"s total", chars:"chars" },
    lang: "english",
  },
};
let LANG = (navigator.language || "en").toLowerCase().startsWith("it") ? "it" : "en";
const t = (k) => T[LANG][k] ?? k;
function applyLang() {
  document.documentElement.lang = LANG;
  // innerHTML (stringhe nostre, non input utente): serve per il mini-badge UE nella prosa
  document.querySelectorAll("[data-i]").forEach((el) => (el.innerHTML = t(el.getAttribute("data-i"))));
  document.querySelectorAll("[data-i-ph]").forEach((el) => (el.placeholder = t(el.getAttribute("data-i-ph"))));
  renderAccLine();
}
$("langSeg").addEventListener("click", (e) => {
  const b = e.target.closest("button"); if (!b) return;
  LANG = b.getAttribute("data-lang");
  [...$("langSeg").children].forEach((c) => c.classList.toggle("on", c === b));
  applyLang();
});

/* ── account ──────────────────────────────────────────────────────── */
let me = null;
function renderAccLine() {
  const el = $("accLine");
  if (me) {
    el.innerHTML = "";
    el.appendChild(Object.assign(document.createElement("span"), { textContent: `${t("hello")} ${me.user.name} · ${t("plan")} ${me.plan.toUpperCase()}` }));
  } else {
    el.innerHTML = `<span>${t("needLogin")}</span> <a href="index.html">${t("openApp")}</a>`;
  }
}
async function loadMe() {
  try {
    const r = await fetch(BACKEND + "/v1/me", { credentials: "include" });
    me = r.ok ? await r.json() : null;
  } catch (_) { me = null; }
  renderAccLine();
  // checkbox salvataggio: visibile da loggati; spenta a ogni sessione,
  // pre-spuntata SOLO se la preferenza account lo chiede
  $("saveWrap").style.display = me ? "" : "none";
  if (me) $("saveKit").checked = !!me.preferences?.autoSaveKits;
}

/* ── input ────────────────────────────────────────────────────────── */
let source = "profile";
$("srcSeg").addEventListener("click", (e) => {
  const b = e.target.closest("button"); if (!b) return;
  source = b.getAttribute("data-src");
  [...$("srcSeg").children].forEach((c) => c.classList.toggle("on", c === b));
  $("cvWrap").style.display = source === "cv" ? "" : "none";
});
$("jobAd").addEventListener("input", () => ($("adCount").textContent = $("jobAd").value.length));

/* ── markdown: modulo condiviso assets/md.js ─────────────────────── */

/* ── tabs + copia ─────────────────────────────────────────────────── */
const results = {}; // task → markdown grezzo
let activeTab = "sarto";
function showTab(tab) {
  activeTab = tab;
  document.querySelectorAll(".ds-tab").forEach((b) => b.classList.toggle("on", b.getAttribute("data-tab") === tab));
  $("outBody").innerHTML = renderMd(results[tab] || "");
  // il PDF esiste solo per il CV su misura
  $("pdfBtn").style.display = tab === "sarto" && results.sarto ? "" : "none";
  // sottotitolo di conferma (textContent: ruolo/azienda vengono dal modello)
  const sub = $("cvSub");
  const role = keyLine(results.analista, "RUOLO");
  const company = keyLine(results.analista, "AZIENDA");
  if (tab === "sarto" && results.sarto && role) {
    const realCompany = company && !/^n\/?d\.?$/i.test(company.trim()) ? company : null;
    sub.textContent = t("cvFor") + " " + role + (realCompany ? " @ " + realCompany : "");
    sub.style.display = "";
  } else {
    sub.style.display = "none";
  }
}
document.querySelectorAll(".ds-tab").forEach((b) =>
  b.addEventListener("click", () => showTab(b.getAttribute("data-tab"))));
/* Nome file PDF dinamico: l'Analista apre SEMPRE con due righe a chiavi fisse
   (RUOLO: / AZIENDA:, identiche in ogni lingua — contratto col backend).
   Da lì: CV-<Ruolo>-<Azienda>-<AAAA-MM>.pdf, sanitizzato; AZIENDA "n/d" → solo
   ruolo; niente di affidabile → fallback CV-su-misura / Tailored-CV (senza data). */
function keyLine(md, key) {
  for (const raw of String(md || "").split("\n")) {
    const line = raw.replace(/[*_#`>]/g, "").trim();
    const m = line.match(new RegExp("^" + key + "\\s*:\\s*(.+)$", "i"));
    if (m) return m[1].trim();
  }
  return null;
}
function slugify(s) {
  return s
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")  // accenti → lettere base
    .replace(/[^A-Za-z0-9]+/g, "-")                    // tutto il resto → trattini
    .replace(/-{2,}/g, "-").replace(/^-+|-+$/g, "");   // collassa e rifila
}
function pdfFileName() {
  const role = keyLine(results.analista, "RUOLO");
  const company = keyLine(results.analista, "AZIENDA");
  const roleSlug = role ? slugify(role) : "";
  if (!roleSlug) return t("pdfName"); // fallback esatto, senza data
  const parts = ["CV", roleSlug];
  if (company && !/^n\/?d\.?$/i.test(company.trim())) {
    const c = slugify(company);
    if (c) parts.push(c);
  }
  let base = parts.join("-");
  if (base.length > 60) base = base.slice(0, 60).replace(/-[^-]*$/, ""); // niente segmenti monchi
  return base + "-" + new Date().toISOString().slice(0, 7); // AAAA-MM
}

/* PDF del CV su misura: iframe nascosto con print-CSS → il motore di stampa
   del browser produce un PDF A4 VETTORIALE (testo vero, non uno screenshot).
   Effimero e 100% client-side: nessuna libreria, nessuna chiamata al server.
   Il titolo del documento diventa il nome file proposto. */
function downloadPdf() {
  const md = results.sarto;
  if (!md) return;
  const iframe = document.createElement("iframe");
  iframe.style.cssText = "position:fixed;right:0;bottom:0;width:0;height:0;border:0;";
  document.body.appendChild(iframe);
  const doc = iframe.contentDocument;
  doc.open();
  doc.write(`<!DOCTYPE html><html lang="${LANG}"><head><meta charset="utf-8"><title>${pdfFileName()}</title><style>
    @page{size:A4;margin:18mm 16mm;}
    body{font-family:'Inter',-apple-system,'Segoe UI',Roboto,'Helvetica Neue',sans-serif;color:#111;background:#fff;font-size:10.5pt;line-height:1.5;margin:0;}
    h1{font-size:16pt;margin:0 0 4pt;letter-spacing:-.01em;}
    h2{font-size:12.5pt;margin:14pt 0 4pt;border-bottom:.75pt solid #999;padding-bottom:2pt;}
    h3,h4{font-size:11pt;margin:10pt 0 3pt;}
    p{margin:4pt 0;} ul,ol{margin:3pt 0;padding-left:16pt;} li{margin:2pt 0;}
    hr{border:none;border-top:.75pt solid #bbb;margin:10pt 0;}
    code{font-family:inherit;background:none;border:none;padding:0;}
    h1,h2,h3,h4{page-break-after:avoid;} li,p{page-break-inside:avoid;}
  </style></head><body>${renderMd(md)}</body></html>`);
  doc.close();
  setTimeout(() => {
    iframe.contentWindow.focus();
    iframe.contentWindow.print();
    setTimeout(() => iframe.remove(), 3000);
  }, 250);
}
$("pdfBtn").addEventListener("click", downloadPdf);

$("copyBtn").addEventListener("click", () => {
  const md = cleanMd(results[activeTab] || "");
  if (!md) return;
  navigator.clipboard.writeText(md).then(() => {
    $("copyBtn").textContent = t("copied");
    setTimeout(() => ($("copyBtn").textContent = t("copy")), 1500);
  }).catch(() => {});
});

/* ── generazione ──────────────────────────────────────────────────── */
const plancia = createPlancia($("plancia"), { labels: T[LANG].labels });
function setStatus(msg, cls) { $("status").textContent = msg; $("status").className = "ds-status " + (cls || ""); }
let lastJobAd = "", lastPastedCv = null;

/* Agenti on-demand (Coach/Critico): riusano il contesto già generato —
   annuncio + CV su misura + profilo (lato server) — senza rigenerare nulla.
   Card in plancia e riga nel recap arrivano dagli stessi eventi SSE. */
async function runAgent(agentId) {
  if (!results.sarto || !lastJobAd) return;
  $("coachBtn").disabled = true; $("criticoBtn").disabled = true;
  setStatus(t("agentWorking"), "");
  results[agentId] = "";
  const tabBtn = document.querySelector('[data-tab="' + agentId + '"]');
  try {
    const res = await fetch(BACKEND + "/v1/kit/agent", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        agent: agentId,
        jobAd: lastJobAd,
        tailoredCv: results.sarto.slice(0, 20000),
        ...(lastPastedCv ? { cv: lastPastedCv } : {}),
        language: t("lang"),
      }),
    });
    if (!res.ok) {
      const d = await res.json().catch(() => ({}));
      throw new Error(d.detail || d.error || "HTTP " + res.status);
    }
    const rd = res.body.getReader(), dec = new TextDecoder();
    let buf = "";
    while (true) {
      const { done, value } = await rd.read();
      if (done) break;
      buf += dec.decode(value, { stream: true });
      let i;
      while ((i = buf.indexOf("\n")) >= 0) {
        let ln = buf.slice(0, i).trim(); buf = buf.slice(i + 1);
        if (!ln.startsWith("data:")) continue;
        ln = ln.slice(5).trim();
        if (!ln || ln === "[DONE]") continue;
        let ev; try { ev = JSON.parse(ln); } catch (_) { continue; }
        plancia.handleEvent(ev);
        if (ev.type === "task-start") { tabBtn.style.display = ""; showTab(agentId); }
        if (ev.type === "task-delta") {
          results[agentId] += ev.text || "";
          if (activeTab === agentId) $("outBody").innerHTML = renderMd(results[agentId]);
        }
        if (ev.type === "task-done") setStatus("", "");
        if (ev.type === "task-error") setStatus(ev.message || "errore", "err");
      }
    }
    if (activeTab === agentId) showTab(agentId);
  } catch (e) {
    setStatus(e.message, "err");
  }
  $("coachBtn").disabled = false; $("criticoBtn").disabled = false;
}
$("coachBtn").addEventListener("click", () => runAgent("coach"));
$("criticoBtn").addEventListener("click", () => runAgent("critico"));

async function generate() {
  const jobAd = $("jobAd").value.trim();
  if (jobAd.length < 50) { setStatus(t("adShort"), "err"); return; }
  const body = { jobAd, language: t("lang") };
  if (source === "cv" && $("cvText").value.trim()) body.cv = $("cvText").value.trim().slice(0, 8000);
  if (me && $("saveKit").checked) body.save = true;

  $("goBtn").disabled = true;
  setStatus(t("working"), "");
  results.sarto = ""; results.mail = ""; results.intervistatore = ""; results.analista = "";
  results.coach = ""; results.critico = "";
  lastJobAd = jobAd; lastPastedCv = body.cv || null;
  $("agentBtns").style.display = "none";
  document.querySelectorAll('[data-tab="coach"],[data-tab="critico"]').forEach((b) => (b.style.display = "none"));
  $("outCard").style.display = "none";
  $("planciaWrap").style.display = "";
  plancia.reset();
  $("planciaWrap").scrollIntoView({ behavior: "smooth", block: "start" });

  try {
    const res = await fetch(BACKEND + "/v1/kit", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const d = await res.json().catch(() => ({}));
      throw new Error(d.detail || d.error || "HTTP " + res.status);
    }
    const rd = res.body.getReader(), dec = new TextDecoder();
    let buf = "";
    while (true) {
      const { done, value } = await rd.read();
      if (done) break;
      buf += dec.decode(value, { stream: true });
      let i;
      while ((i = buf.indexOf("\n")) >= 0) {
        let ln = buf.slice(0, i).trim(); buf = buf.slice(i + 1);
        if (!ln.startsWith("data:")) continue;
        ln = ln.slice(5).trim();
        if (!ln || ln === "[DONE]") continue;
        let ev; try { ev = JSON.parse(ln); } catch (_) { continue; }
        plancia.handleEvent(ev);
        if (ev.type === "task-delta" && ev.task in results) results[ev.task] += ev.text || "";
        if (ev.type === "kit-done") {
          $("outCard").style.display = "";
          showTab(results.sarto ? "sarto" : "intervistatore");
          setStatus("", "");
          if (me && results.sarto) $("agentBtns").style.display = "flex";
        }
        if (ev.type === "kit-saved") {
          if (ev.ok) {
            $("status").className = "ds-status ok";
            $("status").innerHTML = "✔ " + t("savedOk") + " — <a href=\"storico.html\">" + t("savedLink") + "</a>";
          } else {
            setStatus(t("savedFull"), "err");
          }
        }
      }
    }
  } catch (e) {
    setStatus(/Failed to fetch|NetworkError/i.test(e.message) ? t("netErr") : e.message, "err");
  }
  $("goBtn").disabled = false;
}
$("goBtn").addEventListener("click", generate);

applyLang();
loadMe();

/* Prefill da "Cerca offerte" (sessionStorage, effimero: si consuma alla lettura).
   autostart lancia il Kit appena la pagina è pronta. */
try {
  const pre = sessionStorage.getItem("lcc_kit_prefill");
  if (pre) {
    sessionStorage.removeItem("lcc_kit_prefill");
    const p = JSON.parse(pre);
    if (p.jobAd) {
      $("jobAd").value = String(p.jobAd).slice(0, 12000);
      $("adCount").textContent = $("jobAd").value.length;
      if (p.autostart) setTimeout(() => generate(), 500);
    }
  }
} catch (_) {}
