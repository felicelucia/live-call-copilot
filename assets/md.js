/* Mini-renderer markdown condiviso (Kit, Storico) — zero librerie.
   Gestisce: titoli, grassetto/corsivo/code, liste, separatori; toglie le
   recinzioni ``` che i modelli a volte aggiungono. Escape HTML sempre. */

export function cleanMd(raw) {
  return String(raw).trim().replace(/^```[a-z]*\s*\n/i, "").replace(/\n```\s*$/, "").trim();
}

function esc(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function inline(s) {
  return s
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/(^|[^*])\*([^*\n]+)\*/g, "$1<em>$2</em>")
    .replace(/`([^`]+)`/g, "<code>$1</code>");
}

export function renderMd(raw) {
  const lines = cleanMd(esc(String(raw))).split("\n");
  let html = "", list = null;
  const closeList = () => { if (list) { html += `</${list}>`; list = null; } };
  for (const line of lines) {
    const h = line.match(/^(#{1,4})\s+(.*)/);
    const ul = line.match(/^\s*[-*]\s+(.*)/);
    const ol = line.match(/^\s*\d+[.)]\s+(.*)/);
    if (/^\s*-{3,}\s*$/.test(line)) { closeList(); html += "<hr>"; continue; }
    if (h) { closeList(); html += `<h${h[1].length + 1}>${inline(h[2])}</h${h[1].length + 1}>`; }
    else if (ul) { if (list !== "ul") { closeList(); html += "<ul>"; list = "ul"; } html += `<li>${inline(ul[1])}</li>`; }
    else if (ol) { if (list !== "ol") { closeList(); html += "<ol>"; list = "ol"; } html += `<li>${inline(ol[1])}</li>`; }
    else if (!line.trim()) { closeList(); }
    else { closeList(); html += `<p>${inline(line)}</p>`; }
  }
  closeList();
  return html;
}
