import { Router } from "express";
import * as auth from '../controllers/auth.controller.js'
import verifyToken from "../middlewares/verifyToken.js";

const router = Router();

router.post("/signin", auth.signIn) // Iniciar sesión

router.post("/signup", auth.signUp) // No se necesita verificar el token para registrarse
router.get("/activar-cuenta/:token", auth.validateEmail) // Validar email
router.get("/activar-cuenta/reenviar/:email", auth.reenviarEmail) // Reenviar email de activación de cuenta

router.get("/recuperar/:email", auth.recuperarPassword) // Recuperar contraseña
router.post("/recuperar/:token", auth.cambiarPassword) // Cambiar contraseña

router.post("/2fa/crear", verifyToken, auth.crear2FA); // Crear 2FA
router.post("/2fa/verificar", auth.verificar2FA); // Verificar 2FA
router.post("/2fa/eliminar", verifyToken, auth.eliminar2FA); // Eliminar 2FA



router.get("/verifytoken", verifyToken, auth.verifyToken) // Verificar el token sea valido

export default router;