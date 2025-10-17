import CoinScore from '../models/CoinScore.model.js';
import axios from 'axios';
import { calculateCQSValue } from './CQS.controller.js';
import { calculateTimingScore } from './TimingScore.controller.js';
import { fetchMoonshotData } from './Moonfactor.controller.js';
import { calculateRiskIndex } from './Riskindex.controller.js';
import { calculateChanceIndex } from './ChanceIndex.controller.js';

// Helper to normalize any value between 0-100
const normalize = (value, min = 0, max = 100) => {
  if (typeof value !== 'number' || isNaN(value)) return 0;
  if (max - min === 0) return 0;
  let result = ((value - min) / (max - min)) * 100;
  if (result < 0) result = 0;
  if (result > 100) result = 100;
  return result;
};

export const updateAndStoreCoin = async (req, res) => {
  try {
    const { coinId } = req.params;

    // 1️⃣ Fetch coin data
    const response = await axios.get(`https://api.coingecko.com/api/v3/coins/${coinId}`, {
  params: {
    localization: false,
    tickers: false,
    market_data: true,
    community_data: true,
    developer_data: true,
    sparkline: true // <--- important
  }
});

    const coinData = response.data;
    const logo = coinData.image?.small || coinData.image?.thumb || "";


    // 2️⃣ Calculate CQS
    const cqsResult = calculateCQSValue(coinData);  
const CQS_total = cqsResult.CQS; // adjust max based on expected CQS scale

    // 3️⃣ Calculate Timing Score
    const tsResult = await calculateTimingScore(coinData);
const TS_total = tsResult.TS; // adjust scale if TS is already 0-100

    // 4️⃣ Calculate Moonshot Factors
    const moonshotResult = await fetchMoonshotData(coinId, cqsResult.CQS);
    console.log('Moonshot raw result:', moonshotResult);

    const moonshotFactors = {
  volatilityScore: normalize(moonshotResult.breakdown.narrativeFactor?.score || 0, 0, 100),
  hypeScore: normalize(moonshotResult.breakdown.hypeScore?.score || 0, 0, 100),
  devActivity: normalize(moonshotResult.breakdown.noveltyScore?.score || 0, 0, 100),
  otherFactors: normalize(moonshotResult.breakdown.marketCapFactor?.score || 0, 0, 100),
  socialSentiment: 50 // if API does not have socialSentiment
};



   const Moonshot_total = Object.values(moonshotFactors).reduce((a, b) => a + b, 0);
const Moonshot_total_normalized = normalize(Moonshot_total, 0, 400);


    // 5️⃣ Calculate Risk Index
    const riResult = await calculateRiskIndex(coinData);
    const RI_total = normalize(riResult.RI, 0, 100);

    // 6️⃣ Calculate Chance Index
    const TS_norm = TS_total;
    const CS_weekly_norm = tsResult.breakdown?.CS_weekly_norm || 50;
    const CQS_norm = CQS_total;
    const ciRaw = calculateChanceIndex(TS_total, CS_weekly_norm, CQS_total, Moonshot_total_normalized);

    console.log('Chance Index raw:', ciRaw);
    

    const CI_total = normalize(ciRaw.CI, 0, 100);
    console.log('Chance Index normalized:', CI_total);
    

    // 7️⃣ Calculate average of top-level scores (normalized)
    const averageScore = (CQS_total + TS_total + RI_total + CI_total + Moonshot_total_normalized) / 5;
if (!coinData?.market_data?.sparkline_7d?.price?.length) {
  console.warn(`⚠️ Missing sparkline_7d data for ${coinData.id}`);
  // Handle missing data case (e.g., set default values)
}

    // 8️⃣ Upsert into MongoDB
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
        CI: CI_total,
        Moonshot: Moonshot_total_normalized,
        MoonshotFactors: moonshotFactors,
        average: averageScore,
        lastUpdated: new Date()
      },
      { upsert: true, new: true }
    );

    res.json({
      success: true,
      message: 'Coin metrics updated successfully',
      data: coinScore
    });

  } catch (error) {
    console.error('Update and store coin error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

export const fetchCoinById = async (req, res) => {
  try {
    const { coinId } = req.params;
    const coinScore = await CoinScore.findOne({ coinId });

    if (!coinScore) {
      return res.status(404).json({
        success: false,
        error: 'Coin not found. Please update the coin first.'
      });
    }

    res.json({
      success: true,
      data: coinScore,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Fetch coin error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};
