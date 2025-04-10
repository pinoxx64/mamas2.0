import { getExamen, postExamen } from "../../components/examenApi" 
import { getAsignatura } from "../../components/asignaturaApi"
import { getPreguntasWithRespuestas, postPregunta } from "../../components/preguntaApi"
import { postRespuesta } from "../../components/respuestaApi"
import { postExamenPregunta } from "../../components/examenPreguntaApi"

document.addEventListener("DOMContentLoaded", async function () {
    const asignaturas = await getAsignatura()
    const preguntas = await getPreguntasWithRespuestas()

    const preguntasExamen = []
    // Cargar asignaturas en el select
    const asignaturaSelect = document.getElementById("asignaturaExamen")
    asignaturas.asignatura.forEach(asignatura => {
        const option = document.createElement("option")
        option.value = asignatura.id
        option.textContent = asignatura.nombre
        asignaturaSelect.appendChild(option)
    })

    // Mostrar el modal de crear pregunta al hacer clic en "Añadir Pregunta"
    const mostrarCrearPreguntaBtn = document.getElementById("mostrarCrearPregunta")
    mostrarCrearPreguntaBtn.addEventListener("click", () => {
        const crearPreguntaModal = new bootstrap.Modal(document.getElementById("crearPreguntaModal"))
        crearPreguntaModal.show()
    })

    // Mostrar/ocultar campos según el tipo de pregunta
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
            const tipo = document.getElementById("tipoPregunta").value
            const pregunta = document.getElementById("pregunta").value
            const asignaturaId = document.getElementById("asignaturaExamen").value
    
            let opciones = []
            let respuestaPregunta = null
            let tipoPregunta = tipo
    
            // Manejar preguntas con opciones
            if (tipo === "opciones") {
                const opcionesInputs = document.querySelectorAll("#opcionesCampos .input-group")
                opciones = Array.from(opcionesInputs).map(opcionDiv => {
                    const texto = opcionDiv.querySelector("input[type='text']").value
                    const seleccionado = opcionDiv.querySelector("input[type='checkbox']").checked
                    return { texto, seleccionado }
                })
    
                const opcionesSeleccionadas = opciones.filter(opcion => opcion.seleccionado)
                if (opcionesSeleccionadas.length === 1) {
                    respuestaPregunta = opcionesSeleccionadas[0].texto
                    opciones = opciones.map(opcion => opcion.texto)
                    tipoPregunta = "opciones individuales"
                } else if (opcionesSeleccionadas.length > 1) {
                    respuestaPregunta = opcionesSeleccionadas.map(opcion => opcion.texto).join(", ")
                    opciones = opciones.map(opcion => opcion.texto)
                    tipoPregunta = "opciones multiples"
                } else {
                    alert("Debe seleccionar al menos una opción como respuesta.")
                    return
                }
            } else {
                // Manejar preguntas de texto o número
                respuestaPregunta = document.getElementById("respuesta").value
            }
    
            // Crear la pregunta
            const nuevaPregunta = {
                tipo: tipoPregunta,
                pregunta,
                asignaturaId,
                opciones: opciones.length > 0 ? opciones.join("\n") : null,
            }
    
            console.log("Nueva Pregunta:", nuevaPregunta)
            const respuesta = await postPregunta(nuevaPregunta)
    
            // Crear la respuesta asociada
            const nuevaRespuesta = {
                respuesta: respuestaPregunta,
                preguntaId: respuesta.pregunta.id,
            }
    
            console.log("Nueva Respuesta:", nuevaRespuesta)
            await postRespuesta(nuevaRespuesta)
    
            // Agregar la pregunta al examen
            preguntasExamen.push(respuesta.pregunta.id)
            document.getElementById("preguntasExamen").innerHTML += `
                <li class="list-group-item">
                    <strong>Pregunta:</strong> ${pregunta}
                    ${opciones.length > 0 ? `<p><strong>Opciones:</strong> ${opciones.join(", ")}</p>` : ""}
                </li>
            `
    
            // Cerrar el modal
            const crearPreguntaModal = bootstrap.Modal.getInstance(document.getElementById("crearPreguntaModal"))
            crearPreguntaModal.hide()
    
            // Limpiar los campos del formulario
            document.getElementById("pregunta").value = ""
            document.getElementById("respuesta").value = ""
            opcionesCampos.innerHTML = `
                <div class="input-group mb-2">
                    <input type="checkbox" class="form-check-input ms-2" title="Seleccionar como respuesta">
                    <input type="text" class="form-control" placeholder="Escribe una opción">
                </div>
            `
            opcionesContainer.classList.add("d-none")
        } catch (error) {
            console.error("Error al guardar la pregunta:", error)
            alert("Ocurrió un error al guardar la pregunta. Por favor, inténtelo de nuevo.")
        }
    })

    // Mostrar contenedor para importar preguntas
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

    // Seleccionar pregunta para importar
    listaPreguntas.addEventListener("click", async (e) => {
        if (e.target.classList.contains("seleccionarPregunta")) {
            const preguntaId = e.target.getAttribute("data-id")
            const preguntaSeleccionada = preguntas.preguntas.find(pregunta => pregunta.id == preguntaId)

            if (preguntaSeleccionada) {
                preguntasExamen.push(preguntaSeleccionada.id)

                document.getElementById("preguntasExamen").innerHTML += `
                    <li class="list-group-item">
                        <strong>${preguntaSeleccionada.tipo}:</strong> ${preguntaSeleccionada.pregunta}
                        ${preguntaSeleccionada.opciones ? `<p><strong>Opciones:</strong> ${preguntaSeleccionada.opciones.replace(/\n/g, ', ')}</p>` : ""}
                    </li>
                `

                importarPreguntasContainer.classList.add("d-none")
            }
        }
    })

    // Guardar examen
    const guardarExamenBtn = document.getElementById("guardarExamenBtn")
    guardarExamenBtn.addEventListener("click", async () => {
        try {
            const nombre = document.getElementById("nombreExamen").value
            const fhInicio = document.getElementById("fechaInicio").value
            const fhFinal = document.getElementById("fechaFin").value
            const asignaturaId = document.getElementById("asignaturaExamen").value
            const creadorId = sessionStorage.getItem("userId")

            const nuevoExamen = {
                nombre,
                fhInicio,
                fhFinal,
                usuarioId: creadorId,
                asignaturaId,
                active: 0,
            }
            console.log("Nuevo Examen:", nuevoExamen)
            const examenCreado = await postExamen(nuevoExamen)

            for (const preguntaId of preguntasExamen) {
                await postExamenPregunta({
                    examenId: examenCreado.examen.id,
                    preguntaId: preguntaId,
                })
            }

            alert("Examen creado exitosamente.")
            location.reload()
        } catch (error) {
            console.error("Error al guardar el examen:", error)
        }
    })





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
        `;
    }

    // Editar preguntas de cada examen

    function verPreguntasExamenModal(examenId, preguntas) {
        const preguntasHtml = preguntas.map(pregunta => `
            <li class="list-group-item d-flex justify-content-between align-items-center">
                <span>${pregunta.pregunta}</span>
                <button class="btn btn-danger btn-sm eliminarPregunta" data-id="${pregunta.id}">Eliminar</button>
            </li>
        `).join('');
    
        return `
            <div class="modal fade" id="verPreguntasExamenModal${examenId}" tabindex="-1" aria-labelledby="verPreguntasExamenModalLabel${examenId}" aria-hidden="true">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="verPreguntasExamenModalLabel${examenId}">Preguntas del Examen</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <ul class="list-group">
                                ${preguntasHtml}
                            </ul>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

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
                ]).draw()

                document.body.insertAdjacentHTML('beforeend', deleteExamen(examen))
                activeOrDesableExamenUI(examen.id, 'disable')

                document.body.insertAdjacentHTML('beforeend', verPreguntasModal(examen))
            } else {

                // La tabla que se ve cuando el usuario está desactivo

                const row = tabla.row.add([
                    examen.nombre,
                    examen.fhInicio,
                    examen.fhFinal,
                    asignatura,
                    `
                    <button type="button" class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#editModal${examen.id}"><i class="fas fa-edit"></i> Editar examen</button>
                    <button type="button" class="btn btn-success btn-sm" data-bs-toggle="modal" data-bs-target="#activeModal${examen.id}"><i class="fas fa-edit"></i> Activar examen</button>
                    <button type="button" class="btn btn-info btn-sm" data-bs-toggle="modal" data-bs-target="#viewModal${examen.id}">Ver preguntas</button>
                    <button type="button" class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#editPreguntaModal${examen.id}">Editar preguntas</button>
                    `
                ]).draw()

                document.body.insertAdjacentHTML('beforeend', activeExamen(examen))
                activeOrDesableExamenUI(examen.id, 'active')

                document.body.insertAdjacentHTML('beforeend', verPreguntasModal(examen))

                document.body.insertAdjacentHTML('beforeend', editarExamenModal(examen))
                editarExamenUI(examen)

                document.body.insertAdjacentHTML('beforeend', verPreguntasExamenModal(examen.id, examen.preguntas))
                //mostrarPreguntasExamen(examen.id)
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
                <li class="list-group-item">
                    <strong>${pregunta.tipo}:</strong> ${pregunta.pregunta}
                    ${opcionesHtml}
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
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                        </div>
                    </div>
                </div>
            </div>
        `
    }

    async function activeOrDesableExamenUI(id, estado) {
        const confirmarActiveOrDesable = document.getElementById(`confirmarActiveOrDesable${id}`)

        if (confirmarActiveOrDesable) {
            confirmarActiveOrDesable.addEventListener('click', async () => {
                try {
                    await activeOrDesableExamen(id)

                    if (estado == 'active') {
                        const modalElement = document.getElementById(`activeModal${id}`)
                        const modal = new bootstrap.Modal(modalElement)
                        modal.hide()
                    } else {
                        const modalElement2 = document.getElementById(`deleteModal${id}`)
                        console.log(modalElement2)
                        const modal2 = new bootstrap.Modal(modalElement2)
                        modal2.hide()
                    }
                    location.reload()

                } catch (error) {
                    console.error('Error al confirmar la activación/desactivación:', error)
                }
            })
        }
    }

    // Función para manejar la edición del examen
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
    
                alert("Examen actualizado exitosamente.");
                location.reload();
            } catch (error) {
                console.error("Error al actualizar el examen:", error);
                alert("Ocurrió un error al actualizar el examen. Por favor, inténtelo de nuevo.");
            }
        });
    }

    async function mostrarPreguntasExamen(examenId) {
        try {
            // Obtener las preguntas del examen por su ID
            const response = await fetch(`/api/examenPregunta/examen/${examenId}`);
            const data = await response.json();
    
            if (!data.examenPregunta || data.examenPregunta.length === 0) {
                alert("No hay preguntas asociadas a este examen.");
                return;
            }
    
            // Crear el modal con las preguntas
            const modalHtml = verPreguntasExamenModal(examenId, data.examenPregunta);
            document.body.insertAdjacentHTML("beforeend", modalHtml);
    
            // Mostrar el modal
            const modal = new bootstrap.Modal(document.getElementById(`verPreguntasExamenModal${examenId}`));
            modal.show();
    
            // Manejar la eliminación de preguntas
            document.querySelectorAll(`#verPreguntasExamenModal${examenId} .eliminarPregunta`).forEach(button => {
                button.addEventListener("click", async (e) => {
                    const preguntaId = e.target.getAttribute("data-id");
    
                    if (confirm("¿Estás seguro de que deseas eliminar esta pregunta del examen?")) {
                        try {
                            const deleteResponse = await fetch(`/api/examenPregunta/examen/${examenId}/${preguntaId}`, {
                                method: "DELETE",
                            });
    
                            if (deleteResponse.ok) {
                                alert("Pregunta eliminada del examen correctamente.");
                                modal.hide();
                                location.reload(); // Recargar la página para actualizar la lista
                            } else {
                                alert("Error al eliminar la pregunta del examen.");
                            }
                        } catch (error) {
                            console.error("Error al eliminar la pregunta:", error);
                            alert("Ocurrió un error al eliminar la pregunta.");
                        }
                    }
                });
            });
        } catch (error) {
            console.error("Error al obtener las preguntas del examen:", error);
            alert("Ocurrió un error al obtener las preguntas del examen.");
        }
    }

    await rellenarExamenes()
})