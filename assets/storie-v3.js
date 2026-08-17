const BRAND=window.LCC.BRAND;
/* Story Bank — UI (M3). Regole: nessun innerHTML con dati (solo nodi), dialog
   nativi accessibili, helper API del nucleo (lancia su non-2xx), i suggerimenti
   dell'agente NON si salvano mai da soli: l'utente li rivede uno a uno. */
const $ = (id) => document.getElementById(id);
const BACKEND = location.protocol.startsWith("http") ? location.origin : "http://127.0.0.1:8787";
const api = (p, o = {}) => window.LCC.api(BACKEND + p, o);
const apiJson = (p, o = {}) => window.LCC.api.json(BACKEND + p, o);

const T = {
  it: {
    skipLink: "Salta al contenuto", brandSub: "Le tue storie · Story Bank", toKit: "✨ Kit", toHist: "🗂 Storico",
    docTitle: "Le tue storie — "+BRAND+"",
    heroH: "Le tue storie: la memoria vera su cui tutto si basa",
    heroP: "Esperienze reali in formato STAR (Situazione, Compito, Azione, Risultato). Il Kit, il Critico e il copilota attingono SOLO da qui e dal tuo CV — con la fonte indicata. Se una prova manca, lo dicono: mai inventare.",
    needLogin: "La Story Bank vive sul tuo account, cifrata su server UE: accedi per vederla.", openApp: "Apri l'app per accedere",
    add: "＋ Aggiungi storia", suggest: "✨ Proponi storie dal mio CV", exportAll: "⬇ Esporta", deleteAll: "🗑 Cancella tutto",
    privacyNote: "Cifrate a riposo su server UE · elaborate solo da modelli europei · esportabili e cancellabili quando vuoi.",
    suggestH: "Storie proposte dall'agente — da rivedere", suggestSub: "L'agente legge SOLO il tuo profilo/CV (e i kit salvati) e propone bozze con la frase che le giustifica. Niente si salva finché non confermi tu, dopo averle lette.",
    cvPasteL: "CV o note (facoltativo: se vuoto usa il profilo del tuo account)", cvPastePh: "Incolla il CV o qualche punto della tua esperienza…",
    suggestGo: "Proponi", close: "Chiudi", suggestWorking: "L'agente legge il tuo materiale…", suggestNone: "Nessuna storia estraibile da questo testo: aggiungine una a mano.",
    review: "Rivedi e salva", discard: "Scarta", listH: "Storie salvate",
    empty: "Nessuna storia ancora. Aggiungine una, o fatti proporre bozze dal tuo CV.",
    edit: "Modifica", del: "Elimina", editT: "Modifica storia", newT: "Nuova storia", reviewT: "Rivedi la storia proposta",
    fTitle: "Titolo (breve e specifico)", fRole: "Ruolo / contesto", fSkills: "Competenze (separate da virgola)", fSkillsPh: "es. negoziazione, retention",
    fSit: "Situazione", fTask: "Compito", fAct: "Azione (cosa hai fatto tu)", fRes: "Risultato", fMetric: "Metrica (numero/KPI)", fMetricPh: "es. +20% ARR", fEvidence: "Prova / nota", fEvidencePh: "es. rinnovo firmato marzo 2023",
    cancel: "Annulla", save: "Salva", saved: "Salvata ✔", deleted: "Eliminata.", deletedAll: "Story Bank cancellata.",
    confirmOne: "Eliminare questa storia? L'operazione è definitiva.", confirmAll: "Cancellare TUTTE le storie? L'operazione è definitiva.",
    dlgT: "Conferma", dlgYes: "Sì, elimina", dlgNo: "Annulla",
    required: "Compila titolo, situazione, compito, azione e risultato.",
    opFailed: "Operazione NON riuscita:", retryHint: "riprova.", errNet: "rete non raggiungibile", errTimeout: "tempo scaduto", full: "Hai raggiunto il tetto di storie del tuo piano.",
    quotaOf: "storie", src: { manual: "manuale", cv: "dal CV", kit: "dal Kit" },
    foot: "Le tue storie sono tue: cifrate a riposo, esportabili, cancellabili. Nessun agente le inventa, nessuno le legge senza il tuo login.",
    lang: "italiano",
  },
  en: {
    skipLink: "Skip to content", brandSub: "Your stories · Story Bank", toKit: "✨ Kit", toHist: "🗂 History",
    docTitle: "Your stories — "+BRAND+"",
    heroH: "Your stories: the real memory everything is grounded on",
    heroP: "Real experiences in STAR format (Situation, Task, Action, Result). The Kit, the Critic and the copilot draw ONLY from here and your CV — with the source shown. If a proof is missing, they say so: never invent.",
    needLogin: "Your Story Bank lives on your account, encrypted on EU servers: sign in to see it.", openApp: "Open the app to sign in",
    add: "＋ Add story", suggest: "✨ Suggest stories from my CV", exportAll: "⬇ Export", deleteAll: "🗑 Delete all",
    privacyNote: "Encrypted at rest on EU servers · processed only by European models · exportable and deletable anytime.",
    suggestH: "Stories proposed by the agent — to review", suggestSub: "The agent reads ONLY your profile/CV (and saved kits) and proposes drafts with the sentence that justifies them. Nothing is saved until you confirm, after reading.",
    cvPasteL: "CV or notes (optional: if empty it uses your account profile)", cvPastePh: "Paste your CV or a few points about your experience…",
    suggestGo: "Suggest", close: "Close", suggestWorking: "The agent is reading your material…", suggestNone: "No story could be extracted from this text: add one manually.",
    review: "Review & save", discard: "Discard", listH: "Saved stories",
    empty: "No stories yet. Add one, or get drafts suggested from your CV.",
    edit: "Edit", del: "Delete", editT: "Edit story", newT: "New story", reviewT: "Review the proposed story",
    fTitle: "Title (short and specific)", fRole: "Role / context", fSkills: "Skills (comma separated)", fSkillsPh: "e.g. negotiation, retention",
    fSit: "Situation", fTask: "Task", fAct: "Action (what YOU did)", fRes: "Result", fMetric: "Metric (number/KPI)", fMetricPh: "e.g. +20% ARR", fEvidence: "Evidence / note", fEvidencePh: "e.g. renewal signed March 2023",
    cancel: "Cancel", save: "Save", saved: "Saved ✔", deleted: "Deleted.", deletedAll: "Story Bank deleted.",
    confirmOne: "Delete this story? This cannot be undone.", confirmAll: "Delete ALL stories? This cannot be undone.",
    dlgT: "Confirm", dlgYes: "Yes, delete", dlgNo: "Cancel",
    required: "Fill in title, situation, task, action and result.",
    opFailed: "Operation FAILED:", retryHint: "please retry.", errNet: "network unreachable", errTimeout: "timed out", full: "You reached your plan's story limit.",
    quotaOf: "stories", src: { manual: "manual", cv: "from CV", kit: "from Kit" },
    foot: "Your stories are yours: encrypted at rest, exportable, deletable. No agent invents them, nobody reads them without your login.",
    lang: "english",
  },
};
let LANG = window.LCC.getLang(["it","en"], "en");
const t = (k) => T[LANG][k] ?? k;
function applyLang() {
  document.documentElement.lang = LANG;
  const __ls=document.getElementById("langSeg"); if(__ls){[...__ls.querySelectorAll("button")].forEach((c)=>{const on=c.getAttribute("data-lang")===LANG;c.classList.toggle("on",on);c.setAttribute("aria-pressed",String(on));});}
  document.title = t("docTitle");
  document.querySelectorAll("[data-i]").forEach((el) => (el.textContent = t(el.getAttribute("data-i"))));
  document.querySelectorAll("[data-i-ph]").forEach((el) => (el.placeholder = t(el.getAttribute("data-i-ph"))));
}
$("langSeg").addEventListener("click", (e) => {
  const b = e.target.closest("button"); if (!b) return;
  LANG = b.getAttribute("data-lang"); window.LCC.setLang(LANG);
  [...$("langSeg").children].forEach((c) => { const on = c === b; c.classList.toggle("on", on); c.setAttribute("aria-pressed", String(on)); });
  applyLang(); renderList();
});

const errText = (e) => (e && e.message === "network" ? t("errNet") : e && e.message === "timeout" ? t("errTimeout") : e && e.status === 409 ? t("full") : (e && e.message) || "?");
function setStatus(m, c) { $("status").textContent = m; $("status").className = "ds-status " + (c || ""); if (c === "err" && m) { const a = $("a11yAlert"); a.textContent = ""; a.textContent = m; } }
const el = (tag, cls, text) => { const n = document.createElement(tag); if (cls) n.className = cls; if (text !== undefined) n.textContent = text; return n; };

function askConfirm(msg) {
  return new Promise((resolve) => {
    const dlg = $("confirmDlg");
    $("confirmDlgT").textContent = t("dlgT"); $("confirmDlgP").textContent = msg;
    $("confirmDlgYes").textContent = t("dlgYes"); $("confirmDlgNo").textContent = t("dlgNo");
    const opener = document.activeElement; let ok = false;
    $("confirmDlgYes").onclick = () => { ok = true; dlg.close(); }; $("confirmDlgNo").onclick = () => dlg.close();
    dlg.onclose = () => { resolve(ok); if (opener && opener.focus) opener.focus(); };
    dlg.showModal();
  });
}

/* ── editor STAR (nuova / modifica / revisione candidato) ── */
let editing = null; // {id?, source, onSaved}
function openEditor(story, opts = {}) {
  editing = { id: story?.id || null, source: story?.source || "manual", onSaved: opts.onSaved || null };
  $("editDlgT").textContent = opts.title || (story?.id ? t("editT") : t("newT"));
  $("fTitle").value = story?.title || ""; $("fRole").value = story?.role || "";
  $("fSkills").value = (story?.skills || []).join(", ");
  $("fSit").value = story?.situation || ""; $("fTask").value = story?.task || ""; $("fAct").value = story?.action || ""; $("fRes").value = story?.result || "";
  $("fMetric").value = story?.metric || ""; $("fEvidence").value = story?.evidence || "";
  $("editStatus").textContent = ""; $("editStatus").className = "ds-status";
  const opener = document.activeElement;
  $("editDlg").onclose = () => { if (opener && opener.focus) opener.focus(); };
  $("editDlg").showModal();
  $("fTitle").focus();
}
$("editCancel").addEventListener("click", () => $("editDlg").close());
$("editForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const body = {
    title: $("fTitle").value.trim(), role: $("fRole").value.trim() || null,
    skills: $("fSkills").value.split(",").map((s) => s.trim()).filter(Boolean).slice(0, 12),
    situation: $("fSit").value.trim(), task: $("fTask").value.trim(), action: $("fAct").value.trim(), result: $("fRes").value.trim(),
    metric: $("fMetric").value.trim() || null, evidence: $("fEvidence").value.trim() || null, source: editing.source,
  };
  if (!body.title || !body.situation || !body.task || !body.action || !body.result) { $("editStatus").textContent = t("required"); $("editStatus").className = "ds-status err"; return; }
  $("editSave").disabled = true;
  try {
    if (editing.id) await apiJson("/v1/stories/" + editing.id, { method: "PUT", body: JSON.stringify(body) });
    else await apiJson("/v1/stories", { method: "POST", body: JSON.stringify(body) });
    $("editDlg").close();
    setStatus(t("saved"), "ok");
    if (editing.onSaved) editing.onSaved();
    await loadList();
  } catch (err) {
    $("editStatus").textContent = t("opFailed") + " " + errText(err) + " — " + t("retryHint"); $("editStatus").className = "ds-status err";
  } finally { $("editSave").disabled = false; }
});
$("addBtn").addEventListener("click", () => openEditor(null));

/* ── elenco ── */
let stories = [], quota = { used: 0, limit: 0 };
async function loadList() {
  let d; try { d = await apiJson("/v1/stories"); } catch (e) { setStatus(t("opFailed") + " " + errText(e), "err"); return; }
  stories = d.stories || []; quota = { used: d.used, limit: d.limit };
  renderList();
}
function renderList() {
  $("quota").textContent = quota.limit ? `${quota.used} / ${quota.limit} ${t("quotaOf")}` : "";
  const box = $("storyList"); box.textContent = "";
  if (!stories.length) { box.appendChild(el("div", "empty", t("empty"))); return; }
  for (const s of stories) {
    const row = el("div", "srow");
    const who = el("div", "who");
    who.appendChild(el("b", null, s.title));
    const meta = el("div", "meta", [s.role, new Date(s.updatedAt).toLocaleDateString(LANG === "it" ? "it-IT" : "en-GB")].filter(Boolean).join(" · "));
    who.appendChild(meta);
    const chips = el("div");
    chips.appendChild(el("span", "chip src", t("src")[s.source] || s.source));
    for (const sk of s.skills || []) chips.appendChild(el("span", "chip", sk));
    who.appendChild(chips);
    row.appendChild(who);
    const btns = el("div", "btns");
    const eb = el("button", "ds-btn ds-btn-ghost ds-btn-sm", t("edit")); eb.setAttribute("aria-label", t("edit") + " — " + s.title);
    eb.addEventListener("click", async () => { try { const full = await apiJson("/v1/stories/" + s.id); openEditor(full); } catch (e) { setStatus(t("opFailed") + " " + errText(e), "err"); } });
    const db = el("button", "ds-btn ds-btn-ghost ds-btn-sm", t("del")); db.setAttribute("aria-label", t("del") + " — " + s.title);
    db.addEventListener("click", async () => {
      if (!(await askConfirm(t("confirmOne")))) return;
      db.disabled = true;
      try { await api("/v1/stories/" + s.id, { method: "DELETE" }); } catch (e) { db.disabled = false; setStatus(t("opFailed") + " " + errText(e) + " — " + t("retryHint"), "err"); return; }
      setStatus(t("deleted"), "ok"); loadList(); // ricarica dal server = verifica
    });
    btns.appendChild(eb); btns.appendChild(db); row.appendChild(btns);
    box.appendChild(row);
  }
}
$("exportBtn").addEventListener("click", () => { location.assign(BACKEND + "/v1/stories/export"); });
$("deleteAllBtn").addEventListener("click", async () => {
  if (!(await askConfirm(t("confirmAll")))) return;
  try {
    await api("/v1/stories", { method: "DELETE" });
    const d = await apiJson("/v1/stories"); if (d && d.used) throw new Error("verify");
  } catch (e) { setStatus(t("opFailed") + " " + errText(e) + " — " + t("retryHint"), "err"); loadList(); return; }
  setStatus(t("deletedAll"), "ok"); loadList();
});

/* ── suggerimenti (revisione obbligatoria) ── */
$("suggestBtn").addEventListener("click", () => { $("suggestCard").style.display = ""; $("cvPaste").focus(); });
$("suggestClose").addEventListener("click", () => { $("suggestCard").style.display = "none"; $("candList").textContent = ""; });
$("suggestGo").addEventListener("click", async () => {
  $("suggestGo").disabled = true; $("candList").textContent = ""; $("suggestModel").textContent = ""; setStatus(t("suggestWorking"), "");
  try {
    const d = await apiJson("/v1/stories/suggest", { method: "POST", body: JSON.stringify({ cv: $("cvPaste").value.trim() || undefined, language: t("lang") }), timeoutMs: 120000 });
    setStatus("", "");
    $("suggestModel").textContent = d.model ? `${d.model}${d.eu ? " · EU" : ""}` : "";
    const list = d.candidates || [];
    if (!list.length) { $("candList").appendChild(el("p", "ds-muted", t("suggestNone"))); return; }
    list.forEach((c, i) => {
      const card = el("div", "cand");
      card.appendChild(el("h3", null, c.title));
      const dl = el("dl");
      [["S", c.situation], ["T", c.task], ["A", c.action], ["R", c.result + (c.metric ? " — " + c.metric : "")]].forEach(([k, v]) => { dl.appendChild(el("dt", null, k)); dl.appendChild(el("dd", null, v || "")); });
      card.appendChild(dl);
      if (c.evidence) card.appendChild(el("div", "ev", "“" + c.evidence + "”"));
      const btns = el("div", "btns");
      const rb = el("button", "ds-btn ds-btn-primary ds-btn-sm", t("review"));
      rb.addEventListener("click", () => openEditor({ ...c, source: "cv" }, { title: t("reviewT"), onSaved: () => card.remove() }));
      const xb = el("button", "ds-btn ds-btn-ghost ds-btn-sm", t("discard"));
      xb.addEventListener("click", () => card.remove());
      btns.appendChild(rb); btns.appendChild(xb); card.appendChild(btns);
      $("candList").appendChild(card);
    });
  } catch (e) { setStatus(t("opFailed") + " " + errText(e), "err"); }
  finally { $("suggestGo").disabled = false; }
});

/* ── avvio ── */
async function boot() {
  applyLang();
  try { await api("/v1/me"); }
  catch (e) { $("loginCard").style.display = ""; return; }
  $("actionsCard").style.display = ""; $("listCard").style.display = "";
  await loadList();
}
boot();
