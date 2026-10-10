(() => {
    "use strict";
    const app = window.Pizarra;

    app.guardarStorage = (mensaje = "Datos guardados automáticamente.") => {
        const data = {
            version: app.config.STORAGE_VERSION,
            jugadores: app.datos.jugadores,
            formacionActual: app.datos.formacionActual,
            camisa: app.datos.camisaActual,
            plantilla: app.datos.plantillaActual,
            cambiosRealizados: app.datos.cambiosRealizados,
            historialCambios: app.datos.historialCambios
        };
        try {
            localStorage.setItem(app.config.STORAGE_KEY, JSON.stringify(data));
            app.dom.estado.textContent = mensaje;
            return true;
        } catch (e) {
            app.dom.estado.textContent = "No se pudo guardar. Los cambios solo están en esta sesión; vuelve a intentar antes de cerrar la página.";
            return false;
        }
    };

    app.limpiarTexto = (valor, alternativa, maximo) => {
        if (typeof valor !== "string") return alternativa;
        return valor.trim().slice(0, maximo) || alternativa;
    };

    app.validarDatosGuardados = (data) => {
        if (!data || typeof data !== "object" || !Array.isArray(data.jugadores)) {
            return null;
        }

        if (data.jugadores.length !== app.config.NUM_JUGADORES) return null;
        const version = data.version === undefined ? 1 : data.version;
        if (version !== 1 && version !== app.config.STORAGE_VERSION) return null;

        const dorsales = new Set();
        const jugadoresValidos = [];

        for (const jugador of data.jugadores) {
            if (!jugador || typeof jugador !== "object") return null;

            const numero = Number(jugador.numero);
            if (!Number.isInteger(numero) || numero < 1 || numero > 99 || dorsales.has(numero)) {
                return null;
            }
            dorsales.add(numero);

            const x = typeof jugador.x === "number" ? jugador.x : NaN;
            const y = typeof jugador.y === "number" ? jugador.y : NaN;
            jugadoresValidos.push({
                numero,
                nombre: app.limpiarTexto(jugador.nombre, `Jugador ${numero}`, 20),
                pos: app.limpiarTexto(jugador.pos, "Sin posición", 15),
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

        const formacion = Object.hasOwn(app.config.FORMACIONES, data.formacionActual)
            ? data.formacionActual
            : "4-3-3";

        const plantilla = data.plantilla === app.config.PLANTILLA_BLANCO || Object.hasOwn(app.config.PLANTILLAS, data.plantilla)
            ? data.plantilla : app.config.PLANTILLA_DEFECTO;
        const registros = data.historialCambios === undefined && version === 1
            ? [] : data.historialCambios;
        if (!Array.isArray(registros) || registros.length > app.config.MAX_CAMBIOS) return null;
        const contador = data.cambiosRealizados === undefined && version === 1
            ? registros.length : data.cambiosRealizados;
        if (!Number.isInteger(contador) || contador !== registros.length) return null;

        // Reproduce cada cambio desde la plantilla original y comprueba el resultado guardado.
        const puestos = new Map(app.obtenerPlantilla(plantilla)
            .filter(jugador => jugador.esTitular)
            .map(jugador => [jugador.numero, jugador.puestoId]));
        const historial = [];
        for (const cambio of registros) {
            if (!cambio || !Number.isInteger(cambio.sale) || !Number.isInteger(cambio.entra)
                || !dorsales.has(cambio.sale) || !dorsales.has(cambio.entra)
                || !puestos.has(cambio.sale) || puestos.has(cambio.entra)) return null;
            const puestoId = puestos.get(cambio.sale);
            if (cambio.puestoId != null && cambio.puestoId !== puestoId) return null;
            if (version === app.config.STORAGE_VERSION && cambio.puestoId !== puestoId) return null;
            puestos.delete(cambio.sale);
            puestos.set(cambio.entra, puestoId);
            historial.push({ sale: cambio.sale, entra: cambio.entra, puestoId });
        }
        for (const jugador of jugadoresValidos) {
            if (jugador.esTitular !== puestos.has(jugador.numero)) return null;
            const puestoId = puestos.get(jugador.numero) || null;
            if (jugador.puestoId !== null && jugador.puestoId !== puestoId) return null;
            if (version === app.config.STORAGE_VERSION && jugador.puestoId !== puestoId) return null;
            jugador.puestoId = puestoId;
        }

        return {
            jugadores: jugadoresValidos,
            formacionActual: formacion,
            camisa: Object.hasOwn(app.config.CAMISAS, data.camisa) ? data.camisa : app.config.CAMISA_DEFECTO,
            plantilla,
            cambiosRealizados: contador,
            historialCambios: historial
        };
    };

    app.cargarStorage = () => {
        try {
            const contenido = localStorage.getItem(app.config.STORAGE_KEY);
            if (!contenido) return;

            const data = app.validarDatosGuardados(JSON.parse(contenido));
            if (!data) {
                app.datos.almacenamientoInvalido = true;
                return;
            }

            app.datos.jugadores = data.jugadores;
            app.datos.formacionActual = data.formacionActual;
            app.datos.camisaActual = data.camisa;
            app.datos.plantillaActual = data.plantilla;
            app.datos.cambiosRealizados = data.cambiosRealizados;
            app.datos.historialCambios = data.historialCambios;
        } catch (e) {
            app.datos.almacenamientoInvalido = true;
        }
    };
})();
