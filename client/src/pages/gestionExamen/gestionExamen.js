// Tienes que seguir retocando el crear examen (creo que se me está yendo de compejidad el modal, para el proximo dia apuntate de que se cree el examen sin preguntas y que en la tabla salgan las preguntas para crearlas)

import { getExamen, activeOrDesableExamen} from "../../components/examenApi"
import { getAsignatura } from "../../components/asignaturaApi"
import { getPreguntasWithRespuestas } from "../../components/preguntaApi"

document.addEventListener("DOMContentLoaded", async function () {
    const asignaturas = await getAsignatura();
    const preguntas = await getPreguntasWithRespuestas();

    // Lista global para almacenar las preguntas seleccionadas y creadas
    const preguntasSeleccionadas = [];

    // Cargar asignaturas en el select del modal
    const asignaturaSelect = document.getElementById("asignaturaExamen");
    asignaturas.asignatura.forEach(asignatura => {
        const option = document.createElement("option");
        option.value = asignatura.id;
        option.textContent = asignatura.nombre;
        asignaturaSelect.appendChild(option);
    });

    // Cargar preguntas en el select de importar preguntas
    const importarPreguntasSelect = document.getElementById("importarPreguntasSelect");
    preguntas.preguntas.forEach(pregunta => {
        const option = document.createElement("option");
        option.value = pregunta.id;
        option.textContent = `${pregunta.tipo}: ${pregunta.pregunta}`;
        importarPreguntasSelect.appendChild(option);
    });

    // Mostrar/ocultar el select de importar preguntas
    const importarPreguntasBtn = document.getElementById("importarPreguntasBtn");
    const importarPreguntasContainer = document.getElementById("importarPreguntasContainer");
    importarPreguntasBtn.addEventListener("click", () => {
        importarPreguntasContainer.classList.toggle("d-none");
    });

    // Agregar preguntas seleccionadas al hacer clic en el select
    importarPreguntasSelect.addEventListener("change", () => {
        const seleccionadas = Array.from(importarPreguntasSelect.selectedOptions).map(option => option.value);
        seleccionadas.forEach(id => {
            if (!preguntasSeleccionadas.includes(id)) {
                preguntasSeleccionadas.push(id);
            }
        });
        console.log("Preguntas seleccionadas:", preguntasSeleccionadas);
    });

    // Guardar una nueva pregunta creada desde el modal "Añadir Pregunta"
    const guardarPreguntaBtn = document.getElementById("guardarPregunta");
    guardarPreguntaBtn.addEventListener("click", async () => {
        try {
            const tipo = document.getElementById("tipoPregunta").value;
            const pregunta = document.getElementById("pregunta").value;
            const asignaturaId = document.getElementById("asignatura").value;

            let opciones = [];
            if (tipo === "opciones") {
                const opcionesInputs = document.querySelectorAll("#opcionesCampos .form-control");
                opciones = Array.from(opcionesInputs).map(input => input.value);
            }

            const nuevaPregunta = {
                tipo,
                pregunta,
                asignaturaId,
                opciones: opciones.length > 0 ? opciones.join("\n") : null,
            };

            const respuesta = await postPregunta(nuevaPregunta);
            preguntasSeleccionadas.push(respuesta.pregunta.id); // Agregar la nueva pregunta a la lista
            console.log("Pregunta creada y añadida:", respuesta.pregunta);
            alert("Pregunta creada y añadida al examen.");
        } catch (error) {
            console.error("Error al crear la pregunta:", error);
        }
    });

    // Guardar el examen
    const guardarExamenBtn = document.getElementById("guardarExamenBtn");
    guardarExamenBtn.addEventListener("click", async () => {
        try {
            const nombre = document.getElementById("nombreExamen").value;
            const fhInicio = document.getElementById("fechaInicio").value;
            const fhFinal = document.getElementById("fechaFin").value;
            const asignaturaId = document.getElementById("asignaturaExamen").value;

            const nuevoExamen = {
                nombre,
                fhInicio,
                fhFinal,
                asignaturaId,
                preguntas: preguntasSeleccionadas, // Usar la lista global de preguntas
            };

            console.log("Nuevo Examen:", nuevoExamen);

            // Aquí puedes enviar el examen al servidor
            // await postExamen(nuevoExamen);

            alert("Examen creado exitosamente.");
            location.reload();
        } catch (error) {
            console.error("Error al guardar el examen:", error);
        }
    });

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
                //activeOrDesableExamenUI(examen)
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
                    `
                ]).draw()

                document.body.insertAdjacentHTML('beforeend', activeExamen(examen))
                activeOrDesableExamenUI(examen.id, 'active')

                document.body.insertAdjacentHTML('beforeend', verPreguntasModal(examen))
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
                    }else{
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

    await rellenarExamenes()
})