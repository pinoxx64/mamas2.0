import { getExamenWithInfo } from "../../components/examenApi"

document.addEventListener("DOMContentLoaded", async () => {
    const userId = sessionStorage.getItem("userId")
    const mainContent = document.querySelector(".main-content")

    const container = document.createElement("div")
    container.classList.add("container", "mt-5")

    const title = document.createElement("h2")
    title.textContent = "Corregir Exámenes"
    title.classList.add("mb-4", "text-center")
    container.appendChild(title)

    const examDropdown = document.createElement("select")
    examDropdown.classList.add("form-select", "mb-4")
    examDropdown.innerHTML = `<option value="">Selecciona un examen</option>`
    container.appendChild(examDropdown)

    const userContainer = document.createElement("div")
    userContainer.classList.add("mt-4")
    container.appendChild(userContainer)

    mainContent.appendChild(container)

    try {
        const response = await getExamenWithInfo(userId)
        const examenes = response.examenes

        if (examenes.length > 0) {
            examenes.forEach((examen) => {
                const option = document.createElement("option")
                option.value = examen.examenId
                option.textContent = examen.nombre
                examDropdown.appendChild(option)
            })
        } else {
            const noExamsMessage = document.createElement("p")
            noExamsMessage.textContent = "No has creado ningún examen."
            noExamsMessage.classList.add("text-muted", "text-center")
            container.appendChild(noExamsMessage)
        }
    } catch (error) {
        console.error("Error al obtener los exámenes:", error)
        const errorMessage = document.createElement("p")
        errorMessage.textContent = "Ocurrió un error al cargar los exámenes."
        errorMessage.classList.add("text-danger", "text-center")
        container.appendChild(errorMessage)
    }

    examDropdown.addEventListener("change", async (e) => {
        const examenId = e.target.value

        userContainer.innerHTML = ""

        if (!examenId) return

        try {
            const response = await getExamenWithInfo(userId)
            const examenSeleccionado = response.examenes.find(
                (examen) => examen.examenId == examenId
            )

            if (examenSeleccionado && examenSeleccionado.usuarios.length > 0) {
                examenSeleccionado.usuarios.forEach((usuario) => {
                    const userRow = document.createElement("div")
                    userRow.classList.add(
                        "d-flex",
                        "align-items-center",
                        "justify-content-between",
                        "mb-3"
                    )

                    const userName = document.createElement("span")
                    userName.textContent = `Usuario: ${usuario.usuarioNombre}`
                    userName.classList.add("fw-bold")

                    const corregirButton = document.createElement("button")
                    corregirButton.textContent = "Corregir"
                    corregirButton.classList.add("btn", "btn-primary", "btn-sm")
                    corregirButton.addEventListener("click", () => {
                        abrirModalCorreccion(usuario, examenSeleccionado.nombre)
                    })

                    const autoButton = document.createElement("button")
                    autoButton.textContent = "Auto"
                    autoButton.classList.add("btn", "btn-secondary", "btn-sm", "ms-2")
                    autoButton.addEventListener("click", () => {
                        abrirModalConfirmacionAuto(usuario.usuarioNombre)
                    })

                    userRow.appendChild(userName)
                    userRow.appendChild(corregirButton)
                    userRow.appendChild(autoButton)

                    userContainer.appendChild(userRow)
                })

                const corregirTodoButton = document.createElement("button")
                corregirTodoButton.textContent = "Corregir todo auto"
                corregirTodoButton.classList.add("btn", "btn-success", "mt-4")
                corregirTodoButton.addEventListener("click", () => {
                    abrirModalConfirmacionTodo()
                })

                userContainer.appendChild(corregirTodoButton)
            } else {
                const noUsersMessage = document.createElement("p")
                noUsersMessage.textContent = "No hay respuestas asociadas a este examen."
                noUsersMessage.classList.add("text-muted", "text-center")
                userContainer.appendChild(noUsersMessage)
            }
        } catch (error) {
            console.error("Error al obtener las respuestas del examen:", error)
            const errorMessage = document.createElement("p")
            errorMessage.textContent = "Ocurrió un error al cargar las respuestas."
            errorMessage.classList.add("text-danger", "text-center")
            userContainer.appendChild(errorMessage)
        }
    })

    function abrirModalConfirmacionAuto(usuarioNombre) {
        const modal = document.createElement("div")
        modal.classList.add("modal", "d-block", "bg-dark", "bg-opacity-50")
        modal.style.position = "fixed"
        modal.style.top = "0"
        modal.style.left = "0"
        modal.style.width = "100%"
        modal.style.height = "100%"
        modal.style.zIndex = "1050"

        const modalDialog = document.createElement("div")
        modalDialog.classList.add("modal-dialog", "modal-dialog-centered")

        const modalContent = document.createElement("div")
        modalContent.classList.add("modal-content")

        const modalHeader = document.createElement("div")
        modalHeader.classList.add("modal-header")
        const modalTitle = document.createElement("h5")
        modalTitle.classList.add("modal-title")
        modalTitle.textContent = `¿Estás seguro que quieres corregir automáticamente el examen de "${usuarioNombre}"?`
        const closeButton = document.createElement("button")
        closeButton.classList.add("btn-close")
        closeButton.addEventListener("click", () => {
            modal.remove()
        })
        modalHeader.appendChild(modalTitle)
        modalHeader.appendChild(closeButton)

        const modalFooter = document.createElement("div")
        modalFooter.classList.add("modal-footer")

        const confirmarButton = document.createElement("button")
        confirmarButton.classList.add("btn", "btn-success")
        confirmarButton.textContent = "Confirmar"
        confirmarButton.addEventListener("click", () => {
            console.log(`Examen de "${usuarioNombre}" corregido automáticamente.`)
            modal.remove()
        })

        const cancelarButton = document.createElement("button")
        cancelarButton.classList.add("btn", "btn-secondary")
        cancelarButton.textContent = "Cancelar"
        cancelarButton.addEventListener("click", () => {
            modal.remove()
        })

        modalFooter.appendChild(confirmarButton)
        modalFooter.appendChild(cancelarButton)

        modalContent.appendChild(modalHeader)
        modalContent.appendChild(modalFooter)

        modalDialog.appendChild(modalContent)
        modal.appendChild(modalDialog)

        document.body.appendChild(modal)
    }

    function abrirModalConfirmacionTodo() {
        const modal = document.createElement("div")
        modal.classList.add("modal", "d-block", "bg-dark", "bg-opacity-50")
        modal.style.position = "fixed"
        modal.style.top = "0"
        modal.style.left = "0"
        modal.style.width = "100%"
        modal.style.height = "100%"
        modal.style.zIndex = "1050"

        const modalDialog = document.createElement("div")
        modalDialog.classList.add("modal-dialog", "modal-dialog-centered")

        const modalContent = document.createElement("div")
        modalContent.classList.add("modal-content")

        const modalHeader = document.createElement("div")
        modalHeader.classList.add("modal-header")
        const modalTitle = document.createElement("h5")
        modalTitle.classList.add("modal-title")
        modalTitle.textContent = "¿Estás seguro que quieres corregir automáticamente todos los exámenes?"
        const closeButton = document.createElement("button")
        closeButton.classList.add("btn-close")
        closeButton.addEventListener("click", () => {
            modal.remove()
        })
        modalHeader.appendChild(modalTitle)
        modalHeader.appendChild(closeButton)

        const modalFooter = document.createElement("div")
        modalFooter.classList.add("modal-footer")

        const confirmarButton = document.createElement("button")
        confirmarButton.classList.add("btn", "btn-success")
        confirmarButton.textContent = "Confirmar"
        confirmarButton.addEventListener("click", () => {
            console.log("Todos los exámenes corregidos automáticamente.")
            modal.remove()
        })

        const cancelarButton = document.createElement("button")
        cancelarButton.classList.add("btn", "btn-secondary")
        cancelarButton.textContent = "Cancelar"
        cancelarButton.addEventListener("click", () => {
            modal.remove()
        })

        modalFooter.appendChild(confirmarButton)
        modalFooter.appendChild(cancelarButton)

        modalContent.appendChild(modalHeader)
        modalContent.appendChild(modalFooter)

        modalDialog.appendChild(modalContent)
        modal.appendChild(modalDialog)

        document.body.appendChild(modal)
    }

    function abrirModalCorreccion(usuario, examenNombre) {
        const modal = document.createElement("div")
        modal.classList.add("modal", "d-block", "bg-dark", "bg-opacity-50")
        modal.style.position = "fixed"
        modal.style.top = "0"
        modal.style.left = "0"
        modal.style.width = "100%"
        modal.style.height = "100%"
        modal.style.zIndex = "1050"
    
        const modalDialog = document.createElement("div")
        modalDialog.classList.add("modal-dialog", "modal-dialog-centered")
    
        const modalContent = document.createElement("div")
        modalContent.classList.add("modal-content")
    
        const modalHeader = document.createElement("div")
        modalHeader.classList.add("modal-header")
        const modalTitle = document.createElement("h5")
        modalTitle.classList.add("modal-title")
        modalTitle.textContent = `Corregir Examen: ${examenNombre} - ${usuario.usuarioNombre}`
        const closeButton = document.createElement("button")
        closeButton.classList.add("btn-close")
        closeButton.addEventListener("click", () => {
            modal.remove()
        })
        modalHeader.appendChild(modalTitle)
        modalHeader.appendChild(closeButton)
    
        const modalBody = document.createElement("div")
        modalBody.classList.add("modal-body")
    
        usuario.respuestas.forEach((respuesta) => {
            const preguntaDiv = document.createElement("div")
            preguntaDiv.classList.add("mb-3")
    
            const preguntaText = document.createElement("p")
            preguntaText.textContent = `Pregunta: ${respuesta.pregunta}`
            preguntaDiv.appendChild(preguntaText)
    
            const respuestaText = document.createElement("p")
            respuestaText.textContent = `Respuesta: ${respuesta.respuesta}`
            preguntaDiv.appendChild(respuestaText)
    
            const checkboxDiv = document.createElement("div")
            checkboxDiv.classList.add("form-check")
    
            const checkbox = document.createElement("input")
            checkbox.type = "checkbox"
            checkbox.classList.add("form-check-input")
            checkbox.id = `respuesta_${respuesta.respuestaId}`
            checkboxDiv.appendChild(checkbox)
    
            const checkboxLabel = document.createElement("label")
            checkboxLabel.classList.add("form-check-label")
            checkboxLabel.htmlFor = `respuesta_${respuesta.respuestaId}`
            checkboxLabel.textContent = "Correcta"
            checkboxDiv.appendChild(checkboxLabel)
    
            preguntaDiv.appendChild(checkboxDiv)
            modalBody.appendChild(preguntaDiv)
        })
    
        const modalFooter = document.createElement("div")
        modalFooter.classList.add("modal-footer")
    
        const finalizarButton = document.createElement("button")
        finalizarButton.classList.add("btn", "btn-success")
        finalizarButton.textContent = "Finalizar corrección"
        finalizarButton.addEventListener("click", () => {
            const resultados = usuario.respuestas.map((respuesta) => {
                const checkbox = document.getElementById(
                    `respuesta_${respuesta.respuestaId}`
                )
                return {
                    respuestaId: respuesta.respuestaId,
                    correcta: checkbox.checked,
                }
            })
            console.log("Resultados de la corrección:", resultados)
            modal.remove()
        })
    
        modalFooter.appendChild(finalizarButton)
    
        modalContent.appendChild(modalHeader)
        modalContent.appendChild(modalBody)
        modalContent.appendChild(modalFooter)
    
        modalDialog.appendChild(modalContent)
        modal.appendChild(modalDialog)
    
        document.body.appendChild(modal)
    }
})