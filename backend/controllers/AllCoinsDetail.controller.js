// controllers/topCoinsController.js (or wherever your file is)
import CoinScore from '../models/CoinScore.model.js';
import axios from 'axios';
import WebSocket from 'ws';

// In-memory real-time price cache
const realtimePrices = new Map();

// WebSocket connections
let binanceWs = null;
let coinbaseWs = null;

// Load coins from DB once at startup
let dbCoins = [];

const loadCoinsFromDB = async () => {
  try {
    dbCoins = await CoinScore.find({}).limit(500);
    console.log(`📋 Loaded ${dbCoins.length} coins from database`);
  } catch (err) {
    console.error('Error loading coins from DB:', err.message);
    dbCoins = [];
  }
};

loadCoinsFromDB();

// ============================================
// BINANCE !miniTicker@arr (updates every ~1s for ALL USDT pairs)
// ============================================
const connectBinance = async () => {
  try {
    binanceWs = new WebSocket('wss://stream.binance.com:9443/ws/!miniTicker@arr');

    binanceWs.on('open', () => {
      console.log('✅ Binance !miniTicker@arr connected — live updates every ~1s for all USDT pairs');
    });

    binanceWs.on('message', (data) => {
      try {
        const tickers = JSON.parse(data.toString()); // array of all tickers
        tickers.forEach(ticker => {
          const symbol = ticker.s.replace('USDT', '').toUpperCase();

          realtimePrices.set(symbol, {
            price: parseFloat(ticker.c),           // last price
            priceChange24h: realtimePrices.get(symbol)?.priceChange24h || 0, // keep previous % or fallback later to CMC
            volume: parseFloat(ticker.q),          // 24h quote volume
            source: 'binance',
            lastUpdate: Date.now(),
          });
        });
      } catch (err) {
        console.error('Binance miniTicker parse error:', err.message);
      }
    });

    binanceWs.on('close', () => {
      console.log('❌ Binance miniTicker closed — reconnecting in 5s...');
      setTimeout(connectBinance, 5000);
    });

    binanceWs.on('error', (err) => {
      console.error('Binance WebSocket error:', err.message);
    });

  } catch (err) {
    console.error('Binance setup error:', err.message);
    setTimeout(connectBinance, 5000);
  }
};

// ============================================
// COINBASE (ticker_batch for more regular updates)
// ============================================
const connectCoinbase = async () => {
  try {
    if (dbCoins.length === 0) await loadCoinsFromDB();

    const products = await axios.get('https://api.exchange.coinbase.com/products');
    const coinbaseSymbols = new Set(
      products.data
        .filter(p => p.quote_currency === 'USD' || p.quote_currency === 'USDT')
        .map(p => p.base_currency)
    );

    const matchedProducts = dbCoins
      .filter(coin => coinbaseSymbols.has(coin.symbol.toUpperCase()))
      .map(coin => `${coin.symbol.toUpperCase()}-USD`);

    if (matchedProducts.length === 0) {
      console.log('⚠️ No Coinbase matches found');
      return;
    }

    coinbaseWs = new WebSocket('wss://ws-feed.exchange.coinbase.com');

    coinbaseWs.on('open', () => {
      coinbaseWs.send(JSON.stringify({
        type: 'subscribe',
        channels: ['ticker_batch'], // ← more regular updates than plain 'ticker'
        product_ids: matchedProducts
      }));
      console.log(`✅ Coinbase connected: ${matchedProducts.length} products`);
    });

    coinbaseWs.on('message', (data) => {
      try {
        const msg = JSON.parse(data.toString());
        if (msg.type === 'ticker') {
          const symbol = msg.product_id.split('-')[0];

          realtimePrices.set(symbol, {
            price: parseFloat(msg.price),
            priceChange24h: msg.open_24h ? ((parseFloat(msg.price) - parseFloat(msg.open_24h)) / parseFloat(msg.open_24h)) * 100 : 0,
            volume: parseFloat(msg.volume_24h),
            source: 'coinbase',
            lastUpdate: Date.now(),
          });
        }
      } catch (err) {
        console.error('Coinbase parse error:', err.message);
      }
    });

    coinbaseWs.on('close', () => {
      console.log('❌ Coinbase closed — reconnecting...');
      setTimeout(connectCoinbase, 5000);
    });

    coinbaseWs.on('error', (err) => {
      console.error('Coinbase error:', err.message);
    });

  } catch (err) {
    console.error('Coinbase setup error:', err.message);
    setTimeout(connectCoinbase, 5000);
  }
};

// ============================================
// CMC FALLBACK (market cap + 24h % for all coins)
// ============================================
let cmcCache = new Map();

const fetchCMCData = async () => {
  try {
    const response = await axios.get(
      'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest',
      {
        headers: { 'X-CMC_PRO_API_KEY': process.env.CMC_API_KEY },
        params: { start: 1, limit: 650, convert: 'USD' },
      }
    );

    response.data.data.forEach(coin => {
      cmcCache.set(coin.symbol.toUpperCase(), {
        price: coin.quote.USD.price,
        priceChange24h: coin.quote.USD.percent_change_24h,
        volume: coin.quote.USD.volume_24h,
        marketCap: coin.quote.USD.market_cap,
      });
    });

    console.log('📊 CMC fallback data refreshed');
  } catch (err) {
    console.error('CMC fetch error:', err.message);
  }
};

fetchCMCData();
setInterval(fetchCMCData, 60000); // every minute

// ============================================
// START WEBSOCKETS
// ============================================
setTimeout(() => {
  connectBinance();
  connectCoinbase();
}, 2000);

// ============================================
// MAIN ENDPOINT
// ============================================
export const getTopCoinsWithFullData = async (req, res) => {
  try {
    const now = Date.now();
    const coins = await CoinScore.find({}).limit(500);

    const result = coins.map(coin => {
      const symbol = coin.symbol.toUpperCase();
      const wsData = realtimePrices.get(symbol);
      const cmcData = cmcCache.get(symbol);

      if (wsData && (now - wsData.lastUpdate < 60000)) { // ← keep WS data fresh for 60s
        return {
          ...coin._doc,
          price: wsData.price,
          priceChange24h: wsData.priceChange24h || cmcData?.priceChange24h || 0,
          volume: wsData.volume,
          marketCap: cmcData?.marketCap || null,
          dataSource: wsData.source,
        };
      } else if (cmcData) {
        return {
          ...coin._doc,
          price: cmcData.price,
          priceChange24h: cmcData.priceChange24h,
          volume: cmcData.volume,
          marketCap: cmcData.marketCap,
          dataSource: 'cmc',
        };
      } else {
        return {
          ...coin._doc,
          price: null,
          priceChange24h: null,
          volume: null,
          marketCap: null,
          dataSource: 'none',
        };
      }
    });

    // Helpful log
    const counts = {
      binance: result.filter(c => c.dataSource === 'binance').length,
      coinbase: result.filter(c => c.dataSource === 'coinbase').length,
      cmc: result.filter(c => c.dataSource === 'cmc').length,
      none: result.filter(c => c.dataSource === 'none').length,
    };
    console.log(`🔄 Serving: ${counts.binance} Binance, ${counts.coinbase} Coinbase, ${counts.cmc} CMC, ${counts.none} missing`);

    res.json({ success: true, data: result });
  } catch (err) {
    console.error('Error in getTopCoinsWithFullData:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
};