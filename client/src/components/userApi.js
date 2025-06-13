import { constantes } from "./constantes"

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

export const getUserById = async (userId) => {
    const rutaUser = constantes.urlApi + constantes.user

    try {
        const token = sessionStorage.getItem('token')
        console.log('token', token)
        const respuesta = await fetch(rutaUser + userId, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            }
        })

        if (!respuesta.ok) {
            throw new Error(`Error al obtener el User. Código de estado: ${respuesta.status}`)
        }

        const User = await respuesta.json()
        return User
    } catch (error) {
        console.error('Error en la función getUserById:', error.message)
        throw error
    }
}

export const putUser = async (userId, user) => {
    const rutaUser = constantes.urlApi + constantes.user
    try {
        const token = sessionStorage.getItem('token')
        const respuesta = await fetch(rutaUser + userId, {
            method: 'PUT',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify(user),
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

export const getUsersWithUserRol = async () => {
    const rutaUser = constantes.urlApi + constantes.user
    try {
        const token = sessionStorage.getItem('token')
        const respuesta = await fetch(rutaUser + 'userWithRol/more/info', {
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

export const putPassword = async (userId, password) => {
    const rutaUser = constantes.urlApi + constantes.user
    try {
        const token = sessionStorage.getItem('token')
        const respuesta = await fetch(rutaUser + 'password/' + userId, {
            method: 'PUT',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify(password),
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

export const putUserPhoto = async (id, photo) => {
    const rutaUser = constantes.urlApi + constantes.user + 'photo/' + id
    try {
        const token = sessionStorage.getItem('token')
        const formData = new FormData()
        formData.append('foto', photo)

        const respuesta = await fetch(rutaUser, {
            method: 'PUT',
            headers: {
                'Authorization': 'Bearer ' + token,
            },
            body: formData,
        })

        if (!respuesta.ok) {
            throw new Error(`Error al editar el user. Código de estado: ${respuesta.status}`)
        }

        const resultado = await respuesta.json()
        console.log(resultado)
        return resultado.foto
    } catch (error) {
        console.error('Error en la función putUserPhoto:', error.message)
        throw error
    }
}

export const putActivar = async (email) => {
    const rutaUser = constantes.urlApi
    try {
        const respuesta = await fetch(rutaUser + 'activar/' + email, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
        })

        if (!respuesta.ok) {
            throw new Error(`Error al activar el user. Código de estado: ${respuesta.status}`)
        }

        const resultado = await respuesta.json()
        console.log(resultado)
        return resultado
    } catch (error) {
        console.error('Error en la función putActivar:', error.message)
        throw error
    }
}