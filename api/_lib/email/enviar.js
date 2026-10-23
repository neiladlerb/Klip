/* KLIP: envío de email a través de Resend (API REST, sin dependencias).
   Sin RESEND_API_KEY, o con EMAIL_MODO=simulado, no envía nada y devuelve el correo renderizado */
"use strict";
const {renderizar}=require("./plantillas.js");
const {emailValido}=require("../../../js/calc.js");

const API="https://api.resend.com/emails";

function config(env){
  env=env||process.env;
  return {
    clave:env.RESEND_API_KEY||"",
    remitente:env.EMAIL_REMITENTE||"KLIP <no-responder@notificaciones.klip.cl>",
    responderA:env.EMAIL_RESPONDER_A||"",
    modo:(env.EMAIL_MODO||"").toLowerCase()==="real"&&env.RESEND_API_KEY?"real":"simulado"
  };
}

/* opts: {para, plantilla, datos, idempotencia, etiquetas}; deps permite inyectar fetch, env y registro en pruebas */
async function enviarEmail(opts,deps){
  deps=deps||{};
  const cfg=config(deps.env),registrar=deps.registrar||(()=>{});
  const para=String(opts.para||"").trim().toLowerCase();
  if(!emailValido(para))throw new Error("Destinatario no válido");
  const {asunto,html,texto}=renderizar(opts.plantilla,opts.datos);
  const base={para,plantilla:opts.plantilla,asunto};
  if(cfg.modo!=="real"){const r={...base,estado:"simulado",html,texto};await registrar(r);return r}
  const cuerpo={from:cfg.remitente,to:[para],subject:asunto,html,text:texto};
  if(cfg.responderA)cuerpo.reply_to=cfg.responderA;
  if(opts.etiquetas)cuerpo.tags=Object.entries(opts.etiquetas).map(([name,value])=>({name,value:String(value).replace(/[^A-Za-z0-9_-]/g,"_")}));
  const cab={"Authorization":"Bearer "+cfg.clave,"Content-Type":"application/json"};
  if(opts.idempotencia)cab["Idempotency-Key"]=String(opts.idempotencia).slice(0,256);
  const f=deps.fetch||fetch;
  let ultimo="";
  /* Reintenta solo errores temporales (límite de envío o fallo del proveedor), hasta 3 intentos */
  for(let i=0;i<3;i++){
    let res;
    try{res=await f(API,{method:"POST",headers:cab,body:JSON.stringify(cuerpo)})}
    catch(e){ultimo="Sin conexión con el proveedor: "+e.message;continue}
    const j=await res.json().catch(()=>({}));
    if(res.ok){const r={...base,estado:"enviado",proveedorId:j.id};await registrar(r);return r}
    ultimo=(j&&j.message)||("HTTP "+res.status);
    if(res.status!==429&&res.status<500)break;
    if(deps.esperar!==false)await new Promise(ok=>setTimeout(ok,500*2**i));
  }
  const r={...base,estado:"error",error:ultimo};await registrar(r);return r;
}

module.exports={enviarEmail,config};
