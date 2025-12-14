import mongoose from "mongoose";

const CoinScoreSchema = new mongoose.Schema({
  coinId: { type: String, required: true, unique: true }, // CoinGecko ID
  symbol: String, // e.g., BTC
  name: String,   // e.g., Bitcoin
  logo: String,   // URL from CoinGecko

  // Total scores
  CQS: { type: Number, default: 10 },
  TS: { type: Number, default: 20 },
  RI: { type: Number, default: 50 },
  CI: { type: Number, default: 50 },
  Moonshot: { type: Number, default: 50 },
  entryState: { type: String, default: "Neutral/Wait" },
  CMS: Number,

  // Moonshot detailed factors
  MoonshotFactors: {
    volatilityScore: { type: Number, default: 50 },
    hypeScore: { type: Number, default: 5 },
    devActivity: { type: Number, default: 50 },
    otherFactors: { type: Number, default: 50 },
    socialSentiment: { type: Number, default: 50 }
  },

  // Average of all top-level scores (normalized)
  average: { type: Number, default: 0 },
   marketPhase: String,
  finalScore: Number,
  signalLevel: Number,

  lastUpdated: { type: Date, default: Date.now }
});

export default mongoose.model("CoinScore", CoinScoreSchema);
