import { Router } from "express";
import * as actores from '../controllers/actores.controller.js'
import verifyToken from "../middlewares/verifyToken.js";

const router = Router();

router.get("/", actores.getActores)
router.get("/:id", actores.getActor)
router.post("/", verifyToken, actores.createActor)
router.put("/:id", verifyToken, actores.updateActor)
router.delete("/:id", verifyToken, actores.deleteActor)




export default router;