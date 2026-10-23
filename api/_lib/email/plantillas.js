/* KLIP: plantillas de email transaccional. Funciones puras: reciben datos y devuelven {asunto, html, texto} */
"use strict";
const {esc,clp,dmy,ymLabel}=require("../../../js/calc.js");

const AZUL="#2463AC",NAVY="#22285A",GRIS="#5B6888",FONDO="#F1F6FE";

/* Estructura común: cabecera de marca, cuerpo, botón opcional y pie legal. Tablas y estilos en línea para que se vea bien en Gmail y Outlook */
function layout({titulo,parrafos,boton,detalle,pie}){
  const filas=(detalle||[]).map(([k,v,fuerte])=>`<tr><td style="padding:6px 0;color:${GRIS};font-size:14px">${esc(k)}</td><td style="padding:6px 0;text-align:right;font-size:14px;color:${NAVY};${fuerte?"font-weight:700;":""}">${esc(v)}</td></tr>`).join("");
  const html=`<!doctype html><html lang="es-CL"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>${esc(titulo)}</title></head>
<body style="margin:0;padding:0;background:${FONDO};font-family:Segoe UI,Helvetica,Arial,sans-serif;color:${NAVY}">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${FONDO};padding:24px 12px"><tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #D5E0F0">
<tr><td style="background:${AZUL};padding:18px 24px;color:#ffffff;font-size:22px;font-weight:700;letter-spacing:.5px">KLIP<span style="color:#CFE3FF">.CL</span></td></tr>
<tr><td style="padding:24px">
<h1 style="margin:0 0 14px;font-size:21px;color:${NAVY}">${esc(titulo)}</h1>
${parrafos.map(p=>`<p style="margin:0 0 12px;font-size:15px;line-height:1.5">${esc(p)}</p>`).join("")}
${filas?`<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:8px 0 16px;border-top:1px solid #D5E0F0;border-bottom:1px solid #D5E0F0">${filas}</table>`:""}
${boton?`<p style="margin:20px 0 8px"><a href="${esc(boton.url)}" style="display:inline-block;background:${AZUL};color:#ffffff;text-decoration:none;font-weight:700;padding:12px 22px;border-radius:8px">${esc(boton.texto)}</a></p><p style="margin:0;font-size:12px;color:${GRIS}">Si el botón no funciona, copia este enlace: ${esc(boton.url)}</p>`:""}
</td></tr>
<tr><td style="padding:16px 24px;background:${FONDO};font-size:12px;color:${GRIS};line-height:1.5">${esc(pie||"Recibes este correo porque tienes una cuenta en KLIP. Es un aviso automático; para consultas, escribe a tu administradora desde la plataforma.")}</td></tr>
</table></td></tr></table></body></html>`;
  const texto=[titulo,"",...parrafos,...(detalle||[]).map(([k,v])=>k+": "+v),...(boton?["",boton.texto+": "+boton.url]:[]),"","KLIP.CL"].join("\n");
  return {asunto:titulo,html,texto};
}

const primer=n=>String(n||"").trim().split(/\s+/)[0]||"";

const PLANTILLAS={
  invitacion:d=>layout({titulo:"Activa tu cuenta en KLIP",
    parrafos:[`Hola ${primer(d.nombre)},`,`${d.administradora||"Tu administradora"} te dio de alta en KLIP como ${d.rol||"usuario"}. Desde ahí verás tus cobros, pagos y reparaciones.`,"Crea tu contraseña con el botón. El enlace caduca en 24 horas."],
    boton:{texto:"Activar mi cuenta",url:d.enlace}}),
  recuperacion:d=>layout({titulo:"Restablece tu contraseña",
    parrafos:[`Hola ${primer(d.nombre)},`,"Recibimos una solicitud para cambiar la contraseña de tu cuenta. El enlace caduca en 1 hora.","Si no la pediste tú, ignora este correo: tu contraseña sigue igual."],
    boton:{texto:"Crear nueva contraseña",url:d.enlace}}),
  cobro_emitido:d=>layout({titulo:`Tu cobro de ${ymLabel(d.periodo)}`,
    parrafos:[`Hola ${primer(d.nombre)},`,`Ya está disponible el cobro de ${d.direccion}.`],
    detalle:[["Arriendo",clp(d.arriendo)],...(d.descuento?[["Descuento por reparación","-"+clp(d.descuento)]]:[]),...(d.saldo?[["Saldo anterior",clp(d.saldo)]]:[]),...(d.gastosComunes?[["Gastos comunes",clp(d.gastosComunes)]]:[]),["Total a pagar",clp(d.total),true],["Vence",dmy(d.vence)]],
    boton:{texto:"Ver y pagar",url:d.enlace}}),
  recordatorio:d=>layout({titulo:`Tu arriendo vence el ${dmy(d.vence)}`,
    parrafos:[`Hola ${primer(d.nombre)},`,`Te recordamos que el pago de ${d.direccion} por ${clp(d.total)} vence el ${dmy(d.vence)}.`,"Si ya pagaste, no hace falta que hagas nada."],
    boton:{texto:"Pagar ahora",url:d.enlace}}),
  comprobante_pago:d=>layout({titulo:"Recibimos tu pago",
    parrafos:[`Hola ${primer(d.nombre)},`,`Registramos tu pago de ${d.direccion}. Guarda este correo como comprobante.`],
    detalle:[["Comprobante",d.comprobante],["Fecha",dmy(d.fecha)],["Medio",d.medio],["Concepto",d.concepto],["Monto",clp(d.monto),true],...(d.pendiente?[["Queda por pagar",clp(d.pendiente)]]:[])]}),
  aviso_pago_propietario:d=>layout({titulo:`Pago recibido en ${d.direccion}`,
    parrafos:[`Hola ${primer(d.nombre)},`,`${d.arrendatario} pagó ${clp(d.monto)} correspondiente a ${ymLabel(d.periodo)}. Tu liquidación se transfiere en 72 horas hábiles.`],
    boton:{texto:"Ver mi liquidación",url:d.enlace}}),
  liquidacion:d=>layout({titulo:`Tu liquidación de ${ymLabel(d.periodo)}`,
    parrafos:[`Hola ${primer(d.nombre)},`,`Este es el detalle de lo que recibirás por ${d.direccion}.`],
    detalle:[["Canon cobrado",clp(d.bruto)],...(d.reparaciones?[["Reparaciones",`-${clp(d.reparaciones)}`]]:[]),[`Comisión de administración ${String(d.comisionPct).replace(".",",")}%`,`-${clp(d.comision)}`],["IVA de la comisión",`-${clp(d.iva)}`],["Neto a transferir",clp(d.neto),true]],
    boton:{texto:"Ver el detalle",url:d.enlace}}),
  reparacion_solicitada:d=>layout({titulo:"Nueva solicitud de reparación",
    parrafos:[`Hola ${primer(d.nombre)},`,`${d.arrendatario} solicitó una reparación en ${d.direccion}: ${d.descripcion}.`,"Revísala y apruébala o recházala en la plataforma."],
    detalle:[["Categoría",d.categoria],["Presupuesto",clp(d.monto)],["Descuento propuesto",`${d.cuotas} ${d.cuotas===1?"cuota":"cuotas"}`]],
    boton:{texto:"Revisar la solicitud",url:d.enlace}}),
  reparacion_aprobada:d=>layout({titulo:"Tu reparación fue aprobada",
    parrafos:[`Hola ${primer(d.nombre)},`,`Se aprobó "${d.descripcion}" por ${clp(d.monto)} en ${d.cuotas} ${d.cuotas===1?"cuota":"cuotas"}.`,"Cuando el trabajo esté terminado, confirma tu conformidad en KLIP para que empiece el descuento en tu arriendo."],
    boton:{texto:"Confirmar cuando esté listo",url:d.enlace}}),
  acta_firmada:d=>layout({titulo:"Acta de reparación firmada",
    parrafos:[`Hola ${primer(d.nombre)},`,`El acta de "${d.descripcion}" en ${d.direccion} quedó firmada por ambas partes. El descuento empieza en el cobro de ${ymLabel(d.inicio)}.`],
    boton:{texto:"Ver el acta",url:d.enlace}}),
  contrato_iniciado:d=>layout({titulo:`Bienvenido a ${d.direccion}`,
    parrafos:[`Hola ${primer(d.nombre)},`,`Tu contrato empieza el ${dmy(d.inicio)} y el primer cobro es el de ${ymLabel(d.periodo)}.`],
    detalle:[["Canon",d.canon],["Garantía",d.garantia],["Reajuste",d.reajuste]],
    boton:{texto:"Entrar a KLIP",url:d.enlace}}),
  contrato_terminado:d=>layout({titulo:"Término de contrato registrado",
    parrafos:[`Hola ${primer(d.nombre)},`,`Registramos el término del contrato de ${d.direccion} el ${dmy(d.fecha)}.`],
    detalle:[["Arriendo pendiente",clp(d.arriendo)],["Gastos comunes pendientes",clp(d.gc)],["Cuotas de reparación sin descontar","-"+clp(d.cuotasPend)],["Garantía","-"+clp(d.garantia)],[d.neto>0?"Saldo a pagar":d.neto<0?"Se te devuelve":"Saldo",clp(Math.abs(d.neto)),true]]}),
  prueba:d=>layout({titulo:"Prueba de envío de KLIP",
    parrafos:["Si lees esto, el dominio de envío y el proveedor están bien configurados.",`Enviado el ${d.fecha} desde el entorno ${d.entorno}.`]})
};

function renderizar(nombre,datos){
  const f=PLANTILLAS[nombre];
  if(!f)throw new Error("Plantilla de email desconocida: "+nombre);
  return f(datos||{});
}

module.exports={renderizar,PLANTILLAS:Object.keys(PLANTILLAS)};
