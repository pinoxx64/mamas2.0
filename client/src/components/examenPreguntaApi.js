import { constantes } from "./constantes"

export const postExamenPregunta = async (examenPregunta) => {
    const rutaExamenPregunta = constantes.urlApi + constantes.examenPregunta
    try {
        const token = sessionStorage.getItem('token')
        const respuesta = await fetch(rutaExamenPregunta, {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify(examenPregunta)
        })

        if (!respuesta.ok) {
            throw new Error(`Error al crear el examen. Código de estado: ${respuesta.status}`)
        }

        const resultado = await respuesta.json()
        return resultado
    } catch (error) {
        console.error('Error en la función postExamen:', error.message)
        throw error
    }
}

export const deleteExamenPregunta = async (id) => {
    const rutaExamenPregunta = constantes.urlApi + constantes.examenPregunta + id
    try {
        const token = sessionStorage.getItem('token')
        const respuesta = await fetch(rutaExamenPregunta, {
            method: 'DELETE',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        })

        if (!respuesta.ok) {
            throw new Error(`Error al eliminar el examen. Código de estado: ${respuesta.status}`)
        }

        const resultado = await respuesta.json()
        return resultado
    } catch (error) {
        console.error('Error en la función deleteExamen:', error.message)
        throw error
    }
}

export const getExamenPreguntaByExamenId = async (id) => {
    const rutaExamenPregunta = constantes.urlApi + constantes.examenPregunta + 'examen/' + id
    try {
        const token = sessionStorage.getItem('token')
        const respuesta = await fetch(rutaExamenPregunta, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        })

        if (!respuesta.ok) {
            throw new Error(`Error al buscar el examen. Código de estado: ${respuesta.status}`)
        }

        const resultado = await respuesta.json()
        return resultado
    } catch (error) {
        console.error('Error en la función getExamen:', error.message)
        throw error
    }
}