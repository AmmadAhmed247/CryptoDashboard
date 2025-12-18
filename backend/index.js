import dotenv from "dotenv";
dotenv.config();
import express from 'express';
import cors from 'cors';
import dataRoutes from './routes/data.route.js';
import cqsRoute from './routes/cqs.route.js';
import coinRoute from './routes/coin.route.js';
import {connectDB}  from './db.js';
import hotCoinsRoute from './routes/hotCoins.route.js';
import GcmiRoute from "./routes/gcmi.route.js"
import liquidationRoute from "./routes/liquidation.route.js"
import { startAllSocket } from "./controllers/allLiquidation.controller.js";
import backtestRoutes from './routes/test.js';
import "./CronJobs/autoUpdateCoins.js"
import { startGCMICron } from "./CronJobs/gcmiCron.js";
import AlertRouter from "./routes/alert.route.js";
import AuthRoute from "./routes/auth.route.js"
import cookieParser from 'cookie-parser';
import portfolioRoutes from "./routes/portfolio.route.js";
import SignalRoute from "./routes/signalScore.route.js"
import {initializeCronJob} from "./CronJobs/autoUpdateCoins.js"
import webhookroute from "./routes/webhook.route.js"

// import "./CronJobs/addcoins.js"
import GptRoute from "./routes/gpt.route.js"
const app = express();
app.use(express.json());

const PORT = process.env.PORT;
const allowedOrigins = [
  "https://meinkrypto.com",
  "https://www.meinkrypto.com"
];

app.use(cors({
  origin: function(origin, callback) {

    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
startGCMICron();

connectDB();
app.use(cookieParser());
app.get('/api/status', (req, res) => {
  res.json({ status: 'API is running' });
});
startAllSocket();
app.use("/api",GptRoute);
app.use("/api", SignalRoute);
app.use("/api/webhook",webhookroute);
app.use("/api",liquidationRoute);
app.use('/api', backtestRoutes);
app.use('/api/data', dataRoutes);
app.use('/api', cqsRoute);
app.use('/api/data', coinRoute);
app.use('/api/', hotCoinsRoute);
app.use('/api/', GcmiRoute);
app.use("/api/alerts",AlertRouter);
app.use("/api/auth",AuthRoute);
app.use("/api/portfolio",portfolioRoutes)
app.listen(PORT,async () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  await initializeCronJob();
  // await updateSingleCoin();
});




