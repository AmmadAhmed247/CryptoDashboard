import axios from "axios";

import AlertsModel from "../models/Alerts.model.js";
import nodemailer from "nodemailer";
export const checkAlerts=async(req  , res)=>{
    try {
        const {data}=await axios.get("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd");
        const btcPrice=data.bitcoin.usd;
        const alerts=await AlertsModel.find({triggered:false});
        for (let alert of alerts){
            const conditionMet=(alert.condition==="above" && btcPrice>=alert.targetPrice) || (alert.condition==="below" &&  btcPrice<=alert.targetPrice);
            if(conditionMet){
                await sendEmail(alert.email,btcPrice);
                alert.triggered=true;
                await alert.save();
            }
            
        }
        if(res) res.status(200).json({ message: "Alerts checked successfully" });
    } catch (error) {
        console.error("error while checking alerts",error.message);
    }
}

const sendEmail=async(email , price)=>{
    const transporter=nodemailer.createTransport({
        service:"gmail",
        auth:{
            user:process.env.EMAIL,
            pass:process.env.EMAIL_PASS,
        }
    })
    await transporter.sendMail({
    from: `"MEIN KRYPTO Alerts "<${process.env.EMAIL}>`,
    to: email,
    subject: "BTC Price Alert Triggered ",
    text: `Bitcoin has reached your target price! Current price: $${price}`,
    })
}