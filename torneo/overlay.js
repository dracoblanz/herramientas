const q=new URLSearchParams(location.search),vista=q.get("vista")==="combate"?"combate":"llave",preview=q.has("preview");
document.body.classList.toggle("preview",preview);
document.body.classList.toggle("rondas",q.has("rondas"));
let lastDraw="",prevSl=null,t=null,B=null,S=null,lastChamp=null,champT=0,hideT=0,lastFocus="";

function status(s){const e=$("status");e.hidden=!s||!preview;e.textContent=s||""}
function mix(hex,base,k){const a=[1,3,5].map(i=>parseInt(hex.slice(i,i+2),16)),b=[1,3,5].map(i=>parseInt(base.slice(i,i+2),16));return"#"+a.map((v,i)=>Math.round(v*k+b[i]*(1-k)).toString(16).padStart(2,"0")).join("")}

function fit(){
  const box=$("fit"),br=$("bracket");br.style.transform="none";
  const w=br.scrollWidth,h=br.scrollHeight,k=Math.min(2,box.clientWidth/w,box.clientHeight/h);
  br.style.left=Math.max(0,(box.clientWidth-w*k)/2)+"px";br.style.top=Math.max(0,(box.clientHeight-h*k)/2)+"px";
  br.style.transform=`scale(${k})`;
}

function vsCard(id,win){
  const m=B.M.get(id),o=S.out(id),pl=[S.res(m.a),S.res(m.b)].map(i=>B.P[i]);
  const sec=B.sections.find(s=>s.id===m.sec),rn=m.sec==="Grupos"?"Grupo "+String.fromCharCode(65+m.g):(B.sections.length>1?m.sec+" · ":"")+(sec?sec.names[m.ri]:"");
  return`<div class="mbox"><div class="mhead"><h2>${esc(rn)}</h2><span class="count">${esc(t.title||"Torneo")}</span></div><div class="vs">${pl.map((p,i)=>`${i?`<span class="x" aria-hidden="true">VS</span>`:""}<div class="side ${o?(o.side===i?"win":"lose"):""}">${avatar(p,160)}<b>${esc(p.name)}</b></div>`).join("")}</div></div>`;
}

function render(){
  const c=THEMES[t.theme][1],r=document.documentElement.style;r.setProperty("--accent",c);r.setProperty("--accent-soft",mix(c,"#171717",.2));
  document.body.className=document.body.className.replace(/\bdeco-\S+/g,"").trim()+" deco-"+t.deco;
  B=build(t);S=solver(t,B);
  const champ=t.live?S.champion():null;
  if(vista==="llave"){
    $("llave").hidden=!t.live;
    if(!t.live)return;
    renderBracket($("bracket"),t,B,S,{click:false});
    const now=new Set();
    $("bracket").querySelectorAll(".mt[data-m]").forEach(b=>b.querySelectorAll(".sl[data-pid]").forEach((s,i)=>{const k=b.dataset.m+"|"+i+"|"+s.dataset.pid+"|"+s.className;now.add(k);if(prevSl&&!prevSl.has(k))s.classList.add("in")}));
    if(prevSl&&t.focus)$("bracket").querySelectorAll(`.mt[data-m="${t.focus}"]`).forEach(b=>b.classList.add("focus"));
    const dk=t.draw.join(",");
    if(lastDraw&&dk!==lastDraw&&!matchMedia("(prefers-reduced-motion:reduce)").matches){
      const names=t.players.map(p=>p.name),slots=[...$("bracket").querySelectorAll(".sl[data-pid] b")],real=slots.map(s=>s.textContent);
      $("bracket").classList.add("drawing");
      const iv=setInterval(()=>slots.forEach(s=>{s.textContent=names[Math.floor(Math.random()*names.length)]}),70);
      setTimeout(()=>{clearInterval(iv);slots.forEach((s,i)=>{s.textContent=real[i]});$("bracket").classList.remove("drawing")},1100);
    }
    lastDraw=dk;prevSl=now;
    requestAnimationFrame(()=>{fit();drawLines($("bracket"),B,S)});
    return;
  }
  const el=$("vs");
  if(champ!=null&&champ!==lastChamp&&lastChamp!==undefined&&!t.focus){
    clearTimeout(champT);el.className="vsov show champ-on";el.hidden=false;
    el.innerHTML=`<div class="mbox"><div class="cbig">${avatar(B.P[champ],200)}<span>Campeón</span><b>${esc(B.P[champ].name)}</b></div></div>`;
    champT=setTimeout(()=>{el.hidden=true},15000);
  }else if(t.focus&&B.M.get(t.focus)){
    clearTimeout(hideT);clearTimeout(champT);
    const isNew=t.focus!==lastFocus;
    el.className="vsov"+(isNew?" show":"");el.hidden=false;el.innerHTML=vsCard(t.focus);
  }else if(lastFocus&&!t.focus){
    const prev=lastFocus;if(B.M.get(prev)){el.innerHTML=vsCard(prev);el.className="vsov"}
    hideT=setTimeout(()=>{el.hidden=true},2500);
  }else if(!el.className.includes("champ-on"))el.hidden=true;
  lastFocus=t.focus;lastChamp=champ;
}

function setData(v){
  if(typeof v!=="string"||v.length>60000)return;
  try{t=cleanT(JSON.parse(v))}catch(e){return}
  render();
}

function demo(){
  const names=["Dracoblanz","Notch","Dream","Technoblade","Pochan","Digital68","Octavio","Jeb_"];
  t=cleanT({title:"Copa PlayArt",format:"single",theme:"violeta",deco:"doble",players:names.map((n,i)=>({id:"p"+i+"x",name:n,mc:true}))});
  t.draw=t.players.map(p=>p.id);t.live=true;t.results={"W0-0":0,"W0-1":1,"W0-2":0};lastChamp=undefined;
  if(vista==="combate")t.focus="W0-3";
  render();
}

addEventListener("resize",()=>{if(t&&t.live&&vista==="llave"){fit();drawLines($("bracket"),B,S)}});
async function start(){
  const sala=q.get("sala");
  if(!sala||!ToolSync.ready()){if(preview){status(!sala?"Falta ?sala=NOMBRE en el link. Mostrando ejemplo.":"Firebase sin configurar. Mostrando ejemplo.");demo()}return}
  try{
    status("Conectando a "+ToolSync.clean(sala)+"…");
    const room=await ToolSync.join(sala,"torneo");
    lastChamp=undefined;
    room.on("data",v=>{setData(v);if(lastChamp===undefined)lastChamp=t?(t.live?S.champion():null):null});
    room.connected(c=>status(c?"Conectado a "+room.name:"Reconectando…"));
  }catch(e){status(e&&e.message?e.message:"No se pudo conectar")}
}
start();
