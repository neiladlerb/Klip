# Paso a producción

Objetivo: piloto en producción con una administradora en un mes. Pagos por transferencia registrados por la administradora; tarjeta en una segunda fase, con la pasarela ya contratada.

## Arquitectura

| Pieza | Servicio | Estado |
|---|---|---|
| Web | Vercel (este repositorio) | Funcionando con la demo |
| Base de datos, login y permisos | Supabase (Postgres, región São Paulo) | Esquema y permisos listos en `supabase/migrations/` |
| Emails | Resend, desde `notificaciones.klip.cl` | Sender y plantillas listos en `api/_lib/email/` |
| Tareas programadas (cierre de mes, recordatorios) | Vercel Cron | Semana 2 |
| Pagos con tarjeta | Pasarela por decidir | Fase 2 |

## Plan

| Semana | Trabajo |
|---|---|
| 1 | Esquema y permisos, sender de emails, DNS, cuentas de Supabase y Resend |
| 2 | La página pasa a leer y escribir en Supabase: login, cartera, contratos, cobros, pagos y auditoría. Cierre de mes programado |
| 3 | Reparaciones, liquidaciones y mensajes. Emails conectados a cada evento. Entorno de pruebas separado |
| 4 | Pruebas, revisión de seguridad, documentos legales, carga de la cartera real y arranque del piloto |

## Cuentas que hay que crear

Las crea alguien de la empresa con un correo corporativo (no personal), con doble factor activado:
1. **Supabase**: proyecto `klip-produccion`, región South America (São Paulo). Más adelante, otro `klip-pruebas`.
2. **Resend**: dar de alta el dominio `notificaciones.klip.cl`, región São Paulo. Ver `docs/dns-klip.cl.md`.
3. **Vercel**: ya existe; hay que añadir las variables de entorno.

## Variables de entorno en Vercel

Settings, Environment Variables. Las claves nunca se escriben en el código ni se mandan por chat.

| Variable | Valor | Para qué |
|---|---|---|
| `RESEND_API_KEY` | Clave de Resend (`re_...`) | Enviar emails |
| `EMAIL_MODO` | `real` en producción; vacío en pruebas | Sin `real`, los emails se simulan y no salen |
| `EMAIL_REMITENTE` | `KLIP <no-responder@notificaciones.klip.cl>` | Remitente |
| `EMAIL_RESPONDER_A` | Buzón real que atiende respuestas | Respuestas de usuarios |
| `EMAIL_PRUEBA_TOKEN` | Cadena aleatoria larga | Protege la función de prueba |
| `EMAIL_PRUEBA_DESTINO` | Tu correo | Único destino de la prueba |
| `SUPABASE_URL` | URL del proyecto | Semana 2 |
| `SUPABASE_ANON_KEY` | Clave pública | Semana 2 |
| `SUPABASE_SERVICE_ROLE_KEY` | Clave de servicio (secreta) | Semana 2, solo en el servidor |

## Comprobar el envío de emails

Con el DNS verificado en Resend y las variables puestas:

```bash
curl -X POST https://<dominio>/api/email-prueba -H "Authorization: Bearer <EMAIL_PRUEBA_TOKEN>"
```

Debe responder `"estado":"enviado"` y llegar un correo a `EMAIL_PRUEBA_DESTINO`. Revisar en Gmail, en "Mostrar original", que SPF, DKIM y DMARC salgan como `PASS`.

## Supabase: login con emails propios

Supabase envía los emails de activación y recuperación de contraseña. Para que salgan desde nuestro dominio y sin el límite de envío de Supabase: Authentication, SMTP Settings:
- Host `smtp.resend.com`, puerto `465`, usuario `resend`, contraseña la clave de Resend.
- Remitente `no-responder@notificaciones.klip.cl`.
- En URL Configuration, la dirección de la web como Site URL.

## Aplicar el esquema

En el panel de Supabase, SQL Editor, ejecutar `supabase/migrations/0001_esquema.sql`. Las pruebas de permisos (`npm run test:db`) se ejecutan en GitHub Actions en cada cambio.

## Riesgos que no dependen del código

- **Pasarela de pago:** contrato y certificación pueden llevar varias semanas. Por eso la tarjeta va en la fase 2.
- **Facturación electrónica (SII)** de la comisión de KLIP.
- **Custodia de fondos:** si KLIP recibe y reenvía el dinero, revisar con abogado la Ley Fintec (21.521). Una pasarela que reparta el pago directamente lo evita.
- **Ley 21.719 de protección de datos**, en vigor en diciembre de 2026: política de privacidad, registro de tratamientos y contratos con Supabase, Resend y Vercel.
