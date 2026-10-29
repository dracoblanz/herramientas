const q=new URLSearchParams(location.search);
const VISTAS=["barra","tira","equipo","enlaces","medallas","cementerio","reto","todo"];
const vista=VISTAS.includes(q.get("vista"))?q.get("vista"):"todo",only=q.get("jugador")?norm(q.get("jugador")):"",preview=q.has("preview");
document.body.classList.add("vista-"+vista);
document.body.classList.toggle("v",q.get("orient")==="v");
document.body.classList.toggle("preview",preview);
document.body.classList.add("forma-"+(["h","v","2h","2v"].includes(q.get("forma"))?q.get("forma"):"h"));
const show={bar:["barra"],strip:["tira"],teams:["equipo","todo"],links:["enlaces"],medals:["medallas","todo"],grave:["cementerio","todo"],reto:["reto","todo"]};
let raw="",pmap={},st=null,seen=null,newIds=new Set(),newT=0;

function status(t){const s=$("status");s.hidden=!t||!preview;s.textContent=t||""}
const players=()=>st.players.filter(p=>!only||norm(p.name)===only);

function slot(m){
  return`<div class="slot ${newIds.has(m.id)?"new":""}">${monImg(m,st.style,88)}<b>${esc(label(m))}</b><span class="sub">${m.nick?esc(species(m.p))+" · ":""}Nv. ${m.lv}${m.shiny?` · <span class="shine">Shiny</span>`:""}</span><span class="tps">${typeIcons(m.p)}</span></div>`;
}

const BALL=SPR+"items/poke-ball.png",names=!q.has("sinnombres");
function renderBar(){
  const ps=players(),tag=ps.length>1;
  $("bar").innerHTML=ps.map(p=>{
    const t=team(p);
    return`<div class="brow">${tag?`<span class="btag">${esc(p.name)}</span>`:""}${t.map(m=>`<div class="bs ${newIds.has(m.id)?"new":""}">${monImg(m,st.style,96)}${names?`<b>${esc(label(m))}</b>`:""}</div>`).join("")}${Array.from({length:6-t.length},()=>`<div class="bs empty"><img src="${BALL}" width="40" height="40" alt="" decoding="async"></div>`).join("")}</div>`;
  }).join("");
}
function renderStrip(){
  const bs=REGIONS[st.region].b,ps=players(),tag=ps.length>1;
  $("strip").innerHTML=bs.length?ps.map(p=>`<div class="srow">${tag?`<span class="btag">${esc(p.name)}</span>`:""}<div class="sbs">${bs.map((b,i)=>`<span class="sb">${badgeIcon(b,!!(p.badges&1<<i))}</span>`).join("")}</div></div>`).join(""):"";
}
function renderTeams(){
  $("teams").innerHTML=players().map(p=>{
    const t=team(p),d=dead(p).length;
    return`<div class="row"><div class="plate"><b>${esc(p.name)}</b><small>${t.length}/6${d?` · ${d} ${d===1?"caído":"caídos"}`:""}</small></div><div class="slots">${t.map(slot).join("")}${Array.from({length:6-t.length},()=>`<div class="slot empty"></div>`).join("")}</div></div>`;
  }).join("");
}

function renderLinks(){
  const ps=st.players;
  const idx=ps.map(p=>st.players.indexOf(p));
  const groups=linkGroups(st).filter(g=>g.by.some(m=>m&&m.st==="team")).slice(0,6);
  const cols=ps.length*2-1;
  const cell=m=>m?`<div class="cell ${m.st==="dead"?"gone":""}">${monImg(m,st.style,68)}<div><b>${esc(label(m))}</b><small>Nv. ${m.lv}${m.st==="box"?" · caja":""}</small></div></div>`:`<div class="cell none">Sin captura</div>`;
  let h=ps.map((p,i)=>(i?`<span class="hd mid"></span>`:"")+`<span class="hd">${esc(p.name)}</span>`).join("");
  if(!groups.length)h+=`<p class="lk" style="grid-column:1/-1">Todavía no hay enlaces en el equipo.</p>`;
  groups.forEach(g=>{
    const broken=g.by.some((m,i)=>idx.includes(i)&&m&&m.st==="dead");
    h+=`<span class="lk">${esc(g.link)}</span>`+idx.map((pi,i)=>(i?`<span class="ch ${broken?"gone":""}">${LINK_SVG}</span>`:"")+cell(g.by[pi])).join("");
  });
  $("links").style.gridTemplateColumns=Array.from({length:cols},(_,i)=>i%2?"44px":"auto").join(" ");
  $("links").innerHTML=h;
}

function renderMedals(){
  const bs=REGIONS[st.region].b;
  $("medals").hidden=!show.medals.includes(vista)||!bs.length;
  $("medals").innerHTML=`<h2>Medallas <small>${esc(REGIONS[st.region].n)}</small></h2>`+players().map(p=>{
    const n=bs.filter((b,i)=>p.badges&1<<i).length;
    return`<div class="mrow"><b>${esc(p.name)}</b><div class="bds">${bs.map((b,i)=>badgeIcon(b,!!(p.badges&1<<i))).join("")}</div><small class="sub">${n}/${bs.length}</small></div>`;
  }).join("");
}

function renderGrave(){
  const all=players().flatMap(p=>dead(p).map(m=>[p,m])).sort((a,b)=>b[1].at-a[1].at);
  $("grave").innerHTML=`<h2>Cementerio <small>${all.length} ${all.length===1?"caído":"caídos"}</small></h2>${all.length?`<ul>${all.slice(0,6).map(([p,m])=>`<li>${monImg(m,st.style,56)}<div><b>${esc(label(m))}</b><small>${m.nick?esc(species(m.p))+" · ":""}Nv. ${m.lv}${st.players.length>1?" · "+esc(p.name):""}</small></div></li>`).join("")}</ul>`:`<p class="none">Nadie cayó todavía.</p>`}`;
}

function renderReto(){
  const rules=st.rules?st.rules.split("\n"):[];
  $("reto").innerHTML=`${st.title?`<p class="tt">${esc(st.title)}</p>`:""}<div class="tags"><span class="tag">${MODES[st.mode]}</span><span class="tag">${esc(REGIONS[st.region].n)}</span></div><div class="att">Intento <span>#${st.attempt}</span></div>${rules.length?`<ol>${rules.map(r=>`<li>${esc(r)}</li>`).join("")}</ol>`:""}`;
}

function render(){
  if(!st)return;
  for(const [k,vs] of Object.entries(show))$(k).hidden=!vs.includes(vista);
  if(vista==="barra")renderBar();
  if(vista==="tira")renderStrip();
  if(vista==="enlaces")renderLinks();
  if(show.teams.includes(vista))renderTeams();
  if(show.grave.includes(vista))renderGrave();
  if(show.reto.includes(vista))renderReto();
  renderMedals();
}

function setState(v){
  const s=typeof v==="string"?composeState(v,pmap,st):cleanState(v);if(!s)return;
  const ids=new Set(s.players.flatMap(p=>team(p).map(m=>m.id)));
  if(seen){newIds=new Set([...ids].filter(id=>!seen.has(id)));clearTimeout(newT);if(newIds.size)newT=setTimeout(()=>{newIds=new Set();render()},4000)}
  seen=ids;st=s;render();
}

function demo(){
  const m=(id,p,nick,lv,link,stt,shiny)=>({id,p,nick,lv,link,st:stt||"team",shiny:!!shiny,at:Date.now()-lv*1000});
  setState({title:"Soul Link Kanto",mode:"soullink",region:"kanto",attempt:3,style:"animado",rules:"Solo el primer encuentro de cada ruta\nSi uno cae, cae su enlace\nNada de objetos en combate",players:[
    {id:"pa",name:"Dracoblanz",badges:7,mons:[m("ma1",25,"Chispa",22,"Bosque Verde"),m("ma2",4,"",20,"Ruta 1"),m("ma3",94,"Sombra",31,"Torre Pokémon",0,1),m("ma4",122,"Mimo",24,"Ruta 2"),m("ma5",131,"",28,"Ruta 12"),m("ma6",16,"Piolín",9,"Ruta 3","dead")]},
    {id:"pb",name:"Digital68",badges:3,mons:[m("mb1",10,"Bicho",21,"Bosque Verde"),m("mb2",7,"Burbu",20,"Ruta 1"),m("mb3",92,"",30,"Torre Pokémon"),m("mb4",39,"Globo",23,"Ruta 2"),m("mb5",54,"",27,"Ruta 12"),m("mb6",19,"",8,"Ruta 3","dead")]}
  ]});
}

async function start(){
  const sala=q.get("sala");
  if(!sala||!ToolSync.ready()){if(preview){status(!sala?"Falta ?sala=NOMBRE en el link. Mostrando ejemplo.":"Firebase sin configurar. Mostrando ejemplo.");demo()}return}
  try{
    status("Conectando a "+ToolSync.clean(sala)+"…");
    const room=await ToolSync.join(sala,"equipo");
    room.on("p",v=>{pmap=v&&typeof v==="object"?v:{};if(raw)setState(raw)});
    room.on("data",v=>{if(typeof v==="string"&&v.length<=60000){raw=v;setState(v)}});
    room.connected(c=>status(c?"Conectado a "+room.name:"Reconectando…"));
  }catch(e){status(e&&e.message?e.message:"No se pudo conectar")}
}
start();
