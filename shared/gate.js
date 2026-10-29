(function(){
  const root=document.documentElement,mode=root.dataset.gate;
  if(!mode)return;
  root.classList.add("gated");
  const css=document.createElement("style");
  css.textContent=`html.gated body>*:not(.gate){display:none!important}
.gate{position:fixed;inset:0;z-index:100;display:grid;place-items:center;padding:24px max(16px,env(safe-area-inset-left,0px));background:var(--ground,#0a0a0a);color:var(--fg,#f5f5f5);font-family:var(--body,system-ui,sans-serif);overflow:auto}
.gate[hidden]{display:none!important}
.gate-box{width:100%;max-width:420px;padding:28px 26px;background:var(--panel,#171717);border:2px solid var(--path-edge,#593d7f);outline:2px solid var(--line,#404040);outline-offset:-8px;display:flex;flex-direction:column;gap:14px}
.gate-box h1{font:700 clamp(26px,6vw,32px)/1.05 var(--display,system-ui,sans-serif);margin:0;text-wrap:balance}
.gate-box p{margin:0;color:var(--muted,#a3a3a3);font-size:15px;line-height:1.5;text-wrap:pretty;overflow-wrap:anywhere}
.gate-box p b{color:var(--fg,#f5f5f5)}
.gate-acts{display:flex;flex-wrap:wrap;gap:8px;margin-top:4px}
.gate-btn{font:700 15px var(--body,system-ui,sans-serif);color:var(--fg,#f5f5f5);padding:10px 16px;min-height:44px;border-radius:0;border:2px solid var(--line,#404040);background:var(--panel,#171717);cursor:pointer;text-decoration:none;display:inline-flex;align-items:center;touch-action:manipulation}
.gate-btn:hover{border-color:var(--accent,#b37bff);background:var(--accent-soft,#2a1f3a)}
.gate-btn.main{background:var(--accent,#b37bff);border-color:var(--accent,#b37bff);color:var(--on-accent,#0a0a0a)}
.gate-btn.main:hover{filter:brightness(1.08)}
.gate-btn:disabled{opacity:.5;cursor:wait}
.gate-btn:focus-visible{outline:3px solid var(--accent,#b37bff);outline-offset:2px}
.gate-err{color:#fca5a5!important;font-size:14px!important}`;
  document.head.appendChild(css);
  const owner=mode==="dueno";
  let el,user,run=0,started=false,busy=false;
  const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
  const home=new URL("../",location.href).href;
  const isOpen=()=>{const k=root.dataset.gateOpen;return!!(k&&new URLSearchParams(location.search).get(k))};
  function open(){root.classList.remove("gated");if(el)el.hidden=true}
  function shut(html){
    root.classList.add("gated");
    if(!el){el=document.createElement("div");el.className="gate";document.body.prepend(el)}
    el.hidden=false;
    el.innerHTML=`<section class="gate-box" role="dialog" aria-modal="true" aria-labelledby="gateT">${html}</section>`;
    const b=el.querySelector("[data-g]");
    el.querySelectorAll("[data-g]").forEach(x=>x.onclick=()=>act(x.dataset.g));
    if(b&&matchMedia("(pointer:fine)").matches)b.focus();
  }
  const back=`<a class="gate-btn" href="${home}">Volver al inicio</a>`;
  function view(s,err){
    const e=err?`<p class="gate-err" role="alert">${esc(err)}</p>`:"";
    if(s==="wait")shut(`<h1 id="gateT">Herramientas PlayArt</h1><p role="status">Comprobando acceso…</p>`);
    else if(s==="in")shut(`<h1 id="gateT">Inicia sesión</h1><p>${owner?"Esta página es solo para el dueño.":"Estas herramientas son solo para personas invitadas."} Entra con tu cuenta de Google; la sesión queda abierta hasta que salgas.</p>${e}<div class="gate-acts"><button class="gate-btn main" type="button" data-g="in" ${busy?"disabled":""}>${busy?"Abriendo…":"Iniciar sesión con Google"}</button>${back}</div>`);
    else if(s==="no")shut(`<h1 id="gateT">No tienes acceso</h1><p>${owner?"Solo el dueño puede entrar a esta página.":`La cuenta <b>${esc(user.email||user.name)}</b> no está en la lista. Pídele acceso al dueño.`}</p>${e}<div class="gate-acts"><button class="gate-btn main" type="button" data-g="otra" ${busy?"disabled":""}>Usar otra cuenta</button>${back}</div>`);
    else if(s==="off")shut(`<h1 id="gateT">Acceso sin configurar</h1><p>Falta la configuración de Firebase en este sitio.</p><div class="gate-acts">${back}</div>`);
    else shut(`<h1 id="gateT">No se pudo comprobar</h1><p>Revisa tu conexión y vuelve a intentar.</p>${e}<div class="gate-acts"><button class="gate-btn main" type="button" data-g="re">Reintentar</button>${back}</div>`);
  }
  async function login(){
    busy=true;view(user?"no":"in");
    try{await ToolSync.signIn();busy=false}
    catch(e){busy=false;const c=e&&e.code||"";view(user?"no":"in",c==="auth/popup-blocked"?"El navegador bloqueó la ventana. Permite ventanas emergentes y vuelve a intentar.":c==="auth/popup-closed-by-user"||c==="auth/cancelled-popup-request"?"":"No se pudo iniciar sesión. Vuelve a intentar.")}
  }
  async function act(g){
    if(g==="in")login();
    else if(g==="otra"){try{await ToolSync.signOut()}catch(e){}user=null;login()}
    else check();
  }
  async function check(){
    if(!owner&&isOpen()){open();return}
    if(!window.ToolSync||!ToolSync.ready()){view("off");return}
    if(!started){started=true;view("wait");ToolSync.onUser(u=>{user=u;check()}).catch(()=>view("err"));return}
    if(user===undefined){view("wait");return}
    if(!user){view("in");return}
    const n=++run;
    try{
      const ok=owner?ToolSync.isOwner(user):await ToolSync.hasAccess(user);
      if(n!==run)return;
      ok?open():view("no");
    }catch(e){if(n===run)view("err")}
  }
  window.Gate={check};
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",check);else check();
})();
