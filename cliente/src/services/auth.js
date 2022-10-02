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