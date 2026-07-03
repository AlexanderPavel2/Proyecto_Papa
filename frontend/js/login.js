document
    .getElementById("loginForm")
    .addEventListener("submit", iniciarSesion);

async function iniciarSesion(event) {

    event.preventDefault();

    const usuario = document.getElementById("usuario").value.trim();

    const password = document.getElementById("password").value.trim();

    const mensaje = document.getElementById("mensaje");

    try {

        const respuesta = await login(usuario, password);

        if (respuesta.success) {

            mensaje.style.color = "green";

            mensaje.textContent = `Bienvenido ${respuesta.administrador.nombre}`;

            setTimeout(() => {

                window.location.href = "admin.html";

            }, 1000);

        }

        else {

            mensaje.style.color = "red";

            mensaje.textContent = "Usuario o contraseña incorrectos.";

        }

    }

    catch (error) {

        mensaje.style.color = "red";

        mensaje.textContent = "No se pudo conectar con el servidor.";

        console.error(error);

    }

}