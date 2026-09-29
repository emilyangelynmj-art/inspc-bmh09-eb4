const usuario = sessionStorage.getItem("usuario");
const nombre = sessionStorage.getItem("nombre");

document.getElementById("usuario").textContent = usuario;

const ahora = new Date();

document.getElementById("fecha").textContent =
    ahora.toLocaleDateString("es-HN");

document.getElementById("hora").textContent =
    ahora.toLocaleTimeString("es-HN");

const url =
    "https://script.google.com/macros/s/AKfycbwBrNoF3at8stflx_ykSv394wzDHX41S5LbM78KvATu2jH-zAbbiCCcz7AozVyBCPIv/exec";

cerrarSesion.onclick=()=>{
    const confirmar=confirm(
        "¿Desea cerrar sesión?"
    );

    if(!confirmar){
        return;
    }

    localStorage.removeItem(claveRespuestas);
    sessionStorage.clear();
    window.location.href="index.html";
};

const listaFormularios =
    document.getElementById("formulario");

fetch(url)
.then(function(respuesta) {
    return respuesta.json();
})
.then(function(datos) {
    datos.formularios.forEach(function(formulario) {
        const opcion = document.createElement("option");

        opcion.value = formulario.id;
        opcion.textContent = formulario.nombre;
        opcion.dataset.periodicidad = formulario.periodicidadM

        listaFormularios.appendChild(opcion);
    });
})
.catch(function(error) {
    console.log("Error al cargar los formularios:", error);
});

const boton = document.getElementById("btnComenzar");

boton.addEventListener("click", function() {

    boton.addEventListener("click", function() {

    const formulario =
        document.getElementById("formulario").value;

    const area =
        document.getElementById("area").value.trim();

    if (formulario === "") {
        document.getElementById("mensaje").textContent =
            "Por favor, seleccione un formulario.";
        return;
    }

    if (area === "") {
        document.getElementById("mensaje").textContent =
            "Por favor, escriba un área.";
        return;
    }

    const opcionSeleccionada =
        document.getElementById("formulario").selectedOptions[0];

    const periodicidad =
        opcionSeleccionada ? opcionSeleccionada.dataset.periodicidad || "" : "";

    sessionStorage.setItem("usuario", usuario);
    sessionStorage.setItem("nombre", nombre);
    sessionStorage.setItem("formulario", formulario);
    sessionStorage.setItem("periodicidad", periodicidad);
    sessionStorage.setItem("area", area);
    sessionStorage.setItem(
        "fechaInicio",
        ahora.toLocaleDateString("es-HN")
    );
    sessionStorage.setItem(
        "horaInicio",
        ahora.toLocaleTimeString("es-HN")
    );

    window.location.href = "tercera.html";
});

    const area =
        document.getElementById("area").value.trim();

    if (formulario === "") {
        document.getElementById("mensaje").textContent =
            "Por favor, seleccione un formulario.";
        return;
    }

    if (area === "") {
        document.getElementById("mensaje").textContent =
            "Por favor, escriba un área.";
        return;
    }

    // Guardo los datos solo en esta ventana
    sessionStorage.setItem("usuario", usuario);
    sessionStorage.setItem("nombre", nombre);
    sessionStorage.setItem("formulario", formulario);
    sessionStorage.setItem("area", area);
     sessionStorage.setItem("periodicidad", periodicidad);
    sessionStorage.setItem(
        "fechaInicio",
        ahora.toLocaleDateString("es-HN")
    );
    sessionStorage.setItem(
        "horaInicio",
        ahora.toLocaleTimeString("es-HN")
    );

    window.location.href = "tercera.html";
});