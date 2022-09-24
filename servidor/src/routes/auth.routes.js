import { Router } from "express";
import * as auth from '../controllers/auth.controller.js'
import verifyToken from "../middlewares/verifyToken.js";

const router = Router();

router.post("/signin", auth.signIn) // Iniciar sesión
router.post("/signup", auth.signUp) // No se necesita verificar el token para registrarse
router.get("/verifytoken", verifyToken, auth.verifyToken) // Verificar el token sea valido

export default router;