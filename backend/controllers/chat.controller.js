import CoinScoreModel  from "../models/CoinScore.model.js";

import {askGpt} from "../utils/gptClient.js"

export const chatWithBoth=async(req , res)=>{
    try {
        const {message}=req.body;
        if(!message) return res.status(400).json({error:"Message is required"});
        const coinId=message.toLowerCase().includes("bitcoin") ? "bitcoin" : null;
        const coinData=coinId ? await CoinScoreModel.findOne({coinId}).lean():null;
        const reply=await askGpt(message,coinData);
        res.json({reply});
    } catch (error) {
        console.error(error);
        res.status(500).json({error:"Internal Server Error"})
    }
}

