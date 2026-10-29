(function(){
  const PREFIX="herramientas:";
  const k=ns=>PREFIX+ns;
  window.ToolStore={
    load(ns,fallback){
      try{const v=localStorage.getItem(k(ns));return v?JSON.parse(v):fallback}catch(e){return fallback}
    },
    save(ns,data){
      try{localStorage.setItem(k(ns),JSON.stringify(data));localStorage.setItem(k(ns)+":at",new Date().toISOString());return true}catch(e){return false}
    },
    clear(ns){
      try{localStorage.removeItem(k(ns));localStorage.removeItem(k(ns)+":at")}catch(e){}
    },
    has(ns){
      try{return localStorage.getItem(k(ns))!==null}catch(e){return false}
    },
    savedAt(ns){
      try{const v=localStorage.getItem(k(ns)+":at");return v?new Date(v):null}catch(e){return null}
    },
    exportFile(ns){
      const body={herramienta:ns,guardado:new Date().toISOString(),datos:this.load(ns,null)};
      const blob=new Blob([JSON.stringify(body,null,2)],{type:"application/json"});
      const a=document.createElement("a");
      a.href=URL.createObjectURL(blob);
      a.download=ns+"-"+new Date().toISOString().slice(0,10)+".json";
      document.body.appendChild(a);a.click();a.remove();
      setTimeout(()=>URL.revokeObjectURL(a.href),2000);
    },
    async importFile(ns,file){
      const json=JSON.parse(await file.text());
      const data=json&&json.datos!==undefined?json.datos:json;
      this.save(ns,data);
      return data;
    }
  };
})();
