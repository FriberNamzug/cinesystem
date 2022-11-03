import axios from 'axios';

export const crearOrdenCompra = async (token, item) => {
    return await axios.post(`/payments/create-order`, item, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
}

export const confirmarOrdenCompra = async (token, payerid, folio) => {
    return await axios.get(`/payments/capture-order?token=${token}&payerid=${payerid}&folio=${folio}`);
}

export const cancelarOrdenCompra = async (folio) => {
    return await axios.get(`/payments/cancel-order?folio=${folio}`);
}