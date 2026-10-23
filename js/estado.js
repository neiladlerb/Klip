/* KLIP: estado persistido, sesión, cálculos sobre los datos y Lab */
"use strict";
let S;
try{S=JSON.parse(localStorage.getItem(KEY)||"null")}catch(e){S=null}
if(!S||S.v!==5)S=seed();
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){toast("No se pudieron guardar los cambios en este navegador")}};
function log(tipo,det,who){const real=ui.asUid&&sessUser()&&cur()?sessUser().nombre+" (como "+cur().nombre+")":cur()?cur().nombre:"Visitante";S.audit.push({f:nowISO(),who:who||real,tipo,det});if(S.audit.length>400)S.audit=S.audit.slice(-400)}

/* Historia generada 2011 a 2026: determinista, se recalcula al cargar y no ocupa espacio */
let GEN={hist:[],reps:[]};
function provsAll(){return PROV.concat(S.provNew||[])}
function rentAt(p,ym){
  if(p.moneda==="UF")return Math.round(p.monto*ufAt(ym));
  const am=Number((p.inicio||"2011-01-01").slice(5,7));
  const [y,m]=ym.split("-").map(Number);const a=(m>=am?y:y-1)+"-"+pad(am);
  const [ye,me]=GEN_END.split("-").map(Number);const ae=(me>=am?ye:ye-1)+"-"+pad(am);
  return Math.round(p.monto*ufAt(a)/ufAt(ae)/1000)*1000;
}
const gcAt=(p,ym)=>Math.round(p.gc.monto*ufAt(ym)/ufAt(GEN_END)/100)*100;
function buildGen(){
  const hist=[],reps=[];
  S.props.forEach((p,pi)=>{
    if(!p.tenancias||!p.tenancias.length)return;
    const R=rng(9001+pi*7919);const ri=(a,b)=>a+Math.floor(R()*(b-a+1));
    const owner=byId(S.owners,p.ownerId);
    const disc={};
    p.tenancias.forEach(tn=>{
      const end=tn.hasta||GEN_END;const tname=nombreActor(tn.tid);
      let t=ymAdd(tn.desde,ri(6,26));
      while(ymDiff(t,end)>=3&&t<=ymAdd(GEN_END,-3)){
        const cat=CATS[Math.floor(R()*CATS.length)];
        let cands=PROV.filter(v=>v.cat===cat.c&&v.ciudad===p.ciudad&&v.desde<=Number(t.slice(0,4)));if(!cands.length)cands=PROV.filter(v=>v.cat===cat.c);
        const pv=cands[Math.floor(R()*cands.length)];
        const monto=Math.round((cat.r[0]+R()*(cat.r[1]-cat.r[0]))*ufAt(t)/ufAt(GEN_END)/1000)*1000;
        const rent=rentAt(p,t),cuotas=monto>rent*0.5?3:monto>rent*0.2?2:1;
        const d1=ri(2,20),f=t+"-"+pad(d1);
        const fa=t+"-"+pad(Math.min(28,d1+ri(1,3)))+" "+pad(ri(9,21))+":"+pad(ri(0,59)),fc=t+"-"+pad(Math.min(28,d1+ri(4,9)))+" "+pad(ri(9,22))+":"+pad(ri(0,59));
        const id="g"+p.id+t.replace("-",""),ini=ymAdd(t,1);
        reps.push({id,gen:true,propId:p.id,tenantId:tn.tid,cat:cat.c,desc:cat.d[Math.floor(R()*cat.d.length)],provId:pv.id,monto,cuotas,estado:"conforme",fecha:f,
          aprobProp:{nombre:owner?owner.nombre:"Propietario",rol:"Propietario",fecha:fa},conformArr:{nombre:tname,rol:"Arrendatario",fecha:fc},inicioDesc:ini,descontadas:cuotas,rating:R()<.75?5:R()<.8?4:3});
        for(let k=0;k<cuotas;k++)disc[ymAdd(ini,k)]={m:cuotaN(monto,cuotas,k),r:id};
        t=ymAdd(t,ri(12,32));
      }
      let ym=tn.desde<GEN_START?GEN_START:tn.desde;
      while(ym<=end&&ym<=GEN_END){
        const y=Number(ym.slice(0,4));const late=R()<.12;const day=late?ri(6,24):ri(1,6);
        const md=y<2014?(R()<.55?"Transferencia":R()<.7?"Tarjeta de crédito":"Tarjeta de débito"):(R()<.48?"Tarjeta de crédito":R()<.45?"Tarjeta de débito":R()<.5?"Transferencia":"Tarjeta retail");
        const f=ym+"-"+pad(day),rent=rentAt(p,ym),dd=disc[ym];
        hist.push({id:"h"+p.id+ym,f,ym,p:p.id,t:tn.tid,c:"A",m:rent-(dd?dd.m:0),md,d:dd?dd.m:0,r:dd?dd.r:null});
        hist.push({id:"g"+p.id+ym,f,ym,p:p.id,t:tn.tid,c:"G",m:gcAt(p,ym),md,d:0,r:null});
        ym=ymAdd(ym,1);
      }
    });
  });
  GEN={hist,reps};
}

/* Sesión */
const ui={screen:"landing",uid:null,asUid:null,tab:null,filter:"todas",q:"",msgTo:null,year:null,repFilter:"activas",provCat:"todas",provCity:"todas",admSel:null,lab:{tipo:"todos",estado:"todos",q:""},loginErr:"",loginEmail:"",regErr:"",regHint:"tenant",asBo:false};
try{const s=JSON.parse(sessionStorage.getItem(SKEY)||localStorage.getItem(SKEY)||"null");if(s&&S.users.some(u=>u.id===s&&u.activo&&!u.bloqueado)){ui.uid=s;ui.screen="app"}}catch(e){}
const sessUser=()=>S.users.find(u=>u.id===ui.uid);
const cur=()=>S.users.find(u=>u.id===(ui.asUid||ui.uid));
const role=()=>!cur()?null:(ui.asBo&&!ui.asUid&&sessUser()&&sessUser().bo)?"bo":cur().role;
const meActor=()=>!cur()?null:role()==="bo"?"bo":cur().actorId;
function setSession(id,remember){try{sessionStorage.setItem(SKEY,JSON.stringify(id));if(remember)localStorage.setItem(SKEY,JSON.stringify(id));else localStorage.removeItem(SKEY)}catch(e){}}
function clearSession(){try{sessionStorage.removeItem(SKEY);localStorage.removeItem(SKEY)}catch(e){}}

/* Cálculos de negocio */
function byId(arr,id){return arr.find(x=>x.id===id)}
const prop=id=>byId(S.props,id);
const tenantOf=p=>p&&p.tenantId?byId(S.tenants,p.tenantId):null;
const ownerOf=p=>byId(S.owners,p.ownerId);
const admOf=p=>byId(S.administradoras,p.adminId);
const UF=()=>S.params.uf;
const rentCLP=p=>p.moneda==="UF"?rentaUF(p.monto,UF()):p.monto;
const rentLabel=p=>p.moneda==="UF"?"UF "+fmt.format(p.monto):clp(p.monto);
const histAll=()=>GEN.hist.concat(S.hist);
const repsAll=()=>GEN.reps.concat(S.repairs);
const repActive=r=>r.estado==="conforme"&&r.descontadas<r.cuotas&&!r.gen;
const repairsOn=p=>S.repairs.filter(r=>r.propId===p.id&&repActive(r));
/* Cuota que toca descontar ahora; cuotaBase es la que se muestra como referencia */
const cuota=r=>cuotaN(r.monto,r.cuotas,Math.min(r.descontadas,r.cuotas-1));
const cuotaBase=r=>cuotaN(r.monto,r.cuotas,0);
const descuento=p=>repairsOn(p).reduce((a,r)=>a+cuota(r),0);
const aPagarArriendo=p=>p.paid?0:aPagar(rentCLP(p),p.deuda,descuento(p),p.abono);
const aPagarGC=p=>p.gcPaid?0:p.gc.monto+p.gcDeuda;
function estado(p){
  if(!p.tenantId)return {k:"vacia",t:"Sin arrendatario",c:"p-mute"};
  if(p.deuda>0)return {k:"morosa",t:"Pago retrasado",c:"p-bad"};
  if(p.paid)return {k:"aldia",t:"Al día",c:"p-ok"};
  return {k:"aldia",t:"Pendiente del mes",c:"p-warn"};
}
const myProps=()=>{const r=role(),a=meActor();if(r==="admin")return S.props.filter(p=>p.adminId===a);if(r==="owner")return S.props.filter(p=>p.ownerId===a);if(r==="tenant")return S.props.filter(p=>p.tenantId===a);return S.props};
const arriendosMes=(ym,props)=>{const ids=new Set((props||S.props).map(p=>p.id));return histAll().filter(h=>h.ym===ym&&h.c==="A"&&ids.has(h.p)).reduce((a,h)=>a+h.m,0)};
const esperadoMes=props=>(props||S.props).filter(p=>p.tenantId).reduce((a,p)=>a+rentCLP(p),0);
function nombreActor(id){
  if(!id)return "";
  if(id==="bo"){const u=S.users.find(x=>x.actorId==="bo");return u?u.nombre:"Back office"}
  const c=id[0];
  if(c==="a"){const a=byId(S.administradoras,id);return a?a.contacto:"Administradora"}
  if(c==="o"){const o=byId(S.owners,id);return o?o.nombre:"Propietario"}
  if(c==="t"){const t=byId(S.tenants,id);return t?t.nombre:"Arrendatario"}
  if(c==="x"){const x=byId(S.exT,id);return x?x.nombre:"Arrendatario anterior"}
  return "Usuario";
}
const rolActor=id=>!id?"":id==="bo"?"Back office":id[0]==="a"?"Administradora":id[0]==="o"?"Propietario":"Arrendatario";
const empresaDe=id=>id&&id[0]==="a"?((byId(S.administradoras,id)||{}).nombre||""):"";
const proxReajuste=p=>addMonths(p.reajuste.ultimo,p.reajuste.periodo);
const rentab=p=>p.valorUF?(rentCLP(p)*12)/(p.valorUF*UF())*100:0;
const unread=()=>S.msgs.filter(m=>m.to===meActor()&&!m.read).length;
function recOf(id){if(!id||id==="bo")return null;const c=id[0];return c==="a"?byId(S.administradoras,id):c==="o"?byId(S.owners,id):c==="t"?byId(S.tenants,id):null}
function waOf(id){if(!id)return "";const rec=recOf(id);const u=S.users.find(x=>x.actorId===id&&x.wa);return (rec&&rec.wa)||(u&&u.wa)||""}
function setWa(id,num){const rec=recOf(id);if(rec)rec.wa=num;S.users.filter(u=>u.actorId===id).forEach(u=>u.wa=num)}
function fillTpl(p){const tn=tenantOf(p);return S.params.plantilla.replace(/\{nombre\}/g,tn?tn.nombre.split(" ")[0]:"").replace(/\{direccion\}/g,p.dir).replace(/\{monto\}/g,clp(aPagarArriendo(p))).replace(/\{vence\}/g,dmy(S.periodo.vence))}
function liquidacion(p){
  const a=admOf(p);
  const rec=histAll().filter(h=>h.ym===S.periodo.ym&&h.p===p.id&&h.c==="A");
  const bruto=rec.reduce((s,h)=>s+h.m+h.d,0),desc=rec.reduce((s,h)=>s+h.d,0);
  const l=calcLiquidacion(bruto,desc,a?a.comisionAdm:8);
  return {bruto,desc,com:l.com,iva:l.iva,neto:l.neto,pagado:rec.length>0};
}
const provRating=id=>{const all=repsAll().filter(r=>r.provId===id&&r.estado==="conforme");const rs=all.filter(r=>r.rating);return {n:all.length,avg:rs.length?rs.reduce((a,r)=>a+r.rating,0)/rs.length:0}};
const provById=id=>provsAll().find(p=>p.id===id);

/* Lab: ideas y cambios en el almacén compartido */
const LAB={mode:"loading",items:[],db:null};
function labLocal(){try{return JSON.parse(localStorage.getItem(LABKEY)||"[]")}catch(e){return []}}
function labLocalSave(){try{localStorage.setItem(LABKEY,JSON.stringify(LAB.items))}catch(e){}}
function useLocalLab(){LAB.mode="local";LAB.db=null;LAB.items=labLocal();if(ui.tab==="lab"||ui.tab==="panel")render()}
(async function initLab(){
  let db=null;
  try{if(window.claude&&typeof window.claude.use==="function")db=await window.claude.use("db")}catch(e){db=null}
  if(!db){useLocalLab();return}
  LAB.db=db;
  try{db.collection("lab").onSnapshot(snap=>{LAB.mode="db";LAB.items=snap.docs.map(d=>Object.assign({id:d.id},d.data()));if(ui.screen==="app"&&(ui.tab==="lab"||ui.tab==="panel"))render()},()=>useLocalLab())}catch(e){useLocalLab()}
})();
async function labAdd(item){if(LAB.mode==="db"&&LAB.db){await LAB.db.collection("lab").add(item);return}LAB.items.push(Object.assign({id:uid("l")},item));labLocalSave();render()}
async function labUpdate(id,fields){if(LAB.mode==="db"&&LAB.db){await LAB.db.doc("lab/"+id).update(fields);return}const it=LAB.items.find(x=>x.id===id);if(it)Object.assign(it,fields);labLocalSave();render()}
async function labDelete(id){if(LAB.mode==="db"&&LAB.db){await LAB.db.doc("lab/"+id).delete();return}LAB.items=LAB.items.filter(x=>x.id!==id);labLocalSave();render()}
const labErr=e=>{const c=e&&e.code;toast(c==="invalid_argument"?"No tienes permiso para escribir en el Lab":c==="quota_exceeded"?"El Lab llegó a su capacidad máxima":"No se pudo guardar. Inténtalo de nuevo")};
