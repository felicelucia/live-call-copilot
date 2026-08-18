(function(){
  const $=id=>document.getElementById(id);
  /* Storage OPT-IN agganciato all'interruttore "Ricorda" dell'app (v5_remember):
     senza opt-in tutto vive in sessionStorage (chiavi e CV muoiono con la scheda). */
  const store=window.LCC.store; // facciata condivisa (assets/lcc-core-v1.js): opt-in reale, registro prac_*

  /* ---------- providers ---------- */
  const PROV={
    gemini:{label:'Google Gemini (free)',kind:'gemini',keyUrl:'https://aistudio.google.com/apikey',hint:'AIza...',def:''},
    groq:{label:'Groq — Llama 70B (free, fast)',kind:'openai',base:'https://api.groq.com/openai/v1',keyUrl:'https://console.groq.com/keys',hint:'gsk_...',def:'llama-3.3-70b-versatile',models:['llama-3.3-70b-versatile','llama-3.1-8b-instant']},
    anthropic:{label:'Anthropic — Claude (best quality)',kind:'anthropic',base:'https://api.anthropic.com/v1',keyUrl:'https://console.anthropic.com/settings/keys',hint:'sk-ant-...',def:'claude-3-5-sonnet-latest',models:['claude-3-5-sonnet-latest','claude-3-5-haiku-latest','claude-sonnet-4-20250514']},
    mistral:{label:'Mistral 🇪🇺 (European)',kind:'openai',base:'https://api.mistral.ai/v1',keyUrl:'https://console.mistral.ai/api-keys',hint:'...',def:'mistral-large-latest',models:['mistral-large-latest','mistral-small-latest']},
    openai:{label:'OpenAI — GPT (may be blocked in-browser)',kind:'openai',base:'https://api.openai.com/v1',keyUrl:'https://platform.openai.com/api-keys',hint:'sk-...',def:'gpt-4o',models:['gpt-4o','gpt-4o-mini']}
  };
  const engineEl=$('engine');
  Object.keys(PROV).forEach(k=>{const o=document.createElement('option');o.value=k;o.textContent=PROV[k].label;engineEl.appendChild(o);});
  engineEl.value = store.get('prac_engine')||'gemini';
  function P(){ return PROV[engineEl.value]; }
  function keyStoreName(){ return 'prac_key_'+engineEl.value; }
  function syncEngine(){
    const p=P();
    $('keyLink').href=p.keyUrl||'#'; $('key').placeholder=p.hint||'API key';
    $('key').value = store.get(keyStoreName()) || store.get('v5_key_'+engineEl.value) || (engineEl.value==='gemini'?(store.get('v5_key_gemini')||''):'') || '';
    const dl=$('modelList'); dl.innerHTML=''; (p.models||[]).forEach(m=>{const o=document.createElement('option');o.value=m;dl.appendChild(o);});
    $('model').value = store.get('prac_model_'+engineEl.value) || '';
    $('model').placeholder = p.def? p.def : '(auto)';
  }
  engineEl.addEventListener('change',()=>{ store.set('prac_engine',engineEl.value); syncEngine(); });

  ['role','job','cv'].forEach(id=>{ if(store.get('prac_'+id)) $(id).value=store.get('prac_'+id); });
  if(store.get('prac_lang')) $('lang').value=store.get('prac_lang');
  if(store.get('prac_voice')) $('voiceSel').value=store.get('prac_voice');
  if(store.get('prac_style')) $('style').value=store.get('prac_style');
  syncEngine();

  /* ---------- profilo dall'account (M2 memoria) ----------
     Se la pagina è servita dal backend e l'utente è loggato con consenso,
     GET /v1/profile/summary restituisce il riassunto (~1200 char) e
     l'intervista viene personalizzata. Senza login/consenso: nessuna
     chiamata riuscita → tutto resta come oggi, solo i campi manuali. */
  let profileSummary=null;
  function profNoteText(){ return L()==='it'
    ? '👤 Profilo caricato dal tuo account: l\'intervista è personalizzata su ruolo, CV e obiezioni. I campi qui sotto servono per aggiunte o modifiche.'
    : '👤 Profile loaded from your account: the interview is tailored to your role, CV and objections. The fields below are for extras or overrides.'; }
  if(location.protocol.indexOf('http')===0){
    fetch('/v1/profile/summary',{credentials:'include'}).then(r=>r.ok?r.json():null).then(d=>{
      if(d&&d.summary){ profileSummary=String(d.summary).slice(0,1200); const n=$('profNote'); n.textContent=profNoteText(); n.style.display=''; }
    }).catch(()=>{});
  }

  let MODEL=null, history=[], qCount=0, maxQ=5, lastQ='', lastAnswer='';
  let state='idle', handsFree=true, recognition=null, recognizing=false, silenceTimer=null, chosenVoice=null;
  const SILENCE_MS=1900;
  const L=()=>$('lang').value;
  const setSt=(el,m,c)=>{$(el).textContent=m;$(el).className='status '+(c||'');
    if(c==='err'&&m){const a=$('a11yAlert');if(a){a.textContent='';a.textContent=m;}}};
  /* conferma accessibile via <dialog> nativo (focus trap + Esc dal browser) */
  function askConfirm(msg){
    return new Promise(resolve=>{
      const dlg=$('confirmDlg');
      $('confirmDlgT').textContent=(L()==='it'?'Conferma':'Confirm');
      $('confirmDlgP').textContent=msg;
      $('confirmDlgYes').textContent=(L()==='it'?'Sì':'Yes');
      $('confirmDlgNo').textContent=(L()==='it'?'Annulla':'Cancel');
      const opener=document.activeElement;
      let result=false;
      $('confirmDlgYes').onclick=()=>{result=true;dlg.close();};
      $('confirmDlgNo').onclick=()=>dlg.close();
      dlg.onclose=()=>{resolve(result);if(opener&&opener.focus)opener.focus();};
      dlg.showModal();
    });
  }
  const IT=k=>({listen:L()==='it'?'🎙 Ti ascolto — parla pure':'🎙 Listening — just talk',
                speak:L()==='it'?'🧑‍💼 L\'intervistatore parla…':'🧑‍💼 Interviewer speaking…',
                think:L()==='it'?'💭 Sto pensando…':'💭 Thinking…',
                ready:L()==='it'?'Pronto — premi 🎤 o scrivi':'Ready — press 🎤 or type'}[k]);
  function setState(s){
    state=s; const p=$('statepill');
    if(s==='listening'){p.className='statepill listen';p.innerHTML='<span class="glow"></span>'+IT('listen');}
    else if(s==='speaking'){p.className='statepill';p.textContent=IT('speak');}
    else if(s==='thinking'){p.className='statepill think';p.textContent=IT('think');}
    else {p.className='statepill';p.textContent=IT('ready');}
    $('micBtn').textContent=(s==='listening')?(L()==='it'?'⏹ Fermo':'⏹ Stop'):'🎤 '+(L()==='it'?'Parla':'Talk');
  }

  /* ---------- TTS ---------- */
  function loadVoices(){ return (window.speechSynthesis?window.speechSynthesis.getVoices():[])||[]; }
  function pickVoice(){
    const voices=loadVoices(); if(!voices.length) return null;
    const lang=L()==='it'?'it':'en', want=$('voiceSel').value;
    const pool=voices.filter(v=>v.lang&&v.lang.toLowerCase().startsWith(lang)); const list=pool.length?pool:voices;
    const female=/female|donna|samantha|victoria|karen|serena|alice|zira|elsa|federica|paola|google us english/i;
    const male=/male|uomo|daniel|alex|fred|diego|jorge|david|luca|cosimo/i;
    let v=list.find(x=>(want==='female'?female:male).test(x.name));
    if(!v) v=list.find(x=>!(want==='female'?male:female).test(x.name))||list[0];
    return v;
  }
  function speak(text, done){
    let fired=false; const fire=()=>{if(!fired){fired=true;done&&done();}};
    if(!('speechSynthesis' in window)){ setTimeout(fire,300); return; }
    try{
      window.speechSynthesis.cancel();
      const u=new SpeechSynthesisUtterance(text);
      chosenVoice=chosenVoice||pickVoice();
      if(chosenVoice){u.voice=chosenVoice;u.lang=chosenVoice.lang;} else {u.lang=L()==='it'?'it-IT':'en-US';}
      const av=$('avatar');
      u.onstart=()=>av.classList.add('talking'); u.onend=()=>{av.classList.remove('talking');fire();}; u.onerror=()=>{av.classList.remove('talking');fire();};
      window.speechSynthesis.speak(u);
      setTimeout(fire, Math.min(22000, text.length*70+2500));
    }catch(_){ fire(); }
  }
  if(window.speechSynthesis) window.speechSynthesis.onvoiceschanged=()=>{ chosenVoice=null; };

  /* ---------- unified LLM call (any provider, non-streaming) ---------- */
  function curModel(){ return $('model').value.trim() || (P().def||''); }
  async function resolveGemini(key){
    const r=await fetch('https://generativelanguage.googleapis.com/v1beta/models',{headers:{'x-goog-api-key':key}});
    const d=await r.json(); if(!r.ok) throw new Error((d.error&&d.error.message)||('HTTP '+r.status));
    const ms=(d.models||[]).filter(m=>(m.supportedGenerationMethods||[]).includes('generateContent'))
      .filter(m=>/gemini/i.test(m.name)&&!/embedding|aqa|imagen|vision/i.test(m.name)).map(m=>m.name.replace('models/',''));
    return ms.find(n=>/flash/i.test(n)&&/latest/i.test(n))||ms.find(n=>/flash/i.test(n))||ms[0];
  }
  // msgs: [{role:'user'|'assistant', content}]
  /* fetch BYOK con AbortController: timeout 45s, annullato a fine colloquio/pagehide */
  function bfetch(url,init){
    const req=window.LCC.abortScope('practice-'+Math.random().toString(36).slice(2)); // ogni turno un suo scope (si annullano con abortAll)
    const t=setTimeout(()=>req.abort(new DOMException('timeout','TimeoutError')),45000);
    return fetch(url,Object.assign({},init,{signal:req.signal})).catch(e=>{ throw new Error(req.signal.reason&&req.signal.reason.name==='TimeoutError'?'timeout':(e&&e.name==='AbortError'?'aborted':'network')); }).finally(()=>clearTimeout(t));
  }
  async function chat(system, msgs, maxTokens){
    const p=P(), key=$('key').value.trim(), model=MODEL||curModel();
    try{
      if(p.kind==='gemini'){
        const contents=msgs.map(m=>({role:m.role==='assistant'?'model':'user',parts:[{text:m.content}]}));
        const r=await bfetch('https://generativelanguage.googleapis.com/v1beta/models/'+model+':generateContent',
          {method:'POST',headers:{'Content-Type':'application/json','x-goog-api-key':key},body:JSON.stringify({systemInstruction:{parts:[{text:system}]},contents,generationConfig:{temperature:0.85,maxOutputTokens:maxTokens||500}})});
        const d=await r.json(); if(!r.ok) throw new Error((d.error&&d.error.message)||('HTTP '+r.status));
        return ((((d.candidates||[])[0]||{}).content||{}).parts||[]).map(x=>x.text||'').join('').trim();
      }
      if(p.kind==='anthropic'){
        const r=await bfetch(p.base+'/messages',{method:'POST',headers:{'Content-Type':'application/json','x-api-key':key,'anthropic-version':'2023-06-01','anthropic-dangerous-direct-browser-access':'true'},
          body:JSON.stringify({model,max_tokens:maxTokens||500,system,messages:msgs.map(m=>({role:m.role,content:m.content}))})});
        const d=await r.json(); if(!r.ok) throw new Error((d.error&&d.error.message)||('HTTP '+r.status));
        return (d.content||[]).map(c=>c.text||'').join('').trim();
      }
      // openai-compatible
      const r=await bfetch(p.base+'/chat/completions',{method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer '+key},
        body:JSON.stringify({model,temperature:0.85,max_tokens:maxTokens||500,messages:[{role:'system',content:system},...msgs]})});
      const d=await r.json(); if(!r.ok) throw new Error((d.error&&(d.error.message||d.error))||('HTTP '+r.status));
      return (((d.choices||[])[0]||{}).message||{}).content||'';
    }catch(e){
      if(e.message==='timeout') throw new Error(L()==='it'?'Tempo scaduto: il motore non ha risposto.':'Timed out: the engine did not answer.');
      if(e.message==='aborted') throw new Error(L()==='it'?'Annullato.':'Cancelled.');
      if(/network|Failed to fetch|NetworkError/i.test(e.message)) throw new Error((L()==='it'?'Questo motore blocca le chiamate dal browser (CORS) o la rete è giù. Prova Gemini, Groq o Claude.':'This engine blocks in-browser calls (CORS) or the network is down. Try Gemini, Groq or Claude.'));
      throw e;
    }
  }

  /* ---------- prompts ---------- */
  function role(){ return $('role').value.trim()||'the role'; }
  function langName(){ return L()==='it'?'Italian':'English'; }
  function ctxBlock(){
    let s='';
    // Prima il profilo dell'account (già riassunto lato server, ≤1200 char),
    // poi i campi manuali (≤2000 l'uno): budget di contesto rispettato.
    if(profileSummary) s+="\n\nCANDIDATE PROFILE (from their account — role, experience, style, recurring objections):\n"+profileSummary;
    if($('job').value.trim()) s+="\n\nJOB DESCRIPTION:\n"+$('job').value.trim().slice(0,2000);
    if($('cv').value.trim())  s+="\n\nCANDIDATE CV / BACKGROUND:\n"+$('cv').value.trim().slice(0,2000);
    return s;
  }
  function styleWord(){ return {friendly:'warm and encouraging',neutral:'neutral and professional',tough:'demanding and probing (a tough interviewer)'}[$('style').value]||'professional'; }
  function interviewerSystem(){
    return "You are a "+styleWord()+" job interviewer for the role: "+role()+"."
      +" Conduct a natural SPOKEN interview, tailored to the job description and the candidate's CV below."
      +" Rules: ONE question at a time; keep each turn short (1–3 sentences) as if speaking aloud;"
      +" open with a brief greeting and your first question; after each answer react briefly, then ask the next;"
      +" ground questions in the CV and the job (ask about their real projects, gaps, and role-specific challenges);"
      +" mix behavioural, situational and technical; probe a follow-up when an answer is vague;"
      +" do NOT give feedback, scores or tips during the interview. Speak entirely in "+langName()+"."+ctxBlock();
  }
  function coachAnswerSystem(){
    return "You are an elite interview coach for the role: "+role()+". The candidate gave an answer you must upgrade."
      +" In "+langName()+", reply with:\n1) A stronger rewrite of THEIR answer — first person, concise, using the STAR structure, grounded in their CV.\n2) Two short bullet tips (max one line each) on what made it better."
      +" Keep it tight. Use their real experience from the CV if given."+ctxBlock();
  }
  function suggestSystem(){
    return "You are an interview coach for the role: "+role()+". Suggest ONE strong, concise answer the candidate could give to the interviewer's last question."
      +" First person, spoken, 3–5 sentences, STAR if useful, grounded in their CV. Reply in "+langName()+". Output only the answer."+ctxBlock();
  }
  function feedbackSystem(){
    return "You are an expert interview coach. Score a mock interview for the role: "+role()+", using the job description and CV for context."
      +" Return ONLY valid JSON (no markdown, no code fences) with this exact shape:\n"
      +'{"overall":<0-100>,"summary":"<one sentence>","dimensions":[{"name":"Structure (STAR)","score":<0-10>,"note":"<short>"},{"name":"Relevance to the role","score":<0-10>,"note":"<short>"},{"name":"Specificity & impact","score":<0-10>,"note":"<short>"},{"name":"Clarity","score":<0-10>,"note":"<short>"},{"name":"Confidence","score":<0-10>,"note":"<short>"}],"strengths":["<3 items, cite the candidate\'s words>"],"improvements":["<3 concrete, actionable items>"],"modelAnswer":"<rewrite the candidate\'s weakest answer, stronger, first person, STAR>"}\n'
      +"Write all text values in "+langName()+". Be honest but encouraging."+ctxBlock();
  }
  function transcript(){
    return history.filter(m=>String(m.content).indexOf('[BEGIN]')<0)
      .map(m=>(m.role==='assistant'?'INTERVIEWER: ':'CANDIDATE: ')+m.content).join('\n\n');
  }

  /* ---------- flow ---------- */
  async function startInterview(){
    const key=$('key').value.trim();
    if(!key){ setSt('setupStatus',(L()==='it'?'Inserisci prima la chiave del motore scelto.':'Enter your API key for the chosen engine first.'),'err'); return; }
    ['role','job','cv'].forEach(id=>store.set('prac_'+id,$(id).value.trim()));
    store.set('prac_lang',L());store.set('prac_voice',$('voiceSel').value);store.set('prac_style',$('style').value);
    store.set(keyStoreName(),key); if($('model').value.trim()) store.set('prac_model_'+engineEl.value,$('model').value.trim());
    maxQ=parseInt($('nq').value,10)||5; qCount=0; history=[]; chosenVoice=null; lastAnswer='';
    $('startBtn').disabled=true; setSt('setupStatus',(L()==='it'?'Preparo il tuo intervistatore…':'Preparing your interviewer…'),'work');
    try{
      MODEL = (P().kind==='gemini') ? await resolveGemini(key) : curModel();
      history.push({role:'user',content:'[BEGIN] The candidate has joined. Begin the interview now.'});
      const msg=await chat(interviewerSystem(),history,320);
      history.push({role:'assistant',content:msg}); qCount=1;
      $('setup').style.display='none'; $('stage').style.display='flex'; $('fb').style.display='none';
      askQuestion(msg);
    }catch(e){ setSt('setupStatus','Error: '+e.message,'err'); }
    $('startBtn').disabled=false;
  }
  function askQuestion(msg){
    lastQ=msg;
    $('prog').textContent=(L()==='it'?'Domanda ':'Question ')+qCount+' / '+maxQ;
    const pv1=Math.round((qCount-1)/maxQ*100); $('pbarFill').style.width=pv1+'%'; $('pbar').setAttribute('aria-valuenow',String(pv1));
    $('qtext').textContent=msg; $('coachbox').style.display='none'; $('youtext').textContent=''; setSt('liveStatus','','');
    setState('speaking');
    speak(msg, ()=>{ if(handsFree) startListening(); else setState('ready'); });
  }
  async function nextTurn(answer){
    stopListening(); lastAnswer=answer; $('coachBtn').disabled=false;
    history.push({role:'user',content:answer});
    setState('thinking'); $('youtext').textContent=answer; const pv2=Math.round(qCount/maxQ*100); $('pbarFill').style.width=pv2+'%'; $('pbar').setAttribute('aria-valuenow',String(pv2));
    if(qCount>=maxQ){ return endInterview(); }
    try{
      const msg=await chat(interviewerSystem(),history,320);
      history.push({role:'assistant',content:msg}); qCount++;
      askQuestion(msg);
    }catch(e){ setSt('liveStatus','Error: '+e.message,'err'); setState('ready'); }
  }
  async function suggest(){
    stopListening(); setState('ready');
    $('coachbox').style.display=''; $('coachbox').innerHTML=(L()==='it'?'💡 Penso a un suggerimento…':'💡 Thinking of a suggestion…');
    try{
      const txt=await chat(suggestSystem(),[{role:'user',content:'The interviewer just asked: '+lastQ}],320);
      coachBox('💡 '+(L()==='it'?'Potresti dire:':'You could say:'),txt);
    }catch(e){ $('coachbox').textContent='Error: '+e.message; }
  }
  async function coachLast(){
    if(!lastAnswer){ return; }
    stopListening(); setState('ready');
    $('coachbox').style.display=''; $('coachbox').innerHTML=(L()==='it'?'✍️ Miglioro la tua risposta…':'✍️ Improving your answer…');
    try{
      const txt=await chat(coachAnswerSystem(),[{role:'user',content:'Question: '+lastQ+'\n\nMy answer: '+lastAnswer}],420);
      coachBox('✍️ '+(L()==='it'?'Versione migliorata:':'Stronger version:'),txt);
    }catch(e){ $('coachbox').textContent='Error: '+e.message; }
  }
  async function endInterview(){
    if(window.speechSynthesis) window.speechSynthesis.cancel(); stopListening();
    $('stage').style.display='none'; $('fb').style.display='block';
    $('scoreNum').textContent='…'; $('scoreWhy').textContent=(L()==='it'?'Preparo il tuo report…':'Preparing your report…');
    $('dims').innerHTML=''; $('strengths').innerHTML=''; $('improvements').innerHTML=''; $('modelAns').textContent=''; $('rawFb').style.display='none';
    try{
      const raw=await chat(feedbackSystem(),[{role:'user',content:transcript()+'\n\nReturn the JSON report now.'}],1100);
      renderReport(raw);
    }catch(e){ $('scoreNum').textContent='—'; $('scoreWhy').textContent='Error: '+e.message; }
  }
  function parseJSON(raw){
    let s=String(raw).trim().replace(/^```json/i,'').replace(/^```/,'').replace(/```$/,'').trim();
    try{return JSON.parse(s);}catch(_){}
    const m=s.match(/\{[\s\S]*\}/); if(m){ try{return JSON.parse(m[0]);}catch(_){}}
    return null;
  }
  /* XSS: testo del modello → nodi, mai innerHTML */
  function coachBox(title,txt){ const c=$('coachbox'); c.textContent=''; const b=document.createElement('b'); b.textContent=title; c.appendChild(b); c.appendChild(document.createElement('br')); c.appendChild(document.createTextNode(String(txt||''))); }
  function renderReport(raw){
    const d=parseJSON(raw);
    if(!d){ $('scoreNum').textContent='—'; $('scoreWhy').textContent=''; $('rawFb').style.display=''; $('rawFb').textContent=raw; return; }
    const ov=Math.max(0,Math.min(100,parseInt(d.overall,10)||0));
    $('scoreNum').textContent=ov; $('ring').style.setProperty('--v',ov); $('scoreWhy').textContent=d.summary||'';
    $('dims').innerHTML=(d.dimensions||[]).map(x=>{
      const sc=Math.max(0,Math.min(10,parseInt(x.score,10)||0));
      return '<div class="dim"><div class="dh"><span>'+esc(x.name||'')+'</span><span>'+sc+'/10</span></div>'
        +'<div class="track"><i style="width:'+(sc*10)+'%"></i></div>'+(x.note?'<div class="note">'+esc(x.note)+'</div>':'')+'</div>';
    }).join('');
    $('strengths').innerHTML=(d.strengths||[]).map(x=>'<li>'+esc(x)+'</li>').join('');
    $('improvements').innerHTML=(d.improvements||[]).map(x=>'<li>'+esc(x)+'</li>').join('');
    $('modelAns').textContent=d.modelAnswer||'';
    // opt-in prontezza: compare solo a report valido e se la pagina è servita dal backend
    if(location.protocol.indexOf('http')===0){
      $('scoreSaveCard').style.display=''; $('scoreSaveChk').checked=false;
      $('scoreSaveBtn').disabled=true; const st=$('scoreSaveSt'); st.textContent=''; st.className='status';
    }
  }
  function esc(t){ return String(t).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/\n/g,'<br>'); }

  /* ---------- STT ---------- */
  const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
  /* Riconoscimento vocale onesto: on-device (processLocally) dove il browser
     lo garantisce, altrimenti etichetta chiara "dipende dal browser" — la
     Web Speech API può inviare l'audio a un servizio remoto del produttore. */
  let sttMode='unknown';
  async function probeStt(){
    if(!SR){ sttMode='none'; renderSttNote(); return; }
    let mode='browser';
    try{
      if(typeof SR.available==='function'){
        const lang=L()==='it'?'it-IT':'en-US';
        let st=await SR.available({langs:[lang],processLocally:true});
        if(st==='downloadable'&&typeof SR.install==='function'){ try{ if(await SR.install({langs:[lang],processLocally:true})) st='available'; }catch(_){} }
        if(st==='available') mode='local';
      }
    }catch(_){}
    sttMode=mode; renderSttNote();
  }
  function renderSttNote(){
    const n=$('sttNote'); if(!n) return;
    const it=L()==='it';
    n.textContent= sttMode==='local' ? (it?'🎙 Riconoscimento vocale sul dispositivo (on-device).':'🎙 On-device speech recognition.')
      : sttMode==='browser' ? (it?'🎙 Riconoscimento vocale del browser: può usare un servizio remoto del produttore del browser (non nostro).':'🎙 Browser speech recognition: it may use a remote service run by the browser vendor (not us).')
      : '';
  }
  function armSilence(){ clearTimeout(silenceTimer); silenceTimer=setTimeout(()=>{ if(state==='listening'){ const t=$('youtext').textContent.trim(); if(t.length>1) nextTurn(t); } }, SILENCE_MS); }
  function startListening(){
    if(!SR){ setState('ready'); setSt('liveStatus',(L()==='it'?'Il microfono richiede Chrome. Usa "Scrivi" qui sotto.':'Mic needs Chrome. Use "Type instead" below.'),'err'); return; }
    setState('listening'); $('youtext').textContent='';
    recognition=new SR(); recognition.lang=L()==='it'?'it-IT':'en-US'; recognition.continuous=true; recognition.interimResults=true;
    if(sttMode==='local'){ try{ recognition.processLocally=true; }catch(_){} }
    recognition.onresult=e=>{ let s=''; for(let i=0;i<e.results.length;i++) s+=e.results[i][0].transcript; $('youtext').textContent=s; armSilence(); };
    const TERMINAL=['not-allowed','service-not-allowed','audio-capture','language-not-supported'];
    recognition.onerror=e=>{ if(TERMINAL.indexOf(e.error)>=0){ recognizing=false; setState('ready'); setSt('liveStatus',(L()==='it'?'Microfono non disponibile ('+e.error+'). Usa "Scrivi".':'Mic unavailable ('+e.error+'). Use "Type instead".'),'err'); } };
    recognition.onend=()=>{ if(state==='listening'&&recognizing){ try{recognition.start()}catch(_){} } };
    try{ recognition.start(); recognizing=true; }catch(_){}
  }
  function stopListening(){ recognizing=false; clearTimeout(silenceTimer); if(recognition){try{recognition.stop()}catch(_){}} }

  /* ---------- wire ---------- */
  $('startBtn').addEventListener('click',startInterview);
  $('handsBtn').addEventListener('click',()=>{ handsFree=!handsFree; $('handsBtn').classList.toggle('on',handsFree); $('handsBtn').textContent=handsFree?'✋ Hands-free: ON':'✋ Hands-free: OFF'; if(handsFree&&state==='ready')startListening(); if(!handsFree)stopListening(); });
  $('micBtn').addEventListener('click',()=>{ if(state==='listening'){ const t=$('youtext').textContent.trim(); if(t.length>1) nextTurn(t); else {stopListening();setState('ready');} } else startListening(); });
  $('endBtn').addEventListener('click',async()=>{ if(await askConfirm(L()==='it'?'Termino e genero il report?':'End now and get the report?')) endInterview(); });
  $('replayBtn').addEventListener('click',()=>{ const was=handsFree; stopListening(); speak(lastQ,()=>{ if(was)startListening(); }); });
  $('hintBtn').addEventListener('click',suggest);
  $('coachBtn').addEventListener('click',coachLast);
  $('sendType').addEventListener('click',()=>{ const t=$('answerInput').value.trim(); if(t){ $('answerInput').value=''; nextTurn(t); }});
  $('answerInput').addEventListener('keydown',e=>{ if(e.key==='Enter'){ const t=e.target.value.trim(); if(t){ e.target.value=''; nextTurn(t); }}});
  $('againBtn').addEventListener('click',()=>{ $('fb').style.display='none'; $('setup').style.display='block'; history=[];qCount=0;lastAnswer=''; $('coachBtn').disabled=true; $('scoreSaveCard').style.display='none'; });
  /* ---- prontezza: invio punteggio (solo numeri + ruolo) su consenso ---- */
  $('scoreSaveChk').addEventListener('change',()=>{ $('scoreSaveBtn').disabled=!$('scoreSaveChk').checked; });
  $('scoreSaveBtn').addEventListener('click',async()=>{
    const overall=parseInt($('scoreNum').textContent,10);
    if(isNaN(overall))return;
    const st=$('scoreSaveSt'); st.textContent='…'; st.className='status work';
    const base=location.protocol.indexOf('http')===0?location.origin:'http://127.0.0.1:8787';
    try{
      const r=await fetch(base+'/v1/practice/score',{method:'POST',credentials:'include',headers:{'Content-Type':'application/json'},
        body:JSON.stringify({consent:true,role:$('role').value.trim()||undefined,overall})});
      if(r.status===401){ st.textContent=(L()==='it'?'Serve l\'account dell\'app: accedi prima dall\'app.':'You need the app account: sign in from the app first.'); st.className='status err'; return; }
      if(!r.ok)throw new Error('HTTP '+r.status);
      st.textContent=(L()==='it'?'Salvato nella tua prontezza ✔':'Saved to your readiness ✔'); st.className='status ok';
      $('scoreSaveBtn').disabled=true;
    }catch(e){ st.textContent='Error: '+e.message; st.className='status err'; }
  });
  $('lang').addEventListener('change',()=>{ chosenVoice=null; applyLang(); });
  function applyLang(){
    const it=L()==='it';
    document.documentElement.lang=it?'it':'en';
    $('skipLink').textContent=it?'Salta al contenuto':'Skip to content';
    $('aiNotice').textContent=it?'🤖 L\'intervistatore è una simulazione IA. Stai interagendo con un sistema di IA: verifica fatti, date e qualifiche prima di farci affidamento.':'🤖 The interviewer is an AI simulation. You are interacting with an AI system: verify facts, dates and qualifications before relying on them.';
    $('privacyNote').textContent=it
      ?'🎧 Usa le cuffie, così la voce dell\'intervistatore non entra nel microfono. 🔑 Modalità BYOK: il testo va al provider che scegli tu, con la tua chiave e le sue condizioni (Google, Anthropic, Groq sono extra-UE; Mistral è UE). Nulla viene salvato sui nostri server. 🎙 Il riconoscimento vocale dipende dal browser (vedi nota sotto).'
      :'🎧 Use headphones so the interviewer\'s voice isn\'t picked up by your mic. 🔑 BYOK mode: text goes to the provider you choose, with your key and its terms (Google, Anthropic, Groq are non-EU; Mistral is EU). Nothing is saved on our servers. 🎙 Speech recognition depends on the browser (see note below).';
    renderSttNote();
    $('pbar').setAttribute('aria-label',it?'Avanzamento del colloquio':'Interview progress');
    $('heroH').textContent=it?'Prova il colloquio — con un coach che conosce il tuo CV':'Rehearse the interview — with a coach that knows your CV';
    $('heroP').textContent=it?'Un intervistatore AI, cucito sul tuo CV e sull\'offerta. Parli a mani libere, ricevi coaching dal vivo e finisci con un report a punteggio.':'A realistic AI interviewer, tailored to your résumé and the job. Talk hands-free, get live coaching, and finish with a scored report.';
    $('setupH').textContent=it?'Imposta la sessione':'Set up your session';
    $('setupSub').textContent=it?'Più cose gli dai, più l\'intervista è precisa.':'The more you give it, the sharper the interview.';
    $('lRole').textContent=it?'Ruolo / posizione':'Role / position';
    $('lJob').innerHTML=(it?'Descrizione dell\'offerta ':'Job description ')+'<span style="color:var(--muted);font-weight:400">('+(it?'incollala — facoltativa ma consigliata':'paste it — optional but recommended')+')</span>';
    $('lCv').innerHTML=(it?'Il tuo CV / background ':'Your CV / background ')+'<span style="color:var(--muted);font-weight:400">('+(it?'incolla i punti chiave — facoltativo':'paste key points — optional')+')</span>';
    $('lLang').textContent=it?'Lingua':'Language'; $('lVoice').textContent=it?'Voce intervistatore':'Interviewer voice'; $('lStyle').textContent=it?'Stile':'Style'; $('lNq').textContent=it?'Domande':'Questions';
    [...$('style').options].forEach(o=>{o.textContent={friendly:it?'Amichevole':'Friendly',neutral:it?'Neutro':'Neutral',tough:it?'Duro / sfidante':'Tough / challenging'}[o.value];});
    $('lEngine').innerHTML=(it?'Motore AI ':'AI engine ')+'<span style="color:var(--muted);font-weight:400">'+(it?'— per qualità vera usa Claude o Groq, non solo il Gemini gratis':'— for real quality use Claude or Groq, not only free Gemini')+'</span>';
    $('lModel').textContent=it?'Modello':'Model'; $('lKey').childNodes[0].nodeValue=it?'Chiave API ':'API key ';
    $('startBtn').textContent=it?'▶ Inizia il colloquio':'▶ Start the interview';
    $('hStr').textContent=it?'Punti di forza':'Strengths'; $('hImp').textContent=it?'Cosa migliorare':'What to improve'; $('hModel').textContent=it?'Versione più forte della tua risposta più debole':'Stronger version of your weakest answer';
    $('replayBtn').textContent=it?'🔊 Ripeti':'🔊 Repeat'; $('hintBtn').textContent=it?'💡 Suggerisci una risposta':'💡 Suggest an answer'; $('coachBtn').textContent=it?'✍️ Migliora la mia ultima risposta':'✍️ Improve my last answer';
    $('againBtn').textContent=it?'↻ Riprova':'↻ Practice again';
    $('scoreSaveL').textContent=it?'Salva il punteggio nella mia prontezza (solo numeri e ruolo, sul mio account)':'Save the score to my readiness (numbers and role only, on my account)';
    $('scoreSaveBtn').textContent=it?'Salva punteggio':'Save score';
    if(profileSummary) $('profNote').textContent=profNoteText();
  }
  window.addEventListener('pagehide',()=>{ if(window.speechSynthesis)window.speechSynthesis.cancel(); stopListening(); history=[]; });
  applyLang(); // (anche in EN: aggiorna nota privacy onesta + skip link)
  probeStt(); $('lang').addEventListener('change',()=>{ sttMode='unknown'; probeStt(); });
})();
