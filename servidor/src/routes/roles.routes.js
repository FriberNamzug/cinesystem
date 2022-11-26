import { Router } from "express";
import verifyToken from "../middlewares/verifyToken.js";
import verifyAdminUser from "../middlewares/verifyAdminUser.js";
import * as roles from '../controllers/roles.controller.js';


const router = Router();

router.get("/", verifyToken, verifyAdminUser, roles.obtenerRoles)


export default router;