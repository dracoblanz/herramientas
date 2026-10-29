const $=id=>document.getElementById(id);
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const APPS=(window.TOOLS||[]).map(x=>[x.id,x.nombre]);
let mails=[],eds={},ask="",busy=false,loaded=false;

function say(t,bad){$("msg").textContent=t;$("msg").classList.toggle("bad",!!bad)}

function render(){
  $("count").textContent=loaded?"· "+mails.length:"";
  $("empty").hidden=!loaded||mails.length>0;
  $("list").innerHTML=mails.map(m=>`<li><span>${esc(m)}</span><fieldset class="eds"><legend>Puede editar</legend>${APPS.map(([id,n])=>`<label class="ed"><input type="checkbox" data-e="${esc(m)}" data-t="${id}" ${(eds[m]||[]).includes(id)?"checked":""} ${busy?"disabled":""}> ${esc(n)}</label>`).join("")}</fieldset><button class="btn sm ${ask===m?"warn":""}" type="button" data-m="${esc(m)}" ${busy?"disabled":""}>${ask===m?"¿Quitar? Confirmar":"Quitar"}</button></li>`).join("");
  $("list").querySelectorAll("[data-m]").forEach(b=>b.onclick=()=>remove(b.dataset.m));
  $("list").querySelectorAll("[data-e]").forEach(c=>c.onchange=()=>editor(c.dataset.e,c.dataset.t,c.checked));
  $("addBtn").disabled=busy;
}

async function load(){
  try{const[a,e]=await Promise.all([ToolSync.listAccess(),ToolSync.listEditors()]);mails=a;eds=e;loaded=true;render()}
  catch(e){say("No se pudo cargar la lista. Recarga la página.",true)}
}

async function remove(m){
  if(ask!==m){ask=m;render();return}
  busy=true;ask="";render();
  try{await ToolSync.setAccess(m,false);mails=mails.filter(x=>x!==m);delete eds[m];say(m+" ya no tiene acceso.")}
  catch(e){say("No se pudo quitar. Vuelve a intentar.",true)}
  busy=false;render();
}

async function editor(m,tool,on){
  busy=true;render();
  const n=(APPS.find(a=>a[0]===tool)||[tool,tool])[1];
  try{await ToolSync.setEditor(m,tool,on);const s=new Set(eds[m]||[]);on?s.add(tool):s.delete(tool);eds[m]=[...s];say(on?m+" ya puede editar en "+n+".":m+" ya no puede editar en "+n+".")}
  catch(e){say("No se pudo cambiar. Vuelve a intentar.",true)}
  busy=false;render();
}

$("add").onsubmit=async e=>{
  e.preventDefault();
  const m=$("mail").value.trim().toLowerCase();
  if(!ToolSync.mailKey(m)){say("Escribe un correo válido, por ejemplo nombre@gmail.com.",true);$("mail").focus();return}
  if(mails.includes(m)){say(m+" ya tiene acceso.");return}
  busy=true;render();
  try{await ToolSync.setAccess(m,true);mails=[...mails,m].sort();$("mail").value="";say(m+" ya puede entrar.")}
  catch(e){say("No se pudo guardar. Vuelve a intentar.",true)}
  busy=false;render();
};

$("out").onclick=()=>ToolSync.signOut();
document.addEventListener("click",e=>{if(ask&&!e.target.closest("[data-m]")){ask="";render()}});
if(ToolSync.ready())ToolSync.onUser(u=>{$("who").textContent=u?u.email||u.name:"";if(ToolSync.isOwner(u)&&!loaded)load()}).catch(()=>{});
