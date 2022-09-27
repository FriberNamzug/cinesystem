import { Router } from "express";
import * as actores from '../controllers/actores.controller.js'
import verifyToken from "../middlewares/verifyToken.js";

const router = Router();

router.get("/", actores.getActores)




export default router;