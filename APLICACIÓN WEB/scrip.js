const botonCrear = document.getElementById("btnIngresar");
const botonIniciar = document.getElementById("btnIniciarSesion");

const URL_APPS_SCRIPT =
    "https://script.google.com/macros/s/AKfycbwBrNoF3at8stflx_ykSv394wzDHX41S5LbM78KvATu2jH-zAbbiCCcz7AozVyBCPIv/exec";

// CREAR CUENTA
botonCrear.addEventListener("click", async function() {
    const usuario = document.getElementById("usuario").value.trim();
    const correo = document.getElementById("correo").value.trim();
    const nombre = document.getElementById("nombre").value.trim();
    const contrasena = document.getElementById("contrasena").value.trim();
    const mensaje = document.getElementById("mensaje");

    if (!usuario || !correo || !nombre || !contrasena) {
        mensaje.textContent = "Por favor, complete todos los campos.";
        return;
    }

    mensaje.textContent = "Guardando cuenta...";

    const datos = {
        accion: "crear_usuario",
        usuario_login: usuario,
        correo: correo,
        nombre: nombre,
        contrasena: contrasena
    };

    try {
        const respuesta = await fetch(URL_APPS_SCRIPT, {
            method: "POST",
            body: JSON.stringify(datos)
        });

        const resultado = await respuesta.json();

        if (!resultado.correcto) {
            mensaje.textContent = resultado.mensaje;
            return;
        }

        // Guardo la sesión solo en esta ventana
        sessionStorage.setItem("usuario", usuario);
        sessionStorage.setItem("correo", correo);
        sessionStorage.setItem("nombre", nombre);
        sessionStorage.setItem("usuarioNombre", nombre);

        mensaje.textContent = "Cuenta creada correctamente.";

        setTimeout(function() {
            window.location.href = "segunda.html";
        }, 500);

    } catch (error) {
        console.error(error);
        mensaje.textContent = "No se pudo conectar, intentelo de nuevo.";
    }
});

// INICIAR SESIÓN
botonIniciar.addEventListener("click", async function() {
    const usuario = document.getElementById("usuario").value.trim();
    const contrasena = document.getElementById("contrasena").value.trim();
    const mensaje = document.getElementById("mensaje");

    if (!usuario || !contrasena) {
        mensaje.textContent = "Ingrese su usuario y contraseña.";
        return;
    }

    mensaje.textContent = "Verificando datos...";

    try {
        const respuesta = await fetch(URL_APPS_SCRIPT);
        const datos = await respuesta.json();

        const usuarioEncontrado = datos.usuarios.find(function(usuarioSheets) {
            return (
                usuarioSheets.usuario_login === usuario &&
                usuarioSheets.contrasena === contrasena &&
                usuarioSheets.estado === "Activo"
            );
        });

        if (usuarioEncontrado) {

            // Guardo la sesión solo en esta ventana
            sessionStorage.setItem(
                "usuario",
                usuarioEncontrado.usuario_login
            );

            sessionStorage.setItem(
                "correo",
                usuarioEncontrado.correo
            );

            sessionStorage.setItem(
                "nombre",
                usuarioEncontrado.nombre
            );

            sessionStorage.setItem(
                "usuarioNombre",
                usuarioEncontrado.nombre
            );

            mensaje.textContent = "Inicio de sesión correcto.";

            setTimeout(function() {
                window.location.href = "segunda.html";
            }, 500);

        } else {
            mensaje.textContent = "Usuario inactivo o contraseña incorrecta.";
        }

    } catch (error) {
        console.error(error);
        mensaje.textContent = "No se pudo conectar, intentelo de nuevo.";
    }
});