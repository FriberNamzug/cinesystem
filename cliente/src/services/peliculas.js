import axios from 'axios'

export const obtenerPeliculas = async (pagina, limite) => {
    return await axios.get(`/peliculas/p/?pagina=${pagina}&limite=${limite}`);
}

export const obtenerPelicula = async (id) => {
    return await axios.get(`/peliculas/${id}`);
}

export const obtenerPeliculasPorGenero = async (genero) => {
    return await axios.get(`/peliculas/p/genero/${genero}`);
}

export const obtenerPeliculasConDisponibilidad = async () => {
    return await axios.get(`/peliculas/p/disponibilidad`);
}

export const obtenerPeliculasConFunciones = async (id_pelicula, pagina, limite) => {
    return await axios.get(`/peliculas/p/funciones/${id_pelicula}?pagina=${pagina}&limite=${limite}`);
}

export const buscarPeliculas = async (pagina, limite, busqueda) => {
    return await axios.get(`/peliculas/search/?pagina=${pagina}&limite=${limite}&busqueda=${busqueda}`);
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

export const updateDisponibilidad = async (token, id_pelicula, disponibilidad) => {
    return await axios.put(`/peliculas/p/disponibilidad/${id_pelicula}`, { disponibilidad }, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
}