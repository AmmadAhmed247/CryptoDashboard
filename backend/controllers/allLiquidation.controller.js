import { connectToBinance } from "./binance.controller.js";
import { connectToBybit } from "./bybit.controller.js"
import { connectToOkx } from "./okx.controller.js";

import axios from "axios";


let liquidationData = []

export const startAllSocket = () => {
    connectToBinance((data) => {
        liquidationData.push(data)
        if (liquidationData.length > 500) liquidationData.shift()
    })
    // connectToBybit((data) => {
    //     liquidationData.push(data)
    //     if (liquidationData.length > 500) liquidationData.shift()
    // })
    // connectToOkx((data) => {
    //     liquidationData.push(data)
    //     if (liquidationData.length > 500) {
    //         liquidationData.shift()
    //     }
    // })
    
}

export const getLiquidations = (req, res) => {
    res.json(liquidationData.sort((a, b) => b.timestamp - a.timestamp))
}

export const get24hrData=(req ,res)=>{
    const now=Date.now()
    const oneDay=now-24*60*60*1000;
    const last24hr=liquidationData.filter(item=>item.timestamp>=oneDay)
    const total24hrData=last24hr.reduce((sum,item)=>sum+Number(item.totalUSD),0).toFixed(2)
    const longcounts=last24hr.filter(item=> item.side==="BUY").length
    const shortcounts=last24hr.filter(item=> item.side==="SELL").length
    const longRatio = ((longcounts / (longcounts + shortcounts)) * 100).toFixed(2)
    const shortRatio = ((shortcounts / (longcounts + shortcounts)) * 100).toFixed(2)
    res.json({
        total24hrData,
        longRatio,
        shortRatio,
        longShortRatio: `${longRatio}% / ${shortRatio}%`,
    })
}


export const getTotalVolume= async (req , res)=>{
    try {
        const {data:ticker}=await axios.get("https://fapi.binance.com/fapi/v1/ticker/24hr")
        
        let totalVolume=0
        ticker.forEach(t=>{
            totalVolume+=Number(t.quoteVolume)
        })
        res.json({totalVolume})
    } catch (error) {
        console.error("Error while fetching the total Volume",error.message);
    }
}