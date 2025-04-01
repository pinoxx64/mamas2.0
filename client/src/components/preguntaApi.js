import { constantes } from "./constantes";

export const getPreguntasWithRespuestas = async () => {
    const rutaPregunta = constantes.urlApi + constantes.pregunta + 'preguntaWithRespuesta'

    try {
        const token = sessionStorage.getItem('token')
        const respuesta = await fetch(rutaPregunta, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            }
        })

        if (!respuesta.ok) {
            throw new Error(`Error al obtener la lista de preguntas. Código de estado: ${respuesta.status}`)
        }

        const preguntas = await respuesta.json()
        return preguntas
    } catch (error) {
        console.error('Error en la función getPreguntas:', error.message)
        throw error
    }
}

export const postPregunta = async (pregunta) => {
    const rutaPregunta = constantes.urlApi + constantes.pregunta

    try {
        const token = sessionStorage.getItem('token')
        const respuesta = await fetch(rutaPregunta, {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(pregunta)
        })

        if (!respuesta.ok) {
            throw new Error(`Error al crear la pregunta. Código de estado: ${respuesta.status}`)
        }

        const nuevaPregunta = await respuesta.json()
        return nuevaPregunta
    } catch (error) {
        console.error('Error en la función postPregunta:', error.message)
        throw error
    }
}

export const putPregunta = async (preguntaId, pregunta) => {
    const rutaPregunta = constantes.urlApi + constantes.pregunta + preguntaId

    try {
        const token = sessionStorage.getItem('token')
        const respuesta = await fetch(rutaPregunta, {
            method: 'PUT',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(pregunta)
        })

        if (!respuesta.ok) {
            throw new Error(`Error al editar la pregunta. Código de estado: ${respuesta.status}`)
        }

        const preguntaEditada = await respuesta.json()
        return preguntaEditada
    } catch (error) {
        console.error('Error en la función putPregunta:', error.message)
        throw error
    }
}