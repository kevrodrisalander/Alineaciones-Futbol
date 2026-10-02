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

    // Plantilla Inicial con propiedad esCapitan
    const PLANTILLA_INICIAL = [
        { numero: 1, nombre: "Courtois", pos: "POR", esTitular: true, esCapitan: false },
        { numero: 2, nombre: "Carvajal", pos: "LD", esTitular: true, esCapitan: false },
        { numero: 3, nombre: "E. Militao", pos: "DFC", esTitular: true, esCapitan: false },
        { numero: 4, nombre: "Alaba", pos: "DFC", esTitular: true, esCapitan: false },
        { numero: 5, nombre: "Mendy", pos: "LI", esTitular: true, esCapitan: false },
        { numero: 6, nombre: "Camavinga", pos: "MCD", esTitular: true, esCapitan: false },
        { numero: 7, pos: "ED", nombre: "Rodrygo", esTitular: true, esCapitan: false },
        { numero: 8, pos: "MC", nombre: "Kroos", esTitular: true, esCapitan: false },
        { numero: 9, pos: "DC", nombre: "Mbappé", esTitular: true, esCapitan: false },
        { numero: 10, pos: "MC", nombre: "Modrić", esTitular: true, esCapitan: true }, // Capitán por defecto
        { numero: 11, pos: "EI", nombre: "Vinicius Jr.", esTitular: true, esCapitan: false },

        { numero: 12, nombre: "Lunin", pos: "POR Suplente", esTitular: false, esCapitan: false },
        { numero: 13, nombre: "Kepa", pos: "POR Suplente", esTitular: false, esCapitan: false },
        { numero: 14, nombre: "Nacho", pos: "Central / Def.", esTitular: false, esCapitan: false },
        { numero: 15, nombre: "Rüdiger", pos: "Central / Def.", esTitular: false, esCapitan: false },
        { numero: 16, nombre: "Fran García", pos: "Lateral Izq.", esTitular: false, esCapitan: false },
        { numero: 17, nombre: "Lucas V.", pos: "Lateral / Volante", esTitular: false, esCapitan: false },
        { numero: 18, nombre: "Tchouaméni", pos: "Pivote / Def.", esTitular: false, esCapitan: false },
        { numero: 19, nombre: "Ceballos", pos: "Mediocampista", esTitular: false, esCapitan: false },
        { numero: 20, nombre: "Valverde", pos: "Interior / Ext.", esTitular: false, esCapitan: false },
        { numero: 21, nombre: "Brahim", pos: "Mediapunta", esTitular: false, esCapitan: false },
        { numero: 22, nombre: "Arda Güler", pos: "Mediapunta", esTitular: false, esCapitan: false },
        { numero: 23, nombre: "Joselu", pos: "Delantero", esTitular: false, esCapitan: false },
        { numero: 24, nombre: "Endrick", pos: "Delantero", esTitular: false, esCapitan: false }
    ];

    // Camisas de equipos (colores aproximados de la equipación titular)
    // patron: solido | rayas | banda | franja
    const CAMISAS = {
        // Clubes
        "real-madrid":  { nombre: "Real Madrid",     grupo: "Clubes", patron: "solido", c1: "#ffffff", texto: "#1b2a5c", borde: "#d4af37", portero: "#1a1a1a", porteroTexto: "#ffffff" },
        "barcelona":    { nombre: "FC Barcelona",    grupo: "Clubes", patron: "rayas",  c1: "#a50044", c2: "#004d98", texto: "#edbb00", borde: "#edbb00", numFondo: "rgba(0, 20, 60, .72)", portero: "#f2c200", porteroTexto: "#1a1a1a" },
        "atletico":     { nombre: "Atlético de Madrid", grupo: "Clubes", patron: "rayas", c1: "#cb3524", c2: "#ffffff", texto: "#272e61", borde: "#272e61", numFondo: "rgba(255, 255, 255, .9)", portero: "#2ecc71", porteroTexto: "#06210f" },
        "man-city":     { nombre: "Manchester City", grupo: "Clubes", patron: "solido", c1: "#6cabdd", texto: "#ffffff", borde: "#ffffff", portero: "#1c2c5b", porteroTexto: "#ffffff" },
        "man-united":   { nombre: "Manchester United", grupo: "Clubes", patron: "solido", c1: "#da291c", texto: "#fbe122", borde: "#fbe122", portero: "#1a1a1a", porteroTexto: "#ffffff" },
        "liverpool":    { nombre: "Liverpool",       grupo: "Clubes", patron: "solido", c1: "#c8102e", texto: "#ffffff", borde: "#f6eb61", portero: "#f5c400", porteroTexto: "#1a1a1a" },
        "arsenal":      { nombre: "Arsenal",         grupo: "Clubes", patron: "solido", c1: "#ef0107", texto: "#ffffff", borde: "#ffffff", portero: "#2b2b2b", porteroTexto: "#ffffff" },
        "chelsea":      { nombre: "Chelsea",         grupo: "Clubes", patron: "solido", c1: "#034694", texto: "#ffffff", borde: "#dba111", portero: "#f5c400", porteroTexto: "#1a1a1a" },
        "bayern":       { nombre: "Bayern Múnich",   grupo: "Clubes", patron: "solido", c1: "#dc052d", texto: "#ffffff", borde: "#0066b2", portero: "#1a1a1a", porteroTexto: "#ffffff" },
        "dortmund":     { nombre: "Borussia Dortmund", grupo: "Clubes", patron: "solido", c1: "#fde100", texto: "#111111", borde: "#111111", portero: "#d81e5b", porteroTexto: "#ffffff" },
        "psg":          { nombre: "Paris Saint-Germain", grupo: "Clubes", patron: "solido", c1: "#004170", texto: "#ffffff", borde: "#da291c", portero: "#f5c400", porteroTexto: "#1a1a1a" },
        "juventus":     { nombre: "Juventus",        grupo: "Clubes", patron: "rayas",  c1: "#ffffff", c2: "#111111", texto: "#ffffff", borde: "#ffffff", numFondo: "rgba(17, 17, 17, .88)", portero: "#ff7a00", porteroTexto: "#1a1a1a" },
        "milan":        { nombre: "AC Milan",        grupo: "Clubes", patron: "rayas",  c1: "#fb090b", c2: "#111111", texto: "#ffffff", borde: "#ffffff", numFondo: "rgba(0, 0, 0, .6)", portero: "#2ecc71", porteroTexto: "#06210f" },
        "inter":        { nombre: "Inter de Milán",  grupo: "Clubes", patron: "rayas",  c1: "#0068a8", c2: "#111111", texto: "#ffffff", borde: "#c9a227", numFondo: "rgba(0, 0, 0, .6)", portero: "#f5c400", porteroTexto: "#1a1a1a" },
        "boca":         { nombre: "Boca Juniors",    grupo: "Clubes", patron: "banda",  c1: "#0b3a8c", c2: "#f7c600", texto: "#0b2a6b", borde: "#f7c600", portero: "#1a1a1a", porteroTexto: "#ffffff" },
        "river":        { nombre: "River Plate",     grupo: "Clubes", patron: "franja", c1: "#ffffff", c2: "#e30613", texto: "#ffffff", borde: "#e30613", numFondo: "rgba(0, 0, 0, .6)", portero: "#1a1a1a", porteroTexto: "#ffffff" },
        "america":      { nombre: "Club América",    grupo: "Clubes", patron: "solido", c1: "#ffd400", texto: "#0a2a6b", borde: "#0a2a6b", portero: "#1a1a1a", porteroTexto: "#ffffff" },
        "chivas":       { nombre: "Chivas",          grupo: "Clubes", patron: "rayas",  c1: "#d81e2b", c2: "#ffffff", texto: "#0a2a6b", borde: "#0a2a6b", numFondo: "rgba(255, 255, 255, .92)", portero: "#2ecc71", porteroTexto: "#06210f" },
        "cruz-azul":    { nombre: "Cruz Azul",       grupo: "Clubes", patron: "solido", c1: "#1b4aa0", texto: "#ffffff", borde: "#ffffff", portero: "#f5c400", porteroTexto: "#1a1a1a" },
        "pumas":        { nombre: "Pumas UNAM",      grupo: "Clubes", patron: "solido", c1: "#0b2d5b", texto: "#d4af37", borde: "#d4af37", portero: "#2ecc71", porteroTexto: "#06210f" },
        // Selecciones
        "mexico":       { nombre: "México",          grupo: "Selecciones", patron: "solido", c1: "#006847", texto: "#ffffff", borde: "#ce1126", portero: "#f5c400", porteroTexto: "#1a1a1a" },
        "argentina":    { nombre: "Argentina",       grupo: "Selecciones", patron: "rayas",  c1: "#75aadb", c2: "#ffffff", texto: "#111111", borde: "#f6b40e", numFondo: "rgba(255, 255, 255, .85)", portero: "#1a1a1a", porteroTexto: "#ffffff" },
        "brasil":       { nombre: "Brasil",          grupo: "Selecciones", patron: "solido", c1: "#fee100", texto: "#009b3a", borde: "#009b3a", portero: "#1d4ed8", porteroTexto: "#ffffff" },
        "espana":       { nombre: "España",          grupo: "Selecciones", patron: "solido", c1: "#aa151b", texto: "#f1bf00", borde: "#f1bf00", portero: "#1a1a1a", porteroTexto: "#ffffff" },
        "alemania":     { nombre: "Alemania",        grupo: "Selecciones", patron: "solido", c1: "#ffffff", texto: "#111111", borde: "#111111", portero: "#2ecc71", porteroTexto: "#06210f" },
        "francia":      { nombre: "Francia",         grupo: "Selecciones", patron: "solido", c1: "#1b2f6b", texto: "#ffffff", borde: "#ed2939", portero: "#f5c400", porteroTexto: "#1a1a1a" },
        "italia":       { nombre: "Italia",          grupo: "Selecciones", patron: "solido", c1: "#0e5fb3", texto: "#ffffff", borde: "#ffffff", portero: "#1a1a1a", porteroTexto: "#ffffff" }
    };
    const CAMISA_DEFECTO = "real-madrid";

    const fondoCamisa = (c) => {
        switch (c.patron) {
            case "rayas":
                return `linear-gradient(90deg, ${c.c1} 0 20%, ${c.c2} 20% 40%, ${c.c1} 40% 60%, ${c.c2} 60% 80%, ${c.c1} 80%)`;
            case "banda":
                return `linear-gradient(${c.c1} 0 30%, ${c.c2} 30% 70%, ${c.c1} 70%)`;
            case "franja":
                return `linear-gradient(135deg, ${c.c1} 0 38%, ${c.c2} 38% 62%, ${c.c1} 62%)`;
            default:
                return c.c1;
        }
    };

    // Estado
    let jugadores = JSON.parse(JSON.stringify(PLANTILLA_INICIAL));
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
    const selectCamisa = document.getElementById("selectCamisa");
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

        if (data.jugadores.length !== PLANTILLA_INICIAL.length) return null;

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

    const poblarSelectCamisa = () => {
        const grupos = {};
        Object.entries(CAMISAS).forEach(([id, camisa]) => {
            if (!grupos[camisa.grupo]) {
                grupos[camisa.grupo] = document.createElement("optgroup");
                grupos[camisa.grupo].label = camisa.grupo;
            }
            const opcion = document.createElement("option");
            opcion.value = id;
            opcion.textContent = camisa.nombre;
            grupos[camisa.grupo].append(opcion);
        });
        selectCamisa.replaceChildren(...Object.values(grupos));
    };

    const cambiarCamisa = (id) => {
        if (!Object.hasOwn(CAMISAS, id)) return;
        camisaActual = id;
        selectCamisa.value = id;
        aplicarCamisa(id);
        guardarStorage();
        estado.textContent = `Camisa de ${CAMISAS[id].nombre} aplicada.`;
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
    };

    const init = () => {
        cargarStorage();
        normalizarPuestosTacticos();
        
        poblarSelectCamisa();
        selectCamisa.value = camisaActual;
        aplicarCamisa(camisaActual);

        selectFormacion.value = formacionActual;
        tituloEsquema.textContent = `Alineación ${formacionActual}`;

        renderizarCancha();
        renderizarBanca();
        actualizarPanelFormulario();

        if (almacenamientoInvalido) {
            estado.textContent = "Los datos guardados no eran válidos; se cargó una plantilla segura.";
        }

        selectFormacion.addEventListener("change", (e) => cambiarFormacion(e.target.value));
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

        restablecerBtn.addEventListener("click", () => {
            if (confirm("¿Deseas restablecer la plantilla, los 5 cambios y la formación original?")) {
                jugadores = JSON.parse(JSON.stringify(PLANTILLA_INICIAL));
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