// backend/routes/test.js
import express from 'express';
import Coin from '../models/CoinScore.model.js';
import axios from 'axios';

const router = express.Router();

router.get('/backtest-export', async (req, res) => {
  try {
    const coins = await Coin.find().lean();
    
    // Get current prices and calculate ROI
    const backtestData = await Promise.all(
      coins.map(async (coin) => {
        try {
          // Get current price
          const { data: priceData } = await axios.get(
            `https://api.coingecko.com/api/v3/simple/price`,
            {
              params: {
                ids: coin.coinId,
                vs_currencies: 'usd',
                include_24hr_change: true,
              },
            }
          );

          // Get historical price from lastUpdated date
          const calcDate = new Date(coin.lastUpdated);
          const dateStr = calcDate.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
          });

          let priceAtCalculation = 0;
          try {
            const { data: historicalData } = await axios.get(
              `https://api.coingecko.com/api/v3/coins/${coin.coinId}/history`,
              { params: { date: dateStr } }
            );
            priceAtCalculation = historicalData.market_data?.current_price?.usd || 0;
          } catch (err) {
            console.log(`No historical data for ${coin.name}`);
          }

          const currentPrice = priceData[coin.coinId]?.usd || 0;
          const priceChange24h = priceData[coin.coinId]?.usd_24h_change || 0;
          
          const roi = priceAtCalculation > 0 
            ? ((currentPrice - priceAtCalculation) / priceAtCalculation) * 100 
            : null;

          const daysSinceCalc = Math.floor(
            (new Date() - calcDate) / (1000 * 60 * 60 * 24)
          );

          return {
            coinId: coin.coinId,
            name: coin.name,
            symbol: coin.symbol,
            logo: coin.logo,
            
            // Scores
            moonshotScore: coin.Moonshot,
            cqs: coin.CQS,
            ci: coin.CI,
            ri: coin.RI,
            ts: coin.TS,
            average: coin.average,
            
            // Moonshot Breakdown
            moonshotFactors: {
              volatilityScore: coin.MoonshotFactors?.volatilityScore || 0,
              hypeScore: coin.MoonshotFactors?.hypeScore || 0,
              devActivity: coin.MoonshotFactors?.devActivity || 0,
              socialSentiment: coin.MoonshotFactors?.socialSentiment || 0,
              otherFactors: coin.MoonshotFactors?.otherFactors || 0,
            },
            
            // Performance Data
            calculationDate: coin.lastUpdated,
            daysSinceCalculation: daysSinceCalc,
            priceAtCalculation,
            currentPrice,
            priceChange24h,
            roi,
            
            // Performance Rating
            performance: roi === null ? 'unknown' : 
                        roi > 50 ? 'excellent' :
                        roi > 20 ? 'good' :
                        roi > 0 ? 'positive' :
                        roi > -20 ? 'negative' : 'poor'
          };
        } catch (err) {
          console.error(`Error processing ${coin.name}:`, err.message);
          return null;
        }
      })
    );

    // Filter out nulls and sort by moonshot score
    const validData = backtestData
      .filter(d => d !== null)
      .sort((a, b) => b.moonshotScore - a.moonshotScore);

    res.json({
      success: true,
      totalCoins: validData.length,
      exportDate: new Date().toISOString(),
      data: validData,
    });

  } catch (error) {
    console.error('Export error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

export default router;