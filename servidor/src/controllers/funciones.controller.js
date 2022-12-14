import pool from "../config/db.js";
import logger from "../config/logger.js";
import { IMAGEN_POR_DEFECTO } from "../config/config.js";

export const getFunciones = async (req, res) => {
    try {
        /* Hacemos un inner para obtener el nombre de la pelicula con el id_pelicula */
        const [funciones] = await pool.query("SELECT * FROM funciones INNER JOIN peliculas ON funciones.id_pelicula = peliculas.id_pelicula WHERE funciones.status = 1");
        const funcionesFiltradas = funciones.filter(funcion => funcion.hasta > new Date());

        res.status(200).json(
            funcionesFiltradas
        );

    } catch (error) {
        logger.error(`${error.message} - ${req.originalUrl} - ${req.method}`);
        res.status(500).json({ message: "Error del servidor" });
    }
}

export const getFuncion = async (req, res) => {
    const { id_funcion } = req.params;
    try {
        const [funciones] = await pool.query("SELECT * FROM funciones WHERE status = 1 AND id_funcion = ?", [id_funcion]);
        if (funciones.length === 0) return res.status(404).json({ message: "No existe la función" });
        const [pelicula] = await pool.query("SELECT * FROM peliculas WHERE id_pelicula = ?", [funciones[0].id_pelicula]);
        if (pelicula[0].imagen === null) {
            pelicula[0].imagen = [{ url: IMAGEN_POR_DEFECTO, default: true }];
        } else {
            pelicula[0].imagen = { default: false, url: pelicula[0].imagen };
        }
        res.status(200).json({ funcion: funciones[0], pelicula: pelicula[0] });
    } catch (error) {
        logger.error(`${error.message} - ${req.originalUrl} - ${req.method}`);
        res.status(500).json({ message: "Error del servidor" });
    }
}

export const createFuncion = async (req, res) => {
    const { id_pelicula, aforo, sala, fechas, horario } = req.body;

    if (!id_pelicula || !aforo || !sala || !fechas || !horario) return res.status(400).json({ message: "Faltan datos" });
    if (aforo < 0) return res.status(400).json({ message: "El aforo no puede ser negativo" });
    if (sala < 0) return res.status(400).json({ message: "La sala no puede ser negativa" });
    if (sala > 99) return res.status(400).json({ message: "La sala no puede tener mas de 2 digitos" });
    if (fechas.desde < 1 || fechas.hasta < 1) return res.status(400).json({ message: "Debe haber al menos una fecha" });
    if (horario.length != 8) return res.status(400).json({ message: "El horario debe estar en formato HH:MM:SS" });
    if (fechas.desde < new Date().toISOString().slice(0, 10)) return res.status(400).json({ message: "La fecha desde no puede ser menor a la fecha actual" });
    if (fechas.hasta < fechas.desde) return res.status(400).json({ message: "La fecha hasta no puede ser menor a la fecha desde" });

    const newFuncion = {
        id_pelicula,
        aforo,
        sala,
        desde: fechas.desde,
        hasta: fechas.hasta,
        horario
    }

    try {
        const [pelicula] = await pool.query("SELECT * FROM peliculas WHERE id_pelicula = ? AND status = 1 AND disponibilidad = 1", [id_pelicula]);
        if (pelicula.length == 0) return res.status(400).json({ message: "La pelicula no existe" });

        await pool.query('INSERT INTO funciones SET ?', [newFuncion]);
        res.status(200).json({ message: "Funcion creada" });
    } catch (error) {
        logger.error(`${error.message} - ${req.originalUrl} - ${req.method}`);
        res.status(500).json({ message: "Error del servidor" });
    }
}

export const updateFuncion = async (req, res) => {
    const { sala, fechas, horario } = req.body;
    const { id_funcion } = req.params;

    if (!sala || !fechas || !horario) return res.status(400).json({ message: "Faltan datos" });
    if (sala < 0) return res.status(400).json({ message: "La sala no puede ser negativa" });
    if (sala > 99) return res.status(400).json({ message: "La sala no puede tener mas de 2 digitos" });
    if (fechas.desde < 1 || fechas.hasta < 1) return res.status(400).json({ message: "Debe haber al menos una fecha" });
    if (horario.length != 8) return res.status(400).json({ message: "El horario debe estar en formato HH:MM:SS" });
    if (fechas.desde < new Date().toISOString().slice(0, 10)) return res.status(400).json({ message: "La fecha desde no puede ser menor a la fecha actual" });
    if (fechas.hasta < fechas.desde) return res.status(400).json({ message: "La fecha hasta no puede ser menor a la fecha desde" });

    try {
        const [funcion] = await pool.query("SELECT * FROM funciones WHERE id_funcion = ? AND status = 1", [id_funcion]);
        if (funcion.length == 0) return res.status(400).json({ message: "La funcion no existe" });
        await pool.query('UPDATE funciones SET  sala = ?, desde = ?, hasta = ?, horario = ? WHERE id_funcion = ?', [sala, fechas.desde, fechas.hasta, horario, id_funcion]);
        res.status(200).json({ message: "Funcion actualizada" });
    } catch (error) {
        logger.error(`${error.message} - ${req.originalUrl} - ${req.method}`);
        res.status(500).json({ message: "Error del servidor" });
    }
}

export const deshabilitarFuncion = async (req, res) => {
    const { id_funcion } = req.params;
    try {
        const [funcion] = await pool.query("SELECT * FROM funciones WHERE id_funcion = ? AND status = 1", [id_funcion]);
        if (funcion.length == 0) return res.status(400).json({ message: "La funcion no existe" });

        await pool.query("UPDATE funciones SET status = 0 WHERE id_funcion = ?", [id_funcion]);
        res.status(200).json({ message: "Funcion deshabilitada" });
    } catch (error) {
        logger.error(`${error.message} - ${req.originalUrl} - ${req.method}`);
        res.status(500).json({ message: "Error del servidor" });
    }
}