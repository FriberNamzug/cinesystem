import logger from "../config/logger.js";
import pool from "../config/db.js";
import axios from "axios";
import {
    PAYPAL_API_CLIENT,
    PAYPAL_API_SECRET,
    PAYPAL_API_HOST,
    APP_NAME,
    PAYPAL_API_APPLICATION_CONTEXT_RETURN_URL,
    PAYPAL_API_APPLICATION_CONTEXT_CANCEL_URL
} from "../config/config.js";
import { v4 as uuidv4 } from 'uuid';
import { sendMail, ordenDeCompra } from "../config/email/index.js";


const getAccessToken = async () => {
    const params = new URLSearchParams()
    params.append('grant_type', 'client_credentials')
    try {
        const { data: { access_token } } = await axios.post('https://api-m.sandbox.paypal.com/v1/oauth2/token', params, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            auth: {
                username: PAYPAL_API_CLIENT,
                password: PAYPAL_API_SECRET
            },
        })
        return access_token
    } catch (error) {
        console.log(error);
        logger.error(`${error.message} - ${req.originalUrl} - ${req.method}`);
        return "error";
    }
}

export const createOrder = async (req, res) => {
    const folio = uuidv4();
    const { id_funcion, fecha } = req.body;
    const { user } = req;

    const [funcion] = await pool.query('SELECT * FROM funciones WHERE id_funcion = ?', [id_funcion]);
    if (funcion.length === 0) return res.status(404).json({ message: 'No existe la función' });
    const [pelicula] = await pool.query('SELECT * FROM peliculas WHERE id_pelicula = ?', [funcion[0].id_pelicula]);
    const descripcion = `${pelicula[0].titulo} - ${fecha} - ${funcion[0].horario}`;
    if (descripcion.length > 127) descripcion = descripcion.substring(0, 127)
    const costo = funcion[0].costo_boleto

    //Creamos el boleto
    const newTicket = {
        id_usuario: user.id,
        id_funcion,
        security: folio,
        folio,
        fecha,
        hora: funcion[0].horario,
        pagado: 0
    }

    const response = await pool.query('INSERT INTO boletos SET ?', [newTicket]);
    if (response[0].affectedRows === 0) return res.status(500).json({ message: 'No se pudo crear el boleto' });
    const order = {
        intent: "CAPTURE",
        purchase_units: [{
            reference_id: folio,
            custom_id: folio,
            amount: {
                currency_code: "MXN", // Moneda
                value: Number(costo) // Precio
            },
            description: descripcion,
        }],
        application_context: {
            brand_name: APP_NAME.toString(),
            shipping_preference: "NO_SHIPPING", // No se requiere envío
            landing_page: "LOGIN", // No se requiere página de aterrizaje,
            user_action: "PAY_NOW", // Pagar ahora
            locale: "es-MX", // Lenguaje
            return_url: `${PAYPAL_API_APPLICATION_CONTEXT_RETURN_URL}/${folio}`,
            cancel_url: `${PAYPAL_API_APPLICATION_CONTEXT_CANCEL_URL}/${folio}`
        }
    }

    try {
        const access_token = await getAccessToken()
        const response = await axios.post(`${PAYPAL_API_HOST}/v2/checkout/orders`, order, {
            headers: {
                Authorization: `Bearer ${access_token}`,
            }
        })
        res.json({
            message: 'Order created',
            order: response.data.links[1].href
        });
    } catch (error) {
        console.log(error);
        res.json({ message: 'Error creating order' });
        logger.error(`${error.message} - ${req.originalUrl} - ${req.method}`);
    }

}


export const captureOrder = async (req, res) => {
    const { token, payerid, folio } = req.query;

    if (!token || !payerid || !folio) return res.status(400).json({ message: 'Faltan datos' });

    try {

        const access_token = await getAccessToken()

        const response = await axios.post(`${PAYPAL_API_HOST}/v2/checkout/orders/${token}/capture`, {}, {
            headers: {
                Authorization: `Bearer ${access_token}`,
            }
        })


        const [usuario] = await pool.query('SELECT u.nombre, u.email, u.telefono, b.hora, b.fecha, b.id_funcion FROM usuarios AS u INNER JOIN boletos AS b ON u.id_usuario = b.id_usuario WHERE b.folio = ?', [folio]);

        const [funcion] = await pool.query('SELECT id_pelicula, sala, costo_boleto FROM funciones WHERE id_funcion = ?', [usuario[0].id_funcion]);

        const [pelicula] = await pool.query('SELECT titulo FROM peliculas WHERE id_pelicula = ?', [funcion[0].id_pelicula]);

        const responseBoleto = await pool.query('UPDATE boletos SET pagado = 1 WHERE folio = ?', [folio]);
        if (responseBoleto[0].affectedRows === 0) return res.status(500).json({ message: 'No se pudo actualizar el boleto, ponte en contacto con soporte' });

        const fecha = new Date().toLocaleDateString('es-MX', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '-');
        const hora = new Date().toLocaleTimeString('es-MX', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }).replace(/\:/g, '-');

        const html = ordenDeCompra(usuario[0].nombre, folio, fecha, hora, pelicula[0].titulo, funcion[0].costo_boleto);
        sendMail(req, process.env.MAILER_USER, usuario[0].email, "Orden de compra", html);

        res.status(200).json({
            message: 'Pago completado',
            order: response.data,
            folio,
            fecha,
            hora,
            nombre: usuario[0].nombre,
            email: usuario[0].email,
        });

    } catch (error) {
        console.log(error);
        res.status(422).json({ message: 'No se pudo procesar el pago.' });
        logger.error(`${error.message} - ${req.originalUrl} - ${req.method}`);

    }
}

export const cancelOrder = async (req, res) => {
    const { folio } = req.query;
    if (!folio) return res.status(400).json({ message: 'Faltan datos' });

    try {
        const responseBoleto = await pool.query('UPDATE boletos SET status = 0 WHERE folio = ?', [folio]);
        if (responseBoleto[0].affectedRows === 0) return res.status(500).json({ message: 'No se pudo eliminar el boleto, ponte en contacto con soporte' });

        res.status(200).json({
            message: 'Pago cancelado',
            folio,
        });
    } catch (error) {
        console.log(error);
        res.status(422).json({ message: 'No se pudo cancelar el pago.' });
        logger.error(`${error.message} - ${req.originalUrl} - ${req.method}`);

    }
}