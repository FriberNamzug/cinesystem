import pool from "../config/db.js";
import logger from "../config/logger.js";
import { IMAGEN_POR_DEFECTO } from "../config/config.js";


export const getPeliculasFull = async (req, res) => {
    try {
        /* Recuperamos la pagina y el limite de la ruta */
        const { pagina, limite } = req.query;

        if (!pagina || !limite) return res.status(400).json({ error: "Faltan parámetros" });

        /* Calculamos el offset */
        const offset = (pagina - 1) * limite;

        /* Recuperamos el total de peliculas */
        const total = await pool.query("SELECT COUNT(*) FROM peliculas WHERE status = 1");
        const totalPaginas = Math.ceil(total[0][0]["COUNT(*)"] / limite);

        /* Recuperamos las peliculas */
        const peliculas = await pool.query("SELECT * FROM peliculas WHERE status = 1 LIMIT ? OFFSET ?", [Number(limite), Number(offset)]);

        /* Buscamos  de la pelicula por su id y se la agregamos */
        for (let i = 0; i < peliculas[0].length; i++) {
            const generos = await pool.query("SELECT generos.id_genero, generos.nombre FROM generos INNER JOIN peliculas_generos ON generos.id_genero = peliculas_generos.id_genero WHERE peliculas_generos.id_pelicula = ?", [peliculas[0][i].id_pelicula]);

            const actores = await pool.query("SELECT actores.id_actor, actores.nombre, imagen FROM actores INNER JOIN peliculas_actores ON actores.id_actor = peliculas_actores.id_actor WHERE peliculas_actores.id_pelicula = ?", [peliculas[0][i].id_pelicula]);

            const directores = await pool.query("SELECT directores.id_director, directores.nombre, directores.apellido FROM directores INNER JOIN peliculas_directores ON directores.id_director = peliculas_directores.id_director WHERE peliculas_directores.id_pelicula = ?", [peliculas[0][i].id_pelicula]);

            const idiomas = await pool.query("SELECT idiomas.id_idioma, idiomas.nombre FROM idiomas INNER JOIN peliculas_idiomas ON idiomas.id_idioma = peliculas_idiomas.id_idioma WHERE peliculas_idiomas.id_pelicula = ?", [peliculas[0][i].id_pelicula]);

            if (peliculas[0][i].imagen === null) {
                peliculas[0][i].imagen = [{ url: IMAGEN_POR_DEFECTO, default: true }];
            } else {
                peliculas[0][i].imagen = { default: false, url: peliculas[0][i].imagen };
            }
            peliculas[0][i].generos = generos[0];
            peliculas[0][i].actores = actores[0];
            peliculas[0][i].directores = directores[0];
            peliculas[0][i].idiomas = idiomas[0];

        }



        res.status(200).json({
            total: total[0][0]["COUNT(*)"],
            totalPaginas,
            limite: Number(limite),
            pagina: Number(pagina),
            peliculas: peliculas[0],
        });


    } catch (error) {
        logger.error(`${error.message} - ${req.originalUrl} - ${req.method}`);
        res.status(500).json({ message: "Error del servidor" });

    }
}

export const getPeliculas = async (req, res) => {

    try {
        const { pagina, limite } = req.query;
        if (!pagina || !limite) return res.status(400).json({ error: "Faltan parámetros" });
        const offset = (pagina - 1) * limite;
        const total = await pool.query("SELECT COUNT(*) FROM peliculas WHERE status = 1");
        const totalPaginas = Math.ceil(total[0][0]["COUNT(*)"] / limite);
        const peliculas = await pool.query("SELECT * FROM peliculas WHERE status = 1 LIMIT ? OFFSET ?", [Number(limite), Number(offset)]);
        if (!peliculas[0]) return res.status(404).json({ message: "No se encontraron peliculas" });

        for (let i = 0; i < peliculas[0].length; i++) {
            if (peliculas[0][i].imagen === null) {
                peliculas[0][i].imagen = { url: IMAGEN_POR_DEFECTO, default: true };
            } else {
                peliculas[0][i].imagen = { default: false, url: peliculas[0][i].imagen };
            }
        }

        res.status(200).json({
            total: total[0][0]["COUNT(*)"],
            totalPaginas,
            limite: Number(limite),
            pagina: Number(pagina),
            peliculas: peliculas[0],
        });
    } catch (error) {
        logger.error(`${error.message} - ${req.originalUrl} - ${req.method}`);
        res.status(500).json({ message: "Error del servidor" });
    }

}

export const getPelicula = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) return res.status(400).json({ error: "Faltan parámetros" });

        const [pelicula] = await pool.query("SELECT * FROM peliculas WHERE id_pelicula = ? AND status = 1", [id]);
        if (pelicula.length === 0) return res.status(404).json({ message: "La película no existe" });

        const [generos] = await pool.query("SELECT generos.id_genero, generos.nombre FROM generos INNER JOIN peliculas_generos ON generos.id_genero = peliculas_generos.id_genero WHERE peliculas_generos.id_pelicula = ?", [id]);

        const [actores] = await pool.query("SELECT actores.id_actor, actores.nombre, imagen FROM actores INNER JOIN peliculas_actores ON actores.id_actor = peliculas_actores.id_actor WHERE peliculas_actores.id_pelicula = ?", [id]);

        const [directores] = await pool.query("SELECT directores.id_director, directores.nombre FROM directores INNER JOIN peliculas_directores ON directores.id_director = peliculas_directores.id_director WHERE peliculas_directores.id_pelicula = ?", [id]);

        const [idiomas] = await pool.query("SELECT idiomas.id_idioma, idiomas.nombre FROM idiomas INNER JOIN peliculas_idiomas ON idiomas.id_idioma = peliculas_idiomas.id_idioma WHERE peliculas_idiomas.id_pelicula = ?", [id]);

        if (pelicula[0].imagen === null) {
            pelicula[0].imagen = [{ url: IMAGEN_POR_DEFECTO, default: true }];
        } else {
            pelicula[0].imagen = { default: false, url: pelicula[0].imagen };
        }

        const peliculaCompleta = {
            id_pelicula: pelicula[0].id_pelicula,
            titulo: pelicula[0].titulo,
            sinopsis: pelicula[0].sinopsis,
            fecha_estreno: pelicula[0].fecha_estreno,
            duracion: pelicula[0].duracion,
            disponibilidad: pelicula[0].disponibilidad,
            puntuacion: pelicula[0].puntuacion,
            url: pelicula[0].url,
            generos: generos,
            actores: actores,
            directores: directores,
            idiomas: idiomas,
            imagen: pelicula[0].imagen,
        }

        res.status(200).json(peliculaCompleta);

    } catch (error) {
        logger.error(`${error.message} - ${req.originalUrl} - ${req.method}`);
        res.status(500).json({ message: "Error del servidor" });

    }
}

export const getPeliculaByGenero = async (req, res) => {
    try {
        const { id_genero } = req.params;
        const [genero] = await pool.query("SELECT * FROM generos WHERE id_genero = ? AND status = 1", [id_genero]);
        if (genero.length === 0) return res.status(400).json({ message: "El género no existe" });

        const [peliculas] = await pool.query("SELECT * FROM peliculas WHERE id_pelicula IN (SELECT id_pelicula FROM peliculas_generos WHERE id_genero = ?) AND status = 1", [id_genero]);
        if (peliculas.length === 0) return res.status(400).json({ message: "No hay películas con ese género" });

        for (let i = 0; i < peliculas.length; i++) {
            if (peliculas[i].imagen === null) {
                peliculas[i].imagen = [{ url: IMAGEN_POR_DEFECTO, default: true }];
            } else {
                peliculas[i].imagen = { default: false, url: peliculas[i].imagen };
            }
        }

        res.status(200).json({
            genero: genero[0].nombre,
            peliculas: peliculas
        });
    } catch (error) {
        logger.error(`${error.message} - ${req.originalUrl} - ${req.method}`);
        res.status(500).json({ message: "Error del servidor" });
    }
}

export const getPeliculaWithFunction = async (req, res) => {
    const { id_pelicula } = req.params;
    const { pagina, limite } = req.query;
    if (!pagina || !limite) return res.status(400).json({ error: "Faltan parámetros" });
    const offset = (pagina - 1) * limite;

    try {
        const [pelicula] = await pool.query("SELECT * FROM peliculas WHERE id_pelicula = ? AND status = 1", [id_pelicula]);
        if (pelicula.length === 0) return res.status(404).json({ message: "La película no existe" });

        if (pelicula[0].imagen === null) {
            pelicula[0].imagen = [{ url: IMAGEN_POR_DEFECTO, default: true }];
        } else {
            pelicula[0].imagen = { default: false, url: pelicula[0].imagen };
        }

        const total = await pool.query("SELECT COUNT(*) FROM funciones WHERE id_pelicula =  ? AND status = 1", [id_pelicula]);
        const totalPaginas = Math.ceil(total[0][0]["COUNT(*)"] / limite);

        const funciones = await pool.query("SELECT id_pelicula,id_funcion,aforo,sala,horario,desde,hasta,status,costo_boleto FROM funciones WHERE id_pelicula = ? AND status = 1 LIMIT ? OFFSET ?", [id_pelicula, Number(limite), Number(offset)]);


        if (funciones[0].length === 0) return res.status(404).json({ message: "No existen funciones para esta pelicula" });
        res.status(200).json({
            total: total[0][0]["COUNT(*)"],
            totalPaginas,
            limite: Number(limite),
            pagina: Number(pagina),
            pelicula: pelicula[0],
            funciones: funciones[0]
        });

    } catch (error) {
        logger.error(`${error.message} - ${req.originalUrl} - ${req.method}`);
        res.status(500).json({ message: "Error del servidor" });
    }
}

export const searchPeliculas = async (req, res) => {
    try {
        const { pagina, limite, busqueda } = req.query;
        if (!pagina || !limite || !busqueda) return res.status(400).json({ error: "Faltan parámetros" });
        const offset = (pagina - 1) * limite;
        const total = await pool.query("SELECT COUNT(*) FROM peliculas WHERE titulo LIKE ? AND status = 1", [`%${busqueda}%`]);
        const totalPaginas = Math.ceil(total[0][0]["COUNT(*)"] / limite);

        const [peliculas] = await pool.query("SELECT * FROM peliculas WHERE titulo LIKE ? AND status = 1 LIMIT ? OFFSET ?", [`%${busqueda}%`, Number(limite), Number(offset)]);

        if (peliculas.length === 0) return res.status(404).json({ message: "No se encontraron películas" });

        res.status(200).json({ totalPaginas, peliculas: peliculas });

    } catch (error) {
        logger.error(`${error.message} - ${req.originalUrl} - ${req.method}`);
        res.status(500).json({ message: "Error del servidor" });
    }
}

export const createPelicula = async (req, res) => {
    try {
        const { titulo, sinopsis, fecha_estreno, duracion, disponibilidad, idiomas = false, directores = false, generos = false, actores = false } = req.body;
        const fecha = new Date(fecha_estreno);
        let errores = [];

        if (!titulo || !sinopsis || !fecha_estreno || !duracion || !disponibilidad || !idiomas || !directores || !generos || !actores) return res.status(400).json({ message: "Faltan campos" });

        if (titulo.length > 45) return res.status(400).json({ message: "El título no puede tener más de 45 caracteres" });
        if (sinopsis.length > 500) return res.status(400).json({ message: "La sinopsis no puede tener más de 500 caracteres" });
        if (fecha.toString() === "Invalid Date") return res.status(400).json({ message: "La fecha de estreno no es válida" });
        if (duracion < 1 || duracion > 500) return res.status(400).json({ message: "La duración no es válida" });
        if (disponibilidad !== true && disponibilidad !== false) return res.status(400).json({ message: "La disponibilidad no es válida" });

        const newPelicula = {
            titulo,
            sinopsis,
            fecha_estreno: fecha,
            duracion,
            disponibilidad,
        }

        const pelicula = await pool.query("INSERT INTO peliculas SET ?", [newPelicula]);
        if (pelicula[0].affectedRows === 0) return res.status(400).json({ message: "No se pudo crear la película" });
        const id_pelicula = pelicula[0].insertId;

        for (let i = 0; i < idiomas.length; i++) {
            const idioma = await pool.query("SELECT * FROM idiomas WHERE id_idioma = ? AND status = 1", [idiomas[i]]);
            if (idioma[0].length === 0) {
                errores.push(`El idioma ${idiomas[i]} no existe`);
                continue;
            }
            const pelicula_idioma = await pool.query("INSERT INTO peliculas_idiomas SET ?", [{ id_pelicula, id_idioma: idiomas[i] }]);
            if (pelicula_idioma[0].affectedRows === 0) {
                errores.push(`No se pudo agregar el idioma ${idiomas[i]} a la película`);
                continue;
            }
        }

        for (let i = 0; i < directores.length; i++) {
            const director = await pool.query("SELECT * FROM directores WHERE id_director = ? AND status = 1", [directores[i]]);
            if (director[0].length === 0) {
                errores.push(`El director ${directores[i]} no existe`);
                continue;
            }
            const pelicula_director = await pool.query("INSERT INTO peliculas_directores SET ?", [{ id_pelicula, id_director: directores[i] }]);
            if (pelicula_director[0].affectedRows === 0) {
                errores.push(`No se pudo agregar el director ${directores[i]} a la película`);
                continue;
            }
        }

        for (let i = 0; i < generos.length; i++) {
            const genero = await pool.query("SELECT * FROM generos WHERE id_genero = ? AND status = 1", [generos[i]]);
            if (genero[0].length === 0) {
                errores.push(`El género ${generos[i]} no existe`);
                continue;
            }
            const pelicula_genero = await pool.query("INSERT INTO peliculas_generos SET ?", [{ id_pelicula, id_genero: generos[i] }]);
            if (pelicula_genero[0].affectedRows === 0) {
                errores.push(`No se pudo agregar el género ${generos[i]} a la película`);
                continue;
            }
        }

        for (let i = 0; i < actores.length; i++) {
            const actor = await pool.query("SELECT * FROM actores WHERE id_actor = ? AND status = 1", [actores[i]]);
            if (actor[0].length === 0) {
                errores.push(`El actor ${actores[i]} no existe`);
                continue;
            }
            const pelicula_actor = await pool.query("INSERT INTO peliculas_actores SET ?", [{ id_pelicula, id_actor: actores[i] }]);
            if (pelicula_actor[0].affectedRows === 0) {
                errores.push(`No se pudo agregar el actor ${actores[i]} a la película`);
                continue;
            }
        }

        res.json({
            message: "Película creada",
            pelicula: {
                id_pelicula,
                ...newPelicula
            },
            errores
        });

    } catch (error) {
        logger.error(`${error.message} - ${req.originalUrl} - ${req.method}`);
        res.status(500).json({ message: "Error del servidor" });
    }
}

export const updatePelicula = async (req, res) => {
    try {
        const { id_pelicula } = req.params;
        const { titulo, sinopsis, fecha_estreno, duracion, disponibilidad, idiomas = false, directores = false, generos = false, actores = false } = req.body;
        const fecha = new Date(fecha_estreno);
        let errores = [];

        if (!titulo || !sinopsis || !fecha_estreno || !duracion || !disponibilidad || !idiomas || !directores || !generos || !actores) return res.status(400).json({ message: "Faltan campos" });

        if (titulo.length > 45) return res.status(400).json({ message: "El título no puede tener más de 45 caracteres" });
        if (sinopsis.length > 500) return res.status(400).json({ message: "La sinopsis no puede tener más de 500 caracteres" });
        if (fecha.toString() === "Invalid Date") return res.status(400).json({ message: "La fecha de estreno no es válida" });
        if (duracion < 1 || duracion > 500) return res.status(400).json({ message: "La duración no es válida" });
        if (disponibilidad !== true && disponibilidad !== false) return res.status(400).json({ message: "La disponibilidad no es válida" });


        const updatePelicula = {
            titulo,
            sinopsis,
            fecha_estreno: fecha,
            duracion,
            disponibilidad,
        }


        /* Comprobamos que la pelicula exista */
        const pelicula = await pool.query("SELECT * FROM peliculas WHERE id_pelicula = ? AND status = 1", [id_pelicula]);
        if (pelicula[0].length === 0) return res.status(400).json({ message: "La película no existe" });

        const peliculaActualizada = await pool.query("UPDATE peliculas SET ? WHERE id_pelicula = ? AND status = 1", [updatePelicula, id_pelicula]);
        if (peliculaActualizada[0].affectedRows === 0) return res.status(400).json({ message: "No se pudo actualizar la película" });


        /* Obtenemos de la pelicula */
        const idiomasPelicula = await pool.query("SELECT id_idioma FROM peliculas_idiomas WHERE id_pelicula = ?", [id_pelicula]);
        const actoresPelicula = await pool.query("SELECT id_actor FROM peliculas_actores WHERE id_pelicula = ?", [id_pelicula]);
        const directoresPelicula = await pool.query("SELECT id_director FROM peliculas_directores WHERE id_pelicula = ?", [id_pelicula]);
        const generosPelicula = await pool.query("SELECT id_genero FROM peliculas_generos WHERE id_pelicula = ?", [id_pelicula]);

        //Debería de ejecutar lo siguiente solamente si se comprueba que existen cambios con los id obtenidos con los id de los arrays
        //Se deberá de refactorizar el código para que no se repita, pero por ahora funciona... 

        //Lo que se elimina////////////////////////
        const idiomasEliminar = idiomasPelicula[0].filter(idioma => !idiomas.includes(idioma.id_idioma));
        const actoresEliminar = actoresPelicula[0].filter(actor => !actores.includes(actor.id_actor));
        const directoresEliminar = directoresPelicula[0].filter(director => !directores.includes(director.id_director));
        const generosEliminar = generosPelicula[0].filter(genero => !generos.includes(genero.id_genero));
        for (let i = 0; i < idiomasEliminar.length; i++) {
            const idiomaPelicula = await pool.query("DELETE FROM peliculas_idiomas WHERE id_pelicula = ? AND id_idioma = ?", [id_pelicula, idiomasPelicula[0][i].id_idioma]);
            if (idiomaPelicula[0].affectedRows === 0) {
                errores.push(`No se pudo borrar el idioma ${idiomasPelicula[0][i].nombre} de la película`);
                continue;
            }
        }
        for (let i = 0; i < actoresEliminar.length; i++) {
            const actorPelicula = await pool.query("DELETE FROM peliculas_actores WHERE id_pelicula = ? AND id_actor = ?", [id_pelicula, actoresPelicula[0][i].id_actor]);
            if (actorPelicula[0].affectedRows === 0) {
                errores.push(`No se pudo borrar el actor ${actoresPelicula[0][i].nombre} de la película`);
                continue;
            }
        }
        for (let i = 0; i < directoresEliminar.length; i++) {
            const directorPelicula = await pool.query("DELETE FROM peliculas_directores WHERE id_pelicula = ? AND id_director = ?", [id_pelicula, directoresPelicula[0][i].id_director]);
            if (directorPelicula[0].affectedRows === 0) {
                errores.push(`No se pudo borrar el director ${directoresPelicula[0][i].nombre} de la película`);
                continue;
            }
        }
        for (let i = 0; i < generosEliminar.length; i++) {
            const generoPelicula = await pool.query("DELETE FROM peliculas_generos WHERE id_pelicula = ? AND id_genero = ?", [id_pelicula, generosPelicula[0][i].id_genero]);
            if (generoPelicula[0].affectedRows === 0) {
                errores.push(`No se pudo borrar el género ${generosPelicula[0][i].nombre} de la película`);
                continue;
            }
        }
        //Lo que se agrega////////////////////////
        const idiomasAgregar = idiomas.filter(idioma => !idiomasPelicula[0].map(idioma => idioma.id_idioma).includes(idioma));
        const actoresAgregar = actores.filter(actor => !actoresPelicula[0].map(actor => actor.id_actor).includes(actor));
        const directoresAgregar = directores.filter(director => !directoresPelicula[0].map(director => director.id_director).includes(director));
        const generosAgregar = generos.filter(genero => !generosPelicula[0].map(genero => genero.id_genero).includes(genero));

        for (let i = 0; i < idiomasAgregar.length; i++) {
            const idioma = await pool.query("SELECT * FROM idiomas WHERE id_idioma = ? AND status = 1", [idiomasAgregar[i]]);
            if (idioma[0].length === 0) {
                errores.push(`El idioma ${idiomasAgregar[i]} no existe`);
                continue;
            }
            const pelicula_idioma = await pool.query("INSERT INTO peliculas_idiomas SET ?", [{ id_pelicula, id_idioma: idiomasAgregar[i] }]);
            if (pelicula_idioma[0].affectedRows === 0) {
                errores.push(`No se pudo agregar el idioma ${idiomasAgregar[i]} a la película`);
                continue;
            }
        }
        for (let i = 0; i < actoresAgregar.length; i++) {
            const actor = await pool.query("SELECT * FROM actores WHERE id_actor = ? AND status = 1", [actoresAgregar[i]]);
            if (actor[0].length === 0) {
                errores.push(`El actor ${actoresAgregar[i]} no existe`);
                continue;
            }
            const pelicula_actor = await pool.query("INSERT INTO peliculas_actores SET ?", [{ id_pelicula, id_actor: actoresAgregar[i] }]);
            if (pelicula_actor[0].affectedRows === 0) {
                errores.push(`No se pudo agregar el actor ${actoresAgregar[i]} a la película`);
                continue;
            }
        }
        for (let i = 0; i < directoresAgregar.length; i++) {
            const director = await pool.query("SELECT * FROM directores WHERE id_director = ? AND status = 1", [directoresAgregar[i]]);
            if (director[0].length === 0) {
                errores.push(`El director ${directoresAgregar[i]} no existe`);
                continue;
            }
            const pelicula_director = await pool.query("INSERT INTO peliculas_directores SET ?", [{ id_pelicula, id_director: directoresAgregar[i] }]);
            if (pelicula_director[0].affectedRows === 0) {
                errores.push(`No se pudo agregar el director ${directoresAgregar[i]} a la película`);
                continue;
            }
        }
        for (let i = 0; i < generosAgregar.length; i++) {
            const genero = await pool.query("SELECT * FROM generos WHERE id_genero = ? AND status = 1", [generosAgregar[i]]);
            if (genero[0].length === 0) {
                errores.push(`El género ${generosAgregar[i]} no existe`);
                continue;
            }
            const pelicula_genero = await pool.query("INSERT INTO peliculas_generos SET ?", [{ id_pelicula, id_genero: generosAgregar[i] }]);
            if (pelicula_genero[0].affectedRows === 0) {
                errores.push(`No se pudo agregar el género ${generosAgregar[i]} a la película`);
                continue;
            }
        }

        res.status(200).json({
            message: "Película actualizada",
            data: {
                pelicula: pelicula[0],
            },
            errores
        });

    } catch (error) {
        logger.error(`${error.message} - ${req.originalUrl} - ${req.method}`);
        res.status(500).json({ message: "Error del servidor" });
    }
}

export const deletePelicula = async (req, res) => {
    try {
        const { id } = req.params;
        const pelicula = await pool.query("SELECT * FROM peliculas WHERE id_pelicula = ?", [id]);
        if (pelicula[0].length === 0) return res.status(400).json({ message: "La película no existe" });

        // Borramos en las relaciones que existen para no dejar basura en la DB
        await pool.query("DELETE FROM peliculas_idiomas WHERE id_pelicula = ?", [id]);
        await pool.query("DELETE FROM peliculas_actores WHERE id_pelicula = ?", [id]);
        await pool.query("DELETE FROM peliculas_directores WHERE id_pelicula = ?", [id]);
        await pool.query("DELETE FROM peliculas_generos WHERE id_pelicula = ?", [id]);
        const deletePelicula = await pool.query("UPDATE peliculas SET status = 0 WHERE id_pelicula = ?", [id]);
        if (deletePelicula[0].affectedRows === 0) return res.status(400).json({ message: "No se pudo eliminar la película" });

        res.json({ message: "Película eliminada" });
    } catch (error) {
        logger.error(`${error.message} - ${req.originalUrl} - ${req.method}`);
        res.status(500).json({ message: "Error del servidor" });
    }
}

export const getDisponibilidad = async (req, res) => {
    try {
        const [peliculas] = await pool.query("SELECT * FROM peliculas WHERE id_pelicula IN (SELECT id_pelicula FROM funciones WHERE status = 1) AND status = 1");

        //Si no tiene imagenes, se le asigna una por defecto
        for (let i = 0; i < peliculas.length; i++) {
            if (peliculas[i].imagen === null) {
                peliculas[i].imagen = [{ url: IMAGEN_POR_DEFECTO, default: true }];
            } else {
                peliculas[i].imagen = { default: false, url: peliculas[i].imagen };
            }
        }


        res.status(200).json({
            peliculas: peliculas,
        });

    } catch (error) {
        logger.error(`${error.message} - ${req.originalUrl} - ${req.method}`);
        res.status(500).json({ message: "Error del servidor" });
    }
}

export const updateDisponibilidad = async (req, res) => {

    const { id_pelicula } = req.params;
    const { disponibilidad } = req.body;
    if (disponibilidad !== true && disponibilidad !== false) return res.status(400).json({ message: "La disponibilidad solo puede ser true o false" });
    if (disponibilidad === undefined) return res.status(400).json({ message: "La disponibilidad es requerida" });

    try {

        const pelicula = await pool.query("SELECT * FROM peliculas WHERE id_pelicula = ? AND status = 1", [id_pelicula]);
        if (pelicula[0].length === 0) return res.status(400).json({ message: "La película no existe" });

        // Validamos si la pelicula cuenta con una funcion activa
        if (disponibilidad === false) {
            const funcion = await pool.query("SELECT * FROM funciones WHERE id_pelicula = ? AND status = 1", [id_pelicula]);
            if (funcion[0].length > 0) return res.status(400).json({ message: "La película no puede ser deshabilitada porque tiene funciones activas" });
        }

        const updateDisponibilidad = await pool.query("UPDATE peliculas SET disponibilidad = ? WHERE id_pelicula = ?", [disponibilidad, id_pelicula]);
        if (updateDisponibilidad[0].affectedRows === 0) return res.status(400).json({ message: "No se pudo actualizar la disponibilidad" });

        res.json({ message: "Disponibilidad actualizada" });

    } catch (error) {
        logger.error(`${error.message} - ${req.originalUrl} - ${req.method}`);
        res.status(500).json({ message: "Error del servidor" });
    }

}


