import { Router } from "express";
import * as funcion from '../controllers/funciones.controller.js'

import verifyToken from "../middlewares/verifyToken.js";
import verifyAdminUser from "../middlewares/verifyAdminUser.js";

const router = Router();

router.get('/', funcion.getFunciones);
router.get('/:id_funcion', funcion.getFuncion);
router.post('/', verifyToken, verifyAdminUser, funcion.createFuncion);
router.put('/:id_funcion', verifyToken, verifyAdminUser, funcion.updateFuncion);
router.delete('/:id_funcion', verifyToken, verifyAdminUser, funcion.deshabilitarFuncion);



export default router;