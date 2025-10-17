import CoinScore from '../models/CoinScore.model.js';
import axios from 'axios';

// In-memory cache
let cachedData = null;
let lastFetchTime = 0;
const CACHE_DURATION = 10 * 1000; // 10 seconds

export const getTopCoinsWithFullData = async (req, res) => {
  try {
    const now = Date.now();

    // ✅ If cache is fresh, serve from memory
    if (cachedData && now - lastFetchTime < CACHE_DURATION) {
      console.log("Serving from cache ✅");
      return res.json({ success: true, data: cachedData });
    }

    // Otherwise fetch new data
    const coins = await CoinScore.find({}).limit(100);
    const symbols = coins.map(c => c.symbol.toUpperCase());

    const cmcResponse = await axios.get(
      'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest',
      {
        headers: {
          'X-CMC_PRO_API_KEY': process.env.CMC_API_KEY,
        },
        params: {
          start: 1,
          limit: 200, // Fetch enough data to match your local DB
          convert: 'USD',
        },
      }
    );

    const marketData = cmcResponse.data.data;

    const result = coins.map(coin => {
      const marketInfo = marketData.find(
        c => c.symbol.toUpperCase() === coin.symbol.toUpperCase()
      );

      return {
        ...coin._doc,
        price: marketInfo ? marketInfo.quote.USD.price : null,
        priceChange24h: marketInfo ? marketInfo.quote.USD.percent_change_24h : null,
        volume: marketInfo ? marketInfo.quote.USD.volume_24h : null,
        marketCap: marketInfo ? marketInfo.quote.USD.market_cap : null,
      };
    });
    cachedData = result;
    lastFetchTime = now;

    console.log("Fetched fresh data 🔄");
    res.json({ success: true, data: result });
  } catch (err) {
    console.error("Error fetching data:", err.message);

    if (cachedData) {
      console.log("Serving from cache due to API failure ⚠️");
      return res.json({ success: true, data: cachedData });
    }

    res.status(500).json({ success: false, error: err.message });
  }
};
