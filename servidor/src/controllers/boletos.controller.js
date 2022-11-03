import logger from "../config/logger.js";
import pool from "../config/db.js";

export const getBoletos = async (req, res) => {
    try {
        const { pagina, limite } = req.query;
        const { id } = req.user;
        if (!pagina || !limite) return res.status(400).json({ error: "Faltan parámetros" });
        const offset = (pagina - 1) * limite;
        const total = await pool.query("SELECT COUNT(*) FROM boletos WHERE status = 1 AND id_usuario = ?", [id]);
        const totalPaginas = Math.ceil(total[0][0]["COUNT(*)"] / limite);
        const boletos = await pool.query("SELECT * FROM boletos WHERE status = 1 AND id_usuario = ? LIMIT ? OFFSET ?", [id, Number(limite), Number(offset)]);

        if (boletos[0].length === 0) return res.status(404).json({ message: "No Boletos" });
        res.status(200).json({
            total: total[0][0]["COUNT(*)"],
            totalPaginas,
            limite: Number(limite),
            pagina: Number(pagina),
            boletos: boletos[0]
        });
    } catch (error) {
        logger.error(`${error.message} - ${req.originalUrl} - ${req.method}`);
        res.status(500).json({ message: "Error del servidor" });
    }
}

export const getBoleto = async (req, res) => {
    try {
        const { id_boleto } = req.params;
        const { id } = req.user;
        const [boleto] = await pool.query("SELECT * FROM boletos WHERE id_boleto = ? AND id_usuario = ?", [id_boleto, id]);
        if (boleto.length === 0) return res.status(404).json({ message: "No existe el boleto" });

        const [funcion] = await pool.query("SELECT * FROM funciones WHERE id_funcion = ?", [boleto[0].id_funcion]);
        const [pelicula] = await pool.query("SELECT * FROM peliculas WHERE id_pelicula = ?", [funcion[0].id_pelicula]);

        res.status(200).json({
            boleto: boleto[0],
            funcion: funcion[0],
            pelicula: pelicula[0]
        });
    } catch (error) {
        logger.error(`${error.message} - ${req.originalUrl} - ${req.method}`);
        res.status(500).json({ message: "Error del servidor" });
    }
}