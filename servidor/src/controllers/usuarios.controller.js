import logger from "../config/logger.js";
import pool from "../config/db.js";


export const getUsuarios = async (req, res) => {
    try {
        const usuarios = await pool.query("SELECT * FROM usuarios");
        res.json(usuarios[0]);
    } catch (error) {
        logger.error(`${error.message} - ${req.originalUrl} - ${req.method}`);
    }
}

export const getUsuario = async (req, res) => {
    try {
        const { id } = req.params;

        const usuario = await pool.query("SELECT * FROM usuarios WHERE id_usuario = ? AND status = 1", [id]);
        if (usuario[0].length === 0) return res.status(404).json({ message: "El usuario no existe" });
        res.json(usuario[0]);
    } catch (error) {
        logger.error(`${error.message} - ${req.originalUrl} - ${req.method}`);
    }
}

export const updateUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, email } = req.body;


        if (!nombre || !email) return res.status(400).json({ message: "Faltan campos" });
        if (nombre.length > 45 || email.length > 45) return res.status(400).json({ message: "El nombre o el email no pueden tener más de 45 caracteres" });
        if (!email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)) return res.status(400).json({ message: "El email no es válido" });
        if (!nombre.match(/^[a-zA-ZÀ-ÿ\s]{1,40}$/)) return res.status(400).json({ message: "El nombre no es válido" });


        const usuario = await pool.query("SELECT id_usuario FROM usuarios WHERE id_usuario = ? AND status = 1", [id]);
        if (usuario[0].length === 0) return res.status(404).json({ message: "El usuario no existe" });

        const usuarioActual = await pool.query("SELECT nombre, email FROM usuarios WHERE id_usuario = ?", [id]);
        if (usuarioActual[0][0].nombre === nombre && usuarioActual[0][0].email === email) return res.status(400).json({ message: "No hay cambios" });

        if (usuarioActual[0][0].email !== email) {
            const emailExistente = await pool.query("SELECT email FROM usuarios WHERE email = ? AND status = 1", [email]);
            if (emailExistente[0].length > 0) return res.status(400).json({ message: "El email ya esta registrado" });
        }

        await pool.query("UPDATE usuarios SET nombre = ?, email = ? WHERE id_usuario = ?", [nombre, email, id]);
        res.json({
            message: "Usuario actualizado",
            usuario: {
                id,
                nombre,
                email
            }
        });

    } catch (error) {
        logger.error(`${error.message} - ${req.originalUrl} - ${req.method}`);
    }
}

export const deleteUsuario = async (req, res) => {
    try {
        const { id } = req.params;

        const usuario = await pool.query("SELECT id_usuario FROM usuarios WHERE id_usuario = ? AND status = 1", [id]);
        if (usuario[0].length === 0) return res.status(404).json({ message: "El usuario no existe" });

        await pool.query("UPDATE usuarios SET status = 0 WHERE id_usuario = ?", [id]);
        res.json({ message: "Usuario eliminado" });

    } catch (error) {
        logger.error(`${error.message} - ${req.originalUrl} - ${req.method}`);
    }
}
