import { Router } from "express";
import * as peliculas from '../controllers/peliculas.controller.js'
import verifyToken from "../middlewares/verifyToken.js";

const router = Router();

router.get("/p/", peliculas.getPeliculas)
router.get("/:id", peliculas.getPelicula)
router.post("/", verifyToken, peliculas.createPelicula)
router.put("/:id_pelicula", verifyToken, peliculas.updatePelicula)
router.delete("/:id", verifyToken, peliculas.deletePelicula)


export default router;