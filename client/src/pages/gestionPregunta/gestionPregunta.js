import { getPreguntasWithRespuestas, putPregunta, postPregunta } from "../../components/preguntaApi"
import { getAsignatura } from "../../components/asignaturaApi"
import { putRespuesta, postRespuesta } from "../../components/respuestaApi"

document.addEventListener("DOMContentLoaded", async function () {
    const asignaturas = await getAsignatura()

    // Cargar asignaturas en el select del modal

    const asignaturaSelect = document.getElementById("asignatura")
    asignaturas.asignatura.forEach(asignatura => {
        const option = document.createElement("option")
        option.value = asignatura.id
        option.textContent = asignatura.nombre
        asignaturaSelect.appendChild(option)
    })

    const tipoPreguntaSelect = document.getElementById("tipoPregunta")
    const opcionesContainer = document.getElementById("opcionesContainer")
    const respuestaContainer = document.getElementById("respuesta").parentElement

    tipoPreguntaSelect.addEventListener("change", function () {
        if (this.value === "opciones") {
            opcionesContainer.classList.remove("d-none")
            respuestaContainer.classList.add("d-none")
        } else {
            opcionesContainer.classList.add("d-none")
            respuestaContainer.classList.remove("d-none")
        }
    })

    const agregarOpcionBtn = document.getElementById("agregarOpcion");
    const opcionesCampos = document.getElementById("opcionesCampos");

    agregarOpcionBtn.addEventListener("click", function () {
        const opcionDiv = document.createElement("div");
        opcionDiv.classList.add("input-group", "mb-2");

        const totalOpciones = opcionesCampos.querySelectorAll(".input-group").length;
        const prefijo = String.fromCharCode(97 + totalOpciones) + ".";

        opcionDiv.innerHTML = `
        <span class="input-group-text">${prefijo}</span>
        <input type="checkbox" class="form-check-input ms-2" title="Seleccionar como respuesta">
        <input type="text" class="form-control" placeholder="Escribe una opción">
        <button type="button" class="btn btn-danger btn-sm eliminar-opcion">Eliminar</button>
    `;
        opcionesCampos.appendChild(opcionDiv);

        opcionDiv.querySelector(".eliminar-opcion").addEventListener("click", function () {
            opcionDiv.remove();

            actualizarPrefijos();
        });
    });

    function actualizarPrefijos() {
        const opciones = opcionesCampos.querySelectorAll(".input-group");
        opciones.forEach((opcionDiv, index) => {
            const prefijo = String.fromCharCode(97 + index) + "."; 
            const span = opcionDiv.querySelector(".input-group-text");
            if (span) {
                span.textContent = prefijo;
            }
        });
    }

    //Función para crear una nueva pregunta

    async function crearPreguntaUI() {
        const guardarPreguntaBtn = document.getElementById("guardarPregunta")

        guardarPreguntaBtn.addEventListener("click", async () => {
            try {
                const tipo = tipoPreguntaSelect.value;
                const pregunta = document.getElementById("pregunta").value;
                const asignaturaId = asignaturaSelect.value;

                let opciones = [];
                let respuesta = null;
                let tipoPregunta = tipo;

                if (tipo === "opciones") {
                    const opcionesInputs = opcionesCampos.querySelectorAll(".input-group");
                    opciones = Array.from(opcionesInputs).map((opcionDiv, index) => {
                        const texto = opcionDiv.querySelector("input[type='text']").value;
                        const seleccionado = opcionDiv.querySelector("input[type='checkbox']").checked;
                        const prefijo = String.fromCharCode(97 + index) + ".";
                        return { texto: `${prefijo} ${texto}`, seleccionado };
                    });

                    const opcionesSeleccionadas = opciones.filter(opcion => opcion.seleccionado);
                    if (opcionesSeleccionadas.length === 1) {
                        respuesta = opcionesSeleccionadas[0].texto;
                        opciones = opciones.map(opcion => opcion.texto);
                        tipoPregunta = "opciones individuales";
                    } else if (opcionesSeleccionadas.length > 1) {
                        respuesta = opcionesSeleccionadas.map(opcion => opcion.texto).join(", ");
                        opciones = opciones.map(opcion => opcion.texto);
                        tipoPregunta = "opciones multiples";
                    }
                } else {
                    respuesta = document.getElementById("respuesta").value;
                }

                const nuevaPregunta = {
                    tipo: tipoPregunta,
                    pregunta: pregunta,
                    asignaturaId: asignaturaId,
                    opciones: opciones.length > 0 ? opciones.join("\n") : null, // Guardar opciones separadas por saltos de línea
                };

                console.log("Nueva Pregunta:", nuevaPregunta);
                const preguntaCreada = await postPregunta(nuevaPregunta);

                if (tipoPregunta === "opciones individuales" || tipoPregunta === "opciones multiples") {
                    const respuestas = respuesta.split(", ");
                    respuestas.forEach(async (res) => {
                        const nuevaRespuesta = {
                            respuesta: res.trim(),
                            preguntaId: preguntaCreada.pregunta.id,
                        };
                        console.log("Nueva Respuesta:", nuevaRespuesta);
                        await postRespuesta(nuevaRespuesta);
                    });
                } else {
                    const nuevaRespuesta = {
                        respuesta: respuesta,
                        preguntaId: preguntaCreada.pregunta.id,
                    };
                    console.log("Nueva Respuesta:", nuevaRespuesta);
                    await postRespuesta(nuevaRespuesta);
                }

                const tabla = $('#Preguntas').DataTable();
                const asignaturaNombre = asignaturas.asignatura.find(asignatura => asignatura.id == asignaturaId)?.nombre || 'Sin asignatura';
                const opcionesTexto = opciones.length > 0 ? opciones.join(", ") : 'No tiene opciones';

                const nuevaFila = tabla.row.add([
                    tipoPregunta,
                    pregunta,
                    opcionesTexto,
                    asignaturaNombre,
                    respuesta.split(", ").join("<br>"),
                    `<button type="button" class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#myModal${preguntaCreada.pregunta.id}"><i class="fas fa-edit"></i> Editar</button>`
                ]).draw(false).node();

                $(nuevaFila).attr('data-id', preguntaCreada.pregunta.id);

                // Limpiar el formulario y cerrar el modal
                document.getElementById("pregunta").value = "";
                document.getElementById("respuesta").value = "";
                opcionesCampos.innerHTML = "";
                opcionesContainer.classList.add("d-none");

                const crearPreguntaModal = bootstrap.Modal.getInstance(document.getElementById("crearPreguntaModal"));
                if (crearPreguntaModal) {
                    crearPreguntaModal.hide();
                }

                console.log("Pregunta agregada a la tabla.");
            } catch (error) {
                console.error("Error al crear la pregunta:", error);
            }
        });
    }

    // Función para rellenar la tabla de preguntas

    async function rellenarPreguntas() {
        const preguntasWithRespuestas = await getPreguntasWithRespuestas();
        console.log(preguntasWithRespuestas.preguntas);
        const preguntas = preguntasWithRespuestas.preguntas;

        const tabla = $('#Preguntas').DataTable();
        tabla.clear().draw();
        preguntas.forEach(pre => {
            let respuestas = '';
            pre.respuestas.forEach(res => {
                respuestas += res.respuesta + '<br>';
            });

            let opciones = '';
            if (pre.opciones) {
                opciones = pre.opciones.replace(/\n/g, ', ');
            } else {
                opciones = 'No tiene opciones';
            }

            const row = tabla.row.add([
                pre.tipo,
                pre.pregunta,
                opciones,
                pre.asignatura,
                respuestas,
                `<button type="button" class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#myModal${pre.id}"><i class="fas fa-edit"></i> Editar</button>`
            ]).draw(false).node();

            $(row).attr('data-id', pre.id);

            document.body.insertAdjacentHTML('beforeend', editarPreguntaModal(pre, asignaturas));
            editarPreguntaUI(pre);
        });
    }

    // Funcion para crear el modal para editar la pregunta

    function editarPreguntaModal(pre, asignaturas) {
        const asignaturaOptions = asignaturas.asignatura.map(asignatura => {
            return `<option value="${asignatura.id}" ${pre.asignatura === asignatura.nombre ? 'selected' : ''}>${asignatura.nombre}</option>`
        }).join('')

        return `
            <div class="modal" id="myModal${pre.id}">
                <div class="modal-dialog modal-md">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h4 class="modal-title">Editar Pregunta</h4>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <div class="row">
                                <!-- Tipo -->
                                <div class="col-sm-12 col-md-6">
                                    <label for="tipo${pre.id}" class="form-label">Tipo</label>
                                    <select id="tipo${pre.id}" name="tipo${pre.id}" class="form-select">
                                        <option value="números" ${pre.tipo === 'números' ? 'selected' : ''}>Números</option>
                                        <option value="opciones individuales" ${pre.tipo === 'opciones individuales' ? 'selected' : ''}>Opciones Individuales</option>
                                        <option value="opciones multiples" ${pre.tipo === 'opciones multiples' ? 'selected' : ''}>Opciones Múltiples</option>
                                        <option value="texto" ${pre.tipo === 'texto' ? 'selected' : ''}>Texto</option>
                                    </select>
                                </div>

                                <!-- Pregunta -->
                                <div class="col-sm-12 col-md-6">
                                    <label for="pregunta${pre.id}" class="form-label">Pregunta</label>
                                    <input type="text" id="pregunta${pre.id}" name="pregunta${pre.id}" class="form-control" value="${pre.pregunta}">
                                </div>

                                <!-- Opciones -->
                                <div class="col-sm-12">
                                    <label for="opciones${pre.id}" class="form-label">Opciones</label>
                                    <textarea id="opciones${pre.id}" name="opciones${pre.id}" class="form-control">${pre.opciones ? pre.opciones.replace(/\n/g, '\n') : ''}</textarea>
                                    <small class="text-muted">Escribe las opciones separadas por saltos de línea.</small>
                                </div>

                                <!-- Asignatura -->
                                <div class="col-sm-12 col-md-6">
                                    <label for="asignatura${pre.id}" class="form-label">Asignatura</label>
                                    <select id="asignatura${pre.id}" name="asignatura${pre.id}" class="form-select">
                                        ${asignaturaOptions}
                                    </select>
                                </div>

                                <!-- Respuesta -->
                                <div class="col-sm-12 col-md-6">
                                    <label for="respuesta${pre.id}" class="form-label">Respuesta</label>
                                    <input type="text" id="respuesta${pre.id}" name="respuesta${pre.id}" class="form-control" value="${pre.respuestas.map(res => res.respuesta).join(', ')}">
                                    <small class="text-muted">Escribe las respuestas separadas por comas.</small>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-primary" id="guardarBtn${pre.id}">Guardar Cambios</button>
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                        </div>
                    </div>
                </div>
            </div>
        `
    }

    // Funcion que controla el evento de editar la pregunta

    async function editarPreguntaUI(pre) {
        const modificarBtn = document.getElementById(`guardarBtn${pre.id}`);

        if (modificarBtn) {
            modificarBtn.addEventListener('click', async () => {
                try {
                    const modalElement = document.getElementById(`myModal${pre.id}`);
                    const tipo = document.getElementById(`tipo${pre.id}`).value;
                    const pregunta = document.getElementById(`pregunta${pre.id}`).value;
                    const asignaturaId = document.getElementById(`asignatura${pre.id}`).value;
                    const respuestaInput = document.getElementById(`respuesta${pre.id}`).value;
                    let opciones = document.getElementById(`opciones${pre.id}`).value;

                    console.log(tipo, pregunta, asignaturaId, respuestaInput, opciones);

                    if (tipo === 'texto' || tipo === 'números') {
                        opciones = null;
                    }

                    const preguntaCambiada = {
                        tipo: tipo,
                        pregunta: pregunta,
                        asignaturaId: asignaturaId,
                        opciones: opciones,
                    };

                    console.log("Pregunta actualizada:", preguntaCambiada);
                    await putPregunta(pre.id, preguntaCambiada);

                    if (tipo === 'opciones multiples' || tipo === 'opciones individuales') {
                        const respuestas = respuestaInput.split(',').map(res => res.trim());

                        for (let i = 0; i < pre.respuestas.length; i++) {
                            const respuestaExistente = pre.respuestas[i];
                            if (respuestas[i]) {
                                const respuestaCambiada = {
                                    respuesta: respuestas[i],
                                    preguntaId: pre.id,
                                };
                                console.log("Respuesta actualizada:", respuestaCambiada);
                                await putRespuesta(respuestaExistente.id, respuestaCambiada);
                            } else {
                                console.log("Eliminando respuesta:", respuestaExistente.id);
                                await deleteRespuesta(respuestaExistente.id);
                            }
                        }

                        for (let i = pre.respuestas.length; i < respuestas.length; i++) {
                            const nuevaRespuesta = {
                                respuesta: respuestas[i],
                                preguntaId: pre.id,
                            };
                            console.log("Nueva respuesta:", nuevaRespuesta);
                            await postRespuesta(nuevaRespuesta);
                        }
                    } else {
                        if (pre.respuestas.length > 0) {
                            const respuestaCambiada = {
                                respuesta: respuestaInput,
                                preguntaId: pre.id,
                            };
                            console.log("Respuesta actualizada:", respuestaCambiada);
                            await putRespuesta(pre.respuestas[0].id, respuestaCambiada);
                        } else {
                            const nuevaRespuesta = {
                                respuesta: respuestaInput,
                                preguntaId: pre.id,
                            };
                            console.log("Nueva respuesta:", nuevaRespuesta);
                            await postRespuesta(nuevaRespuesta);
                        }
                    }

                    const asignaturaNombre = asignaturas.asignatura.find(asignatura => asignatura.id == asignaturaId)?.nombre || 'Sin asignatura';

                    const tabla = $('#Preguntas').DataTable();
                    const row = tabla.row(`[data-id="${pre.id}"]`);

                    if (!row.node()) {
                        console.error(`No se encontró la fila con id: ${pre.id}`);
                        return;
                    }

                    const respuestas = respuestaInput.split(',').map(res => res.trim()).join('<br>');
                    const opcionesTexto = opciones ? opciones.replace(/\n/g, ', ') : 'No tiene opciones';

                    row.data([
                        tipo,
                        pregunta,
                        opcionesTexto,
                        asignaturaNombre,
                        respuestas,
                        row.data()[5],
                    ]).draw(false);

                    const modalInstance = bootstrap.Modal.getInstance(modalElement);
                    if (modalInstance) {
                        modalInstance.hide();
                    }
                } catch (error) {
                    console.error('Error al confirmar la modificación:', error);
                }
            });
        }
    }

    crearPreguntaUI()
    rellenarPreguntas()
})