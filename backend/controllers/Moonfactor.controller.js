import axios from "axios";

/**
 * Normalize value to 0-100 range
 */
const normalize = (value, min, max) => {
  if (max === min) return 50;
  return Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100));
};

/**
 * Narrative Factor (NF)
 */
const calculateNarrativeFactor = (coinData, cqs) => {
  if (cqs < 50) return { score: 0, narratives: [] };

  const categories = coinData.categories || [];
  const description = (coinData.description?.en || "").toLowerCase();

  const narrativeScores = {
    "artificial-intelligence": 95,
    ai: 95,
    "layer-2": 85,
    "layer-1": 75,
    "defi-2-0": 90,
    "decentralized-finance-defi": 80,
    "meme-token": 70,
    gaming: 75,
    metaverse: 80,
    "real-world-assets": 85,
    "privacy-coins": 70,
    "zk-rollups": 90,
    "modular-blockchain": 85,
  };

  let narrativeScore = 0;
  let matchedNarratives = [];

  categories.forEach(category => {
    const catLower = category.toLowerCase();
    for (const [narrative, score] of Object.entries(narrativeScores)) {
      if (catLower.includes(narrative)) {
        if (score > narrativeScore) narrativeScore = score;
        matchedNarratives.push(narrative);
      }
    }
  });

  const descriptionKeywords = {
    "artificial intelligence": 95,
    "machine learning": 90,
    "layer 2": 85,
    rollup: 85,
    "zero knowledge": 90,
    "defi 2.0": 90,
    "real world asset": 85,
    modular: 80,
  };

  for (const [keyword, score] of Object.entries(descriptionKeywords)) {
    if (description.includes(keyword) && score > narrativeScore) {
      narrativeScore = score;
      matchedNarratives.push(keyword);
    }
  }

  if (matchedNarratives.length > 1) narrativeScore = Math.min(100, narrativeScore + 5);
  if (narrativeScore === 0) narrativeScore = 40;

  return { score: narrativeScore, narratives: [...new Set(matchedNarratives)] };
};

/**
 * Market Cap Factor
 */
const calculateMarketCapFactor = (marketCap, allMarketCaps) => {
  if (!marketCap || marketCap === 0) return 50;

  const validMcaps = allMarketCaps.filter(mc => mc > 0);
  if (validMcaps.length <= 1) return 50;

  const minMcap = Math.min(...validMcaps);
  const maxMcap = Math.max(...validMcaps);

  const normalizedScore = 100 - normalize(marketCap, minMcap, maxMcap);
  const logScore = Math.log10(maxMcap / marketCap) / Math.log10(maxMcap / minMcap) * 100;

  return Math.min(100, normalizedScore * 0.4 + logScore * 0.6);
};

/**
 * Social / Hype Score
 */
const calculateSocialVelocity = (metrics) => {
  const thresholds = {
    twitter: { low: 1000, high: 100000 },
    reddit: { low: 500, high: 50000 },
    telegram: { low: 500, high: 20000 },
  };

  let score = 0;
  let count = 0;

  for (const [platform, value] of Object.entries(metrics)) {
    if (value > 0 && thresholds[platform]) {
      const { low, high } = thresholds[platform];
      score += normalize(value, low, high);
      count++;
    }
  }

  return count > 0 ? score / count : 50;
};

const calculateHypeScore = (communityData) => {
  const metrics = {
    twitter: communityData.twitter_followers || 0,
    reddit: communityData.reddit_subscribers || 0,
    telegram: communityData.telegram_channel_user_count || 0,
  };

  return calculateSocialVelocity(metrics);
};

/**
 * Volatility Factor
 */
const calculateVolatility = async (coinId) => {
  try {
    const { data } = await axios.get(
      `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart`,
      { params: { vs_currency: "usd", days: 30, interval: "daily" } }
    );

    if (!data.prices || data.prices.length < 2) return 50; // fallback

    const prices = data.prices.map(p => p[1]);
    const returns = prices.slice(1).map((p, i) => ((p - prices[i]) / prices[i]) * 100);
    const avg = returns.reduce((a,b)=>a+b,0)/returns.length;
    const variance = returns.reduce((sum,r)=>sum+Math.pow(r-avg,2),0)/returns.length;
    const stdDev = Math.sqrt(variance);

    return Math.max(0, Math.min(100, 100 - stdDev));
  } catch (err) {
    console.error("Volatility error:", err.message);
    return 50;
  }
};


/**
 * Novelty Factor
 */
const calculateNoveltyScore = (coinData) => {
  let noveltyScore = 50;
  const ageInDays = coinData.age_in_days || 0;
  const description = (coinData.description?.en || "").toLowerCase();

  if (ageInDays < 90) noveltyScore += 30;
  else if (ageInDays < 180) noveltyScore += 20;
  else if (ageInDays < 365) noveltyScore += 10;

  const keywords = ["first","novel","unique","innovative","breakthrough","revolutionary","pioneering","cutting-edge","next-generation"];
  let matches = 0;
  keywords.forEach(k => description.includes(k) && matches++);
  noveltyScore += Math.min(20, matches * 5);

  if (coinData.market_cap && coinData.market_cap < 10000000) noveltyScore += 10;

  return Math.min(100, noveltyScore);
};

/**
 * Main Moonshot Factor Calculation
 */
const calculateMoonshotFactor = async (coinData, cqs, allMarketCaps = []) => {
  const narrativeResult = calculateNarrativeFactor(coinData, cqs);
  const nf = narrativeResult.score;

  const marketCap = coinData.market_data?.market_cap?.usd || 0;
  const mcFactor = allMarketCaps.length > 1 ? calculateMarketCapFactor(marketCap, allMarketCaps) : 50;

  const hypeScore = calculateHypeScore(coinData.community_data || {});
  const noveltyScore = calculateNoveltyScore(coinData);
  const volatilityScore = await calculateVolatility(coinData.id);

  const moonshotFactor = 0.35 * nf + 0.25 * mcFactor + 0.15 * hypeScore + 0.15 * volatilityScore + 0.1 * noveltyScore;
  const cappedScore = Math.min(25, (moonshotFactor / 100) * 25);

  return {
    moonshotFactor: Math.round(moonshotFactor * 100) / 100,
    cappedForCI: Math.round(cappedScore * 100) / 100,
    breakdown: {
      narrativeFactor: { score: Math.round(nf * 100)/100, weight:"35%", narratives: narrativeResult.narratives },
      marketCapFactor: { score: Math.round(mcFactor*100)/100, weight:"25%" },
      hypeScore: { score: Math.round(hypeScore*100)/100, weight:"15%" },
      volatilityScore: { score: Math.round(volatilityScore*100)/100, weight:"15%" },
      noveltyScore: { score: Math.round(noveltyScore*100)/100, weight:"10%" },
    },
    eligibility: { cqs, eligible: cqs >= 50, reason: cqs >= 50 ? "Meets CQS threshold" : "CQS below 50" },
  };
};

/**
 * Express Controller
 */
const getMoonshotFactor = async (req, res) => {
  try {
    const { coinId } = req.params;
    const { cqs } = req.query;
    if (!cqs) return res.status(400).json({ success:false, error:"CQS required" });

    const cqsValue = parseFloat(cqs);

    const { data: coinData } = await axios.get(`https://api.coingecko.com/api/v3/coins/${coinId}`, {
      params: { localization:false, tickers:false, market_data:true, community_data:true }
    });

    coinData.age_in_days = Math.floor((Date.now() - new Date(coinData.genesis_date || Date.now()).getTime()) / (1000*60*60*24));

    const result = await calculateMoonshotFactor(coinData, cqsValue);

    res.json({ success:true, data:{ coinId, coinName: coinData.name, symbol: coinData.symbol?.toUpperCase(), ...result, timestamp:new Date().toISOString() } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success:false, error:error.message });
  }
};

export { getMoonshotFactor };

export const fetchMoonshotData = async (coinId, cqsValue) => {
  const { data: coinData } = await axios.get(`https://api.coingecko.com/api/v3/coins/${coinId}`, {
    params: { localization:false, tickers:false, market_data:true, community_data:true }
  });

  coinData.age_in_days = Math.floor((Date.now() - new Date(coinData.genesis_date || Date.now()).getTime()) / (1000*60*60*24));

  return await calculateMoonshotFactor(coinData, cqsValue);
};
