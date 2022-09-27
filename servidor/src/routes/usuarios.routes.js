import { Router } from "express";
import * as usuarios from '../controllers/usuarios.controller.js'
import verifyToken from "../middlewares/verifyToken.js";

const router = Router();

router.get("/", verifyToken, usuarios.getUsuarios);
router.get("/:id", verifyToken, usuarios.getUsuario);
router.put("/:id", verifyToken, usuarios.updateUsuario);
router.delete("/:id", verifyToken, usuarios.deleteUsuario);

export default router;