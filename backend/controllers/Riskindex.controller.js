import axios from "axios";

const normalize = (value, min, max) => {
  if (isNaN(value)) return 50;
  return Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100));
};

export const calculateRiskIndex = async (coinData) => {
  try {
    const prices = coinData.market_data?.sparkline_7d?.price || [];
    const marketCap = coinData.market_data?.market_cap?.usd || 1;

    // --- 1️⃣ ATR_norm (Average True Range, normalized 0–100) ---
    let atrSum = 0;
    for (let i = 1; i < prices.length; i++) {
      atrSum += Math.abs(prices[i] - prices[i - 1]);
    }
    const avgTrueRange = atrSum / (prices.length || 1);
    const atrNorm = normalize(avgTrueRange, 0, (prices[0] || 1) * 0.1); // up to 10% swings → 100

    // --- 2️⃣ DD_30d_norm (30-day Drawdown) ---
    const maxPrice = Math.max(...prices, 0);
    const currentPrice = prices[prices.length - 1] || 0;
    const drawdown = maxPrice ? ((maxPrice - currentPrice) / maxPrice) * 100 : 0;
    const dd30d_norm = normalize(drawdown, 0, 50); // 50% drawdown = 100 risk

    // --- 3️⃣ Volatility_norm (Standard Deviation / MarketCap) ---
    const mean = prices.length
      ? prices.reduce((sum, p) => sum + p, 0) / prices.length
      : 0;
    const variance = prices.length
      ? prices.reduce((sum, p) => sum + Math.pow(p - mean, 2), 0) / prices.length
      : 0;
    const stdDev = Math.sqrt(variance);
    const volRatio = mean ? stdDev / mean : 0;
    const volatility_norm = normalize(volRatio, 0, 0.15);

    // --- 4️⃣ ExitTriggerFactor (Placeholder random value) ---
    const exitTriggerFactor = Math.random() * 20 + 40; // 40–60

    // --- Final Risk Index Formula ---
    const RI =
      0.35 * atrNorm +
      0.25 * dd30d_norm +
      0.2 * volatility_norm +
      0.2 * exitTriggerFactor;

    // --- Risk Level ---
    const riskLevel =
      RI < 50 ? "Low Risk" :
      RI < 75 ? "Medium Risk" :
      "High Risk";

    return {
      RI: Number(RI.toFixed(2)),
      breakdown: {
        ATR_norm: Number(atrNorm.toFixed(2)),
        DD_30d_norm: Number(dd30d_norm.toFixed(2)),
        Volatility_norm: Number(volatility_norm.toFixed(2)),
        ExitTriggerFactor: Number(exitTriggerFactor.toFixed(2))
      },
      riskLevel
    };

  } catch (error) {
    console.error("❌ Error calculating Risk Index:", error.message);
    return {
      RI: 50,
      breakdown: { ATR_norm: 50, DD_30d_norm: 50, Volatility_norm: 50, ExitTriggerFactor: 50 },
      riskLevel: "Medium Risk"
    };
  }
};
