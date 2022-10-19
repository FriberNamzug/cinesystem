import { Router } from "express";
import * as idiomas from '../controllers/idiomas.controller.js'
import verifyToken from "../middlewares/verifyToken.js";
import verifyAdminUser from "../middlewares/verifyAdminUser.js";


const router = Router();


router.get('/search/', idiomas.searchIdiomas);

router.get('/', idiomas.getIdiomas);
router.get('/:id', idiomas.getIdioma);

router.post('/', verifyToken, verifyAdminUser, idiomas.createIdioma);
router.put('/:id', verifyToken, verifyAdminUser, idiomas.updateIdioma);
router.delete('/:id', verifyToken, verifyAdminUser, idiomas.deleteIdioma);





export default router;