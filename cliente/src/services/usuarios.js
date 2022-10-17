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