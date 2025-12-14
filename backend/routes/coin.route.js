import express from 'express';
import { updateAndStoreCoin } from '../controllers/CoinMaster.controller.js';


const router = express.Router();

// Update & calculate coin metrics
router.get('/update-coin/:coinId', updateAndStoreCoin);

// Fetch stored coin metrics
// router.get('/coin/:coinId', fetchCoinById);

export default router;
