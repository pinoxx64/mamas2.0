const putPassword = document.getElementById('putPassword')

putPassword.addEventListener('click', async () => {
    const password = document.getElementById('password').value
    const userId = sessionStorage.getItem('userId')

    const passwordmodificada = {
        password: password
    }
    await putPassword(userId, passwordmodificada)
    location.reload()
})