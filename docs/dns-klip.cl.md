# DNS de klip.cl: qué hay que configurar

Documento para quien administra el DNS de klip.cl. Son dos bloques independientes: el **envío de emails**, que hay que hacer ya, y la **web**, que se hace el día del lanzamiento.

Antes de tocar nada, conviene sacar una captura de los registros actuales para poder volver atrás.

## 1. Envío de emails (ahora)

KLIP enviará los avisos (cobros, comprobantes de pago, liquidaciones) desde **notificaciones.klip.cl**, un subdominio. Así no se toca el correo que ya funcione en klip.cl: los registros MX, SPF y DMARC de klip.cl se quedan como están.

Cuando el dominio esté dado de alta en Resend (región São Paulo), su panel mostrará tres registros parecidos a estos. **Hay que copiar los valores exactos de Resend**, sobre todo el de DKIM, que es único:

| Tipo | Nombre (host) | Valor | Prioridad |
|---|---|---|---|
| MX | `send.notificaciones` | `feedback-smtp.sa-east-1.amazonses.com` | 10 |
| TXT | `send.notificaciones` | `v=spf1 include:amazonses.com ~all` | |
| TXT | `resend._domainkey.notificaciones` | `p=MIGf...` (clave larga que da Resend) | |

Y uno más, que añadimos nosotros, para la política de autenticación (DMARC) solo de ese subdominio:

| Tipo | Nombre (host) | Valor |
|---|---|---|
| TXT | `_dmarc.notificaciones` | `v=DMARC1; p=none; rua=mailto:dmarc@klip.cl` |

Notas:
- Según el proveedor de DNS, el nombre se escribe corto (`send.notificaciones`) o completo (`send.notificaciones.klip.cl`). Si el panel añade `.klip.cl` solo, va el corto.
- La dirección `dmarc@klip.cl` recibe informes automáticos; puede ser cualquier buzón que exista.
- Al cabo de un mes con informes limpios, el DMARC pasa de `p=none` a `p=quarantine`.
- La verificación en Resend tarda entre unos minutos y unas horas.

## 2. Web (el día del lanzamiento)

**Ojo:** esto sustituye lo que se vea hoy en www.klip.cl. Mientras la plataforma no esté en producción, la web sigue en la dirección de pruebas de Vercel.

| Tipo | Nombre (host) | Valor |
|---|---|---|
| A | `@` (klip.cl) | `76.76.21.21` |
| CNAME | `www` | `cname.vercel-dns.com` |

Vercel muestra los valores exactos al añadir el dominio en el proyecto (Settings, Domains); si difieren de estos, mandan los de Vercel. El certificado HTTPS lo emite Vercel solo.

## Qué necesitamos saber de klip.cl

1. ¿Qué proveedor de DNS usa (NIC Chile directo, Cloudflare, GoDaddy, otro)?
2. ¿Hay correo funcionando en @klip.cl (Google Workspace, Microsoft 365, otro)?
3. ¿Qué hay publicado hoy en www.klip.cl?
