(() => {
    "use strict";
    const app = window.Pizarra;

    app.actualizarPanelPlantilla = () => {
        const equipoCamisa = app.config.CAMISAS[app.datos.camisaActual]?.nombre || "";
        const hayPlantilla = Object.hasOwn(app.config.PLANTILLAS, app.datos.camisaActual);
        const noCoincide = app.datos.plantillaActual !== app.config.PLANTILLA_BLANCO && app.datos.plantillaActual !== app.datos.camisaActual;

        app.dom.textoPlantilla.textContent = `Plantilla actual: ${app.nombrePlantilla(app.datos.plantillaActual)}.`
            + (noCoincide ? " No coincide con la camisa elegida." : "");
        app.dom.textoPlantilla.classList.toggle("desajuste", noCoincide);

        app.dom.btnPlantillaEquipo.disabled = !hayPlantilla;
        app.dom.btnPlantillaEquipo.textContent = hayPlantilla
            ? `Cargar plantilla de ${equipoCamisa}`
            : `Sin plantilla guardada de ${equipoCamisa}`;
    };

    app.actualizarSeleccionBanca = () => {
        app.dom.bancaGrid.querySelectorAll(".banca-item").forEach(item => {
            const seleccionado = app.datos.seleccionadoBanca?.numero === Number(item.dataset.numero);
            item.classList.toggle("seleccionado", seleccionado);
            item.setAttribute("aria-pressed", seleccionado ? "true" : "false");
        });
    };

    app.renderizarBanca = () => {
        app.dom.bancaGrid.replaceChildren();
        const suplentes = app.datos.jugadores.filter(j => !j.esTitular);

        suplentes.forEach(jugador => {
            const item = document.createElement("button");
            item.type = "button";
            item.className = `banca-item ${app.datos.seleccionadoBanca === jugador ? 'seleccionado' : ''}`;
            item.dataset.numero = jugador.numero;
            item.setAttribute("aria-pressed", app.datos.seleccionadoBanca === jugador ? "true" : "false");
            item.setAttribute("aria-label", `Suplente ${jugador.numero}, ${jugador.nombre}, ${jugador.pos}`);

            const dorsal = document.createElement("div");
            dorsal.className = "banca-dorsal";
            dorsal.textContent = jugador.numero;

            const info = document.createElement("div");
            info.className = "banca-info";

            const nombre = document.createElement("div");
            nombre.className = "banca-nombre";
            nombre.append(document.createTextNode(jugador.nombre));
            if (jugador.esCapitan) {
                const marcaCapitan = document.createElement("strong");
                marcaCapitan.className = "marca-capitan";
                marcaCapitan.textContent = " (C)";
                nombre.append(marcaCapitan);
            }

            const posicion = document.createElement("div");
            posicion.className = "banca-pos";
            posicion.textContent = jugador.pos;

            info.append(nombre, posicion);
            item.append(dorsal, info);

            item.addEventListener("click", () => {
                app.datos.seleccionadoBanca = (app.datos.seleccionadoBanca === jugador) ? null : jugador;
                app.actualizarJugadorEdicion(app.datos.seleccionadoBanca);
                app.actualizarSeleccionBanca();
                app.actualizarPanelFormulario();
            });

            app.dom.bancaGrid.appendChild(item);
        });
    };

    app.renderizarCancha = () => {
        app.dom.cancha.querySelectorAll(".jugador").forEach(el => el.remove());

        const titulares = app.datos.jugadores.filter(j => j.esTitular);
        const coordsDefecto = app.config.FORMACIONES[app.datos.formacionActual];

        titulares.forEach((jugador, idx) => {
            const def = coordsDefecto.find(puesto => puesto.id === jugador.puestoId)
                || coordsDefecto[idx]
                || { x: 50, y: 50, pos: "MC" };
            
            const x = jugador.x !== undefined ? jugador.x : def.x;
            const y = jugador.y !== undefined ? jugador.y : def.y;
            jugador.x = x;
            jugador.y = y;

            const el = document.createElement("button");
            el.type = "button";
            el.className = `jugador ${jugador.pos === 'POR' ? 'portero' : ''} ${app.datos.seleccionadoTitular === jugador ? 'seleccionado' : ''}`;
            el.dataset.numero = jugador.numero;
            el.style.left = `${x}%`;
            el.style.top = `${y}%`;
            el.setAttribute("aria-pressed", app.datos.seleccionadoTitular === jugador ? "true" : "false");
            el.setAttribute(
                "aria-label",
                `Titular ${jugador.numero}, ${jugador.nombre}, ${jugador.pos}${jugador.esCapitan ? ", capitán" : ""}`
            );

            const fueCambiado = app.datos.historialCambios.some(h => h.entra === jugador.numero);

            const ficha = document.createElement("div");
            ficha.className = "ficha";
            const dorsalNum = document.createElement("span");
            dorsalNum.className = "dorsal-num";
            dorsalNum.textContent = jugador.numero;
            ficha.append(dorsalNum);
            if (fueCambiado) {
                const indicador = document.createElement("span");
                indicador.className = "indicador-sub";
                indicador.textContent = "▲";
                ficha.append(indicador);
            }

            const nombre = document.createElement("div");
            nombre.className = "nombre";
            nombre.append(document.createTextNode(jugador.nombre));
            if (jugador.esCapitan) {
                const marcaCapitan = document.createElement("span");
                marcaCapitan.className = "marca-capitan";
                marcaCapitan.textContent = " (C)";
                nombre.append(marcaCapitan);
            }

            el.append(ficha, nombre);

            app.vincularEventosArrastre(el, jugador);
            app.dom.cancha.appendChild(el);
        });
    };

    app.actualizarJugadorEdicion = (jugador) => {
        app.datos.jugadorEdicion = jugador || app.datos.seleccionadoTitular || app.datos.seleccionadoBanca;
    };

    app.actualizarPanelFormulario = () => {
        const activo = app.datos.jugadorEdicion;

        if (activo) {
            app.dom.nombreInput.disabled = false;
            app.dom.posicionInput.disabled = false;
            app.dom.guardarBtn.disabled = false;
            app.dom.nombreInput.value = activo.nombre;
            app.dom.posicionInput.value = activo.pos;

            if (!activo.esTitular) {
                app.dom.btnCapitan.disabled = true;
                app.dom.btnCapitan.textContent = "El capitán debe ser titular";
            } else if (activo.esCapitan) {
                app.dom.btnCapitan.disabled = true;
                app.dom.btnCapitan.textContent = "Capitán actual (C)";
            } else {
                app.dom.btnCapitan.disabled = false;
                app.dom.btnCapitan.textContent = "Asignar Capitán";
            }
        } else {
            app.dom.nombreInput.disabled = true;
            app.dom.posicionInput.disabled = true;
            app.dom.guardarBtn.disabled = true;
            app.dom.btnCapitan.disabled = true;
            app.dom.nombreInput.value = "";
            app.dom.posicionInput.value = "";
            app.dom.btnCapitan.textContent = "Asignar Capitán";
        }

        const puedeSustituir = app.datos.seleccionadoTitular && app.datos.seleccionadoBanca && app.datos.cambiosRealizados < app.config.MAX_CAMBIOS;
        app.dom.btnSustituir.disabled = !puedeSustituir;
        app.dom.btnSustituir.textContent = `Sustituir #${app.datos.seleccionadoTitular?.numero || '?'} por #${app.datos.seleccionadoBanca?.numero || '?'}`;
        app.dom.contadorCambios.textContent = `${app.datos.cambiosRealizados} / ${app.config.MAX_CAMBIOS}`;
    };

    app.actualizarSeleccionCancha = () => {
        app.dom.cancha.querySelectorAll(".jugador").forEach(el => {
            const numero = Number(el.dataset.numero);
            el.classList.toggle(
                "seleccionado",
                app.datos.seleccionadoTitular?.numero === numero
            );
            el.setAttribute(
                "aria-pressed",
                app.datos.seleccionadoTitular?.numero === numero ? "true" : "false"
            );
        });
    };
})();
