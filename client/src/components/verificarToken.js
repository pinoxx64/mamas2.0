export const verificarToken = async () => {
    const token = sessionStorage.getItem('token')
    if (!token) {
        window.location.href = "../login/login.html"
    }
}