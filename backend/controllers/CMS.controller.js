// controllers/CMS.controller.js
import axios from "axios";

// In-memory cache with 5-minute expiration
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

const SMA = (data, period) => {
  if (!data || data.length < period) return null;
  const recent = data.slice(-period);
  return recent.reduce((a, b) => a + b, 0) / period;
};

export const calculateCMSFallback = async (coinId, CI, RI) => {
  try {
    // Check if we have cached data
    const cacheKey = `${coinId}_${CI}_${RI}`;
    const cached = cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      console.log(`Using cached data for ${coinId} (age: ${Math.round((Date.now() - cached.timestamp) / 1000)}s)`);
      return cached.data;
    }

    // Fetch fresh data with retry logic for 429 errors
    const marketData = await fetchWithRetry(coinId);
    
    const prices = marketData.prices.map(p => p[1]);
    const volumes = marketData.total_volumes.map(v => v[1]);
    const SMA50 = SMA(prices, 50);
    const SMA200 = SMA(prices, 200);
    const GCMI = SMA50 && SMA200 ? (SMA50 - SMA200) / SMA200 : 0;
    const SMA14Vol = SMA(volumes, 14);
    const SMA90Vol = SMA(volumes, 90);
    const LIEF = SMA14Vol && SMA90Vol ? (SMA14Vol - SMA90Vol) / SMA90Vol : 0;
    const CMS = 0.5 * CI - 0.25 * RI - 0.2 * GCMI + 0.05 * LIEF;
    console.log(CMS);
    

    let entryState = "Neutral";

    if (CMS <= -40) entryState = "Entry";
    else if (CMS < 0) entryState = "Build-Up";
    else if (CMS < 50) entryState = "Expansion";
    else if (CMS < 70) entryState = "Warning";
    else entryState = "Exit";

    const result = { CMS, entryState, GCMI, LIEF };

    cache.set(cacheKey, {
      data: result,
      timestamp: Date.now()
    });

    return result;

  } catch (err) {
    console.error(`CMS calc failed for ${coinId}:`, err.message);
    
    // Try to return stale cache if available
    const cacheKey = `${coinId}_${CI}_${RI}`;
    const staleCache = cache.get(cacheKey);
    if (staleCache) {
      console.log(`Returning stale cache for ${coinId} due to error`);
      return staleCache.data;
    }
    
    return { CMS: 0, entryState: "Neutral", GCMI: 0, LIEF: 0 };
  }
};

// Fetch with retry logic for 429 errors
async function fetchWithRetry(coinId, maxRetries = 3) {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const { data } = await axios.get(
        `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart`,
        { params: { vs_currency: "usd", days: 365 } }
      );
      return data;
      
    } catch (error) {
      if (error.response?.status === 429) {
        const retryAfter = error.response.headers['retry-after'];
        const waitTime = retryAfter 
          ? parseInt(retryAfter) * 1000 
          : Math.min(Math.pow(2, attempt) * 1000, 10000); 
        
        console.log(`Rate limited (429) for ${coinId}. Waiting ${waitTime}ms before retry ${attempt + 1}/${maxRetries}`);
        
        if (attempt < maxRetries - 1) {
          await new Promise(resolve => setTimeout(resolve, waitTime));
          continue;
        }
      }
      throw error;
    }
  }
  throw new Error(`Failed after ${maxRetries} retries`);
}

setInterval(() => {
  const now = Date.now();
  for (const [key, value] of cache.entries()) {
    if (now - value.timestamp > CACHE_DURATION) {
      cache.delete(key);
    }
  }
}, CACHE_DURATION);