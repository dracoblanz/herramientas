const q=new URLSearchParams(location.search),V=["ruleta","resultado","historial"],vista=V.includes(q.get("vista"))?q.get("vista"):"ruleta",preview=q.has("preview");
document.body.classList.toggle("preview",preview);
document.body.classList.add("v-"+vista);
let r=null,lastSpin,lastHist=-1,banT=0;
const W=vista==="ruleta"?Wheel($("wheel"),()=>""):null;

function status(s){const e=$("status");e.hidden=!s||!preview;e.textContent=s||""}
function mix(hex,base,k){const a=[1,3,5].map(i=>parseInt(hex.slice(i,i+2),16)),b=[1,3,5].map(i=>parseInt(base.slice(i,i+2),16));return"#"+a.map((v,i)=>Math.round(v*k+b[i]*(1-k)).toString(16).padStart(2,"0")).join("")}

function banner(sp){
  const p=r.players.find(x=>x.id===sp.p)||(sp.pn?{name:sp.pn}:null),el=$("bov");
  clearTimeout(banT);el.hidden=false;el.className="bov";void el.offsetWidth;el.className="bov show";
  el.innerHTML=`<div class="res">${p?`<span class="who">${avatar(p,44)}${esc(p.name)}</span>`:""}<b>${esc(sp.sl[sp.k][0])}</b></div>`;
  banT=setTimeout(()=>{el.className="bov out";banT=setTimeout(()=>{el.hidden=true},500)},vista==="resultado"?10000:8000);
}

function idle(){const cur=curPlayer(r);W.set(sliceList(r,avail(r,cur?cur.id:"")))}

function renderHist(){
  const n=r.hist.length,rows=r.hist.slice(-8).reverse();
  $("hov").hidden=false;
  $("hov").innerHTML=rows.map((h,k)=>{const p=r.players.find(x=>x.id===h.p)||(h.pn?{name:h.pn}:null);return`<li class="${lastHist>=0&&k<n-lastHist?"in":""}">${p?avatar(p,40):""}<span class="t">${p?`<small>${esc(p.name)}</small>`:""}<b>${esc(h.t)}</b></span></li>`}).join("");
  lastHist=n;
}

function render(){
  const c=THEMES[r.theme][1],s=document.documentElement.style;s.setProperty("--accent",c);s.setProperty("--accent-soft",mix(c,"#171717",.2));
  const sp=r.spin,fresh=sp&&lastSpin!==undefined&&sp.id!==lastSpin;
  if(lastSpin===undefined)lastSpin=sp?sp.id:"";
  if(vista==="historial"){renderHist();return}
  if(fresh){
    lastSpin=sp.id;
    if(W){$("wov").hidden=false;W.play(sp,()=>{banner(sp);idle()})}
    else setTimeout(()=>banner(sp),matchMedia("(prefers-reduced-motion:reduce)").matches?300:sp.dur);
    return;
  }
  if(W){$("wov").hidden=false;if(!W.busy)idle()}
}

function setData(v){
  if(typeof v!=="string"||v.length>60000)return;
  try{r=cleanR(JSON.parse(v))}catch(e){return}
  render();
}

function demo(){
  r=cleanR({theme:"violeta",items:["Diamante","Esmeralda","Nada","Doble premio","Hierro","Oro","Castigo","Elytra"].map((t,i)=>({id:"i"+i+"x",t})),players:[{id:"p1x",name:"Dracoblanz",mc:true},{id:"p2x",name:"Notch",mc:true}],hist:[{i:"i0x",p:"p1x",t:"Diamante"},{i:"i3x",p:"p2x",t:"Doble premio"}]});
  lastSpin="";render();
  if(vista!=="historial")setTimeout(()=>{const k=2,seg=Math.PI*2/r.items.length;r.spin={id:"demo",sl:sliceList(r,r.items),k,i:"i2x",p:"p1x",pn:"Dracoblanz",mid:k*seg+seg/2,dur:5200};render()},700);
}

addEventListener("resize",()=>{if(W&&!W.busy&&r)W.paint()});
document.fonts&&document.fonts.ready.then(()=>{if(W&&!W.busy&&r)W.paint()});
async function start(){
  const sala=q.get("sala");
  if(!sala||!ToolSync.ready()){if(preview){status(!sala?"Falta ?sala=NOMBRE en el link. Mostrando ejemplo.":"Firebase sin configurar. Mostrando ejemplo.");demo()}return}
  try{
    status("Conectando a "+ToolSync.clean(sala)+"…");
    const room=await ToolSync.join(sala,"ruleta");
    room.on("data",setData);
    room.connected(c=>status(c?"Conectado a "+room.name:"Reconectando…"));
  }catch(e){status(e&&e.message?e.message:"No se pudo conectar")}
}
start();
