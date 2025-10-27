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
import { updateGCMIData } from "./controllers/GcmiFactor.controller.js";

const app = express();
app.use(express.json());

const PORT = process.env.PORT;
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
startGCMICron();
connectDB();
app.get('/api/status', (req, res) => {
  res.json({ status: 'API is running' });
});
startAllSocket()
app.use("/api",liquidationRoute)
app.use('/api', backtestRoutes);
app.use('/api/data', dataRoutes);
app.use('/api', cqsRoute);
app.use('/api/data', coinRoute);
app.use('/api/', hotCoinsRoute);
app.use('/api/', GcmiRoute);
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});




