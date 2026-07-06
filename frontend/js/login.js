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
            localStorage.setItem("adminLogueado", "true");
            localStorage.setItem("nombreAdministrador", respuesta.administrador.nombre);

            mensaje.style.color = "green";
            mensaje.textContent = `Bienvenido ${respuesta.administrador.nombre}`;

            setTimeout(() => {
                window.location.href = "admin.html";
            }, 1000);

            return;
        }

        localStorage.removeItem("adminLogueado");
        localStorage.removeItem("nombreAdministrador");

        mensaje.style.color = "red";
        mensaje.textContent = "Usuario o contrasena incorrectos.";
    }
    catch (error) {
        localStorage.removeItem("adminLogueado");
        localStorage.removeItem("nombreAdministrador");

        mensaje.style.color = "red";
        mensaje.textContent = "No se pudo conectar con el servidor.";

        console.error(error);
    }
}
