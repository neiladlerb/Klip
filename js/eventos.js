/* KLIP: eventos de la interfaz y arranque */
"use strict";
/* Eventos */
/* Lee un selector de persona sin tocar los datos: devuelve {id}, {id,vincula}, {crear} o {err} */
function leerPersona(x,rol){
  const g=k=>{const e=document.getElementById(x+k);return e?e.value.trim():""};
  const sel=g("sel");
  if(sel==="none")return {id:null};
  if(sel!=="new")return {id:sel};
  const em=g("em").toLowerCase(),nom=g("nom"),quien=rol==="tenant"?"del arrendatario":"del propietario";
  if(em&&!emailValido(em))return {err:"El correo "+quien+" no tiene un formato válido."};
  if(rol==="tenant"&&!em)return {err:"Escribe el correo del arrendatario. Con él se vincula su cuenta o se le crea una."};
  if(em){const u=S.users.find(x=>x.email.toLowerCase()===em);
    if(u){if(u.role!==rol)return {err:"Ese correo ya pertenece a una cuenta de "+ROLES[u.role].toLowerCase()+"."};return {id:u.actorId,vincula:u}}}
  if(!nom)return {err:em?"No hay ninguna cuenta con ese correo. Escribe el nombre "+quien+" para crearla.":"Escribe el nombre "+quien+"."};
  return {crear:{nombre:nom,email:em}};
}
/* Ejecuta el plan de leerPersona: crea la ficha y, si hay correo, la cuenta con contraseña temporal */
async function crearPersona(plan,rol){
  if(!plan.crear)return {id:plan.id};
  const id=(rol==="tenant"?"t":"o")+uid("n"),c=plan.crear;
  if(rol==="tenant")S.tenants.push({id,nombre:c.nombre,desde:todayISO(),wa:""});else S.owners.push({id,nombre:c.nombre,wa:""});
  if(!c.email)return {id};
  const pw=tempPw(),u={id:uid("u"),nombre:c.nombre,email:c.email,role:rol,actorId:id,hash:await hashPw(pw),activo:true,bloqueado:false,intentos:0,ultimo:null,cambiar:true,wa:""};
  S.users.push(u);return {id,nuevo:{u,pw}};
}
const sig=()=>{const u=cur();return {nombre:u.nombre,rol:ROLES[u.role],fecha:nowISO()}};
document.addEventListener("click",async e=>{
  const el=e.target.closest("[data-act]");if(!el)return;
  const a=el.dataset.act;
  if(a==="scrim"){if(e.target===el)closeModal();return}
  switch(a){
    case "gologin":{if(cur()){ui.screen="app";ui.tab=ui.tab||TABS[role()][0][0];render();break}ui.loginErr="";ui.screen="login";render();window.scrollTo(0,0);document.getElementById("lemail").focus();break;}
    case "goreg":{if(cur()){ui.screen="app";ui.tab=ui.tab||TABS[role()][0][0];render();break}ui.regHint=el.dataset.hint||"tenant";ui.regErr="";ui.screen="register";render();window.scrollTo(0,0);break;}
    case "fill":ui.loginEmail=el.dataset.email;ui.loginErr="";render();document.getElementById("lpass").focus();break;
    case "home":ui.screen="landing";render();window.scrollTo(0,0);break;
    case "logout":log("Cierre de sesión","",sessUser()?sessUser().nombre:"");save();ui.uid=null;ui.asUid=null;ui.asBo=false;clearSession();ui.screen="landing";render();window.scrollTo(0,0);toast("Sesión cerrada");break;
    case "tab":ui.tab=el.dataset.tab;ui.q="";ui.admSel=null;closeModal();render();if(ui.tab==="mensajes"){let ch=false;S.msgs.forEach(m=>{if(m.to===meActor()&&!m.read){m.read=true;ch=true}});if(ch)save();}window.scrollTo(0,0);break;
    case "filter":ui.filter=el.dataset.f;render();break;
    case "repf":ui.repFilter=el.dataset.v;render();break;
    case "close":closeModal();break;
    case "detail":mDetail(el.dataset.id);break;
    case "ficha":mFicha(el.dataset.id);break;
    case "acta":mActa(el.dataset.id);break;
    case "pay":mPay(el.dataset.items);break;
    case "confirmpay":doPay();break;
    case "contract":mContract(el.dataset.id);break;
    case "profile":mProfile();break;
    case "saveprof":{const u=sessUser(),w=document.getElementById("pfwa").value.trim();u.wa=w;setWa(u.actorId,w);log("Perfil","WhatsApp actualizado");save();closeModal();render();toast("Perfil guardado");break;}
    case "newrep":mNewRep(el.dataset.id,el.dataset.prov);break;
    case "saverep":{const f=document.getElementById("repform");if(!f.reportValidity())return;const p=prop(f.dataset.id),d=document.getElementById("rdesc").value.trim(),c=Number(document.getElementById("rcuotas").value),cat=document.getElementById("rcat").value,pv=document.getElementById("rprov").value||null;
      S.repairs.push({id:uid("r"),propId:p.id,tenantId:p.tenantId,cat,desc:d,provId:pv,monto:Number(document.getElementById("rmonto").value),cuotas:c,estado:"solicitada",fecha:todayISO(),aprobProp:null,conformArr:null,inicioDesc:null,descontadas:0,rating:null});
      S.msgs.push({id:uid("m"),from:p.tenantId,to:p.ownerId,text:"Nueva solicitud de reparación ("+cat+"): "+d,fecha:todayISO(),read:false,canal:"plataforma"});log("Reparación","Solicitud en "+p.dir+": "+d);save();closeModal();if(role()==="tenant")ui.tab="reparaciones";ui.repFilter="activas";render();toast("Solicitud enviada al propietario y a la administradora");break;}
    case "approve":if(!ui.asUid)mApprove(el.dataset.id);break;
    case "doapprove":{if(ui.asUid){toast("No se pueden firmar actas en nombre de otro usuario");return}const r=byId(S.repairs,el.dataset.id);const n=Number(document.getElementById("acuotas").value),m=Number(document.getElementById("amonto").value);if(!(m>0)){toast("Indica un monto válido");return}
      r.cuotas=n;r.monto=m;r.provId=document.getElementById("aprov").value||r.provId;r.estado="aprobada";r.aprobProp=Object.assign(sig(),role()==="admin"?{mandato:true}:{});
      S.msgs.push({id:uid("m"),from:meActor(),to:r.tenantId,text:"Aprobé la reparación \""+r.desc+"\" por "+clp(m)+" en "+n+(n===1?" cuota":" cuotas")+". Cuando el trabajo esté listo, confirma tu conformidad en KLIP para que empiece el descuento.",fecha:todayISO(),read:false,canal:"plataforma"});
      log("Reparación aprobada",r.desc+", "+clp(m)+" en "+n+" cuotas");save();closeModal();render();toast("Aprobada. Falta la conformidad del arrendatario");break;}
    case "doconf":{if(ui.asUid){toast("No se pueden firmar actas en nombre de otro usuario");return}const r=byId(S.repairs,el.dataset.id);r.conformArr=sig();r.estado="conforme";r.inicioDesc=S.periodo.ym;r.rating=Number(document.getElementById("crat").value);const p=prop(r.propId);
      S.msgs.push({id:uid("m"),from:r.tenantId,to:p.ownerId,text:"Confirmé que la reparación \""+r.desc+"\" quedó bien. El descuento de "+clp(cuota(r))+" empieza este mes.",fecha:todayISO(),read:false,canal:"plataforma"});
      log("Reparación conforme",r.desc+", acta firmada por ambas partes");save();closeModal();render();toast("Acta firmada por ambas partes. El descuento ya está en tu cobro");break;}
    case "reject":{if(ui.asUid){toast("No se pueden firmar actas en nombre de otro usuario");return}const r=byId(S.repairs,el.dataset.id);r.estado="rechazada";S.msgs.push({id:uid("m"),from:meActor(),to:r.tenantId,text:"No aprobamos la reparación \""+r.desc+"\". Escríbenos para revisarla.",fecha:todayISO(),read:false,canal:"plataforma"});log("Reparación rechazada",r.desc);save();closeModal();render();toast("Solicitud rechazada y arrendatario notificado");break;}
    case "compose":if(contacts().includes(el.dataset.to))mCompose(el.dataset.to);break;
    case "sendc":{const f=document.getElementById("cform"),t=document.getElementById("ctext");if(!t.value.trim()){t.focus();return}S.msgs.push({id:uid("m"),from:meActor(),to:f.dataset.to,text:t.value.trim(),fecha:todayISO(),read:false,canal:"plataforma"});save();closeModal();render();toast("Mensaje enviado a "+nombreActor(f.dataset.to));break;}
    case "cwa":{const f=document.getElementById("cform"),t=document.getElementById("ctext").value.trim();mWhatsApp(f.dataset.to,t);break;}
    case "wafromform":{const to=document.getElementById("mto").value,t=document.getElementById("mtext").value.trim();mWhatsApp(to,t);break;}
    case "wa":{if(el.dataset.prov){const pv=provById(el.dataset.prov);mWhatsApp(null,"Hola "+pv.nombre.split(" ")[0]+", te escribo desde KLIP. Necesito un presupuesto de "+pv.cat.toLowerCase()+".",{prov:pv})}else{const p=el.dataset.pid?prop(el.dataset.pid):null;const to=el.dataset.to;mWhatsApp(to,to&&to[0]==="t"&&p?fillTpl(p):"Hola "+nombreActor(to).split(" ")[0]+", te escribo desde KLIP"+(p?" por "+p.dir:"")+".")}break;}
    case "wasent":{const f=document.getElementById("waform");const num=document.getElementById("wanum").value.trim(),text=document.getElementById("watext").value.trim();
      el.href=waUrl(num,text);
      if(f.dataset.prov){const pv=provById(f.dataset.prov);if(pv&&num){const n=(S.provNew||[]).find(x=>x.id===pv.id);if(n)n.wa=num;else{S.provWa=S.provWa||{};S.provWa[pv.id]=num;pv.wa=num}}log("WhatsApp","Conversación abierta con proveedor "+pv.nombre)}
      else if(f.dataset.to){if(num)setWa(f.dataset.to,num);S.msgs.push({id:uid("m"),from:meActor(),to:f.dataset.to,text,fecha:todayISO(),read:true,canal:"whatsapp"});log("WhatsApp","Conversación abierta con "+nombreActor(f.dataset.to))}
      save();setTimeout(()=>{closeModal();render();toast("WhatsApp abierto. La conversación quedó registrada")},60);break;}
    case "setwa":mWhatsApp(el.dataset.id,"Hola "+nombreActor(el.dataset.id).split(" ")[0]+", te escribimos de KLIP.");break;
    case "remind":{const p=prop(el.dataset.id),t=tenantOf(p);const text=fillTpl(p);S.msgs.push({id:uid("m"),from:p.adminId,to:t.id,text,fecha:todayISO(),read:false,canal:"plataforma"});log("Recordatorio de cobro",t.nombre+", "+p.dir);save();render();mWhatsApp(t.id,text);toast("Recordatorio enviado en la plataforma");break;}
    case "manual":mManual(el.dataset.id);break;
    case "domanual":{const f=document.getElementById("manform");if(!f.reportValidity())return;const p=prop(f.dataset.id),tot=aPagarArriendo(p),m=Math.round(Number(document.getElementById("manmonto").value)),md=document.getElementById("manmedio").value,err=document.getElementById("manerr");
      if(p.paid||!tot){closeModal();toast("Este arriendo ya está pagado");break}
      if(!(m>0)||m>tot){err.innerHTML=`<div class="err">El monto debe ser mayor que cero y no superar ${clp(tot)}.</div>`;return}
      if(m===tot){payArriendo(p,md+" (registro manual)");log("Pago manual",clp(m)+" con "+md+" en "+p.dir)}
      else{const hoy=todayISO();S.hist.push({id:uid("h"),f:hoy,ym:S.periodo.ym,p:p.id,t:p.tenantId,c:"A",m,md:md+" (abono manual)",d:0,r:null});p.abono=(p.abono||0)+m;p.lastPay=hoy;log("Abono manual",clp(m)+" con "+md+" en "+p.dir+", queda "+clp(tot-m))}
      save();closeModal();render();toast(m===tot?"Pago de "+clp(m)+" registrado":"Abono de "+clp(m)+" registrado. Queda "+clp(tot-m));break;}
    case "newprop":mNewProp();break;
    case "saveprop":{const f=document.getElementById("pform");if(!f.reportValidity())return;const v=id=>document.getElementById(id).value.trim(),err=document.getElementById("perr");
      const po=leerPersona("po","owner"),pt=leerPersona("pt","tenant"),e1=po.err||pt.err;if(e1){err.innerHTML=`<div class="err">${esc(e1)}</div>`;return}
      const nIdx=S.props.length+1,id="P"+pad3(nIdx)+uid("").slice(0,3),code="C:"+pad3(nIdx);
      const o=await crearPersona(po,"owner"),t=await crearPersona(pt,"tenant"),oid=o.id,tid=t.id;
      if(tid&&!S.props.some(x=>x.tenantId===tid)){const tt=byId(S.tenants,tid);if(tt)tt.desde=todayISO()}
      const mon=v("pmon"),hoy=todayISO(),adm=role()==="admin"?meActor():"a1",A=byId(S.administradoras,adm);
      S.props.push({id,code,adminId:adm,dir:v("pdir"),comuna:v("pcom"),ciudad:A?A.ciudad:"Santiago",ownerId:oid,tenantId:tid,moneda:mon,monto:Number(v("pmonto")),reajuste:{tipo:mon==="UF"?"UF":"IPC",periodo:Number(v("pper")),ultimo:hoy},inicio:hoy,garantia:Number(v("pmonto")),gc:{comunidad:v("pgc")||"Sin comunidad",monto:Number(v("pgcm")||0)},desc:"Por completar",valorUF:Number(v("pval")||0),alta:S.periodo.ym,paid:false,deuda:0,abono:0,gcPaid:false,gcDeuda:0,lastPay:null,vacioDesde:tid?null:S.periodo.ym,tenancias:tid?[{tid,desde:S.periodo.ym,hasta:null}]:[]});
      log("Propiedad creada",code+" "+v("pdir"));
      if(po.vincula)log("Cuenta vinculada","Propietario "+po.vincula.email+" en "+code);
      if(pt.vincula)log("Cuenta vinculada","Arrendatario "+pt.vincula.email+" en "+code);
      if(tid)S.msgs.push({id:uid("m"),from:adm,to:tid,text:"Te damos la bienvenida a "+v("pdir")+". Desde ahora puedes pagar tu arriendo y tus gastos comunes en KLIP.",fecha:hoy,read:false,canal:"plataforma"});
      save();closeModal();render();
      const nuevos=[o.nuevo,t.nuevo].filter(Boolean);
      if(nuevos.length)showTemp(nuevos,nuevos.length===1?"Cuenta creada":"Cuentas creadas");else toast("Propiedad "+code+" creada");break;}
    case "assign":if(!ui.asUid)mAssign(el.dataset.id);break;
    case "doassign":{if(ui.asUid)return;const f=document.getElementById("asform");if(!f.reportValidity())return;const p=prop(f.dataset.id);if(!puedeGestionar(p)||p.tenantId){closeModal();return}
      const err=document.getElementById("aserr"),pl=leerPersona("as","tenant"),ini=document.getElementById("asini").value,monto=Number(document.getElementById("asmonto").value),gar=Number(document.getElementById("asgar").value||0);
      const e1=pl.err||(!(monto>0)?"Indica un canon mayor que cero.":gar<0?"La garantía no puede ser negativa.":"");if(e1){err.innerHTML=`<div class="err">${esc(e1)}</div>`;return}
      const r=await crearPersona(pl,"tenant"),tid=r.id;
      if(!S.props.some(x=>x.tenantId===tid)){const tt=byId(S.tenants,tid);if(tt)tt.desde=ini}
      Object.assign(p,{tenantId:tid,monto,garantia:gar,inicio:ini,vacioDesde:null,paid:false,deuda:0,abono:0,gcPaid:false,gcDeuda:0,lastPay:null});
      p.reajuste.ultimo=ini;if(p.moneda!=="UF")p.reajuste.periodo=Number(document.getElementById("asper").value);
      p.tenancias.push({tid,desde:S.periodo.ym,hasta:null});
      const hoy=todayISO(),tn=nombreActor(tid);
      S.msgs.push({id:uid("m"),from:p.adminId,to:tid,text:"Te damos la bienvenida a "+p.dir+". Tu contrato empieza el "+dmy(ini)+" y el primer cobro es el de "+ymLabel(S.periodo.ym)+".",fecha:hoy,read:false,canal:"plataforma"});
      S.msgs.push({id:uid("m"),from:p.adminId,to:p.ownerId,text:"Tu propiedad "+p.dir+" ya tiene arrendatario: "+tn+", desde el "+dmy(ini)+". Canon "+rentLabel(p)+".",fecha:hoy,read:false,canal:"plataforma"});
      log("Contrato iniciado",p.code+" "+p.dir+", "+tn+(pl.vincula?" (cuenta existente vinculada)":r.nuevo?" (cuenta nueva)":""));
      save();closeModal();render();
      if(r.nuevo)showTemp(r.nuevo.u,r.nuevo.pw,"Cuenta creada para el arrendatario");else toast(tn+" asignado a "+p.code);break;}
    case "endc":if(!ui.asUid)mEnd(el.dataset.id);break;
    case "doend":{if(ui.asUid)return;const f=document.getElementById("endform");if(!f.reportValidity())return;const p=prop(f.dataset.id);if(!puedeGestionar(p)||!p.tenantId){closeModal();return}
      const t=tenantOf(p),s=salidaDe(p),fecha=document.getElementById("endfecha").value,nota=document.getElementById("endnota").value.trim(),hoy=todayISO();
      const sal={fecha,arriendo:s.arriendo,gc:s.gc,cuotasPend:s.cuotasPend,garantia:s.garantia,neto:s.neto,nota};
      const tn=p.tenancias.find(x=>x.tid===t.id&&!x.hasta);
      if(tn){tn.hasta=S.periodo.ym;tn.salida=sal}else p.tenancias.push({tid:t.id,desde:S.periodo.ym,hasta:S.periodo.ym,salida:sal});
      /* Las cuotas que quedaban se compensan en la liquidación de salida */
      s.reps.forEach(r=>{r.saldadas=r.cuotas-r.descontadas;r.descontadas=r.cuotas});
      Object.assign(p,{tenantId:null,vacioDesde:S.periodo.ym,paid:false,deuda:0,abono:0,gcPaid:false,gcDeuda:0});
      const txt=s.neto>0?"queda un saldo a tu cargo de "+clp(s.neto):s.neto<0?"se te devolverán "+clp(-s.neto):"no queda saldo pendiente";
      S.msgs.push({id:uid("m"),from:p.adminId,to:t.id,text:"Registramos el término de tu contrato en "+p.dir+" el "+dmy(fecha)+". Con la garantía y los saldos, "+txt+".",fecha:hoy,read:false,canal:"plataforma"});
      S.msgs.push({id:uid("m"),from:p.adminId,to:p.ownerId,text:"Terminó el contrato de "+t.nombre+" en "+p.dir+" ("+dmy(fecha)+"). La propiedad queda disponible. Liquidación de salida: "+(s.neto>0?"el arrendatario paga "+clp(s.neto):s.neto<0?"se le devuelven "+clp(-s.neto):"sin saldo")+".",fecha:hoy,read:false,canal:"plataforma"});
      log("Contrato terminado",p.code+" "+p.dir+", "+t.nombre+". Saldo de salida "+(s.neto<0?"-":"")+clp(Math.abs(s.neto)));
      save();closeModal();render();toast("Contrato terminado. "+p.code+" queda disponible");break;}
    case "saveuf":{const u=Number(document.getElementById("uf").value);if(u>0){S.params.uf=Math.round(u);log("Parámetro","UF actualizada a "+clp(S.params.uf));save();render();toast("UF actualizada a "+clp(S.params.uf))}break;}
    case "applyipc":{const pct=Number(document.getElementById("ipc").value);if(!(pct>-50&&pct<50)){toast("Ingresa una variación IPC válida");return}S.params.ipc=pct;const hoy=todayISO();let c=0;myProps().forEach(p=>{if(p.tenantId&&p.reajuste.tipo==="IPC"&&proxReajuste(p)<=hoy){p.monto=reajusteIPC(p.monto,pct);while(proxReajuste(p)<=hoy)p.reajuste.ultimo=proxReajuste(p);c++;S.msgs.push({id:uid("m"),from:p.adminId,to:p.tenantId,text:"Tu arriendo se reajustó por IPC ("+String(pct).replace(".",",")+"%). Nuevo canon: "+clp(p.monto)+".",fecha:hoy,read:false,canal:"plataforma"})}});log("Reajuste IPC",c+" contratos, "+String(pct).replace(".",",")+"%");save();render();toast(c+" contrato"+(c===1?"":"s")+" reajustado"+(c===1?"":"s"));break;}
    case "closemonth":if(role()==="bo"&&!ui.asUid)mCloseMonth();break;
    case "doclose":{if(role()!=="bo"||ui.asUid)return;
      /* El saldo impago ya lleva aplicada la cuota de reparación del mes: se marca como descontada para no repetirla */
      S.props.forEach(p=>{if(p.tenantId){if(!p.paid){p.deuda=aPagarArriendo(p);repairsOn(p).forEach(r=>r.descontadas++);p.abono=0}if(!p.gcPaid)p.gcDeuda+=p.gc.monto;p.paid=false;p.gcPaid=false}});
      const nx=ymAdd(S.periodo.ym,1);S.periodo={ym:nx,vence:ymAdd(nx,1)+"-"+pad(S.params.diaVenc)};log("Cobros","Emitidos los cobros de "+ymLabel(S.periodo.ym));save();closeModal();render();toast("Cobros de "+ymLabel(S.periodo.ym)+" emitidos");break;}
    case "reset":openModal("Restablecer datos",`<p style="margin:0">Se borran los pagos, usuarios, mensajes y cambios hechos en este navegador y se cargan de nuevo los datos de ejemplo. El Lab no se toca.</p>`,`<button class="btn sec" data-act="close">Cancelar</button><button class="btn bad" data-act="doreset">Restablecer</button>`);break;
    case "doreset":S=seed();buildGen();save();closeModal();ui.uid=null;ui.asUid=null;clearSession();ui.screen="login";render();toast("Datos restablecidos. Vuelve a iniciar sesión");break;
    case "changepw":mChangePw(false);break;
    case "savepw":{const u=sessUser(),err=document.getElementById("pwerr"),p1=document.getElementById("pw1").value,p2=document.getElementById("pw2").value,forced=el.dataset.forced==="1";
      const fail=m=>{err.innerHTML=`<div class="err">${m}</div>`};
      if(!forced){const h0=await hashPw(document.getElementById("pw0").value);if(h0!==u.hash)return fail("La contraseña actual no es correcta.")}
      if(!passwordValida(p1))return fail("La nueva contraseña debe tener al menos 8 caracteres, con letras y números.");
      if(p1!==p2)return fail("Las dos contraseñas no coinciden.");
      u.hash=await hashPw(p1);u.cambiar=false;log("Contraseña cambiada",u.email);save();delete mroot.dataset.locked;closeModal();render();toast("Contraseña actualizada");
      if(u.actorId==="a1"&&S.params.bienvenida.activo&&!S.params.bienvenida.mostrado)mBday();break;}
    case "impersonate":{const u=byId(S.users,el.dataset.id);ui.asUid=u.id;log("Acceso como usuario","Back office entra como "+u.nombre,sessUser().nombre);save();ui.tab=TABS[u.role][0][0];ui.admSel=null;render();window.scrollTo(0,0);break;}
    case "swbo":ui.asBo=!ui.asBo;ui.tab=TABS[role()][0][0];ui.q="";ui.admSel=null;log("Cambio de vista",ui.asBo?"Entra al back office":"Vuelve a su administradora");save();render();window.scrollTo(0,0);break;
    case "togglebo":{const u=byId(S.users,el.dataset.id);u.bo=!u.bo;log(u.bo?"Acceso total concedido":"Acceso total retirado",u.email);save();render();toast(u.nombre+(u.bo?" ya tiene acceso total":" ya no tiene acceso total"));break;}
    case "stopimp":log("Fin de acceso como usuario","Back office deja de ver como "+cur().nombre,sessUser().nombre);save();ui.asUid=null;ui.tab="usuarios";render();window.scrollTo(0,0);break;
    case "unlock":{const u=byId(S.users,el.dataset.id);u.bloqueado=false;u.intentos=0;log("Cuenta desbloqueada",u.email);save();render();toast(u.nombre+" puede volver a entrar");break;}
    case "toggleuser":{const u=byId(S.users,el.dataset.id);u.activo=!u.activo;log(u.activo?"Cuenta activada":"Cuenta desactivada",u.email);save();render();toast(u.nombre+(u.activo?" activado":" desactivado"));break;}
    case "resetpw":{const u=byId(S.users,el.dataset.id);const t=tempPw();u.hash=await hashPw(t);u.cambiar=true;u.bloqueado=false;u.intentos=0;log("Contraseña restablecida",u.email);save();render();showTemp(u,t,"Contraseña restablecida");break;}
    case "copytemp":try{await navigator.clipboard.writeText(el.dataset.pw);toast("Contraseña copiada")}catch(err){const s=mroot.querySelector(".secret");if(s){const r=document.createRange();r.selectNodeContents(s);const sel=getSelection();sel.removeAllRanges();sel.addRange(r)}toast("Selecciona el texto y cópialo")}break;
    case "newuser":mNewUser();break;
    case "saveuser":{const f=document.getElementById("uform");if(!f.reportValidity())return;const nom=document.getElementById("unom").value.trim(),em=document.getElementById("uem").value.trim().toLowerCase(),r=document.getElementById("urol").value,lk=document.getElementById("ulink").value,err=document.getElementById("uerr");
      if(S.users.some(u=>u.email.toLowerCase()===em)){err.innerHTML='<div class="err">Ya existe una cuenta con ese correo.</div>';return}
      let actor=r==="bo"?"bo":lk;
      if(r!=="bo"&&(lk==="new"||!lk)){if(r==="tenant"){actor="t"+uid("n");S.tenants.push({id:actor,nombre:nom,desde:todayISO(),wa:""})}if(r==="owner"){actor="o"+uid("n");S.owners.push({id:actor,nombre:nom,wa:""})}if(r==="admin")actor="a1"}
      const t=tempPw(),u={id:uid("u"),nombre:nom,email:em,role:r,actorId:actor,hash:await hashPw(t),activo:true,bloqueado:false,intentos:0,ultimo:null,cambiar:true,wa:""};
      S.users.push(u);log("Usuario creado",em+" ("+ROLES[r]+")");save();render();showTemp(u,t,"Usuario creado");break;}
    case "admsel":ui.admSel=el.dataset.id||null;render();window.scrollTo(0,0);break;
    case "newadm":mNewAdm();break;
    case "saveadm":{const f=document.getElementById("aform");if(!f.reportValidity())return;const g=id=>document.getElementById(id).value.trim();const em=g("aem").toLowerCase();
      if(S.users.some(u=>u.email.toLowerCase()===em)){document.getElementById("aerr").innerHTML='<div class="err">Ya existe una cuenta con ese correo.</div>';return}
      const aid="a"+uid("n");S.administradoras.push({id:aid,nombre:g("anom"),contacto:g("acon"),ciudad:g("aciu"),comuna:g("acom"),comisionAdm:Number(g("apct"))||8,desde:S.periodo.ym,wa:""});
      const t=tempPw(),u={id:uid("u"),nombre:g("acon"),email:em,role:"admin",actorId:aid,hash:await hashPw(t),activo:true,bloqueado:false,intentos:0,ultimo:null,cambiar:true,wa:""};S.users.push(u);
      log("Administradora creada",g("anom"));save();render();showTemp(u,t,"Administradora creada");break;}
    case "newprov":mNewProv();break;
    case "saveprov":{const f=document.getElementById("vform");if(!f.reportValidity())return;const g=id=>document.getElementById(id).value.trim();
      S.provNew=S.provNew||[];S.provNew.push({id:"pvn"+uid(""),nombre:g("vnom"),cat:g("vcat"),ciudad:g("vciu"),comunas:g("vcom")||g("vciu"),sec:document.getElementById("vsec").checked,precio:g("vpre")||"Precio a convenir",desde:Number(S.periodo.ym.slice(0,4)),wa:g("vwa")});
      log("Proveedor agregado",g("vnom")+" ("+g("vcat")+")");save();closeModal();render();toast("Proveedor agregado a la red");break;}
    case "bdaypreview":mBday(true);break;
    case "bdayreset":S.params.bienvenida.mostrado=false;save();render();toast("Se mostrará de nuevo la próxima vez que "+bdayNombre()+" entre");break;
    case "suggest":mLab(null,{tipo:"Idea",area:role()==="tenant"?"Arrendatario":role()==="owner"?"Propietario":"Administrador"});break;
    case "labnew":mLab(null);break;
    case "labedit":mLab(el.dataset.id);break;
    case "labtipo":ui.lab.tipo=el.dataset.v;render();break;
    case "labsave":{const f=document.getElementById("labform");if(!f.reportValidity())return;const g=id=>{const x=document.getElementById(id);return x?x.value.trim():null};
      const id=f.dataset.id,fields={tipo:g("lt"),area:g("la"),titulo:g("ltit"),detalle:g("ldet")||"",actualizado:nowISO()};
      if(g("lp")!==null){fields.prioridad=g("lp");fields.estado=g("le");fields.version=g("lv")||""}
      el.disabled=true;
      try{if(id){await labUpdate(id,fields)}else{const u=sessUser();await labAdd(Object.assign({prioridad:"Media",estado:"Propuesta",version:""},fields,{autor:(u?u.nombre+" ("+ROLES[cur().role]+")":"Visitante"),creado:nowISO()}))}
        if(sessUser())log("Lab",(id?"Editada: ":"Nueva entrada: ")+fields.titulo);save();closeModal();render();toast(id?"Entrada actualizada":"Registrado en el Lab")}catch(err){el.disabled=false;labErr(err)}break;}
    case "labdel":{const id=el.dataset.id;openModal("Eliminar entrada",'<p style="margin:0">La entrada se borra del Lab para todo el equipo. Esta acción no se puede deshacer.</p>',`<button class="btn sec" data-act="close">Cancelar</button><button class="btn bad" data-act="labdodel" data-id="${esc(id)}">Eliminar</button>`);break;}
    case "labdodel":try{await labDelete(el.dataset.id);log("Lab","Entrada eliminada");save();closeModal();render();toast("Entrada eliminada")}catch(err){labErr(err)}break;
  }
});
document.addEventListener("change",async e=>{
  const t=e.target;
  if(t.name==="medio"){const w=document.getElementById("cuotaswrap");if(w)w.hidden=t.value!=="Tarjeta de crédito";}
  if(t.id==="labest"){ui.lab.estado=t.value;render();}
  if(t.id==="histyear"){ui.year=t.value;render();}
  if(t.id==="provcat"){ui.provCat=t.value;render();}
  if(t.id==="provcity"){ui.provCity=t.value;render();}
  if(t.dataset&&t.dataset.picker){const w=document.getElementById(t.dataset.picker+"new");if(w)w.hidden=t.value!=="new";}
  if(t.id==="rrol"){const w=document.getElementById("rempw");if(w)w.hidden=t.value!=="admin";}
  if(t.id==="rcat"){const f=document.getElementById("repform");const p=prop(f.dataset.id);document.getElementById("rprov").innerHTML=provOptions(p.ciudad,t.value,null);}
  if(t.dataset&&t.dataset.labstate){const id=t.dataset.labstate;try{await labUpdate(id,{estado:t.value,actualizado:nowISO()});log("Lab","Estado cambiado a "+t.value);save();toast("Estado actualizado")}catch(err){labErr(err);render()}}
  if(t.id==="urol"){const w=document.getElementById("ulinkw"),s=document.getElementById("ulink"),r=t.value;w.hidden=r==="bo";const list=r==="tenant"?S.tenants:r==="owner"?S.owners:r==="admin"?S.administradoras.map(a=>({id:a.id,nombre:a.nombre})):[];s.innerHTML=(r==="admin"?"":'<option value="new">Crear ficha nueva</option>')+list.map(x=>`<option value="${x.id}">${esc(x.nombre)}</option>`).join("");}
});
document.addEventListener("input",e=>{
  const id=e.target.id;
  if(id==="q"||id==="labq"){if(id==="q")ui.q=e.target.value;else ui.lab.q=e.target.value;const pos=e.target.selectionStart;render();const q=document.getElementById(id);if(q){q.focus();q.setSelectionRange(pos,pos)}}
  if(id==="wanum"||id==="watext"){const l=document.getElementById("walink");if(l)l.href=waUrl(document.getElementById("wanum").value,document.getElementById("watext").value)}
});
document.addEventListener("submit",e=>{
  e.preventDefault();
  const id=e.target.id;
  if(id==="loginform")doLogin();
  if(id==="regform")doRegister();
  if(id==="msgform"){const to=document.getElementById("mto").value,t=document.getElementById("mtext");if(!t.value.trim()){t.focus();return}S.msgs.push({id:uid("m"),from:meActor(),to,text:t.value.trim(),fecha:todayISO(),read:false,canal:"plataforma"});ui.msgTo=to;save();render();toast("Mensaje enviado a "+nombreActor(to));}
  if(id==="paramform"){const v=x=>Number(document.getElementById(x).value);const p=S.params;
    const dia=Math.min(28,Math.max(1,Math.round(v("p_dia")))),com=v("p_com");
    if(!(v("p_uf")>0)||!(com>=0&&com<=20)){toast("Revisa los valores: UF mayor que cero y comisión entre 0 y 20%");return}
    p.uf=Math.round(v("p_uf"));p.ipc=v("p_ipc");p.comision=com;p.gracia=Math.max(0,Math.round(v("p_gracia")));
    if(dia!==p.diaVenc){p.diaVenc=dia;S.periodo.vence=S.periodo.vence.slice(0,8)+pad(dia)}
    document.querySelectorAll("[data-medio]").forEach(c=>p.medios[c.dataset.medio]=c.checked);
    const tpl=document.getElementById("p_tpl").value.trim();if(tpl)p.plantilla=tpl;
    p.bienvenida.activo=document.getElementById("p_bon").checked;const bt=document.getElementById("p_btxt").value.trim();if(bt)p.bienvenida.texto=bt;const btt=document.getElementById("p_btit").value.trim();if(btt)p.bienvenida.titulo=btt;
    log("Parámetros","UF "+clp(p.uf)+", IPC "+p.ipc+"%, comisión "+p.comision+"%, vencimiento día "+p.diaVenc);save();render();toast("Parámetros guardados");}
});
document.addEventListener("keydown",e=>{
  if(e.key==="Escape"&&mroot.innerHTML)closeModal();
  if((e.key==="Enter"||e.key===" ")&&e.target.classList&&e.target.classList.contains("seg")){e.preventDefault();e.target.dispatchEvent(new MouseEvent("click",{bubbles:true}))}
});
S.users.forEach(u=>{if(u.email==="bruno.salinas@demo.klip.cl"&&u.bo===undefined)u.bo=true});
if(S.provWa)PROV.forEach(p=>{if(S.provWa[p.id])p.wa=S.provWa[p.id]});
buildGen();
if(ui.screen==="app"&&cur())ui.tab=TABS[role()][0][0];
render();
if(ui.screen==="app"&&sessUser()&&sessUser().cambiar)mChangePw(true);
