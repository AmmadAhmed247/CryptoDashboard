import cron from "node-cron";
import axios from "axios";
import CoinScore from "../models/CoinScore.model.js";
import dotenv from "dotenv";
dotenv.config();

let coinsCache = [];
let currentIndex = 0;
let isRunning = false;

// Load coins on startup
const loadCoins = async () => {
  try {
    const coins = await CoinScore.find({}, "coinId name");
    coinsCache = coins;
    console.log(`🪙 Loaded ${coinsCache.length} coins for rotation`);
  } catch (error) {
    console.error("❌ Error loading coins:", error.message);
  }
};

// Initialize coins when server starts
const initializeCronJob = async () => {
  console.log("🔄 Initializing coin update cron job...");
  await loadCoins();
  
  // Schedule cron job to run every minute
  cron.schedule("*/2* * * * *", async () => {
    if (isRunning) {
      console.log("⏳ Previous update still running...");
      return;
    }
    
    if (coinsCache.length === 0) {
      console.log("⚠️ No coins found in DB. Reloading...");
      await loadCoins();
      return;
    }
    
    isRunning = true;
    const coin = coinsCache[currentIndex];
    
    console.log(`🚀 Updating [${currentIndex + 1}/${coinsCache.length}] ${coin.name} (${coin.coinId})...`);
    
    try {
      // Use BACKEND_URL instead of VITE_BACKEND_URL (VITE_ prefix is for frontend only)
      const url = `${process.env.BACKEND_URL || 'http://localhost:3000'}/api/data/update-coin/${coin.coinId}`;
      console.log(`📡 Calling: ${url}`);
      
      const response = await axios.get(url);
      console.log(`✅ Successfully updated ${coin.name}`);
      
    } catch (err) {
      console.error(`❌ Failed to update ${coin.name}:`, err.response?.data || err.message);
    }
    
    currentIndex = (currentIndex + 1) % coinsCache.length;
    isRunning = false;
  });
  
  console.log("✅ Cron job scheduled: Updates every minute");
};

// Export to call from server.js
export  { initializeCronJob };