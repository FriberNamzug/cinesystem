import { Router } from "express";
import * as peliculas from '../controllers/peliculas.controller.js'
import verifyToken from "../middlewares/verifyToken.js";
import verifyAdminUser from "../middlewares/verifyAdminUser.js";


const router = Router();

router.get('/search/', peliculas.searchPeliculas);
router.get("/p/full/", peliculas.getPeliculasFull)
router.get("/p/genero/:id_genero", peliculas.getPeliculaByGenero)
router.get("/p/funciones/:id_pelicula", peliculas.getPeliculaWithFunction)
router.get("/p/", peliculas.getPeliculas)
router.get("/:id", peliculas.getPelicula)

router.get("/p/disponibilidad", peliculas.getDisponibilidad)
router.put("/p/disponibilidad/:id_pelicula", verifyToken, verifyAdminUser, peliculas.updateDisponibilidad)

router.post("/", verifyToken, verifyAdminUser, peliculas.createPelicula)
router.put("/:id_pelicula", verifyToken, verifyAdminUser, peliculas.updatePelicula)
router.delete("/:id", verifyToken, verifyAdminUser, peliculas.deletePelicula)



export default router;