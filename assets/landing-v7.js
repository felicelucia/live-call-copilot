(function(){
const BRAND=window.LCC.BRAND;
  const T={
    it:{
      openApp:"Apri l'app",
      navJobs:"🔎 Offerte",
      navSal:"📊 Stipendi",
      heroH:"Dal job post all'offerta — e ti diciamo anche dove sta il lavoro per te",
      heroP:"Incolla un annuncio: fit motivato, gap onesti, CV su misura, domande probabili e allenamento al colloquio — basati solo su ciò che hai fatto davvero. E poi: dove sta il lavoro per te, quanto rende e dove conviene spostarti. Dati al sicuro in Europa.",
      ctaKit:"✨ Prova il Kit gratis",
      ctaApp:"Apri l'app →",
      ctaNote:"Anteprima libera · il Kit completo è gratis con account (1 minuto, niente carta).",
      p1H:"Mai inventato: tutto parte da te",
      p1P:"CV, risposte e consigli nascono dalle tue esperienze reali (Story Bank) e dal tuo CV. Se manca una prova, te lo diciamo invece di inventarla.",
      p2H:"Prontezza provata",
      p2P:"Allenamento con punteggio, kit cuciti sugli annunci veri, gap detti onestamente, e la mappa di dove assumono nel tuo mestiere. Prepararsi si vede.",
      p3H:"Dati in Europa, di default",
      p3P:"CV, profilo, storie e trascrizioni vanno solo su modelli e server in Europa — lo impone il server, non un interruttore. Se scegli tu un provider extra-UE (chiave tua), te lo diciamo prima. Consenso esplicito, esportazione e cancellazione totale: GDPR sul serio.",
      howH:"Come funziona",
      s1H:"Incolla l'annuncio",
      s1P:"Anche solo per vedere il fit e i gap: l'anteprima è libera, l'account serve per salvare, scaricare e simulare.",
      s2H:"Il kit si costruisce",
      s2P:"Analisi dell'annuncio, CV su misura, mail, domande probabili e piano fino alla data del colloquio — con la fonte di ogni affermazione.",
      s3H:"Candidati e allenati",
      s3P:"Scarica il CV in PDF, prova il colloquio col simulatore, e scopri dove sta il lavoro per te, quanto rende e dove conviene spostarti.",
      footPriv:"Tre modalità, dette chiare: Locale/Ollama (solo dal client desktop) · BYOK (provider scelto da te, con la tua chiave) · Kit e Pro europei (solo modelli e server UE, imposto dal server). I kit sono effimeri: non salviamo nulla senza il tuo consenso; il profilo è cifrato a riposo su server europei.",
      footBeta:"open-core · beta",
      skipLink:"Salta al contenuto",
      pillarsH:"Perché "+BRAND+"",
      docTitle:""+BRAND+" — dal job post all'offerta",docDesc:"Dal job post all'offerta: CV su misura, colloquio allenato, storie vere. E ti diciamo dove sta il lavoro per te, quanto rende e dove conviene spostarti. Dati al sicuro in Europa.",
    },
    en:{
      openApp:"Open the app",
      navJobs:"🔎 Jobs",
      navSal:"📊 Salaries",
      heroH:"From job post to offer — and we tell you where the work is for you",
      heroP:"Paste a job ad: reasoned fit, honest gaps, tailored CV, likely questions and interview training — based only on what you actually did. Then: where the work is for you, what it pays and where it's worth moving. Data safe in Europe.",
      ctaKit:"✨ Try the Kit for free",
      ctaApp:"Open the app →",
      ctaNote:"Open preview · the full Kit is free with an account (1 minute, no card).",
      p1H:"Never invented: it all starts from you",
      p1P:"CV, answers and advice come from your real experiences (Story Bank) and your CV. If a proof is missing we say so instead of making it up.",
      p2H:"Proven readiness",
      p2P:"Scored training, kits tailored to real ads, gaps stated honestly, and the map of who is hiring in your trade. Being prepared shows.",
      p3H:"Data in Europe, by default",
      p3P:"CV, profile, stories and transcripts go only to models and servers in Europe — enforced by the server, not a toggle. If you pick a non-EU provider yourself (your key), we tell you first. Explicit consent, export and total deletion: GDPR for real.",
      howH:"How it works",
      s1H:"Paste the job ad",
      s1P:"Even just to see fit and gaps: the preview is open, the account is for saving, downloading and rehearsing.",
      s2H:"The kit gets built",
      s2P:"Ad analysis, tailored CV, email, likely questions and a plan up to your interview date — with the source of every claim.",
      s3H:"Apply and train",
      s3P:"Download the CV as PDF, rehearse with the simulator, and find out where the work is for you, what it pays and where it's worth moving.",
      footPriv:"Three modes, stated plainly: Local/Ollama (desktop client only) · BYOK (provider you choose, your key) · European Kit and Pro (EU models and servers only, enforced by the server). Kits are ephemeral: we store nothing without your consent; your profile is encrypted at rest on European servers.",
      footBeta:"open-core · beta",
      skipLink:"Skip to content",
      pillarsH:"Why "+BRAND+"",
      docTitle:""+BRAND+" — from job post to offer",docDesc:"From job post to offer: tailored CV, rehearsed interview, real stories. Plus where the work is for you, what it pays and where it's worth moving. Data safe in Europe.",
    }
  };
  let LANG=window.LCC.getLang(["it","en"],"en");
  const t=k=>T[LANG][k]||k;
  function apply(){document.documentElement.lang=LANG;
  const __ls=document.getElementById("langSeg"); if(__ls){[...__ls.querySelectorAll("button")].forEach((c)=>{const on=c.getAttribute("data-lang")===LANG;c.classList.toggle("on",on);c.setAttribute("aria-pressed",String(on));});}document.title=t("docTitle");const md=document.querySelector('meta[name="description"]');if(md)md.setAttribute("content",t("docDesc"));document.querySelectorAll("[data-i]").forEach(el=>el.textContent=t(el.getAttribute("data-i")));}
  document.getElementById("langSeg").addEventListener("click",e=>{const b=e.target.closest("button");if(!b)return;LANG=b.getAttribute("data-lang");window.LCC.setLang(LANG);[...e.currentTarget.children].forEach(c=>{const on=c===b;c.classList.toggle("on",on);c.setAttribute("aria-pressed",String(on));});apply();});
  apply();
})();
