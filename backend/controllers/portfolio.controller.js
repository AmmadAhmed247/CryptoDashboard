import User from "../models/user.model.js"

// Get portfolio
export const getPortfolio = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json(user.portfolio);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Add coin
// backend - portfolio.controller.js
export const addCoin = async (req, res) => {
  try {
    console.log("📍 req.user:", req.user); // Check if user is being set
    console.log("📦 req.body:", req.body); // Check what data is being received

    const { id, symbol, price, change24h, logo } = req.body;

    // Validate required fields
    if (!id || !symbol || price === undefined) {
      return res.status(400).json({ message: "Missing required fields: id, symbol, price" });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if coin already exists
    if (user.portfolio.find(c => c.id === id)) {
      return res.status(400).json({ message: "Coin already in portfolio" });
    }

    // Add coin to portfolio including logo
    user.portfolio.push({ 
      id, 
      symbol, 
      price: Number(price), // Ensure it's a number
      change24h: Number(change24h) || 0,
      logo: logo || "" // Save logo URL if provided
    });
    
    await user.save();
    
    console.log("✅ Coin added successfully");
    res.json(user.portfolio);
  } catch (err) {
    console.error("❌ Error in addCoin:", err);
    res.status(500).json({ 
      message: "Server error", 
      error: err.message // Send error details for debugging
    });
  }
};

// Remove coin
export const removeCoin = async (req, res) => {
  try {
    const { coinId } = req.params;
    console.log("Removing coin:", coinId); // Debug log
    
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.portfolio = user.portfolio.filter(c => c.id !== coinId);
    await user.save();
    
    res.json(user.portfolio);
  } catch (err) {
    console.error("Remove coin error:", err);
    res.status(500).json({ message: "Server error" });
  }
};