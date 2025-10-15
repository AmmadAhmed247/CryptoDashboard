import axios from "axios";

/**
 * Normalize value to 0-100 range
 */
const normalize = (value, min, max) => {
  if (max === min) return 50;
  return Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100));
};

/**
 * Calculate Narrative Factor (NF) - 40% weight
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

  // Bonus for multiple matches
  if (matchedNarratives.length > 1) narrativeScore = Math.min(100, narrativeScore + 5);

  // Fallback for single coin with no match
  if (narrativeScore === 0) narrativeScore = 40;

  return { score: narrativeScore, narratives: [...new Set(matchedNarratives)] };
};

/**
 * Calculate Market Cap Factor - 30% weight
 */
const calculateMarketCapFactor = (marketCap, allMarketCaps) => {
  if (!marketCap || marketCap === 0) return 50; // fallback

  const validMcaps = allMarketCaps.filter((mc) => mc > 0);
  if (validMcaps.length <= 1) return 50; // fallback for single coin

  const minMcap = Math.min(...validMcaps);
  const maxMcap = Math.max(...validMcaps);

  const normalizedScore = 100 - normalize(marketCap, minMcap, maxMcap);
  const logScore =
    Math.log10(maxMcap / marketCap) / Math.log10(maxMcap / minMcap) * 100;

  return Math.min(100, normalizedScore * 0.4 + logScore * 0.6);
};

/**
 * Calculate Hype Score
 */
const calculateHypeScore = async (coinId, communityData) => {
  try {
    const metrics = {
      twitter: communityData.twitter_followers || 0,
      reddit: communityData.reddit_subscribers || 0,
      telegram: communityData.telegram_channel_user_count || 0,
    };

    const socialScore = calculateSocialVelocity(metrics);

    // Optional Reddit trending
    let redditTrending = 0;
    try {
      const redditResponse = await axios.get(
        "https://www.reddit.com/r/CryptoCurrency/search.json",
        {
          params: { q: coinId, sort: "new", t: "day", limit: 50 },
          headers: { "User-Agent": "CryptoScoreBot/1.0" },
        }
      );

      const posts = redditResponse.data.data.children || [];
      const recentEngagement = posts.reduce(
        (sum, post) => sum + (post.data.score || 0) + (post.data.num_comments || 0),
        0
      );
      redditTrending = Math.min(100, (recentEngagement / 1000) * 100);
    } catch {}

    return Math.min(100, socialScore * 0.7 + redditTrending * 0.3);
  } catch {
    return 50; // fallback
  }
};

/**
 * Social Velocity
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

  return count > 0 ? score / count : 50; // fallback
};

/**
 * Novelty Score
 */
const calculateNoveltyScore = (coinData) => {
  let noveltyScore = 50;
  const ageInDays = coinData.age_in_days || 0;
  const description = (coinData.description?.en || "").toLowerCase();

  if (ageInDays < 90) noveltyScore += 30;
  else if (ageInDays < 180) noveltyScore += 20;
  else if (ageInDays < 365) noveltyScore += 10;

  const keywords = [
    "first",
    "novel",
    "unique",
    "innovative",
    "breakthrough",
    "revolutionary",
    "pioneering",
    "cutting-edge",
    "next-generation",
  ];
  let matches = 0;
  keywords.forEach((k) => description.includes(k) && matches++);
  noveltyScore += Math.min(20, matches * 5);

  if (coinData.market_cap && coinData.market_cap < 10000000) noveltyScore += 10;

  return Math.min(100, noveltyScore);
};

/**
 * Main Moonshot Calculation
 */
const calculateMoonshotFactor = async (coinData, cqs, allMarketCaps = []) => {
  const narrativeResult = calculateNarrativeFactor(coinData, cqs);
  const nf = narrativeResult.score;

  const marketCap = coinData.market_data?.market_cap?.usd || 0;
  const mcFactor =
    allMarketCaps.length > 1
      ? calculateMarketCapFactor(marketCap, allMarketCaps)
      : 50; // fallback for single coin

  const hypeScore = await calculateHypeScore(
    coinData.id,
    coinData.community_data || {}
  );
  const noveltyScore = calculateNoveltyScore(coinData);

  const moonshotFactor = 0.4 * nf + 0.3 * mcFactor + 0.2 * hypeScore + 0.1 * noveltyScore;
  const cappedScore = Math.min(25, (moonshotFactor / 100) * 25);

  return {
    moonshotFactor: Math.round(moonshotFactor * 100) / 100,
    cappedForCI: Math.round(cappedScore * 100) / 100,
    breakdown: {
      narrativeFactor: {
        score: Math.round(nf * 100) / 100,
        weight: "40%",
        narratives: narrativeResult.narratives,
      },
      marketCapFactor: { score: Math.round(mcFactor * 100) / 100, weight: "30%" },
      hypeScore: { score: Math.round(hypeScore * 100) / 100, weight: "20%" },
      noveltyScore: { score: Math.round(noveltyScore * 100) / 100, weight: "10%" },
    },
    eligibility: {
      cqs,
      eligible: cqs >= 50,
      reason: cqs >= 50 ? "Meets CQS threshold" : "CQS below 50",
    },
  };
};

/**
 * Express Controller - Single Coin
 */
const getMoonshotFactor = async (req, res) => {
  try {
    const { coinId } = req.params;
    const { cqs } = req.query;
    if (!cqs) return res.status(400).json({ success: false, error: "CQS required" });

    const cqsValue = parseFloat(cqs);

    // Fetch coin data
    const { data: coinData } = await axios.get(
      `https://api.coingecko.com/api/v3/coins/${coinId}`,
      { params: { localization: false, tickers: false, market_data: true, community_data: true } }
    );

    coinData.age_in_days = Math.floor(
      (Date.now() - new Date(coinData.genesis_date || Date.now()).getTime()) /
        (1000 * 60 * 60 * 24)
    );

    const result = await calculateMoonshotFactor(coinData, cqsValue);

    res.json({ success: true, data: { coinId, coinName: coinData.name, symbol: coinData.symbol?.toUpperCase(), ...result, timestamp: new Date().toISOString() } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
};

export { getMoonshotFactor };

export const fetchMoonshotData = async (coinId, cqsValue) => {
  // 1️⃣ Fetch coin data from CoinGecko
  const response = await axios.get(
    `https://api.coingecko.com/api/v3/coins/${coinId}`,
    {
      params: {
        localization: false,
        tickers: false,
        market_data: true,
        community_data: true,
        developer_data: false
      }
    }
  );

  const coinData = response.data;

  // 2️⃣ Calculate coin age in days
  const genesisDate = new Date(coinData.genesis_date || Date.now());
  coinData.age_in_days = Math.floor((Date.now() - genesisDate.getTime()) / (1000 * 60 * 60 * 24));

  // 3️⃣ Calculate Moonshot Factor
  const result = await calculateMoonshotFactor(coinData, cqsValue);

  // 4️⃣ Return the structured result
  return {
    coinId,
    coinName: coinData.name,
    symbol: coinData.symbol?.toUpperCase(),
    ...result
  };
};