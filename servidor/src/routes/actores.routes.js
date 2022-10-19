import { Router } from "express";
import * as actores from '../controllers/actores.controller.js'
import verifyToken from "../middlewares/verifyToken.js";
import verifyAdminUser from "../middlewares/verifyAdminUser.js";

const router = Router();

router.get('/search/', actores.searchActores);
router.get("/", actores.getActores)
router.get("/:id", actores.getActor)

router.post("/", verifyToken, verifyAdminUser, actores.createActor)
router.put("/:id", verifyToken, verifyAdminUser, actores.updateActor)
router.delete("/:id", verifyToken, verifyAdminUser, actores.deleteActor)




export default router;