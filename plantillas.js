// Plantillas de equipos. Cada plantilla se carga con el botón "Cargar plantilla de <equipo>".
// La clave debe coincidir con el id del equipo en camisas.js (por ejemplo "barcelona").
//
// Para agregar una plantilla, añade una línea al final de window.PLANTILLAS_EQUIPO:
//   "id-del-equipo": equipo(titulares, suplentes, capitan)
//
// - titulares: 11 jugadores [dorsal, nombre] en este orden:
//     portero, lateral der., central, central, lateral izq., pivote,
//     extremo der., mediocampista, delantero, mediocampista, extremo izq.
// - suplentes: 13 jugadores [dorsal, nombre, posición] (la posición admite hasta 15 caracteres)
// - capitan: dorsal del capitán (debe ser uno de los titulares; por defecto 10)
// Los 24 dorsales deben ser distintos y los nombres admiten hasta 20 caracteres.
(() => {
    const ROLES = ["POR", "LD", "DFC", "DFC", "LI", "MCD", "ED", "MC", "DC", "MC", "EI"];

    const equipo = (titulares, suplentes, capitan = 10) => [
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

    window.PLANTILLAS_EQUIPO = {
        // Plantilla de ejemplo original del proyecto: revisa que esté actualizada
        "real-madrid": equipo(
            [
                [1, "Courtois"], [2, "Carvajal"], [3, "E. Militao"], [4, "Alaba"], [5, "Mendy"],
                [6, "Camavinga"], [7, "Rodrygo"], [8, "Kroos"], [9, "Mbappé"], [10, "Modrić"],
                [11, "Vinicius Jr."]
            ],
            [
                [12, "Lunin", "POR Suplente"], [13, "Kepa", "POR Suplente"],
                [14, "Nacho", "Central / Def."], [15, "Rüdiger", "Central / Def."],
                [16, "Fran García", "Lateral Izq."], [17, "Lucas V.", "Lat. / Volante"],
                [18, "Tchouaméni", "Pivote / Def."], [19, "Ceballos", "Mediocampista"],
                [20, "Valverde", "Interior / Ext."], [21, "Brahim", "Mediapunta"],
                [22, "Arda Güler", "Mediapunta"], [23, "Joselu", "Delantero"],
                [24, "Endrick", "Delantero"]
            ],
            10
        )
    };
})();