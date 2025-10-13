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
    const response = await axios.get(
      "https://www.blockchaincenter.net/en/altcoin-season-index/",
      {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
        }
      }
    );

    const $ = cheerio.load(response.data);
    // Look for the index value in the page structure
    const indexValue = $('[data-altseason-index]').text() || 
                       $('.altseason-index-value').text();

    res.json({ value: parseInt(indexValue) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getMarketData=async(req , res)=>{
  try {
    const response=await axios.get('https://api.coinmarketcap.com/v1/global-metrics/quotes/latest');
    res.json(response.data);  
  } catch (error) {
    console.error("Error fetching market data:", error.message);
    res.status(500).json({ message: "Failed to fetch market data" });
  }
}