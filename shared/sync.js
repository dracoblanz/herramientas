(function(){
  const SDK="https://www.gstatic.com/firebasejs/10.12.2/";
  const SRI={
    app:"sha384-AQ3POAMqIhwS81FrUH95ekxqBZHeP5tG2JfEL3+7GuTtfRLWnrRh32UxwzM+//A9",
    database:"sha384-1/m+A1jVWbD3yiK3/vtFvm1+LjK1WLpSoDY+Kaxppwn/yP9BVSgdHTNQVOjrzUO5",
    auth:"sha384-TnlRYaR4JYz/lpaGuaiU61PjNberSA4vjLjtF+oRC/IkohkJqnWxw5EmDSOt1vA1",
    "app-check":"sha384-E3vxFxXu8FhW5kvqdQJ5Yf8ugrV7iCJP8jgnItRH2Rk8Q08cJzJGTi/oMC3FEp3j"
  };
  const cfg=()=>window.FIREBASE_CONFIG||{};
  const loaded={};
  function load(mod){
    if(!loaded[mod])loaded[mod]=new Promise((ok,ko)=>{
      const s=document.createElement("script");
      s.src=SDK+"firebase-"+mod+"-compat.js";s.integrity=SRI[mod];s.crossOrigin="anonymous";s.referrerPolicy="no-referrer";
      s.onload=ok;s.onerror=()=>{delete loaded[mod];s.remove();ko(new Error("No se pudo cargar Firebase. Revisa tu conexión y vuelve a intentar."))};
      document.head.appendChild(s);
    });
    return loaded[mod];
  }
  let appp=null;
  function app(){
    if(!appp)appp=(async()=>{
      const c=cfg();
      if(!window.firebase||!firebase.initializeApp)await load("app");
      const a=firebase.apps.length?firebase.app():firebase.initializeApp({apiKey:c.apiKey,authDomain:c.authDomain,databaseURL:c.databaseURL,projectId:c.projectId,appId:c.appId});
      if(c.appCheckKey){await load("app-check");firebase.appCheck().activate(new firebase.appCheck.ReCaptchaEnterpriseProvider(c.appCheckKey),true)}
      return a;
    })().catch(e=>{appp=null;throw e});
    return appp;
  }
  async function db(){const a=await app();if(!firebase.database)await load("database");return a.database()}
  async function auth(){const a=await app();if(!firebase.auth)await load("auth");return a.auth()}
  const clean=s=>String(s||"").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g,"").replace(/[^a-z0-9_-]+/g,"-").replace(/^-+|-+$/g,"").slice(0,32);
  const mailKey=m=>{const s=String(m||"").trim().toLowerCase();return/^[^\s@.$#\[\]\/,][^\s@$#\[\]\/,]{0,63}@[^\s@$#\[\]\/,]+\.[a-z]{2,}$/.test(s)&&s.length<=120?s.replace(/\./g,","):""};
  window.ToolSync={
    ready(){const c=cfg();return!!(c.apiKey&&c.databaseURL&&c.ownerUid)},
    clean,
    isOwner(user){return!!(user&&user.uid&&user.uid===cfg().ownerUid)},
    async onUser(cb){const a=await auth();return a.onAuthStateChanged(u=>cb(u?{uid:u.uid,name:u.displayName||u.email||"",email:u.emailVerified===false?"":String(u.email||"").toLowerCase()}:null))},
    async signIn(){
      const a=await auth(),p=new firebase.auth.GoogleAuthProvider();
      p.setCustomParameters({prompt:"select_account"});
      await a.signInWithPopup(p);
    },
    async signOut(){const a=await auth();await a.signOut()},
    mailKey,
    async hasAccess(user){
      if(!user)return false;
      if(this.isOwner(user))return true;
      if(!user.email)return false;
      const d=await db();
      try{return(await d.ref("acceso/"+mailKey(user.email)).get()).val()===true}
      catch(e){if(/permission/i.test(String(e&&(e.code||e.message))))return false;throw e}
    },
    async canEditRooms(user,tool){
      if(!user)return false;
      if(this.isOwner(user))return true;
      if(!user.email)return false;
      const d=await db();
      try{return(await d.ref("editores/"+mailKey(user.email)+"/"+tool).get()).val()===true}
      catch(e){return false}
    },
    async listEditors(){const d=await db(),v=(await d.ref("editores").get()).val()||{},out={};for(const [k,x] of Object.entries(v))if(x&&typeof x==="object")out[k.replace(/,/g,".")]=Object.keys(x).filter(t=>x[t]===true);return out},
    async setEditor(email,tool,on){const k=mailKey(email);if(!k||!/^[a-z0-9-]{1,24}$/.test(tool))throw new Error("Dato inválido");const d=await db();await d.ref("editores/"+k+"/"+tool).set(on?true:null)},
    async listAccess(){const d=await db(),v=(await d.ref("acceso").get()).val()||{};return Object.keys(v).filter(k=>v[k]===true).map(k=>k.replace(/,/g,".")).sort()},
    async setAccess(email,on){const k=mailKey(email);if(!k)throw new Error("Correo inválido");const d=await db();await d.ref("acceso/"+k).set(on?true:null);if(!on)await d.ref("editores/"+k).set(null)},
    async join(sala,tool){
      const name=clean(sala);
      if(!name)throw new Error("Nombre de sala inválido");
      const d=await db(),base=d.ref("salas/"+name+"/"+tool),offs=[];
      const at=p=>p?base.child(p):base;
      return{
        name,
        on(p,cb){const r=at(p),f=s=>cb(s.val());r.on("value",f);offs.push(()=>r.off("value",f))},
        once(p){return at(p).get().then(s=>s.val())},
        set(p,v){return at(p).set(v)},
        remove(p){return at(p).remove()},
        connected(cb){const r=d.ref(".info/connected"),f=s=>cb(!!s.val());r.on("value",f);offs.push(()=>r.off("value",f))},
        leave(){offs.splice(0).forEach(f=>f())}
      };
    }
  };
})();
