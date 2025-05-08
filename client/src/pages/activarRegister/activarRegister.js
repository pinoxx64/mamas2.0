import { putActivar } from "../../components/userApi";

const emailInput = document.getElementById('email');

const activarRegistro = async () => {
    const form = document.getElementById('activar-register-form');

    // Validar el campo de correo electrónico
    emailInput.addEventListener('input', () => {
        let errores = [];
        if (!emailInput.validity.valid) {
            if (emailInput.validity.typeMismatch) {
                errores.push("El correo debe ser un correo válido.");
            }
            if (emailInput.validity.valueMissing) {
                errores.push("El correo es obligatorio.");
            }
        }
        mostrarErrores(errores, emailInput);
    });

    // Validar el formulario al enviarlo
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (form.checkValidity()) {
            const email = emailInput.value;

            try {
                await putActivar(email)
                console.log(`Activando el correo: ${email}`);
                window.location.href = '../login/login.html';
            } catch (error) {
                console.error('Error al activar el correo:', error.message);
            }
        }
    });
};

// Función para mostrar errores
const mostrarErrores = (errores, input) => {
    let errorMessage = input.nextElementSibling;

    if (errorMessage && errorMessage.classList && errorMessage.classList.contains('error-message')) {
        errorMessage.remove();
    }

    if (errores.length > 0) {
        errorMessage = document.createElement('div');
        errorMessage.classList.add('error-message');
        errorMessage.style.color = 'red';
        errorMessage.innerHTML = errores.join('<br>');
        input.insertAdjacentElement('afterend', errorMessage);
    }
};

await activarRegistro();