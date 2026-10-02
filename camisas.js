// Catálogo de camisas (colores aproximados de la equipación titular).
// Para agregar un equipo: añade una línea en el grupo correspondiente.
//   liso(id, nombre, color, colorNumero, colorBorde, portero)
//   dibujo(id, nombre, patron, color1, color2, colorNumero, colorBorde, portero, fondoNumero)
// patron: "rayas" (verticales) | "aros" (horizontales) | "banda" (horizontal central) | "franja" (diagonal)
// portero: negro | amarillo | verde | naranja | azul | rosa
// Los equipos se ordenan solos por nombre dentro de cada grupo.
(() => {
    const PORTEROS = {
        negro:    ["#1a1a1a", "#ffffff"],
        amarillo: ["#f5c400", "#1a1a1a"],
        verde:    ["#2ecc71", "#06210f"],
        naranja:  ["#ff7a00", "#1a1a1a"],
        azul:     ["#1c2c5b", "#ffffff"],
        rosa:     ["#d81e5b", "#ffffff"]
    };

    // Fondo detrás del número cuando la camisa tiene dibujo (para que se lea bien)
    const PILL_CLARO = "rgba(255, 255, 255, .9)";
    const PILL_OSCURO = "rgba(0, 0, 0, .62)";

    const liso = (id, nombre, c1, texto, borde, portero) =>
        ({ id, nombre, patron: "solido", c1, texto, borde, portero });

    const dibujo = (id, nombre, patron, c1, c2, texto, borde, portero, numFondo) =>
        ({ id, nombre, patron, c1, c2, texto, borde, portero, numFondo });

    const resolver = (equipo) => {
        const [porteroFondo, porteroTexto] = PORTEROS[equipo.portero] || PORTEROS.negro;
        return { ...equipo, portero: porteroFondo, porteroTexto };
    };

    const grupo = (nombre, equipos) => ({
        grupo: nombre,
        equipos: equipos
            .map(resolver)
            .sort((a, b) => a.nombre.localeCompare(b.nombre, "es"))
    });

    window.CATALOGO_CAMISAS = [
        grupo("Liga MX (México)", [
            liso("america",    "América",    "#ffd400", "#0a2a6b", "#0a2a6b", "negro"),
            liso("atlas",      "Atlas",      "#d71920", "#ffffff", "#111111", "verde"),
            dibujo("chivas",   "Chivas",     "rayas", "#d81e2b", "#ffffff", "#0a2a6b", "#0a2a6b", "verde", PILL_CLARO),
            liso("cruz-azul",  "Cruz Azul",  "#1b4aa0", "#ffffff", "#ffffff", "amarillo"),
            liso("leon",       "León",       "#0b7a3b", "#ffffff", "#f5c400", "naranja"),
            dibujo("monterrey","Monterrey",  "rayas", "#0a3a7a", "#ffffff", "#0a2a5e", "#0a3a7a", "naranja", PILL_CLARO),
            dibujo("pachuca",  "Pachuca",    "rayas", "#ffffff", "#0a3a8a", "#0a2a6b", "#0a3a8a", "amarillo", PILL_CLARO),
            liso("pumas",      "Pumas UNAM", "#0b2d5b", "#d4af37", "#d4af37", "verde"),
            liso("santos",     "Santos Laguna", "#ffffff", "#0b7a3b", "#0b7a3b", "negro"),
            liso("tigres",     "Tigres UANL","#f5c518", "#1b3a8a", "#1b3a8a", "negro"),
            liso("toluca",     "Toluca",     "#d71920", "#ffffff", "#ffffff", "negro")
        ]),
        grupo("LaLiga (España)", [
            dibujo("athletic",   "Athletic Club",     "rayas", "#d71920", "#ffffff", "#111111", "#111111", "verde", PILL_CLARO),
            dibujo("atletico",   "Atlético de Madrid","rayas", "#cb3524", "#ffffff", "#272e61", "#272e61", "verde", PILL_CLARO),
            dibujo("barcelona",  "FC Barcelona",      "rayas", "#a50044", "#004d98", "#edbb00", "#edbb00", "amarillo", "rgba(0, 20, 60, .72)"),
            dibujo("betis",      "Real Betis",        "rayas", "#ffffff", "#0a8a3a", "#0a4a2a", "#0a8a3a", "naranja", PILL_CLARO),
            liso("real-madrid",  "Real Madrid",       "#ffffff", "#1b2a5c", "#d4af37", "negro"),
            dibujo("real-sociedad","Real Sociedad",   "rayas", "#ffffff", "#1a5aa8", "#0a2a6b", "#1a5aa8", "negro", PILL_CLARO),
            liso("sevilla",      "Sevilla",           "#ffffff", "#d71920", "#d71920", "negro"),
            liso("valencia",     "Valencia",          "#ffffff", "#111111", "#f08a00", "azul"),
            liso("villarreal",   "Villarreal",        "#fbe122", "#0a3a8a", "#0a3a8a", "negro")
        ]),
        grupo("Premier League (Inglaterra)", [
            liso("arsenal",      "Arsenal",           "#ef0107", "#ffffff", "#ffffff", "negro"),
            liso("aston-villa",  "Aston Villa",       "#670e36", "#95bfe5", "#95bfe5", "amarillo"),
            liso("chelsea",      "Chelsea",           "#034694", "#ffffff", "#dba111", "amarillo"),
            liso("liverpool",    "Liverpool",         "#c8102e", "#ffffff", "#f6eb61", "amarillo"),
            liso("man-city",     "Manchester City",   "#6cabdd", "#ffffff", "#ffffff", "azul"),
            liso("man-united",   "Manchester United", "#da291c", "#fbe122", "#fbe122", "negro"),
            dibujo("newcastle",  "Newcastle",         "rayas", "#111111", "#ffffff", "#ffffff", "#ffffff", "naranja", PILL_OSCURO),
            liso("tottenham",    "Tottenham",         "#ffffff", "#132257", "#132257", "verde")
        ]),
        grupo("Bundesliga (Alemania)", [
            liso("bayern",       "Bayern Múnich",     "#dc052d", "#ffffff", "#0066b2", "negro"),
            liso("dortmund",     "Borussia Dortmund", "#fde100", "#111111", "#111111", "rosa"),
            liso("leverkusen",   "Bayer Leverkusen",  "#e32221", "#ffffff", "#111111", "negro"),
            liso("leipzig",      "RB Leipzig",        "#ffffff", "#dd0741", "#dd0741", "amarillo")
        ]),
        grupo("Serie A (Italia)", [
            dibujo("inter",      "Inter de Milán",    "rayas", "#0068a8", "#111111", "#ffffff", "#c9a227", "amarillo", PILL_OSCURO),
            dibujo("juventus",   "Juventus",          "rayas", "#ffffff", "#111111", "#ffffff", "#ffffff", "naranja", "rgba(17, 17, 17, .88)"),
            liso("lazio",        "Lazio",             "#87d8f7", "#0b2a4a", "#ffffff", "negro"),
            dibujo("milan",      "AC Milan",          "rayas", "#fb090b", "#111111", "#ffffff", "#ffffff", "verde", PILL_OSCURO),
            liso("napoli",       "Napoli",            "#12a0d7", "#ffffff", "#ffffff", "negro"),
            liso("roma",         "Roma",              "#8e1f2f", "#f0bc42", "#f0bc42", "negro")
        ]),
        grupo("Ligue 1 (Francia)", [
            liso("lyon",         "Olympique de Lyon", "#ffffff", "#0a2a8a", "#d71920", "negro"),
            liso("marsella",     "Olympique de Marsella", "#ffffff", "#0b7fb5", "#0b7fb5", "negro"),
            dibujo("monaco",     "AS Mónaco",         "franja", "#ffffff", "#e5212c", "#ffffff", "#e5212c", "negro", PILL_OSCURO),
            liso("psg",          "Paris Saint-Germain","#004170", "#ffffff", "#da291c", "amarillo")
        ]),
        grupo("Otras ligas de Europa", [
            liso("ajax",         "Ajax",              "#ffffff", "#d2122e", "#d2122e", "negro"),
            liso("benfica",      "Benfica",           "#e30613", "#ffffff", "#ffffff", "negro"),
            dibujo("porto",      "Porto",             "rayas", "#ffffff", "#0a3a8a", "#0a2a6b", "#0a3a8a", "amarillo", PILL_CLARO)
        ]),
        grupo("Sudamérica", [
            dibujo("boca",       "Boca Juniors",      "banda", "#0b3a8c", "#f7c600", "#0b2a6b", "#f7c600", "negro"),
            liso("corinthians",  "Corinthians",       "#ffffff", "#111111", "#111111", "verde"),
            dibujo("flamengo",   "Flamengo",          "aros", "#d71920", "#111111", "#ffffff", "#ffffff", "amarillo", PILL_OSCURO),
            liso("independiente","Independiente",     "#d71920", "#ffffff", "#ffffff", "negro"),
            liso("palmeiras",    "Palmeiras",         "#0a6a37", "#ffffff", "#ffffff", "amarillo"),
            dibujo("penarol",    "Peñarol",           "rayas", "#f5c400", "#111111", "#ffffff", "#111111", "azul", PILL_OSCURO),
            dibujo("racing",     "Racing Club",       "rayas", "#75aadb", "#ffffff", "#0a2a6b", "#75aadb", "negro", PILL_CLARO),
            dibujo("river",      "River Plate",       "franja", "#ffffff", "#e30613", "#ffffff", "#e30613", "negro", PILL_OSCURO)
        ]),
        grupo("Selecciones nacionales", [
            liso("alemania",     "Alemania",          "#ffffff", "#111111", "#111111", "verde"),
            dibujo("argentina",  "Argentina",         "rayas", "#75aadb", "#ffffff", "#111111", "#f6b40e", "negro", PILL_CLARO),
            liso("belgica",      "Bélgica",           "#c8102e", "#ffffff", "#f5c400", "amarillo"),
            liso("brasil",       "Brasil",            "#fee100", "#009b3a", "#009b3a", "azul"),
            liso("colombia",     "Colombia",          "#fcd116", "#0a2a6b", "#0a2a6b", "negro"),
            liso("espana",       "España",            "#aa151b", "#f1bf00", "#f1bf00", "negro"),
            liso("estados-unidos","Estados Unidos",   "#ffffff", "#0a3161", "#bf0a30", "negro"),
            liso("francia",      "Francia",           "#1b2f6b", "#ffffff", "#ed2939", "amarillo"),
            liso("inglaterra",   "Inglaterra",        "#ffffff", "#0a1a4a", "#c8102e", "verde"),
            liso("italia",       "Italia",            "#0e5fb3", "#ffffff", "#ffffff", "negro"),
            liso("japon",        "Japón",             "#0a3a8a", "#ffffff", "#ffffff", "amarillo"),
            liso("mexico",       "México",            "#006847", "#ffffff", "#ce1126", "amarillo"),
            liso("paises-bajos", "Países Bajos",      "#f36c21", "#ffffff", "#ffffff", "negro"),
            liso("portugal",     "Portugal",          "#c8102e", "#ffffff", "#046a38", "amarillo"),
            liso("uruguay",      "Uruguay",           "#5ba4d9", "#111111", "#ffffff", "negro")
        ])
    ];
})();
