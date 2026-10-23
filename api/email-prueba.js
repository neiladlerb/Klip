/* KLIP: función de Vercel para comprobar que el envío de email funciona tras configurar el DNS.
   POST con cabecera Authorization: Bearer <EMAIL_PRUEBA_TOKEN>. Solo envía a EMAIL_PRUEBA_DESTINO,
   nunca a una dirección recibida en la petición, para que no se pueda usar como relé de spam */
"use strict";
const crypto=require("crypto");
const {enviarEmail}=require("./_lib/email/enviar.js");

const igual=(a,b)=>{const x=Buffer.from(String(a)),y=Buffer.from(String(b));return x.length===y.length&&crypto.timingSafeEqual(x,y)};

module.exports=async(req,res)=>{
  res.setHeader("Cache-Control","no-store");
  if(req.method!=="POST"){res.setHeader("Allow","POST");return res.status(405).json({error:"Usa POST"})}
  const token=process.env.EMAIL_PRUEBA_TOKEN,destino=process.env.EMAIL_PRUEBA_DESTINO;
  if(!token||!destino)return res.status(503).json({error:"Falta configurar EMAIL_PRUEBA_TOKEN y EMAIL_PRUEBA_DESTINO"});
  const auth=String(req.headers.authorization||"").replace(/^Bearer\s+/i,"");
  if(!igual(auth,token))return res.status(401).json({error:"No autorizado"});
  try{
    const r=await enviarEmail({para:destino,plantilla:"prueba",datos:{fecha:new Date().toISOString(),entorno:process.env.VERCEL_ENV||"local"}});
    return res.status(r.estado==="error"?502:200).json({estado:r.estado,para:r.para,proveedorId:r.proveedorId||null,error:r.error||null});
  }catch(e){return res.status(500).json({error:e.message})}
};
