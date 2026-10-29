const NS="torneo",LIVE_KEY="torneo-sala";
const uid=()=>"p"+Date.now().toString(36)+Math.random().toString(36).slice(2,6);
let t=cleanT(ToolStore.load(NS,null)||{});
const ui={ask:"",prev:new Set(),drawing:false};
var live={room:null,remoteData:null,user:null,editor:false,online:true,open:false,busy:false,err:"",copied:"",pushT:0};
let B=null,S=null;
const canEdit=()=>!live.room||!!live.editor;

function mix(hex,base,k){const a=[1,3,5].map(i=>parseInt(hex.slice(i,i+2),16)),b=[1,3,5].map(i=>parseInt(base.slice(i,i+2),16));return"#"+a.map((v,i)=>Math.round(v*k+b[i]*(1-k)).toString(16).padStart(2,"0")).join("")}
function applyTheme(){const c=THEMES[t.theme][1],r=document.documentElement.style;r.setProperty("--accent",c);r.setProperty("--accent-soft",mix(c,"#171717",.2));document.body.className=document.body.className.replace(/\bdeco-\S+/g,"").trim()+" deco-"+t.deco;document.body.classList.toggle("viewer",!canEdit())}

function save(){
  ToolStore.save(NS,t);
  $("sync").textContent=live.room?(canEdit()?"Conectado a la sala":"Mirando la sala"):"Guardado en este navegador";
  if(live.room&&canEdit()){clearTimeout(live.pushT);live.pushT=setTimeout(pushLive,200)}
}
function commit(){save();renderAll()}

function radio(el,items,cur,attr,on){
  el.innerHTML=items.map(([k,html])=>`<button class="chip" type="button" role="radio" aria-checked="${k===cur}" data-${attr}="${k}">${html}</button>`).join("");
  el.querySelectorAll(`[data-${attr}]`).forEach(b=>b.onclick=()=>on(b.dataset[attr]));
}

function renderSetup(){
  if(document.activeElement!==$("title"))$("title").value=t.title;
  const desc={single:"Pierde una vez y queda afuera.",double:"Hay que perder dos veces. Llave de ganadores y de perdedores.",groups:"Todos contra todos en grupos y los mejores pasan a la llave."};
  $("format").innerHTML=Object.entries(FORMATS).map(([k,n])=>`<button class="fmt" type="button" role="radio" aria-checked="${t.format===k}" data-fmt="${k}"><b>${n}</b><small>${desc[k]}</small></button>`).join("");
  $("format").querySelectorAll("[data-fmt]").forEach(b=>b.onclick=()=>{t.format=b.dataset.fmt;commit()});
  $("grpOpts").hidden=t.format!=="groups";
  if(!$("gSize").options.length){$("gSize").innerHTML=[3,4,5,6,8].map(n=>`<option value="${n}">${n}</option>`).join("");$("gAdv").innerHTML=[1,2,3,4].map(n=>`<option value="${n}">${n}</option>`).join("")}
  $("gSize").value=t.groupSize;$("gAdv").value=t.advance;
  radio($("order"),[["random","Aleatorio"],["seeds","Por orden de la lista"]],t.order,"ord",v=>{t.order=v;commit()});
  $("ordHint").textContent=t.order==="random"?"Se mezclan al azar y se ubican en la llave con las posiciones oficiales: los libres (byes) caen contra los primeros cabezas de serie.":"El primero de la lista es cabeza de serie 1. Las posiciones oficiales separan a los mejores hasta la final.";
  radio($("theme"),Object.entries(THEMES).map(([k,[n,c]])=>[k,`<span class="sw" style="background:${c}"></span>${n}`]),t.theme,"th",v=>{t.theme=v;commit()});
  radio($("deco"),Object.entries(DECOS),t.deco,"dc",v=>{t.deco=v;commit()});
  $("pplCount").textContent=t.players.length+" / 64";
  $("plist").innerHTML=t.players.map((p,i)=>`<li>${t.order==="seeds"?`<span class="sd">${i+1}</span>`:""}${avatar(p,32)}<b>${esc(p.name)}</b>${ui.ask===p.id?`<span class="msg">¿Quitar?</span><button class="btn xs warn" type="button" data-rm="${p.id}">Quitar</button><button class="btn xs" type="button" data-no>Cancelar</button>`:`<label class="check mcck"><input type="checkbox" data-mc="${p.id}" ${p.mc?"checked":""}> Minecraft</label><span class="acts">${t.order==="seeds"?`<button class="btn xs" type="button" data-up="${i}" ${i?"":"disabled"} aria-label="Subir"><svg width="10" height="10" viewBox="0 0 12 12" aria-hidden="true"><path d="M1.5 8 6 3.5 10.5 8" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="square"/></svg></button><button class="btn xs" type="button" data-dn="${i}" ${i<t.players.length-1?"":"disabled"} aria-label="Bajar"><svg width="10" height="10" viewBox="0 0 12 12" aria-hidden="true"><path d="M1.5 4 6 8.5 10.5 4" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="square"/></svg></button>`:""}<button class="btn xs" type="button" data-ask="${p.id}">Quitar</button></span>`}</li>`).join("")||`<li class="msg">Todavía no hay participantes. Agrega al menos 2.</li>`;
  $("plist").querySelectorAll("[data-ask]").forEach(b=>b.onclick=()=>{ui.ask=b.dataset.ask;renderSetup()});
  $("plist").querySelectorAll("[data-no]").forEach(b=>b.onclick=()=>{ui.ask="";renderSetup()});
  $("plist").querySelectorAll("[data-rm]").forEach(b=>b.onclick=()=>{t.players=t.players.filter(p=>p.id!==b.dataset.rm);ui.ask="";commit()});
  $("plist").querySelectorAll("[data-mc]").forEach(c=>c.onchange=()=>{const p=t.players.find(x=>x.id===c.dataset.mc);if(p){p.mc=c.checked;commit()}});
  $("plist").querySelectorAll("[data-up],[data-dn]").forEach(b=>b.onclick=()=>{const i=+(b.dataset.up??b.dataset.dn),j=b.dataset.up!=null?i-1:i+1;[t.players[i],t.players[j]]=[t.players[j],t.players[i]];commit()});
  const min=t.format==="groups"?3:2;
  $("start").disabled=t.players.length<min;
  $("startMsg").textContent=t.players.length<min?`Faltan ${min-t.players.length} para poder sortear.`:"";
}

function addPlayer(name,mc){
  name=str(name,24);if(!name)return"empty";
  if(t.players.length>=64)return"full";
  if(t.players.some(p=>p.name.toLowerCase()===name.toLowerCase()))return"dup";
  t.players.push({id:uid(),name,mc:!!mc});return"ok";
}
function pmsg(s,bad){$("pMsg").textContent=s;$("pMsg").classList.toggle("bad",!!bad)}

function roundName(id){
  const m=B.M.get(id);if(!m)return"";
  if(m.sec==="Grupos")return"Grupo "+String.fromCharCode(65+m.g);
  const sec=B.sections.find(s=>s.id===m.sec);return(B.sections.length>1?m.sec+" · ":"")+(sec?sec.names[m.ri]:"");
}

function renderBoard(){
  B=build(t);S=solver(t,B);
  $("bTitle").textContent=t.title||"Torneo";
  const champ=S.champion();
  $("bInfo").textContent=FORMATS[t.format]+" · "+t.players.length+" participantes"+(champ!=null?" · terminado":"");
  const any=Object.keys(t.results).length;
  $("bActs").innerHTML=canEdit()?(ui.ask==="reroll"?`<span class="msg">Se borran ${any} resultados. ¿Sortear de nuevo?</span><button class="btn sm warn" type="button" id="rrYes">Sortear de nuevo</button><button class="btn sm" type="button" id="rrNo">Cancelar</button>`:
    ui.ask==="setup"?`<span class="msg">¿Volver a la configuración? Se borra la llave.</span><button class="btn sm warn" type="button" id="stYes">Volver</button><button class="btn sm" type="button" id="stNo">Cancelar</button>`:
    `<button class="btn sm" type="button" id="reroll">Re-sortear</button><button class="btn sm" type="button" id="toSetup">Volver a configurar</button>`):"";
  const on=(id,f)=>{const e=$(id);if(e)e.onclick=f};
  on("reroll",()=>{if(any){ui.ask="reroll";renderBoard()}else doDraw()});
  on("rrYes",()=>{ui.ask="";doDraw()});on("rrNo",()=>{ui.ask="";renderBoard()});
  on("toSetup",()=>{ui.ask="setup";renderBoard()});
  on("stYes",()=>{ui.ask="";t.live=false;t.draw=[];t.results={};t.focus="";commit()});on("stNo",()=>{ui.ask="";renderBoard()});
  renderBracket($("bracket"),t,B,S,{click:true});
  const now=new Set();
  $("bracket").querySelectorAll(".mt[data-m]").forEach(b=>b.querySelectorAll(".sl[data-pid]").forEach((s,i)=>{const k=b.dataset.m+"|"+i+"|"+s.dataset.pid+"|"+s.className;now.add(k);if(ui.prev.size&&!ui.prev.has(k))s.classList.add("in")}));
  ui.prev=now;
  $("bracket").querySelectorAll(".mt[data-m]").forEach(b=>b.onclick=()=>openMatch(b.dataset.m));
}

function doDraw(){
  const ids=t.players.map(p=>p.id);
  t.draw=t.order==="random"?shuffle(ids):ids;t.results={};t.focus="";t.live=true;
  ui.prev=new Set();save();renderAll();
  if(matchMedia("(prefers-reduced-motion:reduce)").matches)return;
  const el=$("bracket"),names=t.players.map(p=>p.name),slots=[...el.querySelectorAll(".sl[data-pid] b")],real=slots.map(s=>s.textContent);
  el.classList.add("drawing");
  const iv=setInterval(()=>slots.forEach(s=>{s.textContent=names[Math.floor(Math.random()*names.length)]}),70);
  setTimeout(()=>{clearInterval(iv);slots.forEach((s,i)=>{s.textContent=real[i]});el.classList.remove("drawing")},1100);
}

function openMatch(id){
  const m=B.M.get(id),o=S.out(id);if(!m||(o&&o.auto))return;
  const a=S.res(m.a),b=S.res(m.b);
  if(a==null||b==null||a<0||b<0)return;
  if(canEdit()&&t.focus!==id){t.focus=id;save()}
  renderMatch(id);
  const d=$("match");if(!d.open)d.showModal();
}
function renderMatch(id,anim){
  const m=B.M.get(id),o=S.out(id),pl=[S.res(m.a),S.res(m.b)].map(i=>B.P[i]),ed=canEdit();
  $("mbox").innerHTML=`<div class="mhead"><h2 id="mTitle">${esc(roundName(id))}</h2><span class="count">${esc(t.title||"Torneo")}</span></div>
  <div class="vs">${pl.map((p,i)=>`${i?`<span class="x" aria-hidden="true">VS</span>`:""}<div class="side ${o?(o.side===i?"win":"lose"):""} ${anim===i?"anim":""}">${avatar(p,128)}<b>${esc(p.name)}</b>${ed?`<button class="btn ${o&&o.side===i?"":"primary"}" type="button" data-win="${i}" ${o&&o.side===i?"disabled":""}>${o&&o.side===i?"Ganó":"Ganó "+esc(p.name)}</button>`:o&&o.side===i?`<span class="msg">Ganó</span>`:""}</div>`).join("")}</div>
  <div class="mfoot">${ed&&o?`<button class="btn sm" type="button" id="mClear">Borrar resultado</button>`:""}<button class="btn sm" type="button" id="mClose">Cerrar</button></div>`;
  $("mbox").querySelectorAll("[data-win]").forEach(b=>b.onclick=()=>setWinner(id,+b.dataset.win));
  $("mClear")&&($("mClear").onclick=()=>{dependents(B,id).forEach(k=>delete t.results[k]);commit();renderMatch(id)});
  $("mClose").onclick=closeMatch;
}
function setWinner(id,side){
  if(t.results[id]===side)return;
  dependents(B,id).forEach(k=>delete t.results[k]);
  t.results[id]=side;save();
  B=build(t);S=solver(t,B);
  renderMatch(id,side);
  setTimeout(()=>{if($("match").open)closeMatch()},900);
}
function closeMatch(){const d=$("match");if(d.open)d.close();if(canEdit()&&t.focus){t.focus="";save()}renderAll()}
$("match").addEventListener("cancel",e=>{e.preventDefault();closeMatch()});
$("match").addEventListener("click",e=>{if(e.target===$("match"))closeMatch()});

function renderAll(){
  applyTheme();
  $("setup").hidden=t.live;$("board").hidden=!t.live;
  if(t.live)renderBoard();else renderSetup();
  renderLive();
}

$("title").addEventListener("input",e=>{t.title=str(e.target.value,48);save()});
$("gSize").addEventListener("change",e=>{t.groupSize=+e.target.value;commit()});
$("gAdv").addEventListener("change",e=>{t.advance=+e.target.value;commit()});
$("addP").onsubmit=e=>{
  e.preventDefault();
  const r=addPlayer($("pName").value,$("pMc").checked);
  if(r==="ok"){pmsg("");$("pName").value="";commit();$("pName").focus()}
  else pmsg(r==="dup"?"Ya hay alguien con ese nombre.":r==="full"?"Llegaste al máximo de 64.":"Escribe un nombre.",r!=="empty");
};
$("bulkAdd").onclick=()=>{
  const lines=$("bulk").value.split("\n").map(s=>s.trim()).filter(Boolean);let ok=0,dup=0;
  for(const l of lines){const r=addPlayer(l,$("bulkMc").checked);if(r==="ok")ok++;else if(r==="dup")dup++;else if(r==="full")break}
  $("bulk").value="";pmsg(`Se agregaron ${ok}.${dup?` ${dup} ya estaban.`:""}`);commit();
};
$("start").onclick=()=>doDraw();
$("exportBtn").onclick=()=>{ToolStore.save(NS,t);ToolStore.exportFile(NS)};
$("importBtn").onclick=()=>$("importFile").click();
$("importFile").onchange=async e=>{
  const f=e.target.files[0];e.target.value="";if(!f)return;
  if(!canEdit()){$("sync").textContent="Solo el dueño y los editores pueden cambiar la sala";return}
  try{const d=cleanT(await ToolStore.importFile(NS,f));if(!d.players.length)throw 0;t=d;ui.prev=new Set();commit();$("sync").textContent="Torneo importado"}
  catch(err){ToolStore.save(NS,t);$("sync").textContent="Ese archivo no es un torneo."}
};

function pushLive(){
  clearTimeout(live.pushT);live.pushT=0;
  if(!live.room||!canEdit())return;
  const d=JSON.stringify(t);if(d===live.remoteData)return;live.remoteData=d;
  live.room.set("data",d).catch(()=>{live.remoteData=null;$("sync").textContent="La sala rechazó el cambio. Inicia sesión con una cuenta que pueda editar."});
}
function applyRemote(v){
  if(typeof v!=="string"||v.length>60000)return;
  if(live.pushT)pushLive();
  live.remoteData=v;let s;try{s=cleanT(JSON.parse(v))}catch(e){return}
  if(JSON.stringify(s)===JSON.stringify(t))return;
  t=s;ToolStore.save(NS,t);
  if($("match").open&&!canEdit()){if(t.focus){B=build(t);S=solver(t,B);renderMatch(t.focus)}else $("match").close()}
  renderAll();
}
async function joinRoom(name){
  live.busy=true;live.err="";renderLive();
  try{
    const room=await ToolSync.join(name,"torneo");
    const d=await room.once("data");
    live.room=room;live.open=false;
    try{localStorage.setItem(LIVE_KEY,room.name)}catch(e){}
    if(typeof d==="string"&&d.length)applyRemote(d);else pushLive();
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
  if(!live.room){let n="";try{n=localStorage.getItem(LIVE_KEY)||""}catch(e){}await joinRoom(n||"torneo-"+Math.random().toString(36).slice(2,8));if(!live.room)return}
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
  const menu=`<details class="ovmenu"><summary class="btn sm">${live.copied&&live.copied!=="inv"?"Link copiado":live.busy?"Creando sala…":"Overlay"}</summary><div class="ovlist"><button class="btn sm" type="button" data-ov="llave">Llave completa</button><button class="btn sm" type="button" data-ov="combate">Combate en grande</button></div></details>`;
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
addEventListener("resize",()=>{if(t.live&&B)drawLines($("bracket"),B,S)});

renderAll();
if(ToolSync.ready()){
  let ur=0;
  ToolSync.onUser(async u=>{
    const n=++ur,ed=await ToolSync.canEditRooms(u,"torneo");if(n!==ur)return;
    const was=canEdit();live.user=u;live.editor=ed;
    if(live.room&&!was&&canEdit())pushLive();
    renderAll();
  }).catch(()=>{});
  const s=new URLSearchParams(location.search).get("sala");
  if(s)joinRoom(s);
}
