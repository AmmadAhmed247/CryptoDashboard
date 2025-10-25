import React, { useState } from "react";
import { createPortal } from "react-dom";
import { Wallet, Coins, X, Facebook, Twitter, Apple, Chrome } from "lucide-react";

const Login = ({ onClose }) => {
  const [isLogin, setIsLogin] = useState(true);

  const modalContent = (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[9999]">
      <div className="bg-zinc-800 w-[380px] rounded-2xl shadow-2xl p-6 text-white relative">
        {/* Close button */}
        <button
          onClick={onClose} 
          className="absolute top-4 right-4 text-zinc-400 hover:text-white transition"
        >
          <X size={22} />
        </button>

        {/* Tabs */}
        <div className="flex justify-center mb-6 border-b border-zinc-700">
          <button
            onClick={() => setIsLogin(true)}
            className={`pb-2 mx-4 text-lg font-medium transition ${
              isLogin ? "text-[#d0b345] border-b-2 border-[#d0b345]" : "text-zinc-400"
            }`}
          >
            Log In
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`pb-2 mx-4 text-lg font-medium transition ${
              !isLogin ? "text-[#d0b345] border-b-2 border-[#d0b345]" : "text-zinc-400"
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Conditional Username field for Sign Up */}
        {!isLogin && (
          <div className="mb-4">
            <label className="block text-sm text-zinc-400 mb-1">Username</label>
            <input
              type="text"
              placeholder="Choose a username"
              className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#d0b345]"
            />
          </div>
        )}

        {/* Email field */}
        <div className="mb-4">
          <label className="block text-sm text-zinc-400 mb-1">Email</label>
          <input
            type="email"
            placeholder="user@mail.com"
            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#d0b345]"
          />
        </div>

        {/* Password field */}
        <div className="mb-4">
          <label className="block text-sm text-zinc-400 mb-1">Password</label>
          <input
            type="password"
            placeholder={isLogin ? "Enter password" : "Create password"}
            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#d0b345]"
          />
        </div>

        {/* Confirm Password for Sign Up */}
        
        {/* Forgot Password for Login */}
        {isLogin && (
          <div className="text-right mb-4">
            <button className="text-xs text-[#d0b345] hover:underline">
              Forgot Password?
            </button>
          </div>
        )}

        {/* Continue button with dynamic text */}
        <button className="w-full py-2.5 bg-[#d0b345] hover:bg-[#c0a63e] text-zinc-900 font-semibold rounded-lg transition">
          {isLogin ? "Log In" : "Create Account"}
        </button>

        {/* Divider */}
        <div className="flex items-center my-5">
          <div className="flex-grow border-t border-zinc-700"></div>
          <span className="mx-3 text-xs text-zinc-500">OR</span>
          <div className="flex-grow border-t border-zinc-700"></div>
        </div>

        {/* Socials */}
        <div className="flex justify-center gap-5 mt-5">
          <Chrome className="text-zinc-400 hover:text-[#d0b345] cursor-pointer transition" size={20} />
          <Twitter className="text-zinc-400 hover:text-[#d0b345] cursor-pointer transition" size={20} />
          <Facebook className="text-zinc-400 hover:text-[#d0b345] cursor-pointer transition" size={20} />
        </div>

        {/* Footer with dynamic text */}
        <p className="text-[11px] text-zinc-500 mt-5 text-center leading-snug">
          {isLogin ? (
            <>
              Don't have an account?{" "}
              <span 
                onClick={() => setIsLogin(false)}
                className="text-[#d0b345] cursor-pointer hover:underline font-semibold"
              >
                Sign Up
              </span>
            </>
          ) : (
            <>
              By signing up, you agree to our{" "}
              <span className="text-[#d0b345] cursor-pointer hover:underline">
                Terms
              </span>{" "}
              and{" "}
              <span className="text-[#d0b345] cursor-pointer hover:underline">
                Privacy Policy
              </span>
            </>
          )}
        </p>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default Login;