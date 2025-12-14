import axios from "axios";

// Standard normalization with min/max bounds (wider ranges for real data)
const normalize = (value, min, max) => {
  if (max === min) return 50;
  return Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100));
};

// Dynamic normalization based on array of values
const dynamicNormalize = (value, valuesArray, minOverride = null, maxOverride = null) => {
  if (!valuesArray.length) return 50;
  let min = Math.min(...valuesArray);
  let max = Math.max(...valuesArray);
  if (minOverride !== null) min = minOverride;
  if (maxOverride !== null) max = maxOverride;
  return max === min ? 50 : Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100));
};

// Calculate proper RSI using Wilder's smoothing method
const calculateRSI = (prices, period = 14) => {
  if (prices.length < period + 1) return 50;
  
  let gains = 0;
  let losses = 0;
  
  // Calculate initial average gain/loss
  for (let i = 1; i <= period; i++) {
    const change = prices[i] - prices[i - 1];
    if (change > 0) gains += change;
    else losses -= change;
  }
  
  let avgGain = gains / period;
  let avgLoss = losses / period;
  
  // Apply Wilder's smoothing for remaining periods
  for (let i = period + 1; i < prices.length; i++) {
    const change = prices[i] - prices[i - 1];
    if (change > 0) {
      avgGain = (avgGain * (period - 1) + change) / period;
      avgLoss = (avgLoss * (period - 1)) / period;
    } else {
      avgGain = (avgGain * (period - 1)) / period;
      avgLoss = (avgLoss * (period - 1) - change) / period;
    }
  }
  
  if (avgLoss === 0) return 100;
  const rs = avgGain / avgLoss;
  return 100 - (100 / (1 + rs));
};

export const calculateTimingScore = async (
  coinData, 
  CS_weekly_norm = 50, 
  allCoinsData = []
) => {
  try {
    const prices = coinData.market_data?.sparkline_7d?.price || [];
    const marketCap = coinData.market_data?.market_cap?.usd || 0;
    const volume = coinData.market_data?.total_volume?.usd || 0;

    // --- 1. Trend Momentum (TM) - 30% weight
    let TM = 50;
    let momentum = 0;
    let debugTM = {};
    if (prices.length > 2) {
      momentum = ((prices[prices.length - 1] - prices[0]) / prices[0]) * 100;
      debugTM.momentum = momentum;
      // Use dynamic normalization across all coins for fair comparison
      if (allCoinsData.length > 0) {
        const momentumArray = allCoinsData.map(c => {
          const p = c.market_data?.sparkline_7d?.price || [];
          return p.length > 2 ? ((p[p.length - 1] - p[0]) / p[0]) * 100 : 0;
        });
        // Use wider range for normalization
        TM = dynamicNormalize(momentum, momentumArray, -80, 80);
        debugTM.momentumArray = momentumArray;
      } else {
        // Fallback to wider fixed range if no comparison data
        TM = normalize(momentum, -80, 80);
      }
    }

    // --- 2. Volume/MarketCap Ratio (VL) - 20% weight
    let VL = 50;
    const vlRatio = marketCap > 0 ? volume / marketCap : 0;
    let debugVL = { vlRatio };
    if (allCoinsData.length > 0) {
      const vlArray = allCoinsData
        .map(c => {
          const vol = c.market_data?.total_volume?.usd || 0;
          const cap = c.market_data?.market_cap?.usd || 1;
          return cap > 0 ? vol / cap : 0;
        })
        .filter(v => v > 0); // Remove invalid values
      debugVL.vlArray = vlArray;
      if (vlArray.length > 0) {
        VL = dynamicNormalize(vlRatio, vlArray, 0.001, 5.0);
      }
    } else {
      // Typical V/MC ratio ranges from 0.001 to 5.0
      VL = normalize(vlRatio, 0.001, 5.0);
    }

    // --- 3. Market Breadth (MB) - 20% weight
    let MB = 50;
    let btcDominance = 50;
    let debugMB = {};
    try {
      const { data: global } = await axios.get(
        `https://api.coingecko.com/api/v3/global`,
        { timeout: 5000 }
      );
      btcDominance = global.data?.market_cap_percentage?.btc || 
                     global.data?.market_cap_percentage?.bitcoin || 50;
      debugMB.btcDominance = btcDominance;
      // Lower BTC dominance = better for alts (higher MB score)
      // Typical BTC dominance ranges from 35% to 65%
      MB = normalize(btcDominance, 65, 35); // Inverted: lower BTC dom = higher score
    } catch (err) {
      console.warn("Market breadth API call failed:", err.message);
      MB = 50;
      debugMB.error = err.message;
    }

    // --- 4. RSI - 15% weight
    let RSI_norm = 50;
    let RSI = 50;
    let debugRSI = {};
    if (prices.length > 15) {
      RSI = calculateRSI(prices, 14);
      debugRSI.RSI = RSI;
      // Normalize RSI: 10 (oversold) = 100, 90 (overbought) = 0
      // Values between 10-90 are full range
      if (RSI <= 10) {
        RSI_norm = 100; // Strong buy signal
      } else if (RSI >= 90) {
        RSI_norm = 0; // Overbought warning
      } else {
        RSI_norm = normalize(RSI, 90, 10); // Inverted normalization
      }
    }

    const TS = (
      0.30 * TM + 
      0.20 * VL + 
      0.20 * MB + 
      0.15 * RSI_norm + 
      0.15 * CS_weekly_norm
    );

    // Determine sentiment
    let sentiment = "Neutral Zone";
    if (TS >= 70) sentiment = "Strong Entry";
    else if (TS <= 40) sentiment = "Weak / Avoid";

    // Debug logging
    const debug = {
      coin: coinData.id || "unknown",
      TM: debugTM,
      VL: debugVL,
      MB: debugMB,
      RSI: debugRSI,
      CS_weekly_norm
    };

    return {
      TS: Number(TS.toFixed(2)),
      TS_norm: Number(TS.toFixed(2)),
      CS_weekly_norm,
      breakdown: {
        TM: Number(TM.toFixed(2)),
        VL: Number(VL.toFixed(2)),
        MB: Number(MB.toFixed(2)),
        RSI_norm: Number(RSI_norm.toFixed(2)),
        CS_weekly_norm: Number(CS_weekly_norm.toFixed(2))
      },
      sentiment,
      debug // Include for troubleshooting
    };
    
  } catch (err) {
    console.error("Error calculating TS:", err.message);
    return {
      TS: 50,
      TS_norm: 50,
      CS_weekly_norm,
      breakdown: { 
        TM: 50, 
        VL: 50, 
        MB: 50, 
        RSI_norm: 50, 
        CS_weekly_norm 
      },
      sentiment: "Neutral Zone",
      error: err.message
    };
  }
};

// Optional: Batch calculation helper for multiple coins
export const calculateTimingScoresForAll = async (allCoinsData, CS_weekly_norms = {}) => {
  const results = [];
  
  for (const coinData of allCoinsData) {
    const coinId = coinData.id;
    const CS_weekly_norm = CS_weekly_norms[coinId] || 50;
    
    const score = await calculateTimingScore(coinData, CS_weekly_norm, allCoinsData);
    results.push({
      coinId,
      ...score
    });
  }
  
  // Sort by TS descending
  return results.sort((a, b) => b.TS - a.TS);
};