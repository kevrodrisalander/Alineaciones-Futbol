(() => {
    "use strict";
    const app = window.Pizarra;

    app.normalizarPuestosTacticos = () => {
        const idsPuestos = app.config.FORMACIONES[app.datos.formacionActual].map(puesto => puesto.id);
        const titulares = app.datos.jugadores.filter(jugador => jugador.esTitular);
        const puestosActuales = titulares.map(jugador => jugador.puestoId);
        const asignacionValida = titulares.length === 11
            && puestosActuales.every(id => idsPuestos.includes(id))
            && new Set(puestosActuales).size === 11;

        if (asignacionValida) {
            jugadores: app.datos.jugadores
                .filter(jugador => !jugador.esTitular)
                .forEach(jugador => { jugador.puestoId = null; });
            return;
        }

        // Migración para alineaciones guardadas antes de incorporar puestos estables.
        jugadores.forEach(jugador => { jugador.puestoId = null; });
        idsPuestos.forEach(id => {
            const titularOriginal = app.datos.jugadores.find(jugador => String(jugador.numero) === id);
            if (titularOriginal) titularOriginal.puestoId = id;
        });

        app.datos.historialCambios.forEach(cambio => {
            const sale = app.datos.jugadores.find(jugador => jugador.numero === cambio.sale);
            const entra = app.datos.jugadores.find(jugador => jugador.numero === cambio.entra);
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

        jugadores: app.datos.jugadores
            .filter(jugador => !jugador.esTitular)
            .forEach(jugador => { jugador.puestoId = null; });
    };

    app.asignarCapitan = (jugador) => {
        if (!jugador.esTitular) return;

        app.datos.jugadores.forEach(j => j.esCapitan = false);
        jugador.esCapitan = true;
        app.guardarStorage(`${jugador.nombre} es el nuevo Capitán (C).`);
        app.renderizarCancha();
        app.renderizarBanca();
        app.actualizarPanelFormulario();
    };

    app.cargarPlantilla = (id) => {
        app.datos.jugadores = app.obtenerPlantilla(id);
        app.datos.plantillaActual = id;
        app.datos.cambiosRealizados = 0;
        app.datos.historialCambios = [];
        app.datos.seleccionadoTitular = null;
        app.datos.seleccionadoBanca = null;
        app.datos.jugadorEdicion = null;
        // Reubica a los titulares según la formación actual, guarda y vuelve a dibujar todo
        app.cambiarFormacion(app.datos.formacionActual, id === app.config.PLANTILLA_BLANCO
            ? "Plantilla en blanco cargada: edita cada jugador para poner tus nombres."
            : `Plantilla de ${app.nombrePlantilla(id)} cargada.`);
        app.actualizarPanelPlantilla();
    };

    app.efectuarSustitucion = () => {
        if (!app.datos.seleccionadoTitular || !app.datos.seleccionadoBanca || app.datos.cambiosRealizados >= app.config.MAX_CAMBIOS) return;
        let mensaje = "Sustitución realizada.";

        app.datos.seleccionadoBanca.puestoId = app.datos.seleccionadoTitular.puestoId;
        app.datos.seleccionadoTitular.puestoId = null;
        app.datos.seleccionadoBanca.pos = app.datos.seleccionadoTitular.pos;
        app.datos.seleccionadoTitular.esTitular = false;
        app.datos.seleccionadoBanca.esTitular = true;

        app.datos.seleccionadoBanca.x = app.datos.seleccionadoTitular.x;
        app.datos.seleccionadoBanca.y = app.datos.seleccionadoTitular.y;

        // Si sale el capitán, pasar el brazalete al que entra
        if (app.datos.seleccionadoTitular.esCapitan) {
            app.datos.seleccionadoTitular.esCapitan = false;
            app.datos.seleccionadoBanca.esCapitan = true;
            mensaje = `Cambio y brazalete: ${app.datos.seleccionadoBanca.nombre} pasa a ser el Capitán.`;
        }

        app.datos.historialCambios.push({
            sale: app.datos.seleccionadoTitular.numero,
            entra: app.datos.seleccionadoBanca.numero,
            puestoId: app.datos.seleccionadoBanca.puestoId
        });

        app.datos.cambiosRealizados++;

        app.datos.seleccionadoTitular = null;
        app.datos.seleccionadoBanca = null;
        app.datos.jugadorEdicion = null;

        app.guardarStorage(mensaje);
        app.renderizarCancha();
        app.renderizarBanca();
        app.actualizarPanelFormulario();
    };

    app.cambiarFormacion = (nuevaFormacion, mensaje) => {
        app.datos.formacionActual = nuevaFormacion;
        app.dom.tituloEsquema.textContent = `Alineación ${nuevaFormacion}`;
        app.dom.selectFormacion.value = nuevaFormacion;

        const coords = app.config.FORMACIONES[nuevaFormacion];
        const titulares = app.datos.jugadores.filter(j => j.esTitular);

        titulares.forEach(jugador => {
            const puesto = coords.find(coord => coord.id === jugador.puestoId);
            if (puesto) {
                jugador.x = puesto.x;
                jugador.y = puesto.y;
                jugador.pos = puesto.pos;
            }
        });

        const guardado = app.guardarStorage(mensaje);
        app.renderizarCancha();
        app.renderizarBanca();
        app.actualizarPanelFormulario();
        return guardado;
    };
})();
