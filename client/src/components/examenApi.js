import { constantes } from "./constantes";

export const getExamen = async () => {
    const rutaExamen = constantes.urlApi + constantes.examen
    try {
        const token = sessionStorage.getItem('token')
        const respuesta = await fetch(rutaExamen, {
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
        console.error('Error en la función getExamen:', error.message)
        throw error
    }
}

export const activeOrDesableExamen = async (id) => {
    const rutaExamen = constantes.urlApi + constantes.examen + 'activeOrDesable/' + id
    console.log(rutaExamen)
    try {
        const token = sessionStorage.getItem('token')
        const respuesta = await fetch(rutaExamen, {
            method: 'PUT',
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
        console.error('Error en la función getExamen:', error.message)
        throw error
    }
}