import logger from "../config/logger.js";
import pool from "../config/db.js";


export const uploadImage = async (req, res) => {
    try {
        const { type, id } = req.params;
        const { path } = req.file;

        let url = path.split("public")[1];
        url = url.replace(/\\/g, "/");


        if (type === "p") {
            const resultado = await pool.query(`UPDATE peliculas SET imagen = ? WHERE id_pelicula = ?`, [url, id], (error) => {
                if (error) return res.status(500).json({ message: 'Error en la base de datos' })
            })

            if (resultado[0].affectedRows === 0) return res.status(400).json({ message: 'No se ha podido actualizar el registro en la base de datos' })
        }
        if (type === "a") {
            const resultado = await pool.query(`UPDATE actores SET imagen = ? WHERE id_actor = ?`, [url, id], (error) => {
                if (error) return res.status(500).json({ message: 'Error en la base de datos' })
            })
            if (resultado[0].affectedRows === 0) return res.status(400).json({ message: 'No se ha podido actualizar el registro en la base de datos' })
        }



        res.status(200).json({
            message: "Carga exitosa",
            url
        })

    } catch (error) {
        logger.error(`Error en el controlador uploadImagePelicula: ${error}`)
        res.status(500).json({ message: "Error al cargar la imagen" })
    }
}

export const getImages = async (req, res) => {
    try {
        const { type, id } = req.params;

        if (type !== "p" && type !== "a") return res.status(400).json({ message: "Parámetros no válidos" })

        /* Obtenemos el nombre */
        const name = await pool.query(`SELECT * FROM ${type === "p" ? "peliculas" : "actores"} WHERE ${type === "p" ? "id_pelicula" : "id_actor"} = ?`, [id], (error) => {
            if (error) return res.status(500).json({ message: 'Error en la base de datos' })
        })

        if (name[0].length === 0) return res.status(400).json({ message: 'No se ha encontrado el registro' })

        const resultado = await pool.query(`SELECT imagen FROM ${type === "p" ? "peliculas" : "actores"} WHERE ${type === "p" ? "id_pelicula" : "id_actor"} = ?`, [id], (error) => {
            if (error) return res.status(500).json({ message: 'Error en la base de datos' })
        })
        if (resultado[0].length === 0) return res.status(400).json({ message: 'No se ha encontrado la imagen' })


        res.status(200).json({
            message: "Imagen encontrada",
            name: type === "p" ? name[0][0].titulo : name[0][0].nombre,
            url: resultado[0]
        })


    } catch (error) {
        logger.error(`Error en el controlador getImage: ${error}`)
        res.status(500).json({ message: "Error al obtener la imagen" })
    }
}
