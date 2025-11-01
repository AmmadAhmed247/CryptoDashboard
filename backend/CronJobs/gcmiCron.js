// jobs/gcmiCron.js
import cron from "node-cron";
import { updateGCMIData } from "../controllers/GcmiFactor.controller.js";

export const startGCMICron = () => {
  // Run every 2 hours
  cron.schedule("*/2 * * * *", async () => {
    console.log("⏰ Cron: Updating GCMI data...");
    try {
      await updateGCMIData();
    } catch (error) {
      console.error("❌ Cron job failed:", error.message);
    }
  });

  console.log("✅ GCMI cron job started (runs every 2 hours)");
};

// Alternative schedules:
// Every hour: "0 * * * *"
// Every 4 hours: "0 */4 * * *"
// Every day at midnight: "0 0 * * *"