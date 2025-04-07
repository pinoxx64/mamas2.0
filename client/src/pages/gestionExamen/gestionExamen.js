import { getExamen, activeOrDesableExamen} from "../../components/examenApi"
import { getAsignatura } from "../../components/asignaturaApi"

document.addEventListener("DOMContentLoaded", async function () {
    const asignaturas = await getAsignatura()

    // Función para rellenar la tabla de examenes

    async function rellenarExamenes() {
        const examenes = await getExamen()
        console.log("Exámenes obtenidos:", examenes)

        const tabla = $('#Examenes').DataTable()
        tabla.clear().draw()

        examenes.examen.forEach(examen => {
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

    // Funcion que controla el evento de activar o desactivar el examen

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