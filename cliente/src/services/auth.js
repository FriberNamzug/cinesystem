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


export const recuperarPassword = (email) => {
    return axios.get(`/auth/recuperar/${email}`);
}

export const cambiarPasswordConToken = (token, password) => {
    return axios.post(`/auth/recuperar/${token}`, {
        password
    });
}


///Verificaciones
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


// 2 F A

export const crear2FA = async (token) => {
    return await axios.post(`/auth/2fa/crear`, {}, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
}

export const eliminar2FA = async (token) => {
    return await axios.post(`/auth/2fa/eliminar`, {
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



