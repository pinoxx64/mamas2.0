import { getUsersWithUserRol, putUser } from "../../components/userApi.js"
import { deleteUserRol, getUserRolByUserId, postUserRol } from "../../components/userRolApi.js"

document.addEventListener("DOMContentLoaded", function () {

    async function rellenarUsers() {
        const userWithUserRols = await getUsersWithUserRol();
        console.log(userWithUserRols);
        const Users = userWithUserRols.user.original;
    
        const tabla = $('#Users').DataTable();
        tabla.clear().draw();
        Users.user.forEach(usu => {
            if (usu.active == 1) {
                const row = tabla.row.add([
                    usu.name,
                    usu.email,
                    `<button type="button" class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#myModal${usu.id}"><i class="fas fa-edit"></i> Editar</button>` +
                    `<button class="btn btn-danger btn-sm" data-bs-toggle="modal" data-bs-target="#deleteModal${usu.id}" ><i class="fas fa-trash-alt"></i> Eliminar</button>` +
                    `<button class="btn btn-warning btn-sm" data-bs-toggle="modal" data-bs-target="#rolModal${usu.id}" ><i class="fas fa-trash-alt"></i> Roles</button>`
                ]).draw(false).node();
    
                $(row).attr('data-id', usu.id);
    
                document.body.insertAdjacentHTML('beforeend', editarUserModal(usu));
                editarUserUI(userWithUserRols, usu.id);
                document.body.insertAdjacentHTML('beforeend', deleteUserModal(usu));
                eliminarUserUI(userWithUserRols, usu.id);
                document.body.insertAdjacentHTML('beforeend', editarRolModal(usu));
                editarRolesUI(userWithUserRols, usu.id);

                const user = userWithUserRols.userRol.filter(u => u.usuarioId == usu.id);  
                const meterProfesor = document.getElementById(`profe${usu.id}`)
                const meterAlumno = document.getElementById(`alum${usu.id}`)
                const meterAdmin = document.getElementById(`admin${usu.id}`)

                for (let i = 0; i < user.length; i++) {
                    if (user[i].usuarioId == usu.id && user[i].rolId == 1) {
                        meterAdmin.checked = true
                    }

                    if (user[i].usuarioId == usu.id && user[i].rolId == 2) {
                        meterProfesor.checked = true
                    }

                    if (user[i].usuarioId == usu.id && user[i].rolId == 3) {
                        meterAlumno.checked = true
                    }
                }
            } else {
                const row = tabla.row.add([
                    usu.name,
                    usu.email,
                    `<button type="button" class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#myModal${usu.id}"><i class="fas fa-edit"></i> Editar</button>` +
                    `<button class="btn btn-success btn-sm" data-bs-toggle="modal" data-bs-target="#activeModal${usu.id}" ><i class="fas fa-trash-alt"></i> Añadir</button>`
                ]).draw(false).node();
    
                $(row).attr('data-id', usu.id);
    
                document.body.insertAdjacentHTML('beforeend', editarUserModal(usu));
                editarUserUI(userWithUserRols, usu.id);
                document.body.insertAdjacentHTML('beforeend', anadirUserModal(usu));
                anadirUserUI(userWithUserRols, usu.id);
            }
        });
    }
    // Funcion que contiene el modal de editar el usuario

    function editarUserModal(usu) {
        return `
        <div class="modal" id="myModal${usu.id}">
            <div class="modal-dialog modal-md">
                <div class="modal-content">
                    <div class="modal-header">
                        <h4 class="modal-title">Editar User ${usu.name}</h4>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row">
                        <div class="col-sm-12 col-md-6 col-lg-6">
                            <label for="name" class="form-label">Nombre</label>
                            <input type="text" id="name${usu.id}" name="name${usu.id}" class="form-control" value=${usu.name}>
                            <div class="invalid-feedback" id="mensajename"></div>
                        </div>

                        <div class="col-sm-12 col-md-6 col-lg-6">
                            <label for="email" class="form-label">Gmail</label>
                            <input type="text" id="email${usu.id}" name="email${usu.id}" class="form-control" value=${usu.email}>
                            <div class="invalid-feedback" id="mensajeemail"></div>
                        </div>
    
                        <div class="col-sm-12 col-md-6 col-lg-6">
                            <label for="password" class="form-label">Contraseña</label>
                            <div class="input-group">
                                <input type="password" id="password${usu.id}" name="password${usu.id}" class="form-control" >
                            <div class="invalid-feedback" id="mensajepassword"></div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-danger" data-bs-dismiss="modal" id="editarBtn${usu.id}">Editar User</button>
                </div>
            </div>                
        </div>
    </div>
    `
    }

    // Funcion que contiene el modal de editar el rol

    function editarRolModal(usu) {
        return `
                <div class="modal" id="rolModal${usu.id}">
                    <div class="modal-dialog modal-md">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h4 class="modal-title">Editar rol de ${usu.name}</h4>
                                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                            </div>
                            <div class="modal-body" id="roles${usu.id}">
                                <label>
                                    <input type="checkbox" id="profe${usu.id}"> Profesor
                                </label><br>

                                <label>
                                    <input type="checkbox" id="alum${usu.id}"> Alumno
                                </label><br>

                                <label>
                                    <input type="checkbox" id="admin${usu.id}"> Administrador
                                </label><br>
                            </div>
                            <div class="modal-footer">
                            <button type="button" class="btn btn-danger" data-bs-dismiss="modal" id="editarRolBtn${usu.id}">Editar roles</button>
                        </div>
                        </div>
                    </div>                
                </div>
            </div>
            `
    }

    // Funcion que contiene el modal de desactivar el usuario

    function deleteUserModal(usu) {
        return `
        <div class="modal" id="deleteModal${usu.id}">
            <div class="modal-dialog modal-md">
                <div class="modal-content">
    
                    <div class="modal-header">
                        <h4 class="modal-title">Confirmar Eliminación</h4>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
    
    
                    <div class="modal-body">
                        <p>¿Estás seguro de que deseas eliminar el User ${usu.name}?</p>
                    </div>
    
                    <div class="modal-footer">
                        <button type="button" class="btn btn-danger" data-bs-dismiss="modal" id="confirmarEliminacion${usu.id}">Confirmar Eliminación</button>
                    </div>
                </div>
            </div>
        </div>
    `
    }

    // Funcion que contiene el modal de activar el usuario

    function anadirUserModal(usu) {
        return `
            <div class="modal" id="activeModal${usu.id}">
                <div class="modal-dialog modal-md">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h4 class="modal-title">Confirmar Activación</h4>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                
                        <div class="modal-body">
                            <p>¿Estás seguro de que deseas añadir el User ${usu.name}?</p>
                        </div>
                
                        <div class="modal-footer">
                            <button type="button" class="btn btn-danger" data-bs-dismiss="modal" id="confirmarActivacion${usu.id}">Confirmar Activación</button>
                        </div>
                    </div>
                </div>
            </div>       
        `
    }

    // Funcion que controla el evento de editar el usuario
 
    async function editarUserUI(userWithUserRols, id) {
        const user = userWithUserRols.user.original.user.find(u => u.id == id);
        const modificarBtn = document.getElementById(`editarBtn${id}`);
    
        if (modificarBtn) {
            modificarBtn.addEventListener('click', async () => {
                try {
                    const modalElement = document.getElementById(`myModal${id}`);
                    const nameUsu = modalElement.querySelector(`#name${id}`).value;
                    const emailUsu = modalElement.querySelector(`#email${id}`).value;
                    const passwordUsu = modalElement.querySelector(`#password${id}`).value;
    
                    const UserObjeto = {
                        name: nameUsu,
                        email: emailUsu,
                        password: passwordUsu,
                        active: user.active,
                    };
    
                    await putUser(id, UserObjeto);
    
                    const tabla = $('#Users').DataTable();
                    const row = tabla.row(`[data-id="${id}"]`);
    
                    if (!row.node()) {
                        console.error(`No se encontró la fila con id: ${id}`);
                        return;
                    }
    
                    const rowData = row.data();
                    if (!rowData || rowData.length < 3) {
                        console.error(`Los datos de la fila son inválidos:`, rowData);
                        return;
                    }
    
                    row.data([
                        nameUsu,
                        emailUsu,
                        rowData[2],
                    ]).draw(false);
    
                    const modal = new bootstrap.Modal(modalElement);
                    modal.hide();
                } catch (error) {
                    console.error('Error al confirmar la modificación:', error);
                }
            });
        }
    }

    // Funcion que controla el evento de desactivar el usuario


    async function eliminarUserUI(userWithUserRols, id) {
        const user = userWithUserRols.user.original.user.find(u => u.id == id);
        const confirmarEliminacion = document.getElementById(`confirmarEliminacion${id}`);
    
        if (confirmarEliminacion) {
            confirmarEliminacion.addEventListener('click', async () => {
                try {
                    const UserObjeto = {
                        name: user.name,
                        email: user.email,
                        password: user.password,
                        active: false,
                    };
    
                    await putUser(id, UserObjeto);
    
                    const tabla = $('#Users').DataTable();
                    const row = tabla.row(`[data-id="${id}"]`);
                    row.data([
                        user.name,
                        user.email,
                        `<button type="button" class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#myModal${id}"><i class="fas fa-edit"></i> Editar</button>` +
                        `<button class="btn btn-success btn-sm" data-bs-toggle="modal" data-bs-target="#activeModal${id}" ><i class="fas fa-trash-alt"></i> Añadir</button>`,
                    ]).draw(false).node();
    
                    $(row).attr('data-id', id);
        
                    document.body.insertAdjacentHTML('beforeend', editarUserModal(user));
                    editarUserUI(userWithUserRols, id);
                    document.body.insertAdjacentHTML('beforeend', anadirUserModal(user));
                    anadirUserUI(userWithUserRols, id);
    
                    const modalElement = document.getElementById(`deleteModal${id}`);
                    const modal = new bootstrap.Modal(modalElement);
                    modal.hide();
                } catch (error) {
                    console.error('Error al confirmar la eliminación:', error);
                }
            });
        }
    }

    // Funcion que controla el evento de activar el usuario

    async function anadirUserUI(userWithUserRols, id) {
        const user = userWithUserRols.user.original.user.find(u => u.id == id);
        const confirmarEliminacion = document.getElementById(`confirmarActivacion${id}`);
    
        if (confirmarEliminacion) {
            confirmarEliminacion.addEventListener('click', async () => {
                try {
                    const UserObjeto = {
                        name: user.name,
                        email: user.email,
                        password: user.password,
                        active: true,
                    };
    
                    await putUser(id, UserObjeto);
    
                    const tabla = $('#Users').DataTable();
                    const row = tabla.row(`[data-id="${id}"]`);
                    row.data([
                        user.name,
                        user.email,
                        `<button type="button" class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#myModal${id}"><i class="fas fa-edit"></i> Editar</button>` +
                        `<button class="btn btn-danger btn-sm" data-bs-toggle="modal" data-bs-target="#deleteModal${id}" ><i class="fas fa-trash-alt"></i> Eliminar</button>` +
                        `<button class="btn btn-warning btn-sm" data-bs-toggle="modal" data-bs-target="#rolModal${id}" ><i class="fas fa-trash-alt"></i> Roles</button>`,
                    ]).draw(false).node();
    
                    $(row).attr('data-id', id);
        
                    document.body.insertAdjacentHTML('beforeend', editarUserModal(user));
                    editarUserUI(userWithUserRols, id);
                    document.body.insertAdjacentHTML('beforeend', deleteUserModal(user));
                    eliminarUserUI(userWithUserRols, id);
                    document.body.insertAdjacentHTML('beforeend', editarRolModal(user));
                    editarRolesUI(userWithUserRols, id);

                    const meterProfesor = document.getElementById(`profe${id}`)
                    const meterAlumno = document.getElementById(`alum${id}`)
                    const meterAdmin = document.getElementById(`admin${id}`)
    
                    for (let i = 0; i < user.length; i++) {
                        if (user[i].usuarioId == id && user[i].rolId == 1) {
                            meterAdmin.checked = true
                        }
    
                        if (user[i].usuarioId == id && user[i].rolId == 2) {
                            meterProfesor.checked = true
                        }
    
                        if (user[i].usuarioId == id && user[i].rolId == 3) {
                            meterAlumno.checked = true
                        }
                    }
    
                    const modalElement = document.getElementById(`activeModal${id}`);
                    const modal = new bootstrap.Modal(modalElement);
                    modal.hide();
                } catch (error) {
                    console.error('Error al confirmar la activación:', error);
                }
            });
        }
    }

    // Funcion que controla el evento de editar el rol

    async function editarRolesUI(userWithUserRols, id) {
        const userRol = userWithUserRols.userRol.filter(u => u.usuarioId == id);
        const modificarRolBtn = document.getElementById(`editarRolBtn${id}`);
    
        if (modificarRolBtn) {
            modificarRolBtn.addEventListener('click', async () => {
                try {
                    const modalElement = document.getElementById(`rolModal${id}`);
                    const checkedProfe = document.getElementById(`profe${id}`);
                    const checkedAlumno = document.getElementById(`alum${id}`);
                    const checkedAdmin = document.getElementById(`admin${id}`);
    
                    if (userRol.find((rol) => rol.rolId == 1) && !checkedAdmin.checked) {
                        await deleteUserRol(id, 1);
                    } else if (!userRol.find((rol) => rol.rolId == 1) && checkedAdmin.checked) {
                        await postUserRol({ usuarioId: id, rolId: 1 });
                    }
    
                    if (userRol.find((rol) => rol.rolId == 2) && !checkedProfe.checked) {
                        await deleteUserRol(id, 2);
                    } else if (!userRol.find((rol) => rol.rolId == 2) && checkedProfe.checked) {
                        await postUserRol({ usuarioId: id, rolId: 2 });
                    }
    
                    if (userRol.find((rol) => rol.rolId == 3) && !checkedAlumno.checked) {
                        await deleteUserRol(id, 3);
                    } else if (!userRol.find((rol) => rol.rolId == 3) && checkedAlumno.checked) {
                        await postUserRol({ usuarioId: id, rolId: 3 });
                    }
    
                    const tabla = $('#Users').DataTable();
                    const row = tabla.row(`[data-id="${id}"]`);
                    row.data([
                        row.data()[0],
                        row.data()[1],
                        row.data()[2],
                    ]).draw(false);
    
                    const modal = new bootstrap.Modal(modalElement);
                    modal.hide();
                } catch (error) {
                    console.error('Error al confirmar la modificación:', error);
                }
            });
        }
    }

    rellenarUsers()
})