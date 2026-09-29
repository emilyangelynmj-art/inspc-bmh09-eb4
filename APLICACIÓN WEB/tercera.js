const usuario=sessionStorage.getItem("usuario");
const area=sessionStorage.getItem("area");
const formulario=sessionStorage.getItem("formulario");
const horaInicio=sessionStorage.getItem("horaInicio");

document.getElementById("usuario").textContent=usuario;
document.getElementById("area").textContent=area;
document.getElementById("fecha").textContent=new Date().toLocaleDateString("es-HN");
document.getElementById("hora").textContent=horaInicio;

const url="https://script.google.com/macros/s/AKfycbwBrNoF3at8stflx_ykSv394wzDHX41S5LbM78KvATu2jH-zAbbiCCcz7AozVyBCPIv/exec";
const contenedorPreguntas=document.getElementById("contenedorPreguntas");

let preguntas=[];
let preguntaActual=0;
const claveRespuestas="respuesta_"+usuario+"_"+formulario;
const respuestas=JSON.parse(localStorage.getItem(claveRespuestas)||"{}");
const fotos={};

const cerrarSesion=document.getElementById("cerrarSesion");

cerrarSesion.onclick=()=>{
    const confirmar=confirm(
        "¿Desea cerrar sesión? El progreso de la inspección actual se perderá."
    );

    if(!confirmar){
        return;
    }

    localStorage.removeItem(claveRespuestas);
    sessionStorage.clear();
    window.location.href="index.html";
};

fetch(url)
.then(r=>r.json())
.then(datos=>{
    preguntas=datos.preguntas.filter(p=>Number(p.formulario)===Number(formulario));

    if(preguntas.length===0){
        contenedorPreguntas.innerHTML="<p>No se encontraron preguntas para este formulario.</p>";
        return;
    }

    mostrarPregunta();
})
.catch(error=>{
    console.log("Error al cargar preguntas:",error);
    contenedorPreguntas.innerHTML="<p>Error al cargar las preguntas.</p>";
});

function mostrarPregunta(){
    contenedorPreguntas.innerHTML="";

    const pregunta=preguntas[preguntaActual];

    const botonVerPreguntas=document.createElement("button");
    botonVerPreguntas.type="button";
    botonVerPreguntas.textContent="☰ Ver preguntas";
    botonVerPreguntas.style.display="block";
    botonVerPreguntas.style.margin="0 auto 6px";
    botonVerPreguntas.style.padding="5px 8px";
    botonVerPreguntas.style.cursor="pointer";

    botonVerPreguntas.onclick=()=>{
        mostrarListaPreguntas();
    };

    contenedorPreguntas.appendChild(botonVerPreguntas);

    const bloque=document.createElement("div");
    bloque.className="pregunta";

    const numero=document.createElement("p");
    numero.innerHTML="<strong>Pregunta "+(preguntaActual+1)+" de "+preguntas.length+"</strong>";
    bloque.appendChild(numero);

    const texto=document.createElement("p");
    texto.innerHTML="<strong>"+pregunta.pregunta+"</strong>";
    bloque.appendChild(texto);

    const opciones=document.createElement("div");
    opciones.className="opciones";

    let campoOtro=null;

    pregunta.opciones.forEach(opcion=>{
        const valor=opcion.trim();

        const label=document.createElement("label");

        const radio=document.createElement("input");
        radio.type="radio";
        radio.name="pregunta"+pregunta.id;
        radio.value=valor;

        if(respuestas[pregunta.id]?.respuesta===valor){
            radio.checked=true;
        }
label.style.display="flex";
label.style.alignItems="flex-start";
label.style.gap="6px";
label.style.width="100%";

label.appendChild(radio);
label.appendChild(document.createTextNode(valor));

opciones.appendChild(label);

        if(valor.toLowerCase()==="otro"){
            campoOtro=document.createElement("input");
            campoOtro.type="text";
            campoOtro.placeholder="Especifique";
            campoOtro.style.display="none";
            campoOtro.style.marginTop="8px";
            campoOtro.style.width="100%";

            if(respuestas[pregunta.id]?.otro){
                campoOtro.value=respuestas[pregunta.id].otro;
            }

            opciones.appendChild(campoOtro);
        }

    radio.addEventListener("change",()=>{
    respuestas[pregunta.id]={
        respuesta:valor,
        otro:respuestas[pregunta.id]?.otro||""
    };

    localStorage.setItem(
        claveRespuestas,
        JSON.stringify(respuestas)
    );

    if(campoOtro){
        if(valor.toLowerCase()==="otro"){
            campoOtro.style.display="block";
            campoOtro.focus();
        }else{
            campoOtro.style.display="none";
            campoOtro.value="";
            respuestas[pregunta.id].otro="";

            localStorage.setItem(
                claveRespuestas,
                JSON.stringify(respuestas)
            );
        }
    }
});
    });

    if(campoOtro){
        campoOtro.addEventListener("input",()=>{
            if(!respuestas[pregunta.id]){
                respuestas[pregunta.id]={
                    respuesta:"Otro",
                    otro:""
                };
            }

            respuestas[pregunta.id].otro=campoOtro.value;

            localStorage.setItem(
                claveRespuestas,
                JSON.stringify(respuestas)
            );
        });

        if(
            respuestas[pregunta.id]?.respuesta &&
            respuestas[pregunta.id].respuesta.toLowerCase()==="otro"
        ){
            campoOtro.style.display="block";
        }
    }

    bloque.appendChild(opciones);

    const textoFoto=document.createElement("p");
    textoFoto.innerHTML="Agregar foto si gusta";
    bloque.appendChild(textoFoto);
    textoFoto.style.textAlign="left";
    textoFoto.style.fontSize="14px"

    const selectorFoto=document.createElement("input");
    selectorFoto.type="file";
    selectorFoto.className="selector-foto";
    selectorFoto.accept="image/*";
    selectorFoto.multiple=true;
    selectorFoto.padding="5px 8px";
    selectorFoto.style.fontSize="13px";
    selectorFoto.style.width="280px";

    bloque.appendChild(selectorFoto);

    const galeria=document.createElement("div");
    galeria.className="galeria-fotos";
    bloque.appendChild(galeria);

    const botonCamara=document.createElement("button");
    botonCamara.type="button";
    botonCamara.textContent=" [°◉] Tomar foto";
    botonCamara.style.padding="5px 8px";
botonCamara.style.fontSize="13px";
botonCamara.style.width="auto";

    const camara=document.createElement("input");
    camara.type="file";
    camara.accept="image/*";
    camara.setAttribute("capture","environment");
    camara.style.display="none";

    botonCamara.onclick=()=>{
        camara.click();
    };

    camara.addEventListener("change",()=>{
        if(camara.files.length>0){
            const archivo=camara.files[0];

            const foto={
                archivo:archivo,
                url:URL.createObjectURL(archivo),
                nombre:archivo.name
            };

            if(!fotos[pregunta.id]){
                fotos[pregunta.id]=[];
            }

            fotos[pregunta.id].push(foto);
            crearMiniatura(foto,galeria,pregunta.id);
            camara.value="";
        }
    });

    bloque.appendChild(botonCamara);
    bloque.appendChild(camara);

    if(!fotos[pregunta.id]){
        fotos[pregunta.id]=[];
    }

    fotos[pregunta.id].forEach(foto=>{
        crearMiniatura(foto,galeria,pregunta.id);
    });

    selectorFoto.addEventListener("change",()=>{
        Array.from(selectorFoto.files).forEach(archivo=>{
            const foto={
                archivo:archivo,
                url:URL.createObjectURL(archivo),
                nombre:archivo.name
            };

            fotos[pregunta.id].push(foto);

            crearMiniatura(
                foto,
                galeria,
                pregunta.id
            );
        });

        selectorFoto.value="";
    });

    contenedorPreguntas.appendChild(bloque);

    const botones=document.createElement("div");
    botones.style.marginTop="20px";

    const botonAnterior=document.createElement("button");
    botonAnterior.type="button";
    botonAnterior.textContent="Anterior";
    botonAnterior.disabled=preguntaActual===0;

    botonAnterior.onclick=()=>{
        if(preguntaActual>0){
            preguntaActual--;
            mostrarPregunta();
        }
    };

    const botonSiguiente=document.createElement("button");
    botonSiguiente.type="button";

    botonSiguiente.textContent=
        preguntaActual===preguntas.length-1
        ?"Finalizar"
        :"Siguiente";

    botonSiguiente.onclick=async()=>{

        if(
            respuestas[pregunta.id]?.respuesta &&
            respuestas[pregunta.id].respuesta.toLowerCase()==="otro" &&
            (
                !respuestas[pregunta.id].otro ||
                respuestas[pregunta.id].otro.trim()===""
            )
        ){
            alert("Debe especificar la opción Otro.");

            campoOtro.style.display="block";
            campoOtro.focus();

            return;
        }

        if(preguntaActual===preguntas.length-1){

            botonSiguiente.disabled=true;
            botonSiguiente.innerHTML="🕑 Guardando...";

            const ahoraFin=new Date();

            const listaRespuestas=[];

            for(const p of preguntas){

                if(respuestas[p.id]){

                    const fotosBase64=[];

                    if(fotos[p.id]){

                        for(const foto of fotos[p.id]){

                            fotosBase64.push(
                                await convertirFotoBase64(
                                    foto.archivo
                                )
                            );
                        }
                    }

                    listaRespuestas.push({
                        pregunta_id:p.id,
                        respuesta:respuestas[p.id].respuesta,
                        observacion:respuestas[p.id].otro||"",
                        fotos:fotosBase64
                    });
                }
            }

            const datosInspeccion={
                accion:"guardar_inspeccion",
                usuario:usuario,
                formulario:formulario,
                periodicidad:sessionStorage.getItem("periodicidad"),
                area:area,
                fecha_inicio:new Date().toLocaleDateString("es-HN"),
                hora_inicio:horaInicio,
                fecha_fin:ahoraFin.toLocaleDateString("es-HN"),
                hora_fin:ahoraFin.toLocaleTimeString("es-HN"),
                respuestas:listaRespuestas
            };

            fetch(url,{
                method:"POST",
                body:JSON.stringify(datosInspeccion)
            })
            .then(r=>r.json())
            .then(datos=>{

             if(datos.correcto){

    botonSiguiente.disabled=false;
    botonSiguiente.innerHTML="✔ Guardado correctamente";

    botonSiguiente.onclick=()=>{
        mostrarBotonPDF(
            datos.inspeccion_id,
            datos.trimestre,
            datos.numero_inspeccion,
            datos.anio
        );
    };
                }else{

                    botonSiguiente.disabled=false;
                    botonSiguiente.innerHTML="Finalizar";

                    alert(
                        "No se pudo guardar: "+
                        datos.mensaje
                    );
                }

            })
            .catch(error=>{

                console.log(
                    "Error al guardar:",
                    error
                );

                botonSiguiente.disabled=false;
                botonSiguiente.innerHTML="Finalizar";

                alert(
                    "Ocurrió un error al guardar la inspección."
                );
            });

            return;
        }

        preguntaActual++;
        mostrarPregunta();
    };

    botones.appendChild(botonAnterior);

    botones.appendChild(
        document.createTextNode(" ")
    );

    botones.appendChild(botonSiguiente);

    contenedorPreguntas.appendChild(botones);
}

function mostrarListaPreguntas(){

    contenedorPreguntas.innerHTML="";

    const titulo=document.createElement("h3");
    titulo.textContent="Seleccionar pregunta";
    titulo.style.textAlign="center";

    contenedorPreguntas.appendChild(titulo);

    const volver=document.createElement("button");
    volver.type="button";
    volver.textContent="← Volver a la pregunta actual";
    volver.style.display="block";
    volver.style.margin="0 auto 12px";
    volver.style.padding="8px 12px";

    volver.onclick=()=>{
        mostrarPregunta();
    };

    contenedorPreguntas.appendChild(volver);

    const lista=document.createElement("div");

    preguntas.forEach((pregunta,indice)=>{

        const boton=document.createElement("button");
        boton.type="button";

        const respondida=!!respuestas[pregunta.id];

        boton.textContent=
            (respondida?"✓ ":"☐")+
            pregunta.pregunta;

        boton.style.display="block";
        boton.style.width="100%";
        boton.style.textAlign="left";
        boton.style.margin="6px 0";
        boton.style.padding="10px";
        boton.style.cursor="pointer";

        boton.onclick=()=>{
            preguntaActual=indice;
            mostrarPregunta();
        };

        lista.appendChild(boton);
    });

    contenedorPreguntas.appendChild(lista);
}

function convertirFotoBase64(archivo){

    return new Promise((resolve,reject)=>{

        const lector=new FileReader();

        lector.onload=()=>{
            resolve(lector.result);
        };

        lector.onerror=error=>{
            reject(error);
        };

        lector.readAsDataURL(archivo);
    });
}

function mostrarBotonPDF(
    inspeccionId,
    trimestre,
    numeroInspeccion,
    anio){

    contenedorPreguntas.innerHTML="";

    const mensaje=document.createElement("p");
    const informacion=document.createElement("p");
informacion.innerHTML=
    "<strong>Trimestre:</strong> "+trimestre+
    " | <strong>Inspección:</strong> "+numeroInspeccion;
informacion.style.textAlign="center";

contenedorPreguntas.appendChild(informacion);
    mensaje.innerHTML="<strong>Inspección finalizada correctamente.</strong>";
    mensaje.style.textAlign="center";
    contenedorPreguntas.appendChild(mensaje);

    const botonPDF=document.createElement("button");
    botonPDF.type="button";
    botonPDF.innerHTML="🖹 Generar PDF";
    botonPDF.style.display="block";
    botonPDF.style.margin="20px auto";
    botonPDF.style.padding="10px 20px";
    botonPDF.style.fontSize="16px";
    botonPDF.style.cursor="pointer";

    contenedorPreguntas.appendChild(botonPDF);

    botonPDF.onclick=async()=>{

        

        botonPDF.disabled=true;
        botonPDF.innerHTML="🕑 Generando PDF...";

        try{

            const respuesta=await fetch(url,{
                method:"POST",
                body:JSON.stringify({
                    accion:"generar_pdf",
                    inspeccion_id:inspeccionId
                })
            });

            const datos=await respuesta.json();

            if(datos.correcto&&datos.pdf_base64){

                const bytes=atob(datos.pdf_base64);
                const numeros=new Array(bytes.length);

                for(let i=0;i<bytes.length;i++){
                    numeros[i]=bytes.charCodeAt(i);
                }

                const blob=new Blob(
                    [new Uint8Array(numeros)],
                    {type:"application/pdf"}
                );

                const pdfURL=URL.createObjectURL(blob);

                botonPDF.disabled=false;
                botonPDF.innerHTML=" 🖹 Abrir PDF";

                botonPDF.onclick=()=>{
                    window.open(pdfURL,"_blank");
                };

               const botonCompartir=document.createElement("button");
botonCompartir.type="button";
botonCompartir.innerHTML="⤴ Compartir PDF";
botonCompartir.style.display="block";
botonCompartir.style.margin="10px auto";
botonCompartir.style.padding="10px 20px";
botonCompartir.style.fontSize="15px";
botonCompartir.style.cursor="pointer";

botonCompartir.onclick=async()=>{

    const archivoPDF=new File(
        [blob],
        "Inspeccion_"+trimestre+"_"+anio+"_"+numeroInspeccion+"_"+usuario+".pdf",
        {type:"application/pdf"}
    );

    if(navigator.share){

        try{
            await navigator.share({
                title:"Inspección BOMOHSA",
                text:"Inspección "+inspeccionId,
                files:[archivoPDF]
            });

        }catch(error){
          console.log("Compartir cancelado:",error);
        }

    }else{
        alert("Este navegador no permite compartir directamente.");
    }
};

contenedorPreguntas.appendChild(botonCompartir);{

    const archivoPDF=new File(
        [blob],
        "Inspeccion_"+trimestre+"_"+anio+"_"+numeroInspeccion+"_"+usuario+".pdf",
        {type:"application/pdf"}
    );

    if(navigator.share){
        try{

            await navigator.share({
                title:"Inspección BOMOHSA",
                text:"Inspección "+inspeccionId,
                files:[archivoPDF]
            });
        }catch(error){

            console.log("Compartir cancelado:",error);

        }
    }else{

        alert("Este navegador no permite compartir directamente.");

    }
};

                const botonCerrar=document.createElement("button");
                botonCerrar.type="button";
                botonCerrar.innerHTML="Cerrar sesión";
                botonCerrar.style.display="block";
                botonCerrar.style.margin="10px auto";
                botonCerrar.style.padding="10px 20px";
                botonCerrar.style.fontSize="16px";
                botonCerrar.style.cursor="pointer";

                botonCerrar.onclick=()=>{
                    sessionStorage.clear();
                    localStorage.clear();
                    window.location.href="index.html";
                };

                contenedorPreguntas.appendChild(
                    botonCerrar
                );

            }else{

                botonPDF.disabled=false;
                botonPDF.innerHTML=" Generar PDF";

                alert(
                    "No se pudo generar el PDF: "+
                    (datos.mensaje||"No se recibió el PDF.")
                );
            }

       }catch(error){

    console.log(
        "Error al generar PDF:",
        error
    );

    botonPDF.disabled=false;
    botonPDF.innerHTML=" Generar PDF";

    alert(
        "ERROR: "+error.message
    );
}
    };
}

function crearMiniatura(
    foto,
    galeria,
    preguntaId
){

    const contenedor=document.createElement("div");
    contenedor.className="foto-contenedor";

    const imagen=document.createElement("img");
    imagen.src=foto.url;
    imagen.className="foto-miniatura";

    imagen.onclick=()=>{

        document.getElementById(
            "fotoGrande"
        ).src=foto.url;

        document.getElementById(
            "visorFoto"
        ).style.display="flex";
    };

    const eliminar=document.createElement("button");
    eliminar.type="button";
    eliminar.textContent="Eliminar";

    eliminar.onclick=()=>{

        const posicion=
            fotos[preguntaId].indexOf(foto);

        if(posicion!==-1){
            fotos[preguntaId].splice(posicion,1);
        }

        contenedor.remove();
    };

    const descargar=document.createElement("a");
    descargar.textContent="Descargar";
    descargar.href=foto.url;
    descargar.download=foto.nombre;

    contenedor.appendChild(imagen);
    contenedor.appendChild(eliminar);
    contenedor.appendChild(descargar);

    galeria.appendChild(contenedor);
}

document.getElementById(
    "cerrarFoto"
).addEventListener(
    "click",
    ()=>{
        document.getElementById(
            "visorFoto"
        ).style.display="none";
    }
);