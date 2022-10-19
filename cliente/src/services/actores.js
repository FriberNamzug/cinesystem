import axios from 'axios';

export const obtenerActores = async (pagina, limite) => {
    return await axios.get(`/actores?pagina=${pagina}&limite=${limite}`);
}

export const obtenerActor = async (id) => {
    return await axios.get(`/actores/${id}`);
}

export const buscarActores = async (pagina, limite, busqueda) => {
    return await axios.get(`/actores/search?pagina=${pagina}&limite=${limite}&busqueda=${busqueda}`);
}

export const crearActor = async (token, actor) => {
    return await axios.post(`/actores`, actor, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
}

export const actualizarActor = async (token, id, actor) => {
    return await axios.put(`/actores/${id}`, actor, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
}

export const eliminarActor = async (token, id) => {
    return await axios.delete(`/actores/${id}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
}