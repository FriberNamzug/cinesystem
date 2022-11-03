import axios from 'axios';

export const obtenerBoletos = async (token, pagina, limite) => {
    return await axios.get(`/boletos?pagina=${pagina}&limite=${limite}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
}

export const obtenerBoleto = async (token, idBoleto) => {
    return await axios.get(`/boletos/${idBoleto}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
}