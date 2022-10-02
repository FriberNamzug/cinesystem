import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../config/db.js";
import logger from "../config/logger.js";
import { sendMail, activarCuenta, recuperarPasswordEmail } from "../config/email/index.js";

import {
    JWT_SECRET,
    JWT_EXPIRESIN
} from "../config/config.js";

export const signIn = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ message: "Faltan campos" });

        /* Consultamos el usuario de la tabla usuario y su rol de la tabla rol_usuarios */
        const [usuario] = await pool.query("SELECT u.id_usuario, u.email, u.password, u.id_rol, r.nombre FROM usuarios u INNER JOIN rol_usuarios r ON u.id_rol = r.id_rol WHERE email = ? AND u.status = 1", [email]);
        if (usuario.length === 0) return res.status(404).json({ message: "El usuario no existe" });

        const validPassword = await bcrypt.compare(password, usuario[0].password);
        if (!validPassword) return res.status(401).json({ message: "Contraseña incorrecta" });

        const token = jwt.sign({ id: usuario[0].id_usuario, rol: usuario[0].nombre }, JWT_SECRET, {
            expiresIn: 86400 * 2, // 2 days
        });


        res.json({ token });

    } catch (error) {
        res.status(500).json({ message: "Error interno del servidor" });
        logger.error(`${error.message} - ${req.originalUrl} - ${req.method}`);
    }
}

export const signUp = async (req, res) => {
    try {
        const { nombre, email, password } = req.body;
        //Validaciones de los datos que se traen
        if (!nombre || !email || !password) return res.status(400).json({ message: "Por favor, ingrese todos los campos" });
        if (!email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)) return res.status(400).json({ message: "El email no es válido" });
        if (!nombre.match(/^[a-zA-ZÀ-ÿ\s]{1,40}$/)) return res.status(400).json({ message: "El nombre no es válido" });
        if (nombre.length > 45 || email.length > 45) return res.status(400).json({ message: "El nombre o el email no pueden tener más de 45 caracteres" });
        if (!password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/)) return res.status(400).json({ msg: "La contraseña debe tener al menos 6 caracteres, una letra mayúscula, un carácter especial y un número" });
        const user = await pool.query("SELECT email FROM usuarios WHERE email = ? AND status = 1", [email]);
        if (user[0].length > 0) return res.status(400).json({ message: "El usuario ya se encuentra registrado" });
        const userExistente = await pool.query("SELECT email FROM usuarios WHERE email = ? AND status = 0", [email]);
        if (userExistente[0].length > 0) return res.status(400).json({ message: "El usuario ya se encuentra registrado, pero no ha activado su cuenta", status: 0 });

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const [newUser] = await pool.query("INSERT INTO usuarios (nombre, email, password) VALUES (?, ?, ?) ", [nombre, email, passwordHash]);

        const token = jwt.sign({ id: newUser.insertId }, JWT_SECRET, {
            expiresIn: 60 * 25 // 25 minutes
        });

        await pool.query("UPDATE usuarios SET token_email = ? WHERE id_usuario = ?", [token, newUser.insertId]);

        const html = activarCuenta(nombre, token);
        sendMail(req, process.env.MAILER_USER, email, "Activar cuenta", html);

        res.json({
            message: "Usuario registrado correctamente, por favor verifique su email para activar su cuenta, si no lo encuentra en su bandeja de entrada, revise su bandeja de spam, tienes 25 minutos para activar tu cuenta, de lo contrario deberás registrarte nuevamente",
            user: {
                id: newUser.insertId,
                nombre,
                email
            }
        });

    } catch (error) {
        res.status(500).json({ message: "Error interno del servidor" });
        logger.error(`${error.message} - ${req.originalUrl} - ${req.method}`);
    }
}

export const validateEmail = async (req, res) => {
    try {
        const { token } = req.params;
        if (!token) return res.status(400).json({ message: "No se ha enviado el token" });

        const decoded = jwt.verify(token, JWT_SECRET, (err, decoded) => {
            if (err) return false;
            return decoded;
        });

        if (!decoded) return res.status(400).json({ message: "El token no es válido" });

        const [user] = await pool.query("SELECT id_usuario FROM usuarios WHERE id_usuario = ? AND status = 1", [decoded.id]);
        if (user.length > 0) return res.status(400).json({ message: "El usuario ya ha activado su cuenta" });

        const response = await pool.query("UPDATE usuarios SET status = 1, token_email = null WHERE id_usuario = ?", [decoded.id]);
        if (response[0].affectedRows === 0) return res.status(400).json({ message: "No se ha podido activar la cuenta" });

        res.status(200).json({ message: "Cuenta activada correctamente" });

    } catch (error) {
        logger.error(`${error.message} - ${req.originalUrl} - ${req.method}`);
        res.status(500).json({
            message: "Ha ocurrido un error interno del servidor"
        });
    }
}

export const reenviarEmail = async (req, res) => {
    try {
        const { email } = req.params;
        if (!email) return res.status(400).json({ message: "No se ha enviado el email" });

        const [user] = await pool.query("SELECT token_email, nombre FROM usuarios WHERE email = ? ", [email]);
        if (user.length === 0) return res.status(400).json({ message: "El usuario no existe" });
        if (user[0].token_email === null) return res.status(400).json({ message: "El usuario ya ha activado su cuenta" });

        const html = activarCuenta(user[0].nombre, user[0].token_email);
        sendMail(req, process.env.MAILER_USER, email, "Activar cuenta", html);

        res.status(200).json({ message: "Email enviado correctamente" });

    } catch (error) {
        res.status(500).json({ message: "Ha ocurrido un error interno del servidor" });
        logger.error(`${error.message} - ${req.originalUrl} - ${req.method}`);
    }
}

export const recuperarPassword = async (req, res) => {
    try {
        const { email } = req.params;
        if (!email) return res.status(400).json({ message: "No se ha enviado el email" });

        const [user] = await pool.query("SELECT id_usuario, nombre FROM usuarios WHERE email = ? AND status = 1", [email]);
        if (user.length === 0) return res.status(400).json({ message: "El usuario no existe" });

        const token = jwt.sign({ id: user[0].id_usuario }, JWT_SECRET, {
            expiresIn: 60 * 25 // 25 minutes
        });

        const response = await pool.query("UPDATE usuarios SET token_password = ? WHERE id_usuario = ?", [token, user[0].id_usuario]);
        if (response[0].affectedRows === 0) return res.status(400).json({ message: "No se ha podido enviar el email" });

        const html = recuperarPasswordEmail(user[0].nombre, token);
        sendMail(req, process.env.MAILER_USER, email, "Recuperar contraseña", html);

        res.status(200).json({ message: "Email enviado correctamente" });


    } catch (error) {
        res.status(500).json({ message: "Ha ocurrido un error interno del servidor" });
        logger.error(`${error.message} - ${req.originalUrl} - ${req.method}`);
    }
}

export const cambiarPassword = async (req, res) => {
    try {

        const { password } = req.body;
        const { token } = req.params;

        if (!password) return res.status(400).json({ message: "No se ha enviado la contraseña" });
        if (!token) return res.status(400).json({ message: "No se ha enviado el token" });
        if (!password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/)) return res.status(400).json({ msg: "La contraseña debe tener al menos 6 caracteres, una letra mayúscula, un carácter especial y un número" });

        const decoded = jwt.verify(token, JWT_SECRET, (err, decoded) => {
            if (err) return false;
            return decoded;
        })

        if (!decoded) return res.status(400).json({ message: "El token no es válido" });
        /* Select de id_usuario, nombre si el email es igual al email, si tiene status 1 y si el token_password coincide */


        const [user] = await pool.query("SELECT id_usuario,token_password FROM usuarios WHERE id_usuario = ? AND status = 1", [decoded.id]);
        if (user.length === 0) return res.status(400).json({ message: "El usuario no existe" });
        if (user[0].token_password === null) return res.status(400).json({ message: "El usuario ya ha cambiado su contraseña" });
        if(user[0].token_password !== token) return res.status(400).json({ message: "El token no es válido" });

        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        const response = await pool.query("UPDATE usuarios SET password = ?, token_password = null WHERE id_usuario = ?", [hashPassword, decoded.id]);
        if (response[0].affectedRows === 0) return res.status(400).json({ message: "No se ha podido cambiar la contraseña" });

        res.status(200).json({ message: "Contraseña cambiada correctamente" });

    } catch (error) {
        res.status(500).json({ message: "Ha ocurrido un error interno del servidor" });
        logger.error(`${error.message} - ${req.originalUrl} - ${req.method}`);
    }
}

export const verifyToken = async (req, res) => {
    try {
        console.log(req.user);
        res.status(200).json({
            message: "Token valido",
        })
    }
    catch (error) {
        res.status(500).json({ message: error.message });
        logger.error(`${error.message} - ${req.originalUrl} - ${req.method}`);
    }
}