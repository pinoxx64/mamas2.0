import { register, getIfEmailExist } from "../../components/userApi";

const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirmPassword');

const registrarse = async () => {
    const form = document.getElementById('register-form');

    // Validar el campo de nombre
    nameInput.addEventListener('input', () => {
        let errores = [];
        if (!nameInput.validity.valid) {
            if (nameInput.validity.tooShort) {
                errores.push("El nombre debe tener al menos 2 caracteres.");
            }
            if (nameInput.validity.tooLong) {
                errores.push("El nombre no puede tener más de 50 caracteres.");
            }
            if (nameInput.validity.valueMissing) {
                errores.push("El nombre es obligatorio.");
            }
        }
        mostrarErrores(errores, nameInput);
    });

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

    // Validar el campo de contraseña
    passwordInput.addEventListener('input', () => {
        let errores = [];
        if (!passwordInput.validity.valid) {
            if (passwordInput.validity.tooShort) {
                errores.push("La contraseña debe tener al menos 8 caracteres.");
            }
            if (passwordInput.validity.valueMissing) {
                errores.push("La contraseña es obligatoria.");
            }
        }
        mostrarErrores(errores, passwordInput);
    });

    // Validar el campo de confirmación de contraseña
    confirmPasswordInput.addEventListener('input', () => {
        let errores = [];
        if (confirmPasswordInput.value !== passwordInput.value) {
            errores.push("Las contraseñas no coinciden.");
        }
        mostrarErrores(errores, confirmPasswordInput);
    });

    // Validar el formulario al enviarlo
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
        } catch (error) {
            console.error('Error al verificar el correo:', error.message);
        }

        if (confirmPasswordInput.value !== passwordInput.value) {
            const errores = ["Las contraseñas no coinciden."];
            mostrarErrores(errores, confirmPasswordInput);
            submitError = true;
        }

        if (!submitError && form.checkValidity()) {
            const formData = new FormData(form);
            const code = Math.floor(Math.random() * (999999 - 100000) + 100000)
            const user = {
                name: formData.get('name'),
                email: formData.get('email'),
                password: formData.get('password'),
                code: code
            };

            try {
                console.log(user)
                await register(user);
                console.log(formData.get('email'))
                sessionStorage.setItem("code", code)
                sessionStorage.setItem("email", formData.get('email'))
                window.location.href = '../activarRegister/activarRegister.html';
                form.reset();
            } catch (error) {
                console.error('Error al registrar:', error.message);
            }
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