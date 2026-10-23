"use strict";
const test=require("node:test");
const assert=require("node:assert/strict");
const {renderizar,PLANTILLAS}=require("../api/_lib/email/plantillas.js");
const {enviarEmail,config}=require("../api/_lib/email/enviar.js");

const DATOS={nombre:"Camila Rojas",administradora:"Salinas Gestión",rol:"arrendataria",enlace:"https://www.klip.cl/x?a=1&b=2",periodo:"2026-10",direccion:"Los Piñones 1240",
  arriendo:520000,descuento:30000,saldo:0,gastosComunes:85000,total:575000,vence:"2026-11-05",comprobante:"KLIP-123456",fecha:"2026-10-23",medio:"Transferencia",concepto:"Arriendo octubre",
  monto:575000,pendiente:0,arrendatario:"Camila Rojas",bruto:729000,reparaciones:0,comisionPct:8,comision:58320,iva:11081,neto:659599,descripcion:"Cambio de chapa",categoria:"Cerrajería",
  cuotas:2,inicio:"2026-10",canon:"$520.000",garantia:520000,reajuste:"IPC cada 12 meses",gc:0,cuotasPend:30000,entorno:"pruebas"};

test("todas las plantillas se generan sin huecos",()=>{
  assert.ok(PLANTILLAS.length>=13);
  for(const p of PLANTILLAS){
    const r=renderizar(p,DATOS);
    assert.ok(r.asunto&&r.html&&r.texto,p);
    for(const malo of ["undefined","NaN","null","[object"])assert.ok(!r.html.includes(malo)&&!r.texto.includes(malo),p+" contiene "+malo);
    assert.ok(r.html.startsWith("<!doctype html>"),p);
  }
});

test("los datos se escapan en el HTML",()=>{
  const r=renderizar("invitacion",{...DATOS,nombre:"<script>alert(1)</script> Pérez",administradora:"A&B \"Propiedades\""});
  assert.ok(!r.html.includes("<script>"));
  assert.ok(r.html.includes("&lt;script&gt;"));
  assert.ok(r.html.includes("A&amp;B &quot;Propiedades&quot;"));
  assert.ok(r.html.includes('href="https://www.klip.cl/x?a=1&amp;b=2"'));
});

test("liquidación con los importes correctos",()=>{
  const r=renderizar("liquidacion",DATOS);
  for(const v of ["$729.000","-$58.320","-$11.081","$659.599"])assert.ok(r.texto.includes(v),v);
});

test("plantilla desconocida da error",()=>{
  assert.throws(()=>renderizar("no_existe",{}),/desconocida/);
});

test("sin clave del proveedor el envío es simulado",async()=>{
  const llamadas=[];
  const r=await enviarEmail({para:"Camila@Correo.cl",plantilla:"recordatorio",datos:DATOS},{env:{EMAIL_MODO:"real"},fetch:async()=>{llamadas.push(1)}});
  assert.equal(r.estado,"simulado");
  assert.equal(r.para,"camila@correo.cl");
  assert.equal(llamadas.length,0);
  assert.equal(config({RESEND_API_KEY:"x"}).modo,"simulado","sin EMAIL_MODO=real no envía");
});

test("destinatario no válido",async()=>{
  await assert.rejects(()=>enviarEmail({para:"no-es-correo",plantilla:"prueba",datos:{}},{env:{}}),/no válido/);
});

const ENV={RESEND_API_KEY:"re_test",EMAIL_MODO:"real",EMAIL_REMITENTE:"KLIP <no-responder@notificaciones.klip.cl>",EMAIL_RESPONDER_A:"contacto@klip.cl"};
const resp=(status,body)=>({ok:status>=200&&status<300,status,json:async()=>body});

test("envío real: petición a Resend bien formada",async()=>{
  let pedido;const registros=[];
  const r=await enviarEmail({para:"camila@correo.cl",plantilla:"comprobante_pago",datos:DATOS,idempotencia:"pago-1",etiquetas:{tipo:"comprobante pago"}},
    {env:ENV,fetch:async(url,o)=>{pedido={url,o};return resp(200,{id:"em_1"})},registrar:x=>registros.push(x)});
  assert.equal(r.estado,"enviado");assert.equal(r.proveedorId,"em_1");
  assert.equal(pedido.url,"https://api.resend.com/emails");
  assert.equal(pedido.o.headers.Authorization,"Bearer re_test");
  assert.equal(pedido.o.headers["Idempotency-Key"],"pago-1");
  const b=JSON.parse(pedido.o.body);
  assert.deepEqual(b.to,["camila@correo.cl"]);
  assert.equal(b.from,ENV.EMAIL_REMITENTE);assert.equal(b.reply_to,"contacto@klip.cl");
  assert.equal(b.subject,"Recibimos tu pago");assert.ok(b.text.includes("$575.000"));
  assert.deepEqual(b.tags,[{name:"tipo",value:"comprobante_pago"}]);
  assert.equal(registros.length,1);assert.equal(registros[0].estado,"enviado");
});

test("reintenta si el proveedor limita el envío",async()=>{
  let n=0;
  const r=await enviarEmail({para:"a@b.cl",plantilla:"prueba",datos:{}},{env:ENV,esperar:false,fetch:async()=>(++n<3?resp(429,{message:"Too many requests"}):resp(200,{id:"em_2"}))});
  assert.equal(r.estado,"enviado");assert.equal(n,3);
});

test("no reintenta errores definitivos y lo registra",async()=>{
  let n=0;const registros=[];
  const r=await enviarEmail({para:"a@b.cl",plantilla:"prueba",datos:{}},{env:ENV,esperar:false,registrar:x=>registros.push(x),fetch:async()=>{n++;return resp(422,{message:"Domain not verified"})}});
  assert.equal(r.estado,"error");assert.equal(n,1);assert.match(r.error,/Domain not verified/);
  assert.equal(registros[0].estado,"error");
});

/* Función de Vercel: req/res mínimos */
function llamar(handler,{method="POST",auth}={}){
  return new Promise(ok=>{
    const res={h:{},code:200,setHeader(k,v){this.h[k]=v},status(c){this.code=c;return this},json(b){ok({code:this.code,body:b,h:this.h})}};
    handler({method,headers:auth?{authorization:auth}:{}},res);
  });
}
test("función de prueba: protegida y solo al destino configurado",async()=>{
  const prev={...process.env};
  try{
    delete process.env.RESEND_API_KEY;
    const h=require("../api/email-prueba.js");
    assert.equal((await llamar(h,{method:"GET"})).code,405);
    delete process.env.EMAIL_PRUEBA_TOKEN;delete process.env.EMAIL_PRUEBA_DESTINO;
    assert.equal((await llamar(h,{auth:"Bearer x"})).code,503);
    process.env.EMAIL_PRUEBA_TOKEN="secreto-largo";process.env.EMAIL_PRUEBA_DESTINO="neil@ejemplo.cl";
    assert.equal((await llamar(h,{auth:"Bearer otro"})).code,401);
    assert.equal((await llamar(h,{})).code,401);
    const ok=await llamar(h,{auth:"Bearer secreto-largo"});
    assert.equal(ok.code,200);assert.equal(ok.body.estado,"simulado");assert.equal(ok.body.para,"neil@ejemplo.cl");
    assert.equal(ok.h["Cache-Control"],"no-store");
  }finally{process.env=prev}
});
