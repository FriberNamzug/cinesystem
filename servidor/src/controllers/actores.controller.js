import logger from "../config/logger.js";
import pool from "../config/db.js";

export const getActores = async (req, res) => {
    try {
        const { pagina, limite } = req.query;
        if (!pagina || !limite) return res.status(400).json({ error: "Faltan parámetros" });
        const offset = (pagina - 1) * limite;
        const total = await pool.query("SELECT COUNT(*) FROM actores");
        const totalPaginas = Math.ceil(total[0][0]["COUNT(*)"] / limite);
        const [actores] = await pool.query("SELECT * FROM actores WHERE status = 1 LIMIT ? OFFSET ?", [Number(limite), Number(offset)]);

        if (actores.length === 0) return res.status(404).json({ message: "No hay actores" });
        res.status(200).json({
            total: total[0][0]["COUNT(*)"],
            totalPaginas,
            limite: Number(limite),
            pagina: Number(pagina),
            actores: actores,
        });
    } catch (error) {
        logger.error(`${error.message} - ${req.originalUrl} - ${req.method}`);
        res.status(500).json({ message: "Error del servidor" });
    }
}

export const getActor = async (req, res) => {
    try {
        const { id } = req.params;
        const [actor] = await pool.query("SELECT * FROM actores WHERE id_actor = ? AND status = 1", [id]);
        if (actor.length === 0) return res.status(404).json({ message: "El actor no existe" });
        res.status(200).json(actor);
    } catch (error) {
        logger.error(`${error.message} - ${req.originalUrl} - ${req.method}`);
        res.status(500).json({ message: "Error del servidor" });
    }
}

export const searchActores = async (req, res) => {
    try {
        const { pagina, limite, busqueda } = req.query;
        if (!pagina || !limite || !busqueda) return res.status(400).json({ error: "Faltan parámetros" });
        const offset = (pagina - 1) * limite;

        const total = await pool.query("SELECT COUNT(*) FROM actores WHERE (nombre LIKE ?) AND status = 1", [`%${busqueda}%`]);
        const totalPaginas = Math.ceil(total[0][0]["COUNT(*)"] / limite);
        const [actores] = await pool.query("SELECT * FROM actores WHERE (nombre LIKE ? ) AND status = 1 LIMIT ? OFFSET ?", [`%${busqueda}%`, Number(limite), Number(offset)]);
        if (actores.length === 0) return res.status(404).json({ message: "No hay actores" });

        res.status(200).json({
            total: total[0][0]["COUNT(*)"],
            totalPaginas,
            limite: Number(limite),
            pagina: Number(pagina),
            actores: actores,
        });
    } catch (error) {
        logger.error(`${error.message} - ${req.originalUrl} - ${req.method}`);
        res.status(500).json({ message: "Error del servidor" });
    }
}

export const createActor = async (req, res) => {
    try {
        const { nombre } = req.body;

        if (!nombre) return res.status(400).json({ message: "Todos los campos son obligatorios" });
        if (nombre.length > 45) return res.status(400).json({ message: "El nombre no pueden tener más de 45 caracteres" });
        if (!nombre.match(/^[a-zA-ZÀ-ÿ\s]{1,40}$/)) return res.status(400).json({ message: "El nombre no es válido" });

        const newActor = {
            nombre,
        }

        const actor = await pool.query("INSERT INTO actores SET ?", [newActor]);
        if (actor[0].affectedRows === 0) return res.status(400).json({ message: "No se pudo crear el actor" });

        res.json({
            message: "Actor creado",
            actor: {
                id_actor: actor[0].insertId,
                ...newActor
            }
        });

    }
    catch (error) {
        logger.error(`${error.message} - ${req.originalUrl} - ${req.method}`);
        res.status(500).json({ message: "Error del servidor" });
    }
}

export const updateActor = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre } = req.body;

        if (!nombre) return res.status(400).json({ message: "Faltan campos" });
        if (nombre.length > 45 || apellido.length > 45) return res.status(400).json({ message: "El nombre no pueden tener más de 45 caracteres" });
        if (!nombre.match(/^[a-zA-ZÀ-ÿ\s]{1,40}$/)) return res.status(400).json({ message: "El nombre no es válido" });

        const actor = await pool.query("SELECT id_actor, nombre FROM actores WHERE id_actor = ? AND status = 1", [id]);
        if (actor[0].length === 0) return res.status(404).json({ message: "El actor no existe" });


        if (actor[0][0].nombre === nombre) return res.status(400).json({ message: "No hay cambios" });

        const actorActualizado = {
            nombre: nombre || actor[0][0].nombre
        }

        const actorUpdate = await pool.query("UPDATE actores SET ? WHERE id_actor = ?", [actorActualizado, id]);
        if (actorUpdate[0].affectedRows === 0) return res.status(400).json({ message: "No se pudo actualizar el actor" });

        res.json({
            message: "Actor actualizado",
            actor: {
                id,
                nombre,
            }
        });

    } catch (error) {
        logger.error(`${error.message} - ${req.originalUrl} - ${req.method}`);
        res.status(500).json({ message: "Error del servidor" });
    }
}

export const deleteActor = async (req, res) => {
    try {
        const { id } = req.params;

        const actor = await pool.query("SELECT id_actor FROM actores WHERE id_actor = ? AND status = 1", [id]);
        if (actor[0].length === 0) return res.status(404).json({ message: "El actor no existe" });

        const relacion = await pool.query("SELECT id_actor FROM peliculas_actores WHERE id_actor = ?", [id]);
        if (relacion[0].length > 0) return res.status(400).json({ message: "No se puede eliminar el actor porque tiene películas asociadas" });

        await pool.query("UPDATE actores SET status = 0 WHERE id_actor = ?", [id]);
        res.json({ message: "Actor eliminado" });
    } catch (error) {
        logger.error(`${error.message} - ${req.originalUrl} - ${req.method}`);
        res.status(500).json({ message: "Error del servidor" });
    }
} 
