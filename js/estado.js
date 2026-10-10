(() => {
    "use strict";
    const app = window.Pizarra;

    app.datos.plantillaActual = app.config.PLANTILLA_DEFECTO;
    app.datos.jugadores = app.obtenerPlantilla(app.datos.plantillaActual);
    app.datos.formacionActual = "4-3-3";
    app.datos.camisaActual = app.config.CAMISA_DEFECTO;
    app.datos.cambiosRealizados = 0;
    app.datos.historialCambios = [];
    app.datos.seleccionadoTitular = null;
    app.datos.seleccionadoBanca = null;
    app.datos.jugadorEdicion = null;
    app.datos.arrastre = null;
    app.datos.tickFrame = null;
    app.datos.almacenamientoInvalido = false;
})();
