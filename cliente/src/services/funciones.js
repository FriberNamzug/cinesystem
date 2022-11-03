import axios from 'axios';

export const obtenerFunciones = async () => {
    return await axios.get(`/funciones`);
}
export const obtenerFuncion = async (id) => {
    return await axios.get(`/funciones/${id}`);
}

export const crearFuncion = async (token, funcion) => {
    return await axios.post(`/funciones`, funcion, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
}

export const actualizarFuncion = async (token, id, funcion) => {
    return await axios.put(`/funciones/${id}`, funcion, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
}

export const deshabilitarFuncion = async (token, id) => {
    return await axios.delete(`/funciones/${id}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
}

