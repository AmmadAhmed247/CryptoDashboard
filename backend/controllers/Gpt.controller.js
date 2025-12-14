import express from "express"
import CoinScoreModel from "../models/CoinScore.model.js"

export const getAllScoresForGpt=async (req , res) => {
    try {
        const{coinId}=req.params;
        if(!coinId){
            return res.status(400).json({
                error:"CoinId  is required"
            })
        }
        const coin=await CoinScoreModel.findOne({coinId:coinId.toLowerCase()})
        if(!coin){
            return res.json({
                coinId,
                found:false
            })
        }
        return res.json({
      found: true,
      coinId: coin.coinId,
      symbol: coin.symbol,
      name: coin.name,
      Moonshot: coin.Moonshot,
      MoonshotFactors: coin.MoonshotFactors,
      entryState: coin.entryState,
      average: coin.average,
      finalScore: coin.finalScore,
      signalLevel: coin.signalLevel,
      marketPhase: coin.marketPhase,
      lastUpdated: coin.lastUpdated
    });
    } catch (error) {
         res.status(500).json({ error: "Internal server error" });
    }
}