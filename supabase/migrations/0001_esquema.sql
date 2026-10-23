-- KLIP: esquema inicial para producción en Supabase (Postgres 15+).
-- Principios: cada administradora solo ve su cartera, arrendatarios y propietarios solo ven lo suyo,
-- la auditoría no se puede modificar ni borrar, y las reglas viven en la base de datos, no en la página.

create extension if not exists pgcrypto;

-- ============ Catálogos y personas ============

create table administradoras (
  id            uuid primary key default gen_random_uuid(),
  nombre        text not null,
  contacto      text not null,
  ciudad        text not null default 'Santiago',
  comuna        text,
  comision_pct  numeric(5,2) not null default 8 check (comision_pct between 0 and 20),
  desde         date not null default current_date,
  activa        boolean not null default true
);

-- Una fila por cuenta de acceso (auth.users de Supabase)
create table perfiles (
  id                uuid primary key references auth.users(id) on delete cascade,
  nombre            text not null,
  email             text not null unique,
  rol               text not null check (rol in ('arrendatario','propietario','administradora','backoffice')),
  administradora_id uuid references administradoras(id),
  acceso_total      boolean not null default false,
  whatsapp          text,
  activo            boolean not null default true,
  creado            timestamptz not null default now(),
  check (rol <> 'administradora' or administradora_id is not null)
);

-- Arrendatarios y propietarios. Pueden existir sin cuenta (perfil_id nulo) y vincularse después por correo
create table personas (
  id                    uuid primary key default gen_random_uuid(),
  tipo                  text not null check (tipo in ('arrendatario','propietario')),
  nombre                text not null,
  email                 text,
  whatsapp              text,
  perfil_id             uuid references perfiles(id) on delete set null,
  creada_por_adm        uuid references administradoras(id),
  creado                timestamptz not null default now()
);
create unique index personas_email_tipo on personas (lower(email), tipo) where email is not null;

create table proveedores (
  id         uuid primary key default gen_random_uuid(),
  nombre     text not null,
  categoria  text not null,
  ciudad     text not null,
  comunas    text,
  sec        boolean not null default false,
  precio     text,
  whatsapp   text,
  desde      date not null default current_date,
  activo     boolean not null default true
);

-- ============ Propiedades y contratos ============

create table propiedades (
  id                uuid primary key default gen_random_uuid(),
  codigo            text not null unique,
  administradora_id uuid not null references administradoras(id),
  propietario_id    uuid not null references personas(id),
  direccion         text not null,
  comuna            text not null,
  ciudad            text not null,
  descripcion       text,
  valor_uf          numeric(12,2),
  gc_comunidad      text,
  gc_monto          integer not null default 0 check (gc_monto >= 0),
  alta              date not null default current_date,
  activa            boolean not null default true
);

create table contratos (
  id               uuid primary key default gen_random_uuid(),
  propiedad_id     uuid not null references propiedades(id),
  arrendatario_id  uuid not null references personas(id),
  inicio           date not null,
  termino          date,
  moneda           text not null check (moneda in ('UF','CLP')),
  canon            numeric(12,2) not null check (canon > 0),
  garantia         numeric(12,2) not null default 0 check (garantia >= 0),
  reajuste_meses   integer not null default 12 check (reajuste_meses in (6,12)),
  ultimo_reajuste  date,
  salida           jsonb,
  check (termino is null or termino >= inicio)
);
-- Un solo contrato vigente por propiedad
create unique index contratos_vigente on contratos (propiedad_id) where termino is null;

-- ============ Cobros y pagos ============

create table periodos (
  ym          char(7) primary key check (ym ~ '^\d{4}-(0[1-9]|1[0-2])$'),
  vence       date not null,
  cerrado     boolean not null default false,
  cerrado_en  timestamptz,
  cerrado_por uuid references perfiles(id)
);

create table cobros (
  id              uuid primary key default gen_random_uuid(),
  contrato_id     uuid not null references contratos(id),
  periodo         char(7) not null references periodos(ym),
  concepto        text not null check (concepto in ('arriendo','gastos_comunes')),
  monto           integer not null check (monto >= 0),
  descuento       integer not null default 0 check (descuento >= 0),
  saldo_anterior  integer not null default 0,
  creado          timestamptz not null default now(),
  unique (contrato_id, periodo, concepto)
);

create table pagos (
  id             uuid primary key default gen_random_uuid(),
  cobro_id       uuid not null references cobros(id),
  fecha          timestamptz not null default now(),
  monto          integer not null check (monto > 0),
  medio          text not null,
  origen         text not null check (origen in ('pasarela','manual')),
  comprobante    text,
  registrado_por uuid references perfiles(id)
);

-- ============ Reparaciones ============

create table reparaciones (
  id                uuid primary key default gen_random_uuid(),
  propiedad_id      uuid not null references propiedades(id),
  contrato_id       uuid not null references contratos(id),
  categoria         text not null,
  descripcion       text not null,
  proveedor_id      uuid references proveedores(id),
  monto             integer not null check (monto > 0),
  cuotas            integer not null check (cuotas in (1,2,3,6)),
  estado            text not null default 'solicitada' check (estado in ('solicitada','aprobada','conforme','rechazada')),
  solicitada        timestamptz not null default now(),
  aprobacion        jsonb,
  conformidad       jsonb,
  inicio_descuento  char(7),
  descontadas       integer not null default 0 check (descontadas between 0 and cuotas),
  saldadas          integer not null default 0 check (saldadas between 0 and cuotas),
  valoracion        integer check (valoracion between 1 and 5)
);

-- ============ Comunicación, parámetros y registro ============

create table mensajes (
  id        uuid primary key default gen_random_uuid(),
  de_id     uuid not null references perfiles(id),
  para_id   uuid not null references perfiles(id),
  texto     text not null check (length(texto) between 1 and 4000),
  canal     text not null default 'plataforma' check (canal in ('plataforma','whatsapp','email')),
  leido     boolean not null default false,
  fecha     timestamptz not null default now()
);

create table parametros (
  id            integer primary key default 1 check (id = 1),
  uf            integer not null check (uf > 0),
  ipc           numeric(5,2) not null default 0,
  comision_klip numeric(5,2) not null default 2.5 check (comision_klip between 0 and 20),
  dia_venc      integer not null default 5 check (dia_venc between 1 and 28),
  gracia        integer not null default 5 check (gracia between 0 and 30),
  medios        jsonb not null default '{"Transferencia": true}',
  plantilla_wa  text
);

create table email_envios (
  id           bigserial primary key,
  fecha        timestamptz not null default now(),
  para         text not null,
  plantilla    text not null,
  asunto       text not null,
  estado       text not null check (estado in ('enviado','simulado','error')),
  proveedor_id text,
  error        text,
  referencia   jsonb
);

-- Auditoría: solo se añade. Guarda quién actúa y, si suplanta, a quién
create table auditoria (
  id          bigserial primary key,
  fecha       timestamptz not null default now(),
  actor_id    uuid,
  actor       text not null,
  como_id     uuid,
  tipo        text not null,
  detalle     text not null default ''
);

create function auditoria_inmutable() returns trigger language plpgsql as $$
begin
  raise exception 'La auditoría no se puede modificar ni borrar';
end $$;
create trigger auditoria_sin_cambios before update or delete or truncate on auditoria
  for each statement execute function auditoria_inmutable();

-- ============ Funciones de permisos ============
-- security definer: leen perfiles sin pasar por sus propias políticas, para evitar recursión

create function mi_perfil() returns perfiles language sql stable security definer set search_path = public as $$
  select * from perfiles where id = auth.uid() and activo
$$;

create function es_backoffice() returns boolean language sql stable security definer set search_path = public as $$
  select coalesce((select rol = 'backoffice' or acceso_total from perfiles where id = auth.uid() and activo), false)
$$;

create function mi_administradora() returns uuid language sql stable security definer set search_path = public as $$
  select administradora_id from perfiles where id = auth.uid() and activo and rol = 'administradora'
$$;

create function mis_personas() returns setof uuid language sql stable security definer set search_path = public as $$
  select p.id from personas p join perfiles f on f.id = p.perfil_id where f.id = auth.uid() and f.activo
$$;

create function puedo_ver_propiedad(prop uuid) returns boolean language sql stable security definer set search_path = public as $$
  select es_backoffice() or exists (
    select 1 from propiedades p
    where p.id = prop and (
      p.administradora_id = mi_administradora()
      or p.propietario_id in (select mis_personas())
      or exists (select 1 from contratos c where c.propiedad_id = p.id and c.arrendatario_id in (select mis_personas()))
    ))
$$;

create function gestiono_propiedad(prop uuid) returns boolean language sql stable security definer set search_path = public as $$
  select es_backoffice() or exists (select 1 from propiedades p where p.id = prop and p.administradora_id = mi_administradora())
$$;

-- Vincular por correo sin exponer el listado de personas: devuelve solo la coincidencia exacta
create function buscar_persona_por_email(correo text, tipo_buscado text)
returns table (id uuid, nombre text) language sql stable security definer set search_path = public as $$
  select p.id, p.nombre from personas p
  where (es_backoffice() or mi_administradora() is not null)
    and p.email is not null and lower(p.email) = lower(trim(correo)) and p.tipo = tipo_buscado
  limit 1
$$;

-- Registro de auditoría con el usuario real de la sesión; como_id se rellena al suplantar
create function registrar_auditoria(tipo_evento text, det text, como uuid default null) returns void
language plpgsql security definer set search_path = public as $$
declare yo perfiles;
begin
  select * into yo from perfiles where id = auth.uid();
  insert into auditoria (actor_id, actor, como_id, tipo, detalle)
  values (auth.uid(), coalesce(yo.nombre, 'Sistema'), case when es_backoffice() then como end, tipo_evento, coalesce(det, ''));
end $$;

-- ============ Seguridad por filas ============

alter table administradoras enable row level security;
alter table perfiles        enable row level security;
alter table personas        enable row level security;
alter table proveedores     enable row level security;
alter table propiedades     enable row level security;
alter table contratos       enable row level security;
alter table periodos        enable row level security;
alter table cobros          enable row level security;
alter table pagos           enable row level security;
alter table reparaciones    enable row level security;
alter table mensajes        enable row level security;
alter table parametros      enable row level security;
alter table email_envios    enable row level security;
alter table auditoria       enable row level security;

-- Administradoras
create policy adm_ver on administradoras for select to authenticated
  using (es_backoffice() or id = mi_administradora()
         or exists (select 1 from propiedades p where p.administradora_id = administradoras.id and puedo_ver_propiedad(p.id)));
create policy adm_bo on administradoras for all to authenticated using (es_backoffice()) with check (es_backoffice());

-- Perfiles: cada uno ve el suyo; back office ve todos; la administradora ve los de su gente
create policy perf_ver on perfiles for select to authenticated
  using (id = auth.uid() or es_backoffice()
         or (mi_administradora() is not null and (administradora_id = mi_administradora()
             or exists (select 1 from personas p where p.perfil_id = perfiles.id and p.creada_por_adm = mi_administradora()))));
create policy perf_editar_propio on perfiles for update to authenticated
  using (id = auth.uid()) with check (id = auth.uid() and rol = (select rol from mi_perfil()) and acceso_total = (select acceso_total from mi_perfil()));
create policy perf_bo on perfiles for all to authenticated using (es_backoffice()) with check (es_backoffice());

-- Personas
create policy pers_ver on personas for select to authenticated
  using (es_backoffice() or perfil_id = auth.uid()
         or (mi_administradora() is not null and (creada_por_adm = mi_administradora()
             or exists (select 1 from propiedades p where p.administradora_id = mi_administradora() and p.propietario_id = personas.id)
             or exists (select 1 from contratos c join propiedades p on p.id = c.propiedad_id where p.administradora_id = mi_administradora() and c.arrendatario_id = personas.id)))
         -- propietario ve a sus arrendatarios y arrendatario ve a su propietario
         or exists (select 1 from contratos c join propiedades p on p.id = c.propiedad_id
                    where (p.propietario_id in (select mis_personas()) and c.arrendatario_id = personas.id)
                       or (c.arrendatario_id in (select mis_personas()) and p.propietario_id = personas.id)));
create policy pers_crear on personas for insert to authenticated
  with check (es_backoffice() or (mi_administradora() is not null and creada_por_adm = mi_administradora()));
create policy pers_editar on personas for update to authenticated
  using (es_backoffice() or creada_por_adm = mi_administradora()) with check (es_backoffice() or creada_por_adm = mi_administradora());

-- Proveedores: todos los ven; administradoras y back office los mantienen
create policy prov_ver on proveedores for select to authenticated using (true);
create policy prov_crear on proveedores for insert to authenticated with check (es_backoffice() or mi_administradora() is not null);
create policy prov_editar on proveedores for update to authenticated using (es_backoffice());

-- Propiedades
create policy prop_ver on propiedades for select to authenticated using (puedo_ver_propiedad(id));
create policy prop_crear on propiedades for insert to authenticated
  with check (es_backoffice() or administradora_id = mi_administradora());
create policy prop_editar on propiedades for update to authenticated
  using (gestiono_propiedad(id)) with check (es_backoffice() or administradora_id = mi_administradora());

-- Contratos
create policy cont_ver on contratos for select to authenticated
  using (gestiono_propiedad(propiedad_id) or arrendatario_id in (select mis_personas())
         or exists (select 1 from propiedades p where p.id = propiedad_id and p.propietario_id in (select mis_personas())));
create policy cont_crear on contratos for insert to authenticated with check (gestiono_propiedad(propiedad_id));
create policy cont_editar on contratos for update to authenticated using (gestiono_propiedad(propiedad_id)) with check (gestiono_propiedad(propiedad_id));

-- Periodos: todos los leen; solo back office los abre y cierra
create policy per_ver on periodos for select to authenticated using (true);
create policy per_bo on periodos for all to authenticated using (es_backoffice()) with check (es_backoffice());

-- Cobros: visibles para quien ve el contrato; los emite el sistema o el back office
create policy cob_ver on cobros for select to authenticated
  using (exists (select 1 from contratos c where c.id = contrato_id));
create policy cob_bo on cobros for all to authenticated using (es_backoffice()) with check (es_backoffice());

-- Pagos: los manuales los registra quien gestiona la propiedad; los de pasarela entran con la clave de servicio
create policy pag_ver on pagos for select to authenticated
  using (exists (select 1 from cobros b where b.id = cobro_id));
create policy pag_manual on pagos for insert to authenticated
  with check (origen = 'manual' and registrado_por = auth.uid()
              and exists (select 1 from cobros b join contratos c on c.id = b.contrato_id where b.id = cobro_id and gestiono_propiedad(c.propiedad_id)));

-- Reparaciones
create policy rep_ver on reparaciones for select to authenticated using (puedo_ver_propiedad(propiedad_id));
create policy rep_solicitar on reparaciones for insert to authenticated
  with check (estado = 'solicitada' and aprobacion is null and conformidad is null and descontadas = 0
              and exists (select 1 from contratos c where c.id = contrato_id and c.propiedad_id = reparaciones.propiedad_id and c.termino is null
                          and (c.arrendatario_id in (select mis_personas()) or gestiono_propiedad(c.propiedad_id))));
create policy rep_gestionar on reparaciones for update to authenticated
  using (gestiono_propiedad(propiedad_id)) with check (gestiono_propiedad(propiedad_id));

-- Mensajes
create policy msg_ver on mensajes for select to authenticated using (de_id = auth.uid() or para_id = auth.uid() or es_backoffice());
create policy msg_enviar on mensajes for insert to authenticated with check (de_id = auth.uid());
create policy msg_leer on mensajes for update to authenticated using (para_id = auth.uid()) with check (para_id = auth.uid());

-- Parámetros
create policy par_ver on parametros for select to authenticated using (true);
create policy par_bo on parametros for update to authenticated using (es_backoffice()) with check (es_backoffice());

-- Registro de emails y auditoría: solo lectura para back office; se escriben desde el servidor o con registrar_auditoria
create policy mail_ver on email_envios for select to authenticated using (es_backoffice());
create policy aud_ver on auditoria for select to authenticated using (es_backoffice());

revoke all on all tables in schema public from anon;
revoke insert, update, delete on auditoria, email_envios from authenticated;
revoke execute on function registrar_auditoria(text, text, uuid) from anon;
revoke execute on function buscar_persona_por_email(text, text) from anon;
