import User from "../models/user.model.js";

export const processSystemePayment = async (data) => {
  const {
    email,
    payment_status,
    product_id
  } = data;

  if (payment_status !== "paid") return;

  const user = await User.findOne({ email });

  if (!user) {
    console.log("User not found:", email);
    return;
  }

  user.buyStatus = true;
  await user.save();

  console.log("Access granted to:", email);
};
