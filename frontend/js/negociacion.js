/* ==============================
   Asistente de negociacion
================================ */

const PapaNegociacion = (() => {

    const IDS = {
        oferta: "ofertaComprador",
        cantidadKilos: "cantidadKilos",
        resultado: "resultadoNegociacion"
    };

    function inicializar() {
        document.getElementById(IDS.resultado).innerHTML = "";
    }

    async function analizar() {
        const resultado = document.getElementById(IDS.resultado);
        const oferta = PapaUtils.obtenerNumero(document.getElementById(IDS.oferta).value);
        const totalKg = PapaUtils.obtenerNumero(document.getElementById(IDS.cantidadKilos).value);

        if (!oferta || oferta <= 0) {
            resultado.innerHTML = PapaUtils.crearMensajeError("Ingrese una oferta valida del comprador.");
            return;
        }

        if (!totalKg || totalKg <= 0) {
            resultado.innerHTML = PapaUtils.crearMensajeError("Ingrese una cantidad valida de kilos.");
            return;
        }

        try {
            const estadisticas = await obtenerEstadisticas();
            const prediccion = await obtenerPrediccion();

            const analisis = construirAnalisis({
                oferta,
                totalKg,
                precioActual: PapaUtils.obtenerNumero(estadisticas.precio_actual),
                precioPredicho: PapaUtils.obtenerNumero(prediccion.precio_predicho)
            });

            resultado.innerHTML = renderizarResultado(analisis);
        }
        catch (error) {
            console.error(error);
            resultado.innerHTML = PapaUtils.crearMensajeError("No se pudo realizar el analisis de negociacion.");
        }
    }

    function construirAnalisis(datos) {
        const ingresoOferta = datos.totalKg * datos.oferta;
        const ingresoActual = datos.totalKg * datos.precioActual;
        const ingresoPredicho = datos.totalKg * datos.precioPredicho;
        const recomendacion = obtenerRecomendacion(datos);

        return {
            ...datos,
            clase: recomendacion.clase,
            ingresoActual,
            ingresoOferta,
            ingresoPredicho,
            mensaje: recomendacion.mensaje,
            titulo: recomendacion.titulo
        };
    }

    function obtenerRecomendacion(datos) {
        if (datos.oferta < datos.precioActual) {
            return {
                clase: "alerta",
                titulo: "Conviene negociar",
                mensaje: "La oferta esta por debajo del precio actual. Use el precio de mercado como referencia para pedir una mejor propuesta."
            };
        }

        if (datos.precioPredicho > datos.oferta) {
            return {
                clase: "neutral",
                titulo: "Oferta aceptable, con margen",
                mensaje: "La oferta no es baja, pero la prediccion indica que podria mejorar. Revise si le conviene esperar o negociar."
            };
        }

        return {
            clase: "exito",
            titulo: "Oferta favorable",
            mensaje: "La oferta esta alineada con el mercado. Puede considerarla si necesita vender ahora."
        };
    }

    function renderizarResultado(analisis) {
        return `
            <div class="resultado-panel ${analisis.clase}">
                <div class="resultado-encabezado">
                    <h3>${analisis.titulo}</h3>
                    <p>${analisis.mensaje}</p>
                </div>

                <div class="resultado-grid resultado-grid-simple">
                    <article class="resultado-card">
                        <span>Oferta</span>
                        <strong>${PapaUtils.formatearMoneda(analisis.oferta)} / kg</strong>
                        <p>Esta ${PapaUtils.compararValores(analisis.oferta, analisis.precioActual, "moneda")} frente al precio actual.</p>
                    </article>

                    <article class="resultado-card">
                        <span>Cantidad</span>
                        <strong>${PapaUtils.formatearKg(analisis.totalKg)}</strong>
                        <p>Cantidad usada para calcular el ingreso.</p>
                    </article>

                    <article class="resultado-card">
                        <span>Ingreso con oferta</span>
                        <strong>${PapaUtils.formatearMoneda(analisis.ingresoOferta)}</strong>
                        <p>${describirIngreso(analisis.ingresoOferta, analisis.ingresoActual, "precio actual")}</p>
                    </article>

                    <article class="resultado-card">
                        <span>Precio predicho</span>
                        <strong>${PapaUtils.formatearMoneda(analisis.precioPredicho)} / kg</strong>
                        <p>${describirIngreso(analisis.ingresoPredicho, analisis.ingresoOferta, "oferta")}</p>
                    </article>
                </div>
            </div>
        `;
    }

    function describirIngreso(valor, referencia, nombreReferencia) {
        const diferencia = valor - referencia;
        const diferenciaAbsoluta = PapaUtils.formatearMoneda(Math.abs(diferencia));

        if (diferencia > 0) {
            return `Puede representar ${diferenciaAbsoluta} mas que la ${nombreReferencia}.`;
        }

        if (diferencia < 0) {
            return `Puede representar ${diferenciaAbsoluta} menos que la ${nombreReferencia}.`;
        }

        return `Coincide con la ${nombreReferencia}.`;
    }

    return {
        analizar,
        inicializar
    };

})();
