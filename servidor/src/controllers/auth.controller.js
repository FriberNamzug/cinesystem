import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../config/db.js";
import logger from "../config/logger.js";
import {
    JWT_SECRET,
    JWT_EXPIRESIN
} from "../config/config.js";

export const signIn = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ message: "Faltan campos" });

        const [user] = await pool.query("SELECT * FROM usuarios WHERE email = ?", [email]);
        if (user.length === 0) return res.status(400).json({ message: "El usuario no existe" });

        const validPassword = await bcrypt.compare(password, user[0].password);
        if (!validPassword) return res.status(401).json({ message: "Contraseña incorrecta" });

        const token = jwt.sign({ id: user[0].id_usuario }, JWT_SECRET, {
            expiresIn: 86400 * 2, // 2 days
        });


        res.json({ token });

    } catch (error) {
        res.status(500).json({ message: error.message });
        logger.error(`${error.message} - ${req.originalUrl} - ${req.method}`);
    }
}

export const signUp = async (req, res) => {
    try {
        const { nombre, email, password } = req.body;
        //Validaciones de los datos que se traen
        if (!nombre || !email || !password) return res.status(400).json({ msg: "Por favor, ingrese todos los campos" });
        if (!email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)) return res.status(400).json({ message: "El email no es válido" });
        if (!nombre.match(/^[a-zA-ZÀ-ÿ\s]{1,40}$/)) return res.status(400).json({ message: "El nombre no es válido" });
        if (nombre.length > 45 || email.length > 45) return res.status(400).json({ msg: "El nombre o el email no pueden tener más de 45 caracteres" });
        if (!password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/)) return res.status(400).json({ msg: "La contraseña debe tener al menos 6 caracteres, una letra mayúscula, un carácter especial y un número" });
        const user = await pool.query("SELECT email FROM usuarios WHERE email = ?", [email]);
        if (user[0].length > 0) return res.status(400).json({ msg: "El usuario ya existe" });

        //Encriptar la contraseña
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        //Tenemos que guardar el usuario anteriormente validado en la db
        const [newUser] = await pool.query("INSERT INTO usuarios (nombre, email, password) VALUES (?, ?, ?) ", [nombre, email, passwordHash]);

        const token = jwt.sign({ id: newUser.insertId }, JWT_SECRET, {
            expiresIn: 86400 * 2, // 2 days
        });

        res.json({
            token,
            user: {
                id: newUser.insertId,
                nombre,
                email
            }
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
        logger.error(`${error.message} - ${req.originalUrl} - ${req.method}`);
    }
}

export const verifyToken = async (req, res) => {
    try {
        const { id } = req.user
        res.status(200).json({
            message: "Token valido",
            id
        })
    }
    catch (error) {
        res.status(500).json({ message: error.message });
        logger.error(`${error.message} - ${req.originalUrl} - ${req.method}`);
    }
}