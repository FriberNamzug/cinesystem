import jwt from 'jsonwebtoken'
import pool from '../config/db.js'
import logger from '../config/logger.js'
import { JWT_SECRET } from '../config/config.js'

export const verifyToken = async (req, res, next) => {

    try {
        const accessToken = req.headers['x-access-token'] || req.headers['authorization']
        if (!accessToken) return res.status(401).json({ message: 'No tienes autorización para estar aquí' })
        const token = accessToken.split(' ')[1]
        jwt.verify(token, JWT_SECRET, (err, user) => {
            if (err) return res.status(401).json({ message: 'El token de acceso no es válido' })
            if (!user.login) return res.status(401).json({ message: 'El login no es válido' })
            req.user = user
        })
        const response = await pool.query("SELECT id_usuario FROM usuarios WHERE id_usuario = ? AND status = 1", [req.user.id])
        if (response[0].length === 0) return res.status(404).json({ message: 'El usuario no existe' })
        next()
    } catch (error) {
        console.log(`Ocurrió un error en el servidor: ${error})`)
        logger.error(`${error.message} - ${req.originalUrl} - ${req.method}`)
    }
}

export default verifyToken