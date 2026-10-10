(() => {
    "use strict";
    const app = window.Pizarra;

    app.posicionarElemento = (el, x, y) => {
        const limX = Math.max(6, Math.min(94, x));
        const limY = Math.max(5, Math.min(95, y));
        el.style.left = `${limX}%`;
        el.style.top = `${limY}%`;
        return { x: limX, y: limY };
    };

    app.aplicarPosicionPendiente = () => {
        if (!app.datos.arrastre || app.datos.arrastre.x === null || app.datos.arrastre.y === null) return;

        const pos = app.posicionarElemento(app.datos.arrastre.el, app.datos.arrastre.x, app.datos.arrastre.y);
        app.datos.arrastre.jugador.x = pos.x;
        app.datos.arrastre.jugador.y = pos.y;
    };

    app.vincularEventosArrastre = (el, jugador) => {
        el.addEventListener("keydown", (e) => {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                app.datos.seleccionadoTitular = app.datos.seleccionadoTitular === jugador ? null : jugador;
                app.actualizarJugadorEdicion(app.datos.seleccionadoTitular);
                app.actualizarSeleccionCancha();
                app.actualizarPanelFormulario();
                return;
            }

            const desplazamientos = {
                ArrowLeft: [-1, 0],
                ArrowRight: [1, 0],
                ArrowUp: [0, -1],
                ArrowDown: [0, 1]
            };
            const direccion = desplazamientos[e.key];
            if (!direccion) return;

            e.preventDefault();
            app.datos.seleccionadoTitular = jugador;
            app.actualizarJugadorEdicion(jugador);
            app.actualizarSeleccionCancha();
            app.actualizarPanelFormulario();

            // 1% en X no mide lo mismo que 1% en Y; se compensa para que el paso sea igual en pantalla
            const rect = app.dom.cancha.getBoundingClientRect();
            const paso = e.shiftKey ? 5 : 1;
            const pasoX = paso * (rect.height / rect.width);
            const pos = app.posicionarElemento(
                el,
                jugador.x + (direccion[0] * pasoX),
                jugador.y + (direccion[1] * paso)
            );
            jugador.x = pos.x;
            jugador.y = pos.y;
            app.guardarStorage(`${jugador.nombre} movido a ${Math.round(pos.x)}%, ${Math.round(pos.y)}%.`);
        });

        el.addEventListener("pointerdown", (e) => {
            if (e.button !== 0) return;

            e.preventDefault();
            e.stopPropagation();
            el.focus({ preventScroll: true });

            const yaEstabaSeleccionado = app.datos.seleccionadoTitular === jugador;
            app.datos.seleccionadoTitular = jugador;
            app.actualizarJugadorEdicion(jugador);
            app.actualizarSeleccionCancha();
            app.actualizarPanelFormulario();

            const rectInicio = app.dom.cancha.getBoundingClientRect();
            const punteroX = ((e.clientX - rectInicio.left) / rectInicio.width) * 100;
            const punteroY = ((e.clientY - rectInicio.top) / rectInicio.height) * 100;

            el.classList.add("arrastrando");
            el.setPointerCapture(e.pointerId);
            app.datos.arrastre = {
                el,
                jugador,
                pointerId: e.pointerId,
                inicioX: e.clientX,
                inicioY: e.clientY,
                // Distancia entre el centro de la ficha y el punto exacto donde se agarró
                desfaseX: jugador.x - punteroX,
                desfaseY: jugador.y - punteroY,
                x: null,
                y: null,
                movido: false,
                yaEstabaSeleccionado
            };
        });

        el.addEventListener("pointermove", (e) => {
            if (!app.datos.arrastre || app.datos.arrastre.pointerId !== e.pointerId) return;

            const distancia = Math.hypot(
                e.clientX - app.datos.arrastre.inicioX,
                e.clientY - app.datos.arrastre.inicioY
            );

            if (!app.datos.arrastre.movido && distancia < 4) return;
            app.datos.arrastre.movido = true;

            const rect = app.dom.cancha.getBoundingClientRect();
            app.datos.arrastre.x = ((e.clientX - rect.left) / rect.width) * 100 + app.datos.arrastre.desfaseX;
            app.datos.arrastre.y = ((e.clientY - rect.top) / rect.height) * 100 + app.datos.arrastre.desfaseY;

            if (!app.datos.tickFrame) {
                app.datos.tickFrame = requestAnimationFrame(() => {
                    app.aplicarPosicionPendiente();
                    app.datos.tickFrame = null;
                });
            }
        });

        const finalizarArrastre = (e) => {
            if (!app.datos.arrastre || app.datos.arrastre.pointerId !== e.pointerId) return;

            const { movido, yaEstabaSeleccionado } = app.datos.arrastre;

            if (app.datos.tickFrame) {
                cancelAnimationFrame(app.datos.tickFrame);
                app.datos.tickFrame = null;
                app.aplicarPosicionPendiente();
            }

            el.classList.remove("arrastrando");
            app.datos.arrastre = null;

            if (movido) {
                app.guardarStorage();
            } else {
                app.datos.seleccionadoTitular = yaEstabaSeleccionado ? null : jugador;
                app.actualizarJugadorEdicion(app.datos.seleccionadoTitular);
                app.actualizarSeleccionCancha();
                app.actualizarPanelFormulario();
            }
        };

        el.addEventListener("pointerup", finalizarArrastre);
        el.addEventListener("pointercancel", finalizarArrastre);
    };
})();
