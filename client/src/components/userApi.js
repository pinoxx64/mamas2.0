import { constantes } from "./constantes";

export const register = async (user) => {
    const rutaUser = constantes.urlApi + constantes.registro
    console.log('antes del try')
    try {
        console.log('entra en el try')
        const respuesta = await fetch(rutaUser, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(user),
        })
        if (!respuesta.ok) {
            throw new Error(`Error al añadir el User. Código de estado: ${respuesta.status}`)
        }
        console.log(respuesta)
        console.log('sale del fetch')
        const resultado = await respuesta.json()
        console.log(resultado)
        return resultado
    } catch (error) {
        console.error('Error en la función register:', error.message)
        throw error
    }
}

export const getIfEmailExist = async (email) => {
    const rutaUser = constantes.urlApi + constantes.user
    console.log(rutaUser + 'ifMailExist/' + email)

    try {
        const respuesta = await fetch(rutaUser + 'ifMailExist/' + email, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })

        if (!respuesta.ok) {
            throw new Error(`Error al obtener el User. Código de estado: ${respuesta.status}`)
        }
        console.log(respuesta)
        const User = respuesta
        return User
    } catch (error) {
        console.error('Error en la función getUserByEmail:', error.message)
        throw error
    } 
}