document.addEventListener("DOMContentLoaded", iniciarSistema);


async function iniciarSistema() {

    await cargarUltimaActualizacion();
    
    await cargarEstadisticas();

    await cargarHistorial();

    await cargarGrafico();

}


async function cargarUltimaActualizacion() {

    try {

        const datos = await obtenerUltimaActualizacion();

        const contenedor = document.getElementById("ultimaActualizacion");

        contenedor.innerHTML = `
        
            <h2>Última actualización</h2>

            <p>${datos.ultima_actualizacion}</p>

        `;

    }

    catch(error){

        console.error(error);

    }

}

async function cargarEstadisticas() {

    try {

        const datos = await obtenerEstadisticas();

        const contenedor = document.getElementById("estadisticas");

        contenedor.innerHTML = `

            <div class="contenedor-tarjetas">

                <div class="tarjeta">

                    <h3>Precio Actual</h3>

                    <p>S/ ${datos.precio_actual}</p>

                </div>

                <div class="tarjeta">

                    <h3>Precio Máximo</h3>

                    <p>S/ ${datos.precio_maximo}</p>

                </div>

                <div class="tarjeta">

                    <h3>Precio Mínimo</h3>

                    <p>S/ ${datos.precio_minimo}</p>

                </div>

                <div class="tarjeta">

                    <h3>Precio Promedio</h3>

                    <p>S/ ${datos.precio_promedio}</p>

                </div>

            </div>

        `;

    }

    catch(error){

        console.error(error);

    }

}

async function cargarHistorial(){

    try{

        const datos = await obtenerHistorial();

        const contenedor = document.getElementById("tablaPrecios");

        let tabla = `
            <h2>Historial de Precios</h2>

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

    catch(error){

        console.error(error);

    }

}

async function cargarGrafico(){

    try{

        const datos = await obtenerHistorial();

        const fechas = [];

        const precios = [];

        datos.forEach(registro=>{

            fechas.push(registro.fecha);

            precios.push(registro.precio_promedio);

        });

        const ctx = document
            .getElementById("graficoPrecios")
            .getContext("2d");

        new Chart(ctx,{

            type:"line",

            data:{

                labels:fechas,

                datasets:[{

                    label:"Precio promedio (S/ Kg)",

                    data:precios,

                    borderColor:"#2E7D32",

                    backgroundColor:"rgba(46,125,50,0.15)",

                    borderWidth:3,

                    fill:true,

                    tension:0.3

                }]

            },

            options:{

                responsive:true,

                maintainAspectRatio:false,

                plugins:{

                    legend:{

                        display:true

                    }

                },

                scales:{

                    y:{

                        beginAtZero:false

                    }

                }

            }

        });

    }

    catch(error){

        console.error(error);

    }

} 