// controllers/gcmi.controller.js
import axios from "axios";

const normalize = (value, min, max) => ((value - min) / (max - min)) * 100;

export const getGCMI = async (req, res) => {
  try {
    // 1. Get Bitcoin market chart (last 365 days)
    const { data } = await axios.get(
      "https://api.coingecko.com/api/v3/coins/bitcoin/market_chart",
      { params: { vs_currency: "usd", days: "max" } }
    );

    const prices = data.prices.map(([timestamp, price]) => ({
      date: new Date(timestamp).toISOString().split("T")[0],
      price,
    }));

    // Helper: simple moving average
    const movingAvg = (arr, n) => {
      return arr.map((_, i) =>
        i < n - 1
          ? null
          : arr.slice(i - n + 1, i + 1).reduce((a, b) => a + b, 0) / n
      );
    };

    const priceArray = prices.map((p) => p.price);
    const ma111 = movingAvg(priceArray, 111);
    const ma350 = movingAvg(priceArray, 350);

    const result = prices.map((p, i) => {
      const piCycle =
        ma111[i] && ma350[i] ? ma111[i] / ma350[i] : null;

      // Fake example of other indicators (replace later)
      const mvrv = Math.random() * 5; // placeholder
      const puell = Math.random() * 4; // placeholder

      if (!piCycle) return null;

      // Combine indicators
      const gcmiRaw = (piCycle + mvrv + puell) / 3;

      // Normalize roughly between 0–100
      const gcmi = normalize(gcmiRaw, 0, 6);

      return {
        date: p.date,
        gcmi: Number(gcmi.toFixed(2)),
        btcPrice: p.price,
      };
    });

    const cleanData = result.filter(Boolean).slice(-200); // latest 200 data points

    res.json(cleanData);
  } catch (error) {
    console.error("Error fetching GCMI:", error.message);
    res.status(500).json({ error: "Failed to calculate GCMI" });
  }
};
