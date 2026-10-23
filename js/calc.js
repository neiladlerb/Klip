/* KLIP: funciones de cálculo puras. No dependen del estado ni del DOM, por eso se prueban con node --test */
"use strict";
const fmt=new Intl.NumberFormat("es-CL");
const clp=n=>"$"+fmt.format(Math.round(n||0));
const mill=v=>"$"+(v/1e6).toLocaleString("es-CL",{minimumFractionDigits:1,maximumFractionDigits:1})+"M";
const esc=s=>String(s==null?"":s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const MESES=["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
const pad=n=>String(n).padStart(2,"0");
const pad3=n=>String(n).padStart(3,"0");
const todayISO=()=>{const d=new Date();return d.getFullYear()+"-"+pad(d.getMonth()+1)+"-"+pad(d.getDate())};
const nowISO=()=>{const d=new Date();return todayISO()+" "+pad(d.getHours())+":"+pad(d.getMinutes())};
const dmy=iso=>{if(!iso)return "Sin registro";const [y,m,d]=iso.slice(0,10).split("-");return (d?d+"-":"")+m+"-"+y+(iso.length>10?" "+iso.slice(11):"")};
const addMonths=(iso,n)=>{const [y,m,d]=iso.split("-").map(Number);const last=new Date(y,m+n,0).getDate();const dt=new Date(y,m-1+n,Math.min(d||1,last));return dt.getFullYear()+"-"+pad(dt.getMonth()+1)+"-"+pad(dt.getDate())};
const ymAdd=(ym,n)=>{const [y,m]=ym.split("-").map(Number);const t=y*12+(m-1)+n;return Math.floor(t/12)+"-"+pad(t%12+1)};
const ymDiff=(a,b)=>{const [y1,m1]=a.split("-").map(Number),[y2,m2]=b.split("-").map(Number);return (y2*12+m2)-(y1*12+m1)};
const ymLabel=ym=>{const [y,m]=ym.split("-").map(Number);return MESES[m-1]+" "+y};
const ymShort=ym=>MESES[Number(ym.split("-")[1])-1].slice(0,3);
const uid=p=>p+Math.random().toString(36).slice(2,8);
const slug=s=>s.normalize("NFD").replace(/[̀-ͯ]/g,"").toLowerCase().replace(/[^a-z0-9]+/g,".").replace(/^\.|\.$/g,"");
const pct1=v=>v.toFixed(1).replace(".",",")+"%";
const stars=r=>{const n=Math.round(r);return "★".repeat(n)+"☆".repeat(5-n)};
function rng(seed){let s=seed>>>0;return function(){s=s+0x6D2B79F5|0;let t=Math.imul(s^s>>>15,1|s);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
async function hashPw(pw){const data=new TextEncoder().encode("klip-demo:"+pw);const buf=await crypto.subtle.digest("SHA-256",data);return Array.from(new Uint8Array(buf)).map(b=>b.toString(16).padStart(2,"0")).join("")}

/* UF aproximada por mes (valores de referencia, no oficiales) */
const UFA=[["2011-01",21456],["2012-01",22294],["2013-01",22841],["2014-01",23312],["2015-01",24564],["2016-01",25631],["2017-01",26348],["2018-01",26799],["2019-01",27566],["2020-01",28310],["2021-01",29070],["2022-01",30996],["2023-01",35122],["2024-01",36794],["2025-01",38416],["2026-01",39728],["2026-10",40500]];
function ufAt(ym){if(ym<=UFA[0][0])return UFA[0][1];for(let i=1;i<UFA.length;i++){if(ym<=UFA[i][0]){const a=UFA[i-1],b=UFA[i],k=ymDiff(a[0],ym)/ymDiff(a[0],b[0]);return Math.round(a[1]+(b[1]-a[1])*k)}}return UFA[UFA.length-1][1]}

/* Reglas de negocio */
const IVA=0.19;
/* Cuota k (desde 0) de un monto repartido en n cuotas: la última absorbe el redondeo para que la suma cuadre */
const cuotaN=(monto,n,k)=>{const base=Math.floor(monto/n);return k>=n-1?monto-base*(n-1):base};
const rentaUF=(uf,valorUF)=>Math.round(uf*valorUF);
/* Saldo de arriendo a pagar en el mes: canon + saldo anterior - cuotas de reparación - abonos, nunca negativo */
const aPagar=(renta,deuda,desc,abono)=>Math.max(0,renta+(deuda||0)-(desc||0)-(abono||0));
/* Liquidación al propietario: la comisión de administración se calcula sobre el canon bruto y lleva IVA */
function calcLiquidacion(bruto,desc,pctAdm){const com=Math.round(bruto*pctAdm/100),iva=Math.round(com*IVA);return {com,iva,neto:bruto-desc-com-iva}}
/* Reajuste IPC de un canon en pesos, redondeado a miles */
const reajusteIPC=(monto,pct)=>Math.round(monto*(1+pct/100)/1000)*1000;
/* Suma de las cuotas k = desde..n-1 que quedan por descontar */
const cuotasRestantes=(monto,n,desde)=>{let s=0;for(let k=Math.max(0,desde);k<n;k++)s+=cuotaN(monto,n,k);return s};
/* Liquidación de salida al terminar un contrato: lo que debe el arrendatario menos lo que se le devuelve.
   neto > 0: paga el arrendatario; neto < 0: el propietario le devuelve esa cantidad */
function calcSalida({arriendo=0,gc=0,cuotasPend=0,garantia=0}){const cargos=arriendo+gc,abonos=cuotasPend+garantia;return {cargos,abonos,neto:cargos-abonos}}
const emailValido=e=>/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(String(e||""));
const passwordValida=p=>typeof p==="string"&&p.length>=8&&/[A-Za-z]/.test(p)&&/\d/.test(p);
const waDigits=s=>String(s||"").replace(/\D/g,"");
const waUrl=(num,text)=>{const d=waDigits(num);return "https://wa.me/"+(d.length>=8?d:"")+"?text="+encodeURIComponent(text)};

if(typeof module!=="undefined"&&module.exports)module.exports={fmt,clp,mill,esc,MESES,pad,pad3,dmy,addMonths,ymAdd,ymDiff,ymLabel,ymShort,slug,pct1,stars,rng,hashPw,UFA,ufAt,IVA,cuotaN,rentaUF,aPagar,calcLiquidacion,cuotasRestantes,calcSalida,emailValido,reajusteIPC,passwordValida,waDigits,waUrl};
