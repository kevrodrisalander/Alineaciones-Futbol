(() => {
    "use strict";
    window.Pizarra = { config: {}, datos: {}, dom: {} };
    const FORMACIONES = {
        "4-3-3": [
            { id: "1", pos: "POR", x: 50, y: 90 },
            { id: "2", pos: "LD",  x: 15, y: 72 },
            { id: "3", pos: "DFC", x: 38, y: 75 },
            { id: "4", pos: "DFC", x: 62, y: 75 },
            { id: "5", pos: "LI",  x: 85, y: 72 },
            { id: "6", pos: "MCD", x: 50, y: 58 },
            { id: "8", pos: "MC",  x: 30, y: 45 },
            { id: "10", pos: "MC", x: 70, y: 45 },
            { id: "7", pos: "ED",  x: 82, y: 22 },
            { id: "9", pos: "DC",  x: 50, y: 18 },
            { id: "11", pos: "EI", x: 18, y: 22 }
        ],
        "4-4-2": [
            { id: "1", pos: "POR", x: 50, y: 90 },
            { id: "2", pos: "LD",  x: 15, y: 72 },
            { id: "3", pos: "DFC", x: 38, y: 75 },
            { id: "4", pos: "DFC", x: 62, y: 75 },
            { id: "5", pos: "LI",  x: 85, y: 72 },
            { id: "7", pos: "MD",  x: 15, y: 46 },
            { id: "6", pos: "MC",  x: 38, y: 50 },
            { id: "8", pos: "MC",  x: 62, y: 50 },
            { id: "11", pos: "MI", x: 85, y: 46 },
            { id: "9", pos: "DC",  x: 38, y: 22 },
            { id: "10", pos: "DC", x: 62, y: 22 }
        ],
        "4-2-3-1": [
            { id: "1", pos: "POR", x: 50, y: 90 },
            { id: "2", pos: "LD",  x: 15, y: 72 },
            { id: "3", pos: "DFC", x: 38, y: 75 },
            { id: "4", pos: "DFC", x: 62, y: 75 },
            { id: "5", pos: "LI",  x: 85, y: 72 },
            { id: "6", pos: "MCD", x: 36, y: 58 },
            { id: "8", pos: "MCD", x: 64, y: 58 },
            { id: "7", pos: "MCO", x: 80, y: 38 },
            { id: "10", pos: "MCO", x: 50, y: 38 },
            { id: "11", pos: "MCO", x: 20, y: 38 },
            { id: "9", pos: "DC",  x: 50, y: 18 }
        ],
        "3-5-2": [
            { id: "1", pos: "POR", x: 50, y: 90 },
            { id: "3", pos: "DFC", x: 25, y: 75 },
            { id: "4", pos: "DFC", x: 50, y: 77 },
            { id: "5", pos: "DFC", x: 75, y: 75 },
            { id: "2", pos: "CAD", x: 12, y: 48 },
            { id: "6", pos: "MCD", x: 50, y: 58 },
            { id: "8", pos: "MC",  x: 34, y: 44 },
            { id: "10", pos: "MC", x: 66, y: 44 },
            { id: "7", pos: "CAI", x: 88, y: 48 },
            { id: "9", pos: "DC",  x: 38, y: 20 },
            { id: "11", pos: "DC", x: 62, y: 20 }
        ],
        "5-3-2": [
            { id: "1", pos: "POR", x: 50, y: 90 },
            { id: "2", pos: "CAD", x: 12, y: 68 },
            { id: "3", pos: "DFC", x: 31, y: 75 },
            { id: "4", pos: "LIB", x: 50, y: 78 },
            { id: "5", pos: "DFC", x: 69, y: 75 },
            { id: "7", pos: "CAI", x: 88, y: 68 },
            { id: "6", pos: "MC",  x: 30, y: 50 },
            { id: "8", pos: "MC",  x: 50, y: 53 },
            { id: "10", pos: "MC", x: 70, y: 50 },
            { id: "9", pos: "DC",  x: 38, y: 22 },
            { id: "11", pos: "DC", x: 62, y: 22 }
        ],
        "4-1-4-1": [
            { id: "1", pos: "POR", x: 50, y: 90 },
            { id: "2", pos: "LD",  x: 15, y: 72 },
            { id: "3", pos: "DFC", x: 38, y: 75 },
            { id: "4", pos: "DFC", x: 62, y: 75 },
            { id: "5", pos: "LI",  x: 85, y: 72 },
            { id: "6", pos: "MCD", x: 50, y: 60 },
            { id: "7", pos: "MD",  x: 16, y: 40 },
            { id: "8", pos: "MC",  x: 38, y: 42 },
            { id: "10", pos: "MC", x: 62, y: 42 },
            { id: "11", pos: "MI", x: 84, y: 40 },
            { id: "9", pos: "DC",  x: 50, y: 20 }
        ]
    };

    window.Pizarra.config.FORMACIONES = FORMACIONES;
})();
