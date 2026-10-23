-- Pruebas de permisos por fila. Se ejecutan con scripts/probar-db.sh sobre una base vacía.
\set ON_ERROR_STOP 1
set client_min_messages = warning;

create function afirmar(ok boolean, msg text) returns void language plpgsql as $$
begin
  if ok is not true then raise exception 'FALLA: %', msg; end if;
  raise warning 'ok   %', msg;
end $$;
-- Devuelve true si la sentencia es rechazada (por permisos, RLS o restricciones)
create function rechaza(sentencia text) returns boolean language plpgsql as $$
begin
  execute sentencia;
  return false;
exception when others then
  return true;
end $$;
grant execute on function afirmar(boolean, text), rechaza(text) to authenticated, anon;

-- ---------- Datos ----------
insert into auth.users values
 ('00000000-0000-0000-0000-0000000000b0','laura@klip.cl'),
 ('00000000-0000-0000-0000-0000000000a1','bruno@salinas.cl'),
 ('00000000-0000-0000-0000-0000000000a2','paula@cordillera.cl'),
 ('00000000-0000-0000-0000-0000000000c1','rodrigo@correo.cl'),
 ('00000000-0000-0000-0000-0000000000d1','camila@correo.cl'),
 ('00000000-0000-0000-0000-0000000000d2','tomas@correo.cl');
insert into administradoras (id,nombre,contacto) values
 ('aaaaaaaa-0000-0000-0000-000000000001','Salinas Gestión','Bruno Salinas'),
 ('aaaaaaaa-0000-0000-0000-000000000002','Cordillera','Paula Ibáñez');
insert into perfiles (id,nombre,email,rol,administradora_id) values
 ('00000000-0000-0000-0000-0000000000b0','Laura Méndez','laura@klip.cl','backoffice',null),
 ('00000000-0000-0000-0000-0000000000a1','Bruno Salinas','bruno@salinas.cl','administradora','aaaaaaaa-0000-0000-0000-000000000001'),
 ('00000000-0000-0000-0000-0000000000a2','Paula Ibáñez','paula@cordillera.cl','administradora','aaaaaaaa-0000-0000-0000-000000000002'),
 ('00000000-0000-0000-0000-0000000000c1','Rodrigo Fuentes','rodrigo@correo.cl','propietario',null),
 ('00000000-0000-0000-0000-0000000000d1','Camila Rojas','camila@correo.cl','arrendatario',null),
 ('00000000-0000-0000-0000-0000000000d2','Tomás Herrera','tomas@correo.cl','arrendatario',null);
insert into personas (id,tipo,nombre,email,perfil_id,creada_por_adm) values
 ('eeeeeeee-0000-0000-0000-0000000000c1','propietario','Rodrigo Fuentes','rodrigo@correo.cl','00000000-0000-0000-0000-0000000000c1','aaaaaaaa-0000-0000-0000-000000000001'),
 ('eeeeeeee-0000-0000-0000-0000000000d1','arrendatario','Camila Rojas','camila@correo.cl','00000000-0000-0000-0000-0000000000d1','aaaaaaaa-0000-0000-0000-000000000001'),
 ('eeeeeeee-0000-0000-0000-0000000000c2','propietario','Inversiones Sur','sur@correo.cl',null,'aaaaaaaa-0000-0000-0000-000000000002'),
 ('eeeeeeee-0000-0000-0000-0000000000d2','arrendatario','Tomás Herrera','tomas@correo.cl','00000000-0000-0000-0000-0000000000d2','aaaaaaaa-0000-0000-0000-000000000002');
insert into propiedades (id,codigo,administradora_id,propietario_id,direccion,comuna,ciudad) values
 ('bbbbbbbb-0000-0000-0000-000000000001','C:001','aaaaaaaa-0000-0000-0000-000000000001','eeeeeeee-0000-0000-0000-0000000000c1','Los Piñones 1240','Providencia','Santiago'),
 ('bbbbbbbb-0000-0000-0000-000000000002','C:002','aaaaaaaa-0000-0000-0000-000000000002','eeeeeeee-0000-0000-0000-0000000000c2','Av. Kennedy 5000','Las Condes','Santiago');
insert into contratos (id,propiedad_id,arrendatario_id,inicio,moneda,canon) values
 ('cccccccc-0000-0000-0000-000000000001','bbbbbbbb-0000-0000-0000-000000000001','eeeeeeee-0000-0000-0000-0000000000d1','2024-03-01','CLP',520000),
 ('cccccccc-0000-0000-0000-000000000002','bbbbbbbb-0000-0000-0000-000000000002','eeeeeeee-0000-0000-0000-0000000000d2','2025-01-01','UF',18);
insert into periodos values ('2026-10','2026-11-05',false,null,null);
insert into cobros (id,contrato_id,periodo,concepto,monto) values
 ('dddddddd-0000-0000-0000-000000000001','cccccccc-0000-0000-0000-000000000001','2026-10','arriendo',520000),
 ('dddddddd-0000-0000-0000-000000000002','cccccccc-0000-0000-0000-000000000002','2026-10','arriendo',729000);
insert into parametros (uf) values (40500);
insert into mensajes (de_id,para_id,texto) values ('00000000-0000-0000-0000-0000000000a2','00000000-0000-0000-0000-0000000000d2','Mensaje privado de Cordillera');

-- Sesión de un usuario: rol authenticated y su identificador en el JWT
create function como(uid text) returns void language sql as $$
  select set_config('request.jwt.claims', json_build_object('sub', uid)::text, false)
$$;

-- ---------- Administradora A ----------
select como('00000000-0000-0000-0000-0000000000a1'); set role authenticated;
select afirmar((select count(*) from propiedades) = 1 and (select codigo from propiedades) = 'C:001', 'administradora ve solo su cartera');
select afirmar((select count(*) from contratos) = 1, 'administradora ve solo sus contratos');
select afirmar((select count(*) from cobros) = 1, 'administradora ve solo sus cobros');
select afirmar((select count(*) from personas where nombre = 'Tomás Herrera') = 0, 'administradora no lista personas de otra administradora');
select afirmar((select count(*) from buscar_persona_por_email('TOMAS@correo.cl','arrendatario')) = 1, 'puede vincular por correo exacto');
select afirmar((select count(*) from buscar_persona_por_email('tomas@','arrendatario')) = 0, 'la búsqueda no admite correos parciales');
select afirmar(rechaza($q$insert into propiedades (codigo,administradora_id,propietario_id,direccion,comuna,ciudad) values ('C:099','aaaaaaaa-0000-0000-0000-000000000002','eeeeeeee-0000-0000-0000-0000000000c2','x','x','x')$q$), 'no crea propiedades en otra administradora');
select afirmar(not rechaza($q$insert into propiedades (codigo,administradora_id,propietario_id,direccion,comuna,ciudad) values ('C:003','aaaaaaaa-0000-0000-0000-000000000001','eeeeeeee-0000-0000-0000-0000000000c1','Carmencita 54','Las Condes','Santiago')$q$), 'crea propiedades en su cartera');
select afirmar(rechaza($q$insert into contratos (propiedad_id,arrendatario_id,inicio,moneda,canon) values ('bbbbbbbb-0000-0000-0000-000000000001','eeeeeeee-0000-0000-0000-0000000000d1','2026-10-01','CLP',1)$q$), 'no permite dos contratos vigentes en la misma propiedad');
select afirmar(not rechaza($q$insert into pagos (cobro_id,monto,medio,origen,registrado_por) values ('dddddddd-0000-0000-0000-000000000001',100000,'Transferencia','manual','00000000-0000-0000-0000-0000000000a1')$q$), 'registra pago manual en su cartera');
select afirmar(rechaza($q$insert into pagos (cobro_id,monto,medio,origen,registrado_por) values ('dddddddd-0000-0000-0000-000000000002',100000,'Transferencia','manual','00000000-0000-0000-0000-0000000000a1')$q$), 'no registra pagos en otra cartera');
select afirmar(rechaza($q$insert into pagos (cobro_id,monto,medio,origen,registrado_por) values ('dddddddd-0000-0000-0000-000000000001',100000,'Webpay','pasarela','00000000-0000-0000-0000-0000000000a1')$q$), 'no puede simular un pago de pasarela');
select afirmar((select count(*) from auditoria) = 0, 'administradora no lee la auditoría');
select afirmar(not rechaza($q$select registrar_auditoria('Pago manual','$100.000 en C:001')$q$), 'registra en la auditoría por la función');
select afirmar(rechaza($q$update periodos set cerrado = true$q$) or (select count(*) from periodos where cerrado) = 0, 'administradora no cierra el mes');
reset role;

-- ---------- Arrendataria A ----------
select como('00000000-0000-0000-0000-0000000000d1'); set role authenticated;
select afirmar((select count(*) from propiedades) = 1, 'arrendataria ve solo su propiedad');
select afirmar((select count(*) from cobros) = 1, 'arrendataria ve solo sus cobros');
select afirmar((select count(*) from personas where tipo = 'propietario') = 1, 'arrendataria ve a su propietario');
select afirmar((select count(*) from buscar_persona_por_email('tomas@correo.cl','arrendatario')) = 0, 'arrendataria no puede buscar personas por correo');
select afirmar((select count(*) from mensajes) = 0, 'arrendataria no lee mensajes ajenos');
select afirmar(not rechaza($q$insert into reparaciones (propiedad_id,contrato_id,categoria,descripcion,monto,cuotas) values ('bbbbbbbb-0000-0000-0000-000000000001','cccccccc-0000-0000-0000-000000000001','Cerrajería','Chapa',60000,2)$q$), 'solicita reparación en su contrato');
select afirmar(rechaza($q$insert into reparaciones (propiedad_id,contrato_id,categoria,descripcion,monto,cuotas) values ('bbbbbbbb-0000-0000-0000-000000000002','cccccccc-0000-0000-0000-000000000002','Pintura','x',60000,2)$q$), 'no solicita reparaciones en otra propiedad');
select afirmar(rechaza($q$insert into reparaciones (propiedad_id,contrato_id,categoria,descripcion,monto,cuotas,estado) values ('bbbbbbbb-0000-0000-0000-000000000001','cccccccc-0000-0000-0000-000000000001','x','x',1000,1,'aprobada')$q$), 'no crea reparaciones ya aprobadas');
select afirmar(not rechaza($q$update reparaciones set estado = 'aprobada'$q$), 'el intento de aprobar no falla pero no afecta filas');
select afirmar((select count(*) from reparaciones where estado = 'aprobada') = 0, 'no se aprueba su propia reparación');
select afirmar(rechaza($q$update perfiles set rol = 'backoffice' where id = auth.uid()$q$), 'rechaza cambiar su propio rol');
select afirmar(rechaza($q$update perfiles set acceso_total = true where id = auth.uid()$q$), 'rechaza darse acceso total');
select afirmar(not rechaza($q$update perfiles set whatsapp = '+56911112222' where id = auth.uid()$q$), 'puede editar su WhatsApp');
select afirmar((select rol from perfiles where id = auth.uid()) = 'arrendatario' and not (select acceso_total from perfiles where id = auth.uid()), 'no se puede subir de perfil');
select afirmar(rechaza($q$insert into pagos (cobro_id,monto,medio,origen,registrado_por) values ('dddddddd-0000-0000-0000-000000000001',1,'x','manual','00000000-0000-0000-0000-0000000000d1')$q$), 'no registra pagos manuales');
select afirmar(rechaza($q$insert into auditoria (actor,tipo) values ('x','x')$q$), 'no escribe directamente en la auditoría');
reset role;

-- ---------- Propietario A ----------
select como('00000000-0000-0000-0000-0000000000c1'); set role authenticated;
select afirmar((select count(*) from propiedades) = 2, 'propietario ve sus dos propiedades');
select afirmar((select count(*) from personas where tipo = 'arrendatario') = 1, 'propietario ve solo a su arrendataria');
select afirmar((select count(*) from pagos) = 1, 'propietario ve los pagos de su propiedad');
reset role;

-- ---------- Back office ----------
select como('00000000-0000-0000-0000-0000000000b0'); set role authenticated;
select afirmar((select count(*) from propiedades) = 3, 'back office ve todas las propiedades');
select afirmar((select count(*) from auditoria) = 1 and (select actor from auditoria) = 'Bruno Salinas', 'auditoría registra al usuario real');
select afirmar(not rechaza($q$update periodos set cerrado = true where ym = '2026-10'$q$), 'back office cierra el mes');
reset role;

-- ---------- Acceso total (administradora con permisos de back office) ----------
update perfiles set acceso_total = true where id = '00000000-0000-0000-0000-0000000000a2';
select como('00000000-0000-0000-0000-0000000000a2'); set role authenticated;
select afirmar((select count(*) from propiedades) = 3, 'acceso total ve toda la plataforma');
reset role;

-- ---------- Anónimo ----------
select set_config('request.jwt.claims', '', false); set role anon;
select afirmar(rechaza('select count(*) from propiedades'), 'sin sesión no se accede a nada');
reset role;

-- ---------- Auditoría inmutable, incluso para el dueño de la base ----------
select afirmar(rechaza('update auditoria set actor = ''x'''), 'la auditoría no se puede modificar');
select afirmar(rechaza('delete from auditoria'), 'la auditoría no se puede borrar');
select afirmar(rechaza('truncate auditoria'), 'la auditoría no se puede vaciar');
