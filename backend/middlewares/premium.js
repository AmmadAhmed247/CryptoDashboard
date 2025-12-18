export const premiumOnly = (req, res, next) => {
  if (!req.user.buyStatus) {
    return res.status(403).json({ message: "Premium access required" });
  }
  next();
};
