import { Router } from "express";
import * as generos from '../controllers/generos.controller.js'
import verifyToken from "../middlewares/verifyToken.js";

const router = Router();

router.get("/", generos.getGeneros)
router.get("/:id", generos.getGenero)
router.post("/", generos.createGenero)
router.put("/:id", generos.updateGenero)
router.delete("/:id", generos.deleteGenero)


export default router;