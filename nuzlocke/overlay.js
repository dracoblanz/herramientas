const MON_RE=/^[a-z0-9][a-z0-9 =?!]{0,29}$/,PID_RE=/^p[a-z0-9]{1,24}$/;
const clampLv=v=>Math.min(100,Math.max(1,parseInt(v,10)||1));
function cleanSpin(v){
  if(!v||typeof v!=="object"||typeof v.id!=="string"||!Array.isArray(v.slices)||!MON_RE.test(v.p)||!isFinite(v.mid))return null;
  const slices=v.slices.slice(0,80).filter(s=>s&&MON_RE.test(s.p)&&isFinite(s.start)&&isFinite(s.end)).map(s=>({p:s.p,start:+s.start,end:+s.end}));
  if(!slices.length)return null;
  return{id:v.id.slice(0,40),player:String(v.player||""),pn:String(v.pn||"").slice(0,24),zone:String(v.zone||"").slice(0,40),zn:String(v.zn||"").slice(0,40),slices,mid:+v.mid,dur:Math.min(10000,Math.max(100,+v.dur||4200)),p:v.p,lv:clampLv(v.lv)};
}
const NAMES={nidoranf:"Nidoran♀",nidoranm:"Nidoran♂",mrmime:"Mr. Mime",farfetchd:"Farfetch'd",hooh:"Ho-Oh",porygon2:"Porygon2",mimejr:"Mime Jr."};
const nm=p=>{if(NAMES[p])return NAMES[p];const u=/^unown character=(.)$/.exec(p);if(u)return"Unown "+u[1].toUpperCase();return p.charAt(0).toUpperCase()+p.slice(1)};
const SPR="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/";
const spr=p=>{const id=(window.DEX||{})[String(p).split(" ")[0]];return id?SPR+(id<=386?"versions/generation-iii/firered-leafgreen/":"")+id+".png":""};
const img=(p,s)=>{const u=spr(p);return u?`<img src="${u}" width="${s}" height="${s}" alt="" decoding="async">`:`<span></span>`};
const $=id=>document.getElementById(id);
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const norm=s=>String(s).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g,"").trim();
const q=new URLSearchParams(location.search);
const all=q.get("ultimos")==="todos",last=all?Infinity:Math.min(12,Math.max(1,parseInt(q.get("ultimos"),10)||3)),vista=q.get("vista")||"todo",only=q.get("jugador")?norm(q.get("jugador")):"",hide=q.has("ocultar")?Math.max(0,+q.get("ocultar")||0):10,preview=q.has("preview");
const reduce=matchMedia("(prefers-reduced-motion: reduce)").matches;
document.body.classList.toggle("preview",preview);
document.body.classList.add("vista-"+vista);document.body.classList.toggle("todos",all);
if(vista==="ruleta"||vista==="mapa")$("teams").hidden=true;
if(vista==="mapa"){$("spin").hidden=true;$("mapov").hidden=false}

let mapPid="",mapZone="",mapZn="",players=[],fresh=null,angle=0,frozen=[],spinRun=0,hideT=0,freshT=0,lastId=null;

function status(t){const s=$("status");s.hidden=!t||!preview;s.textContent=t||""}

function drawWheel(){
  const cv=$("wheel"),ctx=cv.getContext("2d"),W=cv.width,R=W/2-10,c=W/2,cs=getComputedStyle(document.documentElement);
  const col=["--s1","--s2","--s3","--s4","--s5","--s6"].map(v=>cs.getPropertyValue(v).trim()),font=cs.getPropertyValue("--display");
  ctx.clearRect(0,0,W,W);
  ctx.save();ctx.translate(c,c);ctx.rotate(angle);
  frozen.forEach((s,i)=>{
    ctx.beginPath();ctx.moveTo(0,0);ctx.arc(0,0,R,s.start-Math.PI/2,s.end-Math.PI/2);ctx.closePath();
    const fill=col[(i+(frozen.length%6===1&&i===frozen.length-1?1:0))%6];ctx.fillStyle=fill;ctx.fill();
    ctx.strokeStyle="#0a0a0a";ctx.lineWidth=4;ctx.stroke();
    const span=s.end-s.start;
    const md=(s.start+s.end)/2-Math.PI/2,flip=Math.cos(angle+md)<0;
    ctx.save();ctx.rotate(md);if(flip)ctx.rotate(Math.PI);ctx.fillStyle=fill.toLowerCase()==="#facc15"||fill.toLowerCase()==="#b37bff"?"#0a0a0a":"#f5f5f5";
    ctx.font="700 "+Math.max(18,Math.min(44,span*R*.42))+"px "+font;ctx.textAlign=flip?"left":"right";ctx.textBaseline="middle";
    
    if(span>.06)ctx.fillText(nm(s.p),flip?-(R-52):R-52,0);
    ctx.restore();
  });
  ctx.restore();
  ctx.beginPath();ctx.arc(c,c,44,0,Math.PI*2);ctx.fillStyle="#171717";ctx.fill();ctx.lineWidth=8;ctx.strokeStyle="#b37bff";ctx.stroke();
}

function renderMap(){
  const M=window.KANTO_MAP;if(vista!=="mapa"||!M)return;
  const pl=players.find(p=>only?norm(p.name)===only:p.id===mapPid)||(only?null:players[0]);
  const routes=pl?pl.routes:{},rk=M.sete.zones.some(z=>z.z===mapZone)?"sete":"kanto",reg=M[rk];
  const S=(n,a)=>`<${n} ${Object.entries(a).map(([k,v])=>`${k}="${v}"`).join(" ")}/>`;
  const SPOT={cave:"var(--cave)",forest:"var(--forest)",bldg:"var(--bldg)",beach:"var(--beach)",ruins:"var(--ruins)",water:"var(--sea-deep)"};
  let g=`<rect x="0" y="0" width="${reg.w}" height="${reg.h}" fill="var(--sea)"/>`,cur="";
  g+=reg.land.map(l=>S("rect",{x:l[0],y:l[1],width:l[2],height:l[3],rx:.35,fill:"var(--land)",stroke:"var(--land-edge)","stroke-width":.14})).join("");
  for(const z of [...reg.zones].sort((a,b)=>(a.pts?0:1)-(b.pts?0:1))){
    const r=routes[z.z],here=z.z===mapZone;
    if(z.pts){
      const pts=z.pts.map(p=>p.join(",")).join(" ");
      if(z.t==="sea")g+=S("polyline",{points:pts,fill:"none",stroke:"var(--muted)","stroke-width":.22,"stroke-dasharray":".45 .3","stroke-linecap":"round",opacity:.9});
      else if(z.t==="tunnel")g+=S("polyline",{points:pts,fill:"none",stroke:"var(--path-edge)","stroke-width":.3,"stroke-dasharray":".5 .35"});
      else g+=S("polyline",{points:pts,fill:"none",stroke:"var(--path-edge)","stroke-width":.82,"stroke-linecap":"square"})+S("polyline",{points:pts,fill:"none",stroke:r?"var(--done)":"var(--path)","stroke-width":.52,"stroke-linecap":"square"});
      if(here){const xs=z.pts.map(p=>p[0]),ys=z.pts.map(p=>p[1]),x0=Math.min(...xs)-.55,y0=Math.min(...ys)-.55;cur=S("rect",{class:"cursor",x:x0,y:y0,width:Math.max(...xs)-x0+.55,height:Math.max(...ys)-y0+.55})}
    }else{
      const [x,y]=z.at,s=z.t==="town"?1.1:.8,fill=r?"var(--done)":z.t==="town"?"var(--town)":SPOT[z.t]||"var(--path)";
      g+=z.t==="town"||z.t==="bldg"?S("rect",{x:x-s/2,y:y-s/2,width:s,height:s,fill,stroke:"var(--line-strong)","stroke-width":.12}):
        z.t==="cave"||z.t==="ruins"?S("polygon",{points:`${x},${y-s/1.6} ${x+s/1.6},${y} ${x},${y+s/1.6} ${x-s/1.6},${y}`,fill,stroke:"var(--line-strong)","stroke-width":.12}):
        S("circle",{cx:x,cy:y,r:s/2,fill,stroke:"var(--line-strong)","stroke-width":.12});
      if(here)cur=S("rect",{class:"cursor",x:x-.95,y:y-.95,width:1.9,height:1.9});
    }
  }
  g+=reg.deco.map(d=>S("rect",{x:d.at[0]-.42,y:d.at[1]-.42,width:.84,height:.84,fill:"var(--panel)",stroke:"var(--muted)","stroke-width":.14})).join("");
  $("omap").innerHTML=`<svg viewBox="0 0 ${reg.w} ${reg.h}" aria-hidden="true">${g}${cur}</svg>`;
  const used=Object.keys(routes).length;
  $("mhead").innerHTML=`<b>${esc(pl?pl.name:reg.name)}</b>${mapZn?`<span>${esc(mapZn)}</span>`:""}<small>${used} ${used===1?"ruta usada":"rutas usadas"}</small>`;
}

function renderTeams(){
  if(vista==="ruleta"||vista==="mapa")return;
  const list=players.filter(p=>!only||norm(p.name)===only);
  $("teams").innerHTML=list.map(p=>{
    const alive=p.team.filter(t=>t.alive).length,dead=p.team.length-alive;
    const mons=all?p.team.slice():p.team.slice(-last).reverse(),more=p.team.length-mons.length;
    const isNew=t=>t.alive&&fresh&&fresh.player===p.id&&fresh.p===t.p&&fresh.zone===t.route;
    return `<div class="player"><div class="pname"><b>${esc(p.name)}</b><small>${alive} ${alive===1?"vivo":"vivos"}${dead?` · ${dead} ${dead===1?"caído":"caídos"}`:""}</small></div><div class="mons">${mons.length?mons.map(t=>`<div class="mon ${t.alive?"":"dead"} ${isNew(t)?"new":""}">${img(t.p,56)}<b>${esc(nm(t.p))}</b><small>Nv. ${t.lv}</small></div>`).join("")+(more>0?`<span class="more">+${more}</span>`:""):`<span class="empty">Sin capturas todavía</span>`}</div></div>`;
  }).join("");
}

function setPlayers(v){
  const list=[];
  for(const [id,r] of Object.entries(v&&typeof v==="object"?v:{})){
    if(!r||typeof r.data!=="string"||!PID_RE.test(id))continue;
    try{
      const p=JSON.parse(r.data);
      if(!p||p.id!==id||!Array.isArray(p.team))continue;
      const team=p.team.slice(0,300).filter(t=>t&&MON_RE.test(t.p)).map(t=>({p:t.p,route:typeof t.route==="string"?t.route.slice(0,40):"",lv:clampLv(t.lv),alive:t.alive!==false}));
      const routes={};for(const [k,x] of Object.entries(p.routes&&typeof p.routes==="object"?p.routes:{}).slice(0,200))if(k.length<=40&&x&&(x.r==="caught"||x.r==="fail"))routes[k]=x.r;
      list.push([+r.order||0,{id,name:String(p.name||"").slice(0,24)||"Jugador",team,routes}]);
    }catch(e){}
  }
  players=list.sort((a,b)=>a[0]-b[0]).map(x=>x[1]);
  renderTeams();renderMap();
}

function play(v){
  if(vista==="equipo")return;
  if(only&&norm(v.pn||"")!==only)return;
  if(vista==="mapa"){mapPid=v.player;mapZone=v.zone;mapZn=v.zn;renderMap();return}
  clearTimeout(hideT);
  frozen=v.slices;
  $("who").innerHTML=`${esc(v.pn||"")} <span>· ${esc(v.zn||"")}</span>`;
  const hit=$("hit");hit.className="hit wait";hit.innerHTML="<p>Girando…</p>";
  $("spin").classList.remove("away");
  const target=-v.mid,start=angle;
  let end=target+Math.PI*2*Math.ceil((start-target)/(Math.PI*2));
  if(!reduce)end+=Math.PI*12;
  const dur=reduce?300:(v.dur||4200),t0=performance.now();
  const run=++spinRun;
  requestAnimationFrame(()=>hit.className="hit show");
  let over=false;
  const finish=()=>{
    if(over||run!==spinRun)return;over=true;
    angle=end%(Math.PI*2);drawWheel();
    hit.className="hit wait";
    requestAnimationFrame(()=>{hit.innerHTML=`${img(v.p,112)}<div><b>¡${esc(nm(v.p))}!</b><p>Nv. ${v.lv} · al equipo de ${esc(v.pn||"")}</p></div>`;hit.className="hit show"});
    clearTimeout(freshT);fresh={player:v.player,p:v.p,zone:v.zone};renderTeams();
    freshT=setTimeout(()=>{fresh=null;renderTeams()},9000);
    if(hide)hideT=setTimeout(()=>$("spin").classList.add("away"),hide*1000);
  };
  setTimeout(finish,dur+250);
  (function step(t){
    if(over||run!==spinRun)return;
    const k=Math.min(1,(t-t0)/dur),e=1-Math.pow(1-k,4);
    angle=start+(end-start)*e;drawWheel();
    if(k<1)requestAnimationFrame(step);else finish();
  })(performance.now());
}

function demo(){
  const mk=(id,name,team)=>({order:0,data:JSON.stringify({id,name,team,routes:id==="pa"?{"Route 1":{r:"caught",p:"pidgey"},"Route 22":{r:"caught",p:"rattata"}}:{}})});
  setPlayers({pa:{...mk("pa","Draco",[{p:"bulbasaur",route:"",lv:5,alive:true},{p:"pidgey",route:"Route 1",lv:3,alive:true},{p:"rattata",route:"Route 22",lv:4,alive:false}])},pb:{...mk("pb","Invitado",[{p:"charmander",route:"",lv:5,alive:true}]),order:1}});
  const pool=["pidgey","rattata","caterpie","weedle","pikachu","spearow"],sl=pool.map((p,i)=>({p,start:i/6*Math.PI*2,end:(i+1)/6*Math.PI*2}));
  const run=()=>{const i=Math.floor(Math.random()*6);play({id:Date.now(),player:"pa",pn:"Draco",zone:"Viridian Forest",zn:"Bosque Verde",slices:sl,mid:(i+.5)/6*Math.PI*2,dur:4200,p:pool[i],lv:4})};
  run();setInterval(run,16000);
}

async function start(){
  const sala=q.get("sala");
  if(!sala||!ToolSync.ready()){
    if(preview){status(!sala?"Falta ?sala=NOMBRE en el link. Mostrando ejemplo.":"Firebase sin configurar. Mostrando ejemplo.");demo()}
    return;
  }
  try{
    status("Conectando a "+ToolSync.clean(sala)+"…");
    const room=await ToolSync.join(sala,"nuzlocke");
    const sp=await room.once("spin");lastId=sp&&sp.id;const s0=cleanSpin(sp);if(s0){mapPid=s0.player;mapZone=s0.zone;mapZn=s0.zn}
    room.on("players",setPlayers);
    if(vista==="mapa")room.on("sel",v=>{if(!v||typeof v!=="object"||!PID_RE.test(v.player)||typeof v.zone!=="string")return;if(only&&norm(v.pn||"")!==only)return;mapPid=v.player;mapZone=v.zone.slice(0,40);mapZn=String(v.zn||"").slice(0,40);renderMap()});
    room.on("spin",raw=>{const v=cleanSpin(raw);if(!v||v.id===lastId)return;lastId=v.id;play(v)});
    room.connected(c=>status(c?"Conectado a "+room.name:"Reconectando…"));
  }catch(e){status(e&&e.message?e.message:"No se pudo conectar")}
}
document.fonts.ready.then(drawWheel);
start();
