(() => {
    "use strict";
    const app = window.Pizarra;

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

    Object.assign(app.dom, { cancha, bancaGrid, selectFormacion, selectLiga, selectCamisa, textoPlantilla, btnPlantillaEquipo, btnPlantillaBlanco, formulario, nombreInput, posicionInput, guardarBtn, btnSustituir, btnCapitan, restablecerBtn, contadorCambios, estado, tituloEsquema });
})();
