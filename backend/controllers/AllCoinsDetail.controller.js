import CoinScore from '../models/CoinScore.model.js';
import axios from 'axios';

export const getTopCoinsWithFullData = async (req, res) => {
  try {
    const coins = await CoinScore.find({}).limit(100);

    const symbols = coins.map(c => c.symbol.toUpperCase() + 'USDT');

    const binanceResponse = await axios.get('https://api.binance.com/api/v3/ticker/24hr');
    const priceData = binanceResponse.data.filter(p => symbols.includes(p.symbol));

    const result = coins.map(coin => {
      const priceInfo = priceData.find(p => p.symbol.startsWith(coin.symbol.toUpperCase()));
      return {
        ...coin._doc,
        price: priceInfo ? parseFloat(priceInfo.lastPrice) : null,
        priceChange24h: priceInfo ? parseFloat(priceInfo.priceChangePercent) : null,
        volume: priceInfo ? parseFloat(priceInfo.volume) : null,
        marketCap: priceInfo ? parseFloat(priceInfo.quoteVolume) : null
      };
    });
    console.log(result);

    res.json({ success: true, data: result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
};
