(() => {
    const STORAGE_KEY = "alineador-tactico-pro-v1";
    const MAX_CAMBIOS = 5;

    // Formaciones Predeterminadas (Coordenadas en % para los 11 titulares)
    const FORMACIONES = {
        "4-3-3": [
            { id: "1", pos: "POR", x: 50, y: 90 },
            { id: "2", pos: "LD",  x: 15, y: 72 },
            { id: "3", pos: "DFC", x: 38, y: 75 },
            { id: "4", pos: "DFC", x: 62, y: 75 },
            { id: "5", pos: "LI",  x: 85, y: 72 },
            { id: "6", pos: "MCD", x: 50, y: 58 },
            { id: "8", pos: "MC",  x: 30, y: 45 },
            { id: "10", pos: "MC", x: 70, y: 45 },
            { id: "7", pos: "ED",  x: 82, y: 22 },
            { id: "9", pos: "DC",  x: 50, y: 18 },
            { id: "11", pos: "EI", x: 18, y: 22 }
        ],
        "4-4-2": [
            { id: "1", pos: "POR", x: 50, y: 90 },
            { id: "2", pos: "LD",  x: 15, y: 72 },
            { id: "3", pos: "DFC", x: 38, y: 75 },
            { id: "4", pos: "DFC", x: 62, y: 75 },
            { id: "5", pos: "LI",  x: 85, y: 72 },
            { id: "7", pos: "MD",  x: 15, y: 46 },
            { id: "6", pos: "MC",  x: 38, y: 50 },
            { id: "8", pos: "MC",  x: 62, y: 50 },
            { id: "11", pos: "MI", x: 85, y: 46 },
            { id: "9", pos: "DC",  x: 38, y: 22 },
            { id: "10", pos: "DC", x: 62, y: 22 }
        ],
        "4-2-3-1": [
            { id: "1", pos: "POR", x: 50, y: 90 },
            { id: "2", pos: "LD",  x: 15, y: 72 },
            { id: "3", pos: "DFC", x: 38, y: 75 },
            { id: "4", pos: "DFC", x: 62, y: 75 },
            { id: "5", pos: "LI",  x: 85, y: 72 },
            { id: "6", pos: "MCD", x: 36, y: 58 },
            { id: "8", pos: "MCD", x: 64, y: 58 },
            { id: "7", pos: "MCO", x: 80, y: 38 },
            { id: "10", pos: "MCO", x: 50, y: 38 },
            { id: "11", pos: "MCO", x: 20, y: 38 },
            { id: "9", pos: "DC",  x: 50, y: 18 }
        ],
        "3-5-2": [
            { id: "1", pos: "POR", x: 50, y: 90 },
            { id: "3", pos: "DFC", x: 25, y: 75 },
            { id: "4", pos: "DFC", x: 50, y: 77 },
            { id: "5", pos: "DFC", x: 75, y: 75 },
            { id: "2", pos: "CAD", x: 12, y: 48 },
            { id: "6", pos: "MCD", x: 50, y: 58 },
            { id: "8", pos: "MC",  x: 34, y: 44 },
            { id: "10", pos: "MC", x: 66, y: 44 },
            { id: "7", pos: "CAI", x: 88, y: 48 },
            { id: "9", pos: "DC",  x: 38, y: 20 },
            { id: "11", pos: "DC", x: 62, y: 20 }
        ],
        "5-3-2": [
            { id: "1", pos: "POR", x: 50, y: 90 },
            { id: "2", pos: "CAD", x: 12, y: 68 },
            { id: "3", pos: "DFC", x: 31, y: 75 },
            { id: "4", pos: "LIB", x: 50, y: 78 },
            { id: "5", pos: "DFC", x: 69, y: 75 },
            { id: "7", pos: "CAI", x: 88, y: 68 },
            { id: "6", pos: "MC",  x: 30, y: 50 },
            { id: "8", pos: "MC",  x: 50, y: 53 },
            { id: "10", pos: "MC", x: 70, y: 50 },
            { id: "9", pos: "DC",  x: 38, y: 22 },
            { id: "11", pos: "DC", x: 62, y: 22 }
        ],
        "4-1-4-1": [
            { id: "1", pos: "POR", x: 50, y: 90 },
            { id: "2", pos: "LD",  x: 15, y: 72 },
            { id: "3", pos: "DFC", x: 38, y: 75 },
            { id: "4", pos: "DFC", x: 62, y: 75 },
            { id: "5", pos: "LI",  x: 85, y: 72 },
            { id: "6", pos: "MCD", x: 50, y: 60 },
            { id: "7", pos: "MD",  x: 16, y: 40 },
            { id: "8", pos: "MC",  x: 38, y: 42 },
            { id: "10", pos: "MC", x: 62, y: 42 },
            { id: "11", pos: "MI", x: 84, y: 40 },
            { id: "9", pos: "DC",  x: 50, y: 20 }
        ]
    };

    // Plantillas: las de cada equipo viven en plantillas.js; "blanco" es una plantilla genérica
    const PLANTILLAS = window.PLANTILLAS_EQUIPO || {};
    const PLANTILLA_DEFECTO = "real-madrid";
    const PLANTILLA_BLANCO = "blanco";
    const NUM_JUGADORES = 24;
    const ROLES_BASE = ["POR", "LD", "DFC", "DFC", "LI", "MCD", "ED", "MC", "DC", "MC", "EI"];

    const plantillaEnBlanco = () => Array.from({ length: NUM_JUGADORES }, (_, i) => {
        const numero = i + 1;
        const titular = numero <= 11;
        return {
            numero,
            nombre: titular ? `Jugador ${numero}` : `Suplente ${numero}`,
            pos: titular ? ROLES_BASE[i] : "Suplente",
            esTitular: titular,
            esCapitan: numero === 10,
            puestoId: titular ? String(numero) : null
        };
    });

    const obtenerPlantilla = (id) => {
        const base = id !== PLANTILLA_BLANCO && Object.hasOwn(PLANTILLAS, id)
            ? PLANTILLAS[id]
            : plantillaEnBlanco();
        return JSON.parse(JSON.stringify(base));
    };

    // Catálogo de camisas: los datos viven en camisas.js (agrupados por liga y ordenados)
    const CAMISA_DEFECTO = "real-madrid";
    const CATALOGO_CAMISAS = window.CATALOGO_CAMISAS || [];
    const CAMISAS = {};
    CATALOGO_CAMISAS.forEach(({ grupo, equipos }) => {
        equipos.forEach(equipo => { CAMISAS[equipo.id] = { ...equipo, grupo }; });
    });
    if (!Object.hasOwn(CAMISAS, CAMISA_DEFECTO)) {
        // Respaldo por si camisas.js no se cargó
        const respaldo = {
            id: CAMISA_DEFECTO, nombre: "Real Madrid", patron: "solido", c1: "#ffffff",
            texto: "#1b2a5c", borde: "#d4af37", portero: "#1a1a1a", porteroTexto: "#ffffff"
        };
        CAMISAS[CAMISA_DEFECTO] = { ...respaldo, grupo: "Clubes" };
        CATALOGO_CAMISAS.push({ grupo: "Clubes", equipos: [respaldo] });
    }


    const fondoCamisa = (c) => {
        switch (c.patron) {
            case "rayas":
                return `linear-gradient(90deg, ${c.c1} 0 20%, ${c.c2} 20% 40%, ${c.c1} 40% 60%, ${c.c2} 60% 80%, ${c.c1} 80%)`;
            case "aros":
                return `linear-gradient(${c.c1} 0 20%, ${c.c2} 20% 40%, ${c.c1} 40% 60%, ${c.c2} 60% 80%, ${c.c1} 80%)`;
            case "banda":
                return `linear-gradient(${c.c1} 0 30%, ${c.c2} 30% 70%, ${c.c1} 70%)`;
            case "franja":
                return `linear-gradient(135deg, ${c.c1} 0 38%, ${c.c2} 38% 62%, ${c.c1} 62%)`;
            default:
                return c.c1;
        }
    };

    // Estado
    let plantillaActual = PLANTILLA_DEFECTO;
    let jugadores = obtenerPlantilla(plantillaActual);
    let formacionActual = "4-3-3";
    let camisaActual = CAMISA_DEFECTO;
    let cambiosRealizados = 0;
    let historialCambios = [];
    let seleccionadoTitular = null;
    let seleccionadoBanca = null;
    let arrastre = null;
    let tickFrame = null;
    let almacenamientoInvalido = false;

    // DOM
    const cancha = document.getElementById("cancha");
    const bancaGrid = document.getElementById("bancaGrid");
    const selectFormacion = document.getElementById("selectFormacion");
    const selectLiga = document.getElementById("selectLiga");
    const selectCamisa = document.getElementById("selectCamisa");
    const textoPlantilla = document.getElementById("textoPlantilla");
    const btnPlantillaEquipo = document.getElementById("btnPlantillaEquipo");
    const btnPlantillaBlanco = document.getElementById("btnPlantillaBlanco");
    const formulario = document.getElementById("formulario");
    const nombreInput = document.getElementById("nombreJugador");
    const posicionInput = document.getElementById("posicionJugador");
    const guardarBtn = document.getElementById("guardar");
    const btnSustituir = document.getElementById("btnSustituir");
    const btnCapitan = document.getElementById("btnCapitan");
    const restablecerBtn = document.getElementById("restablecer");
    const contadorCambios = document.getElementById("contador-cambios");
    const estado = document.getElementById("estado");
    const tituloEsquema = document.getElementById("titulo-esquema");

    const guardarStorage = () => {
        const data = {
            jugadores,
            formacionActual,
            camisa: camisaActual,
            plantilla: plantillaActual,
            cambiosRealizados,
            historialCambios
        };
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
            estado.textContent = "Datos guardados automáticamente.";
        } catch (e) {
            estado.textContent = "Error al guardar en almacenamiento local.";
        }
    };

    const limpiarTexto = (valor, alternativa, maximo) => {
        if (typeof valor !== "string") return alternativa;
        return valor.trim().slice(0, maximo) || alternativa;
    };

    const validarDatosGuardados = (data) => {
        if (!data || typeof data !== "object" || !Array.isArray(data.jugadores)) {
            return null;
        }

        if (data.jugadores.length !== NUM_JUGADORES) return null;

        const dorsales = new Set();
        const jugadoresValidos = [];

        for (const jugador of data.jugadores) {
            if (!jugador || typeof jugador !== "object") return null;

            const numero = Number(jugador.numero);
            if (!Number.isInteger(numero) || numero < 1 || numero > 99 || dorsales.has(numero)) {
                return null;
            }
            dorsales.add(numero);

            const x = Number(jugador.x);
            const y = Number(jugador.y);
            jugadoresValidos.push({
                numero,
                nombre: limpiarTexto(jugador.nombre, `Jugador ${numero}`, 20),
                pos: limpiarTexto(jugador.pos, "Sin posición", 15),
                esTitular: jugador.esTitular === true,
                esCapitan: jugador.esCapitan === true,
                puestoId: typeof jugador.puestoId === "string" ? jugador.puestoId : null,
                ...(Number.isFinite(x) ? { x: Math.max(6, Math.min(94, x)) } : {}),
                ...(Number.isFinite(y) ? { y: Math.max(5, Math.min(95, y)) } : {})
            });
        }

        const titulares = jugadoresValidos.filter(jugador => jugador.esTitular);
        if (titulares.length !== 11) return null;

        const capitanes = jugadoresValidos.filter(jugador => jugador.esCapitan);
        if (capitanes.length !== 1 || !capitanes[0].esTitular) {
            jugadoresValidos.forEach(jugador => { jugador.esCapitan = false; });
            titulares[0].esCapitan = true;
        }

        const formacion = Object.hasOwn(FORMACIONES, data.formacionActual)
            ? data.formacionActual
            : "4-3-3";

        const historial = Array.isArray(data.historialCambios)
            ? data.historialCambios
                .filter(cambio => {
                    if (!cambio || typeof cambio !== "object") return false;
                    return Number.isInteger(cambio.sale)
                        && Number.isInteger(cambio.entra)
                        && cambio.sale !== cambio.entra
                        && dorsales.has(cambio.sale)
                        && dorsales.has(cambio.entra);
                })
                .slice(0, MAX_CAMBIOS)
                .map(cambio => ({
                    sale: cambio.sale,
                    entra: cambio.entra,
                    puestoId: typeof cambio.puestoId === "string" ? cambio.puestoId : null
                }))
            : [];

        const contador = Number.isInteger(data.cambiosRealizados)
            ? Math.max(0, Math.min(MAX_CAMBIOS, data.cambiosRealizados))
            : 0;

        return {
            jugadores: jugadoresValidos,
            formacionActual: formacion,
            camisa: Object.hasOwn(CAMISAS, data.camisa) ? data.camisa : CAMISA_DEFECTO,
            plantilla: data.plantilla === PLANTILLA_BLANCO || Object.hasOwn(PLANTILLAS, data.plantilla)
                ? data.plantilla
                : PLANTILLA_DEFECTO,
            cambiosRealizados: Math.max(contador, historial.length),
            historialCambios: historial
        };
    };

    const cargarStorage = () => {
        try {
            const contenido = localStorage.getItem(STORAGE_KEY);
            if (!contenido) return;

            const data = validarDatosGuardados(JSON.parse(contenido));
            if (!data) {
                almacenamientoInvalido = true;
                return;
            }

            jugadores = data.jugadores;
            formacionActual = data.formacionActual;
            camisaActual = data.camisa;
            plantillaActual = data.plantilla;
            cambiosRealizados = data.cambiosRealizados;
            historialCambios = data.historialCambios;
        } catch (e) {
            almacenamientoInvalido = true;
        }
    };

    const normalizarPuestosTacticos = () => {
        const idsPuestos = FORMACIONES[formacionActual].map(puesto => puesto.id);
        const titulares = jugadores.filter(jugador => jugador.esTitular);
        const puestosActuales = titulares.map(jugador => jugador.puestoId);
        const asignacionValida = titulares.length === 11
            && puestosActuales.every(id => idsPuestos.includes(id))
            && new Set(puestosActuales).size === 11;

        if (asignacionValida) {
            jugadores
                .filter(jugador => !jugador.esTitular)
                .forEach(jugador => { jugador.puestoId = null; });
            return;
        }

        // Migración para alineaciones guardadas antes de incorporar puestos estables.
        jugadores.forEach(jugador => { jugador.puestoId = null; });
        idsPuestos.forEach(id => {
            const titularOriginal = jugadores.find(jugador => String(jugador.numero) === id);
            if (titularOriginal) titularOriginal.puestoId = id;
        });

        historialCambios.forEach(cambio => {
            const sale = jugadores.find(jugador => jugador.numero === cambio.sale);
            const entra = jugadores.find(jugador => jugador.numero === cambio.entra);
            if (!sale || !entra || !sale.puestoId) return;

            entra.puestoId = sale.puestoId;
            sale.puestoId = null;
        });

        const puestosOcupados = new Set(
            titulares.map(jugador => jugador.puestoId).filter(Boolean)
        );
        const puestosLibres = idsPuestos.filter(id => !puestosOcupados.has(id));

        titulares.forEach(jugador => {
            if (!jugador.puestoId) jugador.puestoId = puestosLibres.shift();
        });

        jugadores
            .filter(jugador => !jugador.esTitular)
            .forEach(jugador => { jugador.puestoId = null; });
    };

    const asignarCapitan = (jugador) => {
        if (!jugador.esTitular) return;

        jugadores.forEach(j => j.esCapitan = false);
        jugador.esCapitan = true;
        estado.textContent = `${jugador.nombre} es el nuevo Capitán (C).`;
        guardarStorage();
        renderizarCancha();
        renderizarBanca();
        actualizarPanelFormulario();
    };

    const aplicarCamisa = (id) => {
        const camisa = CAMISAS[id] || CAMISAS[CAMISA_DEFECTO];
        const raiz = document.documentElement.style;
        raiz.setProperty("--camisa-fondo", fondoCamisa(camisa));
        raiz.setProperty("--camisa-texto", camisa.texto);
        raiz.setProperty("--camisa-borde", camisa.borde);
        raiz.setProperty("--camisa-num-fondo", camisa.numFondo || "transparent");
        raiz.setProperty("--portero-fondo", camisa.portero);
        raiz.setProperty("--portero-texto", camisa.porteroTexto);
    };

    const indiceLigaDeCamisa = (id) => {
        const indice = CATALOGO_CAMISAS.findIndex(({ equipos }) => equipos.some(e => e.id === id));
        return indice >= 0 ? indice : 0;
    };

    const poblarSelectLiga = () => {
        const opciones = CATALOGO_CAMISAS.map(({ grupo }, indice) => {
            const opcion = document.createElement("option");
            opcion.value = String(indice);
            opcion.textContent = grupo;
            return opcion;
        });
        selectLiga.replaceChildren(...opciones);
    };

    // Llena el selector de equipos con los de la liga indicada (ya vienen ordenados A-Z)
    const poblarSelectEquipos = (indiceLiga) => {
        const liga = CATALOGO_CAMISAS[indiceLiga];
        if (!liga) return;
        const opciones = liga.equipos.map(equipo => {
            const opcion = document.createElement("option");
            opcion.value = equipo.id;
            opcion.textContent = equipo.nombre;
            return opcion;
        });
        selectCamisa.replaceChildren(...opciones);
    };

    const cambiarLiga = (indiceLiga) => {
        const liga = CATALOGO_CAMISAS[Number(indiceLiga)];
        if (!liga) return;
        poblarSelectEquipos(Number(indiceLiga));
        // Al cambiar de liga se aplica el primer equipo de la lista para que el cambio sea visible
        cambiarCamisa(liga.equipos[0].id);
    };

    const nombrePlantilla = (id) =>
        id === PLANTILLA_BLANCO ? "En blanco" : (CAMISAS[id]?.nombre || id);

    const actualizarPanelPlantilla = () => {
        const equipoCamisa = CAMISAS[camisaActual]?.nombre || "";
        const hayPlantilla = Object.hasOwn(PLANTILLAS, camisaActual);
        const noCoincide = plantillaActual !== PLANTILLA_BLANCO && plantillaActual !== camisaActual;

        textoPlantilla.textContent = `Plantilla actual: ${nombrePlantilla(plantillaActual)}.`
            + (noCoincide ? " No coincide con la camisa elegida." : "");
        textoPlantilla.classList.toggle("desajuste", noCoincide);

        btnPlantillaEquipo.disabled = !hayPlantilla;
        btnPlantillaEquipo.textContent = hayPlantilla
            ? `Cargar plantilla de ${equipoCamisa}`
            : `Sin plantilla guardada de ${equipoCamisa}`;
    };

    const cargarPlantilla = (id) => {
        jugadores = obtenerPlantilla(id);
        plantillaActual = id;
        cambiosRealizados = 0;
        historialCambios = [];
        seleccionadoTitular = null;
        seleccionadoBanca = null;
        // Reubica a los titulares según la formación actual, guarda y vuelve a dibujar todo
        cambiarFormacion(formacionActual);
        actualizarPanelPlantilla();
        estado.textContent = id === PLANTILLA_BLANCO
            ? "Plantilla en blanco cargada: edita cada jugador para poner tus nombres."
            : `Plantilla de ${nombrePlantilla(id)} cargada.`;
    };

    const cambiarCamisa = (id) => {
        if (!Object.hasOwn(CAMISAS, id)) return;
        camisaActual = id;
        selectCamisa.value = id;
        aplicarCamisa(id);
        guardarStorage();
        estado.textContent = `Camisa de ${CAMISAS[id].nombre} aplicada.`;
        actualizarPanelPlantilla();
    };

    const renderizarBanca = () => {
        bancaGrid.replaceChildren();
        const suplentes = jugadores.filter(j => !j.esTitular);

        suplentes.forEach(jugador => {
            const item = document.createElement("button");
            item.type = "button";
            item.className = `banca-item ${seleccionadoBanca === jugador ? 'seleccionado' : ''}`;
            item.dataset.numero = jugador.numero;
            item.setAttribute("aria-pressed", seleccionadoBanca === jugador ? "true" : "false");
            item.setAttribute("aria-label", `Suplente ${jugador.numero}, ${jugador.nombre}, ${jugador.pos}`);

            const dorsal = document.createElement("div");
            dorsal.className = "banca-dorsal";
            dorsal.textContent = jugador.numero;

            const info = document.createElement("div");
            info.className = "banca-info";

            const nombre = document.createElement("div");
            nombre.className = "banca-nombre";
            nombre.append(document.createTextNode(jugador.nombre));
            if (jugador.esCapitan) {
                const marcaCapitan = document.createElement("strong");
                marcaCapitan.className = "marca-capitan";
                marcaCapitan.textContent = " (C)";
                nombre.append(marcaCapitan);
            }

            const posicion = document.createElement("div");
            posicion.className = "banca-pos";
            posicion.textContent = jugador.pos;

            info.append(nombre, posicion);
            item.append(dorsal, info);

            item.addEventListener("click", () => {
                seleccionadoBanca = (seleccionadoBanca === jugador) ? null : jugador;
                renderizarBanca();
                actualizarPanelFormulario();
            });

            bancaGrid.appendChild(item);
        });
    };

    const renderizarCancha = () => {
        cancha.querySelectorAll(".jugador").forEach(el => el.remove());

        const titulares = jugadores.filter(j => j.esTitular);
        const coordsDefecto = FORMACIONES[formacionActual];

        titulares.forEach((jugador, idx) => {
            const def = coordsDefecto.find(puesto => puesto.id === jugador.puestoId)
                || coordsDefecto[idx]
                || { x: 50, y: 50, pos: "MC" };
            
            const x = jugador.x !== undefined ? jugador.x : def.x;
            const y = jugador.y !== undefined ? jugador.y : def.y;
            jugador.x = x;
            jugador.y = y;

            const el = document.createElement("button");
            el.type = "button";
            el.className = `jugador ${jugador.pos === 'POR' ? 'portero' : ''} ${seleccionadoTitular === jugador ? 'seleccionado' : ''}`;
            el.dataset.numero = jugador.numero;
            el.style.left = `${x}%`;
            el.style.top = `${y}%`;
            el.setAttribute("aria-pressed", seleccionadoTitular === jugador ? "true" : "false");
            el.setAttribute(
                "aria-label",
                `Titular ${jugador.numero}, ${jugador.nombre}, ${jugador.pos}${jugador.esCapitan ? ", capitán" : ""}`
            );

            const fueCambiado = historialCambios.some(h => h.entra === jugador.numero);

            const ficha = document.createElement("div");
            ficha.className = "ficha";
            const dorsalNum = document.createElement("span");
            dorsalNum.className = "dorsal-num";
            dorsalNum.textContent = jugador.numero;
            ficha.append(dorsalNum);
            if (fueCambiado) {
                const indicador = document.createElement("span");
                indicador.className = "indicador-sub";
                indicador.textContent = "▲";
                ficha.append(indicador);
            }

            const nombre = document.createElement("div");
            nombre.className = "nombre";
            nombre.append(document.createTextNode(jugador.nombre));
            if (jugador.esCapitan) {
                const marcaCapitan = document.createElement("span");
                marcaCapitan.className = "marca-capitan";
                marcaCapitan.textContent = " (C)";
                nombre.append(marcaCapitan);
            }

            el.append(ficha, nombre);

            vincularEventosArrastre(el, jugador);
            cancha.appendChild(el);
        });
    };

    const actualizarPanelFormulario = () => {
        const activo = seleccionadoTitular || seleccionadoBanca;

        if (activo) {
            nombreInput.disabled = false;
            posicionInput.disabled = false;
            guardarBtn.disabled = false;
            nombreInput.value = activo.nombre;
            posicionInput.value = activo.pos;

            if (!activo.esTitular) {
                btnCapitan.disabled = true;
                btnCapitan.textContent = "El capitán debe ser titular";
            } else if (activo.esCapitan) {
                btnCapitan.disabled = true;
                btnCapitan.textContent = "Capitán actual (C)";
            } else {
                btnCapitan.disabled = false;
                btnCapitan.textContent = "Asignar Capitán";
            }
        } else {
            nombreInput.disabled = true;
            posicionInput.disabled = true;
            guardarBtn.disabled = true;
            btnCapitan.disabled = true;
            nombreInput.value = "";
            posicionInput.value = "";
            btnCapitan.textContent = "Asignar Capitán";
        }

        const puedeSustituir = seleccionadoTitular && seleccionadoBanca && cambiosRealizados < MAX_CAMBIOS;
        btnSustituir.disabled = !puedeSustituir;
        btnSustituir.textContent = `Sustituir #${seleccionadoTitular?.numero || '?'} por #${seleccionadoBanca?.numero || '?'}`;
        contadorCambios.textContent = `${cambiosRealizados} / ${MAX_CAMBIOS}`;
    };

    const efectuarSustitucion = () => {
        if (!seleccionadoTitular || !seleccionadoBanca || cambiosRealizados >= MAX_CAMBIOS) return;

        seleccionadoBanca.puestoId = seleccionadoTitular.puestoId;
        seleccionadoTitular.puestoId = null;
        seleccionadoBanca.pos = seleccionadoTitular.pos;
        seleccionadoTitular.esTitular = false;
        seleccionadoBanca.esTitular = true;

        seleccionadoBanca.x = seleccionadoTitular.x;
        seleccionadoBanca.y = seleccionadoTitular.y;

        // Si sale el capitán, pasar el brazalete al que entra
        if (seleccionadoTitular.esCapitan) {
            seleccionadoTitular.esCapitan = false;
            seleccionadoBanca.esCapitan = true;
            estado.textContent = `Cambio y brazalete: ${seleccionadoBanca.nombre} pasa a ser el Capitán.`;
        }

        historialCambios.push({
            sale: seleccionadoTitular.numero,
            entra: seleccionadoBanca.numero,
            puestoId: seleccionadoBanca.puestoId
        });

        cambiosRealizados++;

        seleccionadoTitular = null;
        seleccionadoBanca = null;

        guardarStorage();
        renderizarCancha();
        renderizarBanca();
        actualizarPanelFormulario();
    };

    const posicionarElemento = (el, x, y) => {
        const limX = Math.max(6, Math.min(94, x));
        const limY = Math.max(5, Math.min(95, y));
        el.style.left = `${limX}%`;
        el.style.top = `${limY}%`;
        return { x: limX, y: limY };
    };

    const actualizarSeleccionCancha = () => {
        cancha.querySelectorAll(".jugador").forEach(el => {
            const numero = Number(el.dataset.numero);
            el.classList.toggle(
                "seleccionado",
                seleccionadoTitular?.numero === numero
            );
            el.setAttribute(
                "aria-pressed",
                seleccionadoTitular?.numero === numero ? "true" : "false"
            );
        });
    };

    const aplicarPosicionPendiente = () => {
        if (!arrastre || arrastre.x === null || arrastre.y === null) return;

        const pos = posicionarElemento(arrastre.el, arrastre.x, arrastre.y);
        arrastre.jugador.x = pos.x;
        arrastre.jugador.y = pos.y;
    };

    const vincularEventosArrastre = (el, jugador) => {
        el.addEventListener("keydown", (e) => {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                seleccionadoTitular = seleccionadoTitular === jugador ? null : jugador;
                actualizarSeleccionCancha();
                actualizarPanelFormulario();
                return;
            }

            const desplazamientos = {
                ArrowLeft: [-1, 0],
                ArrowRight: [1, 0],
                ArrowUp: [0, -1],
                ArrowDown: [0, 1]
            };
            const direccion = desplazamientos[e.key];
            if (!direccion) return;

            e.preventDefault();
            seleccionadoTitular = jugador;
            actualizarSeleccionCancha();
            actualizarPanelFormulario();

            // 1% en X no mide lo mismo que 1% en Y; se compensa para que el paso sea igual en pantalla
            const rect = cancha.getBoundingClientRect();
            const paso = e.shiftKey ? 5 : 1;
            const pasoX = paso * (rect.height / rect.width);
            const pos = posicionarElemento(
                el,
                jugador.x + (direccion[0] * pasoX),
                jugador.y + (direccion[1] * paso)
            );
            jugador.x = pos.x;
            jugador.y = pos.y;
            guardarStorage();
            estado.textContent = `${jugador.nombre} movido a ${Math.round(pos.x)}%, ${Math.round(pos.y)}%.`;
        });

        el.addEventListener("pointerdown", (e) => {
            if (e.button !== 0) return;

            e.preventDefault();
            e.stopPropagation();
            el.focus({ preventScroll: true });

            const yaEstabaSeleccionado = seleccionadoTitular === jugador;
            seleccionadoTitular = jugador;
            actualizarSeleccionCancha();
            actualizarPanelFormulario();

            const rectInicio = cancha.getBoundingClientRect();
            const punteroX = ((e.clientX - rectInicio.left) / rectInicio.width) * 100;
            const punteroY = ((e.clientY - rectInicio.top) / rectInicio.height) * 100;

            el.classList.add("arrastrando");
            el.setPointerCapture(e.pointerId);
            arrastre = {
                el,
                jugador,
                pointerId: e.pointerId,
                inicioX: e.clientX,
                inicioY: e.clientY,
                // Distancia entre el centro de la ficha y el punto exacto donde se agarró
                desfaseX: jugador.x - punteroX,
                desfaseY: jugador.y - punteroY,
                x: null,
                y: null,
                movido: false,
                yaEstabaSeleccionado
            };
        });

        el.addEventListener("pointermove", (e) => {
            if (!arrastre || arrastre.pointerId !== e.pointerId) return;

            const distancia = Math.hypot(
                e.clientX - arrastre.inicioX,
                e.clientY - arrastre.inicioY
            );

            if (!arrastre.movido && distancia < 4) return;
            arrastre.movido = true;

            const rect = cancha.getBoundingClientRect();
            arrastre.x = ((e.clientX - rect.left) / rect.width) * 100 + arrastre.desfaseX;
            arrastre.y = ((e.clientY - rect.top) / rect.height) * 100 + arrastre.desfaseY;

            if (!tickFrame) {
                tickFrame = requestAnimationFrame(() => {
                    aplicarPosicionPendiente();
                    tickFrame = null;
                });
            }
        });

        const finalizarArrastre = (e) => {
            if (!arrastre || arrastre.pointerId !== e.pointerId) return;

            const { movido, yaEstabaSeleccionado } = arrastre;

            if (tickFrame) {
                cancelAnimationFrame(tickFrame);
                tickFrame = null;
                aplicarPosicionPendiente();
            }

            el.classList.remove("arrastrando");
            arrastre = null;

            if (movido) {
                guardarStorage();
            } else {
                seleccionadoTitular = yaEstabaSeleccionado ? null : jugador;
                actualizarSeleccionCancha();
                actualizarPanelFormulario();
            }
        };

        el.addEventListener("pointerup", finalizarArrastre);
        el.addEventListener("pointercancel", finalizarArrastre);
    };

    const cambiarFormacion = (nuevaFormacion) => {
        formacionActual = nuevaFormacion;
        tituloEsquema.textContent = `Alineación ${nuevaFormacion}`;
        selectFormacion.value = nuevaFormacion;

        const coords = FORMACIONES[nuevaFormacion];
        const titulares = jugadores.filter(j => j.esTitular);

        titulares.forEach(jugador => {
            const puesto = coords.find(coord => coord.id === jugador.puestoId);
            if (puesto) {
                jugador.x = puesto.x;
                jugador.y = puesto.y;
                jugador.pos = puesto.pos;
            }
        });

        guardarStorage();
        renderizarCancha();
        renderizarBanca();
        actualizarPanelFormulario();
    };

    const init = () => {
        cargarStorage();
        normalizarPuestosTacticos();
        
        const ligaInicial = indiceLigaDeCamisa(camisaActual);
        poblarSelectLiga();
        selectLiga.value = String(ligaInicial);
        poblarSelectEquipos(ligaInicial);
        selectCamisa.value = camisaActual;
        aplicarCamisa(camisaActual);
        actualizarPanelPlantilla();

        selectFormacion.value = formacionActual;
        tituloEsquema.textContent = `Alineación ${formacionActual}`;

        renderizarCancha();
        renderizarBanca();
        actualizarPanelFormulario();

        if (almacenamientoInvalido) {
            estado.textContent = "Los datos guardados no eran válidos; se cargó una plantilla segura.";
        }

        selectFormacion.addEventListener("change", (e) => cambiarFormacion(e.target.value));
        selectLiga.addEventListener("change", (e) => cambiarLiga(e.target.value));
        selectCamisa.addEventListener("change", (e) => cambiarCamisa(e.target.value));

        formulario.addEventListener("submit", (e) => {
            e.preventDefault();
            const activo = seleccionadoTitular || seleccionadoBanca;
            if (activo) {
                activo.nombre = limpiarTexto(nombreInput.value, activo.nombre, 20);
                activo.pos = limpiarTexto(posicionInput.value, activo.pos, 15);
                guardarStorage();
                renderizarCancha();
                renderizarBanca();
                actualizarPanelFormulario();
                estado.textContent = "Datos del jugador actualizados.";
            }
        });

        btnCapitan.addEventListener("click", () => {
            const activo = seleccionadoTitular || seleccionadoBanca;
            if (activo?.esTitular) {
                asignarCapitan(activo);
            }
        });

        btnSustituir.addEventListener("click", efectuarSustitucion);

        btnPlantillaEquipo.addEventListener("click", () => {
            if (!Object.hasOwn(PLANTILLAS, camisaActual)) return;
            if (confirm(`Se cargará la plantilla de ${nombrePlantilla(camisaActual)}. Se reemplazarán los nombres, los cambios realizados y el capitán. ¿Continuar?`)) {
                cargarPlantilla(camisaActual);
            }
        });

        btnPlantillaBlanco.addEventListener("click", () => {
            if (confirm("Se cargará una plantilla en blanco. Se reemplazarán los nombres, los cambios realizados y el capitán. ¿Continuar?")) {
                cargarPlantilla(PLANTILLA_BLANCO);
            }
        });

        restablecerBtn.addEventListener("click", () => {
            if (confirm("¿Deseas restablecer la plantilla, los 5 cambios y la formación original?")) {
                jugadores = obtenerPlantilla(plantillaActual);
                cambiosRealizados = 0;
                historialCambios = [];
                seleccionadoTitular = null;
                seleccionadoBanca = null;
                normalizarPuestosTacticos();
                cambiarFormacion("4-3-3");
                estado.textContent = "Alineación y capitán restablecidos por defecto.";
            }
        });
    };

    init();
})();