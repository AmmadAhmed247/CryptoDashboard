import axios from "axios";

/* -----------------------------------------------------------
   Utility: Normalize to 0–100 range
----------------------------------------------------------- */
const normalize = (value, min, max) => {
  if (max === min) return 50;
  return Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100));
};

/* -----------------------------------------------------------
   1️⃣  Narrative Factor (NF)
----------------------------------------------------------- */
const calculateNarrativeFactor = (coinData, cqs) => {
  if (cqs < 20) return { score: 0, narratives: [] };

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

  categories.forEach((category) => {
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

/* -----------------------------------------------------------
   2️⃣  MarketCapFactor (logarithmic normalization)
----------------------------------------------------------- */
const calculateMarketCapFactor = (marketCap, allMarketCaps) => {
  if (!marketCap || marketCap <= 0) return 50;

  const validMcaps = allMarketCaps.filter((m) => m > 0);
  if (validMcaps.length < 2) return 50;

  const minMcap = Math.min(...validMcaps);
  const maxMcap = Math.max(...validMcaps);

  const logMC = Math.log(marketCap);
  const logMin = Math.log(minMcap);
  const logMax = Math.log(maxMcap);

  const mcFactor = 100 * (1 - (logMC - logMin) / (logMax - logMin));
  return Math.min(95, Math.max(0, mcFactor));
};

const interpretMarketCapFactor = (score) => {
  if (score >= 90) return "Early-stage, low-cap (<$100M): high asymmetry";
  if (score >= 70) return "Mid-cap ($100M–$500M): balanced upside";
  if (score >= 50) return "Upper mid-cap ($500M–$2B): moderate upside";
  if (score >= 30) return "Large-cap ($2B–$10B): limited upside";
  return "Mega-cap (>$10B): minimal Moonshot potential";
};

/* -----------------------------------------------------------
   3️⃣  Hype / Social Velocity Score
----------------------------------------------------------- */
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

/* -----------------------------------------------------------
   4️⃣  Volatility Factor (ideal band: 20–60%)
----------------------------------------------------------- */
const calculateVolatility = async (coinId) => {
  try {
    const { data } = await axios.get(
      `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart`,
      { params: { vs_currency: "usd", days: 30, interval: "daily" } }
    );

    if (!data.prices?.length) return 50;

    const prices = data.prices.map((p) => p[1]);
    const returns = prices.slice(1).map(
      (p, i) => ((p - prices[i]) / prices[i]) * 100
    );
    const avg = returns.reduce((a, b) => a + b, 0) / returns.length;
    const variance =
      returns.reduce((sum, r) => sum + Math.pow(r - avg, 2), 0) /
      returns.length;
    const stdDev = Math.sqrt(variance);

    // Updated scoring: Relaxed criteria
    if (stdDev < 10) return 30; // Too stable
    if (stdDev <= 20) return normalize(stdDev, 10, 20) * 0.7; // Low volatility
    if (stdDev <= 30) return 100; // Ideal range
    if (stdDev <= 60) return 80; // High but acceptable
    return 50; // Too volatile
  } catch (err) {
    console.error("Volatility error:", err.message);
    return 50;
  }
};

/* -----------------------------------------------------------
   5️⃣  NEW: Developer Activity Score
----------------------------------------------------------- */
const calculateDevActivity = (coinData) => {
  const devData = coinData.developer_data;
  if (!devData) return 50;

  const stars = devData.stars || 0;
  const forks = devData.forks || 0;
  const subscribers = devData.subscribers || 0;
  const commits4Weeks = devData.commit_count_4_weeks || 0;
  const contributors = devData.pull_request_contributors || 0;

  const total =
    stars + forks + subscribers + commits4Weeks + contributors;

  if (total === 0) return 45; // fallback if no activity reported

  const starsScore = normalize(stars, 100, 10000);
  const forksScore = normalize(forks, 50, 5000);
  const commitsScore = normalize(commits4Weeks, 10, 200);
  const contributorsScore = normalize(contributors, 5, 100);

  const devScore =
    starsScore * 0.25 +
    forksScore * 0.15 +
    commitsScore * 0.35 +
    contributorsScore * 0.25;

  return Math.round(devScore);
};


/* -----------------------------------------------------------
   6️⃣  NEW: Social Sentiment Score (beyond just followers)
----------------------------------------------------------- */
const calculateSocialSentiment = (coinData) => {
  try {
    const sentiment = coinData.sentiment_votes_up_percentage || 50;
    const communityScore = coinData.community_score || 50;
    const publicInterest = coinData.public_interest_stats?.alexa_rank || 0;

    // Sentiment vote percentage (0-100)
    const sentimentScore = sentiment;

    // Community score (0-100)
    const communityNormalized = normalize(communityScore, 0, 100);

    // Alexa rank (lower is better, invert)
    const alexaScore = publicInterest > 0 
      ? normalize(100000 - Math.min(publicInterest, 100000), 0, 100000)
      : 50;

    // Weighted average
    const socialScore = 
      sentimentScore * 0.50 +
      communityNormalized * 0.30 +
      alexaScore * 0.20;

    return Math.round(socialScore);
  } catch (err) {
    console.error("Social sentiment error:", err.message);
    return 50;
  }
};

/* -----------------------------------------------------------
   7️⃣  NEW: Other Factors (Liquidity, Exchange Listings, Age)
----------------------------------------------------------- */
const calculateOtherFactors = (coinData) => {
  try {
    // Exchange listings (more = better distribution)
    const tickerCount = coinData.tickers?.length || 0;
    const exchangeScore = normalize(tickerCount, 5, 50);

    // Liquidity score from market data
    const liquidityScore = coinData.liquidity_score || 50;

    // Coin age (older = more established, but we want newer for moonshots)
    const genesisDate = coinData.genesis_date;
    let ageScore = 50;
    if (genesisDate) {
      const ageYears = (new Date() - new Date(genesisDate)) / (1000 * 60 * 60 * 24 * 365);
      // Newer coins score higher (inverse relationship)
      if (ageYears < 1) ageScore = 90;
      else if (ageYears < 2) ageScore = 75;
      else if (ageYears < 3) ageScore = 60;
      else if (ageYears < 5) ageScore = 45;
      else ageScore = 30;
    }

    // Market cap rank (lower rank number = higher score)
    const marketCapRank = coinData.market_cap_rank || 500;
    const rankScore = normalize(500 - Math.min(marketCapRank, 500), 0, 500);

    // Weighted average
    const otherScore = 
      exchangeScore * 0.25 +
      liquidityScore * 0.25 +
      ageScore * 0.30 +
      rankScore * 0.20;

    return Math.round(otherScore);
  } catch (err) {
    console.error("Other factors error:", err.message);
    return 50;
  }
};

/* -----------------------------------------------------------
   8️⃣  Main Moonshot Factor Calculation (UPDATED)
----------------------------------------------------------- */
const calculateMoonshotFactor = async (
  coinData,
  cqs,
  allMarketCaps = [],
  mode = "balanced"
) => {
  const narrativeResult = calculateNarrativeFactor(coinData, cqs);
  const nf = narrativeResult.score;

  const marketCap = coinData.market_data?.market_cap?.usd || 0;
  const mcFactor =
    allMarketCaps.length > 1
      ? calculateMarketCapFactor(marketCap, allMarketCaps)
      : 50;

  const hypeScore = calculateHypeScore(coinData.community_data || {});
  const volatilityScore = await calculateVolatility(coinData.id);
  
  // ✅ NEW: Calculate all factors
  const devActivity = calculateDevActivity(coinData);
  const socialSentiment = calculateSocialSentiment(coinData);
  const otherFactors = calculateOtherFactors(coinData);

  // Updated weights to include new factors
  const weights =
    mode === "aggressive"
      ? { NF: 0.25, MC: 0.25, Hype: 0.15, Vol: 0.10, Dev: 0.10, Social: 0.10, Other: 0.05 }
      : mode === "explorative"
      ? { NF: 0.20, MC: 0.25, Hype: 0.15, Vol: 0.10, Dev: 0.15, Social: 0.10, Other: 0.05 }
      : { NF: 0.20, MC: 0.30, Hype: 0.15, Vol: 0.10, Dev: 0.10, Social: 0.10, Other: 0.05 };

  const moonshotFactor =
    weights.NF * nf +
    weights.MC * mcFactor +
    weights.Hype * hypeScore +
    weights.Vol * volatilityScore +
    weights.Dev * devActivity +
    weights.Social * socialSentiment +
    weights.Other * otherFactors;

  // Updated eligibility: Relaxed volatility range
  const eligible =
    cqs >= 20 && volatilityScore >= 20 && volatilityScore <= 60;

  return {
    moonshotFactor: Math.round(moonshotFactor * 100) / 100,
    breakdown: {
      narrativeFactor: {
        score: nf,
        weight: `${weights.NF * 100}%`,
        narratives: narrativeResult.narratives,
      },
      marketCapFactor: {
        score: mcFactor,
        weight: `${weights.MC * 100}%`,
        interpretation: interpretMarketCapFactor(mcFactor),
      },
      hypeScore: { 
        score: hypeScore, 
        weight: `${weights.Hype * 100}%` 
      },
      volatilityScore: {
        score: volatilityScore,
        weight: `${weights.Vol * 100}%`,
      },
      devActivity: {
        score: devActivity,
        weight: `${weights.Dev * 100}%`,
      },
      socialSentiment: {
        score: socialSentiment,
        weight: `${weights.Social * 100}%`,
      },
      otherFactors: {
        score: otherFactors,
        weight: `${weights.Other * 100}%`,
      },
    },
    eligibility: {
      cqs,
      volatilityScore,
      eligible,
      reason: eligible
        ? "Meets CQS and volatility criteria"
        : cqs < 20
        ? "CQS below 20"
        : volatilityScore < 20
        ? "Volatility too low"
        : "Volatility too high (>60%)",
    },
  };
};

/* -----------------------------------------------------------
   9️⃣  Express Controller (UPDATED)
----------------------------------------------------------- */
const getMoonshotFactor = async (req, res) => {
  try {
    const { coinId } = req.params;
    const { cqs, mode } = req.query;
    if (!cqs) return res.status(400).json({ success: false, error: "CQS required" });

    const cqsValue = parseFloat(cqs);

    const { data: coinData } = await axios.get(
      `https://api.coingecko.com/api/v3/coins/${coinId}`,
      {
        params: {
          localization: false,
          tickers: true, // ✅ Need this for exchange count
          market_data: true,
          community_data: true,
          developer_data: true, // ✅ Need this for dev activity
        },
      }
    );

    const result = await calculateMoonshotFactor(coinData, cqsValue, [], mode);

    res.json({
      success: true,
      data: {
        coinId,
        name: coinData.name,
        symbol: coinData.symbol?.toUpperCase(),
        logo: coinData.image?.large || coinData.image?.small,
        price: coinData.market_data?.current_price?.usd || 0,
        marketCap: coinData.market_data?.market_cap?.usd || 0,
        volume: coinData.market_data?.total_volume?.usd || 0,
        priceChange24h: coinData.market_data?.price_change_percentage_24h || 0,
        
        // Main Moonshot Score
        Moonshot: result.moonshotFactor,
        
        // ✅ Complete Moonshot Breakdown
        MoonshotFactors: {
          volatilityScore: result.breakdown.volatilityScore.score,
          hypeScore: result.breakdown.hypeScore.score,
          narrativeFactor: result.breakdown.narrativeFactor.score,
          marketCapFactor: result.breakdown.marketCapFactor.score,
          devActivity: result.breakdown.devActivity.score,
          socialSentiment: result.breakdown.socialSentiment.score,
          otherFactors: result.breakdown.otherFactors.score,
        },
        
        CQS: cqsValue,
        CI: 0,
        RI: 0,
        TS: 0,
        
        eligibility: result.eligibility,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
};

export { getMoonshotFactor, calculateMoonshotFactor };

export const fetchMoonshotData = async (coinId, cqsValue, mode = "balanced") => {
  const { data: coinData } = await axios.get(
    `https://api.coingecko.com/api/v3/coins/${coinId}`,
    {
      params: {
        localization: false,
        tickers: true,
        market_data: true,
        community_data: true,
        developer_data: true,   
      },
    }
  );

  return await calculateMoonshotFactor(coinData, cqsValue, [], mode);
};
