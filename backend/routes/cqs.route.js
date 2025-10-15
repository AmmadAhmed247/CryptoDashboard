import express from 'express';
import axios from 'axios';
import { calculateCQS } from '../controllers/CQS.controller.js';
import { calculateTimingScore } from '../controllers/TimingScore.controller.js';
import { getMoonshotFactor,fetchMoonshotData } from '../controllers/Moonfactor.controller.js';
import { calculateRiskIndex } from '../controllers/Riskindex.controller.js';
import { calculateChanceIndex } from '../controllers/ChanceIndex.controller.js';

const router = express.Router();

//done
router.get('/cqs/:coinId', calculateCQS);
//done
router.get('/timing/:coinId', calculateTimingScore);
//done
router.get('/moonshot/:coinId', getMoonshotFactor);
//done
router.get('/riskindex/:coinId', calculateRiskIndex);

//done
router.get('/chanceindex/:coinId', async (req, res) => {
  try {
    const { coinId } = req.params;
    const { cqs } = req.query;

    // 1️⃣ Validate CQS
    if (!cqs) return res.status(400).json({ success: false, error: 'CQS required' });
    const cqsValue = parseFloat(cqs);

    // 2️⃣ Fetch Moonshot Factor using reusable function
    const moonshotResult = await fetchMoonshotData(coinId, cqsValue);

    // 3️⃣ Normalize other metrics (example: TS, CS)
    // Replace these with your proper normalization later
    const TS_norm = 50;            // Timing Score normalized
    const CS_weekly_norm = 50;     // Coin Supply / Volume normalized
    const CQS_norm = cqsValue;     // Already 0-100 scale
    const MoonshotFactor = moonshotResult.moonshotFactor || 50;

    // 4️⃣ Calculate Chance Index
    const CIResult = calculateChanceIndex(TS_norm, CS_weekly_norm, CQS_norm, MoonshotFactor);

    // 5️⃣ Send response
    res.json({
      success: true,
      coinId,
      coinName: moonshotResult.coinName,
      symbol: moonshotResult.symbol,
      ...CIResult,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Chance Index error:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
