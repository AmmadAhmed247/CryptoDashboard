import CoinScoreModel from "../models/CoinScore.model.js"

const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

export const calculateAndUpdateScore = async (req, res) => {
    try {
        const { coinId } = req.params;
        
        console.log('Fetching coin:', coinId);
        
        const coin = await CoinScoreModel.findOne({ coinId });
        
        if (!coin) {
            return res.status(404).json({ message: "Coin not found" });
        }

        console.log('Coin data:', coin);

        let { CQS, TS, RI, CI, Moonshot } = coin;
        
        // Calculate CMS if it doesn't exist
        // CMS = Composite Market Score (you can adjust this formula)
        let CMS = coin.CMS;
        console.log("coin",CMS);
        
        if (!CMS) {
            // Example: Average of available scores
            CMS = (TS + CI + RI) / 3;
            console.log('Calculated CMS:', CMS);
        }

        // Check if required fields exist
        if (CQS === undefined || TS === undefined) {
            return res.status(400).json({ 
                error: "Missing required score fields",
                data: { CQS, TS, CMS }
            });
        }

        // Determine Market Phase
        let marketPhase = "NEUTRAL";
        
        if (CMS < 35 && TS < 45) marketPhase = "EARLY_BULL";
        else if (CMS >= 35 && CMS <= 55 && TS >= 45) marketPhase = "MID_BULL";
        else if (CMS > 55 && TS >= 60) marketPhase = "LATE_BULL";
        else if (CMS >= 35 && CMS <= 55 && TS < 45) marketPhase = "EARLY_BEAR";
        else if (CMS > 55 && TS >= 35 && TS <= 60) marketPhase = "MID_BEAR";
        else if (CMS > 70 && TS < 35) marketPhase = "LATE_BEAR";

        console.log('Market Phase:', marketPhase);

        // Weights based on market phase
        const weights = {
            EARLY_BULL: { CQS: 0.60, TS: 0.25, CMS: 0.15 },
            MID_BULL:   { CQS: 0.20, TS: 0.50, CMS: 0.30 },
            LATE_BULL:  { CQS: 0.10, TS: 0.20, CMS: 0.70 },
            EARLY_BEAR: { CQS: 0.15, TS: 0.25, CMS: 0.60 },
            MID_BEAR:   { CQS: 0.10, TS: 0.20, CMS: 0.70 },
            LATE_BEAR:  { CQS: 0.05, TS: 0.10, CMS: 0.85 },
            NEUTRAL:    { CQS: 0.33, TS: 0.33, CMS: 0.34 }
        };

        const w = weights[marketPhase];
        const secondaryWeight = 0.05;
        
        // Calculate Final Score
        let finalScore =
            w.CQS * (CQS || 0) +
            w.TS * (TS || 0) +
            w.CMS * (CMS || 0) +
            secondaryWeight * (RI || 0) +
            secondaryWeight * (CI || 0) +
            secondaryWeight * (Moonshot || 0);

        finalScore = clamp(finalScore, 0, 100);

        // Determine Signal Level
        let signalLevel;
        if (finalScore >= 85) signalLevel = 6;
        else if (finalScore >= 70) signalLevel = 5;
        else if (finalScore >= 55) signalLevel = 4;
        else if (finalScore >= 40) signalLevel = 3;
        else if (finalScore >= 25) signalLevel = 2;
        else signalLevel = 1;

        // Update the coin document (including calculated CMS)
        coin.CMS = CMS;
        coin.marketPhase = marketPhase;
        coin.finalScore = finalScore;
        coin.signalLevel = signalLevel;
        coin.lastUpdated = new Date();
        
        // Save to database
        await coin.save();

        console.log('Saved successfully:', { marketPhase, finalScore, signalLevel });

        // Return response
        res.json({
            coinId,
            marketPhase,
            finalScore: parseFloat(finalScore.toFixed(2)),
            signalLevel
        });

    } catch (error) {
        console.error('Error calculating score:', error);
        res.status(500).json({ error: error.message });
    }
}