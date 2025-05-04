import { getExamen, postExamen, activeOrDesableExamen, putExamen } from "../../components/examenApi"
import { getAsignatura } from "../../components/asignaturaApi"
import { getPreguntasWithRespuestas, postPregunta } from "../../components/preguntaApi"
import { postRespuesta } from "../../components/respuestaApi"
import { postExamenPregunta, deleteExamenPregunta } from "../../components/examenPreguntaApi"

document.addEventListener("DOMContentLoaded", async function () {
    const asignaturas = await getAsignatura()

    // Función para rellenar la tabla de examenes

    async function rellenarExamenes() {
        const examenes = await getExamen()
        console.log("Exámenes obtenidos:", examenes)

        const tabla = $('#Examenes').DataTable()
        tabla.clear().draw()

        examenes.examenes.forEach(examen => {
            const asignatura = asignaturas.asignatura.find(asig => asig.id === examen.asignaturaId)?.nombre || "Sin asignatura"

            // La tabla que se ve cuando el examen está activo

            if (examen.active == 1) {
                const row = tabla.row.add([
                    examen.nombre,
                    examen.fhInicio,
                    examen.fhFinal,
                    asignatura,
                    `
                    <button type="button" class="btn btn-danger btn-sm" data-bs-toggle="modal" data-bs-target="#deleteModal${examen.id}"><i class="fas fa-edit"></i> Desactivar examen</button>
                    <button type="button" class="btn btn-info btn-sm" data-bs-toggle="modal" data-bs-target="#viewModal${examen.id}">Ver preguntas</button>
                    `
                ]).draw(false).node();

                document.body.insertAdjacentHTML('beforeend', deleteExamen(examen))
                activeOrDesableExamenUI(examen.id, 'disable')

                document.body.insertAdjacentHTML('beforeend', verPreguntasModal(examen))

                $(row).attr('data-id', examen.id);
            } else {

                // La tabla que se ve cuando el usuario está desactivo

                const row = tabla.row.add([
                    examen.nombre,
                    examen.fhInicio,
                    examen.fhFinal,
                    asignatura,
                    `
                    <button type="button" class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#editarExamenModal${examen.id}"><i class="fas fa-edit"></i> Editar examen</button>
                    <button type="button" class="btn btn-success btn-sm" data-bs-toggle="modal" data-bs-target="#activeModal${examen.id}"><i class="fas fa-edit"></i> Activar examen</button>
                    <button type="button" class="btn btn-info btn-sm" data-bs-toggle="modal" data-bs-target="#viewModal${examen.id}">Ver preguntas</button>
                    `
                ]).draw(false).node();

                document.body.insertAdjacentHTML('beforeend', activeExamen(examen))
                activeOrDesableExamenUI(examen.id, 'active')

                document.body.insertAdjacentHTML('beforeend', verPreguntasModal(examen))
                mostrarPreguntasExamen(examen)

                document.body.insertAdjacentHTML('beforeend', editarExamenModal(examen))
                editarExamenUI(examen)

                $(row).attr('data-id', examen.id);
            }
        })
    }

    // Funcion para crear el modal para activar el examen

    function activeExamen(examen) {
        return `
            <div class="modal" id="activeModal${examen.id}">
                <div class="modal-dialog modal-md">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h4 class="modal-title">Confirmar Activación</h4>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                
                        <div class="modal-body">
                            <p>¿Estás seguro de que deseas activar el examen ${examen.nombre}?</p>
                        </div>
                
                        <div class="modal-footer">
                            <button type="button" class="btn btn-success" data-bs-dismiss="modal" id="confirmarActiveOrDesable${examen.id}">Confirmar Activación</button>
                        </div>
                    </div>
                </div>
            </div>   
        `
    }

    // Funcion para crear el modal para desactivar el examen

    function deleteExamen(examen) {
        return `
        <div class="modal" id="deleteModal${examen.id}">
            <div class="modal-dialog modal-md">
                <div class="modal-content">
    
                    <div class="modal-header">
                        <h4 class="modal-title">Confirmar Desactivación</h4>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
    
                    <div class="modal-body">
                        <p>¿Estás seguro de que deseas desactivar el examen ${examen.nombre}?</p>
                    </div>
    
                    <div class="modal-footer">
                        <button type="button" class="btn btn-danger" data-bs-dismiss="modal" id="confirmarActiveOrDesable${examen.id}">Confirmar Desactivación</button>
                    </div>
                </div>
            </div>
        </div>
    `
    }

    // Funcion que contiene el modal para ver las preguntas de cada examen 

    function verPreguntasModal(examen) {
        const preguntasHtml = examen.preguntas.map(pregunta => {
            let opcionesHtml = ''
            if (pregunta.tipo === 'opciones individuales' || pregunta.tipo === 'opciones multiples') {
                const opciones = pregunta.opciones ? pregunta.opciones.replace(/\\n/g, ', ') : 'No hay opciones disponibles'
                opcionesHtml = `
                    <p><strong>Opciones:</strong> ${opciones}</p>
                `
            }

            return `
            <li class="list-group-item d-flex justify-content-between align-items-center">
                <div>
                    <strong>${pregunta.tipo}:</strong> ${pregunta.pregunta}
                    ${opcionesHtml}
                </div>
                <input type="checkbox" class="form-check-input checkboxPregunta" data-id="${pregunta.id}" title="Seleccionar para eliminar">
            </li>
            `
        }).join('')

        return `
            <div class="modal fade" id="viewModal${examen.id}" tabindex="-1" aria-labelledby="viewModalLabel${examen.id}" aria-hidden="true">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="viewModalLabel${examen.id}">Preguntas del examen: ${examen.nombre}</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <ul class="list-group">
                                ${preguntasHtml}
                            </ul>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-primary" id="guardarCambiosPreguntas${examen.id}">Eliminar Preguntas Seleccionadas</button>
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                        </div>
                    </div>
                </div>
            </div>
        `
    }

    // Editar examen

    function editarExamenModal(examen) {
        return `
                <div class="modal fade" id="editarExamenModal${examen.id}" tabindex="-1" aria-labelledby="editarExamenModalLabel${examen.id}" aria-hidden="true">
                    <div class="modal-dialog modal-md">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id="editarExamenModalLabel${examen.id}">Editar Examen</h5>
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body">
                                <form id="editarExamenForm${examen.id}">
                                    <div class="mb-3">
                                        <label for="nombreExamen${examen.id}" class="form-label">Nombre del Examen</label>
                                        <input type="text" id="nombreExamen${examen.id}" class="form-control" value="${examen.nombre}" required>
                                    </div>
                                    <div class="mb-3">
                                        <label for="fechaInicio${examen.id}" class="form-label">Fecha y Hora de Inicio</label>
                                        <input type="datetime-local" id="fechaInicio${examen.id}" class="form-control" value="${examen.fhInicio.replace(' ', 'T')}" required>
                                    </div>
                                    <div class="mb-3">
                                        <label for="fechaFin${examen.id}" class="form-label">Fecha y Hora de Fin</label>
                                        <input type="datetime-local" id="fechaFin${examen.id}" class="form-control" value="${examen.fhFinal.replace(' ', 'T')}" required>
                                    </div>
                                </form>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-primary" id="guardarCambiosExamen${examen.id}">Guardar Cambios</button>
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                            </div>
                        </div>
                    </div>
                </div>
            `
    }

    async function crearExamen() {
        const preguntas = await getPreguntasWithRespuestas()

        const preguntasExamen = []
        const asignaturaSelect = document.getElementById("asignaturaExamen")
        asignaturas.asignatura.forEach(asignatura => {
            const option = document.createElement("option")
            option.value = asignatura.id
            option.textContent = asignatura.nombre
            asignaturaSelect.appendChild(option)
        })
    
        const mostrarCrearPreguntaBtn = document.getElementById("mostrarCrearPregunta")
        mostrarCrearPreguntaBtn.addEventListener("click", () => {
            const crearPreguntaModal = new bootstrap.Modal(document.getElementById("crearPreguntaModal"))
            crearPreguntaModal.show()
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
    
        const agregarOpcionBtn = document.getElementById("agregarOpcion")
        const opcionesCampos = document.getElementById("opcionesCampos")
    
        agregarOpcionBtn.addEventListener("click", function () {
            const opcionDiv = document.createElement("div")
            opcionDiv.classList.add("input-group", "mb-2")
            opcionDiv.innerHTML = `
                <input type="checkbox" class="form-check-input ms-2" title="Seleccionar como respuesta">
                <input type="text" class="form-control" placeholder="Escribe una opción">
                <button type="button" class="btn btn-danger btn-sm eliminar-opcion">Eliminar</button>
            `
            opcionesCampos.appendChild(opcionDiv)
    
            opcionDiv.querySelector(".eliminar-opcion").addEventListener("click", function () {
                opcionDiv.remove()
            })
        })
    
        const guardarPreguntaBtn = document.getElementById("guardarPregunta")
        guardarPreguntaBtn.addEventListener("click", async () => {
            try {
                const tipo = document.getElementById("tipoPregunta").value;
                const pregunta = document.getElementById("pregunta").value;
                const asignaturaId = document.getElementById("asignaturaExamen").value;
        
                let opciones = [];
                let respuestaPregunta = null;
                let tipoPregunta = tipo;
        
                if (tipo === "opciones") {
                    const opcionesInputs = document.querySelectorAll("#opcionesCampos .input-group");
                    opciones = Array.from(opcionesInputs).map(opcionDiv => {
                        const texto = opcionDiv.querySelector("input[type='text']").value;
                        const seleccionado = opcionDiv.querySelector("input[type='checkbox']").checked;
                        return { texto, seleccionado };
                    });
        
                    const opcionesSeleccionadas = opciones.filter(opcion => opcion.seleccionado);
                    if (opcionesSeleccionadas.length === 1) {
                        respuestaPregunta = opcionesSeleccionadas[0].texto;
                        opciones = opciones.map(opcion => opcion.texto);
                        tipoPregunta = "opciones individuales";
                    } else if (opcionesSeleccionadas.length > 1) {
                        respuestaPregunta = opcionesSeleccionadas.map(opcion => opcion.texto).join(", ");
                        opciones = opciones.map(opcion => opcion.texto);
                        tipoPregunta = "opciones multiples";
                    }
                } else {
                    respuestaPregunta = document.getElementById("respuesta").value;
                }
        
                const nuevaPregunta = {
                    tipo: tipoPregunta,
                    pregunta,
                    asignaturaId,
                    opciones: opciones.length > 0 ? opciones.join("\n") : null,
                };
        
                console.log("Nueva Pregunta:", nuevaPregunta);
                const respuesta = await postPregunta(nuevaPregunta);
        
                const nuevaRespuesta = {
                    respuesta: respuestaPregunta,
                    preguntaId: respuesta.pregunta.id,
                };
        
                console.log("Nueva Respuesta:", nuevaRespuesta);
                await postRespuesta(nuevaRespuesta);
        
                preguntasExamen.push({ id: respuesta.pregunta.id, puntuacion: 0 });
        
                document.getElementById("preguntasExamen").innerHTML += `
                    <li class="list-group-item d-flex justify-content-between align-items-center">
                        <div>
                            <strong>${tipoPregunta}:</strong> ${pregunta}
                            ${opciones.length > 0 ? `<p><strong>Opciones:</strong> ${opciones.join(", ")}</p>` : ""}
                        </div>
                        <div class="d-flex align-items-center">
                            <label for="puntuacion-${respuesta.pregunta.id}" class="me-2">Puntuación:</label>
                            <input type="number" class="form-control puntuacion-input" id="puntuacion-${respuesta.pregunta.id}" data-id="${respuesta.pregunta.id}" value="1" min="0" style="width: 80px;">
                        </div>
                    </li>
                `;
        
                const crearPreguntaModal = bootstrap.Modal.getInstance(document.getElementById("crearPreguntaModal"));
                crearPreguntaModal.hide();
        
                document.getElementById("pregunta").value = "";
                document.getElementById("respuesta").value = "";
                opcionesCampos.innerHTML = `
                    <div class="input-group mb-2">
                        <input type="checkbox" class="form-check-input ms-2" title="Seleccionar como respuesta">
                        <input type="text" class="form-control" placeholder="Escribe una opción">
                    </div>
                `;
                opcionesContainer.classList.add("d-none");
            } catch (error) {
                console.error("Error al guardar la pregunta:", error);
            }
        });
    
        const mostrarImportarPreguntasBtn = document.getElementById("mostrarImportarPreguntas")
        const importarPreguntasContainer = document.getElementById("importarPreguntasContainer")
        const listaPreguntas = document.getElementById("listaPreguntas")
        mostrarImportarPreguntasBtn.addEventListener("click", () => {
            importarPreguntasContainer.classList.toggle("d-none")
            listaPreguntas.innerHTML = ""
            preguntas.preguntas.forEach(pregunta => {
                const opciones = pregunta.opciones ? pregunta.opciones.replace(/\n/g, ', ') : 'No tiene opciones'
                const li = document.createElement("li")
                li.classList.add("list-group-item")
                li.innerHTML = `
                    <strong>${pregunta.tipo}:</strong> ${pregunta.pregunta}
                    ${opciones ? `<p><strong>Opciones:</strong> ${opciones}</p>` : ""}
                    <button class="btn btn-sm btn-primary seleccionarPregunta" data-id="${pregunta.id}">Seleccionar</button>
                `
                listaPreguntas.appendChild(li)
            })
        })

        listaPreguntas.addEventListener("click", async (e) => {
            e.preventDefault();
        
            if (e.target.classList.contains("seleccionarPregunta")) {
                const preguntaId = e.target.getAttribute("data-id");
                const preguntaSeleccionada = preguntas.preguntas.find(pregunta => pregunta.id == preguntaId);
        
                if (preguntaSeleccionada) {
                    preguntasExamen.push({ id: preguntaSeleccionada.id, puntuacion: 0 });
        
                    document.getElementById("preguntasExamen").innerHTML += `
                        <li class="list-group-item d-flex justify-content-between align-items-center">
                            <div>
                                <strong>${preguntaSeleccionada.tipo}:</strong> ${preguntaSeleccionada.pregunta}
                                ${preguntaSeleccionada.opciones ? `<p><strong>Opciones:</strong> ${preguntaSeleccionada.opciones.replace(/\n/g, ', ')}</p>` : ""}
                            </div>
                            <div class="d-flex align-items-center">
                                <label for="puntuacion-${preguntaSeleccionada.id}" class="me-2">Puntuación:</label>
                                <input type="number" class="form-control puntuacion-input" id="puntuacion-${preguntaSeleccionada.id}" data-id="${preguntaSeleccionada.id}" value="1" min="0" style="width: 80px;">
                            </div>
                        </li>
                    `;
        
                    importarPreguntasContainer.classList.add("d-none");
                }
            }
        });

        const guardarExamenBtn = document.getElementById("guardarExamenBtn")
        guardarExamenBtn.addEventListener("click", async () => {
            try {
                const nombre = document.getElementById("nombreExamen").value;
                const fhInicio = document.getElementById("fechaInicio").value;
                const fhFinal = document.getElementById("fechaFin").value;
                const asignaturaId = document.getElementById("asignaturaExamen").value;
                const creadorId = sessionStorage.getItem("userId");
        
                const nuevoExamen = {
                    nombre,
                    fhInicio,
                    fhFinal,
                    usuarioId: creadorId,
                    asignaturaId,
                    active: 0,
                };
                console.log("Nuevo Examen:", nuevoExamen);
                const examenCreado = await postExamen(nuevoExamen);
        
                const puntuacionesInputs = document.querySelectorAll(".puntuacion-input");
                for (const input of puntuacionesInputs) {
                    const preguntaId = input.getAttribute("data-id");
                    const puntuacion = parseFloat(input.value);
        
                    await postExamenPregunta({
                        examenId: examenCreado.examen.id,
                        preguntaId: preguntaId,
                        puntuacion: puntuacion,
                    });
                }
        
                location.reload();
            } catch (error) {
                console.error("Error al guardar el examen:", error);
            }
        })
    }

    async function activeOrDesableExamenUI(id, estado) {
        const confirmarActiveOrDesable = document.getElementById(`confirmarActiveOrDesable${id}`);
    
        if (confirmarActiveOrDesable) {
            confirmarActiveOrDesable.addEventListener('click', async () => {
                try {
                    await activeOrDesableExamen(id);
    
                    const tabla = $('#Examenes').DataTable();
                    const row = tabla.row(`[data-id="${id}"]`);
    
                    if (!row.node()) {
                        console.error(`No se encontró la fila con id: ${id}`);
                        return;
                    }
    
                    const rowData = row.data();
                    if (!rowData || rowData.length < 5) {
                        console.error(`Los datos de la fila son inválidos:`, rowData);
                        return;
                    }
    
                    if (estado === 'active') {
                        row.data([
                            rowData[0],
                            rowData[1],
                            rowData[2],
                            rowData[3],
                            `
                            <button type="button" class="btn btn-danger btn-sm" data-bs-toggle="modal" data-bs-target="#deleteModal${id}"><i class="fas fa-edit"></i> Desactivar examen</button>
                            <button type="button" class="btn btn-info btn-sm" data-bs-toggle="modal" data-bs-target="#viewModal${id}">Ver preguntas</button>
                            `
                        ]).draw(false);
                    } else {
                        row.data([
                            rowData[0],
                            rowData[1],
                            rowData[2],
                            rowData[3], 
                            `
                            <button type="button" class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#editarExamenModal${id}"><i class="fas fa-edit"></i> Editar examen</button>
                            <button type="button" class="btn btn-success btn-sm" data-bs-toggle="modal" data-bs-target="#activeModal${id}"><i class="fas fa-edit"></i> Activar examen</button>
                            <button type="button" class="btn btn-info btn-sm" data-bs-toggle="modal" data-bs-target="#viewModal${id}">Ver preguntas</button>
                            `
                        ]).draw(false);
                    }
    
                    const modalElement = document.getElementById(estado === 'active' ? `activeModal${id}` : `deleteModal${id}`);
                    const modal = bootstrap.Modal.getInstance(modalElement);
                    if (modal) {
                        modal.hide();
                    }
                } catch (error) {
                    console.error('Error al confirmar la activación/desactivación:', error);
                }
            });
        }
    }

    function editarExamenUI(examen) {
        const modalHtml = editarExamenModal(examen);
        document.body.insertAdjacentHTML("beforeend", modalHtml);
    
        const guardarCambiosBtn = document.getElementById(`guardarCambiosExamen${examen.id}`);
        guardarCambiosBtn.addEventListener("click", async () => {
            try {
                const nombre = document.getElementById(`nombreExamen${examen.id}`).value;
                const fhInicio = document.getElementById(`fechaInicio${examen.id}`).value;
                const fhFinal = document.getElementById(`fechaFin${examen.id}`).value;
    
                const datosActualizados = {
                    nombre,
                    fhInicio,
                    fhFinal,
                    usuarioId: examen.usuarioId,
                    asignaturaId: examen.asignaturaId,
                    active: examen.active,
                };
    
                console.log("Datos actualizados del examen:", datosActualizados);
    
                await putExamen(examen.id, datosActualizados);
    
                // Actualizar la fila en la tabla
                const tabla = $('#Examenes').DataTable();
                const row = tabla.row(`[data-id="${examen.id}"]`);
    
                if (!row.node()) {
                    console.error(`No se encontró la fila con id: ${examen.id}`);
                    return;
                }
    
                const asignaturaNombre = asignaturas.asignatura.find(asig => asig.id === examen.asignaturaId)?.nombre || "Sin asignatura";
    
                row.data([
                    nombre,
                    fhInicio,
                    fhFinal,
                    asignaturaNombre,
                    row.data()[4],
                ]).draw(false);
    
                const modalElement = document.getElementById(`editarExamenModal${examen.id}`);
                const modal = bootstrap.Modal.getInstance(modalElement);
                if (modal) {
                    modal.hide();
                }
            } catch (error) {
                console.error("Error al actualizar el examen:", error);
            }
        });
    }

    async function mostrarPreguntasExamen(examen) {
        const modalHtml = verPreguntasModal(examen)
        document.body.insertAdjacentHTML("beforeend", modalHtml)
    
        const modalElement = document.getElementById(`viewModal${examen.id}`)
        const guardarCambiosBtn = document.getElementById(`guardarCambiosPreguntas${examen.id}`)
    
        if (guardarCambiosBtn) {
            guardarCambiosBtn.addEventListener("click", async () => {
                try {
                    const checkboxes = document.querySelectorAll(`#viewModal${examen.id} .checkboxPregunta:checked`)
                    const preguntasAEliminar = Array.from(checkboxes).map(checkbox => checkbox.getAttribute("data-id"))
    
                    for (const preguntaId of preguntasAEliminar) {
                        await deleteExamenPregunta(examen.id, preguntaId)
                    }
    
                    const modal = bootstrap.Modal.getInstance(modalElement)
                    modal.hide()
                    location.reload()
                } catch (error) {
                    console.error("Error al eliminar las preguntas:", error)
                }
            })
        }
    }
    await crearExamen()
    await rellenarExamenes()
})