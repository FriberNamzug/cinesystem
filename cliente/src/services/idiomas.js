import axios from 'axios';

export const obtenerIdiomas = async (pagina, limite) => {
    return await axios.get(`/idiomas?pagina=${pagina}&limite=${limite}`);
}

export const obtenerIdioma = async (id) => {
    return await axios.get(`/idiomas/${id}`);
}

export const buscarIdiomas = async (pagina,limite,busqueda) => {
    return await axios.get(`/idiomas/search/?pagina=${pagina}&limite=${limite}&busqueda=${busqueda}`);
}

export const crearIdioma = async (token, idioma) => {
    return await axios.post(`/idiomas`, idioma, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
}

export const actualizarIdioma = async (token, id, idioma) => {
    return await axios.put(`/idiomas/${id}`, idioma, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
}

export const eliminarIdioma = async (token, id) => {
    return await axios.delete(`/idiomas/${id}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
}

