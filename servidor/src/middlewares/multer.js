import multer from 'multer'
import logger from '../config/logger.js';
import fs from 'fs'
import pool from '../config/db.js';


export const upload = async (req, res, next) => {

    const upload = multer({

        storage: multer.diskStorage({
            destination: async function (req, file, callback) {
                try {
                    const { type, id } = req.params;
                    let path;
                    if (type !== 'p' && type !== 'a') return res.status(400).json({ message: 'Parámetros inválidos' })


                    if (type === 'p') {
                        const resultado = await pool.query("SELECT * FROM peliculas WHERE id_pelicula = ?", [id], (err) => {
                            if (err) return res.status(500).json({ message: 'Error en la base de datos' })
                        })
                        if (resultado[0].length === 0) return res.status(400).json({ message: 'No existe la película' })
                        path = `./src/public/image/peliculas/${id}/`;
                    }
                    if (type === 'a') {
                        const resultado = await pool.query("SELECT * FROM actores WHERE id_actor = ?", [id], (error) => {
                            if (error) return res.status(500).json({ message: 'Error en la base de datos' })
                        })
                        if (resultado[0].length === 0) return res.status(400).json({ message: 'No existe el actor' })
                        path = `./src/public/image/actores/${id}/`;
                    }


                    /* Si no existe el directorio lo crea */
                    if (!fs.existsSync(path)) {
                        fs.mkdirSync(path, { recursive: true })
                        callback(null, path);
                    }


                    callback(null, path)

                } catch (error) {
                    logger.error(error)
                    return console.log(error)
                }
            },

            filename: function (req, file, callback) {
                try {
                    const { id } = req.params;
                    const fileName = `${file.originalname.split('.')[0]}-${id}.${file.originalname.split(".")[1]}`
                    callback(null, fileName)
                } catch (error) {
                    logger.error(error)
                    return console.log(error)
                }
            }
        }),
        fileFilter: (req, file, callback) => {
            const acceptFile = ["image/jpeg", "image/png", "image/gif", "image/webp", "image/svg+xml", "image/jpg"]

            if (acceptFile.includes(file.mimetype)) {
                callback(null, true)
            } else {
                callback(new Error("El archivo no es una imagen"), false)
            }

        },
        limits: {
            fileSize: 1024 * 1024 * 5, // 5MB
            fields: 1,
            files: 1,
            parts: 2,
            headerParts: 1,
            headerFields: 1,
        }

    }).single('image');

    upload(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            logger.error(err)
            return res.status(500).json({ error: err.message })
        } else if (err) {
            logger.error(err)
            return res.status(500).json({ error: err.message })
        }

        next()
    })
}