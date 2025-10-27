import cron from "node-cron";
import axios from "axios";
import CoinScore from "../models/CoinScore.model.js";

let coinsCache = [];
let currentIndex = 0;
let isRunning = false;

// Load coin list once at startup
const loadCoins = async () => {
  const coins = await CoinScore.find({}, "coinId name");
  coinsCache = coins;
  console.log(`🪙 Loaded ${coinsCache.length} coins for rotation`);
};

// Cron: runs every 2 minute
cron.schedule("*/2 * * * *", async () => {
  if (isRunning) return console.log("⏳ Previous update still running...");
  if (coinsCache.length === 0) await loadCoins();
  if (coinsCache.length === 0) return console.log("⚠️ No coins found in DB.");

  isRunning = true;

  const coin = coinsCache[currentIndex];
  console.log(`🚀 Updating [${currentIndex + 1}/${coinsCache.length}] ${coin.name}...`);

  try {
    const url = `http://localhost:3000/api/data/update-coin/${coin.coinId}`;
    await axios.get(url);
    console.log(`✅ Successfully updated ${coin.name}`);
  } catch (err) {
    console.error(`❌ Failed to update ${coin.name}:`, err.message);
  }

  // Move to next coin
  currentIndex = (currentIndex + 1) % coinsCache.length;
  isRunning = false;
});
