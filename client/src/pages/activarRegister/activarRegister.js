import { putActivar } from "../../components/userApi";

const email = sessionStorage.getItem("email")
console.log(email)
const code = sessionStorage.getItem("code")
const activarRegistro = async () => {
    const form = document.getElementById('activar-register-form');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const codeInput = document.getElementById('code').value
        const mensajeError = document.getElementById('mensaje-error');

        if (code == codeInput) {
            await putActivar(email)
            console.log(`Activando el correo: ${email}`);
            window.location.href = '../login/login.html';
        }else{
            mensajeError.textContent = "El código introducido no es correcto."
        }
    });
};

await activarRegistro();