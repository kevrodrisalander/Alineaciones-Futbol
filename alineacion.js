(() => {
    "use strict";
    const app = window.Pizarra;

    app.init = () => {
        app.cargarStorage();
        app.normalizarPuestosTacticos();
        
        const ligaInicial = app.indiceLigaDeCamisa(app.datos.camisaActual);
        app.poblarSelectLiga();
        app.dom.selectLiga.value = String(ligaInicial);
        app.poblarSelectEquipos(ligaInicial);
        app.dom.selectCamisa.value = app.datos.camisaActual;
        app.aplicarCamisa(app.datos.camisaActual);
        app.actualizarPanelPlantilla();

        app.dom.selectFormacion.value = app.datos.formacionActual;
        app.dom.tituloEsquema.textContent = `Alineación ${app.datos.formacionActual}`;

        app.renderizarCancha();
        app.renderizarBanca();
        app.actualizarPanelFormulario();

        if (app.datos.almacenamientoInvalido) {
            app.dom.estado.textContent = "Los datos guardados no eran válidos; se cargó una plantilla segura.";
        }

        app.dom.selectFormacion.addEventListener("change", (e) => app.cambiarFormacion(e.target.value));
        app.dom.selectLiga.addEventListener("change", (e) => app.cambiarLiga(e.target.value));
        app.dom.selectCamisa.addEventListener("change", (e) => app.cambiarCamisa(e.target.value));

        app.dom.formulario.addEventListener("submit", (e) => {
            e.preventDefault();
            const activo = app.datos.jugadorEdicion;
            if (activo) {
                activo.nombre = app.limpiarTexto(app.dom.nombreInput.value, activo.nombre, 20);
                activo.pos = app.limpiarTexto(app.dom.posicionInput.value, activo.pos, 15);
                app.guardarStorage("Datos del jugador actualizados.");
                app.renderizarCancha();
                app.renderizarBanca();
                app.actualizarPanelFormulario();
            }
        });

        app.dom.btnCapitan.addEventListener("click", () => {
            const activo = app.datos.jugadorEdicion;
            if (activo?.esTitular) {
                app.asignarCapitan(activo);
            }
        });

        app.dom.btnSustituir.addEventListener("click", app.efectuarSustitucion);

        app.dom.btnPlantillaEquipo.addEventListener("click", () => {
            if (!Object.hasOwn(app.config.PLANTILLAS, app.datos.camisaActual)) return;
            if (confirm(`Se cargará la plantilla de ${app.nombrePlantilla(app.datos.camisaActual)}. Se reemplazarán los nombres, los cambios realizados y el capitán. ¿Continuar?`)) {
                app.cargarPlantilla(app.datos.camisaActual);
            }
        });

        app.dom.btnPlantillaBlanco.addEventListener("click", () => {
            if (confirm("Se cargará una plantilla en blanco. Se reemplazarán los nombres, los cambios realizados y el capitán. ¿Continuar?")) {
                app.cargarPlantilla(app.config.PLANTILLA_BLANCO);
            }
        });

        app.dom.restablecerBtn.addEventListener("click", () => {
            if (confirm("¿Deseas restablecer la plantilla, los 5 cambios y la formación original?")) {
                app.datos.jugadores = app.obtenerPlantilla(app.datos.plantillaActual);
                app.datos.cambiosRealizados = 0;
                app.datos.historialCambios = [];
                app.datos.seleccionadoTitular = null;
                app.datos.seleccionadoBanca = null;
                app.datos.jugadorEdicion = null;
                app.normalizarPuestosTacticos();
                app.cambiarFormacion("4-3-3", "Alineación y capitán restablecidos por defecto.");
            }
        });
    };

    app.init();
})();
