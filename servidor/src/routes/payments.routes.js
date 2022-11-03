import { Router } from "express";
import * as payment from '../controllers/payments.controller.js'

import verifyToken from "../middlewares/verifyToken.js";

const router = Router();

router.post('/create-order', verifyToken, payment.createOrder);
router.get('/capture-order', payment.captureOrder);
router.get('/cancel-order', payment.cancelOrder);


export default router;