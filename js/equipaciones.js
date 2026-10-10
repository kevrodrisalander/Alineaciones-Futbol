(() => {
    "use strict";
    const app = window.Pizarra;

    app.fondoCamisa = (c) => {
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

    app.aplicarCamisa = (id) => {
        const camisa = app.config.CAMISAS[id] || app.config.CAMISAS[app.config.CAMISA_DEFECTO];
        const raiz = document.documentElement.style;
        raiz.setProperty("--camisa-fondo", app.fondoCamisa(camisa));
        raiz.setProperty("--camisa-texto", camisa.texto);
        raiz.setProperty("--camisa-borde", camisa.borde);
        raiz.setProperty("--camisa-num-fondo", camisa.numFondo || "transparent");
        raiz.setProperty("--portero-fondo", camisa.portero);
        raiz.setProperty("--portero-texto", camisa.porteroTexto);
    };

    app.indiceLigaDeCamisa = (id) => {
        const indice = app.config.CATALOGO_CAMISAS.findIndex(({ equipos }) => equipos.some(e => e.id === id));
        return indice >= 0 ? indice : 0;
    };

    app.poblarSelectLiga = () => {
        const opciones = app.config.CATALOGO_CAMISAS.map(({ grupo }, indice) => {
            const opcion = document.createElement("option");
            opcion.value = String(indice);
            opcion.textContent = grupo;
            return opcion;
        });
        app.dom.selectLiga.replaceChildren(...opciones);
    };

    // Llena el selector de equipos con los de la liga indicada (ya vienen ordenados A-Z)

    app.poblarSelectEquipos = (indiceLiga) => {
        const liga = app.config.CATALOGO_CAMISAS[indiceLiga];
        if (!liga) return;
        const opciones = liga.equipos.map(equipo => {
            const opcion = document.createElement("option");
            opcion.value = equipo.id;
            opcion.textContent = equipo.nombre;
            return opcion;
        });
        app.dom.selectCamisa.replaceChildren(...opciones);
    };

    app.cambiarLiga = (indiceLiga) => {
        const liga = app.config.CATALOGO_CAMISAS[Number(indiceLiga)];
        if (!liga) return;
        app.poblarSelectEquipos(Number(indiceLiga));
        // Al cambiar de liga se aplica el primer equipo de la lista para que el cambio sea visible
        app.cambiarCamisa(liga.equipos[0].id);
    };

    app.nombrePlantilla = (id) =>
        id === app.config.PLANTILLA_BLANCO ? "En blanco" : (app.config.CAMISAS[id]?.nombre || id);

    app.cambiarCamisa = (id) => {
        if (!Object.hasOwn(app.config.CAMISAS, id)) return;
        app.datos.camisaActual = id;
        app.dom.selectCamisa.value = id;
        app.aplicarCamisa(id);
        app.guardarStorage(`Camisa de ${app.config.CAMISAS[id].nombre} aplicada.`);
        app.actualizarPanelPlantilla();
    };
})();
