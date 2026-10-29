# Pata de Oso — sitio web

Sitio estático (HTML, CSS y JS sin dependencias) para Pata de Oso, panadería, repostería, brunch y café en Reforma 55, Tulantongo, Texcoco.

## Verlo en local

```bash
python -m http.server 5510
```

Luego abre http://localhost:5510.

## Estructura

- `index.html`: la página completa (portada, temporada, menú, la casa, visítanos).
- `styles.css`: estilos y tokens de color.
- `script.js`: navegación móvil, pared animada, pestañas, corte por capas y estado abierto/cerrado.
- `img/`: fotos en WebP (procedencia en `img/FUENTES.md`).
- `fonts/`: Young Serif y Schibsted Grotesk, alojadas en el proyecto.
- `PRODUCT.md` y `DESIGN.md`: contexto del negocio y sistema de diseño.

## Mantenimiento

- **Postres de temporada:** cada postre es un `<article class="corte">` con sus capas (`--alto` es la proporción y `--color` el color). Agrega una pestaña nueva en `.corte-tabs` y su panel.
- **Precios:** están en los paneles del menú (`#m-panaderia`, `#m-reposteria`, `#m-brunch`, `#m-barra`).
- **Horario:** si cambia, actualiza `ABRE` y `CIERRA` en `script.js`, el texto en `index.html` y el JSON-LD del `<head>`.
- **Otra sucursal:** duplica el bloque `.visita` con su dirección y su mapa.

## Publicar

Se puede subir tal cual a Netlify, Vercel, GitHub Pages o cualquier hosting estático. Antes de publicar, confirma con el negocio los precios y el permiso para usar sus fotos.
