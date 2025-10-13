import { fearAndGreedIndex,getAltseasonIndex,getHalvingData } from '../controllers/Data.controller.js';
import express from 'express';

const router = express.Router();

router.get('/feargreed', fearAndGreedIndex);
router.get('/halving', getHalvingData);
router.get("/altseason", getAltseasonIndex);

export default router;
