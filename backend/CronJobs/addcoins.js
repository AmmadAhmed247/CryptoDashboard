import axios from "axios";

// ============================================
// CONFIGURATION
// ============================================
let rank = 616;
const MAX_RANK = 700; // Only fetch top 500 coins

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:3000";
const CMC_API_KEY = process.env.CMC_API_KEY || "YOUR_CMC_API_K  EY"; // Get free key from coinmarketcap.com/api
const WAIT_TIME =  30 * 1000; // 30 sec

// ============================================
// Main Function
// ============================================
(async () => {
  if (CMC_API_KEY === "YOUR_CMC_API_KEY") {
    console.error("❌ Please set CMC_API_KEY environment variable");
    console.log("Get your free API key from: https://coinmarketcap.com/api/");
    process.exit(1);
  }

  while (rank <= MAX_RANK) {
    try {
      console.log(`\n🔍 Fetching coin at rank #${rank} (of top ${MAX_RANK})...`);
      console.log(`⏰ Time: ${new Date().toLocaleTimeString()}`);
      
      // Fetch from CoinMarketCap
      const res = await axios.get(
        "https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest",
        {
          headers: {
            "X-CMC_PRO_API_KEY": CMC_API_KEY
          },
          params: {
            start: rank,
            limit: 1,
            sort: "market_cap",
            sort_dir: "desc"
          }
        }
      );

      const coin = res.data?.data?.[0];
      if (!coin) {
        console.log("❌ Coin not found, moving to next rank...");
        rank++;
        await new Promise(r => setTimeout(r, WAIT_TIME));
        continue;
      }

      const symbol = coin.symbol?.toUpperCase() || "";
      const name = coin.name || "";
      const cmcSlug = coin.slug || "";

      console.log(`\n📊 Coin #${rank}: ${name} (${symbol})`);
      console.log(`💰 Price: ${coin.quote?.USD?.price?.toLocaleString()}`);
      console.log(`📈 Market Cap: ${coin.quote?.USD?.market_cap?.toLocaleString()}`);
      console.log(`🆔 CMC Slug: ${cmcSlug}`);

      // Try to find CoinGecko ID by searching
      console.log("\n🔍 Finding CoinGecko ID...");
      let geckoId = cmcSlug; // Start with CMC slug as fallback
      
      try {
        // Search CoinGecko for the coin
        const searchRes = await axios.get(
          "https://api.coingecko.com/api/v3/search",
          { params: { query: symbol } }
        );
        
        // Find exact match by symbol
        const match = searchRes.data?.coins?.find(
          c => c.symbol?.toLowerCase() === symbol.toLowerCase()
        );
        
        if (match) {
          geckoId = match.id;
          console.log(`✅ Found CoinGecko ID: ${geckoId}`);
        } else {
          console.log(`⚠️ No exact match, using CMC slug: ${cmcSlug}`);
        }
      } catch (searchErr) {
        console.log(`⚠️ Search failed, using CMC slug: ${cmcSlug}`);
      }

      // Send to backend using the CoinGecko ID
      console.log("\n📤 Sending to backend...");
      await axios.get(`${BACKEND_URL}/api/data/update-coin/${geckoId}`);
      console.log("✅ Coin added successfully!");
      
      rank++;
      
      if (rank > MAX_RANK) {
        console.log(`\n🎉 Completed! All top ${MAX_RANK} coins have been processed.`);
        process.exit(0);
      }
      
      console.log(`\n⏳ Waiting 2 minutes before fetching rank #${rank}...`);
      console.log(`Next fetch at: ${new Date(Date.now() + WAIT_TIME).toLocaleTimeString()}`);
      
      await new Promise(r => setTimeout(r, WAIT_TIME));

    } catch (err) {
      console.error("\n❌ Error:", err.message);
      if (err.response) {
        console.error("Response status:", err.response.status);
        console.error("Response error:", err.response.data);
      }
      console.log("⏳ Waiting 2 minutes before retry...");
      await new Promise(r => setTimeout(r, WAIT_TIME));
    }
  }
})();