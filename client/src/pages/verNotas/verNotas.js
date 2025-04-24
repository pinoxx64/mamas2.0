import { getNotaExamenByUsuarioId } from "../../components/notaExamenApi";

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

                cardBody.appendChild(examenTitle);
                cardBody.appendChild(notaText);
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