const $=id=>document.getElementById(id);
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const str=(v,n)=>String(v==null?"":v).replace(/[\u0000-\u001f]/g,"").trim().slice(0,n);
const clampInt=(v,a,b,d)=>{const n=parseInt(v,10);return isFinite(n)?Math.min(b,Math.max(a,n)):d};
const PID_RE=/^p[a-z0-9]{1,24}$/,MC_RE=/^[A-Za-z0-9_]{3,16}$/;
const FORMATS={single:"Eliminación directa",double:"Doble eliminación",groups:"Grupos + eliminación"};
const THEMES={violeta:["Violeta","#b37bff"],rosa:["Rosa","#ec4899"],azul:["Azul","#3b82f6"],oro:["Oro","#facc15"],rojo:["Rojo","#ef4444"]};
const DECOS={doble:"Marco doble",esquinas:"Esquinas",plano:"Plano",pokemon:"Pokémon"};
const TINTS=["#b37bff","#3b82f6","#ec4899","#facc15","#ef4444","#593d7f"];
const BYE=-1;
const nextPow2=n=>{let p=2;while(p<n)p*=2;return p};
function seedOrder(n){let a=[1];while(a.length<n){const m=a.length*2;a=a.flatMap(s=>[s,m+1-s])}return a}
function shuffle(a){a=a.slice();for(let i=a.length-1;i>0;i--){const j=crypto.getRandomValues(new Uint32Array(1))[0]%(i+1);[a[i],a[j]]=[a[j],a[i]]}return a}

function cleanT(s){
  s=s&&typeof s==="object"?s:{};
  const players=(Array.isArray(s.players)?s.players:[]).slice(0,64).filter(p=>p&&PID_RE.test(p.id)).map(p=>({id:p.id,name:str(p.name,24)||"Jugador",mc:!!p.mc}));
  const ids=new Set(players.map(p=>p.id));
  const draw=(Array.isArray(s.draw)?s.draw:[]).filter(id=>ids.has(id));
  const live=!!s.live&&draw.length===players.length&&draw.length>=2;
  const results={};
  if(live&&s.results&&typeof s.results==="object")for(const [k,v] of Object.entries(s.results))if(/^[A-Z0-9-]{1,16}$/.test(k)&&(v===0||v===1))results[k]=v;
  return{title:str(s.title,48),format:FORMATS[s.format]?s.format:"single",groupSize:clampInt(s.groupSize,3,8,4),advance:clampInt(s.advance,1,4,2),order:s.order==="seeds"?"seeds":"random",theme:THEMES[s.theme]?s.theme:"violeta",deco:DECOS[s.deco]?s.deco:"doble",players,draw:live?draw:[],live,results,focus:live&&typeof s.focus==="string"&&/^[A-Z0-9-]{1,16}$/.test(s.focus)?s.focus:""};
}

function buildElim(prefix,srcs,label){
  const n=nextPow2(Math.max(2,srcs.length)),pos=seedOrder(n),k=Math.log2(n),rounds=[];
  const at=s=>s<=srcs.length?srcs[s-1]:{bye:1};
  for(let r=0;r<k;r++){
    const cnt=n>>(r+1),row=[];
    for(let i=0;i<cnt;i++){
      const id=prefix+r+"-"+i;
      row.push(r===0?{id,a:at(pos[2*i]),b:at(pos[2*i+1])}:{id,a:{w:prefix+(r-1)+"-"+2*i},b:{w:prefix+(r-1)+"-"+(2*i+1)}});
    }
    rounds.push(row);
  }
  const names=rounds.map((_,r)=>{const left=k-r;return left===1?"Final":left===2?"Semifinal":left===3?"Cuartos":label+" · Ronda "+(r+1)});
  return{rounds,names,final:rounds[k-1][0].id,n,k};
}

function build(t){
  const P=t.draw.map(id=>t.players.find(p=>p.id===id));
  const M=new Map(),sections=[];
  const add=(sec,rounds,names)=>{rounds.forEach((row,ri)=>row.forEach((m,i)=>M.set(m.id,{...m,sec,ri,i})));sections.push({id:sec,rounds,names})};
  let champ=null,groups=[];
  if(t.format==="single"||t.format==="double"){
    const W=buildElim("W",P.map((_,i)=>({p:i})),"Ganadores");
    add(t.format==="double"?"Ganadores":"Llave",W.rounds,t.format==="double"?W.rounds.map((_,r)=>r===W.k-1?"Final de ganadores":"Ronda "+(r+1)):W.names);
    if(t.format==="single")champ={w:W.final};
    else{
      const L=[];const k=W.k,n=W.n;
      if(k>=2){
        L.push(Array.from({length:n/4},(_,i)=>({id:"L0-"+i,a:{l:"W0-"+2*i},b:{l:"W0-"+(2*i+1)}})));
        for(let r=1;r<k;r++){
          const cnt=n>>(r+1),prev=L.length-1,lr=L.length;
          L.push(Array.from({length:cnt},(_,i)=>({id:"L"+lr+"-"+i,a:{w:"L"+prev+"-"+i},b:{l:"W"+r+"-"+(r%2?cnt-1-i:i)}})));
          if(r<k-1){const c2=cnt/2,lr2=L.length;L.push(Array.from({length:c2},(_,i)=>({id:"L"+lr2+"-"+i,a:{w:"L"+lr+"-"+2*i},b:{w:"L"+lr+"-"+(2*i+1)}})))}
        }
        add("Perdedores",L,L.map((_,r)=>r===L.length-1?"Final de perdedores":"Ronda "+(r+1)));
        const lf="L"+(L.length-1)+"-0";
        const F=[[{id:"F1-0",a:{w:W.final},b:{w:lf}}]];
        if(t.results["F1-0"]===1)F.push([{id:"F2-0",a:{w:"F1-0"},b:{l:"F1-0"}}]);
        add("Gran final",F,F.length>1?["Gran final","Revancha"]:["Gran final"]);
        champ=t.results["F1-0"]===1?{w:"F2-0"}:{w:"F1-0"};
      }else champ={w:W.final};
    }
  }else{
    const G=Math.max(1,Math.round(P.length/t.groupSize));
    groups=Array.from({length:G},()=>[]);
    P.forEach((_,i)=>{const r=Math.floor(i/G),g=r%2?G-1-i%G:i%G;groups[g].push(i)});
    groups.forEach((gp,g)=>{
      const L="G"+String.fromCharCode(65+g);
      gp.forEach((a,x)=>gp.forEach((b,y)=>{if(y>x)M.set(L+"-"+x+"-"+y,{id:L+"-"+x+"-"+y,a:{p:a},b:{p:b},sec:"Grupos",g,ri:0,i:0})}));
    });
    const adv=Math.min(t.advance,...groups.map(g=>g.length)),q=[];
    const partner=g=>G%2===0?g^1:(g+1)%G;
    for(let r=0;r<adv;r++){let row=groups.map((_,g)=>g);if(r===1){row=[];groups.forEach((_,g)=>{row[G-1-g]=partner(g)})}else if(r>1)row=row.map(g=>(g+r)%G);row.forEach(g=>q.push({q:g,rank:r}))}
    if(q.length>=2){const E=buildElim("E",q,"Final");add("Llave final",E.rounds,E.names);champ={w:E.final}}
  }
  return{P,M,sections,groups,champ};
}

function solver(t,B){
  const memo=new Map();
  const standings=g=>{
    const gp=B.groups[g],L="G"+String.fromCharCode(65+g),w=new Map(gp.map(i=>[i,0]));let done=true;const h=new Map();
    gp.forEach((a,x)=>gp.forEach((b,y)=>{if(y<=x)return;const r=t.results[L+"-"+x+"-"+y];if(r==null){done=false;return}const win=r?b:a;w.set(win,w.get(win)+1);h.set(a+"|"+b,win);h.set(b+"|"+a,win)}));
    const rows=gp.slice().sort((a,b)=>w.get(b)-w.get(a)||(h.get(a+"|"+b)===a?-1:h.get(a+"|"+b)===b?1:0)||gp.indexOf(a)-gp.indexOf(b));
    return{rows,w,done,played:[...gp.keys()].length};
  };
  const res=s=>{
    if(!s)return null;
    if(s.bye)return BYE;
    if(s.p!=null)return s.p;
    if(s.q!=null){const st=standings(s.q);return st.done?st.rows[s.rank]:null}
    const o=out(s.w||s.l);if(!o)return null;return s.w?o.w:o.l;
  };
  const out=id=>{
    if(memo.has(id))return memo.get(id);
    const m=B.M.get(id);let o=null;
    if(m){
      const a=res(m.a),b=res(m.b);
      if(a===BYE&&b===BYE)o={w:BYE,l:BYE,auto:1};
      else if(a===BYE&&b!=null)o={w:b,l:BYE,auto:1};
      else if(b===BYE&&a!=null)o={w:a,l:BYE,auto:1};
      else if(a!=null&&b!=null&&a!==BYE&&b!==BYE){const r=t.results[id];if(r!=null)o={w:r?b:a,l:r?a:b,side:r}}
    }
    memo.set(id,o);return o;
  };
  return{res,out,standings,champion:()=>{if(!B.champ)return null;const o=out(B.champ.w);return o&&o.w>=0?o.w:null}};
}

function dependents(B,id){
  const out=new Set([id]);let grew=true;
  const g=/^G([A-Z])-/.exec(id);
  while(grew){grew=false;for(const m of B.M.values()){if(out.has(m.id))continue;for(const s of [m.a,m.b]){if((s.w&&out.has(s.w))||(s.l&&out.has(s.l))||(g&&s.q===g[1].charCodeAt(0)-65)){out.add(m.id);grew=true;break}}}}
  return out;
}

function avatar(p,size){
  if(!p)return`<span class="av empty" style="width:${size}px;height:${size}px"></span>`;
  if(p.mc)return`<img class="av mc" src="https://mc-heads.net/avatar/${encodeURIComponent(p.name.replace(/\s+/g,""))}/${size*2}" width="${size}" height="${size}" alt="" decoding="async">`;
  let h=0;for(const c of p.name)h=(h*31+c.charCodeAt(0))>>>0;
  const ini=p.name.split(/\s+/).map(w=>w[0]).join("").slice(0,2).toUpperCase();
  return`<span class="av ini" style="width:${size}px;height:${size}px;background:${TINTS[h%TINTS.length]};font-size:${Math.round(size*.42)}px">${esc(ini)}</span>`;
}

function slotHTML(B,S,m,side,t){
  const v=S.res(side?m.b:m.a),o=S.out(m.id);
  if(v===BYE)return`<div class="sl bye"><span class="av empty"></span><b>Libre</b></div>`;
  if(v==null)return`<div class="sl tbd"><span class="av empty"></span><b>Por definir</b></div>`;
  const p=B.P[v],st=o?(o.w===v?"win":"lose"):"";
  return`<div class="sl ${st}" data-pid="${p.id}">${avatar(p,28)}<b>${esc(p.name)}</b>${st==="win"?`<i class="mk" aria-label="ganó"></i>`:""}</div>`;
}

function renderBracket(el,t,B,S,opts){
  const champ=S.champion();
  let h="";
  if(t.format==="groups")h+=`<section class="sec"><h3>Grupos</h3><div class="groups">${B.groups.map((gp,g)=>{
    const st=S.standings(g),L="G"+String.fromCharCode(65+g),adv=Math.min(t.advance,gp.length);
    const ms=[];gp.forEach((a,x)=>gp.forEach((b,y)=>{if(y>x)ms.push(B.M.get(L+"-"+x+"-"+y))}));
    return`<div class="grp"><h4>Grupo ${String.fromCharCode(65+g)}</h4><ol class="tbl">${st.rows.map((i,r)=>`<li class="${st.done&&r<adv?"q":""}">${avatar(B.P[i],22)}<b>${esc(B.P[i].name)}</b><span>${st.w.get(i)}</span></li>`).join("")}</ol><div class="gms">${ms.map(m=>`<button class="mt sm ${S.out(m.id)?"done":""} ${t.focus===m.id?"focus":""}" type="button" data-m="${m.id}" ${opts.click?"":"tabindex=\"-1\""}>${slotHTML(B,S,m,0,t)}${slotHTML(B,S,m,1,t)}</button>`).join("")}</div></div>`}).join("")}</div></section>`;
  for(const sec of B.sections){
    h+=`<section class="sec" data-sec="${esc(sec.id)}">${B.sections.length>1||t.format==="groups"?`<h3>${esc(sec.id)}</h3>`:""}<div class="cols">${sec.rounds.map((row,r)=>`<div class="col"><span class="rn">${esc(sec.names[r])}</span><div class="ms">${row.map(m=>{
      const o=S.out(m.id),bye=o&&o.auto;
      return`<button class="mt ${o?"done":""} ${bye?"isbye":""} ${t.focus===m.id?"focus":""}" type="button" data-m="${m.id}" ${opts.click&&!bye?"":"tabindex=\"-1\""}>${slotHTML(B,S,m,0,t)}${slotHTML(B,S,m,1,t)}</button>`}).join("")}</div></div>`).join("")}</div><svg class="lines" aria-hidden="true"></svg></section>`;
  }
  if(champ!=null)h+=`<section class="champ" aria-live="polite">${avatar(B.P[champ],72)}<div><span>Campeón</span><b>${esc(B.P[champ].name)}</b></div></section>`;
  el.innerHTML=h;
  requestAnimationFrame(()=>drawLines(el,B,S));
}

function drawLines(el,B,S){
  el.querySelectorAll(".sec[data-sec]").forEach(sec=>{
    const svg=sec.querySelector(".lines"),box=sec.getBoundingClientRect(),k=box.width/sec.offsetWidth||1;
    svg.setAttribute("width",sec.scrollWidth);svg.setAttribute("height",sec.scrollHeight);
    let d="",dw="";
    sec.querySelectorAll(".mt[data-m]").forEach(btn=>{
      const m=B.M.get(btn.dataset.m);if(!m)return;
      [m.a,m.b].forEach((s,side)=>{
        if(!s||!s.w)return;const src=sec.querySelector(`.mt[data-m="${s.w}"]`);if(!src)return;
        const a=src.getBoundingClientRect(),b=btn.getBoundingClientRect();
        const x1=(a.right-box.left)/k,y1=(a.top+a.height/2-box.top)/k,x2=(b.left-box.left)/k,y2=(b.top+b.height*(side?.75:.25)-box.top)/k,xm=(x1+x2)/2;
        const seg=`M${x1} ${y1}H${xm}V${y2}H${x2}`;
        const o=S.out(s.w);if(o&&o.w>=0)dw+=seg;else d+=seg;
      });
    });
    svg.innerHTML=`<path d="${d}" class="ln"/><path d="${dw}" class="ln on"/>`;
  });
}
