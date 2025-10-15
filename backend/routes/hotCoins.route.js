import expresss from 'express';
import axios from 'axios';
import {getTopCoinsWithFullData} from '../controllers/AllCoinsDetail.controller.js';

const router = expresss.Router();

router.get('/top-coins', getTopCoinsWithFullData);
export default router;