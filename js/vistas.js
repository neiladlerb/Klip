/* KLIP: iconos, pantallas por perfil y gráficos */
"use strict";
/* Iconos */
const LOGO=(w,dark)=>{const b=dark?"#2463AC":"#fff",n=dark?"#22285A":"#CFE3FF",t=dark?"#22285A":"#E3EEFF";return `<svg width="${w}" viewBox="0 0 330 92" role="img" aria-label="KLIP.CL Paga tus arriendos"><g fill="none" stroke="${b}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"><path d="M18 70 V36"/><path d="M8 42 L60 8 L95.5 31.5 V42"/><path d="M80 22 V11"/></g><text x="89" y="70" textLength="108" lengthAdjust="spacingAndGlyphs" font-family="Fredoka,Trebuchet MS,sans-serif" font-weight="700" font-size="44" fill="${b}">KLIP</text><text x="200" y="70" textLength="84" lengthAdjust="spacingAndGlyphs" font-family="Fredoka,Trebuchet MS,sans-serif" font-weight="700" font-size="44" fill="${n}">.CL</text><text x="10" y="88" textLength="274" lengthAdjust="spacingAndGlyphs" font-family="Source Sans 3,Segoe UI,sans-serif" font-size="15" letter-spacing="2" fill="${t}">PAGA TUS ARRIENDOS</text></svg>`};
const ICON={
  house:`<svg viewBox="0 0 64 48" width="70" aria-hidden="true"><path d="M8 24 L32 6 L56 24 V44 H8Z" fill="var(--panel)" stroke="var(--klip)" stroke-width="3" stroke-linejoin="round"/><rect x="27" y="28" width="10" height="16" fill="var(--klip)"/><rect x="14" y="27" width="8" height="7" fill="var(--sky)"/><rect x="42" y="27" width="8" height="7" fill="var(--sky)"/></svg>`,
  msg:`<svg viewBox="0 0 40 40" aria-hidden="true"><circle cx="16" cy="13" r="7" fill="var(--klip)"/><path d="M4 34c0-7 5-12 12-12s12 5 12 12z" fill="var(--klip)"/><rect x="23" y="5" width="14" height="10" rx="2" fill="var(--sky)"/></svg>`,
  doc:`<svg viewBox="0 0 40 40" aria-hidden="true"><rect x="9" y="6" width="22" height="28" rx="2" fill="var(--klip)"/><rect x="5" y="10" width="22" height="26" rx="2" fill="var(--sky)"/><path d="M10 18h12M10 23h12M10 28h8" stroke="#fff" stroke-width="2"/></svg>`,
  hist:`<svg viewBox="0 0 40 40" aria-hidden="true"><path d="M8 6h20a4 4 0 0 1 4 4v24H12a4 4 0 0 1-4-4z" fill="var(--klip)"/><text x="20" y="26" text-anchor="middle" font-size="16" font-weight="700" fill="#fff" font-family="sans-serif">$</text></svg>`,
  tool:`<svg viewBox="0 0 40 40" aria-hidden="true"><path d="M26 6a8 8 0 0 0-7 11L7 29a3 3 0 0 0 4 4l12-12a8 8 0 0 0 11-7l-5 3-4-2-1-4z" fill="var(--tenant)"/></svg>`,
  wa:`<svg viewBox="0 0 40 40" aria-hidden="true"><path d="M20 5a15 15 0 0 0-13 22.5L5 35l7.7-2A15 15 0 1 0 20 5z" fill="var(--wa)"/><path d="M14.5 12.5c.4-.9.8-.9 1.2-.9h1c.3 0 .7.1 1 .9l1.3 3.2c.1.3.1.6-.1.9l-.8 1c-.2.3-.3.6 0 1 .9 1.5 2.4 3 3.9 3.9.4.2.7.2 1-.1l1-1.2c.3-.3.6-.4 1-.2l3.1 1.5c.4.2.6.4.6.7 0 .8-.3 2-1.3 2.7-.9.6-2.3.9-4.3.1a17 17 0 0 1-8-7.6c-1.2-2.3-.9-4.2-.6-5z" fill="#fff"/></svg>`,
  card:`<svg viewBox="0 0 40 40" aria-hidden="true"><rect x="4" y="9" width="32" height="22" rx="4" fill="var(--klip)"/><rect x="4" y="14" width="32" height="5" fill="var(--navy)"/><rect x="8" y="23" width="10" height="3" rx="1" fill="#fff"/></svg>`,
  chart:`<svg viewBox="0 0 40 40" aria-hidden="true"><rect x="6" y="20" width="6" height="14" rx="1" fill="var(--sky)"/><rect x="17" y="12" width="6" height="22" rx="1" fill="var(--klip)"/><rect x="28" y="6" width="6" height="28" rx="1" fill="var(--navy)"/></svg>`,
  uf:`<svg viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="20" r="15" fill="var(--owner)"/><text x="20" y="25" text-anchor="middle" font-size="13" font-weight="700" fill="#fff" font-family="sans-serif">UF</text></svg>`,
  team:`<svg viewBox="0 0 40 40" aria-hidden="true"><circle cx="13" cy="14" r="5" fill="var(--admin)"/><circle cx="27" cy="14" r="5" fill="var(--tenant)"/><path d="M4 32c0-6 4-10 9-10s9 4 9 10zM18 32c0-6 4-10 9-10s9 4 9 10z" fill="var(--klip)"/></svg>`
};

/* Render */
const app=document.getElementById("app");
function render(){
  if(ui.screen==="app"&&!cur())ui.screen="login";
  app.innerHTML=ui.screen==="landing"?landing():ui.screen==="login"?loginView():ui.screen==="register"?registerView():shell();
  drawCharts();
}
function triangle(){
  const person=(x,y,s)=>`<circle cx="${x}" cy="${y}" r="${11*s}" fill="#fff"/><path d="M${x-20*s} ${y+36*s}c0-14 9-22 ${20*s}-22s${20*s} 8 ${20*s} 22z" fill="#fff"/>`;
  return `<svg viewBox="0 0 600 500" role="group" aria-label="Elige tu perfil">
    <g class="seg" tabindex="0" role="button" aria-label="Crear cuenta de propietario" data-act="goreg" data-hint="owner"><path d="M300 14 Q312 14 320 28 L438 236 L162 236 L280 28 Q288 14 300 14Z" fill="#7AB648"/>${person(300,120,1.25)}<text x="300" y="214" text-anchor="middle" font-size="19" fill="#fff" font-family="Source Sans 3,sans-serif" font-weight="700">PROPIETARIOS</text></g>
    <g class="seg" tabindex="0" role="button" aria-label="Crear cuenta de arrendatario" data-act="goreg" data-hint="tenant"><path d="M156 246 L296 246 L296 486 L36 486 Q20 486 28 470Z" fill="#D9682A"/>${person(160,370,1)}${person(212,385,.75)}${person(255,370,1)}<text x="200" y="462" text-anchor="middle" font-size="19" fill="#fff" font-family="Source Sans 3,sans-serif" font-weight="700">ARRENDATARIOS</text></g>
    <g class="seg" tabindex="0" role="button" aria-label="Crear cuenta de administradora" data-act="goreg" data-hint="admin"><path d="M304 246 L444 246 L572 470 Q580 486 564 486 L304 486Z" fill="#C3272B"/>${person(402,350,1.1)}<rect x="372" y="398" width="60" height="30" rx="4" fill="#fff"/><rect x="380" y="404" width="44" height="18" fill="#C3272B"/><text x="420" y="462" text-anchor="middle" font-size="19" fill="#fff" font-family="Source Sans 3,sans-serif" font-weight="700">ADMINISTRADORES</text></g>
  </svg>`;
}
function landing(){
  return `<header class="wrap nav">${LOGO(190,true)}<nav class="links" aria-label="Secciones de la portada"><a href="#producto">Producto</a><a href="#como">Cómo funciona</a><a href="#reparaciones">Reparaciones</a><a href="#administradoras">Administradoras</a><a href="#preguntas">Preguntas</a></nav><span style="flex:1"></span>
    <button class="btn sec" data-act="gologin">Iniciar sesión</button><button class="btn" data-act="goreg">Crear cuenta</button></header>
  <main>
    <section class="wrap hero">
      <div>
        <div class="kicker">Plataforma de arriendos para Chile</div>
        <h1>Arriendos y gastos comunes pagados en línea, <em>con todo a la vista</em></h1>
        <p class="lead">KLIP conecta a arrendatarios, propietarios y administradoras de propiedades en un solo lugar. El arrendatario paga con su tarjeta, el propietario recibe su liquidación y la administradora controla la cobranza sin planillas.</p>
        <div style="display:flex;gap:10px;flex-wrap:wrap;align-items:center">
          <button class="btn lg" data-act="goreg">Crear cuenta gratis</button>
          <button class="btn sec lg" data-act="gologin">Ya tengo cuenta</button>
        </div>
      </div>
      <div class="tri">${triangle()}</div>
    </section>
    <div class="wrap facts">
      <div class="fact"><b>Tarjetas de crédito y débito</b>también retail y transferencia</div>
      <div class="fact"><b>Reajuste UF e IPC</b>calculado solo, mes a mes</div>
      <div class="fact"><b>Avisos por WhatsApp</b>recordatorios y conversaciones</div>
      <div class="fact"><b>Historial completo</b>cada pago y reparación registrados</div>
    </div>
    <section class="wrap" id="video"><a class="video" href="https://www.facebook.com/share/v/1T2MmY33ev/" target="_blank" rel="noopener">
      <span class="play" aria-hidden="true"><svg viewBox="0 0 40 40" width="34" height="34"><path d="M14 10 L31 20 L14 30Z" fill="#fff"/></svg></span>
      <span class="vtxt"><span class="kicker" style="margin:0;color:#CFE3FF">Video</span><b>Mira KLIP en acción</b><span>Se abre en Facebook, en una pestaña nueva.</span></span>
    </a></section>
    <section class="sect" id="como"><div class="wrap">
      <h2>Cómo funciona</h2><p class="muted" style="max-width:70ch;margin-top:0">Cuatro pasos, desde que la administradora carga la propiedad hasta que el propietario recibe su dinero.</p>
      <div class="steps">
        <div class="step"><h3>Se carga la propiedad</h3><span class="muted">La administradora o el propietario registra el contrato, el canon en UF o pesos y la cuota de gastos comunes.</span></div>
        <div class="step"><h3>Llega el cobro</h3><span class="muted">El arrendatario recibe el aviso en la plataforma y por WhatsApp, con el monto ya reajustado y los descuentos aprobados.</span></div>
        <div class="step"><h3>Paga como prefiera</h3><span class="muted">Arriendo y gastos comunes en un solo pago, con tarjeta de crédito en cuotas, débito, retail o transferencia.</span></div>
        <div class="step"><h3>Todos lo ven al instante</h3><span class="muted">El propietario ve su liquidación y la administradora su recaudación. Sin llamadas para preguntar si ya se pagó.</span></div>
      </div></div></section>
    <section class="sect" id="producto"><div class="wrap">
      <div class="slogan" aria-label="Descubre una nueva forma de gestionar las propiedades que administras"><span class="s">Descubre una</span><span class="b">Nueva forma</span><span class="s">de gestionar las propiedades que administras</span></div>
      <div class="roles">
        <div class="role r-tenant"><h3>Arrendatarios</h3><ul><li>Pago en línea del arriendo y los gastos comunes</li><li>Cuotas con tarjeta de crédito y beneficios de tu banco</li><li>Reparaciones acordadas que se descuentan del arriendo</li><li>Tu historial de pagos siempre disponible</li></ul><button class="btn sm" data-act="goreg" data-hint="tenant">Crear cuenta de arrendatario</button></div>
        <div class="role r-owner"><h3>Propietarios</h3><ul><li>Recibe tus arriendos desde una sola entidad</li><li>Liquidación mensual con comisiones y descuentos</li><li>Aprueba reparaciones con un clic</li><li>Rentabilidad de tus propiedades por sector</li></ul><button class="btn sm" data-act="goreg" data-hint="owner">Crear cuenta de propietario</button></div>
        <div class="role r-admin"><h3>Administradoras</h3><ul><li>Toda tu cartera en un panel</li><li>Cobranza con recordatorios por WhatsApp</li><li>Liquidaciones a propietarios automáticas</li><li>Contratos con reajuste UF o IPC</li></ul><button class="btn sm" data-act="goreg" data-hint="admin">Registrar mi administradora</button></div>
      </div>
      <div class="feats">
        <div class="feat">${ICON.card}<h3>Pagos con tarjeta</h3><span class="muted">El arrendatario usa medios que antes no existían en el arriendo y suma kilómetros, puntos o descuentos.</span></div>
        <div class="feat">${ICON.wa}<h3>WhatsApp integrado</h3><span class="muted">Recordatorios de cobro y conversaciones con arrendatarios, propietarios y proveedores, con registro en la plataforma.</span></div>
        <div class="feat">${ICON.uf}<h3>UF e IPC al día</h3><span class="muted">Los contratos en UF se cobran al valor del día y los contratos en pesos se reajustan por IPC en su fecha.</span></div>
        <div class="feat">${ICON.chart}<h3>Inteligencia de negocio</h3><span class="muted">Recaudación, morosidad y rentabilidad por comuna para tomar mejores decisiones.</span></div>
        <div class="feat">${ICON.team}<h3>Red de proveedores</h3><span class="muted">Gasfíteres, electricistas, técnicos de calefont y lavadoras, pintores y más, con valoraciones de trabajos reales.</span></div>
        <div class="feat">${ICON.doc}<h3>Todo queda escrito</h3><span class="muted">Contratos, pagos, mensajes y reparaciones con fecha y responsable, listos para cualquier consulta.</span></div>
      </div></div></section>
    <section class="sect" id="reparaciones"><div class="wrap split">
      <div><h2>Reparaciones acordadas por ambas partes</h2><p class="muted" style="max-width:52ch">Cuando algo falla, el arrendatario lo reporta y elige un proveedor de la red. El propietario aprueba el presupuesto y las cuotas. Terminado el trabajo, el arrendatario da su conformidad y el monto se descuenta solo del arriendo. Cada paso queda firmado en un acta.</p></div>
      <div class="panel panel-b acta"><div class="lines"><div><span><b>Cambio de calefont por falla de encendido</b><span class="sub">Calefont, técnico autorizado SEC</span></span><span class="num">$385.000</span></div><div><span>Descuento del arriendo</span><span class="num">3 cuotas de $128.333</span></div></div>
        <div class="firmas"><div class="firma ok"><span class="eyebrow">Aprueba el propietario</span><b>Presupuesto y cuotas</b><span class="sub">Con fecha y hora</span></div><div class="firma ok"><span class="eyebrow">Conformidad del arrendatario</span><b>Trabajo realizado</b><span class="sub">Con fecha y hora</span></div></div></div>
    </div></section>
    <section class="sect" id="administradoras"><div class="wrap split">
      <div class="panel panel-b"><div class="lines"><div><span>Canon cobrado</span><span class="num">$729.000</span></div><div><span>Comisión de administración 8%</span><span class="num">-$58.320</span></div><div><span>IVA de la comisión</span><span class="num">-$11.081</span></div><div><span>Descuento por reparación</span><span class="num">$0</span></div><div class="tot"><span>Neto al propietario</span><span class="num">$659.599</span></div></div><p class="muted" style="font-size:13px;margin:10px 0 0">Ejemplo de la liquidación mensual que KLIP genera para cada propietario.</p></div>
      <div><h2>Para administradoras de propiedades</h2><p class="muted" style="max-width:52ch">Carga toda tu cartera, cobra con tarjeta, envía recordatorios por WhatsApp y entrega a cada propietario su liquidación con la comisión y el IVA calculados. Tu equipo trabaja sobre los mismos datos que ven tus clientes.</p><button class="btn" data-act="goreg" data-hint="admin">Registrar mi administradora</button></div>
    </div></section>
    <section class="sect faq" id="preguntas"><div class="wrap">
      <h2>Preguntas frecuentes</h2>
      <details><summary>¿Cuánto cuesta para el arrendatario?</summary><p class="muted">Crear la cuenta y pagar por transferencia no tiene costo. Los pagos con tarjeta pueden tener el costo de procesamiento del medio elegido.</p></details>
      <details><summary>¿Cómo se calcula el reajuste?</summary><p class="muted">Si el contrato está en UF, se cobra al valor de la UF del día de emisión. Si está en pesos, se reajusta por IPC en la fecha pactada, cada 6 o 12 meses.</p></details>
      <details><summary>¿Quién aprueba una reparación?</summary><p class="muted">El propietario, o la administradora con su mandato, aprueba el presupuesto y las cuotas. El arrendatario confirma que el trabajo quedó bien. Sin las dos firmas no hay descuento.</p></details>
      <details><summary>¿KLIP guarda los datos de mi tarjeta?</summary><p class="muted">No. El pago se procesa en la pasarela del medio elegido. En esta demo los pagos son simulados.</p></details>
    </div></section>
    <section class="wrap sect"><div class="cta"><div><h2>Empieza hoy con KLIP</h2><span>Crea tu cuenta en un minuto o entra con una cuenta de demostración.</span></div><div style="display:flex;gap:10px;flex-wrap:wrap"><button class="btn lg" data-act="goreg">Crear cuenta</button><button class="btn lg" data-act="gologin" style="background:transparent;color:#fff;border:1px solid #fff">Iniciar sesión</button></div></div></section>
  </main>
  <footer class="wrap foot"><span>KLIP.CL, Santiago de Chile. Diseñado en 2011.</span><span>Demo funcional: los pagos son simulados y los datos, ficticios.</span></footer>`;
}

/* Login y registro */
const DEMO_ACC=[["admin","bruno.salinas@demo.klip.cl"],["tenant","camila.rojas@demo.klip.cl"],["owner","rodrigo.fuentes@demo.klip.cl"],["bo","laura.mendez@demo.klip.cl"]];
const authHead=()=>`<header class="wrap nav"><button data-act="home" style="background:none;border:0;cursor:pointer;padding:0" aria-label="Volver a la portada">${LOGO(190,true)}</button></header>`;
function loginView(){
  return `${authHead()}<main class="wrap login">
    <div><div class="slogan"><span class="s">Descubre una</span><span class="b">Nueva forma</span><span class="s">de gestionar las propiedades que administras</span></div>
      <p class="lead">Cada perfil entra con su cuenta y ve solo lo que le corresponde.</p></div>
    <form class="panel login-card form" id="loginform" novalidate>
      <div><h1>Iniciar sesión</h1><span class="muted">Ingresa con tu correo y contraseña.</span></div>
      ${ui.loginErr?`<div class="err" role="alert">${esc(ui.loginErr)}</div>`:""}
      <div class="field"><label for="lemail">Correo electrónico</label><input id="lemail" type="email" autocomplete="username" required value="${esc(ui.loginEmail)}"></div>
      <div class="field"><label for="lpass">Contraseña</label><input id="lpass" type="password" autocomplete="current-password" required></div>
      <label class="check"><input type="checkbox" id="lrem"> Mantener la sesión iniciada en este equipo</label>
      <button class="btn" type="submit">Entrar</button>
      <span class="muted" style="font-size:14px">¿No tienes cuenta? <button type="button" class="link" data-act="goreg">Créala aquí</button></span>
      <div class="note"><b>Cuentas de demostración.</b> Contraseña para todas: <b>Klip2026!</b>
        <div class="acc">${DEMO_ACC.map(([r,e])=>{const u=S.users.find(x=>x.email===e);return `<button type="button" data-act="fill" data-email="${e}"><span><b>${esc(u?u.nombre:e)}</b><span class="sub">${ROLES[r]}, ${e}</span></span><span class="muted">Usar</span></button>`}).join("")}</div></div>
    </form></main>`;
}
function registerView(){
  const h=ui.regHint||"tenant";
  return `${authHead()}<main class="wrap login">
    <div><h1 style="font-size:clamp(30px,4vw,44px)">Crea tu cuenta en KLIP</h1><p class="lead">Arrendatarios y propietarios usan KLIP sin costo. Las administradoras cargan su cartera y empiezan a cobrar con tarjeta el mismo día.</p>
      <div class="note">Si eres arrendatario, usa el mismo correo que diste a tu administradora para que te vincule a tu arriendo.</div></div>
    <form class="panel login-card form" id="regform" novalidate>
      <div><h1>Crear cuenta</h1></div>
      ${ui.regErr?`<div class="err" role="alert">${esc(ui.regErr)}</div>`:""}
      <div class="field"><label for="rrol">Soy</label><select id="rrol"><option value="tenant" ${h==="tenant"?"selected":""}>Arrendatario</option><option value="owner" ${h==="owner"?"selected":""}>Propietario</option><option value="admin" ${h==="admin"?"selected":""}>Administradora de propiedades</option></select></div>
      <div class="field" id="rempw" ${h==="admin"?"":"hidden"}><label for="remp">Nombre de la administradora</label><input id="remp" placeholder="Ej.: Administraciones del Valle"></div>
      <div class="field"><label for="rnom">Nombre y apellido</label><input id="rnom" required autocomplete="name"></div>
      <div class="field"><label for="rem">Correo electrónico</label><input id="rem" type="email" required autocomplete="email"></div>
      <div class="field"><label for="rwa">WhatsApp (opcional)</label><input id="rwa" type="tel" placeholder="+56 9 1234 5678" autocomplete="tel"></div>
      <div class="row"><div class="field"><label for="rp1">Contraseña</label><input id="rp1" type="password" required autocomplete="new-password"></div><div class="field"><label for="rp2">Repite la contraseña</label><input id="rp2" type="password" required autocomplete="new-password"></div></div>
      <label class="check"><input type="checkbox" id="rterm"> Acepto los términos de uso y la política de privacidad</label>
      <button class="btn" type="submit">Crear cuenta</button>
      <span class="muted" style="font-size:14px">¿Ya tienes cuenta? <button type="button" class="link" data-act="gologin">Inicia sesión</button></span>
    </form></main>`;
}
async function doLogin(){
  const email=document.getElementById("lemail").value.trim().toLowerCase(),pw=document.getElementById("lpass").value,rem=document.getElementById("lrem").checked;
  ui.loginEmail=email;
  if(!email||!pw){ui.loginErr="Escribe tu correo y tu contraseña.";render();return}
  const u=S.users.find(x=>x.email.toLowerCase()===email);
  if(!u){log("Acceso fallido","Correo no registrado: "+email,"Visitante");save();ui.loginErr="El correo o la contraseña no son correctos.";render();return}
  if(u.bloqueado){ui.loginErr="La cuenta está bloqueada por intentos fallidos. Pide al back office que la desbloquee.";render();return}
  if(!u.activo){ui.loginErr="La cuenta está desactivada. Contacta con el back office.";render();return}
  let h="";try{h=await hashPw(pw)}catch(e){ui.loginErr="Este navegador no permite verificar la contraseña. Prueba con otro navegador.";render();return}
  if(h!==u.hash){u.intentos=(u.intentos||0)+1;if(u.intentos>=5){u.bloqueado=true;log("Cuenta bloqueada",u.email+" tras 5 intentos fallidos","Sistema")}else log("Acceso fallido",u.email+" (intento "+u.intentos+" de 5)","Visitante");save();
    ui.loginErr=u.bloqueado?"Cuenta bloqueada tras 5 intentos fallidos. Pide al back office que la desbloquee.":"El correo o la contraseña no son correctos. Te quedan "+(5-u.intentos)+" intentos.";render();return}
  startSession(u,rem);
}
function startSession(u,rem){
  u.intentos=0;u.ultimo=nowISO();ui.uid=u.id;ui.asUid=null;ui.asBo=false;ui.loginErr="";ui.loginEmail="";ui.regErr="";setSession(u.id,rem);
  log("Inicio de sesión",ROLES[u.role],u.nombre);save();
  ui.screen="app";ui.tab=TABS[u.role][0][0];ui.q="";render();window.scrollTo(0,0);
  if(u.cambiar)mChangePw(true);
  else if(u.actorId==="a1"&&S.params.bienvenida.activo&&!S.params.bienvenida.mostrado)mBday();
}
async function doRegister(){
  const g=id=>document.getElementById(id).value.trim();
  const r=g("rrol"),nom=g("rnom"),em=g("rem").toLowerCase(),wa=g("rwa"),p1=document.getElementById("rp1").value,p2=document.getElementById("rp2").value,emp=g("remp"),term=document.getElementById("rterm").checked;
  const fail=m=>{ui.regErr=m;ui.regHint=r;render();const keep={rnom:nom,rem:em,rwa:wa,remp:emp};Object.keys(keep).forEach(k=>{const e=document.getElementById(k);if(e)e.value=keep[k]});document.getElementById("rterm").checked=term};
  if(!nom||!em)return fail("Completa tu nombre y tu correo.");
  if(!emailValido(em))return fail("El correo no tiene un formato válido.");
  if(r==="admin"&&!emp)return fail("Escribe el nombre de tu administradora.");
  if(S.users.some(u=>u.email.toLowerCase()===em))return fail("Ya existe una cuenta con ese correo. Inicia sesión o usa otro correo.");
  if(!passwordValida(p1))return fail("La contraseña debe tener al menos 8 caracteres, con letras y números.");
  if(p1!==p2)return fail("Las dos contraseñas no coinciden.");
  if(!term)return fail("Debes aceptar los términos para crear la cuenta.");
  let actor;
  if(r==="tenant"){actor="t"+uid("n");S.tenants.push({id:actor,nombre:nom,desde:todayISO(),wa})}
  if(r==="owner"){actor="o"+uid("n");S.owners.push({id:actor,nombre:nom,wa})}
  if(r==="admin"){actor="a"+uid("n");S.administradoras.push({id:actor,nombre:emp,contacto:nom,ciudad:"Santiago",comuna:"",comisionAdm:8,desde:S.periodo.ym,wa})}
  const u={id:uid("u"),nombre:nom,email:em,role:r,actorId:actor,hash:await hashPw(p1),activo:true,bloqueado:false,intentos:0,ultimo:null,cambiar:false,wa};
  S.users.push(u);log("Registro","Nueva cuenta de "+ROLES[r]+": "+em,nom);save();
  startSession(u,false);toast("Cuenta creada. Bienvenido a KLIP");
}

const TABS={
  tenant:[["inicio","Inicio"],["reparaciones","Reparaciones"],["proveedores","Proveedores"],["mensajes","Mensajes"],["historial","Historial de pago"]],
  owner:[["resumen","Mis propiedades"],["liquidacion","Liquidación"],["solicitudes","Reparaciones"],["proveedores","Proveedores"],["mensajes","Mensajes"],["historial","Pagos recibidos"]],
  admin:[["resumen","Resumen"],["propiedades","Cartera"],["arrendatarios","Arrendatarios"],["liquidaciones","Liquidaciones"],["solicitudes","Reparaciones"],["proveedores","Proveedores"],["historico","Histórico"],["contratos","Contratos"],["comunidades","Comunidades"],["mensajes","Mensajes"]],
  bo:[["panel","Panel"],["administradoras","Administradoras"],["usuarios","Usuarios"],["proveedores","Proveedores"],["parametros","Parámetros"],["auditoria","Auditoría"],["lab","Lab"]]};

function shell(){
  const u=cur(),r=role(),me=meActor(),unr=unread(),full=!ui.asUid&&sessUser()&&sessUser().bo;
  const pend=S.repairs.filter(x=>{const p=prop(x.propId);if(!p)return false;if(x.estado==="solicitada")return (r==="admin"&&p.adminId===me)||(r==="owner"&&p.ownerId===me);if(x.estado==="aprobada")return r==="tenant"&&x.tenantId===me;return false}).length;
  const labOpen=LAB.items.filter(i=>i.estado==="Propuesta").length;
  const tabs=TABS[r].map(([k,l])=>`<button class="tab" data-act="tab" data-tab="${k}" ${ui.tab===k?'aria-current="page"':""}>${l}${k==="mensajes"&&unr?`<span class="badge">${unr}</span>`:""}${(k==="solicitudes"||k==="reparaciones")&&pend?`<span class="badge">${pend}</span>`:""}${k==="lab"&&labOpen?`<span class="badge" style="background:var(--bo)">${labOpen}</span>`:""}</button>`).join("");
  const imp=ui.asUid?`<div class="imp"><div class="wrap"><span>Estás viendo la plataforma como <b>${esc(u.nombre)}</b> (${ROLES[r]}). Lo que hagas queda en la auditoría con tu nombre y el suyo. No puedes firmar actas en su nombre.</span><button class="btn sm" data-act="stopimp">Volver al back office</button></div></div>`:"";
  const emp=r==="admin"?empresaDe(me):"";
  return `<header class="top ${r==="bo"?"is-bo":""}"><div class="wrap">
      <button class="logo" data-act="tab" data-tab="${TABS[r][0][0]}" aria-label="Ir al inicio">${LOGO(150,false)}${r==="bo"?'<span class="bo-tag">Back office</span>':""}</button><span class="spacer"></span>
      <div class="who"><div><b>Hola ${esc(u.nombre.split(" ")[0])}</b><small>${emp?esc(emp):ROLES[r]}${full&&r!=="bo"?", acceso total":""}</small></div><span class="av">${esc(u.nombre[0])}</span></div>
      ${full?`<button class="btn-ghost" data-act="swbo">${r==="bo"?"Mi administradora":"Back office"}</button>`:""}${ui.asUid?"":`<button class="btn-ghost" data-act="profile">Mi perfil</button>`}
      <button class="btn-ghost" data-act="logout">Cerrar sesión</button>
    </div></header>${imp}
    <nav class="tabs" aria-label="Secciones"><div class="wrap">${tabs}</div></nav>
    <main class="wrap">${view()}</main>
    <footer class="wrap foot"><span>Periodo de cobro: ${ymLabel(S.periodo.ym)}. UF referencial ${clp(UF())}.</span>${r!=="bo"?`<button class="link" data-act="suggest">Sugerir una mejora</button>`:""}</footer>`;
}
function view(){
  const r=role(),t=ui.tab;
  if(t==="proveedores")return vProveedores();
  if(r==="bo")return t==="administradoras"?vAdministradoras():t==="usuarios"?vUsers():t==="parametros"?vParams():t==="auditoria"?vAudit():t==="lab"?vLab():vBoPanel();
  if(t==="mensajes")return vMensajes();
  if(r==="tenant")return t==="reparaciones"?vRepairs():t==="historial"?vHist():vTenantHome();
  if(r==="owner")return t==="solicitudes"?vRepairs():t==="historial"?vHist():t==="liquidacion"?vLiquidaciones():vOwner();
  if(t==="propiedades")return vAdminProps();
  if(t==="arrendatarios")return vAdminTenants();
  if(t==="liquidaciones")return vLiquidaciones();
  if(t==="comunidades")return vComunidades();
  if(t==="contratos")return vContratos();
  if(t==="solicitudes")return vRepairs();
  if(t==="historico")return vHistorico(myProps(),"Histórico de la cartera");
  return vAdminHome();
}

/* Arrendatario */
function vTenantHome(){
  const me=meActor(),props=S.props.filter(p=>p.tenantId===me);
  if(!props.length)return `<div class="welcome"><h1>Hola ${esc(nombreActor(me).split(" ")[0])}</h1></div><div class="panel empty"><h2 style="margin-bottom:8px">Aún no tienes un arriendo vinculado</h2><p>Pide a tu administradora que te agregue con el correo <b>${esc(cur().email)}</b>. Cuando lo haga, aquí verás tus cobros.</p></div>`;
  const total=props.reduce((a,p)=>a+aPagarArriendo(p)+aPagarGC(p),0);
  const cards=props.map(p=>{
    const o=ownerOf(p),a=admOf(p),ar=aPagarArriendo(p),gc=aPagarGC(p),dsc=descuento(p);
    return `<article class="panel bill"><div class="bill-h"><h3>Arriendo</h3><small>Propietario ${esc(o?o.nombre:"")} / ${esc(a?a.nombre:"")}</small></div>
      <div class="bill-b"><div><div class="amount num">${p.paid?"Pagado":clp(ar)}</div>
        <div class="bill-meta"><span>Mes ${ymLabel(S.periodo.ym)}, vence ${dmy(S.periodo.vence)}</span><span>Arriendo del mes ${clp(rentCLP(p))}${p.moneda==="UF"?" (UF "+fmt.format(p.monto)+")":""}${dsc&&!p.paid?", descuento reparación "+clp(dsc):""}</span><span><button class="link" data-act="detail" data-id="${p.id}">Ver detalle de arriendo a pagar</button></span></div></div>
        <div class="house">${ICON.house}</div></div>
      <div class="bill-f"><span class="addr">${esc(p.dir)}, ${esc(p.comuna)}</span>${p.paid?`<span class="pill p-ok">Pagado el ${dmy(p.lastPay)}</span>`:`<button class="btn sm" data-act="pay" data-items="${p.id}:a">Pagar este arriendo</button>`}</div></article>
    <article class="panel bill"><div class="bill-h"><h3>Gastos comunes</h3><small>${esc(p.gc.comunidad)} / ${esc(a?a.nombre:"")}</small></div>
      <div class="bill-b"><div><div class="amount num">${p.gcPaid?"Pagado":clp(gc)}</div>
        <div class="bill-meta"><span>Mes ${ymLabel(S.periodo.ym)}, vence ${dmy(S.periodo.vence)}</span><span>Cuota del mes ${clp(p.gc.monto)}${p.gcDeuda?", saldo anterior "+clp(p.gcDeuda):""}</span></div></div>
        <div class="house">${ICON.house}</div></div>
      <div class="bill-f"><span class="addr">${esc(p.dir)}, ${esc(p.comuna)}</span>${p.gcPaid?`<span class="pill p-ok">Pagado</span>`:`<button class="btn sm" data-act="pay" data-items="${p.id}:g">Pagar gastos comunes</button>`}</div></article>`;}).join("");
  const p=props[0],toConf=S.repairs.filter(r=>r.tenantId===me&&r.estado==="aprobada");
  const t=byId(S.tenants,me);
  return `<div class="welcome"><h1>Hola ${esc(nombreActor(me).split(" ")[0])}</h1><p>Arrendatario desde ${ymLabel(t.desde.slice(0,7))}. Todo lo de tu arriendo en un solo lugar.</p></div>
  ${toConf.length?`<div class="note" style="margin-bottom:16px;display:flex;gap:12px;align-items:center;flex-wrap:wrap"><span>El propietario aprobó <b>${esc(toConf[0].desc.toLowerCase())}</b>. Cuando el trabajo esté hecho, confirma tu conformidad para que empiece el descuento.</span><button class="btn sm ok" data-act="acta" data-id="${toConf[0].id}">Revisar y confirmar</button></div>`:""}
  <div class="grid g-side"><div class="grid">
    <div class="panel totalbar"><span class="t">Total gastos<b class="num">${clp(total)}</b></span><button class="btn" data-act="pay" data-items="${props.map(p=>(p.paid?"":p.id+":a,")+(p.gcPaid?"":p.id+":g,")).join("")}" ${total?"":"disabled"}>Pagar mis gastos</button></div>
    ${cards}</div>
    <aside class="grid" style="align-content:start">
      <div class="panel"><div class="quick">
        <button class="qa" data-act="compose" data-to="${p.ownerId}">${ICON.msg}Mensaje al propietario</button>
        <button class="qa" data-act="contract" data-id="${p.id}">${ICON.doc}Contrato y garantía</button>
        <button class="qa" data-act="tab" data-tab="historial">${ICON.hist}Historial de pago</button>
        <button class="qa" data-act="newrep" data-id="${p.id}">${ICON.tool}Solicitar reparación</button>
        <button class="qa" data-act="wa" data-to="${p.adminId}" data-pid="${p.id}">${ICON.wa}WhatsApp a la administradora</button>
        <button class="qa" data-act="tab" data-tab="proveedores">${ICON.team}Proveedores</button>
      </div></div>
      <div class="promo"><h3>Paga con tarjeta y gana beneficios</h3><span>Con las alianzas bancarias de KLIP tu arriendo suma:</span><ul><li>Kilómetros de aerolínea</li><li>Puntos de tu banco</li><li>Descuentos en comercios asociados</li></ul></div>
    </aside></div>`;
}

/* Reparaciones */
function repStateLabel(r){
  if(r.estado==="solicitada")return `<span class="pill p-warn">Esperando al propietario</span>`;
  if(r.estado==="aprobada")return `<span class="pill p-info">Aprobada, falta conformidad</span>`;
  if(r.estado==="rechazada")return `<span class="pill p-bad">Rechazada</span>`;
  if(r.saldadas)return `<span class="pill p-mute">${r.saldadas===r.cuotas?"Saldada":r.cuotas-r.saldadas+" descontadas, resto saldado"} en la salida</span>`;
  if(r.descontadas<r.cuotas)return `<span class="pill p-info">Descontando ${r.descontadas} de ${r.cuotas}</span>`;
  return `<span class="pill p-ok">Descontada</span>`;
}
function vRepairs(){
  const r=role(),me=meActor(),ids=new Set(myProps().map(p=>p.id));
  const list=repsAll().filter(x=>r==="tenant"?x.tenantId===me:ids.has(x.propId));
  const activas=list.filter(x=>!x.gen&&x.estado!=="rechazada"&&(x.estado!=="conforme"||x.descontadas<x.cuotas));
  const firmadas=list.filter(x=>x.estado==="conforme").sort((a,b)=>b.fecha.localeCompare(a.fecha));
  const shown=ui.repFilter==="activas"?activas:firmadas;
  const p0=r==="tenant"?S.props.find(x=>x.tenantId===me):null;
  const totalDesc=firmadas.reduce((a,x)=>a+x.monto,0);
  return `<div class="welcome"><h1>Reparaciones</h1><p>Lo que aprueban propietario y arrendatario se descuenta del arriendo. ${firmadas.length} reparaciones firmadas por ${clp(totalDesc)}.</p><span style="flex:1"></span>${p0?`<button class="btn" data-act="newrep" data-id="${p0.id}">Solicitar reparación</button>`:""}</div>
  <div class="panel"><div class="panel-h"><div class="chips"><button class="chip" data-act="repf" data-v="activas" aria-pressed="${ui.repFilter==="activas"}">En curso (${activas.length})</button><button class="chip" data-act="repf" data-v="hist" aria-pressed="${ui.repFilter!=="activas"}">Historial firmado (${firmadas.length})</button></div></div>
  ${shown.length?`<div class="tbl-wrap"><table><thead><tr><th>Fecha</th><th>Propiedad</th><th>Reparación</th><th>Proveedor</th><th class="r">Monto</th><th>Descuento</th><th>Estado</th><th></th></tr></thead><tbody>${shown.slice(0,120).map(x=>{const p=prop(x.propId),pv=provById(x.provId);
    const canApprove=!ui.asUid&&x.estado==="solicitada"&&((r==="owner"&&p.ownerId===me)||(r==="admin"&&p.adminId===me));
    const canConf=!ui.asUid&&x.estado==="aprobada"&&r==="tenant"&&x.tenantId===me;
    return `<tr><td class="num">${dmy(x.fecha)}</td><td><span class="code">${p.code}</span><span class="sub">${esc(p.dir)}</span></td><td>${esc(x.desc)}<span class="sub">${esc(x.cat)}, ${esc(nombreActor(x.tenantId))}</span></td><td>${pv?esc(pv.nombre):"Por definir"}</td><td class="r num">${clp(x.monto)}</td><td class="num">${x.cuotas} x ${clp(cuotaBase(x))}</td><td>${repStateLabel(x)}</td><td>${canApprove?`<button class="btn sm ok" data-act="approve" data-id="${x.id}">Revisar</button>`:canConf?`<button class="btn sm ok" data-act="acta" data-id="${x.id}">Confirmar</button>`:`<button class="btn sm sec" data-act="acta" data-id="${x.id}">Ver acta</button>`}</td></tr>`}).join("")}</tbody></table></div>${shown.length>120?`<p class="muted" style="padding:0 18px 14px;font-size:13px">Se muestran las 120 más recientes de ${shown.length}.</p>`:""}`:`<div class="empty">${ui.repFilter==="activas"?"No hay reparaciones en curso.":"Aún no hay reparaciones firmadas."}</div>`}</div>`;
}

/* Proveedores */
function vProveedores(){
  const cat=ui.provCat,city=ui.provCity,q=ui.q.toLowerCase(),r=role();
  const list=provsAll().filter(p=>(cat==="todas"||p.cat===cat)&&(city==="todas"||p.ciudad===city)&&(!q||(p.nombre+" "+p.comunas+" "+p.cat).toLowerCase().includes(q)));
  const myProp=r==="tenant"?S.props.find(x=>x.tenantId===meActor()):null;
  return `<div class="welcome"><h1>Red de proveedores</h1><p>${provsAll().length} proveedores para reparaciones y mantención. Las valoraciones salen de trabajos firmados en KLIP.</p><span style="flex:1"></span>${r==="admin"||r==="bo"?`<button class="btn" data-act="newprov">Agregar proveedor</button>`:""}</div>
  <div class="panel" style="margin-bottom:16px"><div class="panel-h"><select class="sel" id="provcat" aria-label="Especialidad"><option value="todas">Todas las especialidades</option>${CAT_NAMES.map(c=>`<option ${c===cat?"selected":""}>${c}</option>`).join("")}</select><select class="sel" id="provcity" aria-label="Ciudad"><option value="todas">Todas las ciudades</option>${["Santiago","Valparaíso","Concepción"].map(c=>`<option ${c===city?"selected":""}>${c}</option>`).join("")}</select><span style="flex:1"></span><input class="search" id="q" type="search" placeholder="Buscar por nombre o comuna" value="${esc(ui.q)}" aria-label="Buscar proveedores"></div></div>
  ${list.length?`<div class="provs">${list.map(p=>{const rt=provRating(p.id);return `<article class="panel prov"><div style="display:flex;justify-content:space-between;gap:8px;align-items:start"><span class="pill p-info">${esc(p.cat)}</span>${p.sec?'<span class="sec-b" title="Instalador autorizado por la Superintendencia de Electricidad y Combustibles">SEC</span>':""}</div><h3>${esc(p.nombre)}</h3><span class="meta">${esc(p.comunas)}, ${esc(p.ciudad)}</span><span class="meta">${esc(p.precio)}. En KLIP desde ${p.desde}.</span><span>${rt.avg?`<span class="stars" aria-label="${rt.avg.toFixed(1)} de 5">${stars(rt.avg)}</span> <b class="num">${rt.avg.toFixed(1).replace(".",",")}</b> <span class="muted">(${rt.n} trabajos)</span>`:'<span class="muted">Sin trabajos registrados aún</span>'}</span><div class="acts"><button class="btn sm wa" data-act="wa" data-prov="${p.id}">WhatsApp</button>${myProp?`<button class="btn sm sec" data-act="newrep" data-id="${myProp.id}" data-prov="${p.id}">Pedir esta reparación</button>`:""}</div></article>`}).join("")}</div>`:'<div class="panel empty">Ningún proveedor coincide con el filtro.</div>'}`;
}

/* Propietario */
function vOwner(){
  const me=meActor(),props=S.props.filter(p=>p.ownerId===me);
  if(!props.length)return `<div class="welcome"><h1>Hola ${esc(nombreActor(me).split(" ")[0])}</h1></div><div class="panel empty"><h2 style="margin-bottom:8px">Aún no tienes propiedades en KLIP</h2><p>Tu administradora puede cargarlas con tu correo <b>${esc(cur().email)}</b>.</p></div>`;
  const neto=props.map(liquidacion).reduce((a,l)=>a+l.neto,0);
  const pend=props.filter(p=>p.tenantId&&!p.paid).reduce((a,p)=>a+rentCLP(p)+p.deuda-(p.abono||0),0);
  const rented=props.filter(p=>p.tenantId);
  const rprom=rented.length?rented.reduce((a,p)=>a+rentab(p),0)/rented.length:0;
  const sectores={};props.forEach(p=>{(sectores[p.comuna]=sectores[p.comuna]||[]).push(p)});
  const allSec={};S.props.filter(p=>p.tenantId).forEach(p=>{(allSec[p.comuna]=allSec[p.comuna]||[]).push(rentab(p))});
  const desde=props.reduce((a,p)=>p.alta<a?p.alta:a,"9999-99");
  return `<div class="welcome"><h1>Hola ${esc(nombreActor(me).split(" ")[0])}</h1><p>Propietario en KLIP desde ${ymLabel(desde)}. Tus pagos llegan desde una sola entidad.</p></div>
  <div class="grid g-4" style="margin-bottom:18px">
    <div class="panel kpi"><div class="l">Propiedades</div><div class="v num">${props.length}</div><div class="d muted">${rented.length} arrendadas</div></div>
    <div class="panel kpi ok"><div class="l">Neto ${ymLabel(S.periodo.ym)}</div><div class="v num">${clp(neto)}</div><div class="d muted">después de comisión e IVA</div></div>
    <div class="panel kpi ${pend?"warn":""}"><div class="l">Por recibir</div><div class="v num">${clp(pend)}</div><div class="d muted">incluye saldos atrasados</div></div>
    <div class="panel kpi"><div class="l">Rentabilidad bruta</div><div class="v num">${pct1(rprom)}</div><div class="d muted">anual promedio arrendadas</div></div></div>
  <div class="grid g-side"><div class="panel"><div class="panel-h"><h2>Mis inversiones</h2></div><div class="tbl-wrap"><table><thead><tr><th>Código</th><th>Dirección</th><th>Arrendatario</th><th class="r">Arriendo</th><th>Estado</th><th>Último pago</th><th class="r">Rentab.</th></tr></thead><tbody>${props.map(p=>{const e=estado(p),t=tenantOf(p);return `<tr><td><button class="code link" data-act="ficha" data-id="${p.id}">${p.code}</button></td><td>${esc(p.dir)}<span class="sub">${esc(p.comuna)}, ${esc((admOf(p)||{}).nombre||"")}</span></td><td>${t?esc(t.nombre):'<span class="muted">Disponible</span>'}</td><td class="r num">${rentLabel(p)}${p.moneda==="UF"?`<span class="sub">${clp(rentCLP(p))}</span>`:""}</td><td><span class="pill ${e.c}">${e.t}</span>${p.deuda?`<span class="sub">Debe ${clp(p.deuda)}</span>`:""}</td><td class="num">${dmy(p.lastPay)}</td><td class="r num">${p.tenantId?pct1(rentab(p)):"-"}</td></tr>`}).join("")}</tbody></table></div></div>
  <aside class="panel" style="align-self:start"><div class="panel-h"><h2>Rentabilidad por sector</h2></div><div class="panel-b"><div class="tbl-wrap"><table><thead><tr><th>Comuna</th><th class="r">Tuyas</th><th class="r">Mercado KLIP</th></tr></thead><tbody>${Object.keys(sectores).map(c=>{const mine=sectores[c].filter(p=>p.tenantId);const m=mine.length?mine.reduce((a,p)=>a+rentab(p),0)/mine.length:null;const mk=allSec[c]?allSec[c].reduce((a,b)=>a+b,0)/allSec[c].length:null;return `<tr><td>${esc(c)}</td><td class="r num">${m==null?"-":pct1(m)}</td><td class="r num">${mk==null?"-":pct1(mk)}</td></tr>`}).join("")}</tbody></table></div><p class="muted" style="font-size:12px;margin:10px 0 0">Rentabilidad bruta anual: arriendo por 12 sobre el valor de la propiedad en UF.</p></div></aside></div>
  <div style="margin-top:18px">${vHistoricoBlock(props)}</div>`;
}
function vLiquidaciones(){
  const props=myProps().filter(p=>p.tenantId||liquidacion(p).pagado);
  const rows=props.map(p=>({p,l:liquidacion(p)}));
  const tot=rows.reduce((a,x)=>{a.b+=x.l.bruto;a.d+=x.l.desc;a.c+=x.l.com;a.i+=x.l.iva;a.n+=x.l.neto;return a},{b:0,d:0,c:0,i:0,n:0});
  const r=role();
  return `<div class="welcome"><h1>${r==="owner"?"Mi liquidación":"Liquidaciones a propietarios"}</h1><p>${ymLabel(S.periodo.ym)}. Arriendo cobrado menos reparaciones aprobadas, comisión de administración e IVA. Transferencia en 72 horas hábiles desde el pago.</p></div>
  <div class="panel"><div class="tbl-wrap"><table><thead><tr><th>Propiedad</th>${r==="admin"?"<th>Propietario</th>":""}<th class="r">Canon</th><th class="r">Reparaciones</th><th class="r">Comisión</th><th class="r">IVA</th><th class="r">Neto</th><th>Estado</th></tr></thead><tbody>${rows.map(({p,l})=>`<tr><td><span class="code">${p.code}</span><span class="sub">${esc(p.dir)}</span></td>${r==="admin"?`<td>${esc((ownerOf(p)||{}).nombre||"")}</td>`:""}<td class="r num">${clp(l.bruto)}</td><td class="r num">${l.desc?"-"+clp(l.desc):"-"}</td><td class="r num">${l.com?"-"+clp(l.com):"-"}</td><td class="r num">${l.iva?"-"+clp(l.iva):"-"}</td><td class="r num"><b>${clp(l.neto)}</b></td><td>${l.pagado?'<span class="pill p-ok">Liquidado</span>':'<span class="pill p-warn">Esperando pago</span>'}</td></tr>`).join("")}
  <tr><td><b>Total</b></td>${r==="admin"?"<td></td>":""}<td class="r num"><b>${clp(tot.b)}</b></td><td class="r num">${tot.d?"-"+clp(tot.d):"-"}</td><td class="r num">-${clp(tot.c)}</td><td class="r num">-${clp(tot.i)}</td><td class="r num"><b>${clp(tot.n)}</b></td><td></td></tr></tbody></table></div></div>`;
}

/* Administradora */
function adminCounts(props){
  const al=props.filter(p=>estado(p).k==="aldia"),mo=props.filter(p=>estado(p).k==="morosa"),va=props.filter(p=>estado(p).k==="vacia");
  const esperado=esperadoMes(props),recaudado=arriendosMes(S.periodo.ym,props);
  return {al,mo,va,esperado,recaudado,pct:esperado?Math.min(100,Math.round(recaudado/esperado*100)):0};
}
function chartBlock(scope){
  return `<div class="panel"><div class="panel-h"><h2>Pagos recibidos</h2><span class="eyebrow">Arriendos recaudados a través de KLIP, últimos 12 meses</span></div><div class="panel-b"><div class="chart" data-chart="recaudo" data-scope="${scope||""}" role="img" aria-label="Gráfico de arriendos recaudados por mes"></div>
  <div class="legend"><span><i style="background:var(--klip)"></i>Recaudado en meses cerrados</span><span><i style="background:var(--sky)"></i>${ymLabel(S.periodo.ym)}, en curso</span><span><i style="background:transparent;border-top:2px dashed var(--bad);height:0;border-radius:0"></i>Esperado de la cartera actual</span></div></div></div>`;
}
function scopeProps(scope){if(!scope)return S.props;if(scope==="mine")return myProps();return S.props.filter(p=>p.adminId===scope)}
function vAdminHome(){
  const props=myProps(),c=adminCounts(props),A=byId(S.administradoras,meActor());
  const deudaMo=c.mo.reduce((a,p)=>a+p.deuda,0),vacioVal=c.va.reduce((a,p)=>a+rentCLP(p),0);
  return `<div class="welcome"><h1>Panel de control</h1><p>${esc(A?A.nombre:"")}, ${ymLabel(S.periodo.ym)}, vencimiento ${dmy(S.periodo.vence)}</p></div>
  ${props.length?"":`<div class="note" style="margin-bottom:16px">Tu cartera está vacía. Empieza cargando tu primera propiedad en <button class="link" data-act="tab" data-tab="propiedades">Cartera</button>.</div>`}
  <div class="grid g-side"><div class="grid">
    <div class="panel"><div class="panel-h"><h2>Resumen</h2><span class="eyebrow">Cartera administrada</span></div><div class="panel-b grid">
      <div class="strip">${props.map(p=>{const e=estado(p);return `<div class="mini"><b>${esc(p.dir.split(",")[0])}</b><span class="pill ${e.c}" style="margin-top:4px">${e.t}</span></div>`}).join("")}</div>
      <div class="tbl-wrap"><table><thead><tr><th>Estado</th><th class="r">Propiedades</th><th class="r">Monto</th></tr></thead><tbody>
        <tr><td>Al día (recaudado en el mes)</td><td class="r num">${c.al.length}</td><td class="r num" style="color:var(--klip);font-weight:700">${clp(c.recaudado)}</td></tr>
        <tr><td>Morosas (saldo atrasado)</td><td class="r num">${c.mo.length}</td><td class="r num" style="color:var(--bad);font-weight:700">-${clp(deudaMo)}</td></tr>
        <tr><td>Sin arrendatario (arriendo que no entra)</td><td class="r num">${c.va.length}</td><td class="r num" style="color:var(--bad);font-weight:700">-${clp(vacioVal)}</td></tr>
        <tr><td><b>Total cartera / esperado del mes</b></td><td class="r num"><b>${props.length}</b></td><td class="r num"><b>${clp(c.esperado)}</b></td></tr>
      </tbody></table></div>
      <div style="display:flex;align-items:center;gap:16px"><div style="flex:1;display:grid;gap:4px"><div class="prog" role="progressbar" aria-valuenow="${c.pct}" aria-valuemin="0" aria-valuemax="100" aria-label="Recaudación del mes"><i style="width:${c.pct}%"></i></div><span class="muted" style="font-size:13px">${clp(c.recaudado)} recaudado de ${clp(c.esperado)} esperado</span></div><span class="pct num">${c.pct}%</span></div>
    </div></div>
    ${chartBlock("mine")}
  </div>
  <aside class="grid" style="align-content:start">
    <div class="panel"><div class="panel-h"><h2>Cobranza</h2></div><div class="panel-b grid" style="gap:10px">${c.mo.length?c.mo.map(p=>{const t=tenantOf(p);return `<div style="display:flex;gap:10px;align-items:center;justify-content:space-between"><div><b>${esc(t.nombre)}</b><span class="sub">${esc(p.dir)}, debe ${clp(p.deuda)}</span></div><button class="btn sm wa" data-act="remind" data-id="${p.id}">Recordar</button></div>`}).join(""):'<span class="muted">Sin morosos este mes.</span>'}</div></div>
    <div class="panel"><div class="panel-h"><h2>Bandeja de comunicaciones</h2></div><div class="quick">
      <button class="qa" data-act="tab" data-tab="arrendatarios">${ICON.wa}WhatsApp a arrendatarios</button>
      <button class="qa" data-act="tab" data-tab="mensajes">${ICON.doc}Historial de mensajes${unread()?`<span class="badge">${unread()}</span>`:""}</button>
      <button class="qa" data-act="tab" data-tab="solicitudes">${ICON.tool}Reparaciones</button>
      <button class="qa" data-act="tab" data-tab="liquidaciones">${ICON.hist}Liquidaciones</button></div></div>
  </aside></div>`;
}
function vAdminProps(){
  const f=ui.filter,q=ui.q.toLowerCase(),all=myProps();
  const list=all.filter(p=>{const e=estado(p).k;if(f!=="todas"&&e!==f)return false;const t=tenantOf(p),o=ownerOf(p);return !q||(p.dir+" "+p.comuna+" "+p.code+" "+(t?t.nombre:"")+" "+(o?o.nombre:"")).toLowerCase().includes(q)});
  const chip=(k,l)=>`<button class="chip" data-act="filter" data-f="${k}" aria-pressed="${f===k}">${l}</button>`;
  return `<div class="welcome"><h1>Cartera</h1><p>${all.length} propiedades en administración. Pulsa el código para ver la ficha completa con su historia desde el alta.</p><span style="flex:1"></span><button class="btn" data-act="newprop">Nueva propiedad</button></div>
  <div class="panel"><div class="panel-h"><div class="chips">${chip("todas","Todas")}${chip("aldia","Al día")}${chip("morosa","Morosas")}${chip("vacia","Sin arrendatarios")}</div><span style="flex:1"></span><input class="search" id="q" type="search" placeholder="Buscar propiedades" value="${esc(ui.q)}" aria-label="Buscar propiedades"></div>
  <div class="tbl-wrap">${list.length?propTable(list,true):'<div class="empty">Ninguna propiedad coincide con la búsqueda.</div>'}</div></div>`;
}
function propTable(list,actions){
  return `<table><thead><tr><th>Código</th><th>Dirección</th><th>Arrendatario</th><th>Propietario</th><th class="r">Valor arriendo</th><th>Estado</th><th>Último pago</th>${actions?"<th></th>":""}</tr></thead><tbody>${list.map(p=>{const e=estado(p),t=tenantOf(p),o=ownerOf(p);return `<tr><td><button class="code link" data-act="ficha" data-id="${p.id}">${p.code}</button></td><td>${esc(p.dir)}<span class="sub">${esc(p.comuna)}, desde ${ymLabel(p.alta)}</span></td><td>${t?esc(t.nombre):'<span class="muted">Disponible</span>'}</td><td>${esc(o?o.nombre:"")}</td><td class="r num">${rentLabel(p)}</td><td><span class="pill ${e.c}">${e.t}</span></td><td class="num">${dmy(p.lastPay)}</td>${actions?`<td><div style="display:flex;gap:6px;justify-content:flex-end">${e.k==="morosa"?`<button class="btn sm wa" data-act="remind" data-id="${p.id}">Recordar</button>`:""}${t&&!p.paid?`<button class="btn sm sec" data-act="manual" data-id="${p.id}">Registrar pago</button>`:""}${!t&&puedeGestionar(p)&&!ui.asUid?`<button class="btn sm ok" data-act="assign" data-id="${p.id}">Asignar arrendatario</button>`:""}</div></td>`:""}</tr>`}).join("")}</tbody></table>`;
}
function vAdminTenants(){
  return `<div class="welcome"><h1>Arrendatarios</h1><p>Vigentes y morosos. Agrega su número de WhatsApp para escribirles directamente.</p></div><div class="panel"><div class="tbl-wrap"><table><thead><tr><th>Arrendatario</th><th>WhatsApp</th><th>Antigüedad</th><th class="r">Valor arriendo</th><th>Estado</th><th>Último pago</th><th></th></tr></thead><tbody>${myProps().filter(p=>p.tenantId).map(p=>{const t=tenantOf(p),e=estado(p);const meses=Math.max(0,ymDiff(t.desde.slice(0,7),S.periodo.ym));const w=waOf(t.id);return `<tr><td><b>${esc(t.nombre)}</b><span class="sub">${esc(p.dir)}</span></td><td class="num">${w?esc(w):`<button class="link" data-act="setwa" data-id="${t.id}">Agregar número</button>`}</td><td class="num">${meses>=12?Math.floor(meses/12)+" años "+(meses%12)+" m":meses+" meses"}</td><td class="r num">${rentLabel(p)}</td><td><span class="pill ${e.c}">${e.t}</span></td><td class="num">${dmy(p.lastPay)}</td><td><div style="display:flex;gap:6px;justify-content:flex-end"><button class="btn sm wa" data-act="wa" data-to="${t.id}" data-pid="${p.id}">WhatsApp</button><button class="btn sm sec" data-act="compose" data-to="${t.id}">Mensaje</button></div></td></tr>`}).join("")||'<tr><td colspan="7" class="empty">Sin arrendatarios todavía.</td></tr>'}</tbody></table></div></div>`;
}
function vComunidades(){
  const g={};myProps().forEach(p=>{(g[p.gc.comunidad]=g[p.gc.comunidad]||[]).push(p)});
  return `<div class="welcome"><h1>Comunidades</h1><p>Gastos comunes de ${ymLabel(S.periodo.ym)}</p></div><div class="panel"><div class="tbl-wrap"><table><thead><tr><th>Comunidad</th><th>Unidad</th><th class="r">Cuota mes</th><th class="r">Saldo anterior</th><th>Estado</th></tr></thead><tbody>${Object.keys(g).map(k=>g[k].map(p=>`<tr><td><b>${esc(k)}</b></td><td>${esc(p.dir)}<span class="sub">${tenantOf(p)?esc(tenantOf(p).nombre):"Sin ocupante, paga propietario"}</span></td><td class="r num">${clp(p.gc.monto)}</td><td class="r num">${p.gcDeuda?clp(p.gcDeuda):"-"}</td><td>${p.gcPaid?'<span class="pill p-ok">Pagado</span>':p.gcDeuda?'<span class="pill p-bad">Atrasado</span>':'<span class="pill p-warn">Pendiente</span>'}</td></tr>`).join("")).join("")}</tbody></table></div></div>`;
}
function vContratos(){
  const hoy=todayISO(),props=myProps();
  const vencidos=props.filter(p=>p.tenantId&&p.reajuste.tipo==="IPC"&&proxReajuste(p)<=hoy);
  return `<div class="welcome"><h1>Contratos</h1><p>Parametrización de reajustes por UF o IPC</p></div>
  <div class="grid g-2" style="margin-bottom:18px">
    <div class="panel"><div class="panel-h"><h2>Valor UF</h2><span class="eyebrow">Contratos en UF se cobran al valor del día</span></div><div class="panel-b form"><div class="field"><label for="uf">UF en pesos</label><input id="uf" type="number" min="1" step="1" value="${UF()}"></div><button class="btn sm" style="justify-self:start" data-act="saveuf">Actualizar UF</button><p class="muted" style="margin:0;font-size:13px">Valor referencial de la demo. En producción se toma automáticamente de la fuente oficial.</p></div></div>
    <div class="panel"><div class="panel-h"><h2>Reajuste IPC</h2><span class="eyebrow">Contratos en pesos</span></div><div class="panel-b form"><div class="field"><label for="ipc">Variación IPC acumulada del periodo (%)</label><input id="ipc" type="number" step="0.1" value="${S.params.ipc}"></div><button class="btn sm" style="justify-self:start" data-act="applyipc" ${vencidos.length?"":"disabled"}>Aplicar a ${vencidos.length} contrato${vencidos.length===1?"":"s"} con reajuste vencido</button></div></div></div>
  <div class="panel"><div class="tbl-wrap"><table><thead><tr><th>Código</th><th>Propiedad</th><th>Moneda</th><th>Reajuste</th><th>Inicio contrato</th><th>Próximo reajuste</th><th class="r">Canon actual</th><th class="r">Garantía</th></tr></thead><tbody>${props.map(p=>{const nx=proxReajuste(p),venc=p.tenantId&&p.reajuste.tipo==="IPC"&&nx<=hoy;return `<tr><td class="code">${p.code}</td><td>${esc(p.dir)}<span class="sub">${tenantOf(p)?esc(tenantOf(p).nombre):"Sin arrendatario"}</span></td><td>${p.moneda}</td><td>${p.reajuste.tipo==="UF"?"UF mensual":"IPC cada "+p.reajuste.periodo+" meses"}</td><td class="num">${dmy(p.inicio)}</td><td class="num">${p.reajuste.tipo==="UF"?"Automático":dmy(nx)} ${venc?'<span class="pill p-warn">Vencido</span>':""}</td><td class="r num">${rentLabel(p)}${p.moneda==="UF"?`<span class="sub">${clp(rentCLP(p))}</span>`:""}</td><td class="r num">${p.moneda==="UF"?"UF "+fmt.format(p.garantia):clp(p.garantia)}</td></tr>`}).join("")}</tbody></table></div></div>`;
}
function yearStats(props){
  const ids=new Set(props.map(p=>p.id)),Y={};
  histAll().forEach(h=>{if(!ids.has(h.p))return;const y=h.ym.slice(0,4);const s=Y[y]=Y[y]||{a:0,g:0,d:0,n:0};if(h.c==="A"){s.a+=h.m;s.d+=h.d;s.n++}else s.g+=h.m});
  return Y;
}
function vHistoricoBlock(props){
  const Y=yearStats(props),years=Object.keys(Y).sort();
  if(!years.length)return "";
  return `<div class="panel"><div class="panel-h"><h2>Recaudación por año</h2><span class="eyebrow">Arriendos cobrados desde ${years[0]}</span></div><div class="panel-b"><div class="chart" data-chart="anual" data-ids="${props.map(p=>p.id).join(",")}" role="img" aria-label="Gráfico de arriendos recaudados por año"></div></div></div>`;
}
function vHistorico(props,title){
  const Y=yearStats(props),years=Object.keys(Y).sort().reverse();
  const tot=years.reduce((a,y)=>a+Y[y].a,0);
  return `<div class="welcome"><h1>${title}</h1><p>${years.length?years[years.length-1]+" a "+years[0]+", ":""}${clp(tot)} en arriendos cobrados a través de KLIP.</p></div>
  ${vHistoricoBlock(props)}
  <div class="panel" style="margin-top:18px"><div class="tbl-wrap"><table><thead><tr><th>Año</th><th class="r">Pagos de arriendo</th><th class="r">Arriendos cobrados</th><th class="r">Gastos comunes</th><th class="r">Reparaciones descontadas</th></tr></thead><tbody>${years.map(y=>`<tr><td><b>${y}</b>${y===S.periodo.ym.slice(0,4)?' <span class="pill p-info">en curso</span>':""}</td><td class="r num">${fmt.format(Y[y].n)}</td><td class="r num">${clp(Y[y].a)}</td><td class="r num">${clp(Y[y].g)}</td><td class="r num">${Y[y].d?clp(Y[y].d):"-"}</td></tr>`).join("")}</tbody></table></div></div>`;
}
function vHist(){
  const r=role(),ids=new Set(myProps().map(p=>p.id)),me=meActor();
  const all=histAll().filter(h=>r==="tenant"?h.t===me:ids.has(h.p));
  const years=[...new Set(all.map(h=>h.ym.slice(0,4)))].sort().reverse();
  const y=ui.year&&years.includes(ui.year)?ui.year:years[0];
  const list=all.filter(h=>h.ym.startsWith(y||"x")).sort((a,b)=>b.f.localeCompare(a.f)||a.c.localeCompare(b.c));
  const tot=all.reduce((a,h)=>a+h.m,0);
  return `<div class="welcome"><h1>${r==="tenant"?"Historial de pago":"Pagos recibidos"}</h1><p>${fmt.format(all.length)} pagos desde ${years.length?years[years.length-1]:"-"}, ${clp(tot)} en total.</p><span style="flex:1"></span>${years.length?`<label class="muted" for="histyear" style="font-size:14px">Año</label><select class="sel" id="histyear">${years.map(x=>`<option ${x===y?"selected":""}>${x}</option>`).join("")}</select>`:""}</div>
  <div class="panel">${list.length?`<div class="tbl-wrap"><table><thead><tr><th>Fecha</th><th>Concepto</th><th>Propiedad</th><th>Medio de pago</th><th class="r">Descuento</th><th class="r">Monto pagado</th></tr></thead><tbody>${list.map(h=>{const p=prop(h.p);return `<tr><td class="num">${dmy(h.f)}</td><td>${h.c==="A"?"Arriendo":"Gastos comunes"} ${ymLabel(h.ym)}<span class="sub">${esc(nombreActor(h.t))}</span></td><td>${p?esc(p.dir):""}</td><td>${esc(h.md)}</td><td class="r num">${h.d?`<button class="link" data-act="acta" data-id="${h.r}">-${clp(h.d)}</button>`:"-"}</td><td class="r num">${clp(h.m)}</td></tr>`}).join("")}</tbody></table></div>`:'<div class="empty">Aún no hay pagos registrados.</div>'}</div>`;
}
function contacts(){
  const r=role(),props=myProps();
  if(r==="admin")return [...new Set([...props.filter(p=>p.tenantId).map(p=>p.tenantId),...props.map(p=>p.ownerId)])];
  if(r==="owner")return [...new Set([...props.map(p=>p.adminId),...props.filter(p=>p.tenantId).map(p=>p.tenantId)])];
  return [...new Set([...props.map(p=>p.adminId),...props.map(p=>p.ownerId)])];
}
function vMensajes(){
  const me=meActor(),cs=contacts();
  const list=S.msgs.filter(m=>m.from===me||m.to===me).slice().reverse();
  const to=ui.msgTo&&cs.includes(ui.msgTo)?ui.msgTo:cs[0];
  return `<div class="welcome"><h1>Mensajes</h1><p>Mensajes de la plataforma y conversaciones abiertas en WhatsApp, todo en un registro.</p></div>
  <div class="grid g-side"><div class="panel"><div class="panel-h"><h2>Historial de mensajes</h2></div><div class="panel-b msgs">${list.length?list.map(m=>`<div class="msg ${m.from===me?"mine":""} ${m.canal==="whatsapp"?"wa":""}"><div class="h"><b>${esc(nombreActor(m.from))}</b><span>para ${esc(nombreActor(m.to))}</span><span>${dmy(m.fecha)}</span>${m.canal==="whatsapp"?'<span class="wa-tag">WhatsApp</span>':""}${m.to===me&&!m.read?'<span class="pill p-info">Nuevo</span>':""}</div>${esc(m.text)}</div>`).join(""):'<div class="empty">Sin mensajes todavía.</div>'}</div></div>
  <aside class="panel" style="align-self:start"><div class="panel-h"><h2>Nuevo mensaje</h2></div>${cs.length?`<form class="panel-b form" id="msgform"><div class="field"><label for="mto">Para</label><select id="mto">${cs.map(id=>`<option value="${id}" ${id===to?"selected":""}>${esc(nombreActor(id))} (${rolActor(id)})</option>`).join("")}</select></div><div class="field"><label for="mtext">Mensaje</label><textarea id="mtext" rows="5" placeholder="Escribe tu mensaje"></textarea></div><button class="btn" type="submit">Enviar en la plataforma</button><button class="btn wa" type="button" data-act="wafromform">Enviar por WhatsApp</button></form>`:'<div class="panel-b muted">Aún no tienes contactos en KLIP.</div>'}</aside></div>`;
}

/* Back office */
function vBoPanel(){
  const ym=S.periodo.ym,act=S.users.filter(u=>u.activo&&!u.bloqueado).length,blq=S.users.filter(u=>u.bloqueado).length;
  const H=histAll(),tx=H.filter(h=>h.ym===ym),vol=tx.reduce((a,h)=>a+h.m,0),com=vol*S.params.comision/100;
  const deuda=S.props.reduce((a,p)=>a+p.deuda,0),esp=esperadoMes();
  const medios={};const desde=ymAdd(ym,-11);H.forEach(h=>{if(h.ym>=desde)medios[h.md]=(medios[h.md]||0)+h.m});const totM=Object.values(medios).reduce((a,b)=>a+b,0)||1;
  const porRol=r=>S.users.filter(u=>u.role===r).length;
  const labIdeas=LAB.items.filter(i=>i.tipo==="Idea"&&i.estado!=="Descartada"&&i.estado!=="Hecha").length;
  return `<div class="welcome"><h1>Control del sistema</h1><p>${ymLabel(ym)}. ${S.administradoras.length} administradoras, ${S.props.length} propiedades, ${fmt.format(H.length)} pagos registrados desde 2011.</p><span style="flex:1"></span>${ui.asUid?"":`<button class="btn bo sm" data-act="closemonth">Cerrar mes y emitir cobros</button>`}</div>
  <div class="grid g-4" style="margin-bottom:18px">
    <div class="panel kpi"><div class="l">Volumen procesado</div><div class="v num">${clp(vol)}</div><div class="d muted">${tx.length} transacciones en el mes</div></div>
    <div class="panel kpi ok"><div class="l">Comisión KLIP</div><div class="v num">${clp(com)}</div><div class="d muted">${String(S.params.comision).replace(".",",")}% sobre lo procesado</div></div>
    <div class="panel kpi ${deuda?"bad":""}"><div class="l">Morosidad</div><div class="v num">${pct1(esp?deuda/esp*100:0)}</div><div class="d muted">${clp(deuda)} atrasado sobre la cartera</div></div>
    <div class="panel kpi ${blq?"warn":""}"><div class="l">Usuarios activos</div><div class="v num">${act}</div><div class="d muted">${blq} bloqueado${blq===1?"":"s"}</div></div></div>
  <div class="grid g-side"><div class="grid">${chartBlock("")}${vHistoricoBlock(S.props)}
    <div class="panel"><div class="panel-h"><h2>Últimos eventos</h2><span style="flex:1"></span><button class="btn sm sec" data-act="tab" data-tab="auditoria">Ver auditoría</button></div><div class="tbl-wrap">${auditTable(S.audit.slice(-8))}</div></div></div>
  <aside class="grid" style="align-content:start">
    <div class="panel"><div class="panel-h"><h2>Medios de pago</h2><span class="eyebrow">Últimos 12 meses</span></div><div class="panel-b grid" style="gap:10px">${Object.keys(medios).sort((a,b)=>medios[b]-medios[a]).map(k=>`<div class="hbar"><span>${esc(k)}</span><span class="t"><i style="width:${Math.round(medios[k]/totM*100)}%"></i></span><span class="num" style="text-align:right">${Math.round(medios[k]/totM*100)}%</span></div>`).join("")||'<span class="muted">Sin pagos.</span>'}</div></div>
    <div class="panel"><div class="panel-h"><h2>Usuarios por perfil</h2></div><div class="panel-b"><div class="lines">${Object.keys(ROLES).map(r=>`<div><span>${ROLES[r]}</span><b class="num">${porRol(r)}</b></div>`).join("")}</div></div></div>
    <div class="panel"><div class="panel-h"><h2>Lab</h2></div><div class="panel-b grid" style="gap:8px"><span>${LAB.mode==="loading"?"Cargando…":labIdeas+" ideas abiertas, "+LAB.items.filter(i=>i.tipo==="Cambio").length+" cambios registrados"}</span><button class="btn sm bo" style="justify-self:start" data-act="tab" data-tab="lab">Abrir Lab</button></div></div>
  </aside></div>`;
}
function admStats(a){
  const ps=S.props.filter(p=>p.adminId===a.id),c=adminCounts(ps),ids=new Set(ps.map(p=>p.id));
  const deuda=ps.reduce((s,p)=>s+p.deuda,0);
  return {ps,c,deuda,mor:c.esperado?deuda/c.esperado*100:0,klip:histAll().filter(h=>h.ym===S.periodo.ym&&ids.has(h.p)).reduce((s,h)=>s+h.m,0)*S.params.comision/100};
}
function vAdministradoras(){
  if(ui.admSel){const a=byId(S.administradoras,ui.admSel);if(a)return vAdmDetail(a)}
  return `<div class="welcome"><h1>Administradoras de propiedades</h1><p>${S.administradoras.length} administradoras usan KLIP. Abre cada una para ver su cartera completa.</p><span style="flex:1"></span><button class="btn bo" data-act="newadm">Nueva administradora</button></div>
  <div class="panel"><div class="tbl-wrap"><table><thead><tr><th>Administradora</th><th>Ciudad</th><th>En KLIP desde</th><th class="r">Propiedades</th><th class="r">Recaudado mes</th><th class="r">Recaudación</th><th class="r">Morosidad</th><th class="r">Comisión adm.</th><th></th></tr></thead><tbody>${S.administradoras.map(a=>{const s=admStats(a);return `<tr><td><b>${esc(a.nombre)}</b><span class="sub">${esc(a.contacto)}</span></td><td>${esc(a.comuna?a.comuna+", ":"")}${esc(a.ciudad)}</td><td class="num">${ymLabel(a.desde)}</td><td class="r num">${s.ps.length}<span class="sub">${s.ps.filter(p=>p.tenantId).length} arrendadas</span></td><td class="r num">${clp(s.c.recaudado)}</td><td class="r num">${s.c.pct}%</td><td class="r num">${pct1(s.mor)}</td><td class="r num">${String(a.comisionAdm).replace(".",",")}% + IVA</td><td><button class="btn sm bo" data-act="admsel" data-id="${a.id}">Ver cartera</button></td></tr>`}).join("")}</tbody></table></div></div>`;
}
function vAdmDetail(a){
  const s=admStats(a),owners=[...new Set(s.ps.map(p=>p.ownerId))];
  const u=S.users.find(x=>x.actorId===a.id);
  return `<div class="welcome"><button class="btn sm sec" data-act="admsel" data-id="">Volver</button><h1>${esc(a.nombre)}</h1><p>${esc(a.contacto)}, ${esc(a.ciudad)}. En KLIP desde ${ymLabel(a.desde)}.</p><span style="flex:1"></span>${u&&u.activo?`<button class="btn sm bo" data-act="impersonate" data-id="${u.id}">Entrar como ${esc(a.contacto.split(" ")[0])}</button>`:""}</div>
  <div class="grid g-4" style="margin-bottom:18px">
    <div class="panel kpi"><div class="l">Cartera</div><div class="v num">${s.ps.length}</div><div class="d muted">${owners.length} propietarios</div></div>
    <div class="panel kpi ok"><div class="l">Recaudado ${ymLabel(S.periodo.ym)}</div><div class="v num">${clp(s.c.recaudado)}</div><div class="d muted">${s.c.pct}% de ${clp(s.c.esperado)}</div></div>
    <div class="panel kpi ${s.deuda?"bad":""}"><div class="l">Morosidad</div><div class="v num">${pct1(s.mor)}</div><div class="d muted">${clp(s.deuda)} atrasado</div></div>
    <div class="panel kpi"><div class="l">Comisión KLIP del mes</div><div class="v num">${clp(s.klip)}</div><div class="d muted">sobre pagos procesados</div></div></div>
  <div class="grid">${chartBlock(a.id)}
  <div class="panel"><div class="panel-h"><h2>Cartera completa</h2></div><div class="tbl-wrap">${s.ps.length?propTable(s.ps,false):'<div class="empty">Sin propiedades cargadas.</div>'}</div></div>
  ${vHistoricoBlock(s.ps)}</div>`;
}
function vUsers(){
  const q=ui.q.toLowerCase();
  const list=S.users.filter(u=>!q||(u.nombre+" "+u.email+" "+ROLES[u.role]+" "+empresaDe(u.actorId)).toLowerCase().includes(q));
  return `<div class="welcome"><h1>Usuarios</h1><p>${S.users.length} cuentas</p><span style="flex:1"></span><button class="btn bo" data-act="newuser">Nuevo usuario</button></div>
  <div class="panel"><div class="panel-h"><input class="search" id="q" type="search" placeholder="Buscar por nombre, correo o perfil" value="${esc(ui.q)}" aria-label="Buscar usuarios"></div><div class="tbl-wrap"><table><thead><tr><th>Usuario</th><th>Perfil</th><th>Estado</th><th>Último acceso</th><th></th></tr></thead><tbody>${list.map(u=>{
    const st=u.bloqueado?'<span class="pill p-bad">Bloqueado</span>':!u.activo?'<span class="pill p-mute">Desactivado</span>':'<span class="pill p-ok">Activo</span>';
    const self=u.id===ui.uid;
    return `<tr><td><b>${esc(u.nombre)}</b><span class="sub">${esc(u.email)}</span></td><td><span class="pill ${u.role==="bo"?"p-bo":"p-info"}">${ROLES[u.role]}</span>${u.bo&&u.role!=="bo"?' <span class="pill p-bo">Acceso total</span>':""}${u.role==="admin"?`<span class="sub">${esc(empresaDe(u.actorId))}</span>`:""}</td><td>${st}${u.cambiar?'<span class="sub">Debe cambiar la contraseña</span>':""}</td><td class="num">${dmy(u.ultimo)}</td><td><div style="display:flex;gap:6px;justify-content:flex-end;flex-wrap:wrap">
      ${u.bloqueado?`<button class="btn sm" data-act="unlock" data-id="${u.id}">Desbloquear</button>`:""}
      ${self?"":`<button class="btn sm sec" data-act="toggleuser" data-id="${u.id}">${u.activo?"Desactivar":"Activar"}</button>`}
      <button class="btn sm sec" data-act="resetpw" data-id="${u.id}">Restablecer contraseña</button>
      ${u.role==="admin"&&!self?`<button class="btn sm sec" data-act="togglebo" data-id="${u.id}">${u.bo?"Quitar acceso total":"Dar acceso total"}</button>`:""}
      ${self||u.role==="bo"||!u.activo?"":`<button class="btn sm bo" data-act="impersonate" data-id="${u.id}">Entrar como</button>`}
    </div></td></tr>`}).join("")}</tbody></table></div></div>`;
}
function vParams(){
  const p=S.params,b=p.bienvenida;
  return `<div class="welcome"><h1>Parámetros del sistema</h1><p>Afectan a toda la plataforma desde el momento en que se guardan.</p></div>
  <form class="grid g-2" id="paramform">
    <div class="panel"><div class="panel-h"><h2>Cobro y reajustes</h2></div><div class="panel-b form">
      <div class="row"><div class="field"><label for="p_uf">Valor UF ($)</label><input id="p_uf" type="number" min="1" step="1" value="${p.uf}"></div><div class="field"><label for="p_ipc">IPC acumulado (%)</label><input id="p_ipc" type="number" step="0.1" value="${p.ipc}"></div></div>
      <div class="row"><div class="field"><label for="p_dia">Día de vencimiento</label><input id="p_dia" type="number" min="1" max="28" value="${p.diaVenc}"></div><div class="field"><label for="p_gracia">Días de gracia antes de mora</label><input id="p_gracia" type="number" min="0" max="30" value="${p.gracia}"></div></div>
      <div class="field"><label for="p_com">Comisión KLIP sobre lo procesado (%)</label><input id="p_com" type="number" min="0" max="20" step="0.1" value="${p.comision}"></div>
    </div></div>
    <div class="panel"><div class="panel-h"><h2>Medios de pago habilitados</h2></div><div class="panel-b form">
      ${Object.keys(p.medios).map((m,i)=>`<label class="check"><input type="checkbox" id="pm_${i}" data-medio="${esc(m)}" ${p.medios[m]?"checked":""}> ${esc(m)}</label>`).join("")}
      <p class="muted" style="margin:0;font-size:13px">Los arrendatarios solo ven los medios habilitados al pagar.</p>
    </div></div>
    <div class="panel"><div class="panel-h"><h2>Plantilla de recordatorio por WhatsApp</h2></div><div class="panel-b form"><div class="field"><label for="p_tpl">Texto</label><textarea id="p_tpl" rows="5">${esc(p.plantilla)}</textarea></div><span class="muted" style="font-size:13px">Puedes usar {nombre}, {direccion}, {monto} y {vence}.</span></div></div>
    <div class="panel"><div class="panel-h"><h2>Bienvenida para ${esc(bdayNombre())}</h2></div><div class="panel-b form"><label class="check"><input type="checkbox" id="p_bon" ${b.activo?"checked":""}> Mostrar el mensaje de bienvenida la primera vez que ${esc(bdayNombre())} entre</label><div class="field"><label for="p_btit">Título</label><input id="p_btit" maxlength="80" value="${esc(b.titulo||"")}" placeholder="Te damos la bienvenida, {nombre}"></div><div class="field"><label for="p_btxt">Mensaje</label><textarea id="p_btxt" rows="5">${esc(b.texto)}</textarea></div><span class="muted" style="font-size:13px">${b.mostrado?"Ya se mostró en este navegador. ":"Aún no se ha mostrado. "}<button type="button" class="link" data-act="bdaypreview">Ver cómo se verá</button>${b.mostrado?' o <button type="button" class="link" data-act="bdayreset">volver a mostrarlo</button>':""}</span></div></div>
    <div style="grid-column:1/-1;display:flex;gap:10px;flex-wrap:wrap"><button class="btn bo" type="submit">Guardar parámetros</button></div>
  </form>
  <div class="panel" style="margin-top:18px"><div class="panel-h"><h2>Datos de la demo</h2></div><div class="panel-b" style="display:flex;gap:12px;align-items:center;flex-wrap:wrap"><span class="muted">${S.props.length} propiedades, ${fmt.format(histAll().length)} pagos (${S.hist.length} del periodo actual), ${S.msgs.length} mensajes y ${S.audit.length} eventos.</span><span style="flex:1"></span><button class="btn bad sm" data-act="reset">Restablecer datos de ejemplo</button></div></div>`;
}
function auditTable(list){
  if(!list.length)return '<div class="empty">Sin eventos.</div>';
  return `<table><thead><tr><th>Fecha</th><th>Usuario</th><th>Evento</th><th>Detalle</th></tr></thead><tbody>${list.slice().reverse().map(a=>`<tr><td class="num" style="white-space:nowrap">${dmy(a.f)}</td><td>${esc(a.who)}</td><td><span class="pill ${/fallido|bloquead/i.test(a.tipo)?"p-bad":/Pago|WhatsApp|conforme/i.test(a.tipo)?"p-ok":"p-info"}">${esc(a.tipo)}</span></td><td>${esc(a.det)}</td></tr>`).join("")}</tbody></table>`;
}
function vAudit(){
  const q=ui.q.toLowerCase(),list=S.audit.filter(a=>!q||(a.who+" "+a.tipo+" "+a.det).toLowerCase().includes(q));
  return `<div class="welcome"><h1>Auditoría</h1><p>Registro de accesos, pagos, aprobaciones, WhatsApp y cambios de configuración. Se guardan los últimos 400 eventos.</p></div>
  <div class="panel"><div class="panel-h"><input class="search" id="q" type="search" placeholder="Buscar en el registro" value="${esc(ui.q)}" aria-label="Buscar en la auditoría"><span class="muted" style="font-size:13px">${list.length} eventos</span></div><div class="tbl-wrap">${auditTable(list)}</div></div>`;
}
const LAB_TIPOS=["Idea","Cambio","Error"],LAB_EST=["Propuesta","En curso","Hecha","Descartada"],LAB_AREAS=["Plataforma","Arrendatario","Propietario","Administrador","Back office","Pagos","WhatsApp","Legal y datos"];
function vLab(){
  const L=ui.lab,q=L.q.toLowerCase();
  const items=LAB.items.slice().sort((a,b)=>String(b.creado||"").localeCompare(String(a.creado||"")));
  const list=items.filter(i=>(L.tipo==="todos"||i.tipo===L.tipo)&&(L.estado==="todos"||i.estado===L.estado)&&(!q||(i.titulo+" "+(i.detalle||"")+" "+(i.area||"")).toLowerCase().includes(q)));
  const n=t=>LAB.items.filter(i=>i.tipo===t).length;
  const chip=(k,l)=>`<button class="chip" data-act="labtipo" data-v="${k}" aria-pressed="${L.tipo===k}">${l}</button>`;
  const versions={};items.filter(i=>i.tipo==="Cambio"&&i.estado==="Hecha").forEach(i=>{const v=i.version||"Sin versión";(versions[v]=versions[v]||[]).push(i)});
  const vkeys=Object.keys(versions).sort((a,b)=>b.localeCompare(a,undefined,{numeric:true}));
  const modeNote=LAB.mode==="local"?'<div class="note" style="margin-bottom:14px">El Lab está guardando en este navegador porque esta vista no tiene acceso al almacén compartido. Abre la plataforma con tu cuenta de Claude para trabajar sobre el Lab del equipo.</div>':"";
  return `<div class="welcome"><h1>Lab</h1><p>Ideas, cambios y errores de KLIP en un solo registro.</p><span style="flex:1"></span><button class="btn bo" data-act="labnew">Nueva entrada</button></div>${modeNote}
  <div class="grid g-side"><div class="panel"><div class="panel-h"><div class="chips">${chip("todos","Todo ("+LAB.items.length+")")}${chip("Idea","Ideas ("+n("Idea")+")")}${chip("Cambio","Cambios ("+n("Cambio")+")")}${chip("Error","Errores ("+n("Error")+")")}</div><span style="flex:1"></span>
    <select class="sel" id="labest" aria-label="Filtrar por estado"><option value="todos">Todos los estados</option>${LAB_EST.map(e=>`<option ${L.estado===e?"selected":""}>${e}</option>`).join("")}</select>
    <input class="search" id="labq" type="search" placeholder="Buscar en el Lab" value="${esc(L.q)}" aria-label="Buscar en el Lab"></div>
    <div class="tbl-wrap">${LAB.mode==="loading"?'<div class="empty">Cargando el Lab…</div>':list.length?`<table><thead><tr><th>Tipo</th><th>Entrada</th><th>Área</th><th>Prioridad</th><th>Versión</th><th>Estado</th><th></th></tr></thead><tbody>${list.map(i=>`<tr><td><span class="lab-tipo t-${esc((i.tipo||"").toLowerCase())}">${esc(i.tipo)}</span></td><td><b>${esc(i.titulo)}</b>${i.detalle?`<span class="sub">${esc(i.detalle)}</span>`:""}<span class="sub">${esc(i.autor||"")}${i.creado?", "+dmy(i.creado):""}</span></td><td>${esc(i.area||"")}</td><td><span class="prio prio-${esc(i.prioridad||"Media")}">${esc(i.prioridad||"Media")}</span></td><td class="num">${esc(i.version||"-")}</td><td><select class="sel" data-labstate="${esc(i.id)}" aria-label="Estado de ${esc(i.titulo)}">${LAB_EST.map(e=>`<option ${i.estado===e?"selected":""}>${e}</option>`).join("")}</select></td><td><button class="btn sm sec" data-act="labedit" data-id="${esc(i.id)}">Editar</button></td></tr>`).join("")}</tbody></table>`:`<div class="empty">${LAB.items.length?"Ninguna entrada coincide con el filtro.":"El Lab está vacío. Registra la primera idea o cambio con “Nueva entrada”."}</div>`}</div></div>
  <aside class="panel" style="align-self:start"><div class="panel-h"><h2>Registro de cambios</h2></div><div class="panel-b timeline">${vkeys.length?vkeys.map(v=>`<div class="tl-v"><h3>Versión ${esc(v)}</h3><ul>${versions[v].map(i=>`<li>${esc(i.titulo)}</li>`).join("")}</ul></div>`).join(""):'<span class="muted">Aquí aparecen los cambios marcados como hechos, agrupados por versión.</span>'}</div></aside></div>`;
}

/* Gráficos de barras escalados al ancho real */
function niceStep(raw){const p=Math.pow(10,Math.floor(Math.log10(raw)));const f=raw/p;return (f<=1?1:f<=2?2:f<=2.5?2.5:f<=5?5:10)*p}
function drawBars(el,data,ref,refLabel){
  const W=Math.max(300,Math.round(el.clientWidth||640)),H=W<520?220:260;
  const L=W<520?46:60,R=10,T=26,B=28;
  const max=Math.max(ref||0,...data.map(d=>d.v),1);
  const step=niceStep(max/4),top=Math.ceil(max*1.08/step)*step;
  const y=v=>T+(H-T-B)*(1-v/top);
  const band=(W-L-R)/data.length,bw=Math.max(6,band*0.64);
  const lblEvery=Math.max(1,Math.ceil(data.length*38/(W-L-R)));
  const fmtAx=v=>v===0?"0":v>=1e9?(v/1e9).toLocaleString("es-CL",{maximumFractionDigits:1})+" mil M":(v/1e6).toLocaleString("es-CL",{maximumFractionDigits:1})+"M";
  let g="";
  for(let v=0;v<=top+1;v+=step){g+=`<line x1="${L}" x2="${W-R}" y1="${y(v).toFixed(1)}" y2="${y(v).toFixed(1)}" stroke="var(--line)" stroke-width="1"/><text x="${L-6}" y="${(y(v)+4).toFixed(1)}" text-anchor="end" font-size="11" fill="var(--muted)">${fmtAx(v)}</text>`}
  data.forEach((d,i)=>{
    const cx=L+band*i+band/2,yy=y(d.v),h=Math.max(0,y(0)-yy);
    g+=`<rect x="${(cx-bw/2).toFixed(1)}" y="${yy.toFixed(1)}" width="${bw.toFixed(1)}" height="${h.toFixed(1)}" rx="3" fill="${d.cur?"var(--sky)":"var(--klip)"}" opacity="${d.cur?1:.85}"><title>${esc(d.title)}: ${clp(d.v)}${d.cur?" (en curso)":""}</title></rect>`;
    if((data.length-1-i)%lblEvery===0)g+=`<text x="${cx.toFixed(1)}" y="${H-9}" text-anchor="middle" font-size="11" fill="${d.cur?"var(--navy)":"var(--muted)"}" font-weight="${d.cur?700:400}">${esc(d.label)}</text>`;
  });
  let ye=null;
  if(ref){ye=y(ref);g+=`<line x1="${L}" x2="${W-R}" y1="${ye.toFixed(1)}" y2="${ye.toFixed(1)}" stroke="var(--bad)" stroke-width="1.5" stroke-dasharray="5 4"/><text x="${L+4}" y="${Math.max(12,ye-6).toFixed(1)}" font-size="11" font-weight="700" fill="var(--bad)">${esc(refLabel)}</text>`}
  const last=data[data.length-1],lx=L+band*(data.length-1)+band/2;let ly=Math.max(12,y(last.v)-7);if(ye!=null&&ly>ye-16&&ly<ye+4)ly=ye-20;
  g+=`<text x="${Math.min(W-R,lx+bw/2).toFixed(1)}" y="${Math.max(12,ly).toFixed(1)}" text-anchor="end" font-size="12" font-weight="700" fill="var(--navy)">${mill(last.v)}</text>`;
  el.innerHTML=`<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">${g}</svg>`;
}
function drawCharts(){
  document.querySelectorAll('[data-chart="recaudo"]').forEach(el=>{
    const props=scopeProps(el.dataset.scope),c=S.periodo.ym;
    const data=[];for(let i=11;i>=0;i--){const ym=ymAdd(c,-i);data.push({label:ymShort(ym)+(ym.endsWith("-01")?" "+ym.slice(2,4):""),title:ymLabel(ym),v:arriendosMes(ym,props),cur:i===0})}
    const esp=esperadoMes(props);
    drawBars(el,data,esp,"Esperado "+mill(esp));
  });
  document.querySelectorAll('[data-chart="anual"]').forEach(el=>{
    const ids=new Set(el.dataset.ids.split(","));const props=S.props.filter(p=>ids.has(p.id));
    const Y=yearStats(props),years=Object.keys(Y).sort();if(!years.length){el.innerHTML="";return}
    drawBars(el,years.map(y=>({label:"'"+y.slice(2),title:y,v:Y[y].a,cur:y===S.periodo.ym.slice(0,4)})),0,"");
  });
}
let rz;window.addEventListener("resize",()=>{clearTimeout(rz);rz=setTimeout(drawCharts,150)});
