import { Router } from "express";
import * as generos from '../controllers/generos.controller.js'
import verifyToken from "../middlewares/verifyToken.js";
import verifyAdminUser from "../middlewares/verifyAdminUser.js";

const router = Router();

router.get("/", generos.getGeneros)
router.get("/:id", generos.getGenero)

router.post("/", verifyToken, verifyAdminUser, generos.createGenero)
router.put("/:id", verifyToken, verifyAdminUser, generos.updateGenero)
router.delete("/:id", verifyToken, verifyAdminUser, generos.deleteGenero)


export default router;