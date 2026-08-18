import { createPlancia } from "./plancia.js";
import { cleanMd, renderMd } from "./md.js";
const BRAND=window.LCC.BRAND;

const $ = (id) => document.getElementById(id);
const BACKEND = location.protocol.startsWith("http") ? location.origin : "http://127.0.0.1:8787";

/* ── i18n ─────────────────────────────────────────────────────────── */
const T = {
  it: {
    skipLink: "Salta al contenuto",
    aiNotice: "🤖 Stai interagendo con un sistema di IA. Verifica sempre fatti, date, qualifiche ed esperienze prima di usarli. Le proposte sono bozze assistite da IA, basate solo sul tuo CV e sulle tue storie.",
    truthL: "Bozza assistita da IA — confermo che esperienze, competenze, qualifiche e date sono veritiere",
    truthNeeded: "Per scaricare il PDF conferma prima la veridicità dei contenuti (casella accanto).",
    docTitle: "Kit di candidatura — "+BRAND+"", docDesc: "Da un annuncio + il tuo CV: fit motivato, gap onesti, domande probabili e CV su misura — basati solo su ciò che hai fatto davvero. Modelli e server in Europa.",
    brandSub: "Kit di candidatura · beta",
    heroH: "Dal job post all'offerta, senza inventare nulla.",
    heroP: "Incolla l'annuncio e il tuo CV: fit motivato, 3 gap onesti, aree di domanda, una tua storia da usare e il piano fino alla data del colloquio. Poi CV su misura, mail e simulazione. I tuoi dati restano su modelli europei <span class=\"ds-eu\">EU</span> — sempre.",
    adL: "Annuncio di lavoro (incollalo qui)",
    srcL: "Chi sei tu?",
    srcProfile: "📇 Usa il profilo del mio account",
    srcCv: "📄 Incollo un CV",
    cvPh: "Incolla il tuo CV o i punti chiave della tua esperienza…",
    go: "✨ Genera il kit",
    working: "Gli agenti sono al lavoro…",
    planciaH: "Il kit si costruisce (chi fa cosa, su quale modello)",
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
    authT: "Account gratuito per il Kit completo",
    authSub: "L'anteprima dell'analisi è libera; CV su misura, mail, domande, PDF e storico si sbloccano con l'account — 1 minuto, niente carta.",
    authLogin: "Accedi",
    authSignup: "Crea account gratis",
    authFields: "Inserisci email e password.",
    authDone: "Account attivo ✔ — premi di nuovo Genera per il Kit completo.",
    pvT: "Questo è il tuo Interview Brief — gratis, senza account.",
    pvSub: "Con l'account gratuito puoi salvarlo, scaricare il CV su misura, avere mail e domande probabili e simulare il colloquio. Il valore lo vedi già qui.",
    tabBrief: "Brief", dateL: "Data del colloquio (facoltativa)", dateConsent: "Usa la data solo per costruire il piano giorno per giorno. Non viene salvata.",
    cvNeeded: "Per l'anteprima serve il tuo CV: scegli «Incollo un CV» e incollalo (almeno 80 caratteri).",
    cvUpload: "⬆ Carica CV (PDF/DOCX)", cvUploadNote: "Il file viene letto sul server europeo solo per estrarne il testo e non viene salvato. Se non è leggibile (es. scansione), te lo diciamo: incolla il testo.", cvParsing: "Leggo il file…", cvParsed: "Testo estratto: {n} caratteri — controllalo qui sopra.", cvParseFail: "Non riesco a leggere il file:",
    pvGo: "Crea l'account gratis →",
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
    cancel: "⏹ Annulla", cancelled: "Annullato.", errTimeout: "Tempo scaduto: il modello non ha risposto in tempo.", partialKept: "Generazione interrotta: mostro ciò che è arrivato", rateLimited: "Troppe richieste: riprova tra {s}s",
    labels: { queued:"in coda", working:"al lavoro", done:"fatto", error:"errore", recapTitle:"Chi ha fatto cosa", agents:"agenti", models:"modelli", euData:"dati in UE", seconds:"s totali", chars:"caratteri" },
    lang: "italiano",
  },
  en: {
    skipLink: "Skip to content",
    aiNotice: "🤖 You are interacting with an AI system. Always verify facts, dates, qualifications and experiences before using them. The outputs are AI-assisted drafts based only on your CV and your stories.",
    truthL: "AI-assisted draft — I confirm that experiences, skills, qualifications and dates are truthful",
    truthNeeded: "To download the PDF, first confirm the truthfulness of the content (checkbox next to it).",
    docTitle: "Application Kit — "+BRAND+"", docDesc: "From a job ad + your CV: reasoned fit, honest gaps, likely questions and a tailored CV — based only on what you actually did. Models and servers in Europe.",
    brandSub: "Application Kit · beta",
    heroH: "From job post to offer, without making anything up.",
    heroP: "Paste the ad and your CV: reasoned fit, 3 honest gaps, question areas, one of your stories to use and the plan up to your interview date. Then tailored CV, email and rehearsal. Your data stays on European models <span class=\"ds-eu\">EU</span> — always.",
    adL: "Job ad (paste it here)",
    srcL: "Who are you?",
    srcProfile: "📇 Use my account profile",
    srcCv: "📄 Paste a CV",
    cvPh: "Paste your CV or the key points of your experience…",
    go: "✨ Generate the kit",
    working: "The agents are at work…",
    planciaH: "Building your kit (who does what, on which model)",
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
    authT: "Free account for the full Kit",
    authSub: "The analysis preview is open; tailored CV, email, questions, PDF and history unlock with an account — 1 minute, no card.",
    authLogin: "Sign in",
    authSignup: "Create free account",
    authFields: "Enter email and password.",
    authDone: "Account active ✔ — press Generate again for the full Kit.",
    pvT: "This is your Interview Brief — free, no account.",
    pvSub: "With the free account you can save it, download the tailored CV, get the email and likely questions, and rehearse. You already see the value here.",
    tabBrief: "Brief", dateL: "Interview date (optional)", dateConsent: "Use the date only to build the day-by-day plan. It is not stored.",
    cvNeeded: "The preview needs your CV: pick “Paste a CV” and paste it (at least 80 characters).",
    cvUpload: "⬆ Upload CV (PDF/DOCX)", cvUploadNote: "The file is read on the European server only to extract text and is not stored. If it is not readable (e.g. a scan) we tell you: paste the text.", cvParsing: "Reading the file…", cvParsed: "Extracted text: {n} characters — check it above.", cvParseFail: "Cannot read the file:",
    pvGo: "Create the free account →",
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
    cancel: "⏹ Cancel", cancelled: "Cancelled.", errTimeout: "Timed out: the model did not answer in time.", partialKept: "Generation interrupted: showing what arrived", rateLimited: "Too many requests: retry in {s}s",
    labels: { queued:"queued", working:"working", done:"done", error:"error", recapTitle:"Who did what", agents:"agents", models:"models", euData:"data in EU", seconds:"s total", chars:"chars" },
    lang: "english",
  },
};
let LANG = window.LCC.getLang(["it","en"], "en");
const t = (k) => T[LANG][k] ?? k;
function applyLang() {
  document.documentElement.lang = LANG;
  const __ls=document.getElementById("langSeg"); if(__ls){[...__ls.querySelectorAll("button")].forEach((c)=>{const on=c.getAttribute("data-lang")===LANG;c.classList.toggle("on",on);c.setAttribute("aria-pressed",String(on));});}
  document.title = t("docTitle"); const md = document.querySelector('meta[name="description"]'); if (md) md.setAttribute("content", t("docDesc"));
  // innerHTML (stringhe nostre, non input utente): serve per il mini-badge UE nella prosa
  document.querySelectorAll("[data-i]").forEach((el) => (el.innerHTML = t(el.getAttribute("data-i"))));
  // placeholder anche come nome accessibile: questi campi non hanno label visiva
  document.querySelectorAll("[data-i-ph]").forEach((el) => { el.placeholder = t(el.getAttribute("data-i-ph")); el.setAttribute("aria-label", el.placeholder); });
  renderAccLine();
}
$("langSeg").addEventListener("click", (e) => {
  const b = e.target.closest("button"); if (!b) return;
  LANG = b.getAttribute("data-lang"); window.LCC.setLang(LANG);
  [...$("langSeg").children].forEach((c) => { const on = c === b; c.classList.toggle("on", on); c.setAttribute("aria-pressed", String(on)); });
  applyLang();
});

/* errori/limiti: oltre allo status visivo, annuncio assertivo per screen reader */
function announceAlert(msg) { const a = $("a11yAlert"); if (a) { a.textContent = ""; a.textContent = msg; } }

/* ── account ──────────────────────────────────────────────────────── */
let me = null;
function renderAccLine() {
  const el = $("accLine");
  if (me) {
    el.innerHTML = "";
    el.appendChild(Object.assign(document.createElement("span"), { textContent: `${t("hello")} ${me.user.name} · ${t("plan")} ${me.plan.toUpperCase()}` }));
    $("authWrap").style.display = "none";
  } else {
    el.innerHTML = "";
    $("authWrap").style.display = ""; // login contestuale: lo stato resta in pagina
  }
}

/* Auth inline (stessi endpoint better-auth, stessa origine): dopo il login
   la pagina NON si ricarica — annuncio e anteprima restano dove sono. */
async function inlineAuth(path) {
  const email = $("authEmail").value.trim(), password = $("authPass").value;
  const st = $("authStatus");
  if (!email || !password) { st.textContent = t("authFields"); st.className = "ds-status err"; return; }
  st.textContent = "…"; st.className = "ds-status";
  try {
    const body = path.indexOf("sign-up") >= 0 ? { name: email.split("@")[0], email, password } : { email, password };
    const r = await fetch(BACKEND + "/api/auth/" + path, {
      method: "POST", credentials: "include",
      headers: { "Content-Type": "application/json" }, body: JSON.stringify(body),
    });
    if (!r.ok) { const d = await r.json().catch(() => ({})); throw new Error(d.message || ("HTTP " + r.status)); }
    $("authPass").value = "";
    await loadMe();
    setStatus(t("authDone"), "ok");
  } catch (e) { st.textContent = e.message; st.className = "ds-status err"; }
}
$("authForm").addEventListener("submit", (e) => { e.preventDefault(); inlineAuth("sign-in/email"); });
$("authSignup").addEventListener("click", () => inlineAuth("sign-up/email"));
$("pvGo").addEventListener("click", () => { $("authWrap").scrollIntoView({ behavior: "smooth", block: "center" }); $("authEmail").focus(); });
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
  [...$("srcSeg").children].forEach((c) => { const on = c === b; c.classList.toggle("on", on); c.setAttribute("aria-pressed", String(on)); });
  $("cvWrap").style.display = source === "cv" ? "" : "none";
});
/* §5 upload CV: multipart → /v1/cv/parse → testo nel textarea (l'utente lo vede e lo controlla) */
$("cvFile").addEventListener("change", async () => {
  const f = $("cvFile").files && $("cvFile").files[0]; if (!f) return;
  const st = $("cvFileStatus"); st.textContent = t("cvParsing");
  const fd = new FormData(); fd.append("file", f, f.name);
  try {
    const res = await fetch(BACKEND + "/v1/cv/parse", { method: "POST", body: fd, credentials: "include", signal: window.LCC.abortScope("cvparse").signal });
    const d = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(d.detail || d.error || ("HTTP " + res.status));
    $("cvText").value = String(d.text || "").slice(0, 8000);
    st.textContent = t("cvParsed").replace("{n}", String($("cvText").value.length));
    $("cvText").focus();
  } catch (e) {
    st.textContent = t("cvParseFail") + " " + (e && e.message ? e.message : "?");
    announceAlert(st.textContent);
  } finally { $("cvFile").value = ""; }
});
$("jobAd").addEventListener("input", () => {
  $("adCount").textContent = $("jobAd").value.length;
  // bozza in sessionStorage: l'annuncio sopravvive a login/refresh nella stessa scheda
  try { sessionStorage.setItem("lcc_kit_draft", $("jobAd").value); } catch (_) {}
});

/* ── markdown: modulo condiviso assets/md.js ─────────────────────── */

/* ── tabs + copia ─────────────────────────────────────────────────── */
const results = {}; // task → markdown grezzo
let activeTab = "brief";
function showTab(tab) {
  activeTab = tab;
  document.querySelectorAll(".ds-tab").forEach((b) => {
    const on = b.getAttribute("data-tab") === tab;
    b.classList.toggle("on", on);
    b.setAttribute("aria-selected", String(on));
    if (on) { b.removeAttribute("tabindex"); $("outBody").setAttribute("aria-labelledby", b.id); }
    else b.setAttribute("tabindex", "-1");
  });
  $("outBody").innerHTML = renderMd(results[tab] || "");
  // il PDF esiste solo per il CV su misura
  $("pdfBtn").style.display = tab === "sarto" && results.sarto ? "" : "none";
  $("truthWrap").style.display = tab === "sarto" && results.sarto ? "inline-flex" : "none";
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
/* pattern tab WAI-ARIA: frecce per muoversi tra i tab visibili */
document.querySelector(".ds-tabs").addEventListener("keydown", (e) => {
  if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
  const tabs = [...document.querySelectorAll('.ds-tab[role="tab"]')].filter((b) => b.style.display !== "none");
  const i = tabs.indexOf(document.activeElement);
  if (i < 0) return;
  e.preventDefault();
  const next = tabs[(i + (e.key === "ArrowRight" ? 1 : tabs.length - 1)) % tabs.length];
  next.focus();
  showTab(next.getAttribute("data-tab"));
});
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
  // AI Act: prima dell'export l'utente conferma la veridicità della bozza assistita
  if (!$("truthChk").checked) { setStatus(t("truthNeeded"), "err"); $("truthChk").focus(); return; }
  const iframe = document.createElement("iframe");
  iframe.style.cssText = "position:fixed;right:0;bottom:0;width:0;height:0;border:0;";
  document.body.appendChild(iframe);
  const doc = iframe.contentDocument;
  doc.open();
  const aiMark = LANG === "it" ? "Bozza assistita da IA (" + BRAND + ") — contenuti confermati veritieri dal candidato" : "AI-assisted draft (" + BRAND + ") — content confirmed truthful by the candidate";
  doc.write(`<!DOCTYPE html><html lang="${LANG}" data-ai-generated="true" data-generator="${BRAND} AI-assisted"><head><meta charset="utf-8"><meta name="generator" content="${BRAND} — AI-assisted draft"><meta name="ai-generated" content="true"><title>${pdfFileName()}</title><style>
    @page{size:A4;margin:18mm 16mm;}
    body{font-family:'Inter',-apple-system,'Segoe UI',Roboto,'Helvetica Neue',sans-serif;color:#111;background:#fff;font-size:10.5pt;line-height:1.5;margin:0;}
    h1{font-size:16pt;margin:0 0 4pt;letter-spacing:-.01em;}
    h2{font-size:12.5pt;margin:14pt 0 4pt;border-bottom:.75pt solid #999;padding-bottom:2pt;}
    h3,h4{font-size:11pt;margin:10pt 0 3pt;}
    p{margin:4pt 0;} ul,ol{margin:3pt 0;padding-left:16pt;} li{margin:2pt 0;}
    hr{border:none;border-top:.75pt solid #bbb;margin:10pt 0;}
    code{font-family:inherit;background:none;border:none;padding:0;}
    h1,h2,h3,h4{page-break-after:avoid;} li,p{page-break-inside:avoid;}
  </style></head><body>${renderMd(md)}<p style="margin-top:14pt;font-size:8pt;color:#666" data-ai-mark="true">${aiMark}</p></body></html>`);
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
function setStatus(msg, cls) {
  $("status").textContent = msg; $("status").className = "ds-status " + (cls || "");
  if (cls === "err" && msg) announceAlert(msg);
}
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
  const req = window.LCC.abortScope("kit"); // annulla stream precedente
  try {
    const r = await window.LCC.stream(BACKEND + "/v1/kit/agent", {
      signal: req.signal, firstTokenMs: 30000, totalMs: 180000,
      body: JSON.stringify({
        agent: agentId,
        jobAd: lastJobAd,
        tailoredCv: results.sarto.slice(0, 20000),
        ...(lastPastedCv ? { cv: lastPastedCv } : {}),
        language: t("lang"),
      }),
      onEvent: (ev) => {
        plancia.handleEvent(ev);
        if (ev.type === "task-start") { tabBtn.style.display = ""; showTab(agentId); }
        if (ev.type === "task-delta") {
          results[agentId] += ev.text || "";
          if (activeTab === agentId) $("outBody").innerHTML = renderMd(results[agentId]);
        }
        if (ev.type === "task-done") setStatus("", "");
        if (ev.type === "task-error") setStatus(ev.message || "errore", "err");
      },
    });
    if (activeTab === agentId) showTab(agentId);
    if (r.partial) setStatus(t("partialKept") + " (" + r.reason + ")", "err");
  } catch (e) {
    setStatus(friendlyErr(e), "err");
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
  // anonimo: il Brief è centrato sull'utente → serve il CV (fail-closed lato server, ma lo diciamo prima)
  if (!me && !body.cv) { source = "cv"; document.querySelector('#srcSeg [data-src="cv"]').click(); setStatus(t("cvNeeded"), "err"); $("cvText").focus(); return; }
  if ($("interviewDate").value && $("dateConsent").checked) body.interviewDate = $("interviewDate").value;
  if (me && $("saveKit").checked) body.save = true;

  $("goBtn").disabled = true;
  setStatus(t("working"), "");
  results.sarto = ""; results.mail = ""; results.intervistatore = ""; results.analista = ""; results.brief = "";
  results.coach = ""; results.critico = "";
  lastJobAd = jobAd; lastPastedCv = body.cv || null;
  $("agentBtns").style.display = "none";
  document.querySelectorAll('[data-tab="coach"],[data-tab="critico"]').forEach((b) => (b.style.display = "none"));
  document.querySelector(".outhead").style.display = "";
  $("previewCta").style.display = "none";
  $("outCard").style.display = "none";
  $("planciaWrap").style.display = "";
  plancia.reset();
  $("planciaWrap").scrollIntoView({ behavior: "smooth", block: "start" });

  const req = window.LCC.abortScope("kit"); // nuova generazione = annulla la precedente
  $("cancelBtn").style.display = "";
  try {
    const r = await window.LCC.stream(BACKEND + "/v1/kit", {
      signal: req.signal, firstTokenMs: 30000, totalMs: 240000,
      body: JSON.stringify(body),
      onEvent: (ev) => {
        plancia.handleEvent(ev);
        if (ev.type === "task-delta" && ev.task in results) results[ev.task] += ev.text || "";
        if (ev.type === "kit-done") {
          if (ev.preview) {
            // anteprima anonima: il Brief (fit, gap, aree, storia, piano) — niente spazi vuoti
            $("outCard").style.display = "";
            document.querySelector(".outhead").style.display = "none";
            $("outBody").style.marginTop = "0";
            $("outBody").innerHTML = renderMd(results.brief || results.analista || "");
            $("previewCta").style.display = "";
            setStatus("", "");
          } else {
            $("outCard").style.display = "";
            $("outBody").style.marginTop = "";
            showTab(results.brief ? "brief" : results.sarto ? "sarto" : "intervistatore");
            setStatus("", "");
            if (me && results.sarto) $("agentBtns").style.display = "flex";
          }
        }
        if (ev.type === "kit-saved") {
          if (ev.ok) {
            $("status").className = "ds-status ok";
            $("status").innerHTML = "✔ " + t("savedOk") + " — <a href=\"storico.html\">" + t("savedLink") + "</a>";
          } else {
            setStatus(t("savedFull"), "err");
          }
        }
      },
    });
    if (r.partial) {
      // stream interrotto dopo dati: mostro ciò che è arrivato, dicendolo
      if (results.sarto || results.analista) { $("outCard").style.display = ""; showTab(results.sarto ? "sarto" : "intervistatore"); }
      setStatus(t("partialKept") + " (" + r.reason + ")", "err");
    }
  } catch (e) {
    setStatus(friendlyErr(e), "err");
  }
  $("cancelBtn").style.display = "none";
  $("goBtn").disabled = false;
}
$("goBtn").addEventListener("click", generate);
$("cancelBtn").addEventListener("click", () => window.LCC.abortAll());
/* errori umani: rete/timeout/429/annullato */
function friendlyErr(e) {
  if (!e) return "?";
  if (e.status === 429) return t("rateLimited").replace("{s}", String(e.retryAfter || 30));
  if (e.message === "network") return t("netErr");
  if (e.message === "aborted") return t("cancelled");
  if (/^timeout/.test(e.message)) return t("errTimeout");
  return e.message || "?";
}

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
      // il prefill diventa subito bozza: sopravvive anche a un login/refresh
      try { sessionStorage.setItem("lcc_kit_draft", $("jobAd").value); } catch (_) {}
      if (p.autostart) setTimeout(() => generate(), 500);
    }
  } else {
    // nessun prefill: ripristina l'eventuale bozza della scheda
    const draft = sessionStorage.getItem("lcc_kit_draft");
    if (draft && !$("jobAd").value) {
      $("jobAd").value = draft.slice(0, 12000);
      $("adCount").textContent = $("jobAd").value.length;
    }
  }
} catch (_) {}
