/* ═══ URL del backend (piano Pro) ═══
   Se la pagina è servita via http(s) (dal backend stesso, da un tunnel o dal
   deploy) usa la STESSA origine — così funziona ovunque senza toccare nulla.
   Il fallback su localhost serve solo quando si apre il file in locale (file://). */
const BACKEND_URL = location.protocol.startsWith('http') ? location.origin : 'http://127.0.0.1:8787';

(function(){
  const $=id=>document.getElementById(id);
  const T={
    it:{heroH:"Il tuo assistente per le videochiamate",heroP:"Ascolta la conversazione (colloquio, riunione, vendita…) e ti suggerisce cosa rispondere, in tempo reale. Con la tua chiave AI gratuita, tutto dentro il browser.",s1:"Scegli come funziona",s2:"Premi Ascolta",s3:"Leggi la risposta",
      startH:"Per iniziare",startSub:"Scegli un'opzione: è questione di un minuto.",freeT:"Gratis con Google Gemini",reco:"consigliato",freeD:"Crei una chiave gratuita in 1 minuto, nessuna carta. Perfetto per provare.",ownT:"Ho già una chiave / altro motore",ownD:"OpenAI, Claude, DeepSeek, Qwen, Kimi, Groq… con la tua chiave.",
      engine:"Motore AI",apikey:"Chiave API",getkey:"— come ottenerla",verify:"Verifica",model:"Modello",baseurl:"URL endpoint (OpenAI-compatible)",heard:"Lingua di chi parla",answerlang:"Rispondi in",mode:"Tipo di conversazione",context:"Parlami di te (facoltativo) — CV, ruolo, prodotto",ctxph:"Es: Sono Felice, Project Manager fotovoltaico. Mi candido come… Punti di forza:…",remember:"Ricorda tutto su questo computer",forget:"🗑 Cancella chiavi e dati locali",adv:"⚙️ Impostazioni avanzate",
      listen:"▶ Avvia (ascolta e rispondi)",stop:"⏸ Ferma",auto:"⚡ Risposta automatica",suggest:"💡 Suggerisci ora",float:"🗔 Finestra flottante",clear:"🗑 Pulisci",install:"⬇ Installa app",installed:"App installata ✔",listening:"Cosa sto sentendo",answer:"Cosa puoi rispondere",copy:"Copia",copied:"Copiato ✔",howto:"❔ Come si usa (leggi qui)",manualph:"Oppure scrivi la domanda e premi Invio…",
      paid:"💡 In arrivo: una modalità \"pronta all'uso\" a pagamento, senza chiave API — paghi un piccolo abbonamento e usi subito il modello più potente. Per ora si usa la tua chiave (gratis con Gemini).",
      thinking:"Sto pensando…",ready:"Pronto ✔",onair:"Ti sto ascoltando…",stopped:"Fermato.",autoOn:"Risposta automatica attiva.",autoOff:"Risposta automatica disattivata.",nokey:"Inserisci prima la chiave.",noq:"Non ho ancora sentito una domanda.",valid:"✔ Chiave ok",
      proT:"Pro (nostro cloud)",proBadge:"nessuna chiave",proD:"Accedi e usa i migliori modelli senza configurare nulla: la chiave la mettiamo noi. €9/mese.",
      acEmailL:"Email",acPassL:"Password (min 8 caratteri)",acLogin:"Accedi",acSignup:"Registrati",acLogout:"Esci",acUpgrade:"Passa a Pro (€9/mese)",acSync:"Ho pagato — aggiorna",proModelL:"Modello (dal nostro cloud)",
      autoOpt:"🧭 Automatico (consigliato)",sensL:"🔒 Dato sensibile — resta in UE",routedBy:"Risposto da",
      acNeedLogin:"Accedi (o registrati) per usare la modalità Pro.",acNeedFields:"Inserisci email e password.",acWorking:"Un attimo…",acHello:"Ciao",acPlan:"piano",acRpm:"richieste/min",acFree:"Sei sul piano Free: per usare i modelli senza chiave serve Pro.",acPaid:"Si apre Stripe in un'altra scheda. Dopo il pagamento torna qui e premi \"Ho pagato — aggiorna\".",acBackendDown:"Backend non raggiungibile: controlla che sia acceso.",
      how:"<b>1) Scegli come funziona:</b> \"Gratis con Gemini\" (consigliato) e crea la chiave dal link, oppure usa una tua chiave.<br><br><b>2) Premi 🎙 Ascolta</b> tenendo l'audio della call dagli altoparlanti (non cuffie). Con ⚡ attivo, appena l'altro fa una pausa la risposta compare da sola.<br><br><b>3) Leggi</b> la risposta suggerita. Premi 🗔 per staccarla in una finestrella da mettere di fianco a Zoom.<br><br><b>Etica:</b> usare l'AI in una selezione può violare le regole aziendali; registrare la voce altrui richiede consenso (GDPR)."},
    en:{heroH:"Your assistant for video calls",heroP:"It listens to the conversation (interview, meeting, sales…) and suggests what to say, in real time. With your free AI key, all in your browser.",s1:"Pick how it works",s2:"Press Listen",s3:"Read the answer",
      startH:"Get started",startSub:"Pick one option — it takes a minute.",freeT:"Free with Google Gemini",reco:"recommended",freeD:"Create a free key in 1 minute, no card. Perfect to try.",ownT:"I have a key / another engine",ownD:"OpenAI, Claude, DeepSeek, Qwen, Kimi, Groq… with your key.",
      engine:"AI engine",apikey:"API key",getkey:"— how to get it",verify:"Verify",model:"Model",baseurl:"Endpoint URL (OpenAI-compatible)",heard:"Speaker language",answerlang:"Answer in",mode:"Conversation type",context:"Tell me about you (optional) — CV, role, product",ctxph:"E.g. I'm Felice, a solar Project Manager. Applying for… Strengths:…",remember:"Remember everything on this computer",forget:"🗑 Clear keys & local data",adv:"⚙️ Advanced settings",
      listen:"▶ Start (listen & reply)",stop:"⏸ Stop",auto:"⚡ Auto-answer",suggest:"💡 Suggest now",float:"🗔 Floating window",clear:"🗑 Clear",install:"⬇ Install app",installed:"App installed ✔",listening:"What I'm hearing",answer:"What you can say",copy:"Copy",copied:"Copied ✔",howto:"❔ How to use (read here)",manualph:"Or type the question and press Enter…",
      paid:"💡 Coming soon: a \"ready-to-use\" paid mode with no API key — a small subscription and you use the most powerful model instantly. For now, use your own key (free with Gemini).",
      thinking:"Thinking…",ready:"Ready ✔",onair:"Listening to you…",stopped:"Stopped.",autoOn:"Auto-answer on.",autoOff:"Auto-answer off.",nokey:"Enter the key first.",noq:"No question heard yet.",valid:"✔ Key ok",
      proT:"Pro (our cloud)",proBadge:"no key needed",proD:"Log in and use the best models with zero setup: we provide the key. €9/month.",
      acEmailL:"Email",acPassL:"Password (min 8 chars)",acLogin:"Log in",acSignup:"Sign up",acLogout:"Log out",acUpgrade:"Go Pro (€9/month)",acSync:"I've paid — refresh",proModelL:"Model (from our cloud)",
      autoOpt:"🧭 Automatic (recommended)",sensL:"🔒 Sensitive data — stay in the EU",routedBy:"Answered by",
      acNeedLogin:"Log in (or sign up) to use Pro mode.",acNeedFields:"Enter email and password.",acWorking:"One moment…",acHello:"Hi",acPlan:"plan",acRpm:"requests/min",acFree:"You're on the Free plan: Pro is required to use models without a key.",acPaid:"Stripe opens in a new tab. After paying, come back and press \"I've paid — refresh\".",acBackendDown:"Backend unreachable: make sure it's running.",
      how:"<b>1) Pick how it works:</b> \"Free with Gemini\" (recommended), create the key from the link, or use your own key.<br><br><b>2) Press 🎙 Listen</b> with call audio on speakers (not headphones). With ⚡ on, the answer appears by itself when the other person pauses.<br><br><b>3) Read</b> the suggested answer. Press 🗔 to pop it into a small window beside Zoom.<br><br><b>Ethics:</b> using AI in a hiring process may violate company rules; recording others requires consent (GDPR)."},
    zh:{heroH:"你的视频通话助手",heroP:"实时聆听对话（面试、会议、销售……）并建议你该说什么。使用你的免费 AI 密钥，全部在浏览器中运行。",s1:"选择使用方式",s2:"点击聆听",s3:"阅读回答",
      startH:"开始使用",startSub:"选择一个选项 — 只需一分钟。",freeT:"免费使用 Google Gemini",reco:"推荐",freeD:"1 分钟创建免费密钥，无需银行卡。适合试用。",ownT:"我有密钥 / 其他引擎",ownD:"OpenAI、Claude、DeepSeek、Qwen、Kimi、Groq……使用你的密钥。",
      engine:"AI 引擎",apikey:"API 密钥",getkey:"— 如何获取",verify:"验证",model:"模型",baseurl:"接口地址（兼容 OpenAI）",heard:"对方语言",answerlang:"回答语言",mode:"对话类型",context:"介绍一下你自己（可选）— 简历、职位、产品",ctxph:"例如：我是 Felice，光伏项目经理，应聘……优势：……",remember:"在本机记住所有内容",forget:"🗑 清除密钥与本地数据",adv:"⚙️ 高级设置",
      listen:"▶ 开始（聆听并回答）",stop:"⏸ 停止",auto:"⚡ 自动回答",suggest:"💡 立即建议",float:"🗔 悬浮窗口",clear:"🗑 清空",install:"⬇ 安装应用",installed:"已安装 ✔",listening:"我听到的内容",answer:"你可以这样回答",copy:"复制",copied:"已复制 ✔",howto:"❔ 使用方法（点此）",manualph:"或输入问题并按回车…",
      paid:"💡 即将推出：无需 API 密钥的付费“即用”模式 — 小额订阅即可立即使用最强模型。目前请使用你自己的密钥（Gemini 免费）。",
      thinking:"思考中…",ready:"完成 ✔",onair:"正在聆听…",stopped:"已停止。",autoOn:"自动回答已开启。",autoOff:"自动回答已关闭。",nokey:"请先输入密钥。",noq:"还没听到问题。",valid:"✔ 密钥有效",
      proT:"Pro（我们的云）",proBadge:"无需密钥",proD:"登录即可使用最佳模型，无需任何配置：密钥由我们提供。€9/月。",
      acEmailL:"邮箱",acPassL:"密码（至少 8 位）",acLogin:"登录",acSignup:"注册",acLogout:"退出",acUpgrade:"升级 Pro（€9/月）",acSync:"已付款 — 刷新",proModelL:"模型（来自我们的云）",
      autoOpt:"🧭 自动（推荐）",sensL:"🔒 敏感数据 — 保留在欧盟",routedBy:"回答来自",
      acNeedLogin:"请先登录（或注册）以使用 Pro 模式。",acNeedFields:"请输入邮箱和密码。",acWorking:"请稍候…",acHello:"你好",acPlan:"套餐",acRpm:"次/分钟",acFree:"你当前是免费套餐：无密钥使用模型需要 Pro。",acPaid:"将在新标签页打开 Stripe。付款后回到这里，点击“已付款 — 刷新”。",acBackendDown:"无法连接后端：请确认它正在运行。",
      how:"<b>1) 选择使用方式：</b>“免费使用 Gemini”（推荐），从链接创建密钥，或使用自己的密钥。<br><br><b>2) 点击 🎙 聆听，</b>让通话声音从扬声器播放（不要用耳机）。开启 ⚡ 后，对方停顿时回答会自动出现。<br><br><b>3) 阅读</b>建议回答。点击 🗔 弹出小窗口放在 Zoom 旁边。<br><br><b>伦理：</b>在招聘中使用 AI 可能违反公司规定；录制他人需征得同意（GDPR）。"},
    es:{heroH:"Tu asistente para videollamadas",heroP:"Escucha la conversación (entrevista, reunión, ventas…) y te sugiere qué responder, en tiempo real. Con tu clave de IA gratuita, todo en el navegador.",s1:"Elige cómo funciona",s2:"Pulsa Escuchar",s3:"Lee la respuesta",
      startH:"Para empezar",startSub:"Elige una opción — es cuestión de un minuto.",freeT:"Gratis con Google Gemini",reco:"recomendado",freeD:"Creas una clave gratis en 1 minuto, sin tarjeta. Ideal para probar.",ownT:"Ya tengo clave / otro motor",ownD:"OpenAI, Claude, DeepSeek, Qwen, Kimi, Groq… con tu clave.",
      engine:"Motor de IA",apikey:"Clave API",getkey:"— cómo obtenerla",verify:"Verificar",model:"Modelo",baseurl:"URL del endpoint (compatible OpenAI)",heard:"Idioma del interlocutor",answerlang:"Responder en",mode:"Tipo de conversación",context:"Háblame de ti (opcional) — CV, rol, producto",ctxph:"Ej: Soy Felice, Project Manager fotovoltaico. Me postulo para… Fortalezas:…",remember:"Recordar todo en este ordenador",forget:"🗑 Borrar claves y datos locales",adv:"⚙️ Ajustes avanzados",
      listen:"▶ Iniciar (escuchar y responder)",stop:"⏸ Parar",auto:"⚡ Respuesta automática",suggest:"💡 Sugerir ahora",float:"🗔 Ventana flotante",clear:"🗑 Limpiar",install:"⬇ Instalar app",installed:"App instalada ✔",listening:"Lo que estoy oyendo",answer:"Lo que puedes decir",copy:"Copiar",copied:"Copiado ✔",howto:"❔ Cómo se usa (lee aquí)",manualph:"O escribe la pregunta y pulsa Enter…",
      paid:"💡 Próximamente: un modo \"listo para usar\" de pago sin clave API — una pequeña suscripción y usas el modelo más potente al instante. Por ahora, usa tu clave (gratis con Gemini).",
      thinking:"Pensando…",ready:"Listo ✔",onair:"Te escucho…",stopped:"Detenido.",autoOn:"Respuesta automática activada.",autoOff:"Respuesta automática desactivada.",nokey:"Introduce primero la clave.",noq:"Aún no he oído una pregunta.",valid:"✔ Clave ok",
      proT:"Pro (nuestra nube)",proBadge:"sin clave",proD:"Inicia sesión y usa los mejores modelos sin configurar nada: la clave la ponemos nosotros. 9 €/mes.",
      acEmailL:"Email",acPassL:"Contraseña (mín. 8 caracteres)",acLogin:"Entrar",acSignup:"Registrarse",acLogout:"Salir",acUpgrade:"Pasar a Pro (9 €/mes)",acSync:"He pagado — actualizar",proModelL:"Modelo (de nuestra nube)",
      autoOpt:"🧭 Automático (recomendado)",sensL:"🔒 Dato sensible — quedarse en la UE",routedBy:"Respondido por",
      acNeedLogin:"Inicia sesión (o regístrate) para usar el modo Pro.",acNeedFields:"Introduce email y contraseña.",acWorking:"Un momento…",acHello:"Hola",acPlan:"plan",acRpm:"solicitudes/min",acFree:"Estás en el plan Free: para usar modelos sin clave necesitas Pro.",acPaid:"Stripe se abre en otra pestaña. Tras pagar, vuelve aquí y pulsa \"He pagado — actualizar\".",acBackendDown:"Backend no accesible: comprueba que esté encendido.",
      how:"<b>1) Elige cómo funciona:</b> \"Gratis con Gemini\" (recomendado), crea la clave desde el enlace, o usa tu clave.<br><br><b>2) Pulsa 🎙 Escuchar</b> con el audio por altavoces (no auriculares). Con ⚡ activo, la respuesta aparece sola cuando la otra persona hace una pausa.<br><br><b>3) Lee</b> la respuesta sugerida. Pulsa 🗔 para separarla en una ventana junto a Zoom.<br><br><b>Ética:</b> usar IA en una selección puede violar reglas de la empresa; grabar a otros requiere consentimiento (RGPD)."}
  };
  const T2={
    it:{settings:"⚙︎ Impostazioni",drawerH:"Impostazioni e avvio",close:"Chiudi",doneBack:"← Fatto",desktopMic:"Su desktop la cattura nativa (pannello in basso a destra) sostituisce l'ascolto del browser.",privacyChip:"🔒 Niente viene salvato — la trascrizione resta nel tuo browser",consentLine:"Assistente <b>AI</b> · registrare la voce altrui richiede il loro <b>consenso</b> (GDPR/AI Act).",capsTitle:"Cosa puoi fare",capsBody:"<b>Skill</b>: colloquio, vendita, assistenza, riunione, negoziazione, traduzione dal vivo, studio, o un profilo su misura.<br><br><b>Come usarlo</b>: 🆓 gratis con Gemini · 🔑 la tua chiave (OpenAI, Claude, Mistral 🇪🇺, DeepSeek, Qwen, Kimi, Groq) · 🔒 LLM locale con Ollama dal client desktop (niente testo esce dal PC) · ⭐ Pro senza chiave, solo modelli e server UE.<br><br><b>Extra</b>: risposta automatica quando l'altro fa una pausa · 🗔 finestra flottante di fianco a Zoom · ⬇ installabile come app · lingua automatica per zona.<br><br><b>Privacy</b>: le conversazioni non vengono salvate sui nostri server. In modalità locale non lasciano nemmeno il tuo computer."},
    en:{settings:"⚙︎ Settings",drawerH:"Settings & start",close:"Close",doneBack:"← Done",desktopMic:"On desktop, native capture (bottom-right panel) replaces browser listening.",privacyChip:"🔒 Nothing is saved — the transcript stays in your browser",consentLine:"<b>AI</b> assistant · recording other people requires their <b>consent</b> (GDPR/AI Act).",capsTitle:"What you can do",capsBody:"<b>Skills</b>: interview, sales, support, meeting, negotiation, live translation, study, or your own custom profile.<br><br><b>How to use it</b>: 🆓 free with Gemini · 🔑 your own key (OpenAI, Claude, Mistral 🇪🇺, DeepSeek, Qwen, Kimi, Groq) · 🔒 Local LLM with Ollama from the desktop client (no text leaves your PC) · ⭐ Pro with no key, EU models and servers only.<br><br><b>Extras</b>: auto-answer when the other person pauses · 🗔 floating window to dock next to Zoom · ⬇ installable as an app · language auto-detected by region.<br><br><b>Privacy</b>: conversations are not stored on our servers. In local mode they never even leave your computer."},
    zh:{settings:"⚙︎ 设置",drawerH:"设置与开始",close:"关闭",doneBack:"← 完成",desktopMic:"在桌面版中，原生捕获（右下角面板）取代浏览器聆听。",privacyChip:"🔒 不保存任何内容 — 转录仅留在你的浏览器中",consentLine:"<b>AI</b> 助手 · 录制他人语音需征得其<b>同意</b>（GDPR/AI 法案）。",capsTitle:"你可以做什么",capsBody:"<b>技能</b>：面试、销售、客服、会议、谈判、实时翻译、学习，或自定义。<br><br><b>使用方式</b>：🆓 免费使用 Gemini · 🔑 你自己的密钥（OpenAI、Claude、Mistral 🇪🇺、DeepSeek、Qwen、Kimi、Groq）· 🔒 通过桌面客户端使用 Ollama 本地 LLM（文本不出电脑）· ⭐ Pro 无需密钥，仅使用欧盟模型与服务器。<br><br><b>额外</b>：对方停顿时自动回答 · 🗔 可贴在 Zoom 旁的悬浮窗 · ⬇ 可安装为应用 · 按地区自动选择语言。<br><br><b>隐私</b>：对话不会存储在我们的服务器上。本地模式下甚至不会离开你的电脑。"},
    es:{settings:"⚙︎ Ajustes",drawerH:"Ajustes e inicio",close:"Cerrar",doneBack:"← Hecho",desktopMic:"En escritorio, la captura nativa (panel inferior derecho) sustituye la escucha del navegador.",privacyChip:"🔒 No se guarda nada — la transcripción se queda en tu navegador",consentLine:"Asistente <b>IA</b> · grabar la voz de otros requiere su <b>consentimiento</b> (RGPD/Ley IA).",capsTitle:"Qué puedes hacer",capsBody:"<b>Skills</b>: entrevista, ventas, soporte, reunión, negociación, traducción en vivo, estudio, o tu perfil a medida.<br><br><b>Cómo usarlo</b>: 🆓 gratis con Gemini · 🔑 tu propia clave (OpenAI, Claude, Mistral 🇪🇺, DeepSeek, Qwen, Kimi, Groq) · 🔒 LLM local con Ollama desde el cliente de escritorio (ningún texto sale del PC) · ⭐ Pro sin clave, solo modelos y servidores UE.<br><br><b>Extras</b>: respuesta automática cuando la otra persona hace una pausa · 🗔 ventana flotante junto a Zoom · ⬇ instalable como app · idioma automático por región.<br><br><b>Privacidad</b>: las conversaciones no se guardan en nuestros servidores. En modo local ni siquiera salen de tu ordenador."}
  };
  /* Profilo (memoria persistente): i18n della sezione strutturata. */
  const T3={
    it:{profH:"👤 Il tuo profilo (memoria)",profSub:"Chi sei, cosa vendi, come rispondi: rende i suggerimenti su misura. Tutto facoltativo.",profRoleL:"Ruolo",profRolePh:"Es: Account Executive",profCompanyL:"Azienda / prodotto",profCompanyPh:"Es: software HR per PMI",profCvL:"CV / esperienza",profCvPh:"Es: 10 anni di vendita B2B, prima in banca poi nel SaaS…",profStyleL:"Stile di risposta",profStylePh:"Es: diretto ma cordiale, frasi brevi",profObjL:"Obiezioni / domande ricorrenti",profObjPh:"Es: costa troppo; abbiamo già un fornitore; ne parliamo a settembre",profConsentL:"Acconsento a salvare il profilo sul mio <b>account</b> (server in UE) per ritrovarlo su tutti i miei dispositivi",profExport:"⬇ Esporta i miei dati",profDelete:"🗑 Cancella il profilo",profDeleteConfirm:"Cancellare il profilo dal server e da questo dispositivo? L'operazione è definitiva.",profStoredAccount:"💾 Profilo salvato sul tuo account (server in UE), sincronizzato su tutti i tuoi dispositivi. Puoi esportarlo o cancellarlo quando vuoi.",profStoredDevice:"💾 Profilo salvato solo su questo dispositivo: non viene inviato a nessun server.",profSynced:"✔ Sincronizzato sul tuo account",profDeleted:"Profilo cancellato ovunque.",profServerOff:"Profilo rimosso dal server: resta solo su questo dispositivo.",fbQ:"È servito?",fbUsed:"👍 Usato",fbEdited:"✍️ Modificato",fbIgnored:"👎 Ignorato",fbSend:"Invia la tua versione",fbThanks:"Grazie, registrato ✔",kitLink:"🧩 Kit di candidatura",histLink:"🗂 Storico",autoSaveL:"Conserva automaticamente i miei kit (cifrati su server UE, rimossi dopo 24 mesi)",histOpen:"🗂 Apri lo Storico",histExport:"⬇ Esporta tutti i kit",histDelete:"🗑 Cancella lo storico",histConfirm:"Cancellare TUTTO lo storico dei kit? L'operazione è definitiva.",histDeleted:"Storico cancellato."},
    en:{profH:"👤 Your profile (memory)",profSub:"Who you are, what you sell, how you answer: makes suggestions tailored. All optional.",profRoleL:"Role",profRolePh:"E.g. Account Executive",profCompanyL:"Company / product",profCompanyPh:"E.g. HR software for SMBs",profCvL:"CV / experience",profCvPh:"E.g. 10 years of B2B sales, first in banking then SaaS…",profStyleL:"Answering style",profStylePh:"E.g. direct but friendly, short sentences",profObjL:"Recurring objections / questions",profObjPh:"E.g. too expensive; we already have a vendor; let's talk in September",profConsentL:"I consent to saving my profile on my <b>account</b> (EU servers) so I find it on all my devices",profExport:"⬇ Export my data",profDelete:"🗑 Delete profile",profDeleteConfirm:"Delete the profile from the server and this device? This cannot be undone.",profStoredAccount:"💾 Profile saved on your account (EU servers), synced across your devices. You can export or delete it anytime.",profStoredDevice:"💾 Profile saved only on this device: it is not sent to any server.",profSynced:"✔ Synced to your account",profDeleted:"Profile deleted everywhere.",profServerOff:"Profile removed from the server: it stays only on this device.",fbQ:"Did it help?",fbUsed:"👍 Used",fbEdited:"✍️ Edited",fbIgnored:"👎 Ignored",fbSend:"Send your version",fbThanks:"Thanks, recorded ✔",kitLink:"🧩 Application kit",histLink:"🗂 History",autoSaveL:"Automatically keep my kits (encrypted on EU servers, removed after 24 months)",histOpen:"🗂 Open History",histExport:"⬇ Export all kits",histDelete:"🗑 Delete history",histConfirm:"Delete your ENTIRE kit history? This cannot be undone.",histDeleted:"History deleted."},
    zh:{profH:"👤 你的档案（记忆）",profSub:"你是谁、卖什么、怎样回答：让建议更贴合你。全部可选。",profRoleL:"职位",profRolePh:"例：客户经理",profCompanyL:"公司 / 产品",profCompanyPh:"例：面向中小企业的 HR 软件",profCvL:"简历 / 经验",profCvPh:"例：10 年 B2B 销售经验，先银行后 SaaS……",profStyleL:"回答风格",profStylePh:"例：直接但友好，句子简短",profObjL:"常见异议 / 问题",profObjPh:"例：太贵了；我们已有供应商；九月再谈",profConsentL:"我同意将档案保存到我的<b>账户</b>（欧盟服务器），以便在所有设备上使用",profExport:"⬇ 导出我的数据",profDelete:"🗑 删除档案",profDeleteConfirm:"从服务器和本设备删除档案？此操作不可撤销。",profStoredAccount:"💾 档案已保存到你的账户（欧盟服务器），在你的设备间同步。可随时导出或删除。",profStoredDevice:"💾 档案仅保存在本设备：不会发送到任何服务器。",profSynced:"✔ 已同步到你的账户",profDeleted:"档案已全部删除。",profServerOff:"档案已从服务器移除：仅保留在本设备。",fbQ:"有帮助吗？",fbUsed:"👍 已使用",fbEdited:"✍️ 已修改",fbIgnored:"👎 已忽略",fbSend:"发送我的版本",fbThanks:"谢谢，已记录 ✔",kitLink:"🧩 求职申请包",histLink:"🗂 历史记录",autoSaveL:"自动保存我的申请包（欧盟服务器加密存储，24 个月后删除）",histOpen:"🗂 打开历史记录",histExport:"⬇ 导出全部",histDelete:"🗑 删除历史记录",histConfirm:"删除全部历史记录？此操作不可撤销。",histDeleted:"历史记录已删除。"},
    es:{profH:"👤 Tu perfil (memoria)",profSub:"Quién eres, qué vendes, cómo respondes: hace las sugerencias a medida. Todo opcional.",profRoleL:"Rol",profRolePh:"Ej: Account Executive",profCompanyL:"Empresa / producto",profCompanyPh:"Ej: software de RRHH para pymes",profCvL:"CV / experiencia",profCvPh:"Ej: 10 años de ventas B2B, primero en banca y luego en SaaS…",profStyleL:"Estilo de respuesta",profStylePh:"Ej: directo pero cordial, frases cortas",profObjL:"Objeciones / preguntas recurrentes",profObjPh:"Ej: es muy caro; ya tenemos proveedor; hablamos en septiembre",profConsentL:"Acepto guardar mi perfil en mi <b>cuenta</b> (servidores en la UE) para encontrarlo en todos mis dispositivos",profExport:"⬇ Exportar mis datos",profDelete:"🗑 Borrar perfil",profDeleteConfirm:"¿Borrar el perfil del servidor y de este dispositivo? No se puede deshacer.",profStoredAccount:"💾 Perfil guardado en tu cuenta (servidores en la UE), sincronizado en tus dispositivos. Puedes exportarlo o borrarlo cuando quieras.",profStoredDevice:"💾 Perfil guardado solo en este dispositivo: no se envía a ningún servidor.",profSynced:"✔ Sincronizado en tu cuenta",profDeleted:"Perfil borrado en todas partes.",profServerOff:"Perfil eliminado del servidor: queda solo en este dispositivo.",fbQ:"¿Te ha servido?",fbUsed:"👍 Usada",fbEdited:"✍️ Modificada",fbIgnored:"👎 Ignorada",fbSend:"Enviar mi versión",fbThanks:"Gracias, registrado ✔",kitLink:"🧩 Kit de candidatura",histLink:"🗂 Historial",autoSaveL:"Guardar automáticamente mis kits (cifrados en servidores UE, eliminados tras 24 meses)",histOpen:"🗂 Abrir el Historial",histExport:"⬇ Exportar todos",histDelete:"🗑 Borrar historial",histConfirm:"¿Borrar TODO el historial de kits? No se puede deshacer.",histDeleted:"Historial borrado."}
  };
  Object.keys(T2).forEach(l=>Object.assign(T[l],T2[l]));
  Object.keys(T3).forEach(l=>Object.assign(T[l],T3[l]));
  /* accessibilità: skip link + dialog di conferma */
  const T4={
    it:{skipLink:"Salta al contenuto",dlgT:"Conferma",dlgYes:"Sì",dlgNo:"Annulla"},
    en:{skipLink:"Skip to content",dlgT:"Confirm",dlgYes:"Yes",dlgNo:"Cancel"},
    zh:{skipLink:"跳到主要内容",dlgT:"确认",dlgYes:"是",dlgNo:"取消"},
    es:{skipLink:"Saltar al contenido",dlgT:"Confirmar",dlgYes:"Sí",dlgNo:"Cancelar"}
  };
  Object.keys(T4).forEach(l=>Object.assign(T[l],T4[l]));
  /* Claim onesti (revisione esterna): "100% locale" è riservato al client
     desktop; sulla pagina web Ollama non è raggiungibile (CSP senza loopback)
     e il riconoscimento vocale dipende dal browser. La promessa UE vale per la
     modalità sovrana (Pro/Kit), non per BYOK. Queste stringhe SOVRASCRIVONO
     le precedenti. */
  const T6={
    it:{docTitle:"Live Call Copilot — il tuo assistente per le videochiamate",docDesc:"Il copilota AI open e privato per le tue chiamate: ascolta e suggerisce cosa dire, in tempo reale.",cancel:"⏹ Annulla",cancelled:"Annullato.",partialKept:"Risposta interrotta: tengo la parte ricevuta",rateLimited:"Troppe richieste: riprova tra {s}s",opFailed:"Operazione NON riuscita:",retryHint:"i dati sono ancora lì, riprova.",errNet:"rete non raggiungibile",errTimeout:"tempo scaduto",errAuth:"sessione scaduta, accedi di nuovo"},
    en:{docTitle:"Live Call Copilot — your live-call assistant",docDesc:"The open, private AI copilot for your calls: it listens and suggests what to say, in real time.",cancel:"⏹ Cancel",cancelled:"Cancelled.",partialKept:"Answer interrupted: keeping what arrived",rateLimited:"Too many requests: retry in {s}s",opFailed:"Operation FAILED:",retryHint:"your data is still there, please retry.",errNet:"network unreachable",errTimeout:"timed out",errAuth:"session expired, sign in again"},
    zh:{docTitle:"Live Call Copilot — 你的视频通话助手",docDesc:"开放、私密的通话 AI 副驾驶：实时聆听并建议你该说什么。",cancel:"⏹ 取消",cancelled:"已取消。",partialKept:"回答被中断：保留已收到部分",rateLimited:"请求过多：{s} 秒后重试",opFailed:"操作失败：",retryHint:"数据仍在，请重试。",errNet:"网络不可达",errTimeout:"超时",errAuth:"会话已过期，请重新登录"},
    es:{docTitle:"Live Call Copilot — tu asistente para videollamadas",docDesc:"El copiloto de IA abierto y privado para tus llamadas: escucha y sugiere qué decir, en tiempo real.",cancel:"⏹ Cancelar",cancelled:"Cancelado.",partialKept:"Respuesta interrumpida: conservo lo recibido",rateLimited:"Demasiadas solicitudes: reintenta en {s}s",opFailed:"Operación FALLIDA:",retryHint:"tus datos siguen ahí, reinténtalo.",errNet:"red no disponible",errTimeout:"tiempo agotado",errAuth:"sesión caducada, vuelve a entrar"}
  };
  Object.keys(T6).forEach(l=>Object.assign(T[l],T6[l]));
  const T5={
    it:{
      localT:"LLM locale (Ollama)",localD:"Solo dal client desktop o aprendo il file in locale: la pagina web non può parlare con Ollama. Lì nessun testo lascia il PC.",
      localNoteWeb:"🔒 Da questa pagina web Ollama NON è raggiungibile (la policy di sicurezza del sito non autorizza chiamate a localhost — di proposito). Per l'LLM locale: scarica il file index.html e aprilo dal PC, oppure usa l'app desktop; Ollama accetta già le origini file:// e tauri:// senza configurazione. Nota: il riconoscimento vocale dipende comunque dal browser.",
      localNoteLocal:"🔒 Esecuzione locale: Ollama gira sul tuo PC e riceve solo la trascrizione. Se servi la pagina da un'altra origine locale, imposta OLLAMA_ORIGINS sull'origine esatta (es. http://localhost:8080), mai *. Il riconoscimento vocale dipende dal browser (vedi nota sotto i comandi).",
      proD:"Accedi: i tuoi dati vanno solo su modelli e server UE (Mistral). Chiave nostra, €9/mese.",
      sensNote:"🔒 Le trascrizioni sono dati sensibili: in Pro il server le instrada <b>sempre e solo</b> su modelli e server in <b>UE</b>. Non è un interruttore: vale anche se il client chiedesse altro.",
      nonEuWarn:"⚠️ Hai scelto un modello <b>extra-UE</b>: prima di ogni invio ti verrà chiesto un consenso esplicito e ti diremo esattamente cosa uscirebbe dall'UE.",
      nonEuT:"Dati sensibili fuori dall'UE",nonEuP:"Il modello che hai scelto ({model}, provider {provider}) è {region}. Verrebbero trasmessi: {data}. Il profilo del tuo account NON viene mai incluso. Vuoi inviare comunque?",nonEuYes:"Invia fuori UE",nonEuNo:"Annulla",
      dataTranscript:"la trascrizione della conversazione",dataProfile:"il profilo",
      mxCap:"Dove vanno i dati per ogni modalità",mxMode:"Modalità",mxWhere:"Dove vanno i tuoi dati",
      mxLocalT:"🔒 Locale / Ollama",mxLocalD:"Solo sul tuo dispositivo (client desktop o file aperto in locale). Il riconoscimento vocale dipende dal browser.",
      mxByokT:"🔑 BYOK",mxByokD:"Al provider che scegli tu, con la tua chiave e le sue condizioni. Google, OpenAI, Anthropic, Groq, DeepSeek, Qwen, Kimi sono extra-UE; Mistral è UE.",
      mxEuT:"⭐ Pro / Kit europeo",mxEuD:"Solo modelli e server in <span class=\"ds-eu\">EU</span> (Mistral, Parigi), imposto dal server. Effimero, oppure salvato cifrato solo col tuo consenso.",
      sttLocal:"🎙 Riconoscimento vocale sul dispositivo (on-device).",
      sttBrowser:"🎙 Riconoscimento vocale del browser: può usare un servizio remoto del produttore del browser (non nostro). On-device non disponibile qui.",
      sttLocalRequired:"Modalità locale: il riconoscimento vocale on-device non è disponibile in questo browser, quindi non avvio (l'audio andrebbe a un servizio remoto). Usa Chrome recente con il pacchetto lingua, oppure scrivi la domanda a mano.",
    },
    en:{
      localT:"Local LLM (Ollama)",localD:"Only from the desktop client or by opening the file locally: this web page cannot talk to Ollama. There, no text leaves your PC.",
      localNoteWeb:"🔒 From this web page Ollama is NOT reachable (the site's security policy blocks calls to localhost — on purpose). For a local LLM: download index.html and open it from your PC, or use the desktop app; Ollama already accepts file:// and tauri:// origins with no configuration. Note: speech recognition still depends on the browser.",
      localNoteLocal:"🔒 Local run: Ollama runs on your PC and only receives the transcript. If you serve the page from another local origin, set OLLAMA_ORIGINS to that exact origin (e.g. http://localhost:8080), never *. Speech recognition depends on the browser (see the note under the controls).",
      proD:"Sign in: your data goes only to EU models and servers (Mistral). Our key, €9/month.",
      sensNote:"🔒 Transcripts are sensitive data: in Pro the server routes them <b>always and only</b> to models and servers in the <b>EU</b>. It is not a switch: it holds even if the client asked otherwise.",
      nonEuWarn:"⚠️ You picked a <b>non-EU</b> model: before each send you'll be asked for explicit consent and told exactly what would leave the EU.",
      nonEuT:"Sensitive data outside the EU",nonEuP:"The model you chose ({model}, provider {provider}) is {region}. This would be sent: {data}. Your account profile is NEVER included. Send anyway?",nonEuYes:"Send outside EU",nonEuNo:"Cancel",
      dataTranscript:"the conversation transcript",dataProfile:"the profile",
      mxCap:"Where your data goes in each mode",mxMode:"Mode",mxWhere:"Where your data goes",
      mxLocalT:"🔒 Local / Ollama",mxLocalD:"Only on your device (desktop client or file opened locally). Speech recognition depends on the browser.",
      mxByokT:"🔑 BYOK",mxByokD:"To the provider you choose, with your key and its terms. Google, OpenAI, Anthropic, Groq, DeepSeek, Qwen, Kimi are non-EU; Mistral is EU.",
      mxEuT:"⭐ Pro / European Kit",mxEuD:"Only models and servers in the <span class=\"ds-eu\">EU</span> (Mistral, Paris), enforced by the server. Ephemeral, or stored encrypted only with your consent.",
      sttLocal:"🎙 On-device speech recognition.",
      sttBrowser:"🎙 Browser speech recognition: it may use a remote service run by the browser vendor (not us). On-device is not available here.",
      sttLocalRequired:"Local mode: on-device speech recognition is not available in this browser, so I won't start (audio would go to a remote service). Use a recent Chrome with the language pack, or type the question.",
    },
    zh:{
      localT:"本地 LLM（Ollama）",localD:"仅限桌面客户端或本地打开文件：此网页无法连接 Ollama。在那里，文本不会离开你的电脑。",
      localNoteWeb:"🔒 从此网页无法访问 Ollama（站点安全策略有意阻止对 localhost 的调用）。要使用本地 LLM：下载 index.html 并从电脑打开，或使用桌面应用；Ollama 默认接受 file:// 与 tauri:// 来源。注意：语音识别仍取决于浏览器。",
      localNoteLocal:"🔒 本地运行：Ollama 在你的电脑上运行，只接收转录。若从其他本地来源提供页面，请将 OLLAMA_ORIGINS 设为该确切来源（如 http://localhost:8080），切勿使用 *。语音识别取决于浏览器。",
      proD:"登录：你的数据只发送到欧盟的模型与服务器（Mistral）。我们提供密钥，€9/月。",
      sensNote:"🔒 转录属于敏感数据：在 Pro 模式下服务器<b>始终且仅</b>路由到<b>欧盟</b>的模型与服务器。这不是开关：即使客户端另有要求也同样适用。",
      nonEuWarn:"⚠️ 你选择了<b>非欧盟</b>模型：每次发送前都会请求明确同意，并告知哪些数据会离开欧盟。",
      nonEuT:"敏感数据将离开欧盟",nonEuP:"你选择的模型（{model}，提供商 {provider}）位于{region}。将发送：{data}。你的账户档案绝不会包含在内。仍要发送吗？",nonEuYes:"发送到欧盟以外",nonEuNo:"取消",
      dataTranscript:"对话转录",dataProfile:"档案",
      mxCap:"各模式下数据的去向",mxMode:"模式",mxWhere:"数据去向",
      mxLocalT:"🔒 本地 / Ollama",mxLocalD:"仅在你的设备上（桌面客户端或本地打开的文件）。语音识别取决于浏览器。",
      mxByokT:"🔑 自带密钥",mxByokD:"发送到你选择的提供商，使用你的密钥与其条款。Google、OpenAI、Anthropic、Groq、DeepSeek、Qwen、Kimi 为非欧盟；Mistral 为欧盟。",
      mxEuT:"⭐ Pro / 欧洲版申请包",mxEuD:"仅使用<span class=\"ds-eu\">EU</span>内的模型与服务器（Mistral，巴黎），由服务器强制执行。临时处理，或仅在你同意时加密保存。",
      sttLocal:"🎙 设备端语音识别。",
      sttBrowser:"🎙 浏览器语音识别：可能使用浏览器厂商的远程服务（非我们）。此处无法使用设备端识别。",
      sttLocalRequired:"本地模式：此浏览器不支持设备端语音识别，因此不会启动（音频会发送到远程服务）。请使用带语言包的新版 Chrome，或手动输入问题。",
    },
    es:{
      localT:"LLM local (Ollama)",localD:"Solo desde el cliente de escritorio o abriendo el archivo en local: esta página web no puede hablar con Ollama. Allí ningún texto sale de tu PC.",
      localNoteWeb:"🔒 Desde esta página web Ollama NO es accesible (la política de seguridad del sitio bloquea llamadas a localhost — a propósito). Para el LLM local: descarga index.html y ábrelo desde tu PC, o usa la app de escritorio; Ollama ya acepta los orígenes file:// y tauri:// sin configuración. Nota: el reconocimiento de voz sigue dependiendo del navegador.",
      localNoteLocal:"🔒 Ejecución local: Ollama corre en tu PC y solo recibe la transcripción. Si sirves la página desde otro origen local, pon OLLAMA_ORIGINS en ese origen exacto (p. ej. http://localhost:8080), nunca *. El reconocimiento de voz depende del navegador.",
      proD:"Inicia sesión: tus datos van solo a modelos y servidores de la UE (Mistral). Clave nuestra, 9 €/mes.",
      sensNote:"🔒 Las transcripciones son datos sensibles: en Pro el servidor las envía <b>siempre y solo</b> a modelos y servidores de la <b>UE</b>. No es un interruptor: vale aunque el cliente pidiera otra cosa.",
      nonEuWarn:"⚠️ Has elegido un modelo <b>fuera de la UE</b>: antes de cada envío se te pedirá consentimiento explícito y te diremos qué saldría de la UE.",
      nonEuT:"Datos sensibles fuera de la UE",nonEuP:"El modelo elegido ({model}, proveedor {provider}) está {region}. Se enviaría: {data}. El perfil de tu cuenta NUNCA se incluye. ¿Enviar igualmente?",nonEuYes:"Enviar fuera de la UE",nonEuNo:"Cancelar",
      dataTranscript:"la transcripción de la conversación",dataProfile:"el perfil",
      mxCap:"Adónde van los datos en cada modo",mxMode:"Modo",mxWhere:"Adónde van tus datos",
      mxLocalT:"🔒 Local / Ollama",mxLocalD:"Solo en tu dispositivo (cliente de escritorio o archivo abierto en local). El reconocimiento de voz depende del navegador.",
      mxByokT:"🔑 BYOK",mxByokD:"Al proveedor que elijas, con tu clave y sus condiciones. Google, OpenAI, Anthropic, Groq, DeepSeek, Qwen, Kimi están fuera de la UE; Mistral es UE.",
      mxEuT:"⭐ Pro / Kit europeo",mxEuD:"Solo modelos y servidores en la <span class=\"ds-eu\">EU</span> (Mistral, París), impuesto por el servidor. Efímero, o guardado cifrado solo con tu consentimiento.",
      sttLocal:"🎙 Reconocimiento de voz en el dispositivo.",
      sttBrowser:"🎙 Reconocimiento de voz del navegador: puede usar un servicio remoto del fabricante del navegador (no nuestro). En el dispositivo no está disponible aquí.",
      sttLocalRequired:"Modo local: el reconocimiento de voz en el dispositivo no está disponible en este navegador, así que no inicio (el audio iría a un servicio remoto). Usa un Chrome reciente con el paquete de idioma, o escribe la pregunta.",
    }
  };
  Object.keys(T5).forEach(l=>Object.assign(T[l],T5[l]));
  /* La pagina è "web" se servita via http(s): lì la CSP vieta il loopback e
     Ollama non è raggiungibile. file:// e tauri:// = esecuzione locale. */
  const IS_WEB=/^https?:$/.test(location.protocol);
  let LANG='en';
  function t(k){ return (T[LANG]&&T[LANG][k])||T.it[k]||k; }
  function applyLang(){
    document.documentElement.lang=LANG;
    document.title=t('docTitle'); const md=document.querySelector('meta[name="description"]'); if(md&&t('docDesc')!=='docDesc') md.setAttribute('content',t('docDesc'));
    document.querySelectorAll('[data-i18n]').forEach(el=>el.innerHTML=t(el.getAttribute('data-i18n')));
    // il placeholder diventa nome accessibile SOLO per i campi senza label associata
    document.querySelectorAll('[data-i18n-ph]').forEach(el=>{el.placeholder=t(el.getAttribute('data-i18n-ph'));if(!(el.labels&&el.labels.length))el.setAttribute('aria-label',el.placeholder);});
    $('howtoBody').innerHTML=t('how'); buildModeOptions(); refreshProviderLabels(); renderProfileWhere();
    listenBtn.querySelector('span').textContent = recognizing? t('stop'):t('listen');
    if(typeof renderSttNote==='function') renderSttNote();
    if($('localNote').style.display!=='none') $('localNote').innerHTML=t(IS_WEB?'localNoteWeb':'localNoteLocal');
  }

  const PROVIDERS={
    gemini:{gemini:true,kind:'gemini',keyUrl:'https://aistudio.google.com/apikey',hint:'AIza...',models:[]},
    ollama:{label:'🔒 Ollama (locale)',kind:'openai',local:true,base:'http://localhost:11434/v1',keyUrl:'https://ollama.com/download',hint:'(nessuna chiave)',models:['llama3.2','qwen2.5','mistral']},
    openai:{label:'OpenAI (GPT)',kind:'openai',base:'https://api.openai.com/v1',keyUrl:'https://platform.openai.com/api-keys',hint:'sk-...',models:['gpt-4o-mini','gpt-4o','o4-mini']},
    anthropic:{label:'Anthropic (Claude)',kind:'anthropic',base:'https://api.anthropic.com/v1',keyUrl:'https://console.anthropic.com/settings/keys',hint:'sk-ant-...',models:['claude-3-5-haiku-latest','claude-3-5-sonnet-latest','claude-sonnet-4-20250514']},
    mistral:{label:'Mistral 🇪🇺 (europeo)',kind:'openai',base:'https://api.mistral.ai/v1',keyUrl:'https://console.mistral.ai/api-keys',hint:'...',models:['mistral-large-latest','mistral-small-latest','open-mistral-nemo']},
    deepseek:{label:'DeepSeek',kind:'openai',base:'https://api.deepseek.com/v1',keyUrl:'https://platform.deepseek.com/api_keys',hint:'sk-...',models:['deepseek-chat','deepseek-reasoner']},
    qwen:{label:'Qwen (Alibaba)',kind:'openai',base:'https://dashscope-intl.aliyuncs.com/compatible-mode/v1',keyUrl:'https://dashscope.console.aliyun.com/',hint:'sk-...',models:['qwen-plus','qwen-turbo','qwen-max']},
    kimi:{label:'Kimi (Moonshot)',kind:'openai',base:'https://api.moonshot.ai/v1',keyUrl:'https://platform.moonshot.ai/console/api-keys',hint:'sk-...',models:['kimi-k2-0711-preview','moonshot-v1-8k']},
    groq:{label:'Groq ⚡',kind:'openai',base:'https://api.groq.com/openai/v1',keyUrl:'https://console.groq.com/keys',hint:'gsk_...',models:['llama-3.3-70b-versatile','llama-3.1-8b-instant']},
    custom:{label:'Custom (OpenAI-compatible)',kind:'openai',base:'',keyUrl:'',hint:'',models:[]}
  };
  const PKEYS=Object.keys(PROVIDERS);
  const providerEl=$('provider');
  PKEYS.forEach(k=>{const o=document.createElement('option');o.value=k;providerEl.appendChild(o);});
  function refreshProviderLabels(){ [...providerEl.options].forEach(o=>{const p=PROVIDERS[o.value];o.textContent=p.gemini?('Google Gemini ✧ '+({it:'gratis',en:'free',zh:'免费',es:'gratis'}[LANG])):p.label;}); }
  function curProv(){ return PROVIDERS[providerEl.value]; }

  const MODES={
    interview:{it:'Colloquio di lavoro',en:'Job interview',zh:'求职面试',es:'Entrevista de trabajo',p:"You are the copilot of a CANDIDATE in a job interview. Detect the interviewer's LAST question and craft a spoken, first-person answer, confident, concise (4-7 sentences), grounded in the candidate context. Use STAR for behavioral questions."},
    sales:{it:'Vendite',en:'Sales call',zh:'销售通话',es:'Llamada de ventas',p:"You are the copilot of a SALESPERSON. Detect the prospect's last point/objection and suggest a persuasive, empathetic first-person reply handling objections, showing value, moving to next steps."},
    support:{it:'Assistenza clienti',en:'Customer support',zh:'客户支持',es:'Atención al cliente',p:"You are the copilot of a SUPPORT AGENT. Detect the customer's issue and suggest a clear, friendly, solution-oriented reply with concrete next steps."},
    meeting:{it:'Riunione',en:'Meeting',zh:'会议',es:'Reunión',p:"You are a meeting copilot. Detect the last question/point and suggest a clear, professional first-person response."},
    negotiation:{it:'Negoziazione',en:'Negotiation',zh:'谈判',es:'Negociación',p:"You are a negotiation copilot. Detect the counterpart's last move and suggest a calm, strategic first-person reply that protects interests and keeps rapport."},
    translate:{it:'Traduzione simultanea',en:'Live translation',zh:'同声翻译',es:'Traducción simultánea',p:"__translate__"},
    study:{it:'Studio / esame',en:'Study / exam',zh:'学习/考试',es:'Estudio / examen',p:"You are a study copilot. Detect the examiner's question and give a correct, well-structured spoken answer."},
    custom:{it:'Personalizzato',en:'Custom',zh:'自定义',es:'Personalizado',p:"__custom__"}
  };
  const modeEl=$('mode');
  function buildModeOptions(){const cur=modeEl.value||'interview';modeEl.innerHTML='';Object.keys(MODES).forEach(k=>{const o=document.createElement('option');o.value=k;o.textContent=MODES[k][LANG]||MODES[k].it;modeEl.appendChild(o);});modeEl.value=cur;}

  /* Storage OPT-IN (P0 sicurezza): di default tutto vive in sessionStorage
     (muore con la scheda). Solo con "Ricorda" spuntato si scrive su
     localStorage. La cancellazione pulisce SEMPRE entrambi. */
  /* Facciata dal nucleo condiviso (assets/lcc-core-v1.js): localStorage si
     legge SOLO con opt-in valido; le copie legacy sono già state migrate. */
  const store=window.LCC.store;
  const KEYS=['v5_lang','v5_prov','v5_mode','v5_heard','v5_ans','v5_ctx','v5_auto','v5_remember','v6_pro','v6_promodel','v7_role','v7_company','v7_cv','v7_style','v7_obj'];
  // Profilo strutturato: id campo → chiave localStorage (v5_ctx resta solo per migrare il vecchio campo libero)
  const PF_KEYS={pfRole:'v7_role',pfCompany:'v7_company',pfCv:'v7_cv',pfStyle:'v7_style',pfObj:'v7_obj'};
  const PF_IDS=Object.keys(PF_KEYS);
  const keyName=()=>'v5_key_'+providerEl.value;
  function save(){
    // opt-in/opt-out: lo decide il nucleo (opt-out = via OGNI copia persistente dei nostri namespace)
    window.LCC.store.setOptIn($('remember').checked);
    store.set('v5_lang',LANG);store.set('v5_prov',providerEl.value);store.set('v5_mode',modeEl.value);store.set('v6_pro',proMode?'1':'0');
    store.set('v5_heard',$('lang').value);store.set('v5_ans',$('ansLang').value);store.set('v5_auto',autoMode?'1':'0');
    PF_IDS.forEach(id=>store.set(PF_KEYS[id],$(id).value));
    if($('model').value)store.set('v5_model_'+providerEl.value,$('model').value);
    if($('baseUrl').value)store.set('v5_base_'+providerEl.value,$('baseUrl').value);
    if($('apiKey').value.trim())store.set(keyName(),$('apiKey').value.trim());
  }

  let finalText='',recognizing=false,recognition=null,autoMode=true,busy=false,pauseTimer=null,lastLen=0,lastAnswer='';
  const setupStatus=$('setupStatus'),liveStatus=$('liveStatus'),transcriptEl=$('transcript'),answerEl=$('answer');
  const listenBtn=$('listenBtn'),autoBtn=$('autoBtn'),suggestBtn=$('suggestBtn'),recDot=$('recDot');
  function setS(el,msg,cls){el.textContent=msg;el.className='status '+(cls||'');
    if(cls==='err'&&msg){const a=$('a11yAlert');if(a){a.textContent='';a.textContent=msg;}}}

  /* conferma accessibile via <dialog> nativo (focus trap + Esc dal browser) */
  function askConfirm(msg){
    return new Promise(resolve=>{
      const dlg=$('confirmDlg');
      $('confirmDlgT').textContent=t('dlgT'); $('confirmDlgP').textContent=msg;
      $('confirmDlgYes').textContent=t('dlgYes'); $('confirmDlgNo').textContent=t('dlgNo');
      const opener=document.activeElement;
      let result=false;
      $('confirmDlgYes').onclick=()=>{result=true;dlg.close();};
      $('confirmDlgNo').onclick=()=>dlg.close();
      dlg.onclose=()=>{resolve(result);if(opener&&opener.focus)opener.focus();};
      dlg.showModal();
    });
  }

  /* onboarding choice: gruppo radio ARIA con roving tabindex */
  let proMode=false;
  const CHOICES=['choiceFree','choiceOwn','choiceLocal','choicePro'];
  function selChoice(which){ CHOICES.forEach(c=>{const on=c===which;$(c).classList.toggle('sel',on);$(c).setAttribute('aria-checked',String(on));$(c).setAttribute('tabindex',on?'0':'-1');}); }
  CHOICES.forEach((c,idx)=>$(c).addEventListener('keydown',e=>{
    if(e.key==='Enter'||e.key===' '){e.preventDefault();$(c).click();return;}
    if(e.key==='ArrowRight'||e.key==='ArrowDown'||e.key==='ArrowLeft'||e.key==='ArrowUp'){
      e.preventDefault();
      const dir=(e.key==='ArrowRight'||e.key==='ArrowDown')?1:CHOICES.length-1;
      const next=$(CHOICES[(idx+dir)%CHOICES.length]);
      next.focus(); next.click();
    }
  }));
  $('choiceFree').addEventListener('click',()=>{ proMode=false; providerEl.value='gemini'; selChoice('choiceFree'); $('ownWrap').style.display='none'; syncProvider(); save(); });
  $('choiceOwn').addEventListener('click',()=>{ proMode=false; if(providerEl.value==='gemini'||providerEl.value==='ollama')providerEl.value='openai'; selChoice('choiceOwn'); $('ownWrap').style.display=''; syncProvider(); save(); });
  $('choiceLocal').addEventListener('click',()=>{ proMode=false; providerEl.value='ollama'; selChoice('choiceLocal'); $('ownWrap').style.display='none'; syncProvider(); save(); });
  $('choicePro').addEventListener('click',()=>{ proMode=true; selChoice('choicePro'); $('ownWrap').style.display='none'; syncProvider(); refreshMe(); save(); });
  providerEl.addEventListener('change',()=>{syncProvider();save();});

  function syncProvider(){
    const p=curProv(); const local=!!p.local&&!proMode;
    $('proWrap').style.display=proMode?'':'none';
    $('keyLabel').style.display=proMode?'none':'';
    $('keyRow').style.display=proMode?'none':'';
    // nota "locale" onesta: sul web spiega che Ollama non è raggiungibile e come fare davvero
    $('localNote').innerHTML=t(IS_WEB?'localNoteWeb':'localNoteLocal');
    $('localNote').style.display=(local)?'':'none';
    if(proMode){ $('baseWrap').style.display='none'; suggestBtn.disabled=!meUser; setS(setupStatus,'',''); refreshNonEuWarn(); return; }
    $('keyLink').href=p.keyUrl||'#'; $('apiKey').placeholder=local?'(nessuna chiave — locale)':(p.hint||'API key');
    $('apiKey').disabled=local;
    $('baseWrap').style.display=(providerEl.value==='custom'||local)?'':'none';
    const dl=$('modelList');dl.innerHTML='';(p.models||[]).forEach(m=>{const o=document.createElement('option');o.value=m;dl.appendChild(o);});
    $('apiKey').value=local?'':(store.get(keyName())||'');
    $('model').value=store.get('v5_model_'+providerEl.value)||(p.models&&p.models[0])||'';
    $('baseUrl').value=store.get('v5_base_'+providerEl.value)||(p.base||'');
    // sul web la modalità Ollama non può funzionare (CSP): il pulsante resta spento
    suggestBtn.disabled = local? IS_WEB : !$('apiKey').value.trim(); setS(setupStatus,'','');
  }

  /* ---- Account & piano Pro (nostro backend) ---- */
  let meUser=null, mePlan=null;
  // helper unico: lancia SEMPRE su risposta non-2xx, rete giù, timeout
  const api=(path,opts={})=>window.LCC.api(BACKEND_URL+path,opts);
  function setAc(msg,cls){const el=$('acStatus');el.textContent=msg;el.className='status '+(cls||'');}
  function renderAccount(d){
    const inEl=$('proLoggedIn'),outEl=$('proLoggedOut');
    if(!d){ inEl.style.display='none'; outEl.style.display=''; if(proMode)suggestBtn.disabled=true; return; }
    outEl.style.display='none'; inEl.style.display='';
    const pro=d.plan!=='free';
    $('proPlanNote').textContent=t('acHello')+' '+d.user.name+' ('+d.user.email+') — '+t('acPlan')+': '+d.plan.toUpperCase()+' · '+d.limits.requestsPerMinute+' '+t('acRpm')+(pro?'':' — '+t('acFree'));
    $('proUpgradeRow').style.display=pro?'none':'';
    if(proMode)suggestBtn.disabled=false;
  }
  async function refreshMe(){
    try{
      const d=await window.LCC.api.json(BACKEND_URL+'/v1/me'); meUser=d.user; mePlan=d.plan; renderAccount(d); loadProModels(); pullProfile();
      $('autoSaveKits').checked=!!(d.preferences&&d.preferences.autoSaveKits);
    }catch(e){ meUser=null;mePlan=null;renderAccount(null); renderProfileWhere(); if(proMode&&!(e&&e.status===401))setAc(t('acBackendDown'),'err'); }
  }
  async function loadProModels(){
    try{
      const d=await window.LCC.api.json(BACKEND_URL+'/v1/models');
      const sel=$('proModel'); const saved=store.get('v6_promodel'); sel.innerHTML='';
      // Prima scelta: routing automatico (M2) — il backend sceglie e spiega perché.
      const auto=document.createElement('option'); auto.value='auto'; auto.textContent=t('autoOpt'); sel.appendChild(auto);
      // etichetta onesta: si vede subito quali modelli sono UE e quali no
      d.models.filter(m=>m.available).forEach(m=>{const o=document.createElement('option');o.value=m.id;o.textContent=m.label+(m.eu?' · EU':' · extra-UE');o.dataset.eu=m.eu?'1':'0';o.dataset.provider=m.provider||'';sel.appendChild(o);});
      sel.value=(saved && [...sel.options].some(o=>o.value===saved))? saved : 'auto';
      refreshNonEuWarn();
    }catch(_){}
  }
  /* Modello extra-UE scelto a mano: avviso subito e consenso PRIMA di ogni invio.
     Il server rifiuta comunque (409) senza nonEuConsent: qui si raccoglie il
     consenso informato mostrando provider, regione e dati trasmessi. */
  function refreshNonEuWarn(){ const o=$('proModel').selectedOptions[0]; $('nonEuWarn').style.display=(o&&o.dataset.eu==='0')?'':'none'; }
  $('proModel').addEventListener('change',()=>{refreshNonEuWarn();store.set('v6_promodel',$('proModel').value);});
  async function askNonEuConsent(disc){
    const dataLabels=(disc.data||[]).map(k=>k==='transcript'?t('dataTranscript'):k==='profile'?t('dataProfile'):k).join(', ');
    const msg=t('nonEuP').replace('{model}',disc.model||'').replace('{provider}',disc.provider||'').replace('{region}',disc.region||'extra-UE').replace('{data}',dataLabels||'—');
    return new Promise(resolve=>{
      const dlg=$('confirmDlg');
      $('confirmDlgT').textContent=t('nonEuT'); $('confirmDlgP').textContent=msg;
      $('confirmDlgYes').textContent=t('nonEuYes'); $('confirmDlgNo').textContent=t('nonEuNo');
      const opener=document.activeElement; let ok=false;
      $('confirmDlgYes').onclick=()=>{ok=true;dlg.close();}; $('confirmDlgNo').onclick=()=>dlg.close();
      dlg.onclose=()=>{resolve(ok);if(opener&&opener.focus)opener.focus();};
      dlg.showModal();
    });
  }
  /* return_to: dopo il login si torna alla pagina di provenienza (allowlist
     di pagine nostre: mai URL arbitrari). */
  const RETURN_MAP={kit:'kit.html',storico:'storico.html',jobs:'jobs.html',practice:'practice.html'};
  let RETURN_TO=null;
  try{const rp=new URLSearchParams(location.search).get('return_to');if(rp&&RETURN_MAP[rp])RETURN_TO=RETURN_MAP[rp];}catch(_){}

  async function authCall(path){
    const email=$('acEmail').value.trim(), password=$('acPass').value;
    if(!email||!password){setAc(t('acNeedFields'),'err');return;}
    setAc(t('acWorking'),'work');
    try{
      const body=path.indexOf('sign-up')>=0? {name:email.split('@')[0],email,password} : {email,password};
      await api(path,{method:'POST',body:JSON.stringify(body)});
      setAc('✔','ok'); $('acPass').value=''; await refreshMe();
      if(RETURN_TO){location.href=RETURN_TO;return;}
    }catch(e){setAc((e&&e.body&&e.body.message)||errText(e),'err');}
  }
  $('proLoggedOut').addEventListener('submit',e=>{e.preventDefault();authCall('/api/auth/sign-in/email');});
  $('signupBtn').addEventListener('click',()=>authCall('/api/auth/sign-up/email'));
  $('logoutBtn').addEventListener('click',async()=>{
    try{await api('/api/auth/sign-out',{method:'POST',body:'{}'});}catch(_){}
    await refreshMe();
  });
  $('upgradeBtn').addEventListener('click',async()=>{
    setAc(t('acWorking'),'work');
    try{
      const d=await window.LCC.api.json(BACKEND_URL+'/v1/billing/checkout',{method:'POST',body:'{}'});
      if(!d||!d.url)throw new Error('checkout');
      // (Modulo I) solo URL https di Stripe, stessa scheda: niente window.open nudo
      let u; try{ u=new URL(d.url); }catch(_){ throw new Error('checkout url'); }
      if(u.protocol!=='https:'||!/(^|\.)stripe\.com$/.test(u.hostname)) throw new Error('checkout origin');
      setAc(t('acPaid'),'work'); location.assign(u.href);
    }catch(e){setAc(e.message,'err');}
  });
  $('syncBtn').addEventListener('click',async()=>{
    setAc(t('acWorking'),'work');
    try{ await api('/v1/billing/sync',{method:'POST',body:'{}'}); setAc('✔','ok'); await refreshMe(); }
    catch(e){setAc(e.message,'err');}
  });

  /* ---- Profilo (memoria persistente, M2) ----
     Sempre salvato in locale. Se l'utente è loggato E ha dato il consenso,
     viene anche sincronizzato sull'account (server UE). La revoca del
     consenso cancella la copia sul server; "Cancella il profilo" cancella
     ovunque (server + questo dispositivo). */
  function profileText(){
    const v=id=>$(id).value.trim(); const parts=[];
    if(v('pfRole'))parts.push('Role: '+v('pfRole'));
    if(v('pfCompany'))parts.push('Company/product: '+v('pfCompany'));
    if(v('pfCv'))parts.push('CV/experience: '+v('pfCv'));
    if(v('pfStyle'))parts.push('Preferred answering style: '+v('pfStyle'));
    if(v('pfObj'))parts.push('Recurring objections/questions to be ready for: '+v('pfObj'));
    return parts.join('\n');
  }
  function errText(e){ const m=(e&&e.message)||''; if(m==='network')return t('errNet'); if(m==='timeout')return t('errTimeout'); if(e&&e.status===401)return t('errAuth'); return m||'?'; }
  function setPf(msg,cls){const el=$('profStatus');el.textContent=msg;el.className='status '+(cls||'');}
  function renderProfileWhere(){
    const synced=!!meUser&&$('profConsent').checked;
    $('profWhere').textContent=synced?t('profStoredAccount'):t('profStoredDevice');
    $('profSyncWrap').style.display=meUser?'':'none';
  }
  async function pushProfile(){
    if(!meUser||!$('profConsent').checked)return;
    try{
      const body={consent:true,role:$('pfRole').value.trim(),company:$('pfCompany').value.trim(),cv:$('pfCv').value.trim(),style:$('pfStyle').value.trim(),objections:$('pfObj').value.trim()};
      const r=await api('/v1/profile',{method:'PUT',body:JSON.stringify(body)});
      if(!r.ok)throw new Error('HTTP '+r.status);
      setPf(t('profSynced'),'ok');
    }catch(e){setPf(t('opFailed')+' '+errText(e)+' — '+t('retryHint'),'err');}
  }
  async function pullProfile(){
    if(!meUser){renderProfileWhere();return;}
    try{
      const d=await window.LCC.api.json(BACKEND_URL+'/v1/profile');
      {
        if(d.exists){ // il server vince: è la copia condivisa tra i dispositivi
          const p=d.profile;
          $('pfRole').value=p.role||'';$('pfCompany').value=p.company||'';$('pfCv').value=p.cv||'';$('pfStyle').value=p.style||'';$('pfObj').value=p.objections||'';
          $('profConsent').checked=true; save();
        }else{ $('profConsent').checked=false; }
      }
    }catch(_){}
    renderProfileWhere();
  }
  $('profConsent').addEventListener('change',async()=>{
    if(!meUser){renderProfileWhere();return;}
    if($('profConsent').checked){ await pushProfile(); }
    else{
      try{ await api('/v1/profile',{method:'DELETE',body:'{}'}); setPf(t('profServerOff'),'ok'); }
      catch(e){ $('profConsent').checked=true; setPf(t('opFailed')+' '+errText(e)+' — '+t('retryHint'),'err'); }
    }
    renderProfileWhere();
  });
  $('profExportBtn').addEventListener('click',()=>window.open(BACKEND_URL+'/v1/profile/export','_blank'));
  $('profDeleteBtn').addEventListener('click',async()=>{
    if(!(await askConfirm(t('profDeleteConfirm'))))return;
    setPf(t('acWorking'),'work');
    try{
      if(meUser){
        await api('/v1/profile',{method:'DELETE',body:'{}'});
        // verifica post-cancellazione: il server non deve più avere un profilo
        const d=await window.LCC.api.json(BACKEND_URL+'/v1/profile');
        if(d&&d.exists) throw new Error('verify');
      }
    }catch(e){ setPf(t('opFailed')+' '+errText(e)+' — '+t('retryHint'),'err'); return; }
    // solo ORA si pulisce la UI e il locale
    PF_IDS.forEach(id=>{$(id).value='';store.del(PF_KEYS[id]);});
    $('profConsent').checked=false; renderProfileWhere(); setPf(t('profDeleted'),'ok');
  });
  PF_IDS.forEach(id=>$(id).addEventListener('change',()=>{save();pushProfile();}));

  /* ---- Storico kit: preferenza account + diritti GDPR (M2 loop) ---- */
  $('autoSaveKits').addEventListener('change',async()=>{
    if(!meUser)return;
    const want=$('autoSaveKits').checked;
    try{ await api('/v1/me/preferences',{method:'PATCH',body:JSON.stringify({autoSaveKits:want})}); setPf('✔','ok'); }
    catch(e){ $('autoSaveKits').checked=!want; setPf(t('opFailed')+' '+errText(e)+' — '+t('retryHint'),'err'); }
  });
  $('histExportBtn').addEventListener('click',()=>window.open(BACKEND_URL+'/v1/kits/export','_blank'));
  $('histDeleteBtn').addEventListener('click',async()=>{
    if(!(await askConfirm(t('histConfirm'))))return;
    setPf(t('acWorking'),'work');
    try{
      await api('/v1/kits',{method:'DELETE',body:'{}'});
      const d=await window.LCC.api.json(BACKEND_URL+'/v1/kits'); // verifica post-cancellazione
      if(d&&Array.isArray(d.kits)&&d.kits.length) throw new Error('verify');
      setPf(t('histDeleted'),'ok');
    }catch(e){ setPf(t('opFailed')+' '+errText(e)+' — '+t('retryHint'),'err'); }
  });

  $('verifyBtn').addEventListener('click',async()=>{
    const p=curProv(),key=$('apiKey').value.trim();
    if(p.local){
      if(IS_WEB){ setS(setupStatus,t('localNoteWeb').replace(/<[^>]+>/g,''),'err'); return; }
      setS(setupStatus,t('thinking'),'work');
      try{
        const base=($('baseUrl').value.trim()||p.base).replace(/\/v1$/,'');
        const r=await fetch(base+'/api/tags'); const d=await r.json();
        const ms=(d.models||[]).map(m=>m.name); const dl=$('modelList');dl.innerHTML='';ms.forEach(m=>{const o=document.createElement('option');o.value=m;dl.appendChild(o);});
        if(ms.length&&!$('model').value)$('model').value=ms[0];
        setS(setupStatus,'✔ Ollama '+(ms.length?('— '+ms.length+' modelli'):'raggiunto'),'ok');save();
      }catch(e){ setS(setupStatus,t('localNoteWeb').replace(/<[^>]+>/g,''),'err'); }
      return;
    }
    if(!key){setS(setupStatus,t('nokey'),'err');return;}
    if(p.gemini){
      setS(setupStatus,t('thinking'),'work');
      try{
        // chiave nell'header, mai nell'URL (finisce in log/proxy/referrer)
        const r=await fetch('https://generativelanguage.googleapis.com/v1beta/models',{headers:{'x-goog-api-key':key}});
        const d=await r.json();if(!r.ok)throw new Error((d.error&&d.error.message)||('HTTP '+r.status));
        const ms=(d.models||[]).filter(m=>(m.supportedGenerationMethods||[]).includes('generateContent')).filter(m=>/gemini/i.test(m.name)&&!/embedding|aqa|imagen/i.test(m.name)).map(m=>m.name.replace('models/',''));
        const dl=$('modelList');dl.innerHTML='';ms.forEach(m=>{const o=document.createElement('option');o.value=m;dl.appendChild(o);});
        const pick=ms.find(n=>/flash/i.test(n)&&/latest/i.test(n))||ms.find(n=>/flash/i.test(n)&&!/2\.5|2\.0|1\.5/.test(n))||ms.find(n=>/flash/i.test(n))||ms[0];
        if(pick)$('model').value=pick; setS(setupStatus,t('valid'),'ok');save();
      }catch(e){setS(setupStatus,'Error: '+e.message,'err');}
    }else{setS(setupStatus,t('valid'),'ok');save();}
  });

  // sul web Ollama non è raggiungibile (CSP): la modalità locale non "gira"
  function canRun(){ return proMode? !!meUser : ($('apiKey').value.trim()||(curProv().local&&!IS_WEB)); }
  function cantRunMsg(){ return proMode? t('acNeedLogin') : (curProv().local&&IS_WEB? t('localNoteWeb').replace(/<[^>]+>/g,'') : t('nokey')); }

  /* Riconoscimento vocale ONESTO. Web Speech API senza processLocally può
     mandare l'audio a un servizio remoto del produttore del browser. Dove il
     browser lo supporta (Chrome ≥139: SpeechRecognition.available/install)
     chiediamo l'elaborazione on-device; in modalità locale è fail-closed:
     senza on-device NON si avvia. Altrove si etichetta, non si promette. */
  const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
  let sttMode='unknown'; // 'local' | 'browser' | 'none'
  async function probeStt(){
    if(!SR){ sttMode='none'; renderSttNote(); return sttMode; }
    let mode='browser';
    try{
      if(typeof SR.available==='function'){
        const lang=$('lang').value||'en-US';
        let st=await SR.available({langs:[lang],processLocally:true});
        if(st==='downloadable'&&typeof SR.install==='function'){ try{ if(await SR.install({langs:[lang],processLocally:true})) st='available'; }catch(_){} }
        if(st==='available') mode='local';
      }
    }catch(_){}
    sttMode=mode; renderSttNote(); return mode;
  }
  function renderSttNote(){ const n=$('sttNote'); if(!n)return; n.textContent= sttMode==='local'? t('sttLocal') : (sttMode==='browser'? t('sttBrowser') : ''); }
  $('lang').addEventListener('change',()=>{ sttMode='unknown'; probeStt(); });
  async function startRec(){
    if(!canRun()){ setS(liveStatus,cantRunMsg(),'err'); showSettings(); return; }
    if(!SR){setS(liveStatus,'Chrome required for speech.','err');return;}
    if(sttMode==='unknown') await probeStt();
    const wantsLocal=!proMode&&!!curProv().local;
    if(wantsLocal&&sttMode!=='local'){ setS(liveStatus,t('sttLocalRequired'),'err'); return; } // fail-closed
    autoMode=true; autoBtn.classList.add('on');
    recognition=new SR();recognition.lang=$('lang').value;recognition.continuous=true;recognition.interimResults=true;
    if(sttMode==='local'){ try{ recognition.processLocally=true; }catch(_){} }
    recognition.onresult=e=>{let itr='',fin='';for(let i=e.resultIndex;i<e.results.length;i++){const x=e.results[i][0].transcript;if(e.results[i].isFinal){finalText+=x+' ';fin+=x+' ';}else itr+=x;}render(itr);if(fin.trim()){const lv=$('transcriptLive');lv.textContent='';lv.textContent=fin.trim();}if(autoMode)sched();};
    const TERMINAL=['not-allowed','service-not-allowed','audio-capture','language-not-supported','bad-grammar'];
    recognition.onerror=e=>{ setS(liveStatus,'Mic: '+e.error,'err'); if(TERMINAL.indexOf(e.error)>=0){ stopRec(); } };
    recognition.onend=()=>{if(recognizing){try{recognition.start()}catch(_){ stopRec(); }}};
    try{recognition.start();recognizing=true;listenBtn.classList.add('on');listenBtn.setAttribute('aria-pressed','true');listenBtn.querySelector('span').textContent=t('stop');recDot.classList.add('live');setS(liveStatus,t('onair'),'ok');}catch(_){}
  }
  function stopRec(){recognizing=false;if(recognition)recognition.stop();if(pauseTimer)clearTimeout(pauseTimer);listenBtn.classList.remove('on');listenBtn.setAttribute('aria-pressed','false');listenBtn.querySelector('span').textContent=t('listen');recDot.classList.remove('live');setS(liveStatus,t('stopped'));}
  /* XSS: la trascrizione contiene input utente (domanda manuale) e testo del
     ponte desktop → SOLO nodi di testo, mai innerHTML. */
  function render(itr){
    transcriptEl.textContent='';
    transcriptEl.appendChild(document.createTextNode(finalText));
    // la parte interim cambia di continuo: nascosta allo screen reader per non spammare
    const sp=document.createElement('span');sp.className='interim';sp.setAttribute('aria-hidden','true');sp.textContent=itr||'';
    transcriptEl.appendChild(sp);
    transcriptEl.scrollTop=transcriptEl.scrollHeight;
  }
  function sched(){if(pauseTimer)clearTimeout(pauseTimer);pauseTimer=setTimeout(()=>{if(!busy&&finalText.length-lastLen>14){lastLen=finalText.length;suggest();}},1000);}
  listenBtn.addEventListener('click',()=>recognizing?stopRec():startRec());
  autoBtn.addEventListener('click',()=>{autoMode=!autoMode;autoBtn.classList.toggle('on',autoMode);autoBtn.setAttribute('aria-pressed',String(autoMode));setS(liveStatus,autoMode?t('autoOn'):t('autoOff'),autoMode?'ok':'');save();});
  $('clearBtn').addEventListener('click',()=>{finalText='';lastLen=0;render('');answerEl.innerHTML='';lastAnswer='';hideFeedback();});

  function systemPrompt(){
    const m=MODES[modeEl.value]||MODES.interview; const ans=$('ansLang').value;
    if(m.p==='__translate__'){ const target=ans==='same'?'Italian':ans; return "You are a live interpreter. Translate the following speech into "+target+". Output ONLY the translation, nothing else. If partial, translate what you have."; }
    let base=m.p==='__custom__'?(profileText()?'Follow the user context as instructions.':'You are a helpful real-time call copilot.'):m.p;
    const ansInstr=ans==='same'?'Answer in the SAME language the speaker used.':('Write the suggested answer in '+ans+'.');
    // Trascrizione desktop: entrambi i lati etichettati. Il suggerimento deve
    // rispondere all'ULTIMA battuta dell'interlocutore, mai alle battute "Io:".
    const labeled=/(^|\n)Interlocutore:/.test(finalText);
    const labeledInstr=labeled?" The transcript has BOTH sides labeled: lines starting with 'Io:' are what the USER already said; lines starting with 'Interlocutore:' are the other party. Respond ONLY to the LAST 'Interlocutore:' line — never answer or rephrase the user's own 'Io:' lines.":"";
    return base+"\n\nPerson/context (first person): "+(profileText()||'(none)')+"\n\nYou get a live transcript of the other party. Focus on the LAST question/point."+labeledInstr+" "+ansInstr+" Natural, spoken, concise. Begin with a one-line note of the detected question, then the answer.";
  }

  async function errMsg(res){let m='HTTP '+res.status;try{const d=await res.json();m=(d.error&&(d.error.message||d.error))||JSON.stringify(d);}catch(_){}return m;}
  async function readSSE(res,onLine){try{const rd=res.body.getReader(),dec=new TextDecoder();let buf='';while(true){const {done,value}=await rd.read();if(done)break;buf+=dec.decode(value,{stream:true});let i;while((i=buf.indexOf(String.fromCharCode(10)))>=0){let ln=buf.slice(0,i).trim();buf=buf.slice(i+1);if(!ln.startsWith('data:'))continue;ln=ln.slice(5).trim();if(!ln||ln==='[DONE]')continue;onLine(ln);}}}finally{if(res.__tTot)clearTimeout(res.__tTot);}}
  /* Modalità Pro: la richiesta va al NOSTRO backend (chiave universale lato
     server, cookie di sessione). Formato SSE: {type:"delta"|"done"|"error"}. */
  function backendMode(){ const m=modeEl.value; return (m==='interview'||m==='sales'||m==='meeting')?m:'general'; }
  function showRouting(j){
    lastRoutedModel=j.model||null;
    // XSS: label/model/reason arrivano dal server → SOLO nodi di testo
    const rt=$('routingText'); rt.textContent=''; rt.appendChild(document.createTextNode(t('routedBy')+' '));
    const b=document.createElement('b'); b.textContent=String(j.label||j.model||''); rt.appendChild(b);
    rt.appendChild(document.createTextNode(' — '+String(j.reason||'')));
    $('routingInfo').classList.add('show');
  }
  function clearRouting(){ $('routingInfo').classList.remove('show'); $('routingText').textContent=''; }

  /* ---- Flywheel feedback (M2-d, solo raccolta) ----
     Al server vanno azione + categoria + modello + LUNGHEZZA del suggerimento:
     mai la trascrizione né il testo. La versione riscritta dall'utente parte
     solo da "✍️ Modificato"; è il server a salvarla soltanto se il profilo ha
     consenso attivo. Visibile solo da loggati (il backend richiede la sessione). */
  let lastRoutedModel=null;
  function showFeedback(){ if(!meUser||!lastAnswer)return; $('fbRow').classList.add('show'); $('fbEditWrap').style.display='none'; }
  function hideFeedback(){ $('fbRow').classList.remove('show'); $('fbEditWrap').style.display='none'; }
  async function sendFeedback(action,editedText){
    hideFeedback();
    try{
      await api('/v1/feedback',{method:'POST',body:JSON.stringify({
        action,
        mode:backendMode(),
        model:proMode?lastRoutedModel:($('model').value.trim()||null),
        suggestionChars:lastAnswer.length,
        editedText:editedText||undefined
      })});
      setS(liveStatus,t('fbThanks'),'ok');
    }catch(_){}
  }
  $('fbUsed').addEventListener('click',()=>sendFeedback('used'));
  $('fbIgnored').addEventListener('click',()=>sendFeedback('ignored'));
  $('fbEdited').addEventListener('click',()=>{ $('fbEditWrap').style.display=''; $('fbEditText').value=lastAnswer; });
  $('fbEditSend').addEventListener('click',()=>sendFeedback('edited',$('fbEditText').value.trim().slice(0,4000)));

  /* Sovranità: la sensibilità NON parte più dal client — il server la deriva
     dal tipo di dato (trascrizione → high, sempre). Il client dichiara "high"
     per coerenza, ma anche mandasse "low" il backend non declasserebbe.
     Modello extra-UE scelto a mano → il server risponde 409 finché non c'è
     consenso: si mostra il dialog informativo e si ritenta con nonEuConsent. */
  /* Stream Pro via nucleo: AbortController (Annulla / nuova richiesta / pagehide),
     timeout primo-token 20s e totale 120s, heartbeat ignorato, 429 con Retry-After,
     stream interrotto → si tiene il parziale e lo si dice. */
  let curReq=null;
  async function callProStream(onDelta,consented){
    const q=finalText.trim().slice(-2000);
    let apiErr=null;
    try{
      const r=await window.LCC.stream(BACKEND_URL+'/v1/complete',{signal:curReq&&curReq.signal,firstTokenMs:20000,totalMs:120000,
        body:JSON.stringify({model:($('proModel').value||'auto'),sensitivity:'high',nonEuConsent:!!consented,mode:backendMode(),tier:'cloud',system:systemPrompt(),messages:[{role:'user',content:'Transcript:\n'+q}],maxTokens:800}),
        onEvent:j=>{if(j.type==='routing')showRouting(j);else if(j.type==='delta'&&j.text)onDelta(j.text);else if(j.type==='error')apiErr=j.message||'errore dal backend';}});
      if(apiErr)throw new Error(apiErr);
      if(r.partial) setS(liveStatus,t('partialKept')+' ('+r.reason+')','err');
    }catch(e){
      if(e&&e.status===409&&e.body&&e.body.error==='non_eu_consent_required'&&!consented){
        if(await askNonEuConsent(e.body)) return callProStream(onDelta,true);
        throw new Error(t('nonEuNo'));
      }
      if(e&&e.status===429) throw new Error(t('rateLimited').replace('{s}',String(e.retryAfter||30)));
      throw new Error(errText(e));
    }
  }
  /* BYOK: stesso rigore (abort + timeout) anche verso i provider diretti. */
  async function byokFetch(url,init){
    const ctrl=new AbortController(); let why=null;
    if(curReq) curReq.signal.addEventListener('abort',()=>{why='aborted';ctrl.abort();});
    const tFirst=setTimeout(()=>{why='timeout';ctrl.abort();},20000);
    const tTot=setTimeout(()=>{why='timeout';ctrl.abort();},120000);
    try{ const res=await fetch(url,Object.assign({},init,{signal:ctrl.signal})); clearTimeout(tFirst); res.__tTot=tTot; return res; }
    catch(e){ clearTimeout(tFirst); clearTimeout(tTot); throw new Error(why||('network')); }
  }

  async function callStream(onDelta){
    if(proMode) return callProStream(onDelta);
    const p=curProv(),key=$('apiKey').value.trim(),model=$('model').value.trim(),q=finalText.trim().slice(-2000),sys=systemPrompt();
    try{
      if(p.kind==='gemini'){
        const res=await byokFetch('https://generativelanguage.googleapis.com/v1beta/models/'+model+':streamGenerateContent?alt=sse',{method:'POST',headers:{'Content-Type':'application/json','x-goog-api-key':key},body:JSON.stringify({systemInstruction:{parts:[{text:sys}]},contents:[{role:'user',parts:[{text:'Transcript:\n'+q}]}],generationConfig:{temperature:0.6,maxOutputTokens:800}})});
        if(!res.ok)throw new Error(await errMsg(res));
        await readSSE(res,ln=>{try{const j=JSON.parse(ln);const parts=(((j.candidates||[])[0]||{}).content||{}).parts||[];const tx=parts.map(x=>x.text||'').join('');if(tx)onDelta(tx);}catch(_){}});return;
      }
      if(p.kind==='anthropic'){
        const base=$('baseUrl').value.trim()||p.base;
        const res=await byokFetch(base+'/messages',{method:'POST',headers:{'Content-Type':'application/json','x-api-key':key,'anthropic-version':'2023-06-01','anthropic-dangerous-direct-browser-access':'true'},body:JSON.stringify({model,max_tokens:800,system:sys,messages:[{role:'user',content:'Transcript:\n'+q}],stream:true})});
        if(!res.ok)throw new Error(await errMsg(res));
        await readSSE(res,ln=>{try{const j=JSON.parse(ln);if(j.type==='content_block_delta'&&j.delta&&j.delta.text)onDelta(j.delta.text);}catch(_){}});return;
      }
      const base=$('baseUrl').value.trim()||p.base;
      const hd={'Content-Type':'application/json'}; if(key) hd['Authorization']='Bearer '+key;
      const res=await byokFetch(base+'/chat/completions',{method:'POST',headers:hd,body:JSON.stringify({model,stream:true,temperature:0.6,max_tokens:800,messages:[{role:'system',content:sys},{role:'user',content:'Transcript:\n'+q}]})});
      if(!res.ok)throw new Error(await errMsg(res));
      await readSSE(res,ln=>{try{const j=JSON.parse(ln);const d=((j.choices||[])[0]||{}).delta||{};if(d.content)onDelta(d.content);}catch(_){}});
    }catch(e){ if(e.message==='aborted')throw new Error(t('cancelled')); if(e.message==='timeout')throw new Error(t('errTimeout')); if(/network|Failed to fetch|NetworkError/i.test(e.message))throw new Error(t('errNet')+' — questo provider può bloccare le chiamate dal browser (CORS). Prova Gemini, Claude, OpenAI o Groq.'); throw e; }
  }
  /* risposta del modello: testo non fidato → nodi (grassetto **x** come <b> vero, mai innerHTML) */
  function renderAnswer(txt){
    answerEl.textContent='';
    const parts=String(txt).split(/\*\*/);
    parts.forEach((p,i)=>{ if(!p)return; if(i%2===1){const b=document.createElement('b');b.textContent=p;answerEl.appendChild(b);} else answerEl.appendChild(document.createTextNode(p)); });
  }
  async function suggest(qOverride){
    if(!canRun()){setS(liveStatus,cantRunMsg(),'err');showSettings();return;}
    if(qOverride){finalText=(finalText+' '+qOverride).trim();}
    if(!finalText.trim()){setS(liveStatus,t('noq'),'err');return;}
    curReq=window.LCC.abortScope('suggest'); // una sola richiesta viva: la nuova annulla la precedente
    busy=true;suggestBtn.disabled=true;$('cancelBtn').style.display='';setS(liveStatus,t('thinking'),'work');let acc='';answerEl.textContent='';clearRouting();hideFeedback();
    answerEl.setAttribute('data-ph',t('thinking')); // "sto pensando…" nel riquadro risposta
    try{await callStream(tx=>{acc+=tx;lastAnswer=acc;renderAnswer(acc);answerEl.scrollTop=answerEl.scrollHeight;});setS(liveStatus,t('ready'),'ok');showFeedback();const al=$('answerLive');al.textContent='';al.textContent=acc;}
    catch(e){setS(liveStatus,'Error: '+e.message,'err');}
    answerEl.setAttribute('data-ph','—');
    busy=false;suggestBtn.disabled=false;$('cancelBtn').style.display='none';
  }
  suggestBtn.addEventListener('click',()=>suggest());
  $('cancelBtn').addEventListener('click',()=>{ if(curReq){curReq.abort();} });
  $('manualQ').addEventListener('keydown',e=>{if(e.key==='Enter'&&e.target.value.trim()){suggest(e.target.value.trim());e.target.value='';}});
  $('copyBtn').addEventListener('click',()=>{if(!lastAnswer)return;try{navigator.clipboard.writeText(lastAnswer);$('copyBtn').textContent=t('copied');setTimeout(()=>$('copyBtn').textContent=t('copy'),1500);}catch(_){}});

  $('floatBtn').addEventListener('click',async()=>{
    const box=$('answerBox');
    if(!('documentPictureInPicture' in window)){const w=document.querySelector('.wrap');w.style.maxWidth=(w.style.maxWidth==='440px')?'960px':'440px';return;}
    try{const pip=await documentPictureInPicture.requestWindow({width:440,height:560});
      document.querySelectorAll('style').forEach(s=>pip.document.head.appendChild(s.cloneNode(true)));
      pip.document.body.style.cssText='margin:0;background:#fbf7f2;color:#2c2521;font-family:inherit;padding:12px;';
      pip.document.body.appendChild(box);
      pip.addEventListener('pagehide',()=>$('liveHome').appendChild(box));
    }catch(e){setS(liveStatus,'Float: '+e.message,'err');}
  });

  $('langswitch').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;LANG=b.getAttribute('data-lang');[...$('langswitch').children].forEach(c=>{const on=c===b;c.classList.toggle('on',on);c.setAttribute('aria-pressed',String(on));});applyLang();save();});
  ['model','baseUrl','lang','ansLang','mode'].forEach(id=>$(id).addEventListener('change',save));
  $('apiKey').addEventListener('input',()=>{suggestBtn.disabled=!$('apiKey').value.trim();save();});
  $('remember').addEventListener('change',save);
  $('forget').addEventListener('click',e=>{e.preventDefault();const n=window.LCC.purgeAll();$('apiKey').value='';PF_IDS.forEach(id=>$(id).value='');$('remember').checked=false;setS(setupStatus,t('valid')+' ('+n+')','ok');});

  (function init(){
    // opt-in: spuntato SOLO se l'utente l'ha scelto in passato (persistito)
    try{$('remember').checked=localStorage.getItem('v5_remember')==='1';}catch(_){$('remember').checked=false;}
    LANG=store.get('v5_lang')|| (function(){var n=(navigator.language||navigator.userLanguage||'en').toLowerCase(); if(n.indexOf('it')===0)return'it'; if(n.indexOf('zh')===0)return'zh'; if(n.indexOf('es')===0)return'es'; return 'en';})();
    [...$('langswitch').children].forEach(c=>{const on=c.getAttribute('data-lang')===LANG;c.classList.toggle('on',on);c.setAttribute('aria-pressed',String(on));});
    if(store.get('v5_prov')&&PROVIDERS[store.get('v5_prov')])providerEl.value=store.get('v5_prov');
    proMode=store.get('v6_pro')==='1';
    const pv=providerEl.value; const which=proMode?'choicePro':(pv==='gemini'?'choiceFree':(pv==='ollama'?'choiceLocal':'choiceOwn')); selChoice(which); $('ownWrap').style.display=(which==='choiceOwn')?'':'none';
    if(proMode)refreshMe();
    buildModeOptions();if(store.get('v5_mode'))modeEl.value=store.get('v5_mode');
    if(store.get('v5_heard'))$('lang').value=store.get('v5_heard');
    if(store.get('v5_ans'))$('ansLang').value=store.get('v5_ans');
    PF_IDS.forEach(id=>{const v=store.get(PF_KEYS[id]);if(v)$(id).value=v;});
    // Migrazione dal vecchio campo libero "contesto/CV": finisce in CV/esperienza.
    if(!$('pfCv').value&&store.get('v5_ctx'))$('pfCv').value=store.get('v5_ctx');
    autoMode=store.get('v5_auto')!=='0';autoBtn.classList.toggle('on',autoMode);
    syncProvider();applyLang();
    probeStt(); // etichetta onesta sul riconoscimento vocale, subito visibile
    // arrivo con return_to: apri direttamente il pannello account (scelta Pro)
    if(RETURN_TO){$('choicePro').click();showSettings();}
  })();

  /* ---- Vista Impostazioni: schermata alternativa alla Live, non un overlay ---- */
  function showSettings(){ $('viewLive').style.display='none'; $('viewSettings').style.display='flex'; window.scrollTo(0,0); }
  function showLive(){ $('viewSettings').style.display='none'; $('viewLive').style.display='flex'; window.scrollTo(0,0); }
  $('settingsBtn').addEventListener('click',showSettings);
  $('backBtn').addEventListener('click',showLive);
  document.addEventListener('keydown',e=>{ if(e.key==='Escape' && $('viewSettings').style.display!=='none') showLive(); });
  // Primo avvio senza configurazione: si parte DIRETTAMENTE dalla schermata
  // Impostazioni (una vista, non un pop-up sopra la Live). "Configurato" =
  // c'è una chiave/modalità locale, oppure era stata scelta la modalità Pro
  // (il login si verifica in async: non riaprire le impostazioni nell'attesa).
  if(!canRun() && store.get('v6_pro')!=='1') showSettings();
  /* Privacy: la trascrizione non viene mai salvata; la azzero anche alla chiusura. */
  window.addEventListener('pagehide',()=>{ finalText=''; });

  /* ═══ CONTRATTO PONTE DESKTOP — NON MODIFICARE SENZA AGGIORNARE L'OVERLAY ═══
     L'app desktop (repo live-call-copilot-desktop, src-tauri/overlay.js) dipende
     da questa interfaccia esatta. La cattura nativa (WASAPI) e la trascrizione
     on-device vivono nell'overlay Tauri; da qui entrano nella pipeline
     suggerimenti ESISTENTE del client. Nel browser normale l'oggetto esiste ma
     nessuno lo chiama: zero effetti.

       window.lccCopilot.addTranscript(source, text)
         source: "mic" (la voce dell'utente) | "system" (l'interlocutore)
         → aggiunge a finalText una riga etichettata "Io: …" / "Interlocutore: …"

       window.lccCopilot.suggest() → Promise
         → genera un suggerimento con la pipeline esistente (BYOK/locale/Pro)

       window.lccCopilot.isBusy() → boolean
         → true mentre una generazione è in corso (l'overlay non ne accoda altre)

     INVARIANTI da preservare quando si tocca suggest()/finalText/busy:
      - le etichette "Io:"/"Interlocutore:" sono parsate da systemPrompt()
        (regex /(^|\n)Interlocutore:/) per ancorare la risposta all'ULTIMA
        battuta dell'interlocutore — non rinominarle;
      - suggest() deve continuare a restituire una Promise e ad aggiornare busy;
      - se rinomini suggest()/finalText/busy, aggiorna QUESTO oggetto e
        l'overlay desktop nello stesso momento. */
  window.lccCopilot={
    addTranscript(source,text){
      const who=source==='mic'?'Io':'Interlocutore';
      finalText+=who+': '+String(text).trim()+'\n';
      render('');
    },
    suggest(){ return suggest(); },
    isBusy(){ return busy; }
  };
  if(window.__TAURI__){
    // Su desktop la cattura nativa sostituisce l'ascolto del browser:
    // il microfono non va duplicato.
    listenBtn.disabled=true;
    listenBtn.title=t('desktopMic');
  }

  /* ---- PWA: installable app (like Zoom) ---- */
  let deferredPrompt=null;
  const installBtn=$('installBtn');
  function isStandalone(){ return window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone===true; }
  window.addEventListener('beforeinstallprompt',(e)=>{ e.preventDefault(); deferredPrompt=e; if(!isStandalone()) installBtn.style.display=''; });
  installBtn.addEventListener('click',async()=>{
    if(!deferredPrompt) return;
    deferredPrompt.prompt();
    try{ await deferredPrompt.userChoice; }catch(_){}
    deferredPrompt=null; installBtn.style.display='none';
  });
  window.addEventListener('appinstalled',()=>{ deferredPrompt=null; installBtn.style.display='none'; setS(liveStatus,t('installed'),'ok'); });
  if(isStandalone()) installBtn.style.display='none';

  /* service worker: enables offline shell + install. Only over http(s), not file://. */
  if('serviceWorker' in navigator && location.protocol.startsWith('http')){
    window.addEventListener('load',()=>{ navigator.serviceWorker.register('sw.js').catch(()=>{}); });
  }
})();
