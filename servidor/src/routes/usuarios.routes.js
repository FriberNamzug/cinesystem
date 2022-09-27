import { Router } from "express";
import { getUsuarios } from "../controllers/usuarios.controller.js";
import verifyToken from "../middlewares/verifyToken.js";

const router = Router();

router.get("/", getUsuarios)




export default router;