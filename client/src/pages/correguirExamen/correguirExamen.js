import { getExamenActiveWithPreguntasByUserId } from "../../components/examenApi";
import { getUsuariosByExamenId } from "../../components/userApi";

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
        const examenes = await getExamenActiveWithPreguntasByUserId(userId);

        if (examenes.length > 0) {
            examenes.forEach((examen) => {
                const option = document.createElement("option");
                option.value = examen.id;
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
            const usuarios = await getUsuariosByExamenId(examenId);

            if (usuarios.length > 0) {
                usuarios.forEach((usuario) => {
                    const userRow = document.createElement("div");
                    userRow.classList.add("d-flex", "align-items-center", "justify-content-between", "mb-3");

                    const userName = document.createElement("span");
                    userName.textContent = usuario.nombre;
                    userName.classList.add("fw-bold");

                    const corregirButton = document.createElement("button");
                    corregirButton.textContent = "Corregir";
                    corregirButton.classList.add("btn", "btn-primary", "btn-sm");

                    const autoButton = document.createElement("button");
                    autoButton.textContent = "Auto";
                    autoButton.classList.add("btn", "btn-secondary", "btn-sm", "ms-2");

                    userRow.appendChild(userName);
                    userRow.appendChild(corregirButton);
                    userRow.appendChild(autoButton);

                    userContainer.appendChild(userRow);
                });

                const corregirTodoButton = document.createElement("button");
                corregirTodoButton.textContent = "Corregir todo auto";
                corregirTodoButton.classList.add("btn", "btn-success", "mt-4");
                corregirTodoButton.addEventListener("click", () => {
                    alert("Función de corregir todo automáticamente (por implementar).");
                });

                userContainer.appendChild(corregirTodoButton);
            } else {
                const noUsersMessage = document.createElement("p");
                noUsersMessage.textContent = "No hay usuarios asociados a este examen.";
                noUsersMessage.classList.add("text-muted", "text-center");
                userContainer.appendChild(noUsersMessage);
            }
        } catch (error) {
            console.error("Error al obtener los usuarios:", error);
            const errorMessage = document.createElement("p");
            errorMessage.textContent = "Ocurrió un error al cargar los usuarios.";
            errorMessage.classList.add("text-danger", "text-center");
            userContainer.appendChild(errorMessage);
        }
    });
});