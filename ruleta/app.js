const NS="ruleta",LIVE_KEY="ruleta-sala";
const mkid=k=>k+Date.now().toString(36)+Math.random().toString(36).slice(2,6);
let r=cleanR(ToolStore.load(NS,null)||{});
const ui={ask:"",lastSpin:r.spin?r.spin.id:"",pending:null,shown:null};
var live={room:null,remoteData:null,user:null,editor:false,online:true,open:false,busy:false,err:"",copied:"",pushT:0};
const canEdit=()=>!live.room||!!live.editor;
const W=Wheel($("wheel"),()=>r.items.length?"Ya salieron todas":"Agrega opciones");

function mix(hex,base,k){const a=[1,3,5].map(i=>parseInt(hex.slice(i,i+2),16)),b=[1,3,5].map(i=>parseInt(base.slice(i,i+2),16));return"#"+a.map((v,i)=>Math.round(v*k+b[i]*(1-k)).toString(16).padStart(2,"0")).join("")}
function applyTheme(){const c=THEMES[r.theme][1],s=document.documentElement.style;s.setProperty("--accent",c);s.setProperty("--accent-soft",mix(c,"#171717",.2));document.body.classList.toggle("viewer",!canEdit())}

function save(){
  ToolStore.save(NS,r);
  $("sync").textContent=live.room?(canEdit()?"Conectado a la sala":"Mirando la sala"):"Guardado en este navegador";
  if(live.room&&canEdit()){clearTimeout(live.pushT);live.pushT=setTimeout(pushLive,200)}
}
function commit(){save();renderAll()}

function radio(el,items,cur,attr,on){
  el.innerHTML=items.map(([k,html])=>`<button class="chip" type="button" role="radio" aria-checked="${k===cur}" data-${attr}="${k}">${html}</button>`).join("");
  el.querySelectorAll(`[data-${attr}]`).forEach(b=>b.onclick=()=>on(b.dataset[attr]));
}
const on=(id,f)=>{const e=$(id);if(e)e.onclick=f};

function renderTurns(){
  const cur=curPlayer(r);
  $("turns").innerHTML=r.players.length?`<span class="tl">Turno de</span>`+r.players.map((p,i)=>`<button class="turn" type="button" aria-pressed="${p===cur}" data-t="${i}">${avatar(p,26)}<b>${esc(p.name)}</b></button>`).join(""):"";
  $("turns").querySelectorAll("[data-t]").forEach(b=>b.onclick=()=>{if(W.busy||!canEdit())return;r.turn=+b.dataset.t;ui.shown=null;commit()});
}

function renderWheel(){
  const cur=curPlayer(r),list=avail(r,cur?cur.id:"");
  W.set(sliceList(r,list));
  const ed=canEdit();
  $("spin").disabled=W.busy||!ed||!list.length;
  $("spin").textContent=W.busy?"Girando…":"Girar";
  $("spin").hidden=!ed;
  $("again").hidden=!(ed&&r.items.length&&!list.length&&r.elim!=="no");
  $("spinMsg").textContent=!r.items.length?"Agrega al menos una opción para girar.":!list.length?(r.elim==="jugador"&&cur?`${cur.name} ya sacó todas. Pasa el turno o vuelve a llenar la ruleta.`:"Ya salieron todas."):!ed?"Mirando la sala: gira quien la maneja.":`${list.length} ${list.length===1?"opción":"opciones"} en la ruleta`;
}

function renderResult(){
  const h=ui.shown;
  if(!h){$("result").innerHTML="";return}
  const p=r.players.find(x=>x.id===h.p);
  $("result").innerHTML=`<div class="res ${h.fresh?"pop":""}">${p?`<span class="who">${avatar(p,28)}${esc(p.name)}</span>`:""}<b>${esc(h.t)}</b></div>`;
  h.fresh=false;
}

function renderItems(){
  const out=r.elim==="no"?new Set():new Set(r.hist.slice(r.cut).map(h=>h.i)),cur=curPlayer(r),mine=new Set(avail(r,cur?cur.id:"").map(i=>i.id));
  $("iCount").textContent=r.items.length+" / "+MAX_ITEMS;
  $("ilist").innerHTML=r.items.map(i=>{const gone=!mine.has(i.id);return`<li class="${gone?"gone":""}"><span class="dot" style="background:${COLS[colorOf(r,i.id)]}"></span><b>${esc(i.t)}</b>${gone&&r.elim!=="no"?`<small>${r.elim==="jugador"&&cur?"Ya la sacó "+esc(cur.name):"Ya salió"}</small>`:out.has(i.id)&&r.elim==="jugador"?`<small>Salió para otros</small>`:""}<button class="btn xs" type="button" data-ri="${i.id}" aria-label="Quitar ${esc(i.t)}">Quitar</button></li>`}).join("")||`<li class="msg">Todavía no hay opciones.</li>`;
  $("ilist").querySelectorAll("[data-ri]").forEach(b=>b.onclick=()=>{if(W.busy)return;r.items=r.items.filter(i=>i.id!==b.dataset.ri);commit()});
}

function renderPlayers(){
  $("pCount").textContent=r.players.length+" / "+MAX_PLAYERS;
  $("pHint").textContent=r.players.length?"Toca un jugador arriba de la ruleta para darle el turno.":"Sin jugadores gira una sola persona. Agrega jugadores para turnarse.";
  $("plist").innerHTML=r.players.map((p,i)=>`<li>${avatar(p,32)}<b>${esc(p.name)}</b><span class="count">${r.hist.filter(h=>h.p===p.id).length} giros</span>${ui.ask===p.id?`<button class="btn xs warn" type="button" data-rm="${p.id}">Quitar</button><button class="btn xs" type="button" data-no>Cancelar</button>`:`<label class="check mcck"><input type="checkbox" data-mc="${p.id}" ${p.mc?"checked":""}> Minecraft</label><button class="btn xs" type="button" data-ask="${p.id}">Quitar</button>`}</li>`).join("");
  $("plist").querySelectorAll("[data-ask]").forEach(b=>b.onclick=()=>{ui.ask=b.dataset.ask;renderPlayers()});
  $("plist").querySelectorAll("[data-no]").forEach(b=>b.onclick=()=>{ui.ask="";renderPlayers()});
  $("plist").querySelectorAll("[data-rm]").forEach(b=>b.onclick=()=>{if(W.busy)return;r.players=r.players.filter(p=>p.id!==b.dataset.rm);r.turn=Math.min(r.turn,Math.max(0,r.players.length-1));ui.ask="";commit()});
  $("plist").querySelectorAll("[data-mc]").forEach(c=>c.onchange=()=>{const p=r.players.find(x=>x.id===c.dataset.mc);if(p){p.mc=c.checked;commit()}});
}

function renderCfg(){
  if(document.activeElement!==$("title"))$("title").value=r.title;
  $("hTitle").textContent=r.title||"Ruleta";
  radio($("elim"),Object.entries(ELIM),r.elim,"el",v=>{r.elim=v;commit()});
  $("elHint").textContent=r.elim==="no"?"Las opciones quedan en la ruleta y pueden repetirse.":r.elim==="todos"?"Lo que sale desaparece de la ruleta para todos hasta reiniciar.":"Cada jugador no puede repetir lo que ya sacó, pero a otro sí le puede tocar.";
  $("auto").checked=r.auto;
  radio($("theme"),Object.entries(THEMES).map(([k,[n,c]])=>[k,`<span class="sw" style="background:${c}"></span>${n}`]),r.theme,"th",v=>{r.theme=v;commit()});
}

function renderHist(){
  $("hCount").textContent=r.hist.length?r.hist.length+" giros":"";
  $("hActs").innerHTML=!r.hist.length||!canEdit()?"":ui.ask==="reset"?`<button class="btn xs warn" type="button" id="hYes">Borrar historial</button><button class="btn xs" type="button" id="hNo">Cancelar</button>`:`<button class="btn xs" type="button" id="hUndo">Deshacer último</button><button class="btn xs" type="button" id="hReset">Borrar</button>`;
  on("hUndo",()=>{if(W.busy)return;const h=r.hist.pop();r.cut=Math.min(r.cut,r.hist.length);if(h&&r.players.length&&r.auto){const i=r.players.findIndex(p=>p.id===h.p);if(i>=0)r.turn=i}ui.shown=null;commit()});
  on("hReset",()=>{ui.ask="reset";renderHist()});
  on("hYes",()=>{if(W.busy)return;r.hist=[];r.cut=0;ui.ask="";ui.shown=null;commit()});
  on("hNo",()=>{ui.ask="";renderHist()});
  const n=r.hist.length;
  $("hist").innerHTML=r.hist.slice().reverse().slice(0,60).map((h,k)=>{const p=r.players.find(x=>x.id===h.p);return`${r.cut&&n-k===r.cut&&r.elim!=="no"?`<li class="cut">Se volvió a llenar la ruleta</li>`:""}<li><span class="n">${n-k}</span>${p?avatar(p,24)+`<span class="pn">${esc(p.name)}</span>`:h.pn?`<span class="pn">${esc(h.pn)}</span>`:""}<b>${esc(h.t)}</b></li>`}).join("")||`<li class="msg">Todavía no se giró.</li>`;
}

function renderAll(){applyTheme();renderTurns();renderWheel();renderResult();renderItems();renderPlayers();renderCfg();renderHist();renderLive()}

function spin(){
  if(W.busy||!canEdit())return;
  const cur=curPlayer(r),list=avail(r,cur?cur.id:"");if(!list.length)return;
  const k=Math.floor(rnd()*list.length),seg=Math.PI*2/list.length;
  r.spin={id:mkid("").slice(0,20),sl:sliceList(r,list),k,i:list[k].id,p:cur?cur.id:"",pn:cur?cur.name:"",mid:k*seg+seg*(.15+rnd()*.7),dur:5200};
  ui.shown=null;save();pushLive();play(r.spin,true);
}
function play(sp,mine){
  ui.lastSpin=sp.id;ui.shown=null;renderResult();
  W.play(sp,()=>{
    if(mine&&canEdit()){
      r.hist.push({i:sp.i,p:sp.p,t:sp.sl[sp.k][0],pn:sp.pn});if(r.hist.length>MAX_HIST){r.hist.shift();r.cut=Math.max(0,r.cut-1)}
      if(r.auto&&r.players.length>1){const i=r.players.findIndex(p=>p.id===sp.p);r.turn=((i<0?r.turn:i)+1)%r.players.length}
      save();pushLive();
    }
    ui.shown={t:sp.sl[sp.k][0],p:sp.p,fresh:true};
    if(ui.pending){const v=ui.pending;ui.pending=null;applyRemote(v)}
    renderAll();
  });
  renderWheel();
}

$("spin").onclick=spin;
$("again").onclick=()=>{if(W.busy||!canEdit())return;r.cut=r.hist.length;ui.shown=null;commit()};
$("wheel").addEventListener("click",()=>{if(!$("spin").disabled&&!$("spin").hidden)spin()});
$("title").addEventListener("input",e=>{r.title=str(e.target.value,48);$("hTitle").textContent=r.title||"Ruleta";save()});
$("auto").addEventListener("change",e=>{r.auto=e.target.checked;commit()});

function msg(id,s,bad){$(id).textContent=s;$(id).classList.toggle("bad",!!bad)}
function addItem(t){t=str(t,40);if(!t)return"empty";if(r.items.length>=MAX_ITEMS)return"full";r.items.push({id:mkid("i"),t});return"ok"}
$("addI").onsubmit=e=>{
  e.preventDefault();if(W.busy)return;
  const x=addItem($("iName").value);
  if(x==="ok"){msg("iMsg","");$("iName").value="";commit();$("iName").focus()}
  else msg("iMsg",x==="full"?`Llegaste al máximo de ${MAX_ITEMS}.`:"Escribe una opción.",x!=="empty");
};
$("bulkAdd").onclick=()=>{
  if(W.busy)return;
  const lines=$("bulk").value.split("\n").map(s=>s.trim()).filter(Boolean);let ok=0;
  for(const l of lines){if(addItem(l)!=="ok")break;ok++}
  $("bulk").value="";msg("iMsg",`Se agregaron ${ok}.${ok<lines.length?` No entraron ${lines.length-ok}: máximo ${MAX_ITEMS}.`:""}`,ok<lines.length);commit();
};
$("addP").onsubmit=e=>{
  e.preventDefault();
  const name=str($("pName").value,24);
  if(!name)return msg("pMsg","Escribe un nombre.");
  if(r.players.length>=MAX_PLAYERS)return msg("pMsg",`Llegaste al máximo de ${MAX_PLAYERS}.`,true);
  if(r.players.some(p=>p.name.toLowerCase()===name.toLowerCase()))return msg("pMsg","Ya hay alguien con ese nombre.",true);
  r.players.push({id:mkid("p"),name,mc:$("pMc").checked});msg("pMsg","");$("pName").value="";commit();$("pName").focus();
};

$("exportBtn").onclick=()=>{ToolStore.save(NS,r);ToolStore.exportFile(NS)};
$("importBtn").onclick=()=>$("importFile").click();
$("importFile").onchange=async e=>{
  const f=e.target.files[0];e.target.value="";if(!f)return;
  if(!canEdit()){$("sync").textContent="Solo el dueño y los editores pueden cambiar la sala";return}
  try{const d=cleanR(await ToolStore.importFile(NS,f));if(!d.items.length)throw 0;d.spin=null;r=d;ui.shown=null;commit();$("sync").textContent="Ruleta importada"}
  catch(err){ToolStore.save(NS,r);$("sync").textContent="Ese archivo no es una ruleta."}
};

function pushLive(){
  clearTimeout(live.pushT);live.pushT=0;
  if(!live.room||!canEdit())return;
  const d=JSON.stringify(r);if(d===live.remoteData)return;live.remoteData=d;
  live.room.set("data",d).catch(()=>{live.remoteData=null;$("sync").textContent="La sala rechazó el cambio. Inicia sesión con una cuenta que pueda editar."});
}
function applyRemote(v){
  if(typeof v!=="string"||v.length>60000||v===live.remoteData)return;
  if(W.busy){ui.pending=v;return}
  if(live.pushT)pushLive();
  live.remoteData=v;let s;try{s=cleanR(JSON.parse(v))}catch(e){return}
  if(JSON.stringify(s)===JSON.stringify(r))return;
  const fresh=s.spin&&s.spin.id!==ui.lastSpin;
  r=s;ToolStore.save(NS,r);
  if(fresh)play(r.spin,false);
  renderAll();
}
async function joinRoom(name){
  live.busy=true;live.err="";renderLive();
  try{
    const room=await ToolSync.join(name,"ruleta");
    const d=await room.once("data");
    live.room=room;live.open=false;
    try{localStorage.setItem(LIVE_KEY,room.name)}catch(e){}
    if(typeof d==="string"&&d.length){try{const s=JSON.parse(d);ui.lastSpin=s&&s.spin&&s.spin.id||""}catch(e){}applyRemote(d)}else pushLive();
    room.on("data",applyRemote);
    room.connected(c=>{live.online=c;renderLive()});
    const u=new URL(location.href);u.searchParams.set("sala",room.name);history.replaceState(null,"",u);
  }catch(e){live.err=e&&e.message?e.message:"No se pudo conectar"}
  live.busy=false;save();renderAll();
}
function leaveRoom(){
  if(live.room)live.room.leave();
  live.room=null;live.remoteData=null;
  const u=new URL(location.href);u.searchParams.delete("sala");history.replaceState(null,"",u);
  $("sync").textContent="Fuera de la sala, sigue guardado en este navegador";
  renderAll();
}
async function copyLink(kind){
  if(!live.room){let n="";try{n=localStorage.getItem(LIVE_KEY)||""}catch(e){}await joinRoom(n||"ruleta-"+Math.random().toString(36).slice(2,8));if(!live.room)return}
  const u=new URL(kind==="inv"?"./":"overlay.html",location.href);u.search="";u.searchParams.set("sala",live.room.name);
  if(kind!=="inv")u.searchParams.set("vista",kind);
  try{await navigator.clipboard.writeText(u.href);live.copied=kind}catch(e){prompt("Copia este link:",u.href)}
  renderLive();setTimeout(()=>{live.copied="";renderLive()},1800);
}
function renderLive(){
  const el=$("live");
  if(!ToolSync.ready()){el.hidden=true;return}
  let last="";try{last=localStorage.getItem(LIVE_KEY)||""}catch(e){}
  const ed=!!live.editor;
  const acct=live.user?`<button class="btn sm" type="button" id="lvOut">Cerrar sesión</button>`:"";
  const err=live.err?`<p class="err" role="alert">${esc(live.err)}</p>`:"";
  const menu=`<details class="ovmenu"><summary class="btn sm">${live.copied&&live.copied!=="inv"?"Link copiado":live.busy?"Creando sala…":"Overlay"}</summary><div class="ovlist"><button class="btn sm" type="button" data-ov="ruleta">Ruleta</button><button class="btn sm" type="button" data-ov="resultado">Solo el resultado</button><button class="btn sm" type="button" data-ov="historial">Historial</button></div></details>`;
  if(live.room){
    el.innerHTML=`<span class="onair ${live.online?"":"off"}"><i></i>${live.online?"En vivo":"Reconectando"} · ${esc(live.room.name)}${ed?"":" · solo mirar"}</span>${ed?`<button class="btn sm" type="button" id="lvInv">${live.copied==="inv"?"Link copiado":"Copiar invitación"}</button>${menu}`:""}<button class="btn sm" type="button" id="lvLeave">Salir</button>${acct}${err}`;
    $("lvInv")&&($("lvInv").onclick=()=>copyLink("inv"));
    $("lvLeave").onclick=leaveRoom;
  }else if(live.open||live.busy){
    el.innerHTML=`<form id="lvForm"><input type="text" id="lvName" name="sala" maxlength="32" placeholder="Nombre de la sala…" aria-label="Nombre de la sala" value="${esc(last)}" autocomplete="off" spellcheck="false" ${live.busy?"disabled":""}><button class="btn sm primary" type="submit" ${live.busy?"disabled":""}>${live.busy?"Conectando…":ed?"Abrir sala":"Mirar sala"}</button><button class="btn sm" type="button" id="lvNo">Cancelar</button></form>${acct}${err}`;
    $("lvForm").onsubmit=e=>{e.preventDefault();const n=ToolSync.clean($("lvName").value);if(!n){live.err="Usa letras, números o guiones.";renderLive();return}joinRoom(n)};
    $("lvNo").onclick=()=>{live.open=false;live.err="";renderLive()};
  }else{
    el.innerHTML=`${menu}<button class="btn sm" type="button" id="lvOpen">Sala en vivo</button>${acct}${err}`;
    $("lvOpen").onclick=()=>{live.open=true;live.err="";renderLive()};
  }
  $("lvOut")&&($("lvOut").onclick=()=>ToolSync.signOut());
  el.querySelectorAll("[data-ov]").forEach(b=>b.onclick=()=>copyLink(b.dataset.ov));
  el.querySelectorAll(".ovmenu").forEach(m=>m.addEventListener("keydown",e=>{if(e.key==="Escape"){m.open=false;m.querySelector("summary").focus()}}));
}
document.addEventListener("click",e=>{document.querySelectorAll(".ovmenu[open]").forEach(om=>{if(!om.contains(e.target))om.open=false})});
addEventListener("resize",()=>{if(!W.busy)W.paint()});
document.fonts&&document.fonts.ready.then(()=>{if(!W.busy)W.paint()});

renderAll();
if(ToolSync.ready()){
  let ur=0;
  ToolSync.onUser(async u=>{
    const n=++ur,ed=await ToolSync.canEditRooms(u,"ruleta");if(n!==ur)return;
    const was=canEdit();live.user=u;live.editor=ed;
    if(live.room&&!was&&canEdit())pushLive();
    renderAll();
  }).catch(()=>{});
  const s=new URLSearchParams(location.search).get("sala");
  if(s)joinRoom(s);
}
