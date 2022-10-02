import { Router } from "express";
import * as auth from '../controllers/auth.controller.js'
import verifyToken from "../middlewares/verifyToken.js";

const router = Router();

router.post("/signin", auth.signIn) // Iniciar sesión

router.post("/signup", auth.signUp) // No se necesita verificar el token para registrarse
router.get("/validateemail/:token", auth.validateEmail) // Validar email
router.get("/reenviar/:email", auth.reenviarEmail) // Reenviar email de activación de cuenta

router.get("/recuperar/:email", auth.recuperarPassword) // Recuperar contraseña
router.post("/recuperar/:token", auth.cambiarPassword) // Cambiar contraseña

router.get("/verifytoken", verifyToken, auth.verifyToken) // Verificar el token sea valido

export default router;