import { Router } from "express";
import * as auth from '../controllers/generos.controller.js'
import verifyToken from "../middlewares/verifyToken.js";

const router = Router();

router.get("/", generos.getGeneros)




export default router;