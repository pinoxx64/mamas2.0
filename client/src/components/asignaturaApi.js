import { constantes } from "./constantes";

export const getAsignatura = async () => {
    const rutaAsignatura = constantes.urlApi + constantes.asignatura
    try {
        const token = sessionStorage.getItem('token')
        const respuesta = await fetch(rutaAsignatura, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        })

        if (!respuesta.ok) {
            throw new Error(`Error al editar el user. Código de estado: ${respuesta.status}`)
        }

        const resultado = await respuesta.json()
        console.log(resultado)
        return resultado
    } catch (error) {
        console.error('Error en la función putuser:', error.message)
        throw error
    }
}