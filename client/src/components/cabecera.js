import { getUserById} from "./userApi.js"
import { getUserRolByUserId } from "./userRolApi.js"

document.addEventListener("DOMContentLoaded", async () => {
  const cabecera = async () => {
    const headerContainer = document.getElementById("header-container")

    const userId = sessionStorage.getItem("userId")
    const user = await getUserById(userId)
    const userRol = await getUserRolByUserId(userId)
    console.log(user)

    if (user) {
      headerContainer.innerHTML = `
              <!-- Cabecera -->
              <header class="header p-3 d-flex align-items-center justify-content-between shadow" style="background-color: #00aaaa; color: white;">
                <div class="d-flex align-items-center" id="botonesCabecera">
                  <a class="h4 mb-0 me-3 text-white" href="../inicio/inicio.html">Mamas 2.0</a>
                </div>
                
                <div class="dropdown">
                  <span class="me-2 text-white dropdown-toggle" id="userDropdown" data-bs-toggle="dropdown" aria-expanded="false">${user.user.name}</span>
                  <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                    <li><a class="dropdown-item" href="../perfil/perfil.html" id="botonPerfil">Perfil</a></li>
                    <li><a class="dropdown-item" href="#" id="botonCerrarSesion">Cerrar sesión</a></li>
                  </ul>
                </div>
              </header>
            `
      console.log(userRol.user)
      for (let i = 0; i < userRol.user.length; i++) {
        if (userRol.user[i].rolId == 1) {
          document.getElementById("botonesCabecera").innerHTML += `
            <button class="btn" onclick="location.href='../gestionUser/gestionUser.html'" style="background-color: #ff4040; color: white;">Administrar usuarios</button>
          `
        }else if (userRol.user[i].rolId == 2) {
          document.getElementById("botonesCabecera").innerHTML += `
            <button class="btn" onclick="location.href='../gestionPregunta/gestionPregunta.html'" style="background-color: #ff4040; color: white;">Crear Preguntas</button>
          `
        }else if (userRol.user[i].rolId == 3) {
          document.getElementById("botonesCabecera").innerHTML += `
            <button class="btn" onclick="location.href=''" style="background-color: #ff4040; color: white;">Prueba</button>
          `
        }
      }
    } else {
      console.error("No se pudo cargar la información del usuario.");
    }
  }

  await cabecera()
})

document.getElementById("header-container").addEventListener("click", (event) => {
  if (event.target && event.target.id === "botonCerrarSesion") {
    window.location.href = "http://localhost:5173/";
  }
});

// async function editarPerfil(user) {
//   const modificarBtn = document.getElementById('guardarCambios')

//   if (modificarBtn) {

//     modificarBtn.addEventListener('click', async () => {
//       try {

//         const modalElement = document.getElementById(`modalPerfil`)
//         const nameUsu = modalElement.querySelector(`#name`).value
//         const emailUsu = modalElement.querySelector(`#email`).value
//         const passwordUsu = modalElement.querySelector(`#password`).value

//         let userEdit
        
//         if (passwordUsu.trim() === "") {
//           userEdit = {
//             name: nameUsu,
//             email: emailUsu,
//             foto: user.foto,
//             active: user.active
//           }
//         } else {
//           userEdit = {
//             name: nameUsu,
//             email: emailUsu,
//             password: passwordUsu,
//             foto: user.foto,
//             active: user.active
//           }
//         }
//         await putUser(user.id, userEdit)

//         const modal = new bootstrap.Modal(modalElement)
//         modal.hide();
//         location.reload()
//       } catch (error) {
//         console.error('Error al confirmar la modificación:', error)
//       }
//     });
//   }
// }

/* <div class="modal fade" id="modalPerfil" tabindex="-1" aria-labelledby="modalPerfilLabel" aria-hidden="true">
<div class="modal-dialog">
  <div class="modal-content">
    <div class="modal-header">
      <h5 class="modal-title" style="color: black;" id="modalPerfilLabel">Perfil de ${user.user.name}</h5>
      <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
    </div>
    <div class="modal-body" style="color: black;"> 
      <form id="perfilUsuarioForm">
        <div class="col-md-6">
          <label for="name" class="form-label">name:</label>
          <input class="form-control" type="text" id="name" name="name">
        </div>
        
        <div class="col-md-6">
          <label class="form-label" for="email">Correo Electrónico:</label>
          <input class="form-control" type="email" id="email" name="email" readonly>
        </div>

        <div class="col-md-6">
          <label for="password" class="form-label">Contraseña:</label>
          <input class="form-control" type="password" id="password" name="password">
        </div>
      </form>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-primary" data-bs-dismiss="modal" id="guardarCambios">Guardar cambios</button>
      <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
    </div>
  </div>
</div>
</div> */