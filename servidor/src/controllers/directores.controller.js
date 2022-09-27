import logger from "../config/logger.js";
import pool from "../config/db.js";

export const getDirectores = async (req, res) => {
    try {
        const response = await pool.query('SELECT * FROM directores');
        if (response[0].length === 0) return res.status(404).json({ message: "No hay directores" });
        res.status(200).json(response[0]);
    } catch (error) {
        logger.error(error);
        res.status(500).json({ message: 'Error al obtener los directores' });
    }
}

export const getDirector = async (req, res) => {
    try {
        const { id } = req.params;
        const response = await pool.query('SELECT * FROM directores WHERE id_director = $1', [id]);
        if (response[0].length === 0) return res.status(404).json({ message: "El director no existe" });
        res.status(200).json(response[0]);

    } catch (error) {
        logger.error(error);
        res.status(500).json({ message: 'Error al obtener el director' });
    }
}

export const createDirector = async (req, res) => {
    try {
        const { nombre, apellido } = req.body;

        if (!nombre || !apellido) return res.status(400).json({ message: "Todos los campos son obligatorios" });
        if (nombre.length > 45 || apellido.length > 45) return res.status(400).json({ message: "El nombre o el apellido no pueden tener más de 45 caracteres" });
        if (!nombre.match(/^[a-zA-ZÀ-ÿ\s]{1,40}$/)) return res.status(400).json({ message: "El nombre no es válido" });
        if (!apellido.match(/^[a-zA-ZÀ-ÿ\s]{1,40}$/)) return res.status(400).json({ message: "El apellido no es válido" });

        const newDirector = {
            nombre,
            apellido,
        }

        const response = await pool.query('INSERT INTO directores SET ?', [newDirector]);
        if (response[0].affectedRows === 0) return res.status(400).json({ message: "No se pudo crear el director" });

        res.json({
            message: "Director creado",
            director: {
                id_director: response[0].insertId,
                ...newDirector
            }
        });

    }
    catch (error) {
        logger.error(error);
        res.status(500).json({ message: 'Error al crear el director' });
    }
}

export const updateDirector = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, apellido } = req.body;

        if (!nombre || !apellido) return res.status(400).json({ message: "Todos los campos son obligatorios" });
        if (nombre.length > 45 || apellido.length > 45) return res.status(400).json({ message: "El nombre o el apellido no pueden tener más de 45 caracteres" });
        if (!nombre.match(/^[a-zA-ZÀ-ÿ\s]{1,40}$/)) return res.status(400).json({ message: "El nombre no es válido" });
        if (!apellido.match(/^[a-zA-ZÀ-ÿ\s]{1,40}$/)) return res.status(400).json({ message: "El apellido no es válido" });

        const director = await pool.query('SELECT nombre, apellido FROM directores WHERE id_director = ?', [id]);
        if (director[0].length === 0) return res.status(404).json({ message: "El director no existe" });

        if (director[0][0].nombre === nombre && director[0][0].apellido === apellido) return res.status(400).json({ message: "No se han realizado cambios" });

        const newDirector = {
            nombre,
            apellido,
        }

        const response = await pool.query('UPDATE directores SET ? WHERE id_director = ?', [newDirector, id]);
        if (response[0].affectedRows === 0) return res.status(400).json({ message: "No se pudo actualizar el director" });

        res.json({
            message: "Director actualizado",
            director: {
                id_director: id,
                ...newDirector
            }
        });

    }
    catch (error) {
        logger.error(error);
        res.status(500).json({ message: 'Error al actualizar el director' });
    }
}

export const deleteDirector = async (req, res) => {
    try {
        const { id } = req.params;

        const director = await pool.query("SELECT id_director FROM directores WHERE id_director = ? AND status = 1", [id]);
        if (director[0].length === 0) return res.status(404).json({ message: "El director no existe" });

        const relacion = await pool.query("SELECT id_director FROM peliculas_directores WHERE id_director = ?", [id]);
        if (relacion[0].length > 0) return res.status(400).json({ message: "No se puede eliminar el director porque tiene películas asociadas" });

        const response = await pool.query('UPDATE directores SET status = 0 WHERE id_director = ?', [id]);
        if (response[0].affectedRows === 0) return res.status(400).json({ message: "No se pudo eliminar el director" });

        res.json({
            message: "Director eliminado"
        });

    } catch (error) {
        logger.error(error);
        res.status(500).json({ message: 'Error al eliminar el director' });
    }
}

