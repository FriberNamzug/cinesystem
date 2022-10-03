import axios from 'axios'

export const login = (email, password) => {
    return axios.post(`/auth/signin`, {
        email,
        password
    });
}

export const register = (nombre, email, password) => {
    return axios.post(`/auth/signup`, {
        nombre,
        email,
        password
    });
}

export const activarCuenta = (token) => {
    return axios.get(`/auth/activar-cuenta/${token}`);
}

export const verificarToken = async (token) => {
    return await axios.get(`/auth/verifytoken`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
}

export const validar2FA = (token, codigo) => {
    console.log(token.toString());
    console.log(codigo.toString());
    return axios.post(`/auth/2fa/verificar`, {
        token: codigo.toString()
    }, {

        headers: {
            Authorization: `Bearer ${token}`
        }
    });
}