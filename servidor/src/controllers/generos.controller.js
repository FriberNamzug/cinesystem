import logger from "../config/logger.js";
import pool from "../config/db.js";

export const getGeneros = async (req, res) => {
    try {
        const { pagina, limite } = req.query;
        if (!pagina || !limite) return res.status(400).json({ error: "Faltan parámetros" });
        const offset = (pagina - 1) * limite;
        const total = await pool.query("SELECT COUNT(*) FROM generos");
        const totalPaginas = Math.ceil(total[0][0]["COUNT(*)"] / limite);
        const generos = await pool.query("SELECT * FROM generos WHERE status = 1 LIMIT ? OFFSET ?", [Number(limite), Number(offset)]);
        if (generos[0].length === 0) return res.status(404).json({ message: "No hay generos" });

        res.status(200).json({
            total: total[0][0]["COUNT(*)"],
            totalPaginas,
            limite: Number(limite),
            pagina: Number(pagina),
            generos: generos[0],
        });
    } catch (error) {
        logger.error(`${error.message} - ${req.originalUrl} - ${req.method}`);
        res.status(500).json({ message: "Error del servidor" });
    }
}

export const getGenero = async (req, res) => {
    try {
        const { id } = req.params;

        const genero = await pool.query("SELECT * FROM generos WHERE id_genero = ? AND status = 1", [id]);
        if (genero[0].length === 0) return res.status(404).json({ message: "El género no existe" });
        res.status(200).json(genero[0]);
    } catch (error) {
        logger.error(`${error.message} - ${req.originalUrl} - ${req.method}`);
        res.status(500).json({ message: "Error del servidor" });
    }
}

export const searchGeneros = async (req, res) => {
    try {
        const { pagina, limite, busqueda } = req.query;
        if (!pagina || !limite || !busqueda) return res.status(400).json({ error: "Faltan parámetros" });
        const offset = (pagina - 1) * limite;
        const total = await pool.query("SELECT COUNT(*) FROM generos WHERE nombre LIKE ?", [`%${busqueda}%`]);
        const totalPaginas = Math.ceil(total[0][0]["COUNT(*)"] / limite);
        const [generos] = await pool.query("SELECT * FROM generos WHERE nombre LIKE ? AND status = 1 LIMIT ? OFFSET ?", [`%${busqueda}%`, Number(limite), Number(offset)]);
        if (generos.length === 0) return res.status(404).json({ message: "No hay géneros" });

        res.status(200).json({
            total: total[0][0]["COUNT(*)"],
            totalPaginas,
            limite: Number(limite),
            pagina: Number(pagina),
            generos: generos,
        });
    } catch (error) {
        logger.error(`${error.message} - ${req.originalUrl} - ${req.method}`);
        res.status(500).json({ message: "Error del servidor" });
    }
}

export const createGenero = async (req, res) => {
    try {
        const { nombre } = req.body;

        if (!nombre) return res.status(400).json({ message: "Faltan campos" });
        if (nombre.length > 45) return res.status(400).json({ message: "El nombre no puede tener más de 45 caracteres" });
        if (!nombre.match(/^[a-zA-ZÀ-ÿ\s]{1,40}$/)) return res.status(400).json({ message: "El nombre no es válido" });

        const newGenero = {
            nombre: nombre,
        }

        const genero = await pool.query("INSERT INTO generos SET ?", [newGenero]);
        if (genero[0].affectedRows === 0) return res.status(400).json({ message: "No se pudo crear el género" });

        res.status(200).json({
            message: "Género creado",
            genero: {
                id_genero: genero[0].insertId,
                ...newGenero
            }
        });
    } catch (error) {
        logger.error(`${error.message} - ${req.originalUrl} - ${req.method}`);
        res.status(500).json({ message: "Error del servidor" });
    }
}

export const updateGenero = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre } = req.body;

        if (!nombre) return res.status(400).json({ message: "Faltan campos" });

        if (nombre.length > 45) return res.status(400).json({ message: "El nombre no puede tener más de 45 caracteres" });
        if (!nombre.match(/^[a-zA-ZÀ-ÿ\s]{1,40}$/)) return res.status(400).json({ message: "El nombre no es válido" });

        const genero = await pool.query("SELECT nombre FROM generos WHERE id_genero = ? AND status = 1", [id]);
        if (genero[0].length === 0) return res.status(404).json({ message: "El género no existe" });

        if (genero[0][0].nombre === nombre) return res.status(400).json({ message: "No se hicieron cambios" });

        const updateGenero = await pool.query("UPDATE generos SET nombre = ? WHERE id_genero = ?", [nombre, id]);
        if (updateGenero[0].affectedRows === 0) return res.status(400).json({ message: "No se pudo actualizar el género" });

        res.status(200).json({
            message: "Género actualizado",
            genero: {
                id_genero: id,
                nombre
            }
        });
    } catch (error) {
        logger.error(`${error.message} - ${req.originalUrl} - ${req.method}`);
        res.status(500).json({ message: "Error del servidor" });
    }
}

export const deleteGenero = async (req, res) => {
    try {
        const { id } = req.params;

        const genero = await pool.query("SELECT nombre FROM generos WHERE id_genero = ? AND status = 1", [id]);
        if (genero[0].length === 0) return res.status(404).json({ message: "El género no existe" });

        const relacion = await pool.query("SELECT id_genero FROM peliculas_generos WHERE id_genero = ? ", [id]);
        if (relacion[0].length > 0) return res.status(400).json({ message: "No se puede eliminar el género porque tiene peliculas relacionadas" });


        const deleteGenero = await pool.query("UPDATE generos SET status = 0 WHERE id_genero = ?", [id]);
        if (deleteGenero[0].affectedRows === 0) return res.status(400).json({ message: "No se pudo eliminar el género" });

        res.status(200).json({
            message: "Género eliminado",
            genero: {
                id_genero: id,
                nombre: genero[0][0].nombre
            }
        });
    } catch (error) {
        logger.error(`${error.message} - ${req.originalUrl} - ${req.method}`);
        res.status(500).json({ message: "Error del servidor" });
    }
}


