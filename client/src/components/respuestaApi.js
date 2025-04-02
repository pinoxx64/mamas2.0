import { constantes } from "./constantes";

export const putRespuesta = async (respuestaId, respuesta) => {
    const rutaRespuesta = constantes.urlApi + constantes.respuesta + respuestaId

    try {
        const token = sessionStorage.getItem('token')
        const respuestaApi = await fetch(rutaRespuesta, {
            method: 'PUT',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(respuesta)
        })

        if (!respuestaApi.ok) {
            throw new Error(`Error al editar la respuesta. Código de estado: ${respuestaApi.status}`)
        }

        const respuestaEditada = await respuestaApi.json()
        return respuestaEditada
    } catch (error) {
        console.error('Error en la función putRespuesta:', error.message)
        throw error
    }
}

export const postRespuesta = async (respuesta) => {
    const rutaRespuesta = constantes.urlApi + constantes.respuesta

    try {
        const token = sessionStorage.getItem('token')
        const respuesta = await fetch(rutaRespuesta, {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(respuesta)
        })

        if (!respuesta.ok) {
            throw new Error(`Error al crear la respuesta. Código de estado: ${respuesta.status}`)
        }

        const nuevaRespuesta = await respuesta.json()
        return nuevaRespuesta
    } catch (error) {
        console.error('Error en la función postrespuesta:', error.message)
        throw error
    }
}