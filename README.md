# KLIP.CL

Demo funcional de KLIP, una plataforma de pago de arriendos para Chile. Conecta a arrendatarios, propietarios y administradoras de propiedades: pago de arriendo y gastos comunes en línea, liquidación mensual al propietario, reparaciones acordadas que se descuentan del arriendo y un back office para operar la plataforma.

> **Es una demo.** Los pagos son simulados, todos los datos son ficticios y todo se guarda en el navegador de quien la usa (`localStorage`). No tiene servidor, así que no sirve para datos reales.

## Cómo abrirla

La página usa `crypto.subtle` para verificar contraseñas, que solo funciona en un contexto seguro. Ábrela desde un servidor local, no haciendo doble clic en el archivo:

```bash
npm start            # o: python3 -m http.server 8000
```

Después entra en http://localhost:8000. En GitHub Pages funciona tal cual.

## Cuentas de demostración

Contraseña para todas: `Klip2026!`

| Perfil | Correo |
|---|---|
| Administradora | bruno.salinas@demo.klip.cl |
| Arrendatario | camila.rojas@demo.klip.cl |
| Propietario | rodrigo.fuentes@demo.klip.cl |
| Back office | laura.mendez@demo.klip.cl |

Para volver a los datos de ejemplo: Back office, Parámetros, "Restablecer datos de ejemplo".

## Estructura

```
index.html          Página y orden de carga de los scripts
css/klip.css        Estilos (tema claro y oscuro)
js/calc.js          Cálculos puros: fechas, UF, cuotas, liquidación, reajuste IPC
js/datos.js         Constantes, catálogo de proveedores y datos de ejemplo
js/estado.js        Estado guardado, sesión, cálculos sobre los datos y Lab
js/vistas.js        Pantallas de cada perfil y gráficos
js/modales.js       Ventanas modales
js/eventos.js       Eventos de la interfaz y arranque
tests/              Tests de los cálculos
```

Son scripts clásicos que comparten el ámbito global y se cargan en el orden de `index.html`. `calc.js` no depende del estado ni de la página, por eso se puede probar con Node.

## Tests

```bash
npm test
```

Prueban las reglas de negocio de `js/calc.js`: formato de pesos, fechas, interpolación de la UF, reparto de cuotas, saldo a pagar, liquidación con comisión e IVA, reajuste IPC y política de contraseñas. Se ejecutan en GitHub Actions en cada push. No hace falta instalar dependencias.

## Reglas de negocio principales

- **Canon en UF:** se cobra al valor de la UF del periodo. **Canon en pesos:** se reajusta por IPC cada 6 o 12 meses y se redondea a miles.
- **Liquidación:** canon cobrado menos reparaciones, menos comisión de la administradora, menos IVA (19 %) de esa comisión.
- **Reparaciones:** las aprueba el propietario (o la administradora con mandato) y las confirma el arrendatario. Se descuentan del arriendo en 1 a 6 cuotas, y la última cuota absorbe el redondeo.
- **Cierre de mes:** solo lo hace el back office. Lo impago pasa a saldo anterior y la cuota de reparación de ese mes se da por aplicada.
- **Pagos manuales:** la administradora registra pagos completos o abonos parciales.
- **Suplantación:** el back office puede ver la plataforma como otro usuario. La auditoría registra a ambos y no se pueden firmar actas en su nombre.

## Antes de pasar a producción

- Backend con autenticación en servidor y contraseñas con Argon2 o bcrypt.
- Auditoría en servidor y no modificable.
- Pagos a través de una pasarela (Webpay u otra) para quedar fuera del alcance de PCI DSS.
- UF e IPC desde una fuente oficial (CMF o similar).
- Términos de uso y política de privacidad conforme a la Ley 21.719 de protección de datos personales.
