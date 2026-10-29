const FMT=new Intl.DateTimeFormat("es-AR",{day:"numeric",month:"short",year:"numeric"});
const grid=document.getElementById("grid"),q=document.getElementById("q"),empty=document.getElementById("empty");
const norm=s=>s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g,"");
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
function render(){
  const t=norm(q.value.trim());
  const list=(window.TOOLS||[]).filter(x=>!t||norm([x.nombre,x.descripcion,...(x.tags||[])].join(" ")).includes(t));
  grid.innerHTML=list.map(x=>{
    const at=ToolStore.savedAt(x.id);
    const saved=at?`<span class="saved">Datos guardados · ${FMT.format(at)}</span>`:"";
    return `<a class="tool" href="${esc(x.ruta)}"><h2>${esc(x.nombre)}</h2><p>${esc(x.descripcion)}</p>${saved}<div class="tags">${(x.tags||[]).map(g=>`<span class="tag">${esc(g)}</span>`).join("")}</div></a>`;
  }).join("");
  empty.hidden=list.length>0;
}
q.addEventListener("input",render);
render();
