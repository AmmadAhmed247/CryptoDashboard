import dotenv from "dotenv";
dotenv.config();
import express from 'express';
import cors from 'cors';
import dataRoutes from './routes/data.route.js';

const app = express();

const PORT = process.env.PORT;
app.use(cors({ origin: "http://localhost:5173", credentials: true }));


app.get('/api/status', (req, res) => {
  res.json({ status: 'API is running' });
});

app.use('/api/data', dataRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});



