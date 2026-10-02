# Pizarra Táctica de Fútbol Pro

Pizarra táctica interactiva para armar alineaciones de fútbol en el navegador. Elige una formación, arrastra a los jugadores sobre la cancha, haz hasta 5 cambios desde la banca, asigna al capitán y ponle a tu equipo la camisa de tu club o selección favorita.

No necesita instalación, servidor ni dependencias: es HTML, CSS y JavaScript puro.

## Características

- **6 formaciones:** 4-3-3, 4-4-2, 4-2-3-1, 3-5-2, 5-3-2 y 4-1-4-1.
- **Arrastrar y soltar** a los 11 titulares, con mouse o con el dedo.
- **Movimiento con teclado:** flechas para mover un jugador 1 %, `Shift` + flechas para 5 %.
- **Edición de jugadores:** cambia el nombre (hasta 20 caracteres) y la posición táctica (hasta 15).
- **Banca de 13 suplentes** (dorsales 12 al 24).
- **Hasta 5 cambios** por partido, con contador en el encabezado y marca ▲ en los jugadores que entraron.
- **Capitán:** se asigna a cualquier titular y el brazalete pasa al que entra si el capitán sale.
- **Catálogo de camisas:** 68 equipos agrupados por liga (Liga MX, LaLiga, Premier League, Bundesliga, Serie A, Ligue 1, otras ligas de Europa, Sudamérica y selecciones), con camisas lisas, de rayas, aros, banda o franja, y color de portero propio.
- **Guardado automático** en el navegador (`localStorage`): alineación, posiciones, cambios, capitán, formación y camisa.
- **Accesible:** etiquetas ARIA, foco visible, mensajes de estado y respeto a `prefers-reduced-motion`.
- **Adaptable a móvil.**

## Cómo usarlo

1. Descarga o clona el proyecto y mantén la estructura de carpetas (ver abajo).
2. Abre `tablero.html` en tu navegador.

Funciona con doble clic, sin servidor. Si prefieres uno local:

```bash
python3 -m http.server 8000
# luego abre http://localhost:8000/tablero.html
```

Requiere un navegador moderno (usa `Object.hasOwn`, `aspect-ratio` y pointer events). Chrome, Edge, Firefox y Safari de los últimos años funcionan sin problema.

## Guía rápida

| Acción | Cómo |
| --- | --- |
| Mover un jugador | Arrástralo, o selecciónalo y usa las flechas del teclado |
| Seleccionar / deseleccionar | Clic o toque; con teclado, `Enter` o `Espacio` |
| Cambiar de formación | Menú **Estructura de Juego** |
| Cambiar la camisa | Elige la **Liga o Competición** y luego el **Equipo** |
| Editar nombre o posición | Selecciona un jugador, edita los campos y pulsa **Guardar** |
| Hacer un cambio | Selecciona un titular y un suplente, luego pulsa el botón de sustitución |
| Asignar capitán | Selecciona un titular y pulsa **Asignar Capitán** |
| Empezar de cero | **Restablecer Formación y Cambios** |

Detalles que conviene saber:

- Al cambiar de formación, los jugadores vuelven a las posiciones de la nueva formación; los ajustes manuales se pierden.
- Al cambiar de liga se aplica automáticamente el primer equipo de esa liga.
- El suplente que entra hereda la posición y las coordenadas del titular que sale.
- Solo un titular puede ser capitán.
- **Restablecer** devuelve la plantilla, los cambios y la formación 4-3-3, pero **no** cambia la camisa elegida.

## Estructura del proyecto

```
.
├── tablero.html        # Estructura de la página
├── alineacion.js       # Lógica: formaciones, arrastre, cambios, capitán, guardado
├── camisas.js          # Catálogo de equipos y colores de camisa
└── css/
    ├── variables.css   # Colores y tipografía base
    ├── base.css        # Reset, formularios y botones
    ├── layout.css      # Disposición general y tarjetas
    ├── cancha.css      # Cancha, fichas de jugadores y camisas
    └── panel.css       # Panel lateral, banca y selector de camisa
```

`camisas.js` debe cargarse antes que `alineacion.js` (ya está así en `tablero.html`).

## Personalización

### Cambiar la plantilla

Edita `PLANTILLA_INICIAL` en `alineacion.js`. Los jugadores con `esTitular: true` (deben ser exactamente 11) salen a la cancha; el resto va a la banca. Los dorsales deben ser únicos.

### Agregar o editar una formación

1. Agrega un `<option>` en el `<select id="selectFormacion">` de `tablero.html`.
2. Agrega la formación en `FORMACIONES` en `alineacion.js`: una lista de 11 puestos con `id`, `pos` y coordenadas `x`, `y` en porcentaje (0 = izquierda/arriba, 100 = derecha/abajo).

Los `id` de los puestos deben coincidir con los dorsales de los 11 titulares originales (`"1"` al `"11"`), porque así se mantiene cada puesto aunque haya sustituciones.
