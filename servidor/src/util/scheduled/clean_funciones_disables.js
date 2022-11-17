import pool from "../../config/db.js"
import logger from "../../config/logger.js"

export const cleanFunciones = async () => {
    try {

        //Deshabilitamos las funciones que ya pasaron
        await pool.query("UPDATE funciones SET status = 0 WHERE hasta < ?", [new Date().toISOString().slice(0, 10)]);
        //Mensaje de log
        logger.info("Se han deshabilitado las funciones que ya pasaron de fecha");
        //Mensaje de consola
        console.log("Se han deshabilitado las funciones que ya pasaron de fecha");


    } catch (error) {
        logger.error(`${error.message} - cleanUsers - clean_disabled_users.js`)
        console.log(`Ocurrió un error en el servidor: ${error})`)
    }
}