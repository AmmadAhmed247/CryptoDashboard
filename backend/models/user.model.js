import mongoose from "mongoose";

const coinSchema = new mongoose.Schema({
  id: { type: String, required: true, trim: true },
  symbol: { type: String, required: true, trim: true },
  price: { type: Number, required: true },
  change24h: { type: Number, required: true },
  logo: { type: String, default: "" } 
}, { _id: false });


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    buyStatus: {
        type: Boolean,
        default: false
    },
    portfolio: {
        type: [coinSchema], 
        default: []
    }
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

export default User;
