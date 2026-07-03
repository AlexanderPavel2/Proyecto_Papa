const API = "http://127.0.0.1:8000";


/* ==============================
   Última actualización
================================ */

async function obtenerUltimaActualizacion() {

    const respuesta = await fetch(`${API}/ultima-actualizacion`);

    return await respuesta.json();

}


/* ==============================
   Estadísticas
================================ */

async function obtenerEstadisticas() {

    const respuesta = await fetch(`${API}/estadisticas`);

    return await respuesta.json();

}


/* ==============================
   Historial de precios
================================ */

async function obtenerHistorial() {

    const respuesta = await fetch(`${API}/historial`);

    return await respuesta.json();

}


/* ==============================
   Predicción
================================ */

async function obtenerPrediccion() {

    const respuesta = await fetch(`${API}/prediccion`);

    return await respuesta.json();

}


/* ==============================
   Login
================================ */

async function login(usuario, password) {

    const respuesta = await fetch(`${API}/login`, {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({

            usuario: usuario,

            contraseña: password

        })

    });

    return await respuesta.json();

}


/* ==============================
   Importar Excel
================================ */

async function importarExcel(archivo) {

    const formulario = new FormData();

    formulario.append("archivo", archivo);

    const respuesta = await fetch(`${API}/importar-excel`, {

        method: "POST",

        body: formulario

    });

    const datos = await respuesta.json();

    if (!respuesta.ok) {

        throw new Error(datos.mensaje || "Error al importar el archivo.");

    }

    return datos;

}