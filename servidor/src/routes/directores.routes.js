import { Router } from "express";
import * as director from '../controllers/directores.controller.js'
import verifyToken from "../middlewares/verifyToken.js";
import verifyAdminUser from "../middlewares/verifyAdminUser.js";

const router = Router();

router.get('/', director.getDirectores);
router.get('/:id', director.getDirector);

router.post('/', verifyToken, verifyAdminUser, director.createDirector);
router.put('/:id', verifyToken, verifyAdminUser, director.updateDirector);
router.delete('/:id', verifyToken, verifyAdminUser, director.deleteDirector);




export default router;