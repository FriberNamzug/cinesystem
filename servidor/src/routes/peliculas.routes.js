import { Router } from "express";
import * as auth from '../controllers/peliculas.controller'
import verifyToken from "../middlewares/verifyToken.js";

const router = Router();

router.get("/", peliculas.getPeliculas)




export default router;