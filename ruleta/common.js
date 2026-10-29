const $=id=>document.getElementById(id);
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const str=(v,n)=>String(v==null?"":v).replace(/[\u0000-\u001f]/g,"").trim().slice(0,n);
const clampInt=(v,a,b,d)=>{const n=parseInt(v,10);return isFinite(n)?Math.min(b,Math.max(a,n)):d};
const PID_RE=/^p[a-z0-9]{1,24}$/,IID_RE=/^i[a-z0-9]{1,24}$/,SID_RE=/^[a-z0-9]{1,24}$/;
const THEMES={violeta:["Violeta","#b37bff"],rosa:["Rosa","#ec4899"],azul:["Azul","#3b82f6"],oro:["Oro","#facc15"],rojo:["Rojo","#ef4444"]};
const ELIM={no:"Nunca",todos:"Para todos",jugador:"Solo para quien la sacó"};
const COLS=["#b37bff","#3b82f6","#ec4899","#facc15","#ef4444","#22c55e","#f97316","#593d7f"];
const TINTS=["#b37bff","#3b82f6","#ec4899","#facc15","#ef4444","#593d7f"];
const MAX_ITEMS=100,MAX_PLAYERS=32,MAX_HIST=300;
const rnd=()=>crypto.getRandomValues(new Uint32Array(1))[0]/4294967296;

function cleanR(s){
  s=s&&typeof s==="object"?s:{};
  const items=(Array.isArray(s.items)?s.items:[]).slice(0,MAX_ITEMS).filter(i=>i&&IID_RE.test(i.id)).map(i=>({id:i.id,t:str(i.t,40)||"Ítem"}));
  const players=(Array.isArray(s.players)?s.players:[]).slice(0,MAX_PLAYERS).filter(p=>p&&PID_RE.test(p.id)).map(p=>({id:p.id,name:str(p.name,24)||"Jugador",mc:!!p.mc}));
  const hist=(Array.isArray(s.hist)?s.hist:[]).slice(-MAX_HIST).filter(h=>h&&IID_RE.test(h.i)&&(h.p===""||PID_RE.test(h.p))).map(h=>({i:h.i,p:h.p,t:str(h.t,40),pn:str(h.pn,24)}));
  let spin=null;const v=s.spin;
  if(v&&typeof v==="object"&&SID_RE.test(v.id)&&Array.isArray(v.sl)&&v.sl.length&&v.sl.length<=MAX_ITEMS){
    const sl=v.sl.map(x=>[str(x&&x[0],40),clampInt(x&&x[1],0,COLS.length-1,0)]),k=clampInt(v.k,0,sl.length-1,0);
    const mid=+v.mid;if(isFinite(mid))spin={id:v.id,sl,k,i:IID_RE.test(v.i)?v.i:"",p:PID_RE.test(v.p)?v.p:"",pn:str(v.pn,24),mid,dur:clampInt(v.dur,300,12000,5200)};
  }
  return{title:str(s.title,48),theme:THEMES[s.theme]?s.theme:"violeta",elim:ELIM[s.elim]?s.elim:"no",auto:s.auto!==false,items,players,turn:clampInt(s.turn,0,Math.max(0,players.length-1),0),hist,cut:clampInt(s.cut,0,hist.length,0),spin};
}

function curPlayer(r){return r.players.length?r.players[Math.min(r.turn,r.players.length-1)]:null}
function avail(r,pid){
  if(r.elim==="no")return r.items;
  const solo=r.elim==="jugador"&&r.players.length;
  const out=new Set(r.hist.slice(r.cut).filter(h=>!solo||h.p===pid).map(h=>h.i));
  return r.items.filter(i=>!out.has(i.id));
}
function colorOf(r,id){const n=r.items.findIndex(i=>i.id===id),c=n<0?0:n%COLS.length;return n===r.items.length-1&&n>0&&r.items.length%COLS.length===1?(c+1)%COLS.length:c}
function sliceList(r,list){return list.map(i=>[i.t,colorOf(r,i.id)])}

function avatar(p,size){
  if(!p)return`<span class="av empty" style="width:${size}px;height:${size}px"></span>`;
  if(p.mc)return`<img class="av mc" src="https://mc-heads.net/avatar/${encodeURIComponent(p.name.replace(/\s+/g,""))}/${size*2}" width="${size}" height="${size}" alt="" decoding="async">`;
  let h=0;for(const c of p.name)h=(h*31+c.charCodeAt(0))>>>0;
  const ini=p.name.split(/\s+/).map(w=>w[0]).join("").slice(0,2).toUpperCase();
  return`<span class="av ini" style="width:${size}px;height:${size}px;background:${TINTS[h%TINTS.length]};font-size:${Math.round(size*.42)}px">${esc(ini)}</span>`;
}

function lum(h){const n=parseInt(h.slice(1),16),c=[n>>16,n>>8&255,n&255].map(v=>{v/=255;return v<=.03928?v/12.92:Math.pow((v+.055)/1.055,2.4)});return .2126*c[0]+.7152*c[1]+.0722*c[2]}

function Wheel(cv,empty){
  const ctx=cv.getContext("2d"),TAU=Math.PI*2;
  let angle=0,sl=[],busy=false,tilt=0;
  const css=n=>getComputedStyle(document.documentElement).getPropertyValue(n).trim();
  function size(){const d=Math.min(2,devicePixelRatio||1),w=Math.round(cv.clientWidth*d);if(w&&cv.width!==w){cv.width=w;cv.height=w}}
  function fit(text,max){if(ctx.measureText(text).width<=max)return text;let s=text;while(s.length>1&&ctx.measureText(s+"…").width>max)s=s.slice(0,-1);return s+"…"}
  function paint(){
    size();const W=cv.width,R=W/2-W*.04,cx=W/2,cy=W/2+W*.015,u=W/720;
    ctx.clearRect(0,0,W,W);
    if(!sl.length){
      ctx.beginPath();ctx.arc(cx,cy,R,0,TAU);ctx.fillStyle=css("--panel");ctx.fill();ctx.lineWidth=6*u;ctx.strokeStyle=css("--line");ctx.stroke();
      ctx.fillStyle=css("--muted");ctx.font=`700 ${30*u}px ${css("--display")}`;ctx.textAlign="center";ctx.textBaseline="middle";ctx.fillText(empty(),cx,cy-R*.4);
    }else{
      const seg=TAU/sl.length;
      ctx.save();ctx.translate(cx,cy);ctx.rotate(angle);
      sl.forEach(([t,c],i)=>{
        const a0=i*seg-Math.PI/2,fill=COLS[c];
        ctx.beginPath();ctx.moveTo(0,0);ctx.arc(0,0,R,a0,a0+seg);ctx.closePath();ctx.fillStyle=fill;ctx.fill();
        if(sl.length>1){ctx.lineWidth=3*u;ctx.strokeStyle=css("--ground");ctx.stroke()}
        const fs=Math.max(13*u,Math.min(40*u,seg*R*.38));
        const mid=a0+seg/2,flip=Math.cos(angle+mid)<0,max=R*.68;
        ctx.save();ctx.rotate(mid);if(flip)ctx.rotate(Math.PI);ctx.fillStyle=lum(fill)>.3?"#0a0a0a":"#f5f5f5";ctx.textAlign=flip?"left":"right";ctx.textBaseline="middle";
        ctx.font=`700 ${fs}px ${css("--display")}`;const w=ctx.measureText(t).width;
        if(w>max)ctx.font=`700 ${Math.max(fs*.62,fs*max/w)}px ${css("--display")}`;
        if(seg*R>14*u)ctx.fillText(fit(t,max),flip?-(R-22*u):R-22*u,0);
        ctx.restore();
      });
      ctx.restore();
    }
    ctx.beginPath();ctx.arc(cx,cy,R,0,TAU);ctx.lineWidth=8*u;ctx.strokeStyle=css("--line-strong");ctx.stroke();
    ctx.beginPath();ctx.arc(cx,cy,46*u,0,TAU);ctx.fillStyle=css("--panel");ctx.fill();ctx.lineWidth=6*u;ctx.strokeStyle=css("--accent");ctx.stroke();
    ctx.beginPath();ctx.arc(cx,cy,14*u,0,TAU);ctx.fillStyle=css("--accent");ctx.fill();
    ctx.save();ctx.translate(cx,cy-R-6*u);ctx.rotate(tilt);
    ctx.beginPath();ctx.moveTo(-24*u,-14*u);ctx.lineTo(24*u,-14*u);ctx.lineTo(0,40*u);ctx.closePath();
    ctx.fillStyle=css("--accent");ctx.fill();ctx.lineWidth=5*u;ctx.strokeStyle=css("--ground");ctx.stroke();
    ctx.restore();
  }
  return{
    get busy(){return busy},
    set(list){if(busy)return;sl=list;paint()},
    paint,
    play(sp,done){
      sl=sp.sl;busy=true;
      const reduce=matchMedia("(prefers-reduced-motion:reduce)").matches,target=-sp.mid,start=angle,seg=TAU/sl.length;
      let end=target+TAU*Math.ceil((start-target)/TAU);if(!reduce)end+=TAU*8;
      const dur=reduce?300:sp.dur,t0=performance.now();let over=false;
      const finish=()=>{if(over)return;over=true;angle=((end%TAU)+TAU)%TAU;tilt=0;busy=false;paint();done&&done()};
      setTimeout(finish,dur+400);
      (function step(now){
        if(over)return;
        const k=Math.min(1,(now-t0)/dur),e=1-Math.pow(1-k,4),prev=angle;angle=start+(end-start)*e;
        const speed=Math.min(1,Math.abs(angle-prev)/.25),f=(((-angle)%seg)+seg)%seg/seg;
        tilt=sl.length>1&&!reduce?-Math.max(0,(f-.8)*5)*.45*Math.max(.25,speed):0;
        paint();if(k<1)requestAnimationFrame(step);else finish();
      })(performance.now());
    }
  };
}
