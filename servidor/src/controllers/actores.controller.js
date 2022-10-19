import logger from "../config/logger.js";
import pool from "../config/db.js";

export const getActores = async (req, res) => {
    try {
        const { pagina, limite } = req.query;
        if (!pagina || !limite) return res.status(400).json({ error: "Faltan parámetros" });
        const offset = (pagina - 1) * limite;
        const total = await pool.query("SELECT COUNT(*) FROM actores");
        const totalPaginas = Math.ceil(total[0][0]["COUNT(*)"] / limite);
        const actores = await pool.query("SELECT * FROM actores WHERE status = 1 LIMIT ? OFFSET ?", [Number(limite), Number(offset)]);

        if (actores[0].length === 0) return res.status(404).json({ message: "No hay actores" });
        res.status(200).json({
            total: total[0][0]["COUNT(*)"],
            totalPaginas,
            limite: Number(limite),
            pagina: Number(pagina),
            actores: actores[0],
        });
    } catch (error) {
        logger.error(`${error.message} - ${req.originalUrl} - ${req.method}`);
        res.status(500).json({ message: "Error del servidor" });
    }
}

export const getActor = async (req, res) => {
    try {
        const { id } = req.params;
        const actor = await pool.query("SELECT * FROM actores WHERE id_actor = ? AND status = 1", [id]);
        if (actor[0].length === 0) return res.status(404).json({ message: "El actor no existe" });
        res.json(actor[0]);
    } catch (error) {
        logger.error(`${error.message} - ${req.originalUrl} - ${req.method}`);
        res.status(500).json({ message: "Error del servidor" });
    }
}

export const createActor = async (req, res) => {
    try {
        const { nombre, apellido, fecha_nacimiento } = req.body;
        const fecha = new Date(fecha_nacimiento);

        if (!nombre || !apellido || !fecha_nacimiento) return res.status(400).json({ message: "Todos los campos son obligatorios" });
        if (nombre.length > 45 || apellido.length > 45) return res.status(400).json({ message: "El nombre o el apellido no pueden tener más de 45 caracteres" });
        if (!nombre.match(/^[a-zA-ZÀ-ÿ\s]{1,40}$/)) return res.status(400).json({ message: "El nombre no es válido" });
        if (!apellido.match(/^[a-zA-ZÀ-ÿ\s]{1,40}$/)) return res.status(400).json({ message: "El apellido no es válido" });
        if (fecha.toString() === "Invalid Date") return res.status(400).json({ message: "La fecha de nacimiento no es válida" });

        const newActor = {
            nombre,
            apellido,
            fecha_nacimiento
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
        const { nombre, apellido, fecha_nacimiento } = req.body;
        const fecha = new Date(fecha_nacimiento);

        if (!nombre || !apellido || !fecha_nacimiento) return res.status(400).json({ message: "Faltan campos" });
        if (nombre.length > 45 || apellido.length > 45) return res.status(400).json({ message: "El nombre o el apellido no pueden tener más de 45 caracteres" });
        if (!nombre.match(/^[a-zA-ZÀ-ÿ\s]{1,40}$/)) return res.status(400).json({ message: "El nombre no es válido" });
        if (!apellido.match(/^[a-zA-ZÀ-ÿ\s]{1,40}$/)) return res.status(400).json({ message: "El apellido no es válido" });
        if (fecha.toString() === "Invalid Date") return res.status(400).json({ message: "La fecha de nacimiento no es válida" });

        const actor = await pool.query("SELECT id_actor, nombre, apellido, fecha_nacimiento FROM actores WHERE id_actor = ? AND status = 1", [id]);
        if (actor[0].length === 0) return res.status(404).json({ message: "El actor no existe" });

        const fechaNacimiento = new Date(actor[0][0].fecha_nacimiento);
        const fechaNacimientoString = `${fechaNacimiento.getFullYear()}-${fechaNacimiento.getMonth() + 1}-${fechaNacimiento.getDate()}`;

        if (actor[0][0].nombre === nombre && actor[0][0].apellido === apellido && fechaNacimientoString === fecha_nacimiento.toString()) return res.status(400).json({ message: "No hay cambios" });

        const actorActualizado = {
            nombre: nombre || actor[0][0].nombre,
            apellido: apellido || actor[0][0].apellido,
            fecha_nacimiento: fecha_nacimiento || actor[0][0].fecha_nacimiento
        }

        const actorUpdate = await pool.query("UPDATE actores SET ? WHERE id_actor = ?", [actorActualizado, id]);
        if (actorUpdate[0].affectedRows === 0) return res.status(400).json({ message: "No se pudo actualizar el actor" });

        res.json({
            message: "Actor actualizado",
            actor: {
                id,
                nombre,
                apellido,
                fecha_nacimiento
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
