import { postCorrecionExamen } from "../../components/correcionExamenApi";
import { getExamenWithInfo } from "../../components/examenApi";
import { getExamenPreguntaByExamenId } from "../../components/examenPreguntaApi";
import { calcularNotaYGuardar, correguirAuto, correguirAutoTodo } from "../../components/notaExamenApi";

document.addEventListener("DOMContentLoaded", async () => {
    const userId = sessionStorage.getItem("userId");
    const mainContent = document.querySelector(".main-content");

    const container = document.createElement("div");
    container.classList.add("container", "mt-5");

    const title = document.createElement("h2");
    title.textContent = "Corregir Exámenes";
    title.classList.add("mb-4", "text-center");
    container.appendChild(title);

    const examDropdown = document.createElement("select");
    examDropdown.classList.add("form-select", "mb-4");
    examDropdown.innerHTML = `<option value="">Selecciona un examen</option>`;
    container.appendChild(examDropdown);

    const userContainer = document.createElement("div");
    userContainer.classList.add("mt-4");
    container.appendChild(userContainer);

    mainContent.appendChild(container);

    try {
        const response = await getExamenWithInfo(userId);
        const examenes = response.examenes;

        if (examenes.length > 0) {
            examenes.forEach((examen) => {
                const option = document.createElement("option");
                option.value = examen.examenId;
                option.textContent = examen.nombre;
                examDropdown.appendChild(option);
            });
        } else {
            const noExamsMessage = document.createElement("p");
            noExamsMessage.textContent = "No has creado ningún examen.";
            noExamsMessage.classList.add("text-muted", "text-center");
            container.appendChild(noExamsMessage);
        }
    } catch (error) {
        console.error("Error al obtener los exámenes:", error);
        const errorMessage = document.createElement("p");
        errorMessage.textContent = "Ocurrió un error al cargar los exámenes.";
        errorMessage.classList.add("text-danger", "text-center");
        container.appendChild(errorMessage);
    }

    examDropdown.addEventListener("change", async (e) => {
        const examenId = e.target.value;

        userContainer.innerHTML = "";

        if (!examenId) return;

        try {
            const response = await getExamenWithInfo(userId);
            const examenSeleccionado = response.examenes.find(
                (examen) => examen.examenId == examenId
            );

            if (examenSeleccionado && examenSeleccionado.usuarios.length > 0) {
                examenSeleccionado.usuarios.forEach((usuario) => {
                    const userRow = document.createElement("div");
                    userRow.classList.add(
                        "d-flex",
                        "align-items-center",
                        "justify-content-between",
                        "mb-3"
                    );

                    const userName = document.createElement("span");
                    userName.textContent = `Usuario: ${usuario.usuarioNombre}`;
                    userName.classList.add("fw-bold");

                    const corregirButton = document.createElement("button");
                    corregirButton.textContent = "Corregir";
                    corregirButton.classList.add("btn", "btn-primary", "btn-sm");
                    corregirButton.setAttribute("data-bs-toggle", "modal");
                    corregirButton.setAttribute("data-bs-target", `#corregirModal${usuario.usuarioId}`);

                    const autoButton = document.createElement("button");
                    autoButton.textContent = "Auto";
                    autoButton.classList.add("btn", "btn-info", "btn-sm", "ms-2");
                    autoButton.setAttribute("data-bs-toggle", "modal");
                    autoButton.setAttribute("data-bs-target", `#confirmacionAutoModal${usuario.usuarioId}`);

                    userRow.appendChild(userName);
                    userRow.appendChild(corregirButton);
                    userRow.appendChild(autoButton);

                    userContainer.appendChild(userRow);

                    document.body.insertAdjacentHTML(
                        "beforeend",
                        corregirExamenModal(usuario, examenSeleccionado.nombre, examenSeleccionado.examenId)
                    );
                    document.body.insertAdjacentHTML(
                        "beforeend",
                        confirmacionAutoModal(usuario, examenSeleccionado.examenId)
                    );
                });

                const corregirTodoButton = document.createElement("button");
                corregirTodoButton.textContent = "Corregir todo auto";
                corregirTodoButton.classList.add("btn", "btn-success", "mt-4");
                corregirTodoButton.setAttribute("data-bs-toggle", "modal");
                corregirTodoButton.setAttribute("data-bs-target", "#confirmacionTodoModal");

                userContainer.appendChild(corregirTodoButton);

                document.body.insertAdjacentHTML(
                    "beforeend",
                    confirmacionTodoModal(examenSeleccionado.examenId)
                );
            } else {
                const noUsersMessage = document.createElement("p");
                noUsersMessage.textContent = "No hay respuestas asociadas a este examen.";
                noUsersMessage.classList.add("text-muted", "text-center");
                userContainer.appendChild(noUsersMessage);
            }
        } catch (error) {
            console.error("Error al obtener las respuestas del examen:", error);
            const errorMessage = document.createElement("p");
            errorMessage.textContent = "Ocurrió un error al cargar las respuestas.";
            errorMessage.classList.add("text-danger", "text-center");
            userContainer.appendChild(errorMessage);
        }
    });

    document.addEventListener("click", async (e) => {

        if (e.target.id.startsWith("finalizarCorreccion")) {
            const usuarioId = parseInt(e.target.id.replace("finalizarCorreccion", ""), 10);
            const modal = document.getElementById(`corregirModal${usuarioId}`);
            const checkboxes = modal.querySelectorAll("input[type='checkbox']");
            const examenId = parseInt(modal.getAttribute("data-examen-id"), 10);

            try {
                const response = await getExamenPreguntaByExamenId(examenId);
                const preguntas = response.examenPregunta;

                console.log("Preguntas obtenidas:", response);

                const correcciones = Array.from(checkboxes).map((checkbox) => {
                    const idParts = checkbox.id.split("_");
                    if (idParts.length < 2) {
                        console.error(`Formato de ID inválido para el checkbox: ${checkbox.id}`);
                        return null;
                    }

                    const respuestaExamenId = parseInt(idParts[1], 10);
                    if (isNaN(respuestaExamenId)) {
                        console.error(`ID de respuesta_examen inválido: ${checkbox.id}`);
                        return null;
                    }

                    const correcta = checkbox.checked;

                    const pregunta = preguntas.find((p) =>
                        Array.isArray(p.respuesta_examen) && p.respuesta_examen.some((r) => r.id === respuestaExamenId)
                    );

                    if (!pregunta) {
                        console.error(`No se encontró una pregunta para respuestaExamenId: ${respuestaExamenId}`);
                        return null;
                    }

                    const respuestaExamen = pregunta.respuesta_examen.find((r) => r.id === respuestaExamenId);

                    if (!respuestaExamen) {
                        console.error(`No se encontró una respuesta_examen para respuestaExamenId: ${respuestaExamenId}`);
                        return null;
                    }

                    return {
                        respuestaId: respuestaExamen.id,
                        correcta,
                    };
                }).filter((correccion) => correccion !== null);

                console.log("Correcciones a enviar:", correcciones);

                await postCorrecionExamen({ correcciones });

                const payload = {
                    examenId,
                    usuarioId,
                    resultados: correcciones,
                };

                console.log("Payload enviado a calcularNotaYGuardar:", payload);

                await calcularNotaYGuardar(payload);

                const userNameElement = document.querySelector(`span[data-usuario-id="${usuarioId}"]`);
                if (userNameElement) {
                    userNameElement.style.color = "green";
                }

                const bootstrapModal = bootstrap.Modal.getInstance(modal);
                bootstrapModal.hide();
            } catch (error) {
                console.error("Error al procesar la corrección:", error);
            }
        }

        if (e.target.id.startsWith("confirmarAuto")) {
            const usuarioId = parseInt(e.target.id.replace("confirmarAuto", ""), 10);
            const modal = document.getElementById(`confirmacionAutoModal${usuarioId}`);
            const examenId = parseInt(modal.getAttribute("data-examen-id"), 10);

            try {
                const payload = {
                    examenId,
                    usuarioId,
                };

                console.log("Payload enviado a correguirAuto:", payload);

                const response = await correguirAuto(payload);

                console.log("Resultado de la corrección automática:", response);

                const userNameElement = document.querySelector(`span[data-usuario-id="${usuarioId}"]`);
                if (userNameElement) {
                    userNameElement.style.color = "green";
                }

                const bootstrapModal = bootstrap.Modal.getInstance(modal);
                bootstrapModal.hide();
            } catch (error) {
                console.error("Error al corregir automáticamente:", error);
            }
        }

        if (e.target.id === "confirmarTodo") {
            const modal = document.getElementById("confirmacionTodoModal");
            const examenId = parseInt(modal.getAttribute("data-examen-id"), 10);

            try {
                const payload = {
                    examenId,
                };

                console.log("Payload enviado a correguirAutoTodo:", payload);

                const response = await correguirAutoTodo(payload);

                console.log("Resultado de la corrección automática para todos:", response);

                const userNameElements = document.querySelectorAll("span[data-usuario-id]");
                userNameElements.forEach((element) => {
                    element.style.color = "green";
                });

                const bootstrapModal = bootstrap.Modal.getInstance(modal);
                bootstrapModal.hide();
            } catch (error) {
                console.error("Error al corregir automáticamente todos los exámenes:", error);
            }
        }
    })

    function corregirExamenModal(usuario, examenNombre, examenId) {
        return `
            <div class="modal" id="corregirModal${usuario.usuarioId}" data-examen-id="${examenId}">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Corregir Examen: ${examenNombre} - ${usuario.usuarioNombre}</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            ${usuario.respuestas.map((respuesta) => `
                                <div class="mb-3">
                                    <p>Pregunta: ${respuesta.pregunta}</p>
                                    <p>Respuesta: ${respuesta.respuesta}</p>
                                    <div class="form-check">
                                        <input type="checkbox" class="form-check-input" id="respuesta_${respuesta.respuestaId}">
                                        <label class="form-check-label" for="respuesta_${respuesta.respuestaId}">Correcta</label>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-success" id="finalizarCorreccion${usuario.usuarioId}">Finalizar corrección</button>
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    function confirmacionAutoModal(usuario, examenId) {
        return `
            <div class="modal" id="confirmacionAutoModal${usuario.usuarioId}" data-examen-id="${examenId}">
                <div class="modal-dialog modal-md">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">¿Estás seguro que quieres corregir automáticamente el examen de "${usuario.usuarioNombre}"?</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-success" id="confirmarAuto${usuario.usuarioId}">Confirmar</button>
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                        </div>
                    </div>
                </div>
            </div>
        `
    }

    function confirmacionTodoModal(examenId) {
        return `
            <div class="modal" id="confirmacionTodoModal" data-examen-id="${examenId}">
                <div class="modal-dialog modal-md">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">¿Estás seguro que quieres corregir automáticamente todos los exámenes?</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-success" id="confirmarTodo">Confirmar</button>
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                        </div>
                    </div>
                </div>
            </div>
        `
    }
});