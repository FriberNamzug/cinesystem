import axios from 'axios';

export const subirImagenActor = async (token, imagen, id) => {
    const formData = new FormData();
    formData.append('image', imagen);
    const config = {
        headers: {
            'Content-Type': 'multipart/form-data',
            'x-token': token
        }
    }
    const { data } = await axios.post(`/uploads/a/${id}`, formData, config);
    return data;
}

export const subirImagenPelicula = async (token, imagen, id) => {
    const formData = new FormData();
    formData.append('image', imagen);
    const config = {
        headers: {
            'Content-Type': 'multipart/form-data',
            'x-token': token
        }
    }
    const { data } = await axios.post(`/uploads/p/${id}`, formData, config);
    return data;
}