import logger from "../config/logger.js";
import pool from "../config/db.js";

export const getIdiomas = async (req, res) => {
    try {
        const { pagina, limite } = req.query;
        if (!pagina || !limite) return res.status(400).json({ error: "Faltan parámetros" });
        const offset = (pagina - 1) * limite;
        const total = await pool.query("SELECT COUNT(*) FROM idiomas WHERE status = 1");
        const totalPaginas = Math.ceil(total[0][0]["COUNT(*)"] / limite);
        const idiomas = await pool.query("SELECT * FROM idiomas WHERE status = 1 LIMIT ? OFFSET ? ", [Number(limite), Number(offset)]);

        if (idiomas[0].length === 0) return res.status(404).json({ message: "No hay idiomas" });

        res.status(200).json({
            total: total[0][0]["COUNT(*)"],
            totalPaginas,
            limite: Number(limite),
            pagina: Number(pagina),
            idiomas: idiomas[0],
        });
    } catch (error) {
        logger.error(`${error.message} - ${req.originalUrl} - ${req.method}`);
        res.status(500).json({ message: "Error del servidor" });
    }
}

export const getIdioma = async (req, res) => {
    try {
        const { id } = req.params;

        const idioma = await pool.query("SELECT * FROM idiomas WHERE id_idioma = ? AND status = 1", [id]);
        if (idioma[0].length === 0) return res.status(404).json({ message: "El idioma no existe" });
        res.status(200).json(idioma[0]);
    } catch (error) {
        logger.error(`${error.message} - ${req.originalUrl} - ${req.method}`);
        res.status(500).json({ message: "Error del servidor" });
    }
}

export const searchIdiomas = async (req, res) => {
    try {
        const { pagina, limite, busqueda } = req.query;
        if (!pagina || !limite || !busqueda) return res.status(400).json({ error: "Faltan parámetros" });
        const offset = (pagina - 1) * limite;
        const total = await pool.query("SELECT COUNT(*) FROM idiomas WHERE nombre LIKE ? AND status = 1", [`%${busqueda}%`]);
        const totalPaginas = Math.ceil(total[0][0]["COUNT(*)"] / limite);
        const idiomas = await pool.query("SELECT * FROM idiomas WHERE nombre LIKE ? AND status = 1 LIMIT ? OFFSET ?", [`%${busqueda}%`, Number(limite), Number(offset)]);
        if (idiomas[0].length === 0) return res.status(404).json({ message: "No hay idiomas" });
        res.status(200).json({
            total: total[0][0]["COUNT(*)"],
            totalPaginas,
            limite: Number(limite),
            pagina: Number(pagina),
            idiomas: idiomas[0],
        });
    } catch (error) {
        logger.error(`${error.message} - ${req.originalUrl} - ${req.method}`);
        res.status(500).json({ message: "Error del servidor" });
    }
}

export const createIdioma = async (req, res) => {
    try {
        const { nombre } = req.body;

        if (!nombre) return res.status(400).json({ message: "Faltan campos" });
        if (nombre.length > 45) return res.status(400).json({ message: "El nombre no puede tener más de 45 caracteres" });
        if (!nombre.match(/^[a-zA-ZÀ-ÿ\s]{1,40}$/)) return res.status(400).json({ message: "El nombre no es válido" });

        const newIdioma = {
            nombre: nombre,
        }

        const idiomas = await pool.query("INSERT INTO idiomas SET ?", [newIdioma]);
        if (idiomas[0].affectedRows === 0) return res.status(400).json({ message: "No se pudo crear el idioma" });

        res.status(200).json({
            message: "Idioma creado",
            idioma: {
                id_idioma: idiomas[0].insertId,
                ...newIdioma
            }
        });
    } catch (error) {
        logger.error(`${error.message} - ${req.originalUrl} - ${req.method}`);
        res.status(500).json({ message: "Error del servidor" });
    }
}

export const updateIdioma = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre } = req.body;

        if (!nombre) return res.status(400).json({ message: "Faltan campos" });

        if (nombre.length > 45) return res.status(400).json({ message: "El nombre no puede tener más de 45 caracteres" });
        if (!nombre.match(/^[a-zA-ZÀ-ÿ\s]{1,40}$/)) return res.status(400).json({ message: "El nombre no es válido" });

        const idioma = await pool.query("SELECT nombre FROM idiomas WHERE id_idioma = ? AND status = 1", [id]);
        if (idioma[0].length === 0) return res.status(404).json({ message: "El idioma no existe" });

        if (idioma[0][0].nombre === nombre) return res.status(400).json({ message: "No se hicieron cambios" });

        const updateIdioma = await pool.query("UPDATE idiomas SET nombre = ? WHERE id_idioma = ?", [nombre, id]);
        if (updateIdioma[0].affectedRows === 0) return res.status(400).json({ message: "No se pudo actualizar el idioma" });

        res.status(200).json({
            message: "Idioma actualizado",
            idioma: {
                id: id,
                nombre
            }
        });
    } catch (error) {
        logger.error(`${error.message} - ${req.originalUrl} - ${req.method}`);
        res.status(500).json({ message: "Error del servidor" });
    }
}

export const deleteIdioma = async (req, res) => {

    try {
        const { id } = req.params;

        const idioma = await pool.query("SELECT nombre FROM idiomas WHERE id_idioma = ? AND status = 1", [id]);
        if (idioma[0].length === 0) return res.status(404).json({ message: "El idioma no existe" });

        const relacion = await pool.query("SELECT id_idioma FROM peliculas_idiomas WHERE id_idioma = ? ", [id]);
        if (relacion[0].length > 0) return res.status(400).json({ message: "No se puede eliminar el idioma porque tiene peliculas relacionadas" });


        const deleteIdioma = await pool.query("UPDATE idiomas SET status = 0 WHERE id_idioma = ?", [id]);
        if (deleteIdioma[0].affectedRows === 0) return res.status(400).json({ message: "No se pudo eliminar el idioma" });

        res.status(200).json({
            message: "Idioma eliminado",
            idioma: {
                id: id,
                nombre: idioma[0][0].nombre
            }
        });
    } catch (error) {
        logger.error(`${error.message} - ${req.originalUrl} - ${req.method}`);
        res.status(500).json({ message: "Error del servidor" });
    }

}

