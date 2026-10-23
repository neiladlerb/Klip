/* KLIP: constantes, catálogos y datos de ejemplo (todos ficticios) */
"use strict";
const KEY="klip-demo-v5",SKEY="klip-session",LABKEY="klip-lab-local";
const DEFAULT_HASH="d4d094474146caeb0a318f2ff871004afdaca7d1126026a2f8b609809d232c4b";
const GEN_START="2011-01",GEN_END="2026-09";
const ROLES={tenant:"Arrendatario",owner:"Propietario",admin:"Administradora",bo:"Back office"};

/* Catálogo de reparaciones y red de proveedores (ficticios) */
const CATS=[
  {c:"Gasfitería",r:[25000,120000],d:["Cambio de llave de lavaplatos","Destape de desagüe del baño","Reparación de filtración bajo el lavamanos","Cambio de flexibles del WC","Cambio de sifón de cocina"]},
  {c:"Calefont",r:[60000,420000],d:["Cambio de calefont por falla de encendido","Mantención y limpieza de calefont","Cambio de válvula de gas del calefont"]},
  {c:"Electricidad",r:[30000,160000],d:["Cambio de enchufes quemados en cocina","Reparación de automático que se corta","Instalación de lámparas en living"]},
  {c:"Línea blanca",r:[35000,180000],d:["Reparación de lavadora que no centrifuga","Cambio de bomba de lavadora","Reparación de refrigerador que no enfría"]},
  {c:"Pintura",r:[80000,450000],d:["Pintura de living y comedor por humedad","Pintura de dormitorio principal","Retoque de muros tras filtración"]},
  {c:"Cerrajería",r:[18000,90000],d:["Cambio de chapa de la puerta principal","Cambio de cilindro de la puerta de servicio"]},
  {c:"Ventanas",r:[40000,260000],d:["Cambio de vidrio termopanel trizado","Reparación de ventana corredera"]},
  {c:"Carpintería",r:[30000,200000],d:["Reparación de puerta de clóset","Cambio de bisagras de muebles de cocina"]},
  {c:"Humedad y techumbre",r:[90000,600000],d:["Impermeabilización de terraza","Reparación de canaleta con filtración"]},
  {c:"Control de plagas",r:[30000,90000],d:["Fumigación por cucarachas en cocina"]}];
const CAT_NAMES=CATS.map(x=>x.c);
const PROV=[
  {id:"pv01",nombre:"Juan Carlos Pizarro",cat:"Gasfitería",ciudad:"Santiago",comunas:"Providencia, Ñuñoa, Santiago Centro",sec:false,precio:"Visita desde $20.000",desde:2011},
  {id:"pv02",nombre:"Héctor Morales",cat:"Gasfitería",ciudad:"Santiago",comunas:"Las Condes, Vitacura, La Reina",sec:false,precio:"Visita desde $25.000",desde:2013},
  {id:"pv03",nombre:"Cristián Rivas",cat:"Calefont",ciudad:"Santiago",comunas:"Providencia, Ñuñoa, Las Condes",sec:true,precio:"Mantención desde $45.000",desde:2012},
  {id:"pv04",nombre:"Servicio Técnico Ramírez e Hijos",cat:"Calefont",ciudad:"Santiago",comunas:"Santiago Centro, Macul, San Miguel",sec:true,precio:"Instalación desde $60.000",desde:2011},
  {id:"pv05",nombre:"Rodrigo Saavedra",cat:"Electricidad",ciudad:"Santiago",comunas:"Providencia, Ñuñoa, Macul",sec:true,precio:"Visita desde $25.000",desde:2014},
  {id:"pv06",nombre:"Paola Urrutia",cat:"Electricidad",ciudad:"Santiago",comunas:"Las Condes, Vitacura, Lo Barnechea",sec:true,precio:"Visita desde $30.000",desde:2016},
  {id:"pv07",nombre:"Marcela Tapia",cat:"Línea blanca",ciudad:"Santiago",comunas:"Las Condes, Providencia, Vitacura",sec:false,precio:"Diagnóstico $18.000",desde:2012},
  {id:"pv08",nombre:"Luis Henríquez",cat:"Línea blanca",ciudad:"Santiago",comunas:"Ñuñoa, Macul, La Florida",sec:false,precio:"Diagnóstico $15.000",desde:2015},
  {id:"pv09",nombre:"Pedro Vergara",cat:"Pintura",ciudad:"Santiago",comunas:"Providencia, Ñuñoa, Santiago Centro",sec:false,precio:"Desde $6.500 por m²",desde:2011},
  {id:"pv10",nombre:"Hermanos Quiroz Pinturas",cat:"Pintura",ciudad:"Santiago",comunas:"Las Condes, Lo Barnechea, Vitacura",sec:false,precio:"Desde $7.000 por m²",desde:2013},
  {id:"pv11",nombre:"Manuel Gómez, cerrajería 24 horas",cat:"Cerrajería",ciudad:"Santiago",comunas:"Gran Santiago",sec:false,precio:"Apertura desde $25.000",desde:2011},
  {id:"pv12",nombre:"Felipe Araya",cat:"Ventanas",ciudad:"Santiago",comunas:"Gran Santiago",sec:false,precio:"Termopanel desde $45.000",desde:2014},
  {id:"pv13",nombre:"Jorge Espinoza",cat:"Carpintería",ciudad:"Santiago",comunas:"Providencia, Las Condes, Ñuñoa",sec:false,precio:"Visita desde $20.000",desde:2012},
  {id:"pv14",nombre:"Ricardo Soto",cat:"Humedad y techumbre",ciudad:"Santiago",comunas:"Gran Santiago",sec:false,precio:"Evaluación sin costo",desde:2015},
  {id:"pv15",nombre:"Fumigaciones Valdés",cat:"Control de plagas",ciudad:"Santiago",comunas:"Gran Santiago",sec:false,precio:"Desde $35.000",desde:2013},
  {id:"pv16",nombre:"Gonzalo Riquelme",cat:"Gasfitería",ciudad:"Valparaíso",comunas:"Viña del Mar, Valparaíso, Concón",sec:false,precio:"Visita desde $20.000",desde:2012},
  {id:"pv17",nombre:"Tomás Pino",cat:"Calefont",ciudad:"Valparaíso",comunas:"Viña del Mar, Concón, Quilpué",sec:true,precio:"Mantención desde $40.000",desde:2014},
  {id:"pv18",nombre:"Ana Bustos",cat:"Pintura",ciudad:"Valparaíso",comunas:"Viña del Mar, Valparaíso",sec:false,precio:"Desde $6.000 por m²",desde:2013},
  {id:"pv19",nombre:"Rubén Carrasco",cat:"Electricidad",ciudad:"Valparaíso",comunas:"Viña del Mar, Concón",sec:true,precio:"Visita desde $22.000",desde:2015},
  {id:"pv20",nombre:"Sergio Mella",cat:"Electricidad",ciudad:"Concepción",comunas:"Concepción, San Pedro de la Paz, Talcahuano",sec:true,precio:"Visita desde $20.000",desde:2012},
  {id:"pv21",nombre:"Iván Sepúlveda",cat:"Calefont",ciudad:"Concepción",comunas:"Concepción, Chiguayante, San Pedro de la Paz",sec:true,precio:"Mantención desde $38.000",desde:2013},
  {id:"pv22",nombre:"Carla Fuentes",cat:"Línea blanca",ciudad:"Concepción",comunas:"Concepción, Talcahuano",sec:false,precio:"Diagnóstico $15.000",desde:2016},
  {id:"pv23",nombre:"Mauricio Lagos",cat:"Pintura",ciudad:"Concepción",comunas:"Concepción, San Pedro de la Paz",sec:false,precio:"Desde $5.500 por m²",desde:2014},
  {id:"pv24",nombre:"Patricio Toro",cat:"Gasfitería",ciudad:"Concepción",comunas:"Concepción, Hualpén, Talcahuano",sec:false,precio:"Visita desde $18.000",desde:2011}];

/* Datos de ejemplo (ficticios) */
const FN=["Andrea","Carlos","Daniela","Eduardo","Francisca","Gabriel","Isidora","Joaquín","Karen","Leonardo","Macarena","Nicolás","Paulina","Raúl","Sofía","Vicente","Constanza","Benjamín","Fernanda","Sebastián","Antonia","Cristóbal","Josefa","Martín","Valeria","Diego","Pablo","Javiera","Álvaro","Bárbara","Felipe","Gloria","Hernán","Ignacia","Jaime","Loreto","Marco","Natalia","Óscar","Rocío"];
const LN=["González","Muñoz","Rojas","Díaz","Pérez","Soto","Contreras","Silva","Martínez","Sepúlveda","Morales","Rodríguez","López","Fuentes","Hernández","Torres","Araya","Flores","Espinoza","Valenzuela","Castillo","Tapia","Reyes","Gutiérrez","Castro","Pizarro","Álvarez","Vásquez","Sánchez","Fernández","Ramírez","Carrasco","Cortés","Herrera","Núñez","Jara","Vergara","Rivera","Figueroa","Riquelme"];
function seed(){
  const R=rng(20110301);const pick=a=>a[Math.floor(R()*a.length)];const ri=(a,b)=>a+Math.floor(R()*(b-a+1));
  const used=new Set(["Camila Rojas","Felipe Muñoz","Javiera Contreras","Tomás Herrera","Valentina Díaz","Ignacio Pérez","Daniela Vega","Matías Navarro","Rodrigo Fuentes","María José Soto","Bruno Salinas","Laura Méndez","Paula Ibáñez","Andrés Lagos","Carolina Mella"]);
  const newName=()=>{for(let i=0;i<300;i++){const n=pick(FN)+" "+pick(LN);if(!used.has(n)){used.add(n);return n}}return "Persona "+ri(100,999)};
  const administradoras=[
    {id:"a1",nombre:"Salinas Gestión Inmobiliaria",contacto:"Bruno Salinas",ciudad:"Santiago",comuna:"Providencia",comisionAdm:8,desde:"2011-01",wa:""},
    {id:"a2",nombre:"Cordillera Administraciones",contacto:"Paula Ibáñez",ciudad:"Santiago",comuna:"Las Condes",comisionAdm:7,desde:"2012-04",wa:""},
    {id:"a3",nombre:"Pacífico Gestión de Arriendos",contacto:"Andrés Lagos",ciudad:"Valparaíso",comuna:"Viña del Mar",comisionAdm:8.5,desde:"2013-09",wa:""},
    {id:"a4",nombre:"Austral Propiedades",contacto:"Carolina Mella",ciudad:"Concepción",comuna:"Concepción",comisionAdm:7.5,desde:"2015-02",wa:""}];
  const owners=[{id:"o1",nombre:"Rodrigo Fuentes",wa:""},{id:"o2",nombre:"María José Soto",wa:""},{id:"o3",nombre:"Inversiones Litoral SpA",wa:""}];
  const tenants=[
    {id:"t1",nombre:"Camila Rojas",desde:"2011-03-01",wa:""},{id:"t2",nombre:"Felipe Muñoz",desde:"2019-08-01",wa:""},
    {id:"t3",nombre:"Javiera Contreras",desde:"2021-01-01",wa:""},{id:"t4",nombre:"Tomás Herrera",desde:"2017-11-01",wa:""},
    {id:"t5",nombre:"Valentina Díaz",desde:"2022-06-01",wa:""},{id:"t6",nombre:"Ignacio Pérez",desde:"2014-02-01",wa:""},
    {id:"t7",nombre:"Daniela Vega",desde:"2023-09-01",wa:""},{id:"t8",nombre:"Matías Navarro",desde:"2024-01-01",wa:""}];
  const P=(id,adm,dir,comuna,ciudad,owner,tenant,moneda,monto,reaj,per,gcCom,gcMonto,desc,valorUF,alta,paid,deuda,gcPaid,gcDeuda,lastPay,vacioDesde)=>({
    id,code:"C:"+id.slice(1),adminId:adm,dir,comuna,ciudad,ownerId:owner,tenantId:tenant,moneda,monto,
    reajuste:{tipo:reaj,periodo:per,ultimo:null},inicio:null,garantia:monto,
    gc:{comunidad:gcCom,monto:gcMonto},desc,valorUF,alta,paid,deuda,gcPaid,gcDeuda,lastPay,vacioDesde:vacioDesde||null,tenancias:[]});
  const props=[
    P("P001","a1","Los Piñones 1240, Depto. 504","Providencia","Santiago","o1","t1","CLP",520000,"IPC",12,"Comunidad Edificio Los Piñones",85000,"3 dormitorios, 2 baños, bodega y estacionamiento",6200,"2011-03",false,0,false,0,"2026-09-04"),
    P("P002","a1","Carmencita 54","Las Condes","Santiago","o1","t2","UF",18,"UF",12,"Comunidad Carmencita",110000,"2 dormitorios, 2 baños",7100,"2011-06",true,0,true,0,"2026-10-03"),
    P("P003","a1","Los Gladiolos 24","Ñuñoa","Santiago","o1","t3","CLP",450000,"IPC",6,"Condominio Los Gladiolos",62000,"Casa 3 dormitorios, patio",5600,"2012-01",false,450000,false,62000,"2026-08-06"),
    P("P004","a1","Las Violetas 222","Providencia","Santiago","o2","t4","UF",15,"UF",12,"Comunidad Las Violetas",78000,"2 dormitorios, 1 baño",5400,"2011-01",false,607500,false,0,"2026-08-10"),
    P("P005","a1","Huelen 202, Depto. 204","Providencia","Santiago","o2","t5","CLP",610000,"IPC",12,"Comunidad Edificio El Golf",10000,"4 piezas, 2 baños, bodega, salita",7800,"2013-04",true,0,true,0,"2026-10-02"),
    P("P006","a1","Av. Pedro de Valdivia 2210","Ñuñoa","Santiago","o3","t6","UF",22,"UF",12,"Comunidad Pedro de Valdivia",95000,"3 dormitorios, 2 baños, terraza",8400,"2011-09",true,0,true,0,"2026-10-05"),
    P("P007","a1","Málaga 115, Depto. 81","Las Condes","Santiago","o3",null,"UF",25,"UF",12,"Comunidad Málaga 115",120000,"3 dormitorios, 3 baños",9800,"2014-02",false,0,false,0,null,"2026-10"),
    P("P008","a1","Eliodoro Yáñez 1890","Providencia","Santiago","o2","t7","CLP",480000,"IPC",6,"Comunidad Eliodoro Yáñez",70000,"2 dormitorios, 2 baños",6000,"2012-07",true,0,true,0,"2026-10-04"),
    P("P009","a1","Irarrázaval 3050, Depto. 1203","Ñuñoa","Santiago","o3","t8","UF",14,"UF",12,"Comunidad Plaza Ñuñoa",68000,"1 dormitorio, 1 baño",4700,"2015-05",false,0,false,0,"2026-09-05"),
    P("P010","a1","Apoquindo 4500, Depto. 1102","Las Condes","Santiago","o1",null,"UF",28,"UF",12,"Comunidad Apoquindo 4500",135000,"3 dormitorios, 2 baños, 2 estacionamientos",11000,"2016-03",false,0,false,0,null,"2026-09")];
  const inicios={P001:"2011-03-01",P002:"2019-08-01",P003:"2021-01-01",P004:"2017-11-01",P005:"2022-06-01",P006:"2014-02-01",P008:"2023-09-01",P009:"2024-01-01"};
  const CALLES={Santiago:[["Av. Vitacura","Vitacura"],["Isidora Goyenechea","Las Condes"],["Av. Kennedy","Las Condes"],["Camino La Dehesa","Lo Barnechea"],["Alonso de Córdova","Vitacura"],["Av. Las Condes","Las Condes"],["Martín de Zamora","Las Condes"],["Av. Tobalaba","Providencia"]],
    "Valparaíso":[["Av. San Martín","Viña del Mar"],["Av. Libertad","Viña del Mar"],["Av. Borgoño","Concón"],["Templeman, Cerro Alegre","Valparaíso"],["Av. España","Valparaíso"],["Calle 14 Norte","Viña del Mar"],["Av. Perú","Viña del Mar"]],
    "Concepción":[["Barros Arana","Concepción"],["Av. Pedro de Valdivia","Concepción"],["Los Carrera","Concepción"],["Av. Michimalonco","San Pedro de la Paz"],["Colón","Talcahuano"],["Lincoyán","Concepción"]]};
  let n=11;
  [["a2",8],["a3",7],["a4",6]].forEach(([adm,count])=>{
    const A=administradoras.find(a=>a.id===adm),calles=CALLES[A.ciudad];
    const ows=[];for(let i=0;i<Math.ceil(count/2);i++){const o={id:"o"+(owners.length+1),nombre:newName(),wa:""};owners.push(o);ows.push(o)}
    for(let i=0;i<count;i++){
      const [calle,comuna]=calles[i%calles.length];const id="P"+pad3(n++);
      const isUF=R()<.6,vacant=R()<.15;const altaY=ri(Number(A.desde.slice(0,4)),2020);const alta=altaY+"-"+pad(ri(1,12));
      const mon=isUF?ri(11,30):ri(330,780)*1000;
      let tid=null,des=null;
      if(!vacant){tid="t"+(tenants.length+1);const ys=ri(Math.max(altaY,2019),2026);let dsd=ys===2026?"2026-"+pad(ri(1,6))+"-01":ys+"-"+pad(ri(1,12))+"-01";if(dsd<alta+"-01")dsd=alta+"-01";des=dsd;tenants.push({id:tid,nombre:newName(),desde:des,wa:""})}
      const st=R();const paid=!vacant&&st<.62,moroso=!vacant&&!paid&&st>.86;
      const rentNow=isUF?Math.round(mon*40500):mon;
      const p=P(id,adm,calle+" "+ri(120,4800)+(R()<.6?", Depto. "+ri(21,1904):""),comuna,A.ciudad,ows[i%ows.length].id,tid,isUF?"UF":"CLP",mon,isUF?"UF":"IPC",R()<.3?6:12,"Comunidad "+calle,ri(40,160)*1000,ri(1,4)+" dormitorios, "+ri(1,3)+" baños",ri(3200,12000),alta,paid,moroso?rentNow:0,paid,0,paid?"2026-10-0"+ri(1,8):(vacant?null:"2026-09-0"+ri(2,9)),vacant?"2026-"+pad(ri(6,10)):null);
      if(des)inicios[id]=des;
      props.push(p);
    }
  });
  const exT=[];let xn=1;
  props.forEach(p=>{
    const t=tenants.find(x=>x.id===p.tenantId);
    p.inicio=inicios[p.id]||(p.alta+"-01");
    const im=Number(p.inicio.slice(5,7));let last=(2026-(im>10?1:0))+"-"+pad(im)+"-01";
    if(p.reajuste.periodo===6){const alt=addMonths(last,6);if(alt<="2026-10-22")last=alt}
    p.reajuste.ultimo=last<p.inicio?p.inicio:last;
    let end;
    if(t){p.tenancias.push({tid:t.id,desde:t.desde.slice(0,7),hasta:null});end=ymAdd(t.desde.slice(0,7),-1-(R()<.5?0:ri(1,2)))}
    else end=ymAdd(p.vacioDesde||GEN_END,-1);
    while(end>=p.alta){const len=ri(18,54);let start=ymAdd(end,-len+1);if(start<p.alta)start=p.alta;const x={id:"x"+(xn++),nombre:newName()};exT.push(x);p.tenancias.unshift({tid:x.id,desde:start,hasta:end});end=ymAdd(start,-1-(R()<.55?0:ri(1,2)))}
  });
  const hist=[];
  const add=(f,pid,tid,c,m,md)=>hist.push({id:uid("h"),f,ym:f.slice(0,7),p:pid,t:tid,c,m,md,d:0,r:null});
  props.forEach(p=>{if(p.paid){const f=p.lastPay;const md=pick(["Tarjeta de crédito","Tarjeta de crédito","Tarjeta de débito","Transferencia","Tarjeta retail"]);let m=p.moneda==="UF"?Math.round(p.monto*40500):p.monto;if(p.id==="P005")m-=90000;add(f,p.id,p.tenantId,"A",m,md);if(p.id==="P005"){hist[hist.length-1].d=90000;hist[hist.length-1].r="r3"}if(p.gcPaid)add(f,p.id,p.tenantId,"G",p.gc.monto,md)}});
  const users=[];
  const U=(nombre,email,role,actorId)=>users.push({id:uid("u"),nombre,email,role,actorId,hash:DEFAULT_HASH,activo:true,bloqueado:false,intentos:0,ultimo:null,cambiar:false,wa:""});
  tenants.slice(0,8).forEach(t=>U(t.nombre,slug(t.nombre)+"@demo.klip.cl","tenant",t.id));
  owners.slice(0,3).forEach(o=>U(o.nombre,slug(o.nombre)+"@demo.klip.cl","owner",o.id));
  administradoras.forEach(a=>U(a.contacto,slug(a.contacto)+"@demo.klip.cl","admin",a.id));
  U("Laura Méndez","laura.mendez@demo.klip.cl","bo","bo");
  return {v:5,params:{uf:40500,ipc:4.1,comision:2.5,diaVenc:5,gracia:5,
      medios:{"Tarjeta de crédito":true,"Tarjeta de débito":true,"Tarjeta retail":true,"Transferencia":true},
      plantilla:"Hola {nombre}, te escribimos de KLIP. Tu arriendo de {direccion} por {monto} vence el {vence}. Puedes pagarlo en línea con tarjeta de crédito, débito o transferencia. Gracias.",
      bienvenida:{activo:false,mostrado:false,titulo:"Te damos la bienvenida, {nombre}",texto:"KLIP reúne en un solo lugar tu cartera, los cobros, las liquidaciones y las reparaciones.\nCualquier duda, escríbenos desde la plataforma."}},
    periodo:{ym:"2026-10",vence:"2026-11-05"},administradoras,owners,tenants,exT,props,hist,users,provNew:[],
    repairs:[
      {id:"r1",propId:"P001",tenantId:"t1",cat:"Cerrajería",desc:"Cambio de chapa de la puerta principal",provId:"pv11",monto:60000,cuotas:2,estado:"solicitada",fecha:"2026-10-14",aprobProp:null,conformArr:null,inicioDesc:null,descontadas:0,rating:null},
      {id:"r2",propId:"P002",tenantId:"t2",cat:"Calefont",desc:"Cambio de calefont por falla de encendido",provId:"pv03",monto:385000,cuotas:3,estado:"aprobada",fecha:"2026-10-09",aprobProp:{nombre:"Rodrigo Fuentes",rol:"Propietario",fecha:"2026-10-10 18:42"},conformArr:null,inicioDesc:null,descontadas:0,rating:null},
      {id:"r3",propId:"P005",tenantId:"t5",cat:"Pintura",desc:"Pintura de living y comedor por humedad",provId:"pv09",monto:270000,cuotas:3,estado:"conforme",fecha:"2026-09-12",aprobProp:{nombre:"María José Soto",rol:"Propietaria",fecha:"2026-09-13 10:05"},conformArr:{nombre:"Valentina Díaz",rol:"Arrendataria",fecha:"2026-09-24 19:30"},inicioDesc:"2026-10",descontadas:1,rating:5}],
    msgs:[
      {id:"m1",from:"a1",to:"t1",text:"Hola Camila, ya está disponible el cobro de octubre. Recuerda que vence el 05-11-2026.",fecha:"2026-10-01",read:false,canal:"plataforma"},
      {id:"m2",from:"t1",to:"o1",text:"Rodrigo, la chapa de la puerta principal está fallando. Dejé la solicitud de reparación en la plataforma.",fecha:"2026-10-14",read:false,canal:"plataforma"},
      {id:"m3",from:"a1",to:"t3",text:"Javiera, registramos un saldo pendiente de septiembre. ¿Podemos ayudarte con alguna opción de pago?",fecha:"2026-10-08",read:false,canal:"whatsapp"},
      {id:"m4",from:"o2",to:"a1",text:"Bruno, ¿cómo va la cobranza de Las Violetas? Ya son dos meses.",fecha:"2026-10-12",read:false,canal:"plataforma"},
      {id:"m5",from:"o1",to:"t2",text:"Felipe, ya aprobé el cambio del calefont. Cuando Cristián lo instale, confirma en la plataforma para que empiece el descuento.",fecha:"2026-10-10",read:false,canal:"plataforma"}],
    audit:[
      {f:"2026-10-01 08:00",who:"Sistema",tipo:"Cobros",det:"Emitidos los cobros de Octubre 2026"},
      {f:"2026-10-10 18:42",who:"Rodrigo Fuentes",tipo:"Reparación aprobada",det:"Calefont en Carmencita 54, $385.000 en 3 cuotas"},
      {f:"2026-10-14 19:22",who:"Camila Rojas",tipo:"Reparación",det:"Solicitud de cambio de chapa en Los Piñones 1240"}]};
}
