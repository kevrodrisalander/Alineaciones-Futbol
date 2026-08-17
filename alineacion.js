(() => {
    const STORAGE_KEY = "alineador-tactico-pro-v1";
    const MAX_CAMBIOS = 5;

    // Formaciones Predeterminadas (Coordenadas en % para los 11 titulares)
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

    // Plantilla Inicial con propiedad esCapitan
    const PLANTILLA_INICIAL = [
        { numero: 1, nombre: "Courtois", pos: "POR", esTitular: true, esCapitan: false },
        { numero: 2, nombre: "Carvajal", pos: "LD", esTitular: true, esCapitan: false },
        { numero: 3, nombre: "E. Militao", pos: "DFC", esTitular: true, esCapitan: false },
        { numero: 4, nombre: "Alaba", pos: "DFC", esTitular: true, esCapitan: false },
        { numero: 5, nombre: "Mendy", pos: "LI", esTitular: true, esCapitan: false },
        { numero: 6, nombre: "Camavinga", pos: "MCD", esTitular: true, esCapitan: false },
        { numero: 7, pos: "ED", nombre: "Rodrygo", esTitular: true, esCapitan: false },
        { numero: 8, pos: "MC", nombre: "Kroos", esTitular: true, esCapitan: false },
        { numero: 9, pos: "DC", nombre: "Mbappé", esTitular: true, esCapitan: false },
        { numero: 10, pos: "MC", nombre: "Modrić", esTitular: true, esCapitan: true }, // Capitán por defecto
        { numero: 11, pos: "EI", nombre: "Vinicius Jr.", esTitular: true, esCapitan: false },

        { numero: 12, nombre: "Lunin", pos: "POR Suplente", esTitular: false, esCapitan: false },
        { numero: 13, nombre: "Kepa", pos: "POR Suplente", esTitular: false, esCapitan: false },
        { numero: 14, nombre: "Nacho", pos: "Central / Def.", esTitular: false, esCapitan: false },
        { numero: 15, nombre: "Rüdiger", pos: "Central / Def.", esTitular: false, esCapitan: false },
        { numero: 16, nombre: "Fran García", pos: "Lateral Izq.", esTitular: false, esCapitan: false },
        { numero: 17, nombre: "Lucas V.", pos: "Lateral / Volante", esTitular: false, esCapitan: false },
        { numero: 18, nombre: "Tchouaméni", pos: "Pivote / Def.", esTitular: false, esCapitan: false },
        { numero: 19, nombre: "Ceballos", pos: "Mediocampista", esTitular: false, esCapitan: false },
        { numero: 20, nombre: "Valverde", pos: "Interior / Ext.", esTitular: false, esCapitan: false },
        { numero: 21, nombre: "Brahim", pos: "Mediapunta", esTitular: false, esCapitan: false },
        { numero: 22, nombre: "Arda Güler", pos: "Mediapunta", esTitular: false, esCapitan: false },
        { numero: 23, nombre: "Joselu", pos: "Delantero", esTitular: false, esCapitan: false },
        { numero: 24, nombre: "Endrick", pos: "Delantero", esTitular: false, esCapitan: false }
    ];

    // Estado
    let jugadores = JSON.parse(JSON.stringify(PLANTILLA_INICIAL));
    let formacionActual = "4-3-3";
    let cambiosRealizados = 0;
    let historialCambios = [];
    let seleccionadoTitular = null;
    let seleccionadoBanca = null;
    let arrastre = null;
    let tickFrame = null;

    // DOM
    const cancha = document.getElementById("cancha");
    const bancaGrid = document.getElementById("bancaGrid");
    const selectFormacion = document.getElementById("selectFormacion");
    const formulario = document.getElementById("formulario");
    const nombreInput = document.getElementById("nombreJugador");
    const posicionInput = document.getElementById("posicionJugador");
    const guardarBtn = document.getElementById("guardar");
    const btnSustituir = document.getElementById("btnSustituir");
    const restablecerBtn = document.getElementById("restablecer");
    const contadorCambios = document.getElementById("contador-cambios");
    const estado = document.getElementById("estado");
    const tituloEsquema = document.getElementById("titulo-esquema");

    // Crear botón dinámico de Capitán en el panel
    const btnCapitan = document.createElement("button");
    btnCapitan.id = "btnCapitan";
    btnCapitan.type = "button";
    btnCapitan.className = "btn";
    btnCapitan.style.width = "100%";
    btnCapitan.style.marginTop = "0.5rem";
    btnCapitan.style.background = "#f59e0b";
    btnCapitan.style.color = "#000";
    btnCapitan.textContent = "Hacer Capitán";
    btnCapitan.disabled = true;
    formulario.appendChild(btnCapitan);

    const guardarStorage = () => {
        const data = {
            jugadores,
            formacionActual,
            cambiosRealizados,
            historialCambios
        };
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
            estado.textContent = "Datos guardados automáticamente.";
        } catch (e) {
            estado.textContent = "Error al guardar en almacenamiento local.";
        }
    };

    const cargarStorage = () => {
        try {
            const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
            if (data) {
                jugadores = data.jugadores || jugadores;
                formacionActual = data.formacionActual || "4-3-3";
                cambiosRealizados = data.cambiosRealizados || 0;
                historialCambios = data.historialCambios || [];
            }
        } catch(e) {}
    };

    const asignarCapitan = (jugador) => {
        jugadores.forEach(j => j.esCapitan = false);
        jugador.esCapitan = true;
        estado.textContent = `${jugador.nombre} es el nuevo Capitán (C).`;
        guardarStorage();
        renderizarCancha();
        renderizarBanca();
        actualizarPanelFormulario();
    };

    const renderizarBanca = () => {
        bancaGrid.innerHTML = "";
        const suplentes = jugadores.filter(j => !j.esTitular);

        suplentes.forEach(jugador => {
            const item = document.createElement("div");
            item.className = `banca-item ${seleccionadoBanca === jugador ? 'seleccionado' : ''}`;
            item.dataset.numero = jugador.numero;

            item.innerHTML = `
                <div class="banca-dorsal">${jugador.numero}</div>
                <div class="banca-info">
                    <div class="banca-nombre">
                        ${jugador.nombre} ${jugador.esCapitan ? '<strong style="color:#f59e0b;">(C)</strong>' : ''}
                    </div>
                    <div class="banca-pos">${jugador.pos}</div>
                </div>
            `;

            item.addEventListener("click", () => {
                seleccionadoBanca = (seleccionadoBanca === jugador) ? null : jugador;
                renderizarBanca();
                actualizarPanelFormulario();
            });

            bancaGrid.appendChild(item);
        });
    };

    const renderizarCancha = () => {
        cancha.querySelectorAll(".jugador").forEach(el => el.remove());

        const titulares = jugadores.filter(j => j.esTitular);
        const coordsDefecto = FORMACIONES[formacionActual];

        titulares.forEach((jugador, idx) => {
            const def = coordsDefecto[idx] || { x: 50, y: 50, pos: "MC" };
            
            const x = jugador.x !== undefined ? jugador.x : def.x;
            const y = jugador.y !== undefined ? jugador.y : def.y;
            jugador.x = x;
            jugador.y = y;

            const el = document.createElement("div");
            el.className = `jugador ${jugador.pos === 'POR' ? 'portero' : ''} ${seleccionadoTitular === jugador ? 'seleccionado' : ''}`;
            el.dataset.numero = jugador.numero;
            el.style.left = `${x}%`;
            el.style.top = `${y}%`;

            const fueCambiado = historialCambios.some(h => h.entra === jugador.numero);

            el.innerHTML = `
                <div class="ficha">
                    ${jugador.numero}
                    ${fueCambiado ? '<span class="indicador-sub">▲</span>' : ''}
                </div>
                <div class="nombre">
                    ${jugador.nombre} ${jugador.esCapitan ? '<span style="color:#f59e0b; font-weight:bold;">(C)</span>' : ''}
                </div>
            `;

            vincularEventosArrastre(el, jugador);
            cancha.appendChild(el);
        });
    };

    const actualizarPanelFormulario = () => {
        const activo = seleccionadoTitular || seleccionadoBanca;

        if (activo) {
            nombreInput.disabled = false;
            posicionInput.disabled = false;
            guardarBtn.disabled = false;
            btnCapitan.disabled = false;
            nombreInput.value = activo.nombre;
            posicionInput.value = activo.pos;

            btnCapitan.textContent = activo.esCapitan ? "Es Capitán (C)" : "Asignar Capitán";
            btnCapitan.style.opacity = activo.esCapitan ? "0.7" : "1";
        } else {
            nombreInput.disabled = true;
            posicionInput.disabled = true;
            guardarBtn.disabled = true;
            btnCapitan.disabled = true;
            nombreInput.value = "";
            posicionInput.value = "";
            btnCapitan.textContent = "Hacer Capitán";
        }

        const puedeSustituir = seleccionadoTitular && seleccionadoBanca && cambiosRealizados < MAX_CAMBIOS;
        btnSustituir.disabled = !puedeSustituir;
        btnSustituir.textContent = `Sustituir #${seleccionadoTitular?.numero || '?'} por #${seleccionadoBanca?.numero || '?'}`;
        contadorCambios.textContent = `${cambiosRealizados} / ${MAX_CAMBIOS}`;
    };

    const efectuarSustitucion = () => {
        if (!seleccionadoTitular || !seleccionadoBanca || cambiosRealizados >= MAX_CAMBIOS) return;

        seleccionadoTitular.esTitular = false;
        seleccionadoBanca.esTitular = true;

        seleccionadoBanca.x = seleccionadoTitular.x;
        seleccionadoBanca.y = seleccionadoTitular.y;

        // Si sale el capitán, pasar el brazalete al que entra
        if (seleccionadoTitular.esCapitan) {
            seleccionadoTitular.esCapitan = false;
            seleccionadoBanca.esCapitan = true;
            estado.textContent = `Cambio y brazalete: ${seleccionadoBanca.nombre} pasa a ser el Capitán.`;
        }

        historialCambios.push({
            sale: seleccionadoTitular.numero,
            entra: seleccionadoBanca.numero
        });

        cambiosRealizados++;

        seleccionadoTitular = null;
        seleccionadoBanca = null;

        guardarStorage();
        renderizarCancha();
        renderizarBanca();
        actualizarPanelFormulario();
    };

    const posicionarElemento = (el, x, y) => {
        const limX = Math.max(6, Math.min(94, x));
        const limY = Math.max(5, Math.min(95, y));
        el.style.left = `${limX}%`;
        el.style.top = `${limY}%`;
        return { x: limX, y: limY };
    };

    const vincularEventosArrastre = (el, jugador) => {
        el.addEventListener("click", (e) => {
            e.stopPropagation();
            seleccionadoTitular = (seleccionadoTitular === jugador) ? null : jugador;
            renderizarCancha();
            actualizarPanelFormulario();
        });

        el.addEventListener("pointerdown", (e) => {
            if (e.button !== 0) return;
            seleccionadoTitular = jugador;
            renderizarCancha();
            actualizarPanelFormulario();

            el.classList.add("arrastrando");
            el.setPointerCapture(e.pointerId);
            arrastre = { el, jugador, pointerId: e.pointerId };
        });

        el.addEventListener("pointermove", (e) => {
            if (!arrastre || arrastre.pointerId !== e.pointerId) return;
            const rect = cancha.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;

            if (!tickFrame) {
                tickFrame = requestAnimationFrame(() => {
                    if (arrastre) {
                        const pos = posicionarElemento(arrastre.el, x, y);
                        arrastre.jugador.x = pos.x;
                        arrastre.jugador.y = pos.y;
                    }
                    tickFrame = null;
                });
            }
        });

        const finalizarArrastre = (e) => {
            if (!arrastre || arrastre.pointerId !== e.pointerId) return;
            el.classList.remove("arrastrando");
            arrastre = null;
            guardarStorage();
        };

        el.addEventListener("pointerup", finalizarArrastre);
        el.addEventListener("pointercancel", finalizarArrastre);
    };

    const cambiarFormacion = (nuevaFormacion) => {
        formacionActual = nuevaFormacion;
        tituloEsquema.textContent = `Alineación ${nuevaFormacion}`;
        selectFormacion.value = nuevaFormacion;

        const coords = FORMACIONES[nuevaFormacion];
        const titulares = jugadores.filter(j => j.esTitular);

        titulares.forEach((jugador, idx) => {
            if (coords[idx]) {
                jugador.x = coords[idx].x;
                jugador.y = coords[idx].y;
                jugador.pos = coords[idx].pos;
            }
        });

        guardarStorage();
        renderizarCancha();
        renderizarBanca();
    };

    const init = () => {
        cargarStorage();
        
        selectFormacion.value = formacionActual;
        tituloEsquema.textContent = `Alineación ${formacionActual}`;

        renderizarCancha();
        renderizarBanca();
        actualizarPanelFormulario();

        selectFormacion.addEventListener("change", (e) => cambiarFormacion(e.target.value));

        formulario.addEventListener("submit", (e) => {
            e.preventDefault();
            const activo = seleccionadoTitular || seleccionadoBanca;
            if (activo) {
                activo.nombre = nombreInput.value.trim() || activo.nombre;
                activo.pos = posicionInput.value.trim() || activo.pos;
                guardarStorage();
                renderizarCancha();
                renderizarBanca();
                actualizarPanelFormulario();
                estado.textContent = "Datos del jugador actualizados.";
            }
        });

        btnCapitan.addEventListener("click", () => {
            const activo = seleccionadoTitular || seleccionadoBanca;
            if (activo) {
                asignarCapitan(activo);
            }
        });

        btnSustituir.addEventListener("click", efectuarSustitucion);

        restablecerBtn.addEventListener("click", () => {
            if (confirm("¿Deseas restablecer la plantilla, los 5 cambios y la formación original?")) {
                jugadores = JSON.parse(JSON.stringify(PLANTILLA_INICIAL));
                cambiosRealizados = 0;
                historialCambios = [];
                seleccionadoTitular = null;
                seleccionadoBanca = null;
                cambiarFormacion("4-3-3");
                estado.textContent = "Alineación y capitán restablecidos por defecto.";
            }
        });
    };

    init();
})();