import { Router } from "express";
import * as usuarios from '../controllers/usuarios.controller.js'
import verifyToken from "../middlewares/verifyToken.js";
import verifyAdminUser from "../middlewares/verifyAdminUser.js";

const router = Router();

/* Usuario */
router.get("/u/", verifyToken, usuarios.getUsuario);
router.put("/u/", verifyToken, usuarios.updateUsuario);
router.delete("/u/", verifyToken, usuarios.deleteUsuario);


/* Administrador */
router.get("/a/", verifyToken, verifyAdminUser, usuarios.getUsuariosA);
router.get("/a/:id", verifyToken, verifyAdminUser, usuarios.getUsuarioA);
router.put("/a/:id", verifyToken, verifyAdminUser, usuarios.updateUsuarioA);
router.delete("/a/:id", verifyToken, verifyAdminUser, usuarios.deleteUsuarioA);
router.post("/a/", verifyToken, verifyAdminUser, usuarios.createUsuarioA);

export default router;