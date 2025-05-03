import { getUserById, putPassword, putUserPhoto } from "../../components/userApi";

const putPasswordButton = document.getElementById('putPassword');
const putFoto = document.getElementById('putFoto');
const userId = sessionStorage.getItem('userId');

document.addEventListener('DOMContentLoaded', async () => {
    const user = await getUserById(userId);
    const fotoUsuario = document.getElementById('foto-usuario');
    fotoUsuario.src = user.foto || "../../../public/assets/photo/placeholder.png";
});

putPasswordButton.addEventListener('click', async () => {
    const password = document.getElementById('password').value;

    const passwordModificada = {
        password: password,
    };

    await putPassword(userId, passwordModificada);
    location.reload();

});

putFoto.addEventListener('click', async () => {
    const fotoInput = document.getElementById('foto');
    const fotoArchivo = fotoInput.files[0];

    const nuevaFoto = await putUserPhoto(userId, fotoArchivo);
    const fotoUsuario = document.getElementById('foto-usuario');
    fotoUsuario.src = nuevaFoto;

});