import { Router } from "express";
import * as boleto from '../controllers/boletos.controller.js'
import verifyToken from "../middlewares/verifyToken.js";
import verifyAdminUser from "../middlewares/verifyAdminUser.js";

const router = Router();

router.get('/', verifyToken, boleto.getBoletos);
router.get('/:id_boleto', verifyToken, boleto.getBoleto);




export default router;