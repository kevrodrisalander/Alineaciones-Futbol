# Pizarra Táctica de Fútbol Pro

Pizarra táctica interactiva para armar alineaciones de fútbol en el navegador. Elige una formación, arrastra a los jugadores sobre la cancha, haz hasta 5 cambios desde la banca, asigna al capitán y ponle a tu equipo la camisa de tu club o selección favorita.

No necesita instalación, servidor ni dependencias: es HTML, CSS y JavaScript puro.

## Características

- **6 formaciones:** 4-3-3, 4-4-2, 4-2-3-1, 3-5-2, 5-3-2 y 4-1-4-1.
- **Arrastrar y soltar** a los 11 titulares, con mouse o con el dedo.
- **Movimiento con teclado:** flechas para mover un jugador; paso vertical de 1 % y horizontal ajustado a la proporción de la cancha. `Shift` multiplica el paso por 5.
- **Edición de jugadores:** cambia el nombre (hasta 20 caracteres) y la posición táctica (hasta 15).
- **Banca de 13 suplentes** (dorsales 12 al 24 en la plantilla incluida).
- **Plantillas:** ejemplo de Real Madrid, Atlético de Madrid (2026/27) y plantilla en blanco para personalizar. Las camisas de otros equipos no incluyen automáticamente sus jugadores.
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

## Guardado y pruebas

El formato guardado incluye una versión. Las alineaciones antiguas válidas se adaptan en memoria y se guardan con la versión actual en la siguiente acción. Al cargar, se verifica que la secuencia de sustituciones, el contador y los puestos coincidan con los titulares finales. Si los datos son incompatibles o incoherentes, se carga la plantilla por defecto y se muestra un aviso.

Si falla el guardado, los cambios permanecen en la sesión y se muestra un error. Vuelve a intentar guardar antes de cerrar la página.

Para ejecutar las pruebas de persistencia con Node.js (solo necesario para desarrollo):

```bash
node --test tests/persistencia.test.cjs
```

## Guía rápida

| Acción | Cómo |
| --- | --- |
| Mover un jugador | Arrástralo, o selecciónalo y usa las flechas del teclado |
| Seleccionar / deseleccionar | Clic o toque; con teclado, `Enter` o `Espacio` |
| Cambiar de formación | Menú **Estructura de Juego** |
| Cambiar la camisa | Elige la **Liga o Competición** y luego el **Equipo** |
| Cargar jugadores de un equipo | Pulsa **Cargar plantilla del equipo**, disponible cuando existe una plantilla para la camisa elegida |
| Crear una plantilla personalizada | Pulsa **Plantilla en blanco** y edita sus jugadores |
| Editar nombre o posición | Selecciona un jugador, edita los campos y pulsa **Guardar** |
| Hacer un cambio | Selecciona un titular y un suplente, luego pulsa el botón de sustitución |
| Asignar capitán | Selecciona un titular y pulsa **Asignar Capitán** |
| Empezar de cero | **Restablecer Formación y Cambios** |

Detalles que conviene saber:

- Al cambiar de formación, los jugadores vuelven a las posiciones de la nueva formación; los ajustes manuales se pierden.
- Al cambiar de liga se aplica automáticamente el primer equipo de esa liga.
- Cambiar la camisa conserva los jugadores actuales. Para reemplazarlos, carga una plantilla; esta acción reinicia los cambios y el capitán y reubica a los titulares según la formación actual.
- El formulario edita al último jugador seleccionado, aunque haya un titular y un suplente seleccionados para sustituir. Al deseleccionarlo, muestra al jugador que sigue seleccionado.
- El suplente que entra hereda la posición y las coordenadas del titular que sale.
- Solo un titular puede ser capitán.
- **Restablecer** recupera los nombres y el capitán de la plantilla actual, pone el contador a cero y aplica la formación 4-3-3. Conserva la camisa elegida.

## Estructura del proyecto

```
.
├── tablero.html        # Estructura de la página
├── alineacion.js       # Inicio del tablero y eventos de los controles
├── js/
│   ├── formaciones.js  # Catálogo de formaciones y creación de window.Pizarra
│   ├── configuracion.js # Constantes, catálogos y copia de plantillas
│   ├── estado.js       # Estado inicial de jugadores y selecciones
│   ├── dom.js          # Referencias a elementos de la interfaz
│   ├── persistencia.js # Guardado, validación y recuperación
│   ├── equipaciones.js # Camisas y selectores de equipos y ligas
│   ├── renderizado.js  # Cancha, banca, formulario y selección visual
│   ├── interaccion.js # Movimiento con teclado y arrastre
│   └── tactica.js      # Formación, plantillas, capitán y sustituciones
├── camisas.js          # Catálogo de equipos y colores de camisa
├── plantillas.js       # Función compartida y registro de plantillas
├── plantillas/
│   ├── real-madrid.js  # Datos de jugadores de Real Madrid
│   └── atletico.js     # Atlético de Madrid, temporada 2026/27
├── README.md           # Uso, personalización y pruebas
├── css/
│   ├── variables.css   # Colores y tipografía base
│   ├── base.css        # Reset, formularios y botones
│   ├── layout.css      # Disposición general y tarjetas
│   ├── cancha.css      # Cancha, fichas de jugadores y camisas
│   └── panel.css       # Panel lateral, banca y selector de camisa
└── tests/
    └── persistencia.test.cjs # Pruebas de persistencia e interacción con Node.js
```

`tablero.html` carga los scripts en este orden: `camisas.js`, `plantillas.js`, los archivos de equipos en `plantillas/`, los archivos de `js/` en el orden del árbol anterior y finalmente `alineacion.js`. El registro y la función común deben existir antes de cargar los equipos. Se usan scripts clásicos para mantener el funcionamiento al abrir el HTML con doble clic.

La lógica se comparte a través de `window.Pizarra`: `config` contiene las constantes y catálogos, `datos` contiene el estado mutable y `dom` las referencias a la interfaz. Cada archivo registra sus funciones en ese objeto; `alineacion.js` inicia la aplicación cuando todos están cargados. Al agregar funcionalidades, modifica el archivo responsable y conserva el orden de carga.

## Personalización

La plantilla del Atlético de Madrid usa nombres y dorsales de la [plantilla oficial 2026/27](https://www.atleticodemadrid.com/jugadores-primer-equipo/), consultada el 10 de octubre de 2026. La distribución de sus 11 titulares es una propuesta editable para la pizarra, no una alineación oficial de partido. Para cargarla, elige **LaLiga (España)**, **Atlético de Madrid** y pulsa **Cargar plantilla de Atlético de Madrid**.

### Cambiar la plantilla

Cada equipo tiene su archivo en `plantillas/`. Para editar Real Madrid, modifica `plantillas/real-madrid.js`. Para agregar otro equipo:

1. Copia ese archivo con el nombre del identificador del nuevo equipo, por ejemplo `plantillas/barcelona.js`.
2. Cambia la clave del registro y los datos de jugadores. La estructura de registro es `window.PLANTILLAS_EQUIPO["id-del-equipo"] = window.crearPlantillaEquipo(titulares, suplentes, capitan);`.
3. Agrega `<script src="plantillas/barcelona.js"></script>` en `tablero.html`, después de `plantillas.js` y antes de `alineacion.js`. Las pruebas cargan los mismos scripts que el tablero.

La función compartida `crearPlantillaEquipo` vive en `plantillas.js`. Sus datos deben cumplir estas reglas:

- La clave de la entrada debe coincidir con el `id` del equipo en `camisas.js`, por ejemplo `"real-madrid"`.
- `titulares` contiene exactamente 11 pares `[dorsal, nombre]`, en este orden: portero, lateral derecho, central, central, lateral izquierdo, pivote, extremo derecho, mediocampista, delantero, mediocampista y extremo izquierdo.
- `suplentes` contiene exactamente 13 listas `[dorsal, nombre, posición]`.
- Los 24 dorsales deben ser enteros distintos entre 1 y 99. Los nombres admiten hasta 20 caracteres y las posiciones hasta 15.
- `capitan` es el dorsal de uno de los titulares. Si lo omites, se usa el dorsal 10; indícalo expresamente si ese dorsal no es titular.

La función asigna `esTitular`, `esCapitan` y `puestoId`. El puesto táctico depende del orden del titular en la lista y es independiente de su dorsal: el primer titular ocupa `"1"`, el segundo `"2"`, hasta `"11"`. Los suplentes empiezan con `puestoId: null`.

Para probar una plantilla editada, abre el tablero, elige su camisa y pulsa el botón para cargar su plantilla. Una alineación guardada previamente puede seguir mostrando los nombres anteriores hasta que la reemplaces. La plantilla en blanco se genera en `plantillaEnBlanco()`, dentro de `js/configuracion.js`.

### Agregar o editar una formación

1. Agrega un `<option>` en el `<select id="selectFormacion">` de `tablero.html`.
2. Agrega la formación en `FORMACIONES` en `js/formaciones.js`: una lista de 11 puestos con `id`, `pos` y coordenadas `x`, `y` en porcentaje (0 = izquierda/arriba, 100 = derecha/abajo).

Cada formación debe incluir exactamente una vez los 11 identificadores de puesto (`"1"` al `"11"`), como cadenas de texto. Estos identificadores se relacionan con `puestoId`, no con los dorsales. Cuando entra un suplente, hereda el puesto del jugador que sale; así se conserva la asignación al cambiar de formación después de una sustitución.

Usa coordenadas dentro de los límites de movimiento de la aplicación: `x` entre 6 y 94, `y` entre 5 y 95. Al aplicar una formación se reemplazan tanto las coordenadas como las posiciones tácticas de los titulares.
