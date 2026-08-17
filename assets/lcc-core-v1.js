/* Live Call Copilot — nucleo condiviso (classic script: espone window.LCC)
   1) REGISTRO UNICO dei namespace sensibili in localStorage/sessionStorage:
      ogni pagina che salva qualcosa lo fa dentro uno di questi prefissi, così
      "Cancella chiavi e dati locali" li azzera TUTTI, ovunque.
   2) Storage opt-in: localStorage si legge SOLO con "Ricorda" attivo
      (v5_remember='1' in localStorage). Senza opt-in, le copie legacy in
      localStorage vengono migrate in sessionStorage e cancellate (v2).
   3) Helper API unico: lancia SEMPRE su risposta non-2xx e su errore di rete/
      timeout, così nessun flusso può "credere" a un DELETE/PUT fallito.
   Caricato PRIMA degli script di pagina (classic e module). */
(function () {
  'use strict';
  var OPT_IN_KEY = 'v5_remember';
  var MIGRATION_KEY = 'lcc_store_v'; // in sessionStorage: versione migrazione già applicata
  var MIGRATION_VERSION = '2';

  /* Prefissi/chiavi che possono contenere dati personali o segreti:
     app (v5_/v6_/v7_), Practice (prac_), bozze Kit (lcc_kit_), altro nostro (lcc_). */
  var NAMESPACES = ['v5_', 'v6_', 'v7_', 'prac_', 'lcc_kit_', 'lcc_'];
  function isOurs(k) { for (var i = 0; i < NAMESPACES.length; i++) if (k.indexOf(NAMESPACES[i]) === 0) return true; return false; }
  function keysOf(st) { var out = []; try { for (var i = 0; i < st.length; i++) { var k = st.key(i); if (k && isOurs(k)) out.push(k); } } catch (_) {} return out; }

  function hasOptIn() { try { return localStorage.getItem(OPT_IN_KEY) === '1'; } catch (_) { return false; } }

  /* Migrazione versionata: senza opt-in, nulla di nostro deve restare in
     localStorage. Le copie legacy vengono spostate in sessionStorage (così
     l'utente non perde la sessione corrente) e cancellate da localStorage. */
  function migrateLegacy() {
    try {
      if (sessionStorage.getItem(MIGRATION_KEY) === MIGRATION_VERSION) return 0;
    } catch (_) {}
    var moved = 0;
    if (!hasOptIn()) {
      var ks = keysOf(localStorage);
      for (var i = 0; i < ks.length; i++) {
        var k = ks[i]; if (k === OPT_IN_KEY) continue;
        try {
          var v = localStorage.getItem(k);
          if (v !== null && sessionStorage.getItem(k) === null) sessionStorage.setItem(k, v);
          localStorage.removeItem(k); moved++;
        } catch (_) {}
      }
    }
    try { sessionStorage.setItem(MIGRATION_KEY, MIGRATION_VERSION); } catch (_) {}
    return moved;
  }

  /* Facciata storage: sessione prima; localStorage SOLO con opt-in. */
  var store = {
    get: function (k) {
      try { var s = sessionStorage.getItem(k); if (s !== null) return s; } catch (_) {}
      if (!hasOptIn()) return null;
      try { return localStorage.getItem(k); } catch (_) { return null; }
    },
    set: function (k, v) { try { (hasOptIn() ? localStorage : sessionStorage).setItem(k, v); } catch (_) {} },
    del: function (k) { try { localStorage.removeItem(k); } catch (_) {} try { sessionStorage.removeItem(k); } catch (_) {} },
    hasOptIn: hasOptIn,
    setOptIn: function (on) {
      try { if (on) localStorage.setItem(OPT_IN_KEY, '1'); else localStorage.removeItem(OPT_IN_KEY); } catch (_) {}
      if (!on) { // opt-out: via ogni copia persistente dei nostri namespace
        var ks = keysOf(localStorage); for (var i = 0; i < ks.length; i++) { try { localStorage.removeItem(ks[i]); } catch (_) {} }
      }
    }
  };

  /* Purge TOTALE: ogni chiave nostra, in ENTRAMBI gli storage. Ritorna quante. */
  function purgeAll() {
    var n = 0;
    [localStorage, sessionStorage].forEach(function (st) {
      var ks; try { ks = keysOf(st); } catch (_) { ks = []; }
      for (var i = 0; i < ks.length; i++) { try { st.removeItem(ks[i]); n++; } catch (_) {} }
    });
    try { localStorage.removeItem(OPT_IN_KEY); } catch (_) {}
    return n;
  }

  /* Helper API: lancia su non-2xx (con dettaglio dal JSON del server), su
     rete giù e su timeout (AbortController). Mai "successo silenzioso". */
  function ApiError(message, status, body) { this.name = 'ApiError'; this.message = message; this.status = status; this.body = body; }
  ApiError.prototype = Object.create(Error.prototype);
  function api(url, opts) {
    opts = opts || {};
    var timeoutMs = opts.timeoutMs === undefined ? 30000 : opts.timeoutMs;
    var ctrl = new AbortController();
    var timer = null;
    if (opts.signal) opts.signal.addEventListener('abort', function () { ctrl.abort(); });
    if (timeoutMs > 0) timer = setTimeout(function () { ctrl.abort(new DOMException('timeout', 'TimeoutError')); }, timeoutMs);
    var init = {
      method: opts.method || 'GET',
      credentials: 'include',
      headers: Object.assign({ 'Content-Type': 'application/json' }, opts.headers || {}),
      body: opts.body,
      signal: ctrl.signal
    };
    return fetch(url, init).then(function (r) {
      if (r.ok) return r;
      return r.json().catch(function () { return {}; }).then(function (b) {
        var msg = (b && (b.detail || b.error)) || ('HTTP ' + r.status);
        if (typeof msg !== 'string') msg = 'HTTP ' + r.status;
        var e = new ApiError(msg, r.status, b);
        if (r.status === 429) { var ra = r.headers.get('retry-after'); if (ra) e.retryAfter = Number(ra); }
        throw e;
      });
    }, function (err) {
      if (err && (err.name === 'AbortError' || err.name === 'TimeoutError')) {
        throw new ApiError(err.name === 'TimeoutError' || (ctrl.signal.reason && ctrl.signal.reason.name === 'TimeoutError') ? 'timeout' : 'aborted', 0, null);
      }
      throw new ApiError('network', 0, null);
    }).finally(function () { if (timer) clearTimeout(timer); });
  }
  api.json = function (url, opts) { return api(url, opts).then(function (r) { return r.status === 204 ? null : r.json(); }); };

  window.LCC = { NAMESPACES: NAMESPACES, store: store, purgeAll: purgeAll, migrateLegacy: migrateLegacy, hasOptIn: hasOptIn, api: api, ApiError: ApiError };
  migrateLegacy();
})();
