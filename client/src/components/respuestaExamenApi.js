import { constantes } from "./constantes"

export const postRespuestaExamen = async (respuestaExamen) => {
    console.log('hola')
    console.log(respuestaExamen)
    const rutaRespuestaExamen = constantes.urlApi + constantes.respuestaExamen
    try {
        const token = sessionStorage.getItem('token')
        const respuesta = await fetch(rutaRespuestaExamen, {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify(respuestaExamen)
        })

        if (!respuesta.ok) {
            throw new Error(`Error al crear la respuestaExamen. Código de estado: ${respuesta.status}`)
        }

        const respuestaExamenCreada = await respuesta.json()
        return respuestaExamenCreada
    } catch (error) {
        console.error('Error en la función postRespuestaExamen:', error.message)
        throw error
    }
}