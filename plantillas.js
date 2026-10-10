// Función compartida y registro. Cargar antes de los archivos de plantillas/.
(() => {
    const ROLES = ["POR", "LD", "DFC", "DFC", "LI", "MCD", "ED", "MC", "DC", "MC", "EI"];

    window.crearPlantillaEquipo = (titulares, suplentes, capitan = 10) => [
        ...titulares.map(([numero, nombre], i) => ({
            numero,
            nombre,
            pos: ROLES[i],
            esTitular: true,
            esCapitan: numero === capitan,
            puestoId: String(i + 1)
        })),
        ...suplentes.map(([numero, nombre, pos]) => ({
            numero,
            nombre,
            pos,
            esTitular: false,
            esCapitan: false,
            puestoId: null
        }))
    ];

    window.PLANTILLAS_EQUIPO = Object.create(null);
})();
