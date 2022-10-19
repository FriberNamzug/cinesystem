import axios from 'axios'

export const obtenerPeliculas = async (pagina,limite) => {
    return await axios.get(`/peliculas/p/?pagina=${pagina}&limite=${limite}`);
}