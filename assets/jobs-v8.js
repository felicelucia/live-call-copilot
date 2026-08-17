(function(){
const BRAND=window.LCC.BRAND;
  const $=id=>document.getElementById(id);
  const BACKEND=location.protocol.startsWith("http")?location.origin:"http://127.0.0.1:8787";

  const T={
    it:{docTitle:"Cerca offerte — "+BRAND+"",docDesc:"Cerca offerte di lavoro reali e genera in un click il Kit di candidatura su misura: CV, mail e domande probabili.",skipLink:"Salta al contenuto",resultsH:"Risultati della ricerca",brandSub:"Cerca offerte · beta",h1:"Cerca offerte reali",
      sub:"Trova l'annuncio giusto e genera in un click il Kit su misura: CV, mail e domande probabili.",
      qL:"Cosa cerchi",qPh:"Es: account executive, project manager…",lL:"Dove",lPh:"Es: Milano, remoto…",
      cL:"Paese",go:"🔎 Cerca",searching:"Cerco…",none:"Nessuna offerta trovata: prova con altre parole.",
      kitBtn:"✨ Genera Kit",kitPrep:"Preparo il Kit…",errNet:"Backend non raggiungibile.",errTimeout:"Tempo scaduto: riprova.",rateLimited:"Troppe richieste: riprova tra {s}s",
      notConf:"🔌 La ricerca offerte non è ancora attiva: stiamo completando l'accesso all'API ufficiale del provider. Nel frattempo puoi incollare qualunque annuncio direttamente nel Kit di candidatura.",
      openKit:"→ Apri il Kit",results:"offerte",attrib:"Ricerca offerte fornita da {p}. I link di candidatura portano a {p}."},
    en:{docTitle:"Job search — "+BRAND+"",docDesc:"Search real job ads and generate the tailored Application Kit in one click: CV, email and likely questions.",skipLink:"Skip to content",resultsH:"Search results",brandSub:"Job search · beta",h1:"Search real job ads",
      sub:"Find the right ad and generate the tailored Kit in one click: CV, email and likely questions.",
      qL:"What",qPh:"E.g. account executive, project manager…",lL:"Where",lPh:"E.g. Milan, remote…",
      cL:"Country",go:"🔎 Search",searching:"Searching…",none:"No jobs found: try different words.",
      kitBtn:"✨ Generate Kit",kitPrep:"Preparing the Kit…",errNet:"Backend unreachable.",errTimeout:"Timed out: please retry.",rateLimited:"Too many requests: retry in {s}s",
      notConf:"🔌 Job search is not active yet: we are completing access to the provider's official API. Meanwhile you can paste any job ad directly into the Application Kit.",
      openKit:"→ Open the Kit",results:"jobs",attrib:"Job search powered by {p}. Apply links go to {p}."}
  };
  let LANG=window.LCC.getLang(["it","en"],"en");
  const t=k=>T[LANG][k]||k;
  // Attribuzione guidata dal provider REALE (requisito dei termini Adzuna):
  // mai una stringa fissa — footer dal provider attivo, riga per riga dal
  // source del singolo annuncio. Fallback: nome del provider capitalizzato.
  let provider=null;
  const PROVIDER_LABELS={adzuna:"Adzuna",indeed:"Indeed"};
  const providerLabel=p=>PROVIDER_LABELS[p]||(p?p.charAt(0).toUpperCase()+p.slice(1):null);
  function attribText(){const p=providerLabel(provider);return p?t("attrib").split("{p}").join(p):"";}
  function applyLang(){document.documentElement.lang=LANG;
  const __ls=document.getElementById("langSeg"); if(__ls){[...__ls.querySelectorAll("button")].forEach((c)=>{const on=c.getAttribute("data-lang")===LANG;c.classList.toggle("on",on);c.setAttribute("aria-pressed",String(on));});}document.title=t("docTitle");const md=document.querySelector('meta[name="description"]');if(md)md.setAttribute("content",t("docDesc"));
    document.querySelectorAll("[data-i]").forEach(el=>{const k=el.getAttribute("data-i");el.textContent=k==="attrib"?attribText():t(k);});
    document.querySelectorAll("[data-i-ph]").forEach(el=>{el.placeholder=t(el.getAttribute("data-i-ph"));});}
  // provider noto fin dal caricamento (non solo dopo la prima ricerca)
  (async()=>{try{const r=await fetch(BACKEND+"/v1/jobs/meta");if(r.ok){const m=await r.json();if(m.provider){provider=m.provider;applyLang();}}}catch(_){}})();
  $("langSeg").addEventListener("click",e=>{const b=e.target.closest("button");if(!b)return;LANG=b.getAttribute("data-lang");window.LCC.setLang(LANG);[...$("langSeg").children].forEach(c=>{const on=c===b;c.classList.toggle("on",on);c.setAttribute("aria-pressed",String(on));});applyLang();});

  const esc=s=>String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
  // gli URL del provider finiscono in href: solo schemi http/https (mai javascript: ecc.)
  const safeUrl=u=>/^https?:\/\//i.test(String(u||""))?String(u):"#";
  function setStatus(m,c){$("status").textContent=m;$("status").className="ds-status "+(c||"");
    if(c==="err"&&m){const a=$("a11yAlert");if(a){a.textContent="";a.textContent=m;}}}

  let lastJobs=[];
  function render(jobs){
    lastJobs=jobs;
    const box=$("results"); box.innerHTML="";
    if(!jobs.length){ box.innerHTML='<p class="ds-muted">'+t("none")+"</p>"; }
    jobs.forEach((j,i)=>{
      const div=document.createElement("div"); div.className="job";
      div.innerHTML='<div class="body"><h3><a href="'+esc(safeUrl(j.applyUrl))+'" target="_blank" rel="noopener">'+esc(j.title)+"</a></h3>"
        +'<div class="meta">'+esc(j.company)+(j.location?" · "+esc(j.location):"")
        +(j.salary?' · <span class="ds-badge">'+esc(j.salary)+"</span>":"")
        +(j.postedAt?' · <span>'+esc(j.postedAt)+"</span>":"")
        +(providerLabel(j.source)?' · <a href="'+esc(safeUrl(j.applyUrl))+'" target="_blank" rel="noopener" style="color:var(--ds-muted)">via '+esc(providerLabel(j.source))+"</a>":"")+"</div>"
        +(j.snippet?'<div class="snip">'+esc(j.snippet)+"</div>":"")+"</div>"
        +'<button class="ds-btn ds-btn-ghost ds-btn-sm" data-kit="'+i+'" aria-label="'+esc(t("kitBtn"))+' — '+esc(j.title)+'">'+t("kitBtn")+"</button>";
      box.appendChild(div);
    });
    $("resultsCard").style.display="";
  }

  async function search(){
    const q=$("q").value.trim(); if(q.length<2){setStatus(t("none"),"err");return;}
    $("goBtn").disabled=true; setStatus(t("searching"),"");
    $("notConf").style.display="none";
    try{
      const params=new URLSearchParams({search:q,country:$("country").value});
      if($("loc").value.trim()) params.set("location",$("loc").value.trim());
      const req=window.LCC.abortScope("jobs"); // nuova ricerca annulla la precedente
      let d;
      try{ d=await window.LCC.api.json(BACKEND+"/v1/jobs?"+params.toString(),{signal:req.signal,timeoutMs:20000}); }
      catch(e){
        if(e&&e.status===503){ $("resultsCard").style.display="none";
          $("notConf").innerHTML=esc(t("notConf"))+' <a href="kit.html">'+esc(t("openKit"))+"</a>";
          $("notConf").style.display=""; setStatus("",""); return; }
        if(e&&e.status===429) throw new Error(t("rateLimited").replace("{s}",String(e.retryAfter||30)));
        if(e&&e.message==="network") throw new Error(t("errNet"));
        if(e&&e.message==="timeout") throw new Error(t("errTimeout"));
        if(e&&e.message==="aborted") return;
        throw e;
      }
      if(d.provider){provider=d.provider;applyLang();}
      render(d.jobs||[]);
      setStatus((d.total||d.jobs.length)+" "+t("results"),"ok");
    }catch(e){ setStatus(e.message,"err"); }
    finally{ $("goBtn").disabled=false; }
  }
  $("searchForm").addEventListener("submit",e=>{e.preventDefault();search();});

  /* "Genera Kit": prende la descrizione (dettaglio, o snippet come riserva)
     e passa l'annuncio a kit.html via sessionStorage — effimero, zero server. */
  $("results").addEventListener("click",async e=>{
    const b=e.target.closest("button[data-kit]"); if(!b)return;
    const j=lastJobs[Number(b.getAttribute("data-kit"))]; if(!j)return;
    b.disabled=true; b.textContent=t("kitPrep");
    let description=j.snippet||"";
    try{
      const d=await window.LCC.api.json(BACKEND+"/v1/jobs/"+encodeURIComponent(j.id),{timeoutMs:15000});
      if(d&&d.description) description=d.description;
    }catch(_){}
    const srcLabel=providerLabel(j.source)||"provider";
    const jobAd=j.title+"\n"+j.company+(j.location?" — "+j.location:"")+(j.salary?"\n"+j.salary:"")+"\n\n"+description
      +"\n\n[Fonte: "+srcLabel+" — "+safeUrl(j.applyUrl)+"]";
    try{ sessionStorage.setItem("lcc_kit_prefill",JSON.stringify({jobAd:jobAd.slice(0,12000),autostart:true})); }catch(_){}
    location.href="kit.html";
  });

  applyLang();
})();
