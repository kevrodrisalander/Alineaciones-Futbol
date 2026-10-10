const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

function iniciar() {
    const elementos = new Map();
    class Elemento {
        constructor() {
            this.dataset = {}; this.children = []; this.handlers = {};
            this.style = { setProperty() {} };
            this.clases = new Set();
            this.classList = {
                toggle: (nombre, activo) => activo ? this.clases.add(nombre) : this.clases.delete(nombre),
                add: nombre => this.clases.add(nombre), remove: nombre => this.clases.delete(nombre)
            };
        }
        addEventListener(tipo, fn) { this.handlers[tipo] = fn; }
        replaceChildren(...hijos) { this.children = hijos; }
        append(...hijos) { this.children.push(...hijos); }
        appendChild(hijo) { hijo.parent = this; this.children.push(hijo); }
        setAttribute(nombre, valor) { this[nombre] = valor; }
        querySelectorAll(selector) {
            return this.children.filter(hijo => hijo.className?.split(' ').includes(selector.slice(1)));
        }
        remove() { this.parent.children = this.parent.children.filter(hijo => hijo !== this); }
        focus() { contexto.document.activeElement = this; }
        setPointerCapture() {}
        getBoundingClientRect() { return { left: 0, top: 0, width: 700, height: 1000 }; }
    }
    const contexto = {
        window: {}, confirm: () => true,
        requestAnimationFrame(fn) { this.frame = fn; return 1; },
        cancelAnimationFrame() {},
        localStorage: { getItem: () => null, setItem(clave, valor) { this.valor = valor; } },
        document: {
            getElementById(id) {
                if (!elementos.has(id)) elementos.set(id, new Elemento());
                return elementos.get(id);
            },
            createElement: () => new Elemento(), createTextNode: texto => texto,
            documentElement: new Elemento()
        }
    };
    vm.createContext(contexto);
    const html = fs.readFileSync(path.join(__dirname, '..', 'tablero.html'), 'utf8');
    const scripts = [...html.matchAll(/<script src="([^"]+)"><\/script>/g)].map(match => match[1]);
    for (const archivo of scripts) {
        let fuente = fs.readFileSync(path.join(__dirname, '..', archivo), 'utf8');
        vm.runInContext(fuente, contexto);
    }
    const app = contexto.window.Pizarra;
    const api = {
        ...app,
        get jugadores() { return app.datos.jugadores; },
        get invalido() { return app.datos.almacenamientoInvalido; },
        seleccionar(titular, banca) {
            app.datos.seleccionadoTitular = titular;
            app.datos.seleccionadoBanca = banca;
            app.actualizarJugadorEdicion(banca || titular);
        }
    };
    api.guardarStorage();
    return { contexto, elementos, api, datos: JSON.parse(contexto.localStorage.valor) };
}

test('el tablero carga la plantilla de equipo antes de iniciar la aplicación', () => {
    const { contexto, api } = iniciar();
    const plantilla = contexto.window.PLANTILLAS_EQUIPO['real-madrid'];
    assert.equal(plantilla.length, 24);
    assert.equal(plantilla.filter(jugador => jugador.esTitular).length, 11);
    assert.equal(new Set(plantilla.map(jugador => jugador.numero)).size, 24);
    assert.equal(api.jugadores[0].nombre, 'Courtois');
    assert.equal(api.jugadores[11].nombre, 'Lunin');
    api.cargarPlantilla('real-madrid');
    assert.notEqual(api.jugadores[0], plantilla[0]);
    api.jugadores[0].nombre = 'Editado';
    assert.equal(plantilla[0].nombre, 'Courtois');
});

test('guarda versión 2 y acepta datos anteriores sin versión ni puestos', () => {
    const { api, datos } = iniciar();
    assert.equal(datos.version, 2);
    assert.ok(api.validarDatosGuardados(datos));
    delete datos.version;
    datos.jugadores.forEach(jugador => { delete jugador.puestoId; });
    assert.ok(api.validarDatosGuardados(datos));
    datos.version = 99;
    assert.equal(api.validarDatosGuardados(datos), null);
});

test('valida cambios encadenados, reingresos y migración de historial antiguo', () => {
    const { api, contexto } = iniciar();
    const a = api.jugadores[0], b = api.jugadores[11], c = api.jugadores[12];
    for (const [sale, entra] of [[a, b], [b, c], [c, a]]) {
        api.seleccionar(sale, entra); api.efectuarSustitucion();
        assert.ok(api.validarDatosGuardados(JSON.parse(contexto.localStorage.valor)));
    }
    const datos = JSON.parse(contexto.localStorage.valor);
    delete datos.version;
    datos.historialCambios.forEach(cambio => { delete cambio.puestoId; });
    datos.jugadores.forEach(jugador => { delete jugador.puestoId; });
    assert.equal(api.validarDatosGuardados(datos).historialCambios[0].puestoId, '1');
});

test('rechaza historial imposible, contador incorrecto, puestos y titulares incoherentes', () => {
    const { api, contexto } = iniciar();
    api.seleccionar(api.jugadores[0], api.jugadores[11]); api.efectuarSustitucion();
    const base = JSON.parse(contexto.localStorage.valor);
    const mutaciones = [
        d => { d.historialCambios[0].sale = 13; },
        d => { d.historialCambios[0].entra = 2; },
        d => { d.historialCambios[0].puestoId = '2'; },
        d => { d.cambiosRealizados = 4; },
        d => { d.historialCambios.push(d.historialCambios[0]); d.cambiosRealizados++; },
        d => { d.historialCambios = Array(6).fill(d.historialCambios[0]); d.cambiosRealizados = 6; },
        d => { d.jugadores[11].puestoId = '2'; },
        d => { d.jugadores[0].esTitular = true; d.jugadores[11].esTitular = false; }
    ];
    for (const mutar of mutaciones) {
        const datos = structuredClone(base); mutar(datos);
        assert.equal(api.validarDatosGuardados(datos), null);
    }
});

test('coordenadas null no se convierten en posiciones de borde', () => {
    const { api, datos } = iniciar();
    datos.jugadores[0].x = null; datos.jugadores[0].y = null;
    assert.equal(api.validarDatosGuardados(datos).jugadores[0].x, undefined);
});

test('fallos de guardado permanecen visibles en las acciones de la interfaz', () => {
    const { api, contexto, elementos } = iniciar();
    contexto.localStorage.setItem = () => { throw new Error('QuotaExceededError'); };
    const comprobar = () => assert.match(elementos.get('estado').textContent, /No se pudo guardar/);
    assert.equal(api.guardarStorage(), false); comprobar();
    api.cambiarCamisa('barcelona'); comprobar();
    api.cargarPlantilla('blanco'); comprobar();
    api.asignarCapitan(api.jugadores[0]); comprobar();
    api.seleccionar(api.jugadores[0], api.jugadores[11]);
    elementos.get('nombreJugador').value = 'Editado';
    elementos.get('posicionJugador').value = 'POR';
    elementos.get('formulario').handlers.submit({ preventDefault() {} }); comprobar();
    api.efectuarSustitucion(); comprobar();
    elementos.get('restablecer').handlers.click(); comprobar();
});

test('JSON corrupto se detecta sin bloquear la sesión', () => {
    const { api, contexto } = iniciar();
    contexto.localStorage.getItem = () => '{';
    api.cargarStorage();
    assert.equal(api.invalido, true);
    assert.equal(api.jugadores.length, 24);
});

test('Atlético carga sus dorsales reales y conserva puestos, capitán y guardado al sustituir', () => {
    const { api, contexto, elementos } = iniciar();
    api.cambiarCamisa('atletico');
    assert.equal(elementos.get('btnPlantillaEquipo').disabled, false);
    elementos.get('btnPlantillaEquipo').handlers.click();
    assert.equal(api.jugadores.length, 24);
    assert.equal(new Set(api.jugadores.map(jugador => jugador.numero)).size, 24);
    assert.equal(api.jugadores[0].numero, 13);
    assert.equal(api.jugadores[0].puestoId, '1');
    assert.equal(api.jugadores.find(jugador => jugador.esCapitan).numero, 6);
    assert.equal(api.jugadores.filter(jugador => jugador.esTitular).length, 11);
    api.seleccionar(api.jugadores.find(jugador => jugador.numero === 6),
        api.jugadores.find(jugador => jugador.numero === 5));
    api.efectuarSustitucion();
    elementos.get('selectFormacion').handlers.change({ target: { value: '4-4-2' } });
    const datos = JSON.parse(contexto.localStorage.valor);
    assert.equal(datos.plantilla, 'atletico');
    assert.ok(api.validarDatosGuardados(datos));
    contexto.localStorage.getItem = () => JSON.stringify(datos);
    api.cargarStorage();
    assert.equal(api.jugadores.find(jugador => jugador.esCapitan).numero, 5);
    assert.equal(api.jugadores.find(jugador => jugador.numero === 5).puestoId, '6');
});

test('seleccionar y editar un suplente conserva foco y selección para sustituir', () => {
    const { contexto, api, elementos } = iniciar();
    const titular = elementos.get('cancha').querySelectorAll('.jugador')[0];
    titular.handlers.keydown({ key: 'Enter', preventDefault() {} });
    const banca = elementos.get('bancaGrid'), boton = banca.children[0];
    boton.focus(); boton.handlers.click();
    assert.equal(contexto.document.activeElement, boton);
    assert.equal(banca.children[0], boton);
    assert.equal(boton['aria-pressed'], 'true');
    assert.equal(elementos.get('nombreJugador').value, 'Lunin');
    assert.equal(elementos.get('btnSustituir').disabled, false);
    elementos.get('nombreJugador').value = 'Suplente editado';
    elementos.get('posicionJugador').value = 'POR';
    elementos.get('formulario').handlers.submit({ preventDefault() {} });
    assert.equal(api.jugadores[0].nombre, 'Courtois');
    assert.equal(api.jugadores[11].nombre, 'Suplente editado');
});

test('teclado y formación mantienen puestos después de sustituir', () => {
    const { api, contexto, elementos } = iniciar();
    const cancha = elementos.get('cancha'), boton = cancha.querySelectorAll('.jugador')[0];
    boton.handlers.keydown({ key: 'ArrowUp', shiftKey: true, preventDefault() {} });
    assert.equal(api.jugadores[0].y, 85);
    api.seleccionar(api.jugadores[0], api.jugadores[11]); api.efectuarSustitucion();
    elementos.get('selectFormacion').handlers.change({ target: { value: '4-4-2' } });
    assert.equal(api.jugadores[11].puestoId, '1');
    assert.equal(api.jugadores[11].y, 90);
    assert.equal(cancha.querySelectorAll('.jugador').length, 11);
    assert.ok(api.validarDatosGuardados(JSON.parse(contexto.localStorage.valor)));
});

test('arrastre aplica la posición pendiente y la guarda al terminar', () => {
    const { api, contexto, elementos } = iniciar();
    const boton = elementos.get('cancha').querySelectorAll('.jugador')[0];
    const evento = { button: 0, pointerId: 1, clientX: 350, clientY: 900,
        preventDefault() {}, stopPropagation() {} };
    boton.handlers.pointerdown(evento);
    boton.handlers.pointermove({ ...evento, clientX: 420, clientY: 800 });
    boton.handlers.pointerup(evento);
    assert.equal(api.jugadores[0].x, 60);
    assert.equal(api.jugadores[0].y, 80);
    assert.equal(contexto.window.Pizarra.datos.arrastre, null);
    assert.equal(JSON.parse(contexto.localStorage.valor).jugadores[0].x, 60);
});
