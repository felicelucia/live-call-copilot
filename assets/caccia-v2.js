/* Il Cacciatore "everyman" (§7): dove sta il lavoro per te. Solo nodi DOM,
   helper del nucleo, nessun invio: i link li apre l'utente, di persona. */
(function(){
  const $=id=>document.getElementById(id);
  const BRAND=window.LCC.BRAND;
  const BACKEND=location.protocol.startsWith("http")?location.origin:"http://127.0.0.1:8787";
  const T={
    it:{skipLink:"Salta al contenuto",brandSub:"Dove sta il lavoro per te · beta",toJobs:"🔎 Offerte",toKit:"✨ Kit",docTitle:"Dove sta il lavoro per te — "+BRAND,
      heroH:"Dove sta il lavoro per te",heroP:"Market intelligence per il candidato: dimmi mestiere e zona e ti mostro le aziende che pubblicano annunci lì (fonti pubbliche), quanto si guadagna e in quali aree conviene spostarsi. Se incolli il CV, evidenzio cosa del tuo percorso è pertinente per ciascuna — solo con prove vere. Nessun abbinamento, nessun contatto per conto tuo: decidi e scrivi tu.",
      whatL:"Mestiere / ruolo",whatPh:"es. account executive, saldatore, infermiere…",whereL:"Zona",wherePh:"es. Milano, Bolzano, Bari…",countryL:"Paese",
      cvL:"CV o note (facoltativo: serve per il «perché sei adatto»)",cvPh:"Incolla il CV o qualche punto della tua esperienza…",
      go:"🧭 Cerca dove sta il lavoro",cancel:"⏹ Annulla",working:"Guardo annunci, stipendi e aree… (10–20 s)",needFields:"Compila mestiere e zona.",
      guard:"Come funziona: solo dati pubblici sulle aziende (annunci aggregati dalle job board), nessuna email né dati di persone, nessun invio automatico — contatti tu, di persona. Il «perché sei adatto» usa solo il tuo CV e la tua Story Bank; se manca una prova, lo dice.",
      compH:"Aziende che assumono qui",compSub:"Dagli annunci pubblici del mestiere nella zona. Il segnale «sta assumendo ora / in crescita» viene dal numero e dalla freschezza degli annunci.",
      sig:{hiring_now:"sta assumendo ora",growing:"in crescita (più annunci)",open:"posizioni aperte"},ads:"annunci",latest:"ultimo",fitNone:"nessuna prova nel profilo per questo tipo di azienda",
      openJobs:"annuncio",site:"cerca il sito",maps:"cerca su Maps",prep:"✍️ Prepara il contatto",prepWorking:"Preparo una bozza…",prepT:"Bozza (assistita da IA) da inviare TU dal canale ufficiale dell'azienda — pagina Careers o casella generica. Rileggi e adatta.",copy:"⧉ Copia",copied:"Copiato ✔",noComp:"Nessuna azienda trovata negli annunci per questa combinazione: prova un mestiere più generico o una zona vicina.",
      earnH:"Quanto puoi guadagnare",medLoc:"mediana nella zona",medNat:"mediana nazionale",range:"metà centrale (25°–75°)",sample:"annunci con retribuzione",noEarn:"Pochi annunci con retribuzione dichiarata nella zona: guarda il dato nazionale.",
      moveH:"Dove conviene spostarti",area:"Area",median:"Mediana",real:"Reale (÷ costo vita)",demand:"Domanda",delta:"vs qui",noMove:"Non ho abbastanza dati per confrontare altre aree.",moveNote:"Stipendio reale = mediana locale ÷ indice del costo della vita (Milano=100), pesato dalla domanda. Fonte costo-vita: {s}. Stima indicativa, non una previsione.",
      err:"Errore:",errNet:"backend non raggiungibile",errTimeout:"tempo scaduto, riprova",quota:"Hai usato le ricerche gratuite di oggi: crea l'account gratuito.",
      foot:"Solo dati pubblici sulle aziende · nessun invio · nessuna email di persone. Le fasi future (contatti su licenza, outbound) richiedono un parere legale e non sono qui.",lang:"italiano"},
    en:{skipLink:"Skip to content",brandSub:"Where the work is for you · beta",toJobs:"🔎 Jobs",toKit:"✨ Kit",docTitle:"Where the work is for you — "+BRAND,
      heroH:"Where the work is for you",heroP:"Market intelligence for the candidate: tell me the trade and the area and I show the companies posting ads there (public sources), what it pays and which areas are worth moving to. Paste your CV and I highlight what in your background is relevant to each — only with real evidence. No matching, no contact on your behalf: you decide and you write.",
      whatL:"Trade / role",whatPh:"e.g. account executive, welder, nurse…",whereL:"Area",wherePh:"e.g. Milan, Bolzano, Bari…",countryL:"Country",
      cvL:"CV or notes (optional: needed for “why you fit”)",cvPh:"Paste your CV or a few points about your experience…",
      go:"🧭 Find where the work is",cancel:"⏹ Cancel",working:"Looking at ads, salaries and areas… (10–20 s)",needFields:"Fill in trade and area.",
      guard:"How it works: only public company data (ads aggregated from job boards), no emails or personal data, no automatic sending — you reach out yourself. “Why you fit” uses only your CV and Story Bank; if evidence is missing, it says so.",
      compH:"Companies hiring here",compSub:"From public ads for the trade in the area. The “hiring now / growing” signal comes from the number and freshness of ads.",
      sig:{hiring_now:"hiring now",growing:"growing (more ads)",open:"open positions"},ads:"ads",latest:"latest",fitNone:"no evidence in the profile for this kind of company",
      openJobs:"ad",site:"find website",maps:"find on Maps",prep:"✍️ Prepare the contact",prepWorking:"Preparing a draft…",prepT:"Draft (AI-assisted) for YOU to send via the company's official channel — Careers page or generic mailbox. Re-read and adapt.",copy:"⧉ Copy",copied:"Copied ✔",noComp:"No company found in ads for this combination: try a broader trade or a nearby area.",
      earnH:"What you can earn",medLoc:"median in the area",medNat:"national median",range:"middle half (25th–75th)",sample:"ads with pay",noEarn:"Few ads with declared pay in the area: see the national figure.",
      moveH:"Where it's worth moving",area:"Area",median:"Median",real:"Real (÷ cost of living)",demand:"Demand",delta:"vs here",noMove:"Not enough data to compare other areas.",moveNote:"Real salary = local median ÷ cost-of-living index (Milan=100), weighted by demand. Cost-of-living source: {s}. Indicative estimate, not a forecast.",
      err:"Error:",errNet:"backend unreachable",errTimeout:"timed out, retry",quota:"You used today's free searches: create the free account.",
      foot:"Only public company data · no sending · no personal emails. Future phases (licensed contacts, outbound) require legal review and are not here.",lang:"english"}
  };
  let LANG=window.LCC.getLang(["it","en"],"en");
  const t=k=>T[LANG][k]??k;
  const el=(tag,cls,text)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(text!==undefined)n.textContent=text;return n;};
  const eur=n=>n==null?"—":(LANG==="it"?"€ "+Math.round(n).toLocaleString("it-IT"):"€"+Math.round(n).toLocaleString("en-GB"));
  function applyLang(){document.documentElement.lang=LANG;document.title=t("docTitle");
    const md=document.querySelector('meta[name="description"]');if(md)md.setAttribute("content",t("heroP"));
    [...$("langSeg").querySelectorAll("button")].forEach(c=>{const on=c.getAttribute("data-lang")===LANG;c.classList.toggle("on",on);c.setAttribute("aria-pressed",String(on));});
    document.querySelectorAll("[data-i]").forEach(e=>{const v=t(e.getAttribute("data-i"));if(typeof v==="string")e.textContent=v;});
    document.querySelectorAll("[data-i-ph]").forEach(e=>e.placeholder=t(e.getAttribute("data-i-ph")));
    if(last)render(last);}
  $("langSeg").addEventListener("click",e=>{const b=e.target.closest("button");if(!b)return;LANG=b.getAttribute("data-lang");window.LCC.setLang(LANG);applyLang();});
  const setStatus=(m,c)=>{$("status").textContent=m;$("status").className="ds-status "+(c||"");if(c==="err"&&m){const a=$("a11yAlert");a.textContent="";a.textContent=m;}};

  let last=null,req=null;
  function render(d){
    last=d; $("results").style.display="";
    // aziende
    const box=$("companies"); box.textContent="";
    if(!d.companies.length){box.appendChild(el("p","ds-muted",t("noComp")));}
    d.companies.forEach(c=>{
      const row=el("div","co"); const who=el("div","who");
      who.appendChild(el("b",null,c.name));
      who.appendChild(el("span","sig "+c.signal," "+t("sig")[c.signal]));
      who.appendChild(el("div","meta",[c.ads+" "+t("ads"),c.titles.join(" · "),c.locations.join(", "),c.latest?t("latest")+" "+c.latest:null].filter(Boolean).join(" — ")));
      if(c.fit){const f=el("div","fit");f.appendChild(el("span",null,"✔ "+c.fit.why));if(c.fit.evidence){f.appendChild(document.createTextNode(" "));f.appendChild(el("span","ev","("+c.fit.evidence+")"));}who.appendChild(f);}
      row.appendChild(who);
      const links=el("div","links");
      c.links.jobs.forEach((u,i)=>{const a=el("a","ds-btn ds-btn-ghost ds-btn-sm",t("openJobs")+" "+(i+1));a.href=u;a.target="_blank";a.rel="noopener noreferrer";links.appendChild(a);});
      const s=el("a","ds-btn ds-btn-ghost ds-btn-sm",t("site"));s.href=c.links.site_search;s.target="_blank";s.rel="noopener noreferrer";links.appendChild(s);
      const m=el("a","ds-btn ds-btn-ghost ds-btn-sm",t("maps"));m.href=c.links.maps_search;m.target="_blank";m.rel="noopener noreferrer";links.appendChild(m);
      // "prepara il contatto": bozza che l'utente copia e invia da sé (nessun invio dal prodotto)
      const pb=el("button","ds-btn ds-btn-primary ds-btn-sm",t("prep"));
      const out=el("div","fit"); out.style.display="none";
      pb.addEventListener("click",async()=>{
        pb.disabled=true; out.style.display=""; out.textContent=t("prepWorking");
        try{
          const r=await window.LCC.api.json(BACKEND+"/v1/hunt/contact-draft",{method:"POST",timeoutMs:60000,body:JSON.stringify({company:c.name,titles:c.titles,what:$("what").value.trim(),cv:$("cv").value.trim()||undefined,language:t("lang")})});
          out.textContent=""; out.appendChild(el("div","ev",t("prepT")));
          const pre=el("pre",null,r.text||""); pre.style.whiteSpace="pre-wrap"; pre.style.font="inherit"; out.appendChild(pre);
          const cb=el("button","ds-btn ds-btn-ghost ds-btn-sm",t("copy")); cb.addEventListener("click",()=>{navigator.clipboard.writeText(r.text||"").then(()=>{cb.textContent=t("copied");setTimeout(()=>cb.textContent=t("copy"),1500);}).catch(()=>{});}); out.appendChild(cb);
        }catch(e){ out.textContent=t("err")+" "+((e&&e.message)||"?"); }
        finally{ pb.disabled=false; }
      });
      links.appendChild(pb); row.appendChild(links); row.appendChild(out); box.appendChild(row);
    });
    // stipendio
    const e=$("earn"); e.textContent="";
    const st=el("div","stats");
    const tile=(n,l)=>{const s=el("div","stat");s.appendChild(el("div","n",n));s.appendChild(el("div","l",l));return s;};
    if(d.earn.local){st.appendChild(tile(eur(d.earn.local.median),t("medLoc")+" ("+d.where+")"));st.appendChild(tile(eur(d.earn.local.p25)+"–"+eur(d.earn.local.p75),t("range")));st.appendChild(tile(String(d.earn.local.sample),t("sample")));}
    else e.appendChild(el("p","ds-muted",t("noEarn")));
    if(d.earn.national){st.appendChild(tile(eur(d.earn.national.median),t("medNat")));}
    e.appendChild(st);
    // spostarsi
    $("moveNote").textContent=t("moveNote").replace("{s}",d.move.source.name);
    const mv=$("move"); mv.textContent="";
    if(!d.move.areas.length){mv.appendChild(el("p","ds-muted",t("noMove")));}
    else{const tb=el("table","mv");const th=el("thead");const tr=el("tr");[t("area"),t("median"),t("real"),t("demand"),t("delta")].forEach(h=>{const c=el("th",null,h);c.setAttribute("scope","col");tr.appendChild(c);});th.appendChild(tr);tb.appendChild(th);
      const tbd=el("tbody");d.move.areas.forEach(a=>{const r=el("tr");r.appendChild(el("td",null,a.label));r.appendChild(el("td",null,eur(a.median)));r.appendChild(el("td",null,eur(a.realMedian)));r.appendChild(el("td",null,String(a.demand)));const dl=el("td","delta "+((a.deltaPct||0)>=0?"up":"down"),a.deltaPct==null?"—":((a.deltaPct>=0?"+":"")+a.deltaPct+"%"));r.appendChild(dl);tbd.appendChild(r);});tb.appendChild(tbd);mv.appendChild(tb);}
  }

  $("huntForm").addEventListener("submit",async e=>{
    e.preventDefault();
    const what=$("what").value.trim(),where=$("where").value.trim();
    if(what.length<2||where.length<2){setStatus(t("needFields"),"err");return;}
    req=window.LCC.abortScope("hunt"); $("goBtn").disabled=true;$("cancelBtn").style.display="";setStatus(t("working"),"work");
    try{
      const d=await window.LCC.api.json(BACKEND+"/v1/hunt",{method:"POST",signal:req.signal,timeoutMs:90000,body:JSON.stringify({what,where,country:$("country").value,cv:$("cv").value.trim()||undefined,language:t("lang")})});
      setStatus("",""); render(d); $("results").scrollIntoView({behavior:"smooth",block:"start"});
    }catch(err){
      if(err&&err.status===429)setStatus(t("quota"),"err");
      else if(err&&err.message==="aborted")setStatus("","");
      else setStatus(t("err")+" "+(err&&err.message==="network"?t("errNet"):err&&/^timeout/.test(err.message||"")?t("errTimeout"):(err&&err.message)||"?"),"err");
    }finally{$("goBtn").disabled=false;$("cancelBtn").style.display="none";}
  });
  $("cancelBtn").addEventListener("click",()=>{if(req)req.abort();});
  applyLang();
})();
