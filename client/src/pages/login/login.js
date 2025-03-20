import { constantes } from "../../components/constantes";

document.addEventListener('DOMContentLoaded', () => {
  console.log("El DOM ha sido completamente cargado")

  const form = document.querySelector('#login-form')
  console.log("Formulario de login seleccionado:", form)

  if (!form) {
    console.error("No se encontró el formulario de login. Revisa el selector.")
    return
  }

  form.addEventListener('submit', async function (event) {
    event.preventDefault() 
    console.log("Evento submit capturado.")

    const email = form.querySelector('input[type="email"]').value
    const password = form.querySelector('input[type="password"]').value

    if (!password) {
      alert('Por favor, ingresa tu contraseña.')
      return
    }

    console.log("Datos capturados - Correo:", email, "Contraseña:", password)

    const rutaLogIn = constantes.urlApi + constantes.login
    console.log("Ruta para login:", rutaLogIn)

    try {
      const response = await fetch(rutaLogIn, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password
        }),
      })

      console.log("Respuesta recibida del servidor:", response)

      const resultado = await response.json()
      console.log("Datos parseados desde la respuesta:", resultado)

      if (response.ok && resultado.success) {
        console.log("Inicio de sesión exitoso. ID del usuario:", resultado.data.id)

        sessionStorage.setItem('userId', resultado.data.id)
        sessionStorage.setItem('token', resultado.data.token) 

        console.log("Datos guardados en sessionStorage. Redirigiendo...")
        window.location.href = '../inicio/inicio.html' 
      } else {
        console.warn("Inicio de sesión fallido. Mensaje del servidor:", resultado.message)
        alert(response.message || 'Error al iniciar sesión')
      }
    } catch (error) {
      console.error("Error en la solicitud fetch:", error)
      alert('Hubo un problema con la solicitud. Intenta de nuevo más tarde.')
    }
  })
})
