import { Router } from "express";
import * as director from '../controllers/directores.controller.js'
import verifyToken from "../middlewares/verifyToken.js";

const router = Router();

router.get('/', director.getDirectores);
router.get('/:id', director.getDirector);
router.post('/', verifyToken, director.createDirector);
router.put('/:id', verifyToken, director.updateDirector);
router.delete('/:id', verifyToken, director.deleteDirector);




export default router;