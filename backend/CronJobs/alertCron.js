import cron from "node-cron";
import { checkAlertsBackground } from "../services/alert.service.js"; // your alert function without res

// Run every minute
export const startAlertCron = () => {
  cron.schedule("* * * * *", async () => {
    console.log("Running alert check...");
    await checkAlertsBackground();
  });
};
