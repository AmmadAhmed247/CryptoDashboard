import nodemailer from "nodemailer";

export const sendEmail = async (to, subject, html) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // use Gmail App Password
      },
    });

    await transporter.sendMail({
      from: `"CoinTrackr" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
  } catch (err) {
    console.error("Email sending error:", err);
    throw new Error("Email could not be sent");
  }
};
