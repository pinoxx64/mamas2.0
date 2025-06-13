import { constantes } from "./constantes"

export const calcularNotaYGuardar = async (notaExamen) => {
    const rutaNotaExamen = constantes.urlApi + constantes.notaExamen + 'calcularNotaYGuardar'
    try {
        const token = sessionStorage.getItem('token')
        const respuesta = await fetch(rutaNotaExamen, {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify(notaExamen)
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

export const correguirAuto = async (exa) => {
    const rutaNotaExamen = constantes.urlApi + constantes.notaExamen + 'correguirAuto'
    try {
        const token = sessionStorage.getItem('token')
        const respuesta = await fetch(rutaNotaExamen, {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify(exa)
        })

        if (!respuesta.ok) {
            throw new Error(`Error al buscar el examen. Código de estado: ${respuesta.status}`)
        }

        const resultado = await respuesta.json()
        console.log('resultado', resultado)
        return resultado
    } catch (error) {
        console.error('Error en la función getExamen:', error.message)
        throw error
    }
}

export const correguirAutoTodo = async (exaId) => {
    const rutaNotaExamen = constantes.urlApi + constantes.notaExamen + 'correguirAutoTodo'
    console.log('exaId', exaId)
    try {
        const token = sessionStorage.getItem('token')
        const respuesta = await fetch(rutaNotaExamen, {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify(exaId)
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

export const getNotaExamenByUsuarioId = async (usuarioId) => {
    const rutaNotaExamen = constantes.urlApi + constantes.notaExamen + 'usu/' + usuarioId
    try {
        const token = sessionStorage.getItem('token')
        const respuesta = await fetch(rutaNotaExamen, {
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