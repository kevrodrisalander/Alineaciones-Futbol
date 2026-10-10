(() => {
    "use strict";
    const app = window.Pizarra;

    const STORAGE_KEY = "alineador-tactico-pro-v1";
    const STORAGE_VERSION = 2;
    const MAX_CAMBIOS = 5;

    // Plantillas: las de cada equipo viven en plantillas/; "blanco" es una plantilla genérica
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


    Object.assign(app.config, { STORAGE_KEY, STORAGE_VERSION, MAX_CAMBIOS, PLANTILLAS, PLANTILLA_DEFECTO, PLANTILLA_BLANCO, NUM_JUGADORES, ROLES_BASE, CAMISA_DEFECTO, CATALOGO_CAMISAS, CAMISAS });
    Object.assign(app, { plantillaEnBlanco, obtenerPlantilla });
})();
