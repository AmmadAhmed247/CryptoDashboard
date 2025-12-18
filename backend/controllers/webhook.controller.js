import { processSystemePayment } from "../services/system.service.js";

export const systemeWebhook = async (req, res) => {
  try {
    await processSystemePayment(req.body);
    res.status(200).send("OK");
  } catch (err) {
    console.error(err);
    res.status(400).send("Webhook error");
  }
};
