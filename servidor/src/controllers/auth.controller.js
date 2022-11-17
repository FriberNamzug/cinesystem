import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../config/db.js";
import logger from "../config/logger.js";
import { authenticator } from 'otplib';
//import { sendWhatsappMessage } from "../config/whatsapp.js";
import { APP_NAME, OAUTH_NAME, JWT_SECRET } from "../config/config.js";

import QRCode from 'qrcode';
import { sendMail, activarCuenta, recuperarPasswordEmail } from "../config/email/index.js";

export const signIn = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ message: "Faltan campos" });

        /* Consultamos el usuario de la tabla usuario y su rol de la tabla rol_usuarios */
        const [usuario] = await pool.query("SELECT u.id_usuario, u.telefono, u.notificaciones, u.secret_oauth, u.email, u.password, u.id_rol, r.nombre FROM usuarios u INNER JOIN rol_usuarios r ON u.id_rol = r.id_rol WHERE email = ? AND u.status = 1", [email]);
        if (usuario.length === 0) return res.status(404).json({ message: "El usuario no existe" });

        const validPassword = await bcrypt.compare(password, usuario[0].password);
        if (!validPassword) return res.status(401).json({ message: "Contraseña incorrecta" });

        //verificamos si el usuario tiene activado el 2FA
        if (usuario[0].secret_oauth === null) {
            const token = jwt.sign({ id: usuario[0].id_usuario, rol: usuario[0].nombre, login: true }, JWT_SECRET, {
                expiresIn: 86400 * 2, // 2 days
            });

            if (usuario[0].notificaciones === 1) {
                const mensaje = "Se ha iniciado sesión en tu cuenta de " + APP_NAME + " desde una nueva ubicación. Si no has sido tú, por favor cambia tu contraseña.";
                //await sendWhatsappMessage("+521" + usuario[0].telefono, mensaje);
            }

            return res.json({ token, "twofa": false });
        } else {
            const token = jwt.sign({ id: usuario[0].id_usuario, rol: null, login: false }, JWT_SECRET, {
                expiresIn: 60 * 25,// 25 minutes
            });
            res.json({ token, "twofa": true });
        }

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
        if (!/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(email)) return res.status(400).json({ message: "El email no es válido" });
        if (!nombre.match(/^[a-zA-ZÀ-ÿ\s]{1,40}$/)) return res.status(400).json({ message: "El nombre no es válido" });
        if (nombre.length > 45 || email.length > 45) return res.status(400).json({ message: "El nombre o el email no pueden tener más de 45 caracteres" });
        if (!password.length >= 8) return res.status(400).json({ message: "La contraseña debe tener al menos 8 caracteres" });
        if (!password.match(/[A-Z]/)) return res.status(400).json({ message: "La contraseña debe tener al menos una letra mayúscula" });
        if (!password.match(/[a-z]/)) return res.status(400).json({ message: "La contraseña debe tener al menos una letra minúscula" });
        if (!password.match(/[0-9]/)) return res.status(400).json({ message: "La contraseña debe tener al menos un número" });
        if (!password.match(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/)) return res.status(400).json({ message: "La contraseña debe tener al menos un caracter especial" });
        if (/([0-9])\1{2}/.test(password)) return res.status(400).json({ message: "La contraseña no puede tener 3 números seguidos" });
        if (/([a-zA-Z])\1{2}/.test(password)) return res.status(400).json({ message: "La contraseña no puede tener 3 letras seguidas" });

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
        sendMail(req, email, "Activar cuenta", html);

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
            if (err) return false
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

        const tokenUrl = user[0].token_email.replace(/\./g, "-");
        const html = activarCuenta(user[0].nombre, tokenUrl);
        sendMail(req, email, "Activar cuenta", html);

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
        sendMail(req, email, "Recuperar contraseña", html);

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
        if (!password.length >= 8) return res.status(400).json({ message: "La contraseña debe tener al menos 8 caracteres" });
        if (!password.match(/[A-Z]/)) return res.status(400).json({ message: "La contraseña debe tener al menos una letra mayúscula" });
        if (!password.match(/[a-z]/)) return res.status(400).json({ message: "La contraseña debe tener al menos una letra minúscula" });
        if (!password.match(/[0-9]/)) return res.status(400).json({ message: "La contraseña debe tener al menos un número" });
        if (!password.match(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/)) return res.status(400).json({ message: "La contraseña debe tener al menos un caracter especial" });
        if (/([0-9])\1{2}/.test(password)) return res.status(400).json({ message: "La contraseña no puede tener 3 números seguidos" });
        if (/([a-zA-Z])\1{2}/.test(password)) return res.status(400).json({ message: "La contraseña no puede tener 3 letras seguidas" });

        const decoded = jwt.verify(token, JWT_SECRET, (err, decoded) => {
            if (err) return false;
            return decoded;
        })

        if (!decoded) return res.status(400).json({ message: "El token no es válido" });
        /* Select de id_usuario, nombre si el email es igual al email, si tiene status 1 y si el token_password coincide */


        const [user] = await pool.query("SELECT id_usuario,token_password FROM usuarios WHERE id_usuario = ? AND status = 1", [decoded.id]);
        if (user.length === 0) return res.status(400).json({ message: "El usuario no existe" });
        if (user[0].token_password === null) return res.status(400).json({ message: "El usuario ya ha cambiado su contraseña" });
        if (user[0].token_password !== token) return res.status(400).json({ message: "El token no es válido" });

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
            data: {
                permissions: req.user.rol,
            }
        })
    }
    catch (error) {
        res.status(500).json({ message: error.message });
        logger.error(`${error.message} - ${req.originalUrl} - ${req.method}`);
    }
}


export const crear2FA = async (req, res) => {
    try {
        const { id } = req.user;
        const { password } = req.body;
        /* Buscamos al usuario para validar que no tenga un secret_oauth */
        const [user] = await pool.query("SELECT email, password, secret_oauth FROM usuarios WHERE id_usuario = ?", [id]);
        if (user.length === 0) return res.status(400).json({ message: "El usuario no existe" });
        if (user[0].secret_oauth !== null) return res.status(400).json({ message: "El usuario ya tiene activado el 2FA" });

        const validPassword = await bcrypt.compare(password, user[0].password);
        if (!validPassword) return res.status(400).json({ message: "La contraseña no es correcta" });

        const secret = authenticator.generateSecret();
        const url = authenticator.keyuri(user[0].email, OAUTH_NAME, secret);
        const qr = await QRCode.toDataURL(url);
        await pool.query("UPDATE usuarios SET secret_oauth = ?, two_factor = 1 WHERE id_usuario = ?", [secret, id]);
        res.json({ qr });

    } catch (error) {
        logger.error(`${error.message} - ${req.originalUrl} - ${req.method}`);
        res.status(500).json({ message: "Error interno del servidor" });
    }
}



export const eliminar2FA = async (req, res) => {
    try {
        const { id } = req.user;
        const { password } = req.body;
        /* Verificamos que el usuario tenga un secret_oauth a eliminar */
        const [user] = await pool.query("SELECT secret_oauth,password FROM usuarios WHERE id_usuario = ?", [id]);
        if (user.length === 0) return res.status(400).json({ message: "El usuario no existe" });
        if (user[0].secret_oauth === null) return res.status(400).json({ message: "El usuario no tiene activado el 2FA" });

        const validPassword = await bcrypt.compare(password, user[0].password);
        if (!validPassword) return res.status(400).json({ message: "La contraseña no es correcta" });

        await pool.query("UPDATE usuarios SET secret_oauth = NULL, two_factor = 0 WHERE id_usuario = ?", [id]);
        res.status(200).json({ message: "Código de seguridad eliminado" });

    } catch (error) {
        logger.error(`${error.message} - ${req.originalUrl} - ${req.method}`);
        res.status(500).json({ message: "Error interno del servidor" });
    }
}


export const verificar2FA = async (req, res) => {
    try {
        const { token } = req.body;

        const accessToken = req.headers['x-access-token'] || req.headers['authorization']

        if (!accessToken) return res.status(401).json({ message: 'No tienes autorización para estar aquí' })

        const jwtCode = accessToken.split(' ')[1]

        const verify = jwt.verify(jwtCode, JWT_SECRET, (err, user) => {
            if (err) return false
            return user
        })
        console.log(verify);
        if (!verify) return res.status(401).json({ message: 'No tienes autorización para estar aquí' })


        const [usuario] = await pool.query("SELECT u.id_usuario,u.notificaciones,u.telefono, u.secret_oauth, u.email, u.password, u.id_rol, r.nombre FROM usuarios u INNER JOIN rol_usuarios r ON u.id_rol = r.id_rol WHERE id_usuario = ? AND u.status = 1", [verify.id]);

        if (usuario[0].secret_oauth === null) return res.status(400).json({ message: "No se ha creado el código de seguridad" });

        const verified = authenticator.verify({ token, secret: usuario[0].secret_oauth });

        if (verified) {
            const token = jwt.sign({ id: usuario[0].id_usuario, rol: usuario[0].nombre, login: true }, JWT_SECRET, {
                expiresIn: 86400 * 2, // 2 days
            });

            if (usuario[0].notificaciones === 1) {
                const mensaje = "Se ha iniciado sesión en tu cuenta de " + APP_NAME + " desde una nueva ubicación. Si no has sido tú, por favor cambia tu contraseña.";
                //await sendWhatsappMessage("+521" + usuario[0].telefono, mensaje);
            }

            return res.json({ message: "Codigo correcto", token, twofa: true });
        } else {
            return res.status(400).json({ message: "Código incorrecto" });
        }

    } catch (error) {
        logger.error(`${error.message} - ${req.originalUrl} - ${req.method}`);
        return res.status(500).json({ message: "Error interno del servidor" });
    }
}