import { constantes } from "../../components/constantes.js";
import { register, getIfEmailExist } from "../../components/userAPI.js";

const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirmPassword');

const registrarse = async () => {
    const form = document.getElementById('register');

    nameInput.addEventListener('input', () => {
        const name = nameInput.value;
        let errores = [];
        if (!constantes.nameValid.test(name)) {
            errores.push("El nombre debe tener entre 2 y 50 caracteres");
        }
        mostrarErrores(errores, nameInput);
    });

    emailInput.addEventListener('input', () => {
        const email = emailInput.value;
        let errores = [];
        if (!constantes.emailValid.test(email)) {
            errores.push("El correo debe ser un correo válido");
        }
        mostrarErrores(errores, emailInput);
    });

    passwordInput.addEventListener('input', () => {
        const password = passwordInput.value;
        let errores = [];
        if (!/.{8,}/.test(password)) {
            errores.push("Debe tener al menos 8 caracteres");
        }
        if (!/[A-Z]/.test(password)) {
            errores.push("Debe contener al menos una letra mayúscula");
        }
        if (!/[a-z]/.test(password)) {
            errores.push("Debe contener al menos una letra minúscula");
        }
        if (!/\d/.test(password)) {
            errores.push("Debe contener al menos un número");
        }
        if (!/[\W_]/.test(password)) {
            errores.push("Debe contener al menos un carácter especial (por ejemplo: !, @, #, ...)");
        }
        mostrarErrores(errores, passwordInput);
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        let submitError = false;
        const email = emailInput.value;

        try {
            const emailExist = await getIfEmailExist(email);
            if (emailExist == 1) {
                const errores = ['El correo electrónico ya está en uso'];
                mostrarErrores(errores, emailInput);
                submitError = true;
            }

            const formData = new FormData(form);
            const password = formData.get('password');
            const confirmPassword = formData.get('confirmPassword');
            let errores = [];
            if (password !== confirmPassword) {
                errores.push("Las contraseñas no coinciden.");
                mostrarErrores(errores, confirmPasswordInput);
                submitError = true;
            }

            if (!submitError) {
                const user = {
                    name: formData.get('name'),
                    email: formData.get('email'),
                    password: password,
                    score: 0,
                    active: 1
                };
                console.log(user)
                await register(user);
                alert('Registro exitoso');
                form.reset();
            }
        } catch (error) {
            console.error('Error', error.message);
        }
    });
};

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

await registrarse();
