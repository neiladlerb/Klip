/* KLIP: ventanas modales */
"use strict";
/* Modales */
const mroot=document.getElementById("modal-root");
let lastFocus=null;
function openModal(title,body,foot){
  lastFocus=document.activeElement;
  mroot.innerHTML=`<div class="scrim" data-act="scrim"><div class="modal" role="dialog" aria-modal="true" aria-labelledby="mt"><div class="modal-h"><h2 id="mt">${title}</h2><button class="x" data-act="close" aria-label="Cerrar">&times;</button></div><div class="modal-b" id="mb">${body}</div>${foot?`<div class="modal-f" id="mf">${foot}</div>`:""}</div></div>`;
  const f=mroot.querySelector("input,select,textarea,button.btn");if(f)f.focus();
}
function closeModal(){if(mroot.dataset.locked)return;mroot.innerHTML="";if(lastFocus&&lastFocus.focus)lastFocus.focus()}
let tTimer;
function toast(msg){const t=document.getElementById("toast");t.textContent=msg;t.hidden=false;clearTimeout(tTimer);tTimer=setTimeout(()=>t.hidden=true,3400)}

const bdayNombre=()=>{const a=byId(S.administradoras,"a1");return a?a.contacto.split(" ")[0]:"Administradora"};
function mBday(preview){
  const b=S.params.bienvenida,tit=(b.titulo||"Te damos la bienvenida, {nombre}").replace(/\{nombre\}/g,bdayNombre());
  openModal("Bienvenida",`<div class="bday"><div class="big">${esc(tit)}</div>${LOGO(220,true)}<p>${esc(b.texto)}</p></div>`,`<button class="btn lg" data-act="close">Entrar a mi panel</button>`);
  if(!preview){b.mostrado=true;log("Bienvenida","Se mostró el mensaje de bienvenida");save()}
}
function mDetail(id){
  const p=prop(id),reps=repairsOn(p);
  openModal("Detalle del arriendo",`<div class="detail"><div class="left"><div class="amount num" style="font-size:38px">${clp(aPagarArriendo(p))}</div><h3 style="font-size:22px;margin:8px 0">${esc(p.dir.split(",")[0])}<br><span class="muted" style="font-size:16px">${esc(p.comuna)}</span></h3>${ICON.house}</div>
  <div class="lines"><div><span>Mes</span><span>${ymLabel(S.periodo.ym)}</span></div><div><span>Vence</span><span>${dmy(S.periodo.vence)}</span></div>
  <div><span>Arriendo del mes${p.moneda==="UF"?" (UF "+fmt.format(p.monto)+" x "+clp(UF())+")":""}</span><span class="num">${clp(rentCLP(p))}</span></div>
  <div><span>Saldo anterior</span><span class="num">${clp(p.deuda)}</span></div>
  ${p.abono?`<div><span>Abonado este mes</span><span class="num">-${clp(p.abono)}</span></div>`:""}
  ${reps.map(r=>`<div><span>Reparación aprobada por ambas partes: ${esc(r.desc)} (cuota ${r.descontadas+1} de ${r.cuotas}) <button class="link" data-act="acta" data-id="${r.id}">ver acta</button></span><span class="num">-${clp(cuota(r))}</span></div>`).join("")||`<div><span>Descuentos aprobados</span><span class="num">$0</span></div>`}
  <div class="tot"><span>Total a pagar</span><span class="num">${clp(aPagarArriendo(p))}</span></div>
  <p style="margin:12px 0 0"><b>Descripción:</b> ${esc(p.desc)}</p></div></div>`,
  p.paid?"":`<button class="btn" data-act="pay" data-items="${p.id}:a">Pagar este arriendo</button>`);
}
function mPay(items){
  const its=items.split(",").filter(Boolean).map(s=>{const [id,k]=s.split(":");const p=prop(id);return {id,k,p,monto:k==="a"?aPagarArriendo(p):aPagarGC(p),label:(k==="a"?"Arriendo ":"Gastos comunes ")+ymLabel(S.periodo.ym)}}).filter(i=>i.monto>0);
  if(!its.length){toast("No hay montos pendientes");return}
  const tot=its.reduce((a,i)=>a+i.monto,0);
  const sub={"Tarjeta de crédito":"Acumula kilómetros y puntos","Tarjeta de débito":"Cargo inmediato en tu cuenta","Tarjeta retail":"Tarjetas de casas comerciales","Transferencia":"Desde tu banco"};
  const med=Object.keys(S.params.medios).filter(m=>S.params.medios[m]);
  if(!med.length){openModal("Pagar",'<p style="margin:0">No hay medios de pago habilitados en este momento. Contacta con la administración.</p>','<button class="btn" data-act="close">Cerrar</button>');return}
  openModal("Pagar",`<form id="payform" class="form" data-items="${esc(items)}"><div class="lines">${its.map(i=>`<div><span>${i.label}<span class="sub">${esc(i.p.dir)}</span></span><span class="num">${clp(i.monto)}</span></div>`).join("")}<div class="tot"><span>Total</span><span class="num">${clp(tot)}</span></div></div>
  <fieldset style="border:0;padding:0;margin:0"><legend style="font-weight:700;margin-bottom:8px">Medio de pago</legend><div class="opts">${med.map((m,i)=>`<label class="opt"><input type="radio" name="medio" value="${esc(m)}" ${i===0?"checked":""}><span><b>${esc(m)}</b><span class="sub">${sub[m]||""}</span></span></label>`).join("")}</div></fieldset>
  <div class="field" id="cuotaswrap" ${med[0]==="Tarjeta de crédito"?"":"hidden"}><label for="cuotas">Cuotas con tarjeta de crédito</label><select id="cuotas"><option>1</option><option>3</option><option>6</option><option>12</option></select></div>
  <p class="muted" style="margin:0;font-size:13px">Demo: el pago es simulado. En producción se redirige a la pasarela del medio elegido y KLIP no almacena datos de tarjetas.</p></form>`,
  `<button class="btn sec" data-act="close">Cancelar</button><button class="btn ok" data-act="confirmpay">Pagar ${clp(tot)}</button>`);
}
function payArriendo(p,medio){
  const m=aPagarArriendo(p),dsc=descuento(p),reps=repairsOn(p),hoy=todayISO();
  S.hist.push({id:uid("h"),f:hoy,ym:S.periodo.ym,p:p.id,t:p.tenantId,c:"A",m,md:medio,d:dsc,r:reps.length?reps[0].id:null});
  reps.forEach(r=>r.descontadas++);p.paid=true;p.deuda=0;p.abono=0;p.lastPay=hoy;return m;
}
function doPay(){
  const f=document.getElementById("payform");if(!f)return;
  const medio=(f.querySelector("input[name=medio]:checked")||{}).value;
  const cuotas=medio==="Tarjeta de crédito"?document.getElementById("cuotas").value:"1";
  const btn=mroot.querySelector('[data-act="confirmpay"]');btn.disabled=true;btn.textContent="Procesando pago...";
  setTimeout(()=>{
    let tot=0;const hoy=todayISO();const lines=[];
    f.dataset.items.split(",").filter(Boolean).forEach(s=>{const [id,k]=s.split(":");const p=prop(id);
      if(k==="a"&&!p.paid){const m=payArriendo(p,medio);tot+=m;lines.push("arriendo");
        S.msgs.push({id:uid("m"),from:p.adminId,to:p.ownerId,text:"KLIP recibió el pago de arriendo de "+p.dir+" por "+clp(m)+". Tu liquidación se transferirá en 72 horas hábiles.",fecha:hoy,read:false,canal:"plataforma"});}
      if(k==="g"&&!p.gcPaid){const m=aPagarGC(p);tot+=m;p.gcPaid=true;p.gcDeuda=0;
        S.hist.push({id:uid("h"),f:hoy,ym:S.periodo.ym,p:id,t:p.tenantId,c:"G",m,md:medio,d:0,r:null});lines.push("gastos comunes");}
    });
    const n="KLIP-"+Math.floor(100000+Math.random()*900000);
    log("Pago",clp(tot)+" con "+medio+", comprobante "+n);save();
    document.getElementById("mb").innerHTML=`<div class="receipt"><div class="ok">&#10003;</div><h3 style="font-size:24px">Pago realizado</h3><div class="amount num" style="font-size:34px">${clp(tot)}</div><span class="muted">Comprobante ${n}, ${dmy(hoy)}</span><span>${esc(medio)}${cuotas!=="1"?", "+cuotas+" cuotas":""}</span><span class="muted">Pagaste ${lines.join(" y ")}. El propietario y la administradora ya lo ven en su panel.</span></div>`;
    document.getElementById("mf").innerHTML=`<button class="btn" data-act="close">Listo</button>`;
    render();
  },900);
}
function mContract(id){
  const p=prop(id),o=ownerOf(p),a=admOf(p);
  openModal("Contrato y garantía",`<div class="lines"><div><span>Propiedad</span><span>${esc(p.dir)}, ${esc(p.comuna)}</span></div><div><span>Propietario</span><span>${esc(o?o.nombre:"")}</span></div><div><span>Administradora</span><span>${esc(a?a.nombre:"")}</span></div><div><span>Inicio del contrato</span><span>${dmy(p.inicio)}</span></div><div><span>Canon pactado</span><span>${rentLabel(p)}</span></div><div><span>Reajuste</span><span>${p.reajuste.tipo==="UF"?"Expresado en UF, se cobra al valor del día":"IPC cada "+p.reajuste.periodo+" meses"}</span></div>${p.reajuste.tipo==="IPC"?`<div><span>Próximo reajuste</span><span>${dmy(proxReajuste(p))}</span></div>`:""}<div><span>Garantía entregada</span><span>${p.moneda==="UF"?"UF "+fmt.format(p.garantia):clp(p.garantia)}</span></div><div><span>Día de pago</span><span>${S.params.diaVenc} de cada mes</span></div></div>`,`<button class="btn" data-act="close">Cerrar</button>`);
}
function provOptions(city,cat,sel){
  const list=provsAll().filter(v=>(!cat||v.cat===cat));
  const loc=list.filter(v=>v.ciudad===city),rest=list.filter(v=>v.ciudad!==city);
  return `<option value="">Que lo proponga la administradora</option>`+loc.concat(rest).map(v=>`<option value="${v.id}" ${v.id===sel?"selected":""}>${esc(v.nombre)} (${esc(v.cat)}, ${esc(v.ciudad)})</option>`).join("");
}
function mNewRep(id,provId){
  const p=prop(id),pv=provId?provById(provId):null,cat=pv?pv.cat:"Gasfitería";
  openModal("Solicitar reparación",`<form id="repform" class="form" data-id="${id}"><p class="muted" style="margin:0">${esc(p.dir)}. Cuando el propietario apruebe y tú confirmes el trabajo, el monto se descuenta de tu arriendo.</p>
  <div class="row"><div class="field"><label for="rcat">Tipo de reparación</label><select id="rcat">${CAT_NAMES.map(c=>`<option ${c===cat?"selected":""}>${c}</option>`).join("")}</select></div><div class="field"><label for="rprov">Proveedor</label><select id="rprov">${provOptions(p.ciudad,cat,provId)}</select></div></div>
  <div class="field"><label for="rdesc">Qué hay que reparar</label><textarea id="rdesc" rows="3" required placeholder="Ej.: el calefont no enciende desde ayer"></textarea></div>
  <div class="row"><div class="field"><label for="rmonto">Presupuesto en pesos</label><input id="rmonto" type="number" min="1000" step="1000" required placeholder="80000"></div><div class="field"><label for="rcuotas">Descontar en</label><select id="rcuotas"><option value="1">1 mes</option><option value="2">2 meses</option><option value="3">3 meses</option><option value="6">6 meses</option></select></div></div></form>`,`<button class="btn sec" data-act="close">Cancelar</button><button class="btn" data-act="saverep">Enviar al propietario</button>`);
}
function mApprove(id){
  const r=byId(S.repairs,id),p=prop(r.propId),isAdm=role()==="admin";
  openModal("Revisar reparación",`<div class="lines"><div><span>Propiedad</span><span>${esc(p.dir)}</span></div><div><span>Solicita</span><span>${esc(nombreActor(r.tenantId))}, ${dmy(r.fecha)}</span></div><div><span>Reparación</span><span>${esc(r.cat)}: ${esc(r.desc)}</span></div></div>
  <form class="form" id="apform" style="margin-top:16px"><div class="row"><div class="field"><label for="aprov">Proveedor</label><select id="aprov">${provOptions(p.ciudad,r.cat,r.provId)}</select></div><div class="field"><label for="amonto">Monto aprobado ($)</label><input id="amonto" type="number" min="1000" step="1000" value="${r.monto}"></div></div>
  <div class="field"><label for="acuotas">Descontar del arriendo en</label><select id="acuotas">${[1,2,3,6].map(n=>`<option value="${n}" ${n===r.cuotas?"selected":""}>${n} ${n===1?"mes":"meses"}</option>`).join("")}</select></div>
  ${isAdm?'<div class="note">Apruebas como administradora con mandato del propietario. Quedará registrado así en el acta.</div>':""}</form>`,`<button class="btn bad" data-act="reject" data-id="${id}">Rechazar</button><button class="btn ok" data-act="doapprove" data-id="${id}">Aprobar y firmar</button>`);
}
function mActa(id){
  const r=repsAll().find(x=>x.id===id);if(!r)return;
  const p=prop(r.propId),pv=provById(r.provId),o=ownerOf(p);
  const sched=r.inicioDesc?Array.from({length:r.cuotas},(_,k)=>({ym:ymAdd(r.inicioDesc,k),m:cuotaN(r.monto,r.cuotas,k),ok:k<r.descontadas-(r.saldadas||0),sal:k>=r.cuotas-(r.saldadas||0)})):[];
  const canConf=!ui.asUid&&r.estado==="aprobada"&&role()==="tenant"&&r.tenantId===meActor();
  const firma=(t,f,who)=>f?`<div class="firma ok"><span class="eyebrow">${t}</span><b>${esc(f.nombre)}</b><span class="sub">${esc(f.rol||"")}${f.mandato?", con mandato del propietario":""}. Firmado el ${dmy(f.fecha)}</span></div>`:`<div class="firma"><span class="eyebrow">${t}</span><b>${esc(who)}</b><span class="sub">Pendiente</span></div>`;
  openModal("Acta de reparación",`<div class="acta">
    <div class="lines"><div><span>Propiedad</span><span>${esc(p.code)}, ${esc(p.dir)}</span></div><div><span>Solicitada</span><span>${dmy(r.fecha)} por ${esc(nombreActor(r.tenantId))}</span></div><div><span>Reparación</span><span>${esc(r.cat)}: ${esc(r.desc)}</span></div><div><span>Proveedor</span><span>${pv?esc(pv.nombre)+(pv.sec?" (SEC)":""):"Por definir"}</span></div><div class="tot"><span>Monto aprobado</span><span class="num">${clp(r.monto)} en ${r.cuotas} ${r.cuotas===1?"cuota":"cuotas"}${r.cuotas>1?" desde "+clp(cuotaBase(r)):""}</span></div></div>
    <div class="firmas">${firma("Aprueba presupuesto y cuotas",r.aprobProp,o?o.nombre:"Propietario")}${firma("Conformidad del trabajo realizado",r.conformArr,nombreActor(r.tenantId))}</div>
    ${sched.length?`<div><span class="eyebrow">Descuento en el arriendo</span><div class="tbl-wrap"><table><tbody>${sched.map(s=>`<tr><td>${ymLabel(s.ym)}</td><td class="r num">-${clp(s.m)}</td><td>${s.ok?'<span class="pill p-ok">Descontada</span>':s.sal?'<span class="pill p-mute">Saldada en la salida</span>':'<span class="pill p-warn">Pendiente</span>'}</td></tr>`).join("")}</tbody></table></div></div>`:""}
    ${r.rating?`<span>Valoración del arrendatario: <span class="stars">${stars(r.rating)}</span></span>`:""}
    ${canConf?`<form class="form" id="confform"><div class="field"><label for="crat">¿Cómo quedó el trabajo?</label><select id="crat"><option value="5">Excelente</option><option value="4">Bien</option><option value="3">Regular</option><option value="2">Mal</option></select></div><div class="note">Al confirmar firmas el acta y el descuento empieza en el cobro de ${ymLabel(S.periodo.ym)}.</div></form>`:""}
  </div>`,canConf?`<button class="btn sec" data-act="close">Todavía no</button><button class="btn ok" data-act="doconf" data-id="${r.id}">Confirmar y firmar</button>`:`<button class="btn" data-act="close">Cerrar</button>`);
}
function mFicha(id){
  const p=prop(id),o=ownerOf(p),a=admOf(p);
  const Y={};histAll().forEach(h=>{if(h.p===id&&h.c==="A"){const y=h.ym.slice(0,4);Y[y]=(Y[y]||0)+h.m}});
  const reps=repsAll().filter(r=>r.propId===id).sort((x,y)=>y.fecha.localeCompare(x.fecha));
  openModal("Ficha "+esc(p.code),`<div class="grid" style="gap:16px">
    <div class="lines"><div><span>Dirección</span><span>${esc(p.dir)}, ${esc(p.comuna)}</span></div><div><span>Propietario</span><span>${esc(o?o.nombre:"")}</span></div><div><span>Administradora</span><span>${esc(a?a.nombre:"")} desde ${ymLabel(p.alta)}</span></div><div><span>Canon actual</span><span>${rentLabel(p)}${p.moneda==="UF"?" ("+clp(rentCLP(p))+")":""}</span></div><div><span>Descripción</span><span>${esc(p.desc)}</span></div></div>
    <div><span class="eyebrow">Arrendatarios desde el alta</span><div class="tbl-wrap"><table><tbody>${p.tenancias.slice().reverse().map(t=>`<tr><td>${esc(nombreActor(t.tid))}</td><td class="num">${ymLabel(t.desde)} a ${t.hasta?ymLabel(t.hasta):"hoy"}</td><td class="r num">${Math.max(1,ymDiff(t.desde,t.hasta||S.periodo.ym)+1)} meses${t.salida?`<span class="sub">Salida: ${t.salida.neto>0?"pagó o debe "+clp(t.salida.neto):t.salida.neto<0?"se le devuelven "+clp(-t.salida.neto):"sin saldo"}</span>`:""}</td></tr>`).join("")||'<tr><td class="muted">Sin arrendatarios registrados</td></tr>'}</tbody></table></div></div>
    <div><span class="eyebrow">Arriendos cobrados por año</span><div class="tbl-wrap"><table><tbody>${Object.keys(Y).sort().reverse().map(y=>`<tr><td>${y}</td><td class="r num">${clp(Y[y])}</td></tr>`).join("")||'<tr><td class="muted">Sin pagos</td></tr>'}</tbody></table></div></div>
    <div><span class="eyebrow">Reparaciones (${reps.length})</span><div class="tbl-wrap"><table><tbody>${reps.slice(0,12).map(r=>`<tr><td class="num">${dmy(r.fecha)}</td><td>${esc(r.desc)}</td><td class="r num">${clp(r.monto)}</td><td><button class="link" data-act="acta" data-id="${r.id}">Acta</button></td></tr>`).join("")||'<tr><td class="muted">Sin reparaciones</td></tr>'}</tbody></table></div></div>
  </div>`,`${puedeGestionar(p)&&!ui.asUid?(p.tenantId?`<button class="btn bad" data-act="endc" data-id="${p.id}">Terminar contrato</button>`:`<button class="btn ok" data-act="assign" data-id="${p.id}">Asignar arrendatario</button>`)+'<span style="flex:1"></span>':""}<button class="btn" data-act="close">Cerrar</button>`);
}
function mCompose(to){
  openModal("Nuevo mensaje",`<form id="cform" class="form" data-to="${to}"><p style="margin:0">Para <b>${esc(nombreActor(to))}</b> (${rolActor(to)})</p><div class="field"><label for="ctext">Mensaje</label><textarea id="ctext" rows="5" required></textarea></div></form>`,`<button class="btn sec" data-act="close">Cancelar</button><button class="btn wa" data-act="cwa">Enviar por WhatsApp</button><button class="btn" data-act="sendc">Enviar en la plataforma</button>`);
}
/* WhatsApp: abre WhatsApp con el mensaje listo y KLIP registra la conversación */
function mWhatsApp(toId,text,opts){
  opts=opts||{};
  const isProv=!!opts.prov,name=isProv?opts.prov.nombre:nombreActor(toId);
  const num=isProv?(opts.prov.wa||""):waOf(toId);
  openModal("Enviar por WhatsApp",`<form class="form" id="waform" data-to="${esc(toId||"")}" data-prov="${isProv?esc(opts.prov.id):""}">
    <p style="margin:0">Para <b>${esc(name)}</b>${isProv?" ("+esc(opts.prov.cat)+")":toId?" ("+rolActor(toId)+")":""}</p>
    <div class="field"><label for="wanum">Número de WhatsApp</label><input id="wanum" type="tel" placeholder="+56 9 1234 5678" value="${esc(num)}"></div>
    <div class="field"><label for="watext">Mensaje</label><textarea id="watext" rows="6">${esc(text||"")}</textarea></div>
    <div class="note">Se abre WhatsApp con el mensaje listo para enviar desde tu teléfono o computador. Si no indicas número, WhatsApp te pedirá elegir el contacto. KLIP guarda el número y registra la conversación.</div></form>`,
  `<button class="btn sec" data-act="close">Cancelar</button><a class="btn wa" id="walink" href="${esc(waUrl(num,text||""))}" target="_blank" rel="noopener" data-act="wasent">Abrir WhatsApp</a>`);
}
function mProfile(){
  const u=sessUser();
  openModal("Mi perfil",`<form class="form" id="profform"><div class="lines"><div><span>Nombre</span><span>${esc(u.nombre)}</span></div><div><span>Correo</span><span>${esc(u.email)}</span></div><div><span>Perfil</span><span>${ROLES[u.role]}${u.role==="admin"?", "+esc(empresaDe(u.actorId)):""}</span></div></div>
    <div class="field"><label for="pfwa">Mi WhatsApp</label><input id="pfwa" type="tel" placeholder="+56 9 1234 5678" value="${esc(u.wa||waOf(u.actorId))}"></div><span class="muted" style="font-size:13px">Lo usan tus contactos en KLIP para escribirte por WhatsApp.</span></form>`,
  `<button class="btn sec" data-act="changepw">Cambiar contraseña</button><span style="flex:1"></span><button class="btn" data-act="saveprof">Guardar</button>`);
}
/* Selector de arrendatario o propietario: uno conocido, o por correo (se vincula si ya tiene cuenta, si no se crea) */
function personPicker(x,rol,opts){
  opts=opts||{};const adm=role()==="admin"?meActor():null;
  const list=rol==="tenant"?libres(adm):conocidos("owner",adm);
  const lbl=rol==="tenant"?"Arrendatario":"Propietario",sel=opts.def||"new";
  return `<div class="row"><div class="field"><label for="${x}sel">${lbl}</label><select id="${x}sel" data-picker="${x}">${opts.none?`<option value="none" ${sel==="none"?"selected":""}>${esc(opts.none)}</option>`:""}<option value="new" ${sel==="new"?"selected":""}>Buscar por correo o crear nuevo</option>${list.map(t=>`<option value="${t.id}">${esc(t.nombre)}${emailOf(t.id)?" ("+esc(emailOf(t.id))+")":""}</option>`).join("")}</select></div></div>
  <div class="row" id="${x}new" ${sel==="new"?"":"hidden"}><div class="field"><label for="${x}em">Correo${rol==="owner"?" (opcional)":""}</label><input id="${x}em" type="email" autocomplete="off" placeholder="nombre@correo.cl"></div><div class="field"><label for="${x}nom">Nombre y apellido</label><input id="${x}nom" autocomplete="off" placeholder="Si ya tiene cuenta, no hace falta"></div></div>`;
}
function mNewProp(){
  openModal("Nueva propiedad",`<form id="pform" class="form"><div class="row"><div class="field"><label for="pdir">Dirección</label><input id="pdir" required placeholder="Av. Italia 1450, Depto. 302"></div><div class="field"><label for="pcom">Comuna</label><input id="pcom" required placeholder="Providencia"></div></div>
  ${personPicker("po","owner")}
  ${personPicker("pt","tenant",{none:"Disponible, sin arrendatario",def:"none"})}
  <div class="row"><div class="field"><label for="pmon">Moneda del contrato</label><select id="pmon"><option value="UF">UF (reajuste automático)</option><option value="CLP">Pesos (reajuste IPC)</option></select></div><div class="field"><label for="pmonto">Canon mensual</label><input id="pmonto" type="number" min="1" step="any" required placeholder="16"></div></div>
  <div class="row"><div class="field"><label for="pper">Periodicidad reajuste IPC</label><select id="pper"><option value="6">Cada 6 meses</option><option value="12" selected>Cada 12 meses</option></select></div><div class="field"><label for="pval">Valor propiedad (UF)</label><input id="pval" type="number" min="1" placeholder="5800"></div></div>
  <div class="row"><div class="field"><label for="pgc">Comunidad</label><input id="pgc" placeholder="Comunidad Edificio Italia"></div><div class="field"><label for="pgcm">Gasto común mensual ($)</label><input id="pgcm" type="number" min="0" step="1000" placeholder="75000"></div></div>
  <p class="muted" style="margin:0;font-size:13px">Si el correo ya tiene cuenta en KLIP, la propiedad se vincula a esa cuenta. Si no, se crea una con contraseña temporal.</p><div id="perr"></div></form>`,`<button class="btn sec" data-act="close">Cancelar</button><button class="btn" data-act="saveprop">Guardar propiedad</button>`);
}
function mManual(id){
  const p=prop(id),t=tenantOf(p),tot=aPagarArriendo(p);
  if(!tot){toast("No hay montos pendientes");return}
  openModal("Registrar pago recibido",`<form id="manform" class="form" data-id="${p.id}"><div class="lines"><div><span>Arrendatario</span><span>${esc(t?t.nombre:"")}</span></div><div><span>Propiedad</span><span>${esc(p.dir)}</span></div><div class="tot"><span>Pendiente de ${ymLabel(S.periodo.ym)}</span><span class="num">${clp(tot)}</span></div></div>
  <div class="row"><div class="field"><label for="manmonto">Monto recibido ($)</label><input id="manmonto" type="number" min="1" max="${tot}" step="1" required value="${tot}"></div><div class="field"><label for="manmedio">Medio</label><select id="manmedio"><option>Transferencia</option><option>Depósito bancario</option><option>Efectivo</option><option>Cheque</option></select></div></div>
  <p class="muted" style="margin:0;font-size:13px">Si el monto es menor que lo pendiente, se registra como abono y el resto sigue por cobrar. Queda en la auditoría con tu nombre.</p><div id="manerr"></div></form>`,`<button class="btn sec" data-act="close">Cancelar</button><button class="btn ok" data-act="domanual">Registrar pago</button>`);
}
function mCloseMonth(){
  const pend=S.props.filter(p=>p.tenantId&&!p.paid);
  openModal("Cerrar "+ymLabel(S.periodo.ym),`<p style="margin-top:0">Se emitirán los cobros de ${ymLabel(ymAdd(S.periodo.ym,1))} para toda la plataforma. Los arriendos y gastos comunes no pagados pasan como saldo anterior. Pendientes en este momento:</p>${pend.length?`<div class="lines">${pend.map(p=>`<div><span>${esc(tenantOf(p).nombre)}, ${esc(p.dir)}<span class="sub">${esc((admOf(p)||{}).nombre||"")}</span></span><span class="num">${clp(aPagarArriendo(p))}</span></div>`).join("")}</div>`:'<p class="muted">Todos los arriendos están pagados.</p>'}`,`<button class="btn sec" data-act="close">Cancelar</button><button class="btn" data-act="doclose">Cerrar mes</button>`);
}
const tempPw=()=>"Klip-"+Math.floor(1000+Math.random()*9000)+String.fromCharCode(65+Math.floor(Math.random()*26));
function showTemp(u,pw,title){
  const list=Array.isArray(u)?u:[{u,pw}];if(Array.isArray(u))title=pw;
  openModal(title,`<div class="receipt">${list.map(x=>`<span>Contraseña temporal para <b>${esc(x.u.nombre)}</b> (${esc(x.u.email)}):</span><span class="secret">${esc(x.pw)}</span>`).join("")}<span class="muted">Comunícala por un canal seguro. Se pedirá cambiarla al entrar. No se vuelve a mostrar.</span></div>`,`${list.length===1?`<button class="btn sec" data-act="copytemp" data-pw="${esc(list[0].pw)}">Copiar</button>`:""}<button class="btn" data-act="close">Listo</button>`);
}
/* Asignar arrendatario a una propiedad disponible */
function mAssign(id){
  const p=prop(id);if(!p||p.tenantId)return;
  openModal("Asignar arrendatario",`<form id="asform" class="form" data-id="${p.id}"><p class="muted" style="margin:0">${esc(p.code)}, ${esc(p.dir)}, ${esc(p.comuna)}. Disponible desde ${p.vacioDesde?ymLabel(p.vacioDesde):ymLabel(p.alta)}.</p>
  ${personPicker("as","tenant")}
  <div class="row"><div class="field"><label for="asini">Inicio del contrato</label><input id="asini" type="date" required value="${todayISO()}"></div><div class="field"><label for="asmonto">Canon mensual (${p.moneda==="UF"?"UF":"$"})</label><input id="asmonto" type="number" min="1" step="any" required value="${p.monto}"></div></div>
  <div class="row"><div class="field"><label for="asgar">Garantía (${p.moneda==="UF"?"UF":"$"})</label><input id="asgar" type="number" min="0" step="any" value="${p.monto}"></div><div class="field"><label for="asper">Reajuste</label>${p.moneda==="UF"?`<input id="asper" disabled value="UF, automático">`:`<select id="asper"><option value="6" ${p.reajuste.periodo===6?"selected":""}>IPC cada 6 meses</option><option value="12" ${p.reajuste.periodo!==6?"selected":""}>IPC cada 12 meses</option></select>`}</div></div>
  <div class="note">Si el correo ya tiene cuenta de arrendatario en KLIP (por ejemplo, porque se registró solo), se vincula a esa cuenta. El primer cobro es el de ${ymLabel(S.periodo.ym)}.</div><div id="aserr"></div></form>`,
  `<button class="btn sec" data-act="close">Cancelar</button><button class="btn ok" data-act="doassign">Asignar y firmar contrato</button>`);
}
/* Terminar contrato con liquidación de salida */
function salidaDe(p){
  const reps=repairsOn(p),desde=p.paid?0:1;
  const cuotasPend=reps.reduce((a,r)=>a+cuotasRestantes(r.monto,r.cuotas,r.descontadas+desde),0);
  const garantia=p.moneda==="UF"?rentaUF(p.garantia,UF()):p.garantia;
  return Object.assign({arriendo:aPagarArriendo(p),gc:aPagarGC(p),cuotasPend,garantia,reps},calcSalida({arriendo:aPagarArriendo(p),gc:aPagarGC(p),cuotasPend,garantia}));
}
function mEnd(id){
  const p=prop(id),t=tenantOf(p);if(!p||!t)return;
  const s=salidaDe(p);
  openModal("Terminar contrato",`<form id="endform" class="form" data-id="${p.id}"><p class="muted" style="margin:0">${esc(t.nombre)} deja ${esc(p.code)}, ${esc(p.dir)}. Arrendatario desde ${dmy(p.inicio)}.</p>
  <div class="lines"><div><span>Arriendo pendiente${p.abono?" (descontado lo abonado)":""}</span><span class="num">${clp(s.arriendo)}</span></div><div><span>Gastos comunes pendientes</span><span class="num">${clp(s.gc)}</span></div>
  <div><span>Cuotas de reparación aún sin descontar</span><span class="num">${s.cuotasPend?"-"+clp(s.cuotasPend):"$0"}</span></div><div><span>Garantía a devolver${p.moneda==="UF"?" (UF "+fmt.format(p.garantia)+")":""}</span><span class="num">${s.garantia?"-"+clp(s.garantia):"$0"}</span></div>
  <div class="tot"><span>${s.neto>0?"Paga el arrendatario":s.neto<0?"Se devuelve al arrendatario":"Saldo"}</span><span class="num">${clp(Math.abs(s.neto))}</span></div></div>
  <div class="field"><label for="endfecha">Fecha de término</label><input id="endfecha" type="date" required value="${todayISO()}"></div>
  <div class="field"><label for="endnota">Observaciones de la entrega</label><textarea id="endnota" rows="3" maxlength="600" placeholder="Estado del inmueble, llaves, lecturas de medidores"></textarea></div>
  <div class="note">La propiedad queda disponible. La cuenta de ${esc(t.nombre.split(" ")[0])} se mantiene con su historial de pagos, sin arriendo vigente. El saldo queda anotado en la ficha.</div></form>`,
  `<button class="btn sec" data-act="close">Cancelar</button><button class="btn bad" data-act="doend">Terminar contrato</button>`);
}
function mChangePw(forced){
  openModal(forced?"Crea tu nueva contraseña":"Cambiar contraseña",`<form id="pwform" class="form">${forced?'<div class="note">Entraste con una contraseña temporal. Elige una nueva para continuar.</div>':`<div class="field"><label for="pw0">Contraseña actual</label><input id="pw0" type="password" autocomplete="current-password" required></div>`}<div class="field"><label for="pw1">Nueva contraseña</label><input id="pw1" type="password" autocomplete="new-password" minlength="8" required></div><div class="field"><label for="pw2">Repite la nueva contraseña</label><input id="pw2" type="password" autocomplete="new-password" required></div><span class="muted" style="font-size:13px">Mínimo 8 caracteres, con al menos una letra y un número.</span><div id="pwerr"></div></form>`,`${forced?"":'<button class="btn sec" data-act="close">Cancelar</button>'}<button class="btn" data-act="savepw" data-forced="${forced?1:0}">Guardar contraseña</button>`);
  if(forced)mroot.dataset.locked="1";
}
function mNewUser(){
  openModal("Nuevo usuario",`<form id="uform" class="form"><div class="row"><div class="field"><label for="unom">Nombre</label><input id="unom" required></div><div class="field"><label for="uem">Correo</label><input id="uem" type="email" required></div></div>
  <div class="row"><div class="field"><label for="urol">Perfil</label><select id="urol">${Object.keys(ROLES).map(r=>`<option value="${r}">${ROLES[r]}</option>`).join("")}</select></div>
  <div class="field" id="ulinkw"><label for="ulink">Vincular a la ficha</label><select id="ulink"><option value="new">Crear ficha nueva</option>${S.tenants.map(t=>`<option value="${t.id}">${esc(t.nombre)}</option>`).join("")}</select></div></div><div id="uerr"></div></form>`,`<button class="btn sec" data-act="close">Cancelar</button><button class="btn bo" data-act="saveuser">Crear usuario</button>`);
}
function mNewAdm(){
  openModal("Nueva administradora",`<form id="aform" class="form"><div class="row"><div class="field"><label for="anom">Nombre de la empresa</label><input id="anom" required></div><div class="field"><label for="acon">Persona de contacto</label><input id="acon" required></div></div>
  <div class="row"><div class="field"><label for="aem">Correo del contacto</label><input id="aem" type="email" required></div><div class="field"><label for="aciu">Ciudad</label><select id="aciu"><option>Santiago</option><option>Valparaíso</option><option>Concepción</option><option>La Serena</option><option>Temuco</option><option>Antofagasta</option></select></div></div>
  <div class="row"><div class="field"><label for="acom">Comuna</label><input id="acom"></div><div class="field"><label for="apct">Comisión de administración (% + IVA)</label><input id="apct" type="number" min="0" max="20" step="0.5" value="8"></div></div><div id="aerr"></div></form>`,`<button class="btn sec" data-act="close">Cancelar</button><button class="btn bo" data-act="saveadm">Crear administradora</button>`);
}
function mNewProv(){
  openModal("Agregar proveedor",`<form id="vform" class="form"><div class="row"><div class="field"><label for="vnom">Nombre</label><input id="vnom" required></div><div class="field"><label for="vcat">Especialidad</label><select id="vcat">${CAT_NAMES.map(c=>`<option>${c}</option>`).join("")}</select></div></div>
  <div class="row"><div class="field"><label for="vciu">Ciudad</label><select id="vciu"><option>Santiago</option><option>Valparaíso</option><option>Concepción</option></select></div><div class="field"><label for="vcom">Comunas que atiende</label><input id="vcom" placeholder="Providencia, Ñuñoa"></div></div>
  <div class="row"><div class="field"><label for="vpre">Precio referencial</label><input id="vpre" placeholder="Visita desde $20.000"></div><div class="field"><label for="vwa">WhatsApp</label><input id="vwa" type="tel" placeholder="+56 9 1234 5678"></div></div>
  <label class="check"><input type="checkbox" id="vsec"> Instalador autorizado SEC</label></form>`,`<button class="btn sec" data-act="close">Cancelar</button><button class="btn" data-act="saveprov">Agregar</button>`);
}
function mLab(id,preset){
  const it=id?LAB.items.find(x=>x.id===id):Object.assign({tipo:"Idea",estado:"Propuesta",prioridad:"Media",area:"Plataforma",version:"",titulo:"",detalle:""},preset||{});
  if(!it)return;
  const o=(arr,v)=>arr.map(x=>`<option ${x===v?"selected":""}>${x}</option>`).join("");
  openModal(id?"Editar entrada del Lab":(preset?"Sugerir una mejora":"Nueva entrada del Lab"),`<form id="labform" class="form" data-id="${id?esc(id):""}">
    <div class="row"><div class="field"><label for="lt">Tipo</label><select id="lt">${o(LAB_TIPOS,it.tipo)}</select></div><div class="field"><label for="la">Área</label><select id="la">${o(LAB_AREAS,it.area)}</select></div></div>
    <div class="field"><label for="ltit">Título</label><input id="ltit" required maxlength="140" value="${esc(it.titulo)}" placeholder="Ej.: Recordatorio automático tres días antes del vencimiento"></div>
    <div class="field"><label for="ldet">Detalle</label><textarea id="ldet" rows="4" maxlength="2000" placeholder="Qué problema resuelve, para quién y cómo">${esc(it.detalle||"")}</textarea></div>
    ${preset?"":`<div class="row"><div class="field"><label for="lp">Prioridad</label><select id="lp">${o(["Alta","Media","Baja"],it.prioridad)}</select></div><div class="field"><label for="le">Estado</label><select id="le">${o(LAB_EST,it.estado)}</select></div></div>
    <div class="field"><label for="lv">Versión</label><input id="lv" value="${esc(it.version||"")}" placeholder="Ej.: 0.4"></div>`}</form>`,
  `${id?`<button class="btn bad" data-act="labdel" data-id="${esc(id)}">Eliminar</button>`:""}<span style="flex:1"></span><button class="btn sec" data-act="close">Cancelar</button><button class="btn bo" data-act="labsave">${preset?"Enviar al Lab":"Guardar"}</button>`);
}

