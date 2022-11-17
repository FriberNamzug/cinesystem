import pool from "../../config/db.js"
import logger from "../../config/logger.js"
import jwt from "jsonwebtoken"
import { JWT_SECRET } from "../../config/config.js"

export const cleanUsers = async () => {
    try {
        
        const [users] = await pool.query("SELECT * FROM usuarios WHERE token_email IS NOT NULL")

        //Iteramos sobre cada usuario para verificar si el token es valido
        for (const user of users) {
            const token = user.token_email
            jwt.verify(token, JWT_SECRET, (err, decoded) => {
                if (err) {
                    logger.error(err)
                    pool.query("DELETE FROM usuarios WHERE id_usuario = ?", [user.id_usuario])
                }
            })
        }

    } catch (error) {
        logger.error(`${error.message} - cleanUsers - clean_disabled_users.js`)
        console.log(`Ocurrió un error en el servidor: ${error})`)
    }
}