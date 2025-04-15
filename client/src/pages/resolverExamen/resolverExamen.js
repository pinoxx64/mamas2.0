import { getExamenActiveWithPreguntasByUserId } from "../../components/examenApi";

document.addEventListener('DOMContentLoaded', async () => {
    const userId = sessionStorage.getItem('userId')
    const mainContent = document.querySelector('.main-content');
    
    async function verExamenes() {
        try {
            const examenes = await getExamenActiveWithPreguntasByUserId(userId)

            if (examenes.examenes && examenes.examenes.length > 0) {
                examenes.examenes.forEach(examen => {
                    const button = document.createElement('button');
                    button.classList.add('btn', 'btn-primary', 'my-2');
                    button.textContent = examen.nombre;
                    button.addEventListener('click', () => {
                        sessionStorage.setItem('examenId', examen.id);
                        window.location.href = '../contestarExamen/contestarExamen.html';
                    });
                    mainContent.appendChild(button);
                });
            } else {
                const noExamenesMessage = document.createElement('p');
                noExamenesMessage.textContent = "Actualmente no hay ningún examen, vuelva más tarde.";
                noExamenesMessage.classList.add('text-muted', 'mt-3');
                mainContent.appendChild(noExamenesMessage);
            }
        } catch (error) {
            console.error("Error al obtener los exámenes:", error);
            const errorMessage = document.createElement('p');
            errorMessage.textContent = "No hay ningun examen disponible para tus asignaturas. Por favor, inténtelo de nuevo más tarde.";
            errorMessage.classList.add('text-danger', 'mt-3');
            mainContent.appendChild(errorMessage);
        }
    }

    verExamenes()
})