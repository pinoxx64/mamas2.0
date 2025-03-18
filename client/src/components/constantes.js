export const constantes = {

    urlApi: 'http://127.0.0.1:8000/api/',
    registro: 'register',
    login: 'login/',
    logout: 'logout/',

    user: 'user/',
    userRol: 'userRol/',

    nameValid: /^[a-zA-ZÁÉÍÓÚáéíóúÑñ\s]{2,50}$/,
    emailValid: /^[\w.%+-]{2,}@[\w.-]{2,}\.\w{2,}$/,
    passwordValid: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/,
}