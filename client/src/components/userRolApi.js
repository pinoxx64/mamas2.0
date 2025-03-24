import { constantes } from "./constantes.js"

export const getUserRolByUserId = async (userId) => {
    const rutaUserRol = constantes.urlApi + constantes.userRol + 'usuario/'

    try {
        const respuesta = await fetch(rutaUserRol + userId, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })

        if (!respuesta.ok) {
            throw new Error(`Error al obtener la lista de userRol. Código de estado: ${respuesta.status}`)
        }

        const userRol = await respuesta.json()
        return userRol

    } catch (error) {
        console.error('Error en la función getUser:', error.message)
        throw error
    }
}