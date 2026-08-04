# 🎧 Live Call Copilot

**Copilota per call e colloqui — nel browser, senza installare nulla, con la tua chiave AI.**
Ascolta la conversazione, ti suggerisce la risposta in inglese e la traduce in italiano in tempo reale.

> Open-source · Nessuna installazione · Bring-Your-Own-Key (Google Gemini) · La tua chiave e i tuoi dati restano nel tuo browser.

![status](https://img.shields.io/badge/status-MVP-blue) ![license](https://img.shields.io/badge/license-MIT-green) ![no%20install](https://img.shields.io/badge/install-none-brightgreen)

---

## 🇮🇹 Cos'è

Un unico file HTML che trasforma il tuo browser in un assistente per le call:

- **Trascrizione live** di ciò che dice l'interlocutore (riconoscimento vocale di Chrome).
- **Risposte suggerite** generate con **Google Gemini** (la tua chiave, gratuita).
- **Traduzione** della domanda in italiano.
- **Risposta automatica**: appena l'altro fa una pausa, la risposta compare da sola.
- **Contesto personale**: incolli CV e ruolo → le risposte sono cucite su di te.
- **Memoria locale**: chiave e impostazioni salvate solo sul tuo computer.

Perché diverso dalle app "interview copilot" desktop: qui **non installi niente**, si apre da un link, ed è pensato per un uso **trasparente** (assistente linguistico / secondo schermo), non per nascondersi.

## 🚀 Come si usa (2 minuti)

1. Apri `index.html` (o la versione online — vedi sotto).
2. Crea una chiave Gemini gratuita su **[Google AI Studio](https://aistudio.google.com/apikey)** e incollala.
3. Premi **"Verifica & carica"** → sceglie da solo un modello valido.
4. (Opzionale) Incolla CV e posizione nel campo "contesto".
5. Premi **🎙 Ascolta** (audio della call dagli altoparlanti) oppure scrivi la domanda.
6. Leggi la risposta suggerita. Attiva **⚡** per la risposta automatica.

## 🌐 Versione online (GitHub Pages)

Abilitando GitHub Pages su questo repo, l'app è raggiungibile da un link pubblico
(`https://<utente>.github.io/<repo>/`) senza scaricare nulla — ideale per provarla o condividerla.

## 🔒 Privacy

- La chiave API e il contesto restano **nel tuo browser** (memoria locale opzionale).
- Le richieste vanno **solo** a Google (Gemini) e al riconoscimento vocale di Chrome.
- Nessun server intermedio, nessun tracciamento.

## 🧩 Come funziona (architettura)

```
Microfono/altoparlanti → Web Speech API (trascrizione) → Google Gemini (con il tuo contesto) → risposta + traduzione
```

Tutto lato client, in un singolo file. Nessun backend.

## 🛠️ Limiti onesti

- Il browser **non** può catturare l'audio di sistema in modo silenzioso né nascondersi dalla condivisione schermo (paletti di sicurezza del browser). Per quello serve un'app desktop.
- Il riconoscimento vocale funziona al meglio su **Google Chrome**.
- Il piano gratuito di Gemini ha limiti di velocità.

## 🗺️ Roadmap (idee per chi vuole forkare)

- Cattura audio della scheda del browser (tab audio) via `getDisplayMedia`.
- Supporto ad altri provider (OpenAI, Claude, modelli locali).
- Modalità "seconda finestra" compatta.
- Versione SaaS con backend + chiave universale + pagamenti.

## 📄 Licenza

MIT — libero di usare, modificare, forkare e migliorare. Vedi [LICENSE](LICENSE).

## ⚠️ Uso responsabile

Usare suggerimenti AI durante una selezione può violare le regole del datore di lavoro.
Registrare o inviare a un servizio AI la voce di altri partecipanti richiede il loro consenso (GDPR).
Questo strumento è pensato per un uso trasparente e consapevole.

---

## 🇬🇧 In short

A single-file, no-install, browser-based **call & interview copilot**. Live transcription + AI answer
suggestions (Google Gemini, bring-your-own-key) + Italian translation. Your key and data stay in your browser.
Open the HTML file, paste your free Gemini key, press listen. MIT licensed — fork and improve freely.
