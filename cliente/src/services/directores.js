import axios from 'axios';

export const obtenerDirectores = async (pagina, limite) => {
    return await axios.get(`/directores?pagina=${pagina}&limite=${limite}`);
}

export const obtenerDirector = async (id) => {
    return await axios.get(`/directores/${id}`);
}

export const crearDirector = async (token, director) => {
    return await axios.post(`/directores`, director, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
}

export const actualizarDirector = async (token, id, director) => {
    return await axios.put(`/directores/${id}`, director, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
}

export const eliminarDirector = async (token, id) => {
    return await axios.delete(`/directores/${id}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
}