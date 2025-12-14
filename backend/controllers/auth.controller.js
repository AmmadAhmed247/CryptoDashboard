import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import User from "../models/user.model.js"

const JWT_SECRET=process.env.JWT_SECRET

//signup
export const register=async (req , res) => {
    try{
        const{email,name,password}=req.body;
        if(!email || !name || !password){
            return res.status(400).json({message:"All fields are required"});
        }
        const existingUser=await User.findOne({email});
        if(existingUser){
            return res.status(400).json({message:"User already exist"});
        }
        const hashPassword=await bcrypt.hash(password,10);
        const user=await User.create({
            name,email,password:hashPassword
        });
        const token=jwt.sign({id:user._id},JWT_SECRET,{expiresIn:'7d'});
        res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    })
    res.status(201).json({
        message:"User Registered Successfully",
        user:{
            id:user._id,
            name:user.name,
            email:user.email,
            buyStatus:user.buyStatus,
        }
    });


    }catch(error){
        console.error("Signup Error",error);
        res.status(500).json({message:"Server error during signup"});
    }
}

export const login=async (req , res) => {
    try {
        const {email,password}=req.body;
        if(!email || !password){
            return res.status(400).json({message:"All fields are required"});
        }
        const user=await User.findOne({email});
        if(!user){
            return res.status(400).json({message:"Invalid email or password"})
        }

        const isMatch=await bcrypt.compare(password , user.password);
        if(!isMatch){
            return res.status(400).json({message:"Invalude email or password"});
        }
        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" });
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.status(200).json({
        message:"Login Successfully",
        user:{
            id:user._id,
            name:user.name,
            email:user.email,
            buyStatus:user.buyStatus,
        }
    })
    } catch (error) {
        console.error("Login Error",error);
        res.status(500).json({message:"Server error during login"})
    }
}

export const logout=async (req , res) => {
    res.clearCookie("token");
    res.status(200).json({message:"Logout Successfully"})
}

export const getCurrentUser = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: "Not authenticated" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    res.json({ user });
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};


export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ message: "No account found with that email" });

    // Generate reset token valid for 15 minutes
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "15m" });

    const resetLink = `${process.env.CLIENT_URL}/reset-password/${token}`;

    await sendEmail(
      email,
      "Password Reset Request",
      `<p>Hi ${user.name || ""},</p>
      <p>Click <a href="${resetLink}">here</a> to reset your password. This link expires in 15 minutes.</p>`
    );

    res.json({ message: "Password reset link sent to your email." });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ message: "Something went wrong while sending the email." });
  }
};

export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.findByIdAndUpdate(decoded.id, { password: hashedPassword });

    res.json({ message: "Password reset successful!" });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(400).json({ message: "Invalid or expired reset token." });
  }
};