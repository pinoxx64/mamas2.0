import { constantes } from "./constantes";

export const getCorrecionExamen = async () => {
    const rutaCorrecionExamen = constantes.urlApi + constantes.correcionExamen
    try {
        const token = sessionStorage.getItem('token')
        const respuesta = await fetch(rutaCorrecionExamen, {
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
        console.log(resultado)
        return resultado
    } catch (error) {
        console.error('Error en la función getCorrecionExamen:', error.message)
        throw error
    }
}

export const getCorrecionExamenById = async (id) => {
    const rutaCorrecionExamen = constantes.urlApi + constantes.correcionExamen + id
    try {
        const token = sessionStorage.getItem('token')
        const respuesta = await fetch(rutaCorrecionExamen, {
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
        console.log(resultado)
        return resultado
    } catch (error) {
        console.error('Error en la función getCorrecionExamenById:', error.message)
        throw error
    }
}

export const getCorrecionExamenByRespuestaId = async (id) => {
    const rutaCorrecionExamen = constantes.urlApi + constantes.correcionExamen + 'respuesta/' + id
    try {
        const token = sessionStorage.getItem('token')
        const respuesta = await fetch(rutaCorrecionExamen, {
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
        console.log(resultado)
        return resultado
    } catch (error) {
        console.error('Error en la función getCorrecionExamenByRespuestaId:', error.message)
        throw error
    }
}

export const postCorrecionExamen = async (correcionExamen) => {
    const rutaCorrecionExamen = constantes.urlApi + constantes.correcionExamen
    try {
        const token = sessionStorage.getItem('token')
        const respuesta = await fetch(rutaCorrecionExamen, {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify(correcionExamen)
        })

        if (!respuesta.ok) {
            throw new Error(`Error al crear la correcion de examen. Código de estado: ${respuesta.status}`)
        }

        const resultado = await respuesta.json()
        console.log(resultado)
        return resultado
    } catch (error) {
        console.error('Error en la función postCorrecionExamen:', error.message)
        throw error
    }
}

export const deleteCorrecionExamen = async (id) => {
    const rutaCorrecionExamen = constantes.urlApi + constantes.correcionExamen + id
    try {
        const token = sessionStorage.getItem('token')
        const respuesta = await fetch(rutaCorrecionExamen, {
            method: 'DELETE',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        })

        if (!respuesta.ok) {
            throw new Error(`Error al eliminar la correcion de examen. Código de estado: ${respuesta.status}`)
        }

        const resultado = await respuesta.json()
        console.log(resultado)
        return resultado
    } catch (error) {
        console.error('Error en la función deleteCorrecionExamen:', error.message)
        throw error
    }
}

export const getCorrecionExamenByUserAndExamen = async (usuarioId, examenId) => {
    const rutaCorrecionExamen = constantes.urlApi + constantes.correcionExamen + 'usuario/' + usuarioId + '/' + examenId
    try {
        const token = sessionStorage.getItem('token')
        const respuesta = await fetch(rutaCorrecionExamen, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        })

        if (!respuesta.ok) {
            throw new Error(`Error al buscar la correcion de examen. Código de estado: ${respuesta.status}`)
        }

        const resultado = await respuesta.json()
        console.log(resultado)
        return resultado
    } catch (error) {
        console.error('Error en la función getCorrecionExamenByUserAndExamen:', error.message)
        throw error
    }
}