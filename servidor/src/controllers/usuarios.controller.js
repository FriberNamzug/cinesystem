import logger from "../config/logger.js";
import pool from "../config/db.js";
import bcrypt from "bcryptjs";

export const getUsuario = async (req, res) => {
    try {
        const { id } = req.user;
        const response = await pool.query("SELECT nombre, email, notificaciones, telefono, two_factor FROM usuarios WHERE id_usuario = ?", [id]);
        res.status(200).json({
            nombre: response[0][0].nombre,
            email: response[0][0].email,
            notificaciones: response[0][0].notificaciones,
            telefono: response[0][0].telefono,
            twoFactor: response[0][0].two_factor
        });
    } catch (error) {
        logger.error(`${error.message} - ${req.originalUrl} - ${req.method}`);
        res.status(500).json({ message: "Error interno del servidor" });
    }
}

export const updateUsuario = async (req, res) => {
    try {
        const { id } = req.user;
        const { nombre, email, telefono } = req.body;

        if (!nombre || !email) return res.status(400).json({ message: "Faltan campos" });
        if (nombre.length > 45 || email.length > 45) return res.status(400).json({ message: "El nombre o el email no pueden tener más de 45 caracteres" });
        if (!email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)) return res.status(400).json({ message: "El email no es válido" });
        if (!nombre.match(/^[a-zA-ZÀ-ÿ\s]{1,40}$/)) return res.status(400).json({ message: "El nombre no es válido" });

        //Si el telefono no es null, comprobar que es un numero de telefono valido (10 digitos)
        if (telefono && !telefono.match(/^[0-9]{10}$/)) return res.status(400).json({ message: "El teléfono no es válido" });


        const usuario = await pool.query("SELECT id_usuario FROM usuarios WHERE id_usuario = ? AND status = 1", [id]);
        if (usuario[0].length === 0) return res.status(404).json({ message: "El usuario no existe" });

        const usuarioActual = await pool.query("SELECT nombre, email, telefono FROM usuarios WHERE id_usuario = ?", [id]);
        if (usuarioActual[0][0].nombre === nombre && usuarioActual[0][0].email === email && usuarioActual[0][0].telefono === telefono) return res.status(400).json({ message: "No hay cambios" });

        if (usuarioActual[0][0].email !== email) {
            const emailExistente = await pool.query("SELECT email FROM usuarios WHERE email = ? AND status = 1", [email]);
            if (emailExistente[0].length > 0) return res.status(400).json({ message: "El email ya esta registrado" });
        }

        await pool.query("UPDATE usuarios SET nombre = ?, email = ?, telefono = ? WHERE id_usuario = ?", [nombre, email, telefono, id]);
        res.json({
            message: "Usuario actualizado",
            usuario: {
                id,
                nombre,
                email,
                telefono
            }
        });

    } catch (error) {
        logger.error(`${error.message} - ${req.originalUrl} - ${req.method}`);
        res.status(500).json({ message: "Error interno del servidor" });
    }
}

export const deleteUsuario = async (req, res) => {
    try {
        const { id } = req.user;

        const usuario = await pool.query("SELECT id_usuario FROM usuarios WHERE id_usuario = ? AND status = 1", [id]);
        if (usuario[0].length === 0) return res.status(404).json({ message: "El usuario no existe" });

        await pool.query("UPDATE usuarios SET status = 0 WHERE id_usuario = ?", [id]);
        res.json({ message: "Usuario eliminado" });

    } catch (error) {
        logger.error(`${error.message} - ${req.originalUrl} - ${req.method}`);
        res.status(500).json({ message: "Error interno del servidor" });
    }
}

export const updateNotificaciones = async (req, res) => {
    try {
        const { id } = req.user;
        const { notificaciones } = req.body;

        if (notificaciones === undefined) return res.status(400).json({ message: "Faltan campos" });
        if (notificaciones !== 0 && notificaciones !== 1) return res.status(400).json({ message: "El valor de notificaciones no es válido" });

        const usuario = await pool.query("SELECT id_usuario, notificaciones, telefono FROM usuarios WHERE id_usuario = ? AND status = 1", [id]);
        if (usuario[0].length === 0) return res.status(404).json({ message: "El usuario no existe" });
        if (usuario[0][0].notificaciones === notificaciones) return res.status(400).json({ message: "No hay cambios" });
        if (notificaciones === 1 && !usuario[0][0].telefono) return res.status(400).json({ message: "No se puede activar las notificaciones sin un número de teléfono" });

        await pool.query("UPDATE usuarios SET notificaciones = ? WHERE id_usuario = ?", [notificaciones, id]);

        res.json({
            message: "Notificaciones actualizadas",
            notificaciones: notificaciones
        });

    } catch (error) {
        logger.error(`${error.message} - ${req.originalUrl} - ${req.method}`);
        res.status(500).json({ message: "Error interno del servidor" });
    }
}

export const updatePassword = async (req, res) => {
    try {
        const { id } = req.user;
        const { password, newPassword } = req.body;

        if (!password || !newPassword) return res.status(400).json({ message: "Faltan campos" });
        if (password.length > 45 || newPassword.length > 45) return res.status(400).json({ message: "La contraseña no puede tener más de 45 caracteres" });

        const usuario = await pool.query("SELECT id_usuario, password FROM usuarios WHERE id_usuario = ? AND status = 1", [id]);
        if (usuario[0].length === 0) return res.status(404).json({ message: "El usuario no existe" });
        if (!bcrypt.compareSync(password, usuario[0][0].password)) return res.status(400).json({ message: "La contraseña es incorrecta" });

        if (!password.length >= 8) return res.status(400).json({ message: "La contraseña debe tener al menos 8 caracteres" });
        if (!password.match(/[A-Z]/)) return res.status(400).json({ message: "La contraseña debe tener al menos una letra mayúscula" });
        if (!password.match(/[a-z]/)) return res.status(400).json({ message: "La contraseña debe tener al menos una letra minúscula" });
        if (!password.match(/[0-9]/)) return res.status(400).json({ message: "La contraseña debe tener al menos un número" });
        if (!password.match(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/)) return res.status(400).json({ message: "La contraseña debe tener al menos un caracter especial" });
        if (/([0-9])\1{2}/.test(password)) return res.status(400).json({ message: "La contraseña no puede tener 3 números seguidos" });
        if (/([a-zA-Z])\1{2}/.test(password)) return res.status(400).json({ message: "La contraseña no puede tener 3 letras seguidas" });

        const salt = bcrypt.genSaltSync();
        const hash = bcrypt.hashSync(newPassword, salt);

        await pool.query("UPDATE usuarios SET password = ? WHERE id_usuario = ?", [hash, id]);

        res.json({ message: "Contraseña actualizada" });

    } catch (error) {
        logger.error(`${error.message} - ${req.originalUrl} - ${req.method}`);
        res.status(500).json({ message: "Error interno del servidor" });
    }
}


/* Funciones de administrador */

export const getUsuariosA = async (req, res) => {
    try {
        const [usuarios] = await pool.query("SELECT u.id_usuario, u.nombre, u.email, u.telefono, r.nombre AS nombre_rol, r.id_rol FROM usuarios u INNER JOIN rol_usuarios r ON u.id_rol = r.id_rol WHERE u.status = 1");
        if (usuarios.length === 0) return res.status(404).json({ message: "No hay usuarios" });
        res.json(usuarios);
    } catch (error) {
        logger.error(`${error.message} - ${req.originalUrl} - ${req.method}`);
        res.status(500).json({ message: "Error interno del servidor" });
    }
}

export const getUsuarioA = async (req, res) => {
    try {
        const { id } = req.params;

        const usuario = await pool.query("SELECT * FROM usuarios WHERE id_usuario = ? AND status = 1", [id]);
        if (usuario[0].length === 0) return res.status(404).json({ message: "El usuario no existe" });
        res.json(usuario[0]);
    } catch (error) {
        logger.error(`${error.message} - ${req.originalUrl} - ${req.method}`);
        res.status(500).json({ message: "Error interno del servidor" });
    }
}

export const updateUsuarioA = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, email, rol } = req.body;

        if (id == req.user.id) return res.status(400).json({ message: "No puedes actualizar tu propio usuario" });
        if (!nombre || !email || !rol) return res.status(400).json({ message: "Faltan campos" });
        if (nombre.length > 45 || email.length > 45) return res.status(400).json({ message: "El nombre o el email no pueden tener más de 45 caracteres" });
        if (!email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)) return res.status(400).json({ message: "El email no es válido" });
        if (!nombre.match(/^[a-zA-ZÀ-ÿ\s]{1,40}$/)) return res.status(400).json({ message: "El nombre no es válido" });

        const [usuario] = await pool.query("SELECT id_usuario, nombre, email, id_rol FROM usuarios WHERE id_usuario = ? AND status = 1", [id]);
        if (usuario.length === 0) return res.status(404).json({ message: "El usuario no existe" });

        if (usuario[0].nombre === nombre && usuario[0].email === email && usuario[0].id_rol === Number(rol)) return res.status(400).json({ message: "No hay cambios" });

        if (usuario[0].email !== email) {
            const emailExistente = await pool.query("SELECT email FROM usuarios WHERE email = ? AND status = 1", [email]);
            if (emailExistente[0].length > 0) return res.status(400).json({ message: "El email ya esta registrado" });
        }

        await pool.query("UPDATE usuarios SET nombre = ?, email = ?, id_rol = ? WHERE id_usuario = ?", [nombre, email, rol, id]);
        res.json({
            message: "Usuario actualizado",
            usuario: {
                id,
                nombre,
                email,
                rol
            }
        });

    } catch (error) {
        logger.error(`${error.message} - ${req.originalUrl} - ${req.method}`);
        res.status(500).json({ message: "Error interno del servidor" });
    }
}

export const deleteUsuarioA = async (req, res) => {
    try {
        const { id } = req.params;

        const [usuario] = await pool.query("SELECT id_usuario, id_rol FROM usuarios WHERE id_usuario = ? AND status = 1", [id]);
        if (usuario.length === 0) return res.status(404).json({ message: "El usuario no existe" });
        if (usuario[0].id_rol === 1) return res.status(400).json({ message: "No puedes eliminar al administrador" });

        await pool.query("UPDATE usuarios SET status = 0 WHERE id_usuario = ?", [id]);
        res.json({ message: "Usuario eliminado" });

    } catch (error) {
        logger.error(`${error.message} - ${req.originalUrl} - ${req.method}`);
        res.status(500).json({ message: "Error interno del servidor" });
    }
}

export const createUsuarioA = async (req, res) => {
    try {
        const { nombre, email, password, rol } = req.body;

        if (!nombre || !email || !password || !rol) return res.status(400).json({ message: "Por favor, ingrese todos los campos" });
        if (!email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)) return res.status(400).json({ message: "El email no es válido" });
        if (!nombre.match(/^[a-zA-ZÀ-ÿ\s]{1,40}$/)) return res.status(400).json({ message: "El nombre no es válido" });
        if (nombre.length > 45 || email.length > 45) return res.status(400).json({ message: "El nombre o el email no pueden tener más de 45 caracteres" });
        if (!password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/)) return res.status(400).json({ message: "La contraseña debe tener al menos 6 caracteres, una letra mayúscula, un carácter especial y un número" });
        if (isNaN(rol)) return res.status(400).json({ message: "El rol no es válido" });
        const user = await pool.query("SELECT email FROM usuarios WHERE email = ?", [email]);
        if (user[0].length > 0) return res.status(400).json({ message: "Ya existe un usuario con el email ingresado" });

        //Encriptar la contraseña
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        //Comprobamos los roles que existen en la base de datos
        const [roles] = await pool.query("SELECT id_rol FROM rol_usuarios");
        if (roles.length === 0) return res.status(400).json({ message: "No hay roles disponibles" });
        console.log(roles);
        console.log(rol)
        const rolExistente = roles.find(r => r.id_rol === Number(rol));
        if (!rolExistente) return res.status(400).json({ message: "El rol no existe" });
        const [newUser] = await pool.query("INSERT INTO usuarios (nombre, email, password, id_rol, status) VALUES (?, ?, ?, ?, 1) ", [nombre, email, passwordHash, rol]);

        res.json({
            message: "Usuario creado",
            user: {
                id: newUser.insertId,
                nombre,
                email
            },
        });

    } catch (error) {
        res.status(500).json({ message: "Error interno del servidor" });
        logger.error(`${error.message} - ${req.originalUrl} - ${req.method}`);
    }
}