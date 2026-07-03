document.addEventListener("DOMContentLoaded", iniciarSistema);


/* ==============================
   Variables globales
================================ */

let historialCompleto = [];

let graficoPrecios = null;

const LIMITE_REGISTROS = 15;


/* ==============================
   Inicio del sistema
================================ */

async function iniciarSistema() {

    await cargarUltimaActualizacion();

    await cargarEstadisticas();

    await cargarPrediccion();

    await cargarHistorialCompleto();

    mostrarUltimosRegistros();

    document
        .getElementById("btnAnalizarNegociacion")
        .addEventListener("click", analizarNegociacion);

    document
        .getElementById("btnFiltrarFechas")
        .addEventListener("click", filtrarPorFechas);

    document
        .getElementById("btnUltimosRegistros")
        .addEventListener("click", mostrarUltimosRegistros);

}


/* ==============================
   Última actualización
================================ */

async function cargarUltimaActualizacion() {

    try {

        const datos = await obtenerUltimaActualizacion();

        const contenedor =
            document.getElementById("ultimaActualizacion");

        contenedor.innerHTML = `

            <h2>Última actualización</h2>

            <p>
                ${datos.ultima_actualizacion || "No registrada"}
            </p>

        `;

    }

    catch (error) {

        console.error(error);

    }

}


/* ==============================
   Estadísticas
================================ */

async function cargarEstadisticas() {

    try {

        const datos = await obtenerEstadisticas();

        const contenedor =
            document.getElementById("estadisticas");

        contenedor.innerHTML = `

            <div class="contenedor-tarjetas">

                <div class="tarjeta">

                    <h3>Precio Actual</h3>

                    <p>S/ ${Number(datos.precio_actual).toFixed(2)}</p>

                </div>

                <div class="tarjeta">

                    <h3>Precio Máximo</h3>

                    <p>S/ ${Number(datos.precio_maximo).toFixed(2)}</p>

                </div>

                <div class="tarjeta">

                    <h3>Precio Mínimo</h3>

                    <p>S/ ${Number(datos.precio_minimo).toFixed(2)}</p>

                </div>

                <div class="tarjeta">

                    <h3>Precio Promedio</h3>

                    <p>S/ ${Number(datos.precio_promedio).toFixed(2)}</p>

                </div>

            </div>

        `;

    }

    catch (error) {

        console.error(error);

    }

}


/* ==============================
   Predicción
================================ */

async function cargarPrediccion() {

    try {

        const datos = await obtenerPrediccion();

        const contenedor =
            document.getElementById("prediccion");

        contenedor.innerHTML = `

            <h2>Predicción del Precio</h2>

            <div class="contenedor-tarjetas">

                <div class="tarjeta">

                    <h3>Último Precio Registrado</h3>

                    <p>S/ ${Number(datos.precio_ultimo_registro).toFixed(2)}</p>

                    <small>
                        Fecha: ${datos.fecha_ultimo_registro}
                    </small>

                </div>

                <div class="tarjeta">

                    <h3>Precio Predicho</h3>

                    <p>S/ ${Number(datos.precio_predicho).toFixed(2)}</p>

                    <small>
                        Fecha estimada: ${datos.fecha_prediccion}
                    </small>

                </div>

            </div>

        `;

    }

    catch (error) {

        console.error(error);

        const contenedor =
            document.getElementById("prediccion");

        contenedor.innerHTML = `

            <h2>Predicción del Precio</h2>

            <p class="mensaje-error">
                No se pudo cargar la predicción.
            </p>

        `;

    }

}


/* ==============================
   Cargar historial completo
================================ */

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
   Mostrar últimos registros
================================ */

function mostrarUltimosRegistros() {

    const datos =
        historialCompleto.slice(-LIMITE_REGISTROS);

    document.getElementById("fechaInicio").value = "";

    document.getElementById("fechaFin").value = "";

    cargarTabla(datos);

    cargarGrafico(datos);

}


/* ==============================
   Filtrar por fechas
================================ */

function filtrarPorFechas() {

    const fechaInicio =
        document.getElementById("fechaInicio").value;

    const fechaFin =
        document.getElementById("fechaFin").value;

    if (!fechaInicio || !fechaFin) {

        document.getElementById("tablaPrecios").innerHTML = `

            <h2>Historial de Precios</h2>

            <p class="mensaje-error">
                Seleccione la fecha inicial y la fecha final.
            </p>

        `;

        cargarGrafico([]);

        return;

    }

    if (fechaInicio > fechaFin) {

        document.getElementById("tablaPrecios").innerHTML = `

            <h2>Historial de Precios</h2>

            <p class="mensaje-error">
                La fecha inicial no puede ser mayor que la fecha final.
            </p>

        `;

        cargarGrafico([]);

        return;

    }

    const datosFiltrados =
        historialCompleto.filter(registro => {

            return registro.fecha >= fechaInicio &&
                   registro.fecha <= fechaFin;

        });

    if (datosFiltrados.length === 0) {

        document.getElementById("tablaPrecios").innerHTML = `

            <h2>Historial de Precios</h2>

            <p class="mensaje-error">
                No se encontraron registros en el rango seleccionado.
            </p>

        `;

        cargarGrafico([]);

        return;

    }

    cargarTabla(datosFiltrados);

    cargarGrafico(datosFiltrados);

}


/* ==============================
   Tabla de precios
================================ */

function cargarTabla(datos) {

    const contenedor =
        document.getElementById("tablaPrecios");

    let tabla = `

        <h2>Historial de Precios</h2>

        <p>
            Mostrando ${datos.length} registro(s).
        </p>

        <table>

            <thead>

                <tr>
                    <th>Fecha</th>
                    <th>Precio (S/ Kg)</th>
                </tr>

            </thead>

            <tbody>

    `;

    datos.forEach(precio => {

        tabla += `

            <tr>
                <td>${precio.fecha}</td>
                <td>S/ ${Number(precio.precio_promedio).toFixed(2)}</td>
            </tr>

        `;

    });

    tabla += `

            </tbody>

        </table>

    `;

    contenedor.innerHTML = tabla;

}


/* ==============================
   Gráfico de precios
================================ */

async function cargarGrafico(datos) {

    try {

        const fechas = [];

        const preciosHistoricos = [];

        const preciosPrediccion = [];

        datos.forEach(registro => {

            fechas.push(registro.fecha);

            preciosHistoricos.push(registro.precio_promedio);

            preciosPrediccion.push(null);

        });

        const ultimoRegistroGeneral =
            historialCompleto[historialCompleto.length - 1];

        const ultimoRegistroMostrado =
            datos[datos.length - 1];

        const debeMostrarPrediccion =
            datos.length > 0 &&
            ultimoRegistroGeneral &&
            ultimoRegistroMostrado &&
            ultimoRegistroMostrado.fecha === ultimoRegistroGeneral.fecha;

        if (debeMostrarPrediccion) {

            const prediccion =
                await obtenerPrediccion();

            const ultimoPrecio =
                ultimoRegistroMostrado.precio_promedio;

            fechas.push(prediccion.fecha_prediccion);

            preciosHistoricos.push(null);

            preciosPrediccion[preciosPrediccion.length - 1] =
                ultimoPrecio;

            preciosPrediccion.push(prediccion.precio_predicho);

        }

        const ctx = document
            .getElementById("graficoPrecios")
            .getContext("2d");

        if (graficoPrecios) {

            graficoPrecios.destroy();

        }

        const datasets = [

            {
                label: "Precio histórico (S/ Kg)",
                data: preciosHistoricos,
                borderColor: "#2E7D32",
                backgroundColor: "rgba(46,125,50,0.15)",
                borderWidth: 3,
                fill: true,
                tension: 0.3
            }

        ];

        if (debeMostrarPrediccion) {

            datasets.push({

                label: "Predicción siguiente semana",
                data: preciosPrediccion,
                borderColor: "#F57C00",
                backgroundColor: "rgba(245,124,0,0.15)",
                borderWidth: 3,
                borderDash: [8, 5],
                fill: false,
                tension: 0.3

            });

        }

        graficoPrecios = new Chart(ctx, {

            type: "line",

            data: {

                labels: fechas,

                datasets: datasets

            },

            options: {

                responsive: true,

                maintainAspectRatio: false,

                plugins: {

                    legend: {
                        display: true
                    }

                },

                scales: {

                    y: {
                        beginAtZero: false
                    }

                }

            }

        });

    }

    catch (error) {

        console.error(error);

    }

}


/* ==============================
   Asistente de negociación
================================ */

async function analizarNegociacion() {

    const oferta =
        Number(document.getElementById("ofertaComprador").value);

    const cantidad =
        Number(document.getElementById("cantidadKilos").value);

    const resultado =
        document.getElementById("resultadoNegociacion");

    if (!oferta || oferta <= 0) {

        resultado.innerHTML = `

            <p class="mensaje-error">
                Ingrese una oferta válida del comprador.
            </p>

        `;

        return;

    }

    if (!cantidad || cantidad <= 0) {

        resultado.innerHTML = `

            <p class="mensaje-error">
                Ingrese una cantidad válida de kilos.
            </p>

        `;

        return;

    }

    try {

        const estadisticas =
            await obtenerEstadisticas();

        const prediccion =
            await obtenerPrediccion();

        const precioActual =
            Number(estadisticas.precio_actual);

        const precioPredicho =
            Number(prediccion.precio_predicho);

        const diferenciaOferta =
            oferta - precioActual;

        const ingresoOferta =
            cantidad * oferta;

        const ingresoActual =
            cantidad * precioActual;

        const ingresoPredicho =
            cantidad * precioPredicho;

        const diferenciaIngresoActual =
            ingresoOferta - ingresoActual;

        const diferenciaIngresoPredicho =
            ingresoPredicho - ingresoOferta;

        let claseMensaje = "";

        let tituloRecomendacion = "";

        let mensajeRecomendacion = "";

        if (oferta < precioActual) {

            claseMensaje = "mensaje-alerta";

            tituloRecomendacion = "Se recomienda negociar";

            mensajeRecomendacion = `
                La oferta del comprador está por debajo del precio actual del mercado.
                El agricultor podría usar el precio actual como referencia para pedir una mejor oferta.
            `;

        }

        else if (precioPredicho > precioActual && precioPredicho > oferta) {

            claseMensaje = "mensaje-neutral";

            tituloRecomendacion = "Podría negociar un mejor precio";

            mensajeRecomendacion = `
                La oferta es aceptable frente al precio actual, pero el precio predicho es mayor.
                El agricultor podría negociar considerando la posible subida del precio.
            `;

        }

        else {

            claseMensaje = "mensaje-exito";

            tituloRecomendacion = "Oferta favorable";

            mensajeRecomendacion = `
                La oferta del comprador está igual o por encima del precio actual.
                El agricultor podría considerar aceptar la oferta si le resulta conveniente.
            `;

        }

        resultado.innerHTML = `

            <div class="${claseMensaje}">

                <h3>${tituloRecomendacion}</h3>

                <p>
                    ${mensajeRecomendacion}
                </p>

                <br>

                <h4>Comparación de precios</h4>

                <p>
                    Precio actual del mercado:
                    <b>S/ ${precioActual.toFixed(2)} por kg</b>
                </p>

                <p>
                    Precio predicho:
                    <b>S/ ${precioPredicho.toFixed(2)} por kg</b>
                </p>

                <p>
                    Oferta del comprador:
                    <b>S/ ${oferta.toFixed(2)} por kg</b>
                </p>

                <p>
                    Diferencia frente al precio actual:
                    <b>S/ ${diferenciaOferta.toFixed(2)} por kg</b>
                </p>

                <br>

                <h4>Simulación de ingresos</h4>

                <p>
                    Cantidad ingresada:
                    <b>${cantidad.toFixed(0)} kg</b>
                </p>

                <p>
                    Ingreso con oferta del comprador:
                    <b>S/ ${ingresoOferta.toFixed(2)}</b>
                </p>

                <p>
                    Ingreso según precio actual:
                    <b>S/ ${ingresoActual.toFixed(2)}</b>
                </p>

                <p>
                    Ingreso según precio predicho:
                    <b>S/ ${ingresoPredicho.toFixed(2)}</b>
                </p>

                <br>

                <h4>Diferencias estimadas</h4>

                <p>
                    Diferencia entre oferta y precio actual:
                    <b>S/ ${diferenciaIngresoActual.toFixed(2)}</b>
                </p>

                <p>
                    Diferencia entre precio predicho y oferta:
                    <b>S/ ${diferenciaIngresoPredicho.toFixed(2)}</b>
                </p>

            </div>

        `;

    }

    catch (error) {

        console.error(error);

        resultado.innerHTML = `

            <p class="mensaje-error">
                No se pudo realizar el análisis de negociación.
            </p>

        `;

    }

}