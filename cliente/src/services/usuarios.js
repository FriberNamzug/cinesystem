import axios from 'axios'

export const obtenerUsuario = async (token) => {
    const data = await axios.get(`/usuarios/u/`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return data;
}

export const updateNotificaciones = async (token, notificaciones) => {
    const valor = notificaciones ? 1 : 0;
    return await axios.post(`/usuarios/u/notificaciones`, { notificaciones: valor }, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
}

export const updateUsuario = async (token, usuario) => {
    return await axios.put(`/usuarios/u/`, usuario, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
}

export const updatePassword = async (token, password) => {
    const pass = {
        password: password.oldPassword,
        newPassword: password.newPassword
    };

    return await axios.put(`/usuarios/u/password`, pass, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
}

export const obtenerTodosLosUsuarios = async (token) => {
    return await axios.get(`/usuarios/a/`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
}

export const agregarUsuario = async (token, usuario) => {
    return await axios.post(`/usuarios/a/`, usuario, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

export const obtenerRoles = async (token) => {
    return await axios.get(`/roles/`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

export const editarUsuario = async (token, usuario) => {
    return await axios.put(`/usuarios/a/${usuario.id}`, usuario, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

export const borrarUsuario = async (token, id) => {
    return await axios.delete(`/usuarios/a/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}