import axios from 'axios';

export const obtenerGeneros = async (pagina,limite) => {
    return await axios.get(`/generos?pagina=${pagina}&limite=${limite}`);
}

export const obtenerGenero = async (id) => {
    return await axios.get(`/generos/${id}`);
}

export const crearGenero = async (token, genero) => {
    return await axios.post(`/generos`, genero, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
}

export const actualizarGenero = async (token, id, genero) => {
    return await axios.put(`/generos/${id}`, genero, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
}

export const eliminarGenero = async (token, id) => {
    return await axios.delete(`/generos/${id}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
}

