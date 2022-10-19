import axios from 'axios'

export const obtenerPeliculas = async (pagina, limite) => {
    return await axios.get(`/peliculas/p/?pagina=${pagina}&limite=${limite}`);
}

export const obtenerPelicula = async (id) => {
    return await axios.get(`/peliculas/${id}`);
}

export const crearPelicula = async (token, pelicula) => {
    return await axios.post('/peliculas', pelicula, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
}

export const actualizarPelicula = async (token, id, pelicula) => {
    return await axios.put(`/peliculas/${id}`, pelicula, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
}

export const eliminarPelicula = async (token, id) => {
    return await axios.delete(`/peliculas/${id}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
}