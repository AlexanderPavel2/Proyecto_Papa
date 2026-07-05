/* ==============================
   Utilidades de formato
================================ */

const PapaUtils = (() => {

    function obtenerNumero(valor) {
        return Number(valor) || 0;
    }

    function formatearMoneda(valor) {
        return `S/ ${obtenerNumero(valor).toFixed(2)}`;
    }

    function formatearKg(valor) {
        return `${obtenerNumero(valor).toLocaleString("es-PE", {
            maximumFractionDigits: 2
        })} kg`;
    }

    function formatearFecha(fecha) {
        return fecha || "No registrada";
    }

    function compararValores(valor, referencia, unidad) {
        const diferencia = obtenerNumero(valor) - obtenerNumero(referencia);
        const diferenciaAbsoluta = Math.abs(diferencia);
        const textoDiferencia = unidad === "moneda"
            ? formatearMoneda(diferenciaAbsoluta)
            : diferenciaAbsoluta.toFixed(2);

        if (diferencia > 0) {
            return `por encima en ${textoDiferencia}`;
        }

        if (diferencia < 0) {
            return `por debajo en ${textoDiferencia}`;
        }

        return "igual a la referencia";
    }

    function crearMensajeError(mensaje) {
        return `<p class="mensaje-error">${mensaje}</p>`;
    }

    return {
        compararValores,
        crearMensajeError,
        formatearFecha,
        formatearKg,
        formatearMoneda,
        obtenerNumero
    };

})();
