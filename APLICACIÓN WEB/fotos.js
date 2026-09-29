// Dirección de Apps Script
const urlFotos = "https://script.google.com/macros/s/AKfycbyzu-g351i43I4-6jAfNnAFp5HmMyQKIMzDQFKi2X04PJ7XV7Qsogjlt-dBSHHg7fhp/exec";

// Aquí guardo las fotos seleccionadas
const fotosParaPDF = [];

// Detecto cuando selecciono una foto
document.addEventListener("change", function(evento) {

    // Compruebo que sea un selector de fotos
    if (!evento.target.classList.contains("selector-foto")) {
        return;
    }

    // Recorro las fotos seleccionadas
    Array.from(evento.target.files).forEach(function(archivo) {
        fotosParaPDF.push(archivo);
        console.log("Foto preparada:", archivo.name);
    });

    // Limpio el selector
    evento.target.value = "";
});

// Esta función envía las fotos a Apps Script
async function guardarFotos() {

    const listaFotos = [];

    // Recorro todas las fotos
    for (const archivo of fotosParaPDF) {

        // Convierto la foto a Base64
        const base64 =
            await convertirFotoBase64(archivo);

        // Agrego la foto a la lista
        listaFotos.push({
            nombre: archivo.name,
            tipo: archivo.type,
            base64: base64
        });
    }

    // Si no hay fotos, continúo normalmente
    if (listaFotos.length === 0) {
        return true;
    }
    try {

        // Envío las fotos a Apps Script
        const respuesta =
            await fetch(urlFotos, {
                method: "POST",
                body: JSON.stringify({
                    accion: "guardar_fotos",
                    fotos: listaFotos
                })
            });

        // Leo la respuesta
        const resultado =
            await respuesta.json();

        // Compruebo si se guardaron
        if (resultado.correcto) {

            console.log(
                "Fotos guardadas correctamente"
            );
            return true;
        }

        console.log(
            "No se pudieron guardar las fotos:",
            resultado.mensaje
        );

        return false;
    } catch (error) {

        console.log(
            "Error al guardar las fotos:",
            error
        );
        return false;
    }
}

// Convierto una foto a Base64
function convertirFotoBase64(archivo) {

    return new Promise(function(resolve, reject) {
        const lector = new FileReader();

        lector.onload = function() {

            const base64 =
                lector.result.split(",")[1];
            resolve(base64);
        };

        lector.onerror = function(error) {
            reject(error);
        };

        lector.readAsDataURL(archivo);
    });
}