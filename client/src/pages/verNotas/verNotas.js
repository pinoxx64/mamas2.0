import { getNotaExamenByUsuarioId } from "../../components/notaExamenApi";
import { getCorrecionExamenByUserAndExamen } from "../../components/correcionExamenApi";

document.addEventListener("DOMContentLoaded", async () => {
    const userId = sessionStorage.getItem("userId");
    const mainContent = document.querySelector(".main-content");

    const container = document.createElement("div");
    container.classList.add("container", "mt-5");

    const title = document.createElement("h2");
    title.textContent = "Tus Notas";
    title.classList.add("mb-4", "text-center");
    container.appendChild(title);

    const notasContainer = document.createElement("div");
    notasContainer.classList.add("notas-container");
    container.appendChild(notasContainer);

    mainContent.appendChild(container);

    try {
        const response = await getNotaExamenByUsuarioId(userId);
        const notas = response.notasExamen;

        if (notas.length > 0) {
            notas.forEach((nota) => {
                console.log("Nota:", nota);
                const notaCard = document.createElement("div");
                notaCard.classList.add("card", "mb-3");

                const cardBody = document.createElement("div");
                cardBody.classList.add("card-body");

                const examenTitle = document.createElement("h5");
                examenTitle.classList.add("card-title");
                examenTitle.textContent = `Examen: ${nota.examen.nombre}`;

                const notaText = document.createElement("p");
                notaText.classList.add("card-text");
                notaText.textContent = `Nota: ${nota.nota}`;

                // Botón para ver preguntas correctas y falladas
                const verPreguntasBtn = document.createElement("button");
                verPreguntasBtn.classList.add("btn", "btn-primary", "mt-2");
                verPreguntasBtn.textContent = "Ver Detalles";
                verPreguntasBtn.setAttribute("data-bs-toggle", "modal");
                verPreguntasBtn.setAttribute("data-bs-target", `#detalleModal${nota.examen.id}`);

                // Modal para mostrar preguntas correctas y falladas
                const modalHtml = `
                    <div class="modal fade" id="detalleModal${nota.examen.id}" tabindex="-1" aria-labelledby="detalleModalLabel${nota.examen.id}" aria-hidden="true">
                        <div class="modal-dialog modal-lg">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h5 class="modal-title" id="detalleModalLabel${nota.examen.id}">Detalles del Examen: ${nota.examen.nombre}</h5>
                                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div class="modal-body">
                                    <h6>Preguntas Correctas:</h6>
                                    <ul id="correctas-${nota.examen.id}" class="list-group mb-3"></ul>
                                    <h6>Preguntas Falladas:</h6>
                                    <ul id="falladas-${nota.examen.id}" class="list-group"></ul>
                                </div>
                                <div class="modal-footer">
                                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                                </div>
                            </div>
                        </div>
                    </div>
                `;

                // Agregar el modal al DOM
                document.body.insertAdjacentHTML("beforeend", modalHtml);
                verPreguntasBtn.addEventListener("click", async () => {
                    try {
                        // Obtener las correcciones del examen para el usuario
                        const response = await getCorrecionExamenByUserAndExamen(userId, nota.examen.id);
                        console.log("Respuesta de la API:", response);
                
                        const correcciones = response?.correcciones || []; // Asegurarse de que sea un array
                
                        const correctasList = document.getElementById(`correctas-${nota.examen.id}`);
                        const falladasList = document.getElementById(`falladas-${nota.examen.id}`);
                
                        // Limpiar las listas antes de llenarlas
                        correctasList.innerHTML = "";
                        falladasList.innerHTML = "";
                
                        if (correcciones.length === 0) {
                            const noDataMessage = document.createElement("li");
                            noDataMessage.classList.add("list-group-item", "text-muted");
                            noDataMessage.textContent = "No hay datos disponibles.";
                            correctasList.appendChild(noDataMessage);
                            return;
                        }
                
                        // Separar las preguntas correctas y falladas
                        correcciones.forEach((correccion) => {
                            const li = document.createElement("li");
                            li.classList.add("list-group-item");
                            li.textContent = correccion.respuesta?.pregunta?.texto || "Pregunta no disponible";
                
                            if (correccion.correcta) {
                                correctasList.appendChild(li);
                            } else {
                                falladasList.appendChild(li);
                            }
                        });
                    } catch (error) {
                        console.error("Error al cargar las preguntas del examen:", error);
                    }
                });

                cardBody.appendChild(examenTitle);
                cardBody.appendChild(notaText);
                cardBody.appendChild(verPreguntasBtn);
                notaCard.appendChild(cardBody);

                notasContainer.appendChild(notaCard);
            });
        } else {
            const noNotasMessage = document.createElement("p");
            noNotasMessage.textContent = "No tienes notas registradas.";
            noNotasMessage.classList.add("text-muted", "text-center");
            notasContainer.appendChild(noNotasMessage);
        }
    } catch (error) {
        console.error("Error al obtener las notas:", error);
        const errorMessage = document.createElement("p");
        errorMessage.textContent = "Ocurrió un error al cargar tus notas.";
        errorMessage.classList.add("text-danger", "text-center");
        notasContainer.appendChild(errorMessage);
    }
});