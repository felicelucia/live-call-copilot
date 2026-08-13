/* ═══════════════════════════════════════════════════════════════════════
   Plancia — la vetrina dell'orchestrazione multi-LLM (componente riusabile).

   Uso:
     import { createPlancia } from './assets/plancia.js';
     const plancia = createPlancia(containerEl, { labels: {...} });
     plancia.handleEvent(evento);   // ogni evento SSE del protocollo kit
     plancia.reset();

   Eventi gestiti: kit-start, task-start, task-delta, task-done, task-error,
   kit-done (col recap "chi ha fatto cosa"). Stili in design-system.css (.pl-*).
   ═══════════════════════════════════════════════════════════════════════ */

const DEFAULT_LABELS = {
  queued: "in coda",
  working: "al lavoro",
  done: "fatto",
  error: "errore",
  recapTitle: "Chi ha fatto cosa",
  agents: "agenti",
  models: "modelli",
  euData: "dati in UE",
  seconds: "s totali",
  chars: "caratteri",
};

const AGENT_ICONS = { analista: "🔍", sarto: "✂️", intervistatore: "🎤", mail: "✉️" };

export function createPlancia(container, opts = {}) {
  const L = Object.assign({}, DEFAULT_LABELS, opts.labels || {});
  const state = new Map(); // task id → {els, chars}

  function el(tag, cls, text) {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  function fmtSec(ms) {
    return (ms / 1000).toFixed(1).replace(".", ",") + " s";
  }

  function reset() {
    container.innerHTML = "";
    state.clear();
    container.classList.add("pl-board");
  }

  function renderStart(tasks) {
    reset();
    const grid = el("div", "pl-grid");
    for (const t of tasks) {
      const card = el("div", "pl-card");
      const head = el("div", "pl-head");
      head.appendChild(el("span", null, AGENT_ICONS[t.task] || "🤖"));
      head.appendChild(el("span", "pl-agent", t.agent));
      const st = el("span", "pl-state", L.queued);
      head.appendChild(st);
      card.appendChild(head);
      const badge = el("span", "ds-badge", "…");
      badge.style.visibility = "hidden";
      card.appendChild(badge);
      const reason = el("div", "pl-reason", "");
      card.appendChild(reason);
      const live = el("div", "pl-live", "");
      card.appendChild(live);
      grid.appendChild(card);
      state.set(t.task, { card, st, badge, reason, live, chars: 0 });
    }
    container.appendChild(grid);
  }

  function handleEvent(e) {
    if (!e || !e.type) return;
    if (e.type === "kit-start") return renderStart(e.tasks || []);
    if (e.type === "kit-done") return renderRecap(e.recap);

    const s = state.get(e.task);
    if (!s) return;

    if (e.type === "task-start") {
      s.card.className = "pl-card working";
      s.st.className = "pl-state working";
      s.st.innerHTML = "";
      const dot = el("span", "pl-dot");
      s.st.appendChild(dot);
      s.st.appendChild(document.createTextNode(L.working));
      s.badge.style.visibility = "visible";
      s.badge.className = "ds-badge" + (e.eu ? " eu" : "");
      s.badge.textContent = (e.eu ? "🇪🇺 " : "🌐 ") + (e.label || e.model);
      s.reason.textContent = e.reason || "";
      s.chars = 0;
    } else if (e.type === "task-delta") {
      s.chars += (e.text || "").length;
      s.live.textContent = "▍ " + s.chars + " " + L.chars + "…";
    } else if (e.type === "task-done") {
      s.card.className = "pl-card done";
      s.st.className = "pl-state done";
      s.st.textContent = "✓ " + L.done + " · " + fmtSec(e.ms);
      s.live.textContent = "";
    } else if (e.type === "task-error") {
      s.card.className = "pl-card error";
      s.st.className = "pl-state error";
      s.st.textContent = "✗ " + L.error;
      s.reason.textContent = e.message || "";
      s.live.textContent = "";
    }
  }

  function renderRecap(recap) {
    if (!recap) return;
    const box = el("div", "pl-recap");
    box.appendChild(el("h4", null, L.recapTitle));
    const okTasks = (recap.tasks || []).filter((t) => t.ok);
    for (const t of recap.tasks || []) {
      const row = el("div", "pl-recap-row");
      row.appendChild(el("span", null, AGENT_ICONS[t.task] || "🤖"));
      row.appendChild(el("strong", null, t.agent));
      if (t.ok) {
        const b = el("span", "ds-badge" + (t.eu ? " eu" : ""));
        b.textContent = (t.eu ? "🇪🇺 " : "🌐 ") + (t.label || t.model);
        row.appendChild(b);
        const ms = el("span", "ds-muted", fmtSec(t.ms));
        ms.style.marginLeft = "auto";
        row.appendChild(ms);
      } else {
        const b = el("span", "ds-badge warn", "✗ " + L.error);
        row.appendChild(b);
      }
      box.appendChild(row);
    }
    const models = [...new Set(okTasks.map((t) => t.model))];
    const foot = el("div", "pl-recap-foot");
    foot.appendChild(el("span", null, okTasks.length + " " + L.agents));
    foot.appendChild(el("span", null, models.length + " " + L.models));
    if (recap.allEu) {
      // mini-badge UE (.ds-eu): l'emoji bandiera su Windows degrada a "EU" nudo
      const eu = el("span", null, L.euData + " ");
      eu.appendChild(el("span", "ds-eu", "EU"));
      foot.appendChild(eu);
    }
    foot.appendChild(el("span", null, fmtSec(recap.totalMs).replace(" s", "") + " " + L.seconds));
    box.appendChild(foot);
    container.appendChild(box);
  }

  reset();
  return { handleEvent, reset };
}
