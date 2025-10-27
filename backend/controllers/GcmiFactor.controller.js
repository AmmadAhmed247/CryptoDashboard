import axios from "axios";
import GCMI from "../models/gcmi.model.js";

/* -----------------------------------------------------------
   Configuration
----------------------------------------------------------- */
const CONFIG = {
  COINGECKO_API: "https://api.coingecko.com/api/v3",
  DAYS_TO_FETCH: 730,
  REQUEST_TIMEOUT: 20000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 2000,
};

/* -----------------------------------------------------------
   Utility: Retry with exponential backoff
----------------------------------------------------------- */
const retryWithBackoff = async (fn, retries = CONFIG.RETRY_ATTEMPTS) => {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === retries - 1) throw error;
      if (error.response?.status === 429) {
        const delay = CONFIG.RETRY_DELAY * Math.pow(2, i);
        console.log(`⚠️ Rate limited. Retry ${i + 1}/${retries} after ${delay}ms...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      } else {
        throw error;
      }
    }
  }
};

/* -----------------------------------------------------------
   Utility: Normalize to 0–100 range
----------------------------------------------------------- */
const normalize = (value, min, max, invert = false) => {
  if (value === null || value === undefined || isNaN(value)) return 50;
  if (max === min) return 50;
  let norm = ((value - min) / (max - min)) * 100;
  norm = Math.max(0, Math.min(100, norm));
  return invert ? 100 - norm : norm;
};

/* -----------------------------------------------------------
   Utility: Moving Average
----------------------------------------------------------- */
const movingAvg = (arr, n) => {
  const result = new Array(arr.length).fill(null);
  for (let i = n - 1; i < arr.length; i++) {
    const slice = arr.slice(i - n + 1, i + 1);
    result[i] = slice.reduce((a, b) => a + b, 0) / n;
  }
  return result;
};

/* -----------------------------------------------------------
   RSI
----------------------------------------------------------- */
const calculateRSI = (prices, period = 14) => {
  const result = new Array(prices.length).fill(null);
  for (let i = period; i < prices.length; i++) {
    let gains = 0,
      losses = 0;
    for (let j = i - period + 1; j <= i; j++) {
      const diff = prices[j] - prices[j - 1];
      if (diff > 0) gains += diff;
      else losses -= diff;
    }
    const avgGain = gains / period;
    const avgLoss = losses / period;
    if (avgLoss === 0) result[i] = 100;
    else {
      const rs = avgGain / avgLoss;
      result[i] = 100 - 100 / (1 + rs);
    }
  }
  return result;
};

/* -----------------------------------------------------------
   Fetch Bitcoin Data (Binance + CoinPaprika)
----------------------------------------------------------- */
const fetchBTCData = async () => {
  return retryWithBackoff(async () => {
    const BINANCE_KLINES_URL = "https://api.binance.com/api/v3/klines";
    const COINPAPRIKA_TICKER = "https://api.coinpaprika.com/v1/tickers/btc-bitcoin";

    const { data: klines } = await axios.get(BINANCE_KLINES_URL, {
      params: { symbol: "BTCUSDT", interval: "1d", limit: 1000 },
      timeout: CONFIG.REQUEST_TIMEOUT,
    });

    const prices = klines.map((k) => ({
      timestamp: Number(k[0]),
      date: new Date(Number(k[0])).toISOString().split("T")[0],
      price: Number(k[4]),
      volume: Number(k[7]),
    }));

    let circulatingSupply = null;
    try {
      const supplyResp = await axios.get(COINPAPRIKA_TICKER);
      circulatingSupply = Number(supplyResp.data.circulating_supply);
    } catch {
      circulatingSupply = null;
    }

    const marketCaps = prices.map((p) => ({
      date: p.date,
      marketCap: circulatingSupply ? p.price * circulatingSupply : null,
    }));

    return { prices, marketCaps, volumes: prices.map((p) => ({ date: p.date, volume: p.volume })) };
  });
};

/* -----------------------------------------------------------
   Indicator Approximations
----------------------------------------------------------- */
const calculateMVRVApprox = (prices) => {
  const arr = prices.map((p) => p.price);
  const ma200 = movingAvg(arr, 200);
  return prices.map((p, i) => (!ma200[i] ? null : { date: p.date, mvrv: p.price / ma200[i] }));
};

const calculatePuellApprox = (prices) => {
  const arr = prices.map((p) => p.price);
  const ma50 = movingAvg(arr, 50);
  const ma200 = movingAvg(arr, 200);
  return prices.map((p, i) => (!ma50[i] || !ma200[i] ? null : { date: p.date, puell: (ma50[i] / ma200[i]) * 2 }));
};

const calculateReserveRisk = (prices, marketCaps, volumes) =>
  prices.map((p, i) => {
    const cap = marketCaps[i]?.marketCap;
    const vol = volumes[i]?.volume;
    if (!cap || !vol) return null;
    const rr = 1 / (cap / vol) * 10000;
    return { date: p.date, reserveRisk: Math.min(rr, 100) };
  });

const calculateNUPLApprox = (prices) => {
  const arr = prices.map((p) => p.price);
  const rsi = calculateRSI(arr);
  return prices.map((p, i) => (!rsi[i] ? null : { date: p.date, nupl: ((rsi[i] - 50) / 100) * 1.25 }));
};

const calculateFearGreed = (prices) => {
  const arr = prices.map((p) => p.price);
  const ma50 = movingAvg(arr, 50);
  const rsi = calculateRSI(arr);
  return prices.map((p, i) => {
    if (!ma50[i] || !rsi[i]) return null;
    const momentum = (p.price / ma50[i] - 1) * 100;
    const score = rsi[i] * 0.7 + (50 + momentum) * 0.3;
    return { date: p.date, fearGreed: Math.max(0, Math.min(100, score)) };
  });
};

/* -----------------------------------------------------------
   Calculate GCMI
----------------------------------------------------------- */
const calculateGCMI = async () => {
  const { prices, marketCaps, volumes } = await fetchBTCData();

  // Indicator approximations
  const mvrv = calculateMVRVApprox(prices);         // MVRV 200MA
  const puell = calculatePuellApprox(prices);       // Puell multiple
  const rr = calculateReserveRisk(prices, marketCaps, volumes);
  const nupl = calculateNUPLApprox(prices);
  const fg = calculateFearGreed(prices);

  const arr = prices.map((p) => p.price);
  const ma111 = movingAvg(arr, 111);
  const ma350 = movingAvg(arr, 350);
  const ma50 = movingAvg(arr, 50);
  const ma200 = movingAvg(arr, 200);

  // First pass: collect raw indicator arrays to compute dynamic min/max ranges
  const rawLists = {
    pi: [],
    mvrv: [],
    puell: [],
    rr: [],
    nupl: [],
    fg: [],
    cross: [],
  };

  for (let i = 0; i < prices.length; i++) {
    if (!ma111[i] || !ma350[i] || !ma50[i] || !ma200[i]) continue;
    const piCycle = ma111[i] / ma350[i];
    const m = mvrv[i]?.mvrv;
    const pu = puell[i]?.puell;
    const r = rr[i]?.reserveRisk;
    const n = nupl[i]?.nupl;
    const f = fg[i]?.fearGreed;
    const c = ma50[i] / ma200[i];
    if (piCycle != null) rawLists.pi.push(piCycle);
    if (m != null) rawLists.mvrv.push(m);
    if (pu != null) rawLists.puell.push(pu);
    if (r != null) rawLists.rr.push(r);
    if (n != null) rawLists.nupl.push(n);
    if (f != null) rawLists.fg.push(f);
    if (c != null) rawLists.cross.push(c);
  }

  const ranges = {};
  // Helper: percentile (inclusive)
  const percentile = (arr, p) => {
    if (!arr.length) return null;
    const s = [...arr].sort((a, b) => a - b);
    const idx = (p / 100) * (s.length - 1);
    const lo = Math.floor(idx);
    const hi = Math.ceil(idx);
    if (lo === hi) return s[lo];
    return s[lo] + (s[hi] - s[lo]) * (idx - lo);
  };

  Object.entries(rawLists).forEach(([k, arr]) => {
    if (!arr.length) {
      ranges[k] = { min: 0, max: 1 };
      return;
    }
    // Use 5th–95th percentiles to avoid extreme outliers skewing normalization
    if (arr.length >= 10) {
      const p5 = percentile(arr, 5);
      const p95 = percentile(arr, 95);
      // if p5==p95 fallback to min/max
      if (p5 === p95 || p5 === null || p95 === null) {
        const min = Math.min(...arr);
        const max = Math.max(...arr);
        ranges[k] = { min: min === max ? min - 1 : min, max: min === max ? max + 1 : max };
      } else {
        ranges[k] = { min: p5, max: p95 };
      }
    } else {
      const min = Math.min(...arr);
      const max = Math.max(...arr);
      ranges[k] = { min: min === max ? min - 1 : min, max: min === max ? max + 1 : max };
    }
  });

  const computed = prices.map((p, i) => {
    if (!ma111[i] || !ma350[i] || !ma50[i] || !ma200[i]) return null;

    const indicators = {
      piCycle: ma111[i] / ma350[i],
      mvrv: mvrv[i]?.mvrv,
      puell: puell[i]?.puell,
      reserveRisk: rr[i]?.reserveRisk,
      nupl: nupl[i]?.nupl,
      fearGreed: fg[i]?.fearGreed,
      goldenCross: ma50[i] / ma200[i],
    };

    // Dynamic normalization using dataset-wide ranges
    const scores = {
      pi: normalize(indicators.piCycle, ranges.pi.min, ranges.pi.max),
      mvrv: normalize(indicators.mvrv, ranges.mvrv.min, ranges.mvrv.max),
      puell: normalize(indicators.puell, ranges.puell.min, ranges.puell.max),
      rr: normalize(indicators.reserveRisk ?? 0, ranges.rr.min, ranges.rr.max, true),
      nupl: normalize(indicators.nupl ?? 0, ranges.nupl.min, ranges.nupl.max),
      fg: normalize(indicators.fearGreed, ranges.fg.min, ranges.fg.max),
      cross: normalize(indicators.goldenCross, ranges.cross.min, ranges.cross.max),
    };

    const gcmi =
      scores.pi * 0.15 +
      scores.mvrv * 0.2 +
      scores.puell * 0.15 +
      scores.rr * 0.1 +
      scores.nupl * 0.15 +
      scores.fg * 0.15 +
      scores.cross * 0.1;

    let signal = "NEUTRAL";
    if (gcmi < 25) signal = "EXTREME_FEAR";
    else if (gcmi < 45) signal = "FEAR";
    else if (gcmi < 65) signal = "NEUTRAL";
    else if (gcmi < 80) signal = "GREED";
    else signal = "EXTREME_GREED";

    return {
      date: p.date,
      btcPrice: p.price,
      gcmi: Number(gcmi.toFixed(2)),
      signal,
      indicators: Object.fromEntries(
        Object.entries(indicators).map(([k, v]) => [k, v != null ? Number(v.toFixed(3)) : null])
      ),
      normalized: scores,
    };
  });

  return computed.filter(Boolean);
};

/* -----------------------------------------------------------
   Update / Fetch from DB
----------------------------------------------------------- */
export const updateGCMIData = async () => {
  const calculatedData = await calculateGCMI();
  const ops = calculatedData.map((d) => ({
    updateOne: {
      filter: { date: d.date },
      update: { $set: { ...d, updatedAt: new Date() } },
      upsert: true,
    },
  }));
  await GCMI.bulkWrite(ops, { ordered: false });
  console.log(`✅ Updated ${calculatedData.length} GCMI records`);
  return calculatedData;
};

export const getGCMI = async (req, res) => {
  const limit = Math.min(parseInt(req.query.limit) || 200, 1000);
  const data = await GCMI.find().sort({ date: -1 }).limit(limit).lean();
  if (!data.length) {
    await updateGCMIData();
    return res.status(202).json({ success: false, message: "Building initial dataset..." });
  }
  res.json({
    success: true,
    current: data[0],
    data: data.reverse(),
  });
};

export const triggerUpdate = async (req, res) => {
  try {
    const data = await updateGCMIData();
    res.json({ success: true, count: data.length });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const healthCheck = async (req, res) => {
  const latest = await GCMI.findOne().sort({ date: -1 }).lean();
  res.json({
    status: latest ? "healthy" : "initializing",
    lastUpdate: latest?.updatedAt,
    latestGCMI: latest?.gcmi,
    signal: latest?.signal,
  });
};
