/* ==============================
   Inicializacion
================================ */

document.addEventListener("DOMContentLoaded", iniciarSistema);

let historialCompleto = [];
let graficoPrecios = null;
let prediccionActual = null;

const LIMITE_REGISTROS = 15;

async function iniciarSistema() {
    registrarEventos();
    PapaNegociacion.inicializar();

    await cargarDatosIniciales();
    mostrarUltimosRegistros();
}

function registrarEventos() {
    document
        .getElementById("btnAnalizarNegociacion")
        .addEventListener("click", PapaNegociacion.analizar);

    document
        .getElementById("btnFiltrarFechas")
        .addEventListener("click", filtrarPorFechas);

    document
        .getElementById("btnUltimosRegistros")
        .addEventListener("click", mostrarUltimosRegistros);
}

/* ==============================
   Carga de datos
================================ */

async function cargarDatosIniciales() {
    await cargarUltimaActualizacion();
    await cargarEstadisticas();
    await cargarPrediccion();
    await cargarHistorialCompleto();
}

async function cargarUltimaActualizacion() {
    try {
        const datos = await obtenerUltimaActualizacion();
        renderizarUltimaActualizacion(datos);
    }
    catch (error) {
        console.error(error);
    }
}

async function cargarEstadisticas() {
    try {
        const datos = await obtenerEstadisticas();
        renderizarEstadisticas(datos);
    }
    catch (error) {
        console.error(error);
    }
}

async function cargarPrediccion() {
    const contenedor = document.getElementById("prediccion");

    try {
        prediccionActual = await obtenerPrediccion();
        renderizarPrediccion(prediccionActual);
    }
    catch (error) {
        console.error(error);
        contenedor.innerHTML = `
            <div class="encabezado-seccion">
                <p class="etiqueta">Prediccion</p>
                <h2>No se pudo cargar la prediccion</h2>
            </div>
            ${PapaUtils.crearMensajeError("No se pudo cargar la prediccion.")}
        `;
    }
}

async function cargarHistorialCompleto() {
    try {
        historialCompleto = await obtenerHistorial();
    }
    catch (error) {
        console.error(error);
        historialCompleto = [];
    }
}

/* ==============================
   Renderizado de tarjetas
================================ */

function renderizarUltimaActualizacion(datos) {
    const contenedor = document.getElementById("ultimaActualizacion");

    contenedor.innerHTML = `
        <div>
            <p class="etiqueta">Datos del sistema</p>
            <h2>Ultima actualizacion</h2>
        </div>
        <p><strong>${PapaUtils.formatearFecha(datos.ultima_actualizacion)}</strong></p>
    `;
}

function renderizarEstadisticas(datos) {
    const contenedor = document.getElementById("estadisticas");

    contenedor.innerHTML = `
        <div class="encabezado-seccion">
            <p class="etiqueta">Resumen de mercado</p>
            <h2>Precios de referencia</h2>
            <p>Use estos datos como base antes de vender.</p>
        </div>

        <div class="contenedor-tarjetas">
            ${crearTarjetaPrecio("Precio actual", datos.precio_actual, "Referencia principal para negociar hoy.", true)}
            ${crearTarjetaPrecio("Precio maximo", datos.precio_maximo, "Mayor valor observado en los registros.")}
            ${crearTarjetaPrecio("Precio minimo", datos.precio_minimo, "Menor valor observado en los registros.")}
            ${crearTarjetaPrecio("Precio promedio", datos.precio_promedio, "Promedio historico del conjunto registrado.")}
        </div>
    `;
}

function renderizarPrediccion(datos) {
    const contenedor = document.getElementById("prediccion");

    contenedor.innerHTML = `
        <div class="encabezado-seccion">
            <p class="etiqueta">Prediccion</p>
            <h2>Proyeccion del precio</h2>
            <p>Una referencia adicional para decidir si vender o negociar.</p>
        </div>

        <div class="prediccion-grid">
            <div class="prediccion-resumen">
                <h3>Lectura rapida</h3>
                <p>
                    El precio predicho esta ${PapaUtils.compararValores(datos.precio_predicho, datos.precio_ultimo_registro, "moneda")}
                    frente al ultimo precio registrado.
                </p>
            </div>

            <div class="contenedor-tarjetas">
                ${crearTarjetaPrecio("Ultimo precio registrado", datos.precio_ultimo_registro, `Fecha: ${PapaUtils.formatearFecha(datos.fecha_ultimo_registro)}`, true)}
                ${crearTarjetaPrecio("Precio predicho", datos.precio_predicho, `Fecha estimada: ${PapaUtils.formatearFecha(datos.fecha_prediccion)}`)}
            </div>
        </div>
    `;
}

function crearTarjetaPrecio(titulo, valor, detalle, destacada = false) {
    const claseDestacada = destacada ? " tarjeta-destacada" : "";

    return `
        <article class="tarjeta${claseDestacada}">
            <h3>${titulo}</h3>
            <p>${PapaUtils.formatearMoneda(valor)}</p>
            <small>${detalle}</small>
        </article>
    `;
}

/* ==============================
   Filtros de historial
================================ */

function mostrarUltimosRegistros() {
    const datos = historialCompleto.slice(-LIMITE_REGISTROS);

    document.getElementById("fechaInicio").value = "";
    document.getElementById("fechaFin").value = "";

    if (estaHistorialVacio()) {
        renderizarMensajeHistorial("No hay registros disponibles para mostrar.");
        cargarGrafico([]);
        return;
    }

    cargarTabla(datos);
    cargarGrafico(datos);
}

function filtrarPorFechas() {
    const fechaInicio = document.getElementById("fechaInicio").value;
    const fechaFin = document.getElementById("fechaFin").value;

    if (!fechaInicio || !fechaFin) {
        renderizarMensajeHistorial("Seleccione la fecha inicial y la fecha final.");
        cargarGrafico([]);
        return;
    }

    if (fechaInicio > fechaFin) {
        renderizarMensajeHistorial("La fecha inicial no puede ser mayor que la fecha final.");
        cargarGrafico([]);
        return;
    }

    const datosFiltrados = historialCompleto.filter(registro => {
        return registro.fecha >= fechaInicio && registro.fecha <= fechaFin;
    });

    if (datosFiltrados.length === 0) {
        renderizarMensajeHistorial("No se encontraron registros en el rango seleccionado.");
        cargarGrafico([]);
        return;
    }

    cargarTabla(datosFiltrados);
    cargarGrafico(datosFiltrados);
}

function cargarTabla(datos) {
    const contenedor = document.getElementById("tablaPrecios");
    const filas = datos.map(precio => `
        <tr>
            <td>${PapaUtils.formatearFecha(precio.fecha)}</td>
            <td>${PapaUtils.formatearMoneda(precio.precio_promedio)}</td>
        </tr>
    `).join("");

    contenedor.innerHTML = `
        <div class="encabezado-seccion">
            <p class="etiqueta">Registros consultados</p>
            <h2>Historial de precios</h2>
            <p>Mostrando ${datos.length} registro(s).</p>
        </div>

        <table>
            <thead>
                <tr>
                    <th>Fecha</th>
                    <th>Precio (S/ kg)</th>
                </tr>
            </thead>
            <tbody>
                ${filas}
            </tbody>
        </table>
    `;
}

function renderizarMensajeHistorial(mensaje) {
    document.getElementById("tablaPrecios").innerHTML = `
        <div class="encabezado-seccion">
            <p class="etiqueta">Registros consultados</p>
            <h2>Historial de precios</h2>
        </div>
        ${PapaUtils.crearMensajeError(mensaje)}
    `;
}

/* ==============================
   Grafico
================================ */

async function cargarGrafico(datos) {
    try {
        const datosGrafico = await construirDatosGrafico(datos);
        const ctx = document.getElementById("graficoPrecios").getContext("2d");

        if (graficoPrecios) {
            graficoPrecios.destroy();
        }

        graficoPrecios = new Chart(ctx, {
            type: "line",
            data: {
                labels: datosGrafico.fechas,
                datasets: crearDatasets(datosGrafico)
            },
            options: obtenerOpcionesGrafico()
        });
    }
    catch (error) {
        console.error(error);
    }
}

async function construirDatosGrafico(datos) {
    const fechas = [];
    const preciosHistoricos = [];
    const preciosPrediccion = [];

    datos.forEach(registro => {
        fechas.push(registro.fecha);
        preciosHistoricos.push(registro.precio_promedio);
        preciosPrediccion.push(null);
    });

    const ultimoRegistroGeneral = historialCompleto[historialCompleto.length - 1];
    const ultimoRegistroMostrado = datos[datos.length - 1];
    const debeMostrarPrediccion = datos.length > 0 &&
        ultimoRegistroGeneral &&
        ultimoRegistroMostrado &&
        ultimoRegistroMostrado.fecha === ultimoRegistroGeneral.fecha;

    if (debeMostrarPrediccion) {
        const prediccion = prediccionActual || await obtenerPrediccion();
        const ultimoPrecio = ultimoRegistroMostrado.precio_promedio;

        fechas.push(prediccion.fecha_prediccion);
        preciosHistoricos.push(null);
        preciosPrediccion[preciosPrediccion.length - 1] = ultimoPrecio;
        preciosPrediccion.push(prediccion.precio_predicho);
    }

    return {
        debeMostrarPrediccion,
        fechas,
        preciosHistoricos,
        preciosPrediccion
    };
}

function crearDatasets(datosGrafico) {
    const datasets = [
        {
            label: "Precio historico (S/ kg)",
            data: datosGrafico.preciosHistoricos,
            borderColor: "#2f7d45",
            backgroundColor: "rgba(47, 125, 69, 0.16)",
            borderWidth: 3,
            fill: true,
            tension: 0.3
        }
    ];

    if (datosGrafico.debeMostrarPrediccion) {
        datasets.push({
            label: "Prediccion siguiente fecha",
            data: datosGrafico.preciosPrediccion,
            borderColor: "#c98f2b",
            backgroundColor: "rgba(201, 143, 43, 0.16)",
            borderWidth: 3,
            borderDash: [8, 5],
            fill: false,
            tension: 0.3
        });
    }

    return datasets;
}

function obtenerOpcionesGrafico() {
    return {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                labels: {
                    color: "#263128",
                    font: {
                        weight: "bold"
                    }
                }
            }
        },
        scales: {
            x: {
                ticks: {
                    color: "#657164"
                },
                grid: {
                    color: "rgba(101, 113, 100, 0.14)"
                }
            },
            y: {
                beginAtZero: false,
                ticks: {
                    color: "#657164"
                },
                grid: {
                    color: "rgba(101, 113, 100, 0.14)"
                }
            }
        }
    };
}

/* ==============================
   Utilidades
================================ */

function estaHistorialVacio() {
    return historialCompleto.length === 0;
}
