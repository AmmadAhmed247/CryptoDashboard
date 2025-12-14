import CoinScore from '../models/CoinScore.model.js';
import axios from 'axios';
import { calculateCQSValue } from "../services/cqsCalculator.js";
import { calculateTimingScore } from './TimingScore.controller.js';
import { fetchMoonshotData } from './Moonfactor.controller.js';
import { calculateRiskIndex } from './Riskindex.controller.js';
import { calculateChanceIndex } from './ChanceIndex.controller.js';
import { calculateCMSFallback } from './CMS.controller.js'; 

const normalize = (value, min = 0, max = 100) => {
  if (typeof value !== 'number' || isNaN(value)) return 0;
  if (max - min === 0) return 0;
  let result = ((value - min) / (max - min)) * 100;
  return Math.min(Math.max(result, 0), 100);
};
export const updateAndStoreCoin = async (req, res) => {
  try {
    const { coinId } = req.params;
    
    const { data: coinData } = await axios.get(`https://api.coingecko.com/api/v3/coins/${coinId}`, {
      params: {
        localization: false,
        tickers: true,
        market_data: true,
        community_data: true,
        developer_data: true,
        sparkline: true
      }
    });

    const logo = coinData.image?.small || coinData.image?.thumb || "";
    const cqsResult = calculateCQSValue(coinData);
    const CQS_total = cqsResult.CQS;
    const tsResult = await calculateTimingScore(coinData);
    const TS_total = tsResult.TS;
    const moonshotResult = await fetchMoonshotData(coinId, CQS_total);
    const Moonshot_total = moonshotResult.moonshotFactor || 0;
    const riResult = await calculateRiskIndex(coinData);
    const RI_total = normalize(riResult.RI, 0, 100);
    const CS_weekly_norm = tsResult.breakdown?.CS_weekly_norm || 50;
    const ciRaw = calculateChanceIndex(TS_total, CS_weekly_norm, CQS_total, Moonshot_total);
    const CI_total = normalize(ciRaw.CI, 0, 100);
    const averageScore = (CQS_total + TS_total + RI_total + CI_total + Moonshot_total) / 5;
    const { CMS, entryState, GCMI, LIEF } = await calculateCMSFallback(coinId, CI_total, RI_total);
    console.log(CMS);
    
    const coinScore = await CoinScore.findOneAndUpdate(
      { coinId },
      {
        coinId,
        symbol: coinData.symbol?.toUpperCase(),
        name: coinData.name,
        logo,
        CQS: CQS_total,
        TS: TS_total,
        RI: RI_total,
        CMS: CMS,
        CI: CI_total,
        Moonshot: Moonshot_total,
        average: averageScore,
        entryState,  
        lastUpdated: new Date()
      },
      { upsert: true, new: true }
    );
    res.json({
      success: true,
      message: 'Coin metrics updated + CMS′ calculated successfully',
      data: { ...coinScore.toObject(), CMS: CMS.toFixed(2), GCMI, LIEF }
    });

  } catch (error) {
    console.error('Update and store coin error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};
