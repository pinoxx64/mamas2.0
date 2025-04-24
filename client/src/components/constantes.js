export const constantes = {

    urlApi: 'http://127.0.0.1:8000/api/',
    registro: 'register/',
    login: 'login/',
    logout: 'logout/',

    user: 'user/',
    userRol: 'userRol/',
    pregunta: 'pregunta/',
    respuesta: 'respuesta/',
    asignatura: 'asignatura/',
    examen: 'examen/',
    examenPregunta: 'examenPregunta/',
    respuestaExamen: 'respuestaExamen/',
    notaExamen: 'notaExamen/',

    nameValid: /^[a-zA-ZÁÉÍÓÚáéíóúÑñ\s]{2,50}$/,
    emailValid: /^[\w.%+-]{2,}@[\w.-]{2,}\.\w{2,}$/,
    passwordValid: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/,
}