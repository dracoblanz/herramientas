const NS="equipo",LIVE_KEY="equipo-sala";
const uid=k=>k+Date.now().toString(36)+Math.random().toString(36).slice(2,6);
const fresh=()=>({title:"",mode:"nuzlocke",region:"kanto",attempt:1,rules:"",style:"animado",sep:true,players:[{id:uid("p"),name:"Jugador 1",badges:0,mons:[]}]});
let state=cleanState(ToolStore.load(NS,null)||fresh());
if(!state.players.length)state.players=fresh().players;
let cur=state.players[0].id;
const ui={edit:"",ask:"",renaming:false,confirmDel:false};
var live={room:null,remoteData:null,remoteP:{},who:{},claim:"",user:null,editor:false,online:true,open:false,busy:false,err:"",copied:"",authBusy:false,pushT:0,ovPlayer:"",ovForma:"h",ovOrient:"h",ovNames:true};

const player=()=>state.players.find(p=>p.id===cur)||state.players[0];
const canMeta=()=>!live.room||!!live.editor;
const mine=pid=>!!(live.room&&live.user&&live.who[pid]===live.user.uid);
const canPlayer=pid=>canMeta()||mine(pid);
const canEdit=()=>canPlayer(player().id);
const anyMine=()=>state.players.some(p=>mine(p.id));

function save(){
  ToolStore.save(NS,state);
  syncText();
  if(live.room&&(canMeta()||anyMine())){clearTimeout(live.pushT);live.pushT=setTimeout(pushLive,250)}
}
function commit(){save();renderAll()}
function syncText(){$("sync").textContent=!live.room?"Guardado en este navegador":canMeta()?"Conectado a la sala":anyMine()?"Editas solo tu equipo":"Mirando la sala"}

function renderReto(){
  if(document.activeElement!==$("title"))$("title").value=state.title;
  if(document.activeElement!==$("rules"))$("rules").value=state.rules;
  $("mode").innerHTML=Object.entries(MODES).map(([k,n])=>`<button class="chip" type="button" data-mode="${k}" aria-pressed="${state.mode===k}">${n}</button>`).join("");
  $("mode").querySelectorAll("[data-mode]").forEach(b=>b.onclick=()=>{state.mode=b.dataset.mode;commit()});
  $("style").innerHTML=Object.entries(STYLES).map(([k,n])=>`<button class="chip" type="button" data-sty="${k}" aria-pressed="${state.style===k}">${n}</button>`).join("");
  $("style").querySelectorAll("[data-sty]").forEach(b=>b.onclick=()=>{state.style=b.dataset.sty;commit()});
  if(!$("region").options.length)$("region").innerHTML=Object.entries(REGIONS).map(([k,r])=>`<option value="${k}">${esc(r.n)}</option>`).join("");
  $("region").value=state.region;
  $("attempt").textContent=state.attempt;
  $("attDown").disabled=state.attempt<=1;
  $("retoSum").textContent=[state.title||"Sin nombre",MODES[state.mode],REGIONS[state.region].n,"Intento "+state.attempt].join(" · ");
  $("sep").checked=state.sep;
  $("linkL").textContent=state.mode==="soullink"?"Enlace (ruta)":"Ruta";
}

function renderPlayers(){
  const el=$("players"),pl=player();
  const chips=state.players.map(p=>`<button class="chip" type="button" data-p="${p.id}" aria-pressed="${p.id===pl.id}">${esc(p.name)} · ${team(p).length}/6</button>`).join("");
  let tail="";
  if(ui.renaming)tail=`<form id="renF"><input type="text" id="renI" name="nombre" maxlength="24" value="${esc(pl.name)}" aria-label="Nuevo nombre" autocomplete="off"><button class="btn sm primary" type="submit">Guardar</button><button class="btn sm" type="button" id="renNo">Cancelar</button></form>`;
  else if(ui.confirmDel)tail=`<span class="msg">¿Eliminar a ${esc(pl.name)} y sus Pokémon?</span><button class="btn sm warn" type="button" id="delYes">Eliminar</button><button class="btn sm" type="button" id="delNo">Cancelar</button>`;
  else tail=`<button class="btn sm" type="button" id="ren">Renombrar</button>${state.players.length>1?`<button class="btn sm" type="button" id="del">Eliminar</button>`:""}${state.players.length<6?`<form id="addP"><input type="text" id="newP" name="jugador" maxlength="24" placeholder="Nuevo jugador…" aria-label="Nombre del nuevo jugador" autocomplete="off"><button class="btn sm" type="submit">Agregar</button></form>`:""}`;
  el.innerHTML=chips+tail;
  el.querySelectorAll("[data-p]").forEach(b=>b.onclick=()=>{cur=b.dataset.p;ui.edit="";ui.ask="";ui.renaming=false;ui.confirmDel=false;renderAll()});
  $("ren")&&($("ren").onclick=()=>{ui.renaming=true;renderPlayers();$("renI").select()});
  $("renF")&&($("renF").onsubmit=e=>{e.preventDefault();const n=str($("renI").value,24);if(n)pl.name=n;ui.renaming=false;commit()});
  $("renNo")&&($("renNo").onclick=()=>{ui.renaming=false;renderPlayers()});
  $("del")&&($("del").onclick=()=>{ui.confirmDel=true;renderPlayers()});
  $("delYes")&&($("delYes").onclick=()=>{state.players=state.players.filter(p=>p.id!==pl.id);cur=state.players[0].id;ui.confirmDel=false;commit()});
  $("delNo")&&($("delNo").onclick=()=>{ui.confirmDel=false;renderPlayers()});
  $("addP")&&($("addP").onsubmit=e=>{e.preventDefault();const n=str($("newP").value,24);if(!n)return;const id=uid("p");state.players.push({id,name:n,badges:0,mons:[]});cur=id;commit()});
}

function partners(m){
  if(state.mode!=="soullink"||!m.link)return[];
  const k=norm(m.link),out=[];
  state.players.forEach(p=>{if(p.id===player().id)return;p.mons.forEach(x=>{if(norm(x.link)===k)out.push([p,x])})});
  return out;
}

function card(m,where,i,n){
  const pl=player();
  if(ui.edit===m.id)return`<li class="mon"><form class="add" data-ef="${m.id}" style="grid-column:1/-1">
    <label class="f grow"><span>Especie</span><input type="text" name="especie" list="allMons" value="${esc(species(m.p))}" spellcheck="false"></label>
    <label class="f"><span>Mote</span><input type="text" name="mote" maxlength="20" value="${esc(m.nick)}" spellcheck="false"></label>
    <label class="f lv"><span>Nivel</span><input type="number" name="nivel" min="1" max="100" value="${m.lv}"></label>
    <label class="f grow"><span>${state.mode==="soullink"?"Enlace (ruta)":"Ruta"}</span><input type="text" name="enlace" maxlength="30" value="${esc(m.link)}" spellcheck="false"></label>
    <label class="check"><input type="checkbox" name="shiny" ${m.shiny?"checked":""}> Shiny</label>
    <div class="add-go"><button class="btn sm primary" type="submit">Guardar</button><button class="btn sm" type="button" data-ecancel>Cancelar</button><p class="msg" data-emsg aria-live="polite"></p></div></form></li>`;
  const pt=partners(m).map(([p,x])=>esc(p.name)+": "+esc(label(x))).join(", ");
  const asking=ui.ask===m.id;
  const acts=asking?`<span class="msg">¿Quitar a ${esc(label(m))}?</span><button class="btn xs warn" type="button" data-a="rm" data-id="${m.id}">Quitar</button><button class="btn xs" type="button" data-a="no" data-id="${m.id}">Cancelar</button>`:
    (where==="team"?`<button class="btn xs" type="button" data-a="left" data-id="${m.id}" ${i===0?"disabled":""} aria-label="Mover antes"><svg width="10" height="10" viewBox="0 0 12 12" aria-hidden="true"><path d="M8 1.5 3.5 6 8 10.5" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="square"/></svg></button><button class="btn xs" type="button" data-a="right" data-id="${m.id}" ${i===n-1?"disabled":""} aria-label="Mover después"><svg width="10" height="10" viewBox="0 0 12 12" aria-hidden="true"><path d="M4 1.5 8.5 6 4 10.5" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="square"/></svg></button><button class="btn xs" type="button" data-a="box" data-id="${m.id}">A la caja</button><button class="btn xs" type="button" data-a="die" data-id="${m.id}">Murió</button>`:
     where==="box"?`<button class="btn xs" type="button" data-a="team" data-id="${m.id}" ${team(pl).length>=6?"disabled title=\"El equipo está lleno\"":""}>Al equipo</button><button class="btn xs" type="button" data-a="die" data-id="${m.id}">Murió</button>`:
     `<button class="btn xs" type="button" data-a="rev" data-id="${m.id}">Revivir</button>`)+`<button class="btn xs" type="button" data-a="ed" data-id="${m.id}">Editar</button><button class="btn xs" type="button" data-a="ask" data-id="${m.id}">Quitar</button>`;
  return`<li class="mon ${m.st==="dead"?"is-dead":""}">${monImg(m,state.style,72)}<div class="nm"><b>${esc(label(m))}</b>${m.nick?`<small>${esc(species(m.p))}</small>`:""}</div>
    <div class="meta">${where==="dead"?`Nv. ${m.lv}`:`<label>Nv. <input type="number" min="1" max="100" value="${m.lv}" data-lv="${m.id}" aria-label="Nivel de ${esc(label(m))}"></label>`}<span class="tps">${typeIcons(m.p)}</span>${m.shiny?`<span class="shine">Shiny</span>`:""}</div>
    <div class="meta">${m.link?`<span class="ln">${state.mode==="soullink"?LINK_SVG.replace('width="28" height="28"','width="14" height="14"'):""}${esc(m.link)}</span>`:""}${pt?`<span>· ${pt}</span>`:""}</div>
    <div class="acts">${acts}</div></li>`;
}

function bindCards(root){
  const pl=player();
  root.querySelectorAll("[data-a]").forEach(b=>b.onclick=()=>act(b.dataset.a,b.dataset.id));
  root.querySelectorAll("[data-lv]").forEach(inp=>inp.onchange=()=>{const m=pl.mons.find(x=>x.id===inp.dataset.lv);if(m){m.lv=clampInt(inp.value,1,100,m.lv);commit()}});
  root.querySelectorAll("[data-ef]").forEach(f=>{
    f.querySelector("[data-ecancel]").onclick=()=>{ui.edit="";renderAll()};
    f.onsubmit=e=>{e.preventDefault();const m=pl.mons.find(x=>x.id===f.dataset.ef);if(!m)return;const p=findMon(f.especie.value);if(!p){f.querySelector("[data-emsg]").textContent="No encuentro esa especie. Elige una de la lista.";f.querySelector("[data-emsg]").classList.add("bad");return}
      m.p=p;m.nick=str(f.mote.value,20);m.lv=clampInt(f.nivel.value,1,100,m.lv);m.link=str(f.enlace.value,30);m.shiny=f.shiny.checked;ui.edit="";commit()};
  });
}

function act(a,id){
  const pl=player(),i=pl.mons.findIndex(x=>x.id===id),m=pl.mons[i];if(!m)return;
  if(a==="ask"){ui.ask=id;renderAll();return}
  if(a==="no"){ui.ask="";renderAll();return}
  if(a==="ed"){ui.edit=id;ui.ask="";renderAll();return}
  if(a==="rm"){pl.mons.splice(i,1);ui.ask="";say("Quitaste a "+label(m)+".")}
  if(a==="box")m.st="box";
  if(a==="team"){if(team(pl).length>=6)return;m.st="team";pl.mons.splice(i,1);pl.mons.push(m)}
  if(a==="left"||a==="right"){const t=team(pl),j=t.indexOf(m),o=t[a==="left"?j-1:j+1];if(!o)return;const oi=pl.mons.indexOf(o);pl.mons[i]=o;pl.mons[oi]=m}
  if(a==="die"||a==="rev"){
    const st=a==="die"?"dead":"box";m.st=st;m.at=Date.now();
    const all=partners(m).filter(([,x])=>a==="die"?x.st!=="dead":x.st==="dead"),pts=all.filter(([p])=>canPlayer(p.id)),miss=all.filter(([p])=>!canPlayer(p.id));
    pts.forEach(([,x])=>{x.st=st;x.at=Date.now()});
    say((pts.length?(a==="die"?"Cayó el enlace: ":"Revivió el enlace: ")+pts.map(([p,x])=>p.name+" · "+label(x)).join(", ")+". ":"")+(miss.length?"Avísale a "+miss.map(([p,x])=>p.name+" que marque a "+label(x)).join(" y ")+".":""));
  }
  commit();
}
function say(t,bad){$("aMsg").textContent=t;$("aMsg").classList.toggle("bad",!!bad)}

function renderTeam(){
  const pl=player(),t=team(pl);
  $("teamT").textContent="Equipo de "+pl.name;
  $("teamCount").textContent=t.length+"/6";
  $("team").innerHTML=t.map((m,i)=>card(m,"team",i,t.length)).join("")+Array.from({length:6-t.length},()=>`<li class="mon empty">Espacio libre</li>`).join("");
  bindCards($("team"));
  const box=pl.mons.filter(m=>m.st==="box"),dd=dead(pl).sort((a,b)=>b.at-a.at);
  $("boxCount").textContent=box.length;$("deadCount").textContent=dd.length;
  $("box").innerHTML=box.length?box.map(m=>card(m,"box")).join(""):`<li class="emptyl">La caja está vacía. Cuando el equipo tiene 6, lo nuevo cae acá.</li>`;
  $("dead").innerHTML=dd.length?dd.map(m=>card(m,"dead")).join(""):`<li class="emptyl">Nadie cayó todavía.</li>`;
  bindCards($("box"));bindCards($("dead"));
}

function renderBadges(){
  const pl=player(),bs=REGIONS[state.region].b;
  $("badgep").hidden=!bs.length;
  $("badCount").textContent=bs.filter((b,i)=>pl.badges&1<<i).length+"/"+bs.length;
  $("badges").innerHTML=bs.map((b,i)=>{const on=!!(pl.badges&1<<i);return`<button class="badge" type="button" data-b="${i}" aria-pressed="${on}">${badgeIcon(b,on)}<span>${esc(b.n)}</span></button>`}).join("");
  $("badges").querySelectorAll("[data-b]").forEach(b=>b.onclick=()=>{pl.badges^=1<<+b.dataset.b;commit()});
}

function renderAll(){document.body.classList.toggle("viewer",!canEdit());document.body.classList.toggle("nometa",!canMeta());renderReto();renderPlayers();renderTeam();renderBadges();renderLive()}

$("allMons").innerHTML=PD.slice(1).map(d=>`<option value="${esc(d[0])}"></option>`).join("");
$("title").addEventListener("input",e=>{state.title=str(e.target.value,40);save()});
$("rules").addEventListener("input",e=>{state.rules=String(e.target.value).slice(0,400);save()});
$("rules").addEventListener("change",()=>{state=cleanState(state);commit()});
$("sep").addEventListener("change",e=>{state.sep=e.target.checked;commit()});
$("region").addEventListener("change",e=>{state.region=e.target.value;commit()});
$("attDown").onclick=()=>{state.attempt=Math.max(1,state.attempt-1);commit()};
$("attUp").onclick=()=>{state.attempt=Math.min(999,state.attempt+1);commit()};
$("exportBtn").onclick=()=>{ToolStore.save(NS,state);ToolStore.exportFile(NS)};
$("importBtn").onclick=()=>$("importFile").click();
$("importFile").onchange=async e=>{
  const f=e.target.files[0];e.target.value="";if(!f)return;
  if(!canMeta()){$("sync").textContent="Solo el dueño y los editores pueden cambiar la sala";return}
  try{const d=cleanState(await ToolStore.importFile(NS,f));if(!d.players.length)throw 0;state=d;cur=state.players[0].id;ui.edit="";ui.ask="";commit();$("sync").textContent="Partida importada"}
  catch(err){ToolStore.save(NS,state);$("sync").textContent="Ese archivo no es una partida de Equipo Locke."}
};
$("add").onsubmit=e=>{
  e.preventDefault();
  const p=findMon($("aSp").value);
  if(!p){say("No encuentro esa especie. Elige una de la lista.",true);$("aSp").focus();return}
  const pl=player(),toTeam=team(pl).length<6;
  const m={id:uid("m"),p,nick:str($("aNick").value,20),lv:clampInt($("aLv").value,1,100,5),shiny:$("aShiny").checked,link:str($("aLink").value,30),st:toTeam?"team":"box",at:Date.now()};
  pl.mons.push(m);
  $("aSp").value="";$("aNick").value="";$("aLink").value="";$("aShiny").checked=false;
  say(label(m)+(toTeam?" entró al equipo.":" fue a la caja: el equipo está lleno."));
  commit();
  if(matchMedia("(pointer:fine)").matches)$("aSp").focus();
};

const rejected=()=>{$("sync").textContent="La sala rechazó el cambio. Inicia sesión con una cuenta que pueda editar."};
function pushLive(){
  clearTimeout(live.pushT);live.pushT=0;
  const sent=[];
  if(!live.room||!(canMeta()||anyMine()))return sent;
  live.pushing=true;
  const rp=live.remoteP;
  if(!canMeta()){
    if(state.sep)state.players.forEach(p=>{if(!mine(p.id))return;const s=JSON.stringify(p);if(rp[p.id]!==s){rp[p.id]=s;sent.push([p.id,s]);live.room.set("p/"+p.id,s).catch(()=>{delete rp[p.id];rejected()})}});
    live.pushing=false;return sent;
  }
  if(state.sep){
    const ids=new Set();
    state.players.forEach(p=>{ids.add(p.id);const s=JSON.stringify(p);if(rp[p.id]!==s){rp[p.id]=s;sent.push([p.id,s]);live.room.set("p/"+p.id,s).catch(()=>{delete rp[p.id];rejected()})}});
    Object.keys(rp).forEach(id=>{if(!ids.has(id)){delete rp[id];live.room.remove("p/"+id).catch(rejected)}});
  }
  const d=JSON.stringify(state.sep?metaOf(state):state);
  if(d!==live.remoteData){live.remoteData=d;live.room.set("data",d).catch(()=>{live.remoteData=null;rejected()})}
  if(!state.sep&&Object.keys(rp).length){live.remoteP={};live.room.remove("p").catch(rejected)}
  live.pushing=false;
  return sent;
}
function applyRemote(){
  const s=composeState(live.remoteData,live.remoteP,state);
  if(!s||!s.players.length)return;
  if(JSON.stringify(s)===JSON.stringify(state))return;
  state=s;if(!state.players.some(p=>p.id===cur))cur=state.players[0].id;
  ToolStore.save(NS,state);renderAll();
}
async function joinRoom(name){
  live.busy=true;live.err="";renderLive();
  try{
    const room=await ToolSync.join(name,"equipo");
    const d=await room.once("data"),pm=await room.once("p");
    live.remoteP={};if(pm&&typeof pm==="object")for(const [k,v] of Object.entries(pm))if(PID_RE.test(k)&&typeof v==="string")live.remoteP[k]=v;
    live.room=room;live.open=false;
    try{localStorage.setItem(LIVE_KEY,room.name)}catch(e){}
    if(typeof d==="string"&&d.length){live.remoteData=d;applyRemote()}else pushLive();
    room.on("data",v=>{if(typeof v!=="string"||live.pushing)return;if(live.pushT){const d=live.remoteData;pushLive();if(live.remoteData!==d){applyRemote();return}}live.remoteData=v;applyRemote()});
    room.on("p",v=>{if(live.pushing)return;const sent=live.pushT?pushLive():[];const m={};if(v&&typeof v==="object")for(const [k,x] of Object.entries(v))if(PID_RE.test(k)&&typeof x==="string")m[k]=x;sent.forEach(([k,s])=>{m[k]=s});live.remoteP=m;applyRemote()});
    room.connected(c=>{live.online=c;renderLive()});
    const u=new URL(location.href);u.searchParams.set("sala",room.name);history.replaceState(null,"",u);
    room.on("who",v=>{const m={};if(v&&typeof v==="object")for(const [k,x] of Object.entries(v))if(PID_RE.test(k)&&typeof x==="string")m[k]=x;live.who=m;live.whoLoaded=true;tryClaim();syncText();renderAll()});
    syncText();
  }catch(e){live.err=e&&e.message?e.message:"No se pudo conectar"}
  live.busy=false;renderAll();
}
function leaveRoom(){
  if(live.room)live.room.leave();
  live.room=null;live.remoteData=null;live.remoteP={};live.who={};live.whoLoaded=false;
  const u=new URL(location.href);u.searchParams.delete("sala");history.replaceState(null,"",u);
  $("sync").textContent="Fuera de la sala, sigue guardado en este navegador";
  renderAll();
}
const VIEWS=[["barra","Equipo en barra"],["equipo","Equipo con nombres"],["enlaces","Enlaces Soul Link"],["tira","Medallas en tira"],["medallas","Medallas con nombres"],["cementerio","Cementerio"],["reto","Reto e intento"],["todo","Todo junto"]];
async function copyOverlay(v){
  if(!live.room){
    let n="";try{n=localStorage.getItem(LIVE_KEY)||""}catch(e){}
    await joinRoom(n||"locke-"+Math.random().toString(36).slice(2,8));
    if(!live.room)return;
  }
  const u=new URL("overlay.html",location.href);u.searchParams.set("sala",live.room.name);u.searchParams.set("vista",v);
  if(live.ovPlayer)u.searchParams.set("jugador",live.ovPlayer);
  if((v==="barra"||v==="equipo")&&live.ovOrient==="v")u.searchParams.set("orient","v");
  if(v==="barra"&&!live.ovNames)u.searchParams.set("sinnombres","");
  if((v==="tira"||v==="medallas")&&live.ovForma!=="h")u.searchParams.set("forma",live.ovForma);
  try{await navigator.clipboard.writeText(u.href);live.copied=v}catch(e){prompt("Copia este link:",u.href)}
  renderLive();setTimeout(()=>{live.copied="";renderLive()},1800);
}
function tryClaim(){
  if(!live.whoLoaded||!live.room||!live.user)return;
  if(!canMeta()&&!mine(cur)){const m=state.players.find(p=>mine(p.id));if(m)cur=m.id}
  const pid=live.claim;if(!pid)return;
  if(!state.players.some(p=>p.id===pid)){live.claim="";live.err="Ese jugador ya no está en la sala.";renderLive();return}
  const w=live.who[pid];
  if(w===live.user.uid){live.claim="";cur=pid;renderAll();return}
  if(w){live.claim="";live.err="Ese jugador ya lo tomó otra cuenta. Pídele al dueño que lo libere.";renderLive();return}
  if(live.claiming)return;live.claiming=true;
  live.room.set("who/"+pid,live.user.uid).then(()=>{cur=pid}).catch(()=>{live.err="No se pudo tomar el jugador. Revisa que tu correo esté en la lista de acceso."}).finally(()=>{live.claiming=false;live.claim="";renderAll()});
}
async function copyPlayer(pid){
  const u=new URL("./",location.href);u.search="";u.searchParams.set("sala",live.room.name);u.searchParams.set("soy",pid);
  try{await navigator.clipboard.writeText(u.href);live.copied="pl"+pid}catch(e){prompt("Copia este link:",u.href)}
  renderLive();setTimeout(()=>{live.copied="";renderLive()},1800);
}
function plMenu(){
  if(!state.sep)return`<details class="ovmenu"><summary class="btn sm">Links de jugadores</summary><div class="ovlist"><p class="msg">Activa “Editar al mismo tiempo” en Reto para dar un link a cada jugador.</p></div></details>`;
  return`<details class="ovmenu"><summary class="btn sm">${live.copied.startsWith("pl")?"Link copiado":"Links de jugadores"}</summary><div class="ovlist"><p class="msg">Cada link deja editar solo ese equipo. La primera cuenta invitada que lo abre se lo queda.</p>${state.players.map(p=>`<div class="plrow"><b>${esc(p.name)}</b>${live.who[p.id]?`<span class="msg">Tomado</span><button class="btn xs" type="button" data-free="${p.id}">Liberar</button>`:`<button class="btn xs" type="button" data-pl="${p.id}">Copiar link</button>`}</div>`).join("")}</div></details>`;
}
async function copyInvite(){
  const u=new URL("./",location.href);u.search="";u.searchParams.set("sala",live.room.name);
  try{await navigator.clipboard.writeText(u.href);live.copied="inv"}catch(e){prompt("Copia este link:",u.href)}
  renderLive();setTimeout(()=>{live.copied="";renderLive()},1800);
}
function renderLive(){
  const el=$("live");
  if(!ToolSync.ready()){el.hidden=true;return}
  let last="";try{last=localStorage.getItem(LIVE_KEY)||""}catch(e){}
  const ed=!!live.editor;
  const acct=live.user?`<button class="btn sm" type="button" id="lvOut">Cerrar sesión</button>`:"";
  const err=live.err?`<p class="err" role="alert">${esc(live.err)}</p>`:"";
  const menu=ovMenu();
  if(live.room){
    el.innerHTML=`<span class="onair ${live.online?"":"off"}"><i></i>${live.online?"En vivo":"Reconectando"} · ${esc(live.room.name)}${ed?"":anyMine()?" · tu equipo":" · solo mirar"}</span>${ed?`<button class="btn sm" type="button" id="lvInv">${live.copied==="inv"?"Link copiado":"Copiar invitación"}</button>${plMenu()}`:""}${ed?menu:""}<button class="btn sm" type="button" id="lvLeave">Salir</button>${acct}${err}`;
    $("lvInv")&&($("lvInv").onclick=copyInvite);
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
  el.querySelectorAll("[data-pl]").forEach(b=>b.onclick=()=>copyPlayer(b.dataset.pl));
  el.querySelectorAll("[data-free]").forEach(b=>b.onclick=()=>live.room.remove("who/"+b.dataset.free).catch(rejected));
  el.querySelectorAll(".ovmenu").forEach(m=>m.addEventListener("keydown",e=>{if(e.key==="Escape"){m.open=false;m.querySelector("summary").focus()}}));
  const om=$("ovP");
  if(om){
    $("ovP").onchange=e=>{live.ovPlayer=e.target.value};
    $("ovF").onchange=e=>{live.ovForma=e.target.value};
    $("ovO").onchange=e=>{live.ovOrient=e.target.value};
    $("ovN").onchange=e=>{live.ovNames=e.target.checked};
    el.querySelectorAll("[data-ov]").forEach(b=>b.onclick=()=>copyOverlay(b.dataset.ov));
  }
}
function ovMenu(){
    const views=VIEWS.filter(([k])=>k!=="enlaces"||state.mode==="soullink");
    const who=`<label>Jugador<select id="ovP"><option value="">Todos</option>${state.players.map(p=>`<option value="${esc(p.name)}" ${live.ovPlayer===p.name?"selected":""}>${esc(p.name)}</option>`).join("")}</select></label><label>Equipo<select id="ovO"><option value="h" ${live.ovOrient==="h"?"selected":""}>Horizontal</option><option value="v" ${live.ovOrient==="v"?"selected":""}>Vertical</option></select></label><label class="ck"><input type="checkbox" id="ovN" ${live.ovNames?"checked":""}> Nombres en la barra</label><label>Forma de las medallas<select id="ovF">${[["h","Horizontal"],["v","Vertical"],["2h","2 filas (horizontal)"],["2v","2 columnas (vertical)"]].map(([k,n])=>`<option value="${k}" ${live.ovForma===k?"selected":""}>${n}</option>`).join("")}</select></label><hr>`;
  return`<details class="ovmenu"><summary class="btn sm">${live.copied&&live.copied!=="inv"&&!live.copied.startsWith("pl")?"Link copiado":live.busy?"Creando sala…":"Overlay"}</summary><div class="ovlist">${who}${views.map(([k,n])=>`<button class="btn sm" type="button" data-ov="${k}">${n}</button>`).join("")}</div></details>`;
}
document.addEventListener("click",e=>{document.querySelectorAll(".ovmenu[open]").forEach(om=>{if(!om.contains(e.target))om.open=false})});

$("reto").open=!state.title;
renderAll();
if(ToolSync.ready()){
  let ur=0;
  ToolSync.onUser(async u=>{
    const n=++ur,ed=await ToolSync.canEditRooms(u,"equipo");if(n!==ur)return;
    live.user=u;live.editor=ed;
    if(live.room){syncText();tryClaim();if(canMeta())pushLive()}
    renderAll();
  }).catch(()=>{});
  const sp=new URLSearchParams(location.search),s=sp.get("sala");
  if(PID_RE.test(sp.get("soy")||""))live.claim=sp.get("soy");
  if(s)joinRoom(s);
}
