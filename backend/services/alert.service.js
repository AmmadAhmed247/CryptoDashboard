// // services/alert.service.js

// import axios from "axios";
// import AlertsModel from "../models/Alerts.model.js";
// import nodemailer from "nodemailer";
// const fetchBTCPrice = async (retries = 3, delay = 1000) => {
//   try {
//     const { data } = await axios.get(
//       "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd",
//       { timeout: 10000 }
//     );
//     return data.bitcoin.usd;
//   } catch (err) {
//     if (err.response?.status === 429 && retries > 0) {
//       console.log("Rate limited by CoinGecko, retrying...");
//       await new Promise(r => setTimeout(r, delay));
//       return fetchBTCPrice(retries - 1, delay * 2);
//     }
//     throw err;
//   }
// };

// // Background version (no res)
// export const checkAlertsBackground = async () => {
//   try {
//     const { data } = await axios.get(
//       "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd",
//       { timeout: 10000 }
//     );
//     const btcPrice = await fetchBTCPrice();
//     const alerts = await AlertsModel.find({ triggered: false });

//     for (const alert of alerts) {
//       const conditionMet =
//         (alert.condition === "above" && btcPrice >= alert.targetPrice) ||
//         (alert.condition === "below" && btcPrice <= alert.targetPrice);

//       if (conditionMet) {
//         await sendEmail(alert.email, btcPrice);
//         alert.triggered = true;
//         await alert.save();
//       }
//     }
//   } catch (err) {
//     console.error("Error checking alerts:", err.message);
//   }
// };

// // Optional: API endpoint version
// export const checkAlertsAPI = async (req, res) => {
//   await checkAlertsBackground();
//   res.status(200).json({ message: "Alerts checked successfully" });
// };

// const sendEmail = async (email, price) => {
//   const transporter = nodemailer.createTransport({
//     host: "smtp.office365.com",
//     port: 587,
//     secure:false,
//     auth: {
//       user: process.env.EMAIL,
//       pass: process.env.EMAIL_PASS,
//     },
//   });

//   await transporter.sendMail({
//     from: `"MEIN KRYPTO Alerts" <${process.env.EMAIL}>`,
//     to: email,
//     subject: "BTC Price Alert Triggered",
//     text: `Bitcoin has reached your target price! Current price: $${price}`,
//   });
// };
