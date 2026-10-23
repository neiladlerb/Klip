"use strict";
const test=require("node:test");
const assert=require("node:assert/strict");
const C=require("../js/calc.js");

test("formato de pesos chilenos",()=>{
  assert.equal(C.clp(1234567),"$1.234.567");
  assert.equal(C.clp(0),"$0");
  assert.equal(C.clp(null),"$0");
  assert.equal(C.clp(999.6),"$1.000");
});

test("fechas: meses y días",()=>{
  assert.equal(C.ymAdd("2026-12",1),"2027-01");
  assert.equal(C.ymAdd("2026-01",-1),"2025-12");
  assert.equal(C.ymAdd("2026-10",-24),"2024-10");
  assert.equal(C.ymDiff("2025-11","2026-02"),3);
  assert.equal(C.ymLabel("2026-10"),"Octubre 2026");
  assert.equal(C.dmy("2026-11-05"),"05-11-2026");
  assert.equal(C.dmy("2026-10-10 18:42"),"10-10-2026 18:42");
  assert.equal(C.dmy(null),"Sin registro");
});

test("addMonths ajusta al último día del mes",()=>{
  assert.equal(C.addMonths("2026-03-01",12),"2027-03-01");
  assert.equal(C.addMonths("2026-01-31",1),"2026-02-28");
  assert.equal(C.addMonths("2028-01-31",1),"2028-02-29");
  assert.equal(C.addMonths("2026-08-31",6),"2027-02-28");
  assert.equal(C.addMonths("2026-11-15",2),"2027-01-15");
});

test("UF interpolada por mes",()=>{
  assert.equal(C.ufAt("2011-01"),21456);
  assert.equal(C.ufAt("2010-05"),21456);
  assert.equal(C.ufAt("2026-10"),40500);
  assert.equal(C.ufAt("2030-01"),40500);
  const mid=C.ufAt("2011-07");
  assert.ok(mid>21456&&mid<22294);
  assert.equal(C.rentaUF(18,40500),729000);
});

test("las cuotas de una reparación suman el monto exacto",()=>{
  assert.deepEqual([0,1,2].map(k=>C.cuotaN(385000,3,k)),[128333,128333,128334]);
  for(const [monto,n] of [[385000,3],[60000,2],[270000,3],[100001,6],[99999,1],[1000,6]]){
    let s=0;for(let k=0;k<n;k++)s+=C.cuotaN(monto,n,k);
    assert.equal(s,monto,monto+" en "+n);
  }
});

test("saldo a pagar del arriendo",()=>{
  assert.equal(C.aPagar(520000,0,0,0),520000);
  assert.equal(C.aPagar(450000,450000,0,0),900000);
  assert.equal(C.aPagar(450000,450000,0,100000),800000);
  assert.equal(C.aPagar(610000,0,90000,0),520000);
  assert.equal(C.aPagar(100000,0,150000,0),0);
  assert.equal(C.aPagar(100000,undefined,undefined,undefined),100000);
});

test("liquidación al propietario: ejemplo de la portada",()=>{
  assert.deepEqual(C.calcLiquidacion(729000,0,8),{com:58320,iva:11081,neto:659599});
});

test("liquidación con descuento por reparación",()=>{
  const l=C.calcLiquidacion(610000,90000,8);
  assert.equal(l.com,48800);
  assert.equal(l.iva,9272);
  assert.equal(l.neto,610000-90000-48800-9272);
});

test("reajuste IPC redondeado a miles",()=>{
  assert.equal(C.reajusteIPC(450000,4.1),468000);
  assert.equal(C.reajusteIPC(520000,0),520000);
  assert.equal(C.reajusteIPC(480000,-1.2),474000);
});

test("política de contraseñas",()=>{
  assert.ok(C.passwordValida("Klip2026!"));
  assert.ok(!C.passwordValida("corta1"));
  assert.ok(!C.passwordValida("sinnumeros"));
  assert.ok(!C.passwordValida("12345678"));
  assert.ok(!C.passwordValida(undefined));
});

test("escapado de HTML",()=>{
  assert.equal(C.esc(`<img src=x onerror="a('b')">&`),"&lt;img src=x onerror=&quot;a(&#39;b&#39;)&quot;&gt;&amp;");
  assert.equal(C.esc(null),"");
});

test("enlace de WhatsApp",()=>{
  assert.equal(C.waUrl("+56 9 1234 5678","Hola"),"https://wa.me/56912345678?text=Hola");
  assert.equal(C.waUrl("123","Hola KLIP"),"https://wa.me/?text=Hola%20KLIP");
});

test("generador pseudoaleatorio determinista",()=>{
  const a=C.rng(42),b=C.rng(42);
  for(let i=0;i<5;i++)assert.equal(a(),b());
});

test("hash de contraseña de la demo",async()=>{
  assert.equal(await C.hashPw("Klip2026!"),"d4d094474146caeb0a318f2ff871004afdaca7d1126026a2f8b609809d232c4b");
});

test("cuotas que quedan por descontar",()=>{
  assert.equal(C.cuotasRestantes(270000,3,1),180000);
  assert.equal(C.cuotasRestantes(385000,3,0),385000);
  assert.equal(C.cuotasRestantes(385000,3,2),128334);
  assert.equal(C.cuotasRestantes(385000,3,3),0);
  assert.equal(C.cuotasRestantes(60000,2,-1),60000);
});

test("liquidación de salida al terminar un contrato",()=>{
  assert.deepEqual(C.calcSalida({arriendo:0,gc:0,cuotasPend:180000,garantia:610000}),{cargos:0,abonos:790000,neto:-790000});
  assert.deepEqual(C.calcSalida({arriendo:900000,gc:62000,cuotasPend:0,garantia:450000}),{cargos:962000,abonos:450000,neto:512000});
  assert.equal(C.calcSalida({}).neto,0);
});

test("formato de correo",()=>{
  assert.ok(C.emailValido("ana.perez@correo.cl"));
  assert.ok(!C.emailValido("ana@correo"));
  assert.ok(!C.emailValido("ana perez@correo.cl"));
  assert.ok(!C.emailValido(""));
});
