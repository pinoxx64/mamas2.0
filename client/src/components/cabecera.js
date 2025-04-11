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
            <button class="btn" onclick="location.href='../gestionPregunta/gestionPregunta.html'" style="background-color: #ff4040; color: white;">Gestionar Preguntas</button>
            <button class="btn" onclick="location.href='../gestionExamen/gestionExamen.html'" style="background-color: #ff4040; color: white;">Gestionar Examenes</button>
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