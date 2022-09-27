import { Router } from "express";
import * as idiomas from '../controllers/idiomas.controller.js'
import verifyToken from "../middlewares/verifyToken.js";

const router = Router();


router.get('/', idiomas.getIdiomas);
router.get('/:id', idiomas.getIdioma);
router.post('/', verifyToken, idiomas.createIdioma);
router.put('/:id', verifyToken, idiomas.updateIdioma);
router.delete('/:id', verifyToken, idiomas.deleteIdioma);





export default router;