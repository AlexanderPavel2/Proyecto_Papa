document.addEventListener("DOMContentLoaded", verificarSesion);

document
    .getElementById("archivoExcel")
    .addEventListener("change", mostrarNombreArchivo);

document
    .getElementById("btnActualizar")
    .addEventListener("click", actualizarExcel);

document
    .getElementById("btnSalir")
    .addEventListener("click", cerrarSesion);

function verificarSesion() {
    const adminLogueado = localStorage.getItem("adminLogueado");

    if (adminLogueado !== "true") {
        window.location.href = "login.html";
    }
}

function mostrarNombreArchivo() {
    const archivo = document.getElementById("archivoExcel").files[0];
    const nombre = document.getElementById("nombreArchivo");

    nombre.textContent = archivo ? archivo.name : "Ningun archivo seleccionado.";
}

async function actualizarExcel() {
    const archivo = document.getElementById("archivoExcel").files[0];
    const resultado = document.getElementById("resultado");
    const boton = document.getElementById("btnActualizar");

    if (!archivo) {
        resultado.className = "error";
        resultado.innerHTML = "Seleccione un archivo Excel antes de continuar.";
        return;
    }

    boton.disabled = true;
    boton.textContent = "Actualizando...";

    resultado.className = "cargando";
    resultado.innerHTML = "Actualizando datos del sistema...";

    try {
        const datos = await importarExcel(archivo);
        const metricasModelo = crearResumenModelo(datos);

        resultado.className = "exito";
        resultado.innerHTML = `
            <h3>Actualizacion realizada correctamente</h3>

            <p><b>Filas del Excel:</b> ${datos.filas_excel}</p>
            <p><b>Registros nuevos:</b> ${datos.registros_nuevos}</p>
            <p><b>Registros existentes:</b> ${datos.registros_existentes}</p>
            <p><b>Total en la base de datos:</b> ${datos.total_bd}</p>
            <p><b>Ultima actualizacion:</b> ${datos.ultima_actualizacion}</p>

            ${metricasModelo}
        `;
    }
    catch (error) {
        console.error(error);

        resultado.className = "error";
        resultado.innerHTML = "Ocurrio un error al actualizar la base de datos.";
    }
    finally {
        boton.disabled = false;
        boton.textContent = "Actualizar base de datos";
    }
}

function crearResumenModelo(datos) {
    if (datos.modelo_actualizado && datos.metricas_modelo) {
        return `
            <h3>Modelo de prediccion actualizado</h3>
            <p><b>Estado del modelo:</b> Actualizado correctamente</p>
            <p><b>MAE:</b> ${datos.metricas_modelo.mae}</p>
            <p><b>RMSE:</b> ${datos.metricas_modelo.rmse}</p>
            <p><b>R2:</b> ${datos.metricas_modelo.r2}</p>
        `;
    }

    return `
        <h3>Modelo de prediccion</h3>
        <p>No se recibio informacion del modelo actualizado.</p>
    `;
}

function cerrarSesion() {
    localStorage.removeItem("adminLogueado");
    localStorage.removeItem("nombreAdministrador");

    window.location.href = "login.html";
}
