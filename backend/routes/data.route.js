import { fearAndGreedIndex,getAltseasonIndex,getHalvingData,getGlobalMarketData, getCryptoNews } from '../controllers/Data.controller.js';
import express from 'express';

const router = express.Router();

router.get('/feargreed', fearAndGreedIndex);
router.get('/halving', getHalvingData);
router.get("/altseason", getAltseasonIndex);
router.get("/globalmarket", getGlobalMarketData);
router.get("/cryptonews", getCryptoNews);
export default router;
