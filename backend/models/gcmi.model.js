// models/gcmi.model.js
import mongoose from "mongoose";

const gcmiSchema = new mongoose.Schema(
  {
    date: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    gcmi: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    signal: {
      type: String,
      enum: ["EXTREME_FEAR", "FEAR", "NEUTRAL", "GREED", "EXTREME_GREED"],
      required: true,
    },
    btcPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    indicators: {
      piCycle: { type: Number, required: true },
      mvrv: { type: Number, required: true },
      puell: { type: Number, required: true },
      reserveRisk: { type: Number },
      nupl: { type: Number },
      fearGreed: { type: Number },
      goldenCross: { type: Number },
    },
    updatedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes
gcmiSchema.index({ date: -1, updatedAt: -1 });

// Optional: TTL index to auto-delete old data after 2 years
gcmiSchema.index({ updatedAt: 1 }, { expireAfterSeconds: 63072000 });

export default mongoose.model("GCMI", gcmiSchema);