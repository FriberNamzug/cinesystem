import { Router } from "express";
import * as uploads from '../controllers/uploads.controller.js'
import verifyToken from "../middlewares/verifyToken.js";
import { upload } from "../middlewares/multer.js";

const router = Router();

router.get("/:type/:id", uploads.getImages)  //type = p (pelicula) o a (actor)
router.post("/:type/:id",verifyToken, upload, uploads.uploadImage) //type = p (pelicula) o a (actor)


export default router;