console.log("🔵 admin.js cargado");

window.addEventListener("beforeunload", () => {
    console.log("🔴 LA PÁGINA SE ESTÁ RECARGANDO");
});

document
.getElementById("archivoExcel")
.addEventListener("change", mostrarNombreArchivo);

document
.getElementById("btnActualizar")
.addEventListener("click", actualizarExcel);

document
.getElementById("btnSalir")
.addEventListener("click", cerrarSesion);

function mostrarNombreArchivo(){

    const archivo =
        document.getElementById("archivoExcel").files[0];

    const nombre =
        document.getElementById("nombreArchivo");

    if(archivo){

        nombre.textContent = archivo.name;

    }

    else{

        nombre.textContent = "Ningún archivo seleccionado.";

    }

}

async function actualizarExcel(){

    const archivo =
        document.getElementById("archivoExcel").files[0];

    const resultado =
        document.getElementById("resultado");

    const boton =
        document.getElementById("btnActualizar");

    if(!archivo){

        resultado.className = "error";

        resultado.innerHTML = `
            Seleccione un archivo Excel antes de continuar.
        `;

        return;

    }

    boton.disabled = true;

    boton.textContent = "Actualizando...";

    resultado.className = "cargando";

    resultado.innerHTML = `
        Actualizando la base de datos...
    `;

    try{

        const datos =
            await importarExcel(archivo);

        resultado.className = "exito";

        resultado.innerHTML = `

            <h3>Actualización realizada correctamente</h3>

            <br>

            <p><b>Filas del Excel:</b> ${datos.filas_excel}</p>

            <p><b>Registros nuevos:</b> ${datos.registros_nuevos}</p>

            <p><b>Registros existentes:</b> ${datos.registros_existentes}</p>

            <p><b>Total en la base de datos:</b> ${datos.total_bd}</p>

            <p><b>Última actualización:</b> ${datos.ultima_actualizacion}</p>

        `;

    }

    catch(error){

        console.error(error);

        resultado.className = "error";

        resultado.innerHTML = `
            Ocurrió un error al actualizar la base de datos.
        `;

    }

    finally{

        boton.disabled = false;

        boton.textContent = "Actualizar Base de Datos";

    }

}

function cerrarSesion(){

    window.location.href = "login.html";

}