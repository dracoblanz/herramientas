const SPR="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/";
const TYPES=[null,"Normal","Lucha","Volador","Veneno","Tierra","Roca","Bicho","Fantasma","Acero","Fuego","Agua","Planta","Eléctrico","Psíquico","Hielo","Dragón","Siniestro","Hada"];
const B=(ids,names)=>ids.map((id,i)=>({img:SPR+"badges/"+id+".png",n:names[i]}));
const T=ids=>ids.map(t=>({type:t,n:TYPES[t]}));
const REGIONS={
  kanto:{n:"Kanto",b:B([1,2,3,4,5,6,7,8],["Roca","Cascada","Trueno","Arcoíris","Alma","Pantano","Volcán","Tierra"])},
  johto:{n:"Johto",b:B([9,10,11,12,13,14,15,16],["Céfiro","Colmena","Llanura","Niebla","Tormenta","Mineral","Glaciar","Dragón"])},
  hoenn:{n:"Hoenn",b:B([17,18,19,20,21,22,23,24],["Piedra","Puño","Dinamo","Calor","Equilibrio","Pluma","Mente","Lluvia"])},
  sinnoh:{n:"Sinnoh",b:B([25,26,27,28,29,30,31,32],["Lignito","Bosque","Adoquín","Ciénaga","Reliquia","Mina","Carámbano","Faro"])},
  teselia:{n:"Teselia (Negro/Blanco)",b:B([33,34,35,36,37,38,39,40],["Trío","Base","Élitro","Voltio","Temblor","Jet","Iceberg","Leyenda"])},
  teselia2:{n:"Teselia (Negro 2/Blanco 2)",b:B([34,41,35,36,37,38,40,42],["Base","Toxina","Élitro","Voltio","Temblor","Jet","Leyenda","Ola"])},
  kalos:{n:"Kalos",b:B([43,44,45,46,47,48,49,50],["Insecto","Pared","Lucha","Planta","Voltio","Hada","Psique","Iceberg"])},
  alola:{n:"Alola (pruebas)",b:T([1,11,10,12,13,8,18])},
  galar:{n:"Galar",b:T([12,11,10,2,18,15,17,16])},
  paldea:{n:"Paldea",b:T([7,12,13,11,1,8,14,15])},
  ninguna:{n:"Sin medallas",b:[]}
};
const MODES={nuzlocke:"Nuzlocke",soullink:"Soul Link",locke:"Locke"};
const STYLES={pixel:"Pixel",animado:"Animado",home:"3D"};
const PID_RE=/^p[a-z0-9]{1,24}$/,MID_RE=/^m[a-z0-9]{1,24}$/;
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const norm=s=>String(s).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g,"").replace(/♀/g,"f").replace(/♂/g,"m").replace(/[^a-z0-9]/g,"");
const $=id=>document.getElementById(id);
const PD=window.PDATA||[];
const species=id=>PD[id]?PD[id][0]:"";
const typesOf=id=>PD[id]?PD[id].slice(1):[];
const BY_NAME=new Map(PD.map((d,i)=>d&&[norm(d[0]),i]).filter(Boolean));
const findMon=s=>BY_NAME.get(norm(s))||0;
const clampInt=(v,a,b,d)=>{const n=parseInt(v,10);return isFinite(n)?Math.min(b,Math.max(a,n)):d};
const str=(v,n)=>String(v==null?"":v).replace(/[\u0000-\u001f]/g,"").trim().slice(0,n);

function sprite(m,style){
  const id=m.p,sh=m.shiny?"shiny/":"";
  if(style==="animado")return SPR+"pokemon/other/showdown/"+sh+id+".gif";
  if(style==="home")return SPR+"pokemon/other/home/"+sh+id+".png";
  return SPR+"pokemon/"+sh+id+".png";
}
const spriteFallback=m=>SPR+"pokemon/"+(m.shiny?"shiny/":"")+m.p+".png";
function monImg(m,style,size,cls){return`<img class="${cls||"spr"} ${style==="home"?"smooth":""}" src="${sprite(m,style)}" data-fb="${spriteFallback(m)}" width="${size}" height="${size}" alt="" decoding="async">`}
function typeIcons(id){return typesOf(id).map(t=>`<span class="tp" style="background-image:url(${SPR}types/generation-ix/scarlet-violet/${t}.png)" title="${TYPES[t]}" role="img" aria-label="${TYPES[t]}"></span>`).join("")}
function badgeIcon(b,on){return b.img?`<img class="bd ${on?"on":""}" src="${b.img}" width="40" height="40" alt="" decoding="async">`:`<span class="bd tpb ${on?"on":""}" style="background-image:url(${SPR}types/generation-ix/scarlet-violet/${b.type}.png)"></span>`}
document.addEventListener("error",e=>{const t=e.target;if(t.tagName==="IMG"&&t.dataset.fb&&t.src!==t.dataset.fb){t.classList.remove("smooth");t.src=t.dataset.fb}},true);

function cleanMon(m){
  if(!m||typeof m!=="object")return null;
  const p=clampInt(m.p,1,1025,0);if(!p||!MID_RE.test(m.id))return null;
  return{id:m.id,p,nick:str(m.nick,20),lv:clampInt(m.lv,1,100,5),shiny:!!m.shiny,link:str(m.link,30),st:["team","box","dead"].includes(m.st)?m.st:"box",at:clampInt(m.at,0,9e15,0)};
}
function cleanState(s){
  s=s&&typeof s==="object"?s:{};
  const players=(Array.isArray(s.players)?s.players:[]).slice(0,6).filter(p=>p&&PID_RE.test(p.id)).map(p=>{
    const mons=(Array.isArray(p.mons)?p.mons:[]).slice(0,200).map(cleanMon).filter(Boolean);
    let t=0;mons.forEach(m=>{if(m.st==="team"&&++t>6)m.st="box"});
    return{id:p.id,name:str(p.name,24)||"Jugador",badges:clampInt(p.badges,0,255,0),mons};
  });
  return{title:str(s.title,40),mode:MODES[s.mode]?s.mode:"nuzlocke",region:REGIONS[s.region]?s.region:"kanto",attempt:clampInt(s.attempt,1,999,1),rules:String(s.rules==null?"":s.rules).slice(0,400).split("\n").map(r=>str(r,80)).map(r=>r.trim()).filter(Boolean).slice(0,6).join("\n"),style:STYLES[s.style]?s.style:"animado",sep:s.sep!==false,players};
}
const team=p=>p.mons.filter(m=>m.st==="team");
const dead=p=>p.mons.filter(m=>m.st==="dead");
const label=m=>m.nick||species(m.p);
const LINK_SVG=`<svg class="chain" width="28" height="28" viewBox="0 0 24 24" aria-hidden="true"><path d="M10 14a4 4 0 0 0 5.66 0l3-3a4 4 0 0 0-5.66-5.66l-1 1M14 10a4 4 0 0 0-5.66 0l-3 3a4 4 0 0 0 5.66 5.66l1-1" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="square"/></svg>`;
function linkGroups(st){
  const map=new Map();
  st.players.forEach((p,pi)=>p.mons.forEach(m=>{if(!m.link)return;const k=norm(m.link);if(!map.has(k))map.set(k,{link:m.link,by:new Array(st.players.length).fill(null)});const g=map.get(k);if(!g.by[pi]||m.st==="team")g.by[pi]=m}));
  return[...map.values()];
}
function composeState(data,pmap,prev){
  if(typeof data!=="string"||data.length>60000)return null;
  let s;try{s=JSON.parse(data)}catch(e){return null}
  if(s&&s.sep&&Array.isArray(s.players)){
    const pm=pmap&&typeof pmap==="object"?pmap:{};
    s.players=s.players.map(stub=>{const raw=stub&&pm[stub.id];if(typeof raw!=="string"||raw.length>40000)return stub;try{const p=JSON.parse(raw);return p&&p.id===stub.id?p:stub}catch(e){return stub}});
  }
  return cleanState(s);
}
const metaOf=s=>s;
