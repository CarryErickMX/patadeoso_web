# Pata de Oso — sistema de diseño

Sacado del local y de sus impresos: el muro verde del comedor, la caja de pan chartreuse y los menús en papel salvia con tinta oliva.

## Color

| Token | Hex | Uso |
|---|---|---|
| `--bosque` | #233823 | Fondo principal (portada, la casa, pie). El color del muro. |
| `--bosque-hondo` | #1A2B1A | Tira de fotos, hover de botones bosque. |
| `--chartreuse` | #A9AE1F | Acción primaria sobre bosque; fondo completo de Visítanos. Viene de la caja. |
| `--chartreuse-claro` | #C4C93A | Hover de botones chartreuse. |
| `--papel` | #E8E9D5 | Fondo de Temporada y Menú (papel de sus menús). |
| `--papel-hondo` | #DCDEC4 | Resaltado de filas sobre papel. |
| `--oliva` | #3D4215 | Texto sobre papel. |
| `--oliva-suave` | #5B6128 | Texto secundario sobre papel (5.5:1). |
| `--masa` | #EFE7D4 | Texto sobre bosque; silueta de la pata. |
| `--masa-suave` | #C9CDB3 | Texto secundario sobre bosque. |
| `--cempasuchil` | #EE8A1A | Solo estado "cerramos pronto" y colores de temporada. |

Estrategia: comprometida. Cada sección es un campo de color completo (bosque, papel o chartreuse), no acentos sobre un neutro.

## Tipografía

- **Young Serif** (400): títulos, nombres de platillo, precios, pestañas. Suave y redonda como el logotipo.
- **Schibsted Grotesk** (400–700, itálica 400): texto, botones, notas.
- Ambas alojadas en `fonts/`. Escala: portada hasta 6rem, h2 hasta 4rem, platillos 1.22rem, texto 1–1.06rem.
- Precios con `font-variant-numeric: tabular-nums`.

## Forma

- Silueta de la pata de oso (óvalo con tres cortes en abanico), símbolo `#pata` en `index.html`. Único ornamento del sitio.
- Fotos con radio de 6px. Botones con extremos redondos (999px), como los dedos de la pata.
- Líneas de 1px en oliva o masa al 14–22% para separar filas; nunca tarjetas con sombra.

## Componentes

- **Barra**: pegajosa, bosque al 94% con desenfoque; en móvil, menú desplegable.
- **Estado en vivo**: punto chartreuse (abierto), cempasúchil (cierra en menos de 30 min) o apagado (cerrado), calculado con la hora del centro de México.
- **Corte de temporada**: pestañas accesibles (flechas, Inicio, Fin); cada ingrediente resalta su capa al pasar el puntero o enfocar.
- **Carta**: dos columnas en escritorio, nombre a la izquierda y precio a la derecha, descripción debajo.
- **Encargo**: bloque bosque dentro del papel, con llamada directa.

## Movimiento

Basado en las reglas de Emil Kowalski (skills `emil-design-eng` y `animate`) y la guía de animación de Impeccable.

- **Curvas:** `--salida` cubic-bezier(0.23, 1, 0.32, 1) para entradas; `--vaiven` cubic-bezier(0.77, 0, 0.175, 1) para movimiento en pantalla (recortes, indicador); `linear` solo en el carrusel.
- **Carga de la portada:** el lema sube palabra por palabra (70ms entre palabras), luego el texto, los botones y la franja de estado; la pared se llena fila por fila.
- **Momento firma:** el corte de temporada se arma al entrar en pantalla; la base cae primero y cada capa se acomoda encima (160ms entre capas). Se repite al cambiar de postre.
- **Revelados al hacer scroll (una sola vez):** textos con subida corta y desenfoque; fotos con recorte de abajo hacia arriba mientras se asientan; listas escalonadas 85ms (tope de 10). Textos ~1.1s, fotos ~1.5s.
- **Carrusel de fotos:** avanza solo a ~45px/s, se pausa con el cursor encima, con foco dentro o fuera de pantalla.
- **Pestañas:** indicador que se desliza; al hacer clic, el panel entra con un ligero desenfoque. Con teclado el cambio es instantáneo.
- **Paralaje ligado al scroll** (solo donde `animation-timeline` existe): la pared de la portada, la foto chica de la pared y el acercamiento de la foto del equipo.
- **Retroalimentación:** botones y pestañas escalan a 0.97 al presionar; el punto de "abierto" late suave.
- **Sin JS** todo se ve completo. **Con movimiento reducido** solo quedan cambios de opacidad; el carrusel se vuelve una tira deslizable a mano.

## Puntos de quiebre

1080px (Visítanos a dos columnas, se oculta la fachada), 860px (una columna, navegación móvil), 480px (corte apilado, pestañas deslizables).
