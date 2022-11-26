import logger from "../config/logger.js";
import pool from "../config/db.js";

export const obtenerRoles = async (req, res) => {
    try {
        const [roles] = await pool.query("SELECT id_rol, nombre FROM rol_usuarios");
        res.json(roles);
    } catch (error) {
        logger.error(error);
        res.status(500).json({ message: "Error al obtener los roles" });
    }
}
