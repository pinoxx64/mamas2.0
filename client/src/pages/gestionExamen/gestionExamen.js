import { getExamen } from "../../components/examenApi";
import { getAsignatura } from "../../components/asignaturaApi";

document.addEventListener("DOMContentLoaded", async function () {
    const asignaturas = await getAsignatura();

    // Función para rellenar la tabla de exámenes
    async function rellenarExamenes() {
        const examenes = await getExamen();
        console.log("Exámenes obtenidos:", examenes);

        const tabla = $('#Examenes').DataTable();
        tabla.clear().draw();

        examenes.examen.forEach(examen => {
            // Obtener el nombre de la asignatura
            const asignatura = asignaturas.asignatura.find(asig => asig.id === examen.asignaturaId)?.nombre || "Sin asignatura";

            // Agregar fila a la tabla
            const row = tabla.row.add([
                examen.nombre,
                examen.fhInicio,
                examen.fhFinal,
                asignatura,
                `
                <button type="button" class="btn btn-primary btn-sm editar-examen">Editar examen</button>
                <button type="button" class="btn btn-success btn-sm activar-examen">Activar examen</button>
                <button type="button" class="btn btn-info btn-sm ver-preguntas">Ver preguntas</button>
                `
            ]).draw();

            // Puedes agregar eventos a los botones aquí si es necesario en el futuro
        });
    }

    // Inicializar la tabla y rellenar los datos
    $('#Examenes').DataTable();
    await rellenarExamenes();
});