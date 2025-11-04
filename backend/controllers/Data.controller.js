import axios from "axios";

import * as cheerio from 'cheerio';
export const fearAndGreedIndex = async (req , res) => {
  try {
    const response = await axios.get('https://api.alternative.me/fng/?limit=1');
    return res.json({ value: response.data.data[0].value });
  } catch (error) {
    console.error('Error fetching Fear and Greed Index:', error);
    return res.status(500).json({ error: 'Failed to fetch Fear and Greed Index' });
  }
};
export const getHalvingData = async (req, res) => {
  try {
    // Fetch real-time Bitcoin stats
    const response = await axios.get("https://api.blockchair.com/bitcoin/stats");
    const currentBlock = response.data.data.blocks;

    const lastHalvingBlock = 840000;
    const nextHalvingBlock = 1050000;
    const blocksRemaining = nextHalvingBlock - currentBlock;

    // Bitcoin block time ~10 minutes
    const minutesPerBlock = 10;
    const daysRemaining = Math.floor((blocksRemaining * minutesPerBlock) / (60 * 24));

    const today = new Date();
    const estimatedDate = new Date(today);
    estimatedDate.setDate(today.getDate() + daysRemaining);

    res.json({
      currentBlock,
      nextHalvingBlock,
      blocksRemaining,
      daysRemaining,
      estimatedDate: estimatedDate.toISOString().split("T")[0],
    });
  } catch (error) {
    console.error("Error fetching halving data:", error.message);
    res.status(500).json({ message: "Failed to fetch halving data" });
  }
};
export const getAltseasonIndex = async (req, res) => {
  try {
    // Fetch global crypto market data from CoinGecko
    const response = await axios.get(
      "https://api.coingecko.com/api/v3/global"
    );

    const data = response.data.data;

    // Extract Bitcoin dominance (used as a rough indicator for altseason)
    const btcDominance = data.market_cap_percentage?.btc;

    // Approximate Altseason Index (for demonstration)
    // Example logic: higher BTC dominance = less altseason
    // So Altseason Index = 100 - BTC dominance
    const altseasonIndex = 100 - btcDominance;

    res.json({ value: parseFloat(altseasonIndex.toFixed(0)) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const formatNumber = (num) => {
  if (num >= 1e12) return (num / 1e12).toFixed(2) + "T";
  if (num >= 1e9)  return (num / 1e9).toFixed(2) + "B";
  if (num >= 1e6)  return (num / 1e6).toFixed(2) + "M";
  if (num >= 1e3)  return (num / 1e3).toFixed(2) + "K";
  return num.toFixed(2);
};
export const getGlobalMarketData = async (req, res) => {
  try {
    const response = await axios.get(
      "https://pro-api.coinmarketcap.com/v1/global-metrics/quotes/latest",
      {
        headers: {
          "X-CMC_PRO_API_KEY": process.env.CMC_API_KEY, // your API key
        },
      }
    );

    const data = response.data.data;

    const marketData = {
      total_market_cap: {
        value: `$${formatNumber(data.quote.USD.total_market_cap)}`,
        change_24h: `${data.quote.USD.total_market_cap_yesterday_percentage_change.toFixed(2)}%`,
      },
      total_volume_24h: {
        value: `$${formatNumber(data.quote.USD.total_volume_24h)}`,
        change_24h: `${data.quote.USD.total_volume_24h_yesterday_percentage_change.toFixed(2)}%`,
      },
      btc_dominance: {
        value: `${data.btc_dominance.toFixed(2)}%`,
        change_24h: `${data.btc_dominance_24h_percentage_change.toFixed(2)}%`,
      },
      eth_dominance: {
        value: `${data.eth_dominance.toFixed(2)}%`,
        change_24h: `${data.eth_dominance_24h_percentage_change.toFixed(2)}%`,
      },
      active_cryptocurrencies: formatNumber(data.active_cryptocurrencies),
    };

    res.json(marketData);
  } catch (error) {
    console.error("Error fetching CoinMarketCap data:", error.message);
    res.status(500).json({ message: "Failed to fetch global market data" });
  }
};


let cacheTimestamp = null;
let cachedNews = null;
export const getCryptoNews = async (req, res) => {
  const CACHE_DURATION = 1000 * 60 * 5; // 5 minutes

  try {
    // Return cached response if still valid
    if (cachedNews && cacheTimestamp && Date.now() - cacheTimestamp < CACHE_DURATION) {
      return res.json(cachedNews);
    }

    const response = await axios.get("https://gnews.io/api/v4/search", {
      params: {
        q: "cryptocurrency OR bitcoin OR ethereum",
        lang: "en",
        country: "us",
        max: 10,
        apikey: process.env.GNEWS_API_KEY,
      },
    });

    cachedNews = response.data;
    cacheTimestamp = Date.now();

    res.json(response.data);
  } catch (error) {
    console.error("Error fetching GNews:", error.response?.data || error.message);
    res.status(500).json({ message: "Failed to fetch crypto news" });
  }
};