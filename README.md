
# Cubrí Seguros

## Flujo de contratación digital de seguros

Trabajo Práctico N.º 5 — Diseño UX/UI 2026  
Licenciatura en Sistemas de Información

Aplicación web responsive que simula el proceso de contratación de un seguro de celular, desde la cotización hasta la emisión de una póliza.

### Sitio publicado

https://sofiferuader1.github.io/TP5-Cubri-Seguros/

## Tecnologías utilizadas

- HTML5
- Tailwind CSS v4 (CDN)
- Basecoat UI
- JavaScript vanilla (módulos ES)
- JSON para los planes disponibles

## Funcionalidades

- Catálogo de productos.
- Cotización de seguro de celular.
- Cálculo automático de cuotas.
- Selección entre tres planes: Básico, Plus y Premium.
- Validación de datos personales.
- Simulación de pagos aprobados y rechazados.
- Generación de número de póliza.
- Navegación entre pasos conservando los datos.
- Diseño responsive para celular y computadora.

## Cómo ejecutar el proyecto

Abrir la carpeta del proyecto en Visual Studio Code y utilizar la extensión Live Server.

También puede ejecutarse mediante:

```bash
npx serve .
```

Se requiere un servidor local porque los módulos ES y `fetch` no funcionan correctamente al abrir el archivo mediante `file://`.

## Estructura del proyecto

```text
index.html
css/
  tokens.css
data/
  planes.json
js/
  app.js
  cotizador.js
  estado.js
  pago.js
  render.js
  validaciones.js
capturas/
  mobile/
  desktop/
README.md
```

## Decisiones de implementación

Se utiliza un único objeto `solicitud` para almacenar el estado de la contratación.

La navegación permite retroceder sin perder los datos ingresados.

El resumen de contratación se genera desde el estado y se presenta como una barra inferior en dispositivos móviles y una tarjeta lateral en escritorio.

Las validaciones muestran mensajes de error al abandonar los campos incorrectos.

Los botones de continuación permanecen deshabilitados hasta completar correctamente los campos obligatorios.

El pago se simula con una espera de 1,5 segundos y se evita el doble procesamiento.

## Casos de prueba

| Valor del equipo | Antigüedad | Básico | Plus | Premium |
|---|---|---|---|---|
| $600.000 | Menos de 1 año | $2.000 | $3.000 | $4.500 |
| $600.000 | 1 a 2 años | $2.200 | $3.300 | $4.950 |
| $1.200.000 | Más de 2 años | $5.000 | $7.500 | $11.250 |

## Simulación de pago

Tarjetas de prueba:

- `4111 1111 1111 1111`: pago aprobado.
- `4000 0000 0000 0002`: pago rechazado.

No se procesan pagos reales ni se envían correos electrónicos.

El número de póliza se genera con el formato `POL-AAAA-NNNNNN`.

El botón **Imprimir / Guardar póliza** utiliza la función de impresión del navegador y permite guardar el documento como PDF.

## Funcionalidades adicionales

- Máscaras de entrada para número de tarjeta y vencimiento.
- Conservación de datos al retroceder entre pantallas.
- Mensajes de error y estados de carga.
- Resumen adaptable a dispositivos móviles y escritorio.

## Capturas de pantalla

Se incluyen las siete pantallas del flujo en dos resoluciones:

- Mobile: 390 px.
- Desktop: 1440 px.

| Pantalla | Mobile | Desktop |
|---|---|---|
| Inicio | ![Inicio mobile](capturas/mobile/01-inicio.png) | ![Inicio desktop](capturas/desktop/01-inicio.png) |
| Cotización | ![Cotización mobile](capturas/mobile/02-cotizar.png) | ![Cotización desktop](capturas/desktop/02-cotizar.png) |
| Planes | ![Planes mobile](capturas/mobile/03-planes.png) | ![Planes desktop](capturas/desktop/03-planes.png) |
| Datos personales | ![Datos mobile](capturas/mobile/04-datos.png) | ![Datos desktop](capturas/desktop/04-datos.png) |
| Pago | ![Pago mobile](capturas/mobile/05-pago.png) | ![Pago desktop](capturas/desktop/05-pago.png) |
| Éxito | ![Éxito mobile](capturas/mobile/06-exito.png) | ![Éxito desktop](capturas/desktop/06-exito.png) |
| Error de pago | ![Error mobile](capturas/mobile/07-error.png) | ![Error desktop](capturas/desktop/07-error.png) |

## Repositorio

https://github.com/Sofiferuader1/TP5-Cubri-Seguros
